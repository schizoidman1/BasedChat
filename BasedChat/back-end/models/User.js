const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Melhor prática: Número recomendado de rounds para bcrypt (entre 10 e 12)
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um email válido.']
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatar: {
    type: String
  },
  status: {
    type: String,
    default: 'Disponível',
    maxlength: 100
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  phoneNumber: {
    type: String,
    match: [/^\+[1-9]\d{1,14}$/, 'Por favor, insira um número de telefone válido.'], // Formato E.164
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
}, {
  timestamps: true // Adiciona `createdAt` e `updatedAt` automaticamente
});

/*// Hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});*/

// Método para verificar a senha
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
