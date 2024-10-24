const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adiciona campos createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Chat', ChatSchema);
