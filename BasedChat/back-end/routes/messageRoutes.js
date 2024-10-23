const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

// Enviar nova mensagem
router.post('/send', auth, messageController.sendMessage);

// Obter mensagens de um chat específico com paginação
router.get('/:chatId', auth, messageController.getMessages);

// Atualizar status de uma mensagem (por exemplo, 'read')
router.patch('/status/:messageId', auth, messageController.updateMessageStatus);

module.exports = router;
