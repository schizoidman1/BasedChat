// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
