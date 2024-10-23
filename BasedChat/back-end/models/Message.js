const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // Se houver um modelo separado para gerenciar chats (grupos ou individuais)
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'audio'],
    default: 'text'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reaction: { type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'] }
  }],
  attachments: {
    type: [{
      filename: String,
      url: String,
      type: { type: String, enum: ['image', 'video', 'file', 'audio'] }
    }],
    default: []
  }
}, {
  timestamps: true // Inclui `createdAt` e `updatedAt` automaticamente
});

// Exportar o modelo Message
module.exports = mongoose.model('Message', MessageSchema);
