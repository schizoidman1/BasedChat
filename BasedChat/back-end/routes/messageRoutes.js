const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');
const Message = require('../models/Message');

// Enviar nova mensagem
router.post('/send', auth, messageController.sendMessage);

// Obter mensagens de um chat específico com paginação
router.get('/:chatId', auth, messageController.getMessages);

// Atualizar status de uma mensagem (por exemplo, 'read')
router.patch('/status/:messageId', auth, messageController.updateMessageStatus);

router.delete('/:messageId', auth, async (req, res) => {
  const { messageId } = req.params;

  try {
    console.log(`Tentando deletar a mensagem com ID: ${messageId}`);
    console.log('req.userId:', req.userId); // Adicionar este log para verificar o userId da requisição

    // Buscar a mensagem pelo ID e popular o sender
    const message = await Message.findById(messageId).populate('sender');
    if (!message) {
      console.error(`Mensagem com ID ${messageId} não encontrada.`);
      return res.status(404).send({ message: 'Mensagem não encontrada.' });
    }

    console.log('Message Sender ID:', message.sender ? message.sender._id.toString() : 'Sender não encontrado');
    console.log('User ID trying to delete:', req.userId);

    // Verificar se o usuário que está fazendo a solicitação é o remetente da mensagem
    if (message.sender._id.toString() !== req.userId) {
      console.error(`Usuário não autorizado a deletar esta mensagem. UserID: ${req.userId}`);
      return res.status(403).send({ message: 'Usuário não autorizado a deletar esta mensagem.' });
    }

    // Deletar a mensagem
    await Message.findByIdAndDelete(messageId);
    console.log(`Mensagem com ID ${messageId} deletada com sucesso.`);
    res.status(200).send({ message: 'Mensagem deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).send({ message: 'Erro ao deletar mensagem.', error });
  }
});



// Rota para atualizar uma mensagem pelo seu ID
router.put('/:messageId', auth, async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body; // Conteúdo atualizado da mensagem

  try {
    console.log(`Tentando atualizar a mensagem com ID: ${messageId}`);
    const message = await Message.findById(messageId);
    if (!message) {
      console.error(`Mensagem com ID ${messageId} não encontrada.`);
      return res.status(404).send({ message: 'Mensagem não encontrada.' });
    }

    // Verificar se o usuário que está fazendo a solicitação é o remetente da mensagem
    if (message.sender.toString() !== req.userId) {
      console.error(`Usuário não autorizado a editar esta mensagem. UserID: ${req.userId}`);
      return res.status(403).send({ message: 'Usuário não autorizado a editar esta mensagem.' });
    }

    // Atualizar o conteúdo da mensagem
    message.content = content;
    await message.save();
    console.log(`Mensagem com ID ${messageId} atualizada com sucesso.`);
    res.status(200).send({ updatedMessage: message });
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error);
    res.status(500).send({ message: 'Erro ao atualizar mensagem.', error });
  }
});
  


module.exports = router;
