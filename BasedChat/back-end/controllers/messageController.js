// controllers/messageController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    let message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });
    await message.save();
    res.status(201).json({ message: 'Mensagem enviada com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao enviar mensagem', error: err });
  }
};

exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    let messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao obter mensagens', error: err });
  }
};
