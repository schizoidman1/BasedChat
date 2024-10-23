const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Enviar uma nova mensagem
exports.sendMessage = async (req, res) => {
  const { chatId, content, type, attachments } = req.body;
  const senderId = req.user.id; // Obtido via middleware de autenticação

  try {
    // Criar uma nova mensagem com os campos apropriados
    const newMessage = new Message({
      chatId,
      sender: senderId,
      content,
      type: type || 'text', // Se não for especificado, assumimos texto
      attachments,
    });

    // Salvar a mensagem no banco de dados
    await newMessage.save();

    // Emitir evento via WebSocket para os membros do chat (se aplicável)
    // Em uma implementação com Socket.IO, o código seria algo como:
    // io.to(chatId).emit('newMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar mensagem', error: err });
  }
};

// Obter mensagens de um chat com paginação
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  try {
    // Buscar mensagens do chat, ordenadas por data de criação (decrescente)
    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'username avatar') // Para mostrar quem enviou a mensagem
      .exec();

    res.status(200).json(messages.reverse()); // Revertendo para enviar em ordem crescente
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter mensagens', error: err });
  }
};

// Atualizar o status da mensagem (ex.: 'delivered' ou 'read')
exports.updateMessageStatus = async (req, res) => {
  const { messageId } = req.params;
  const { status } = req.body;

  if (!['delivered', 'read'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' });
  }

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar status da mensagem', error: err });
  }
};
