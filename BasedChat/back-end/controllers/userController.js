// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao registrar usuário', error: err });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id }, 'sua_chave_secreta', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao fazer login', error: err });
  }
};


exports.getFriends = async (req, res) => {
  try {
    let user = await User.findById(req.user.id).populate('friends');
    res.json(user.friends);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao obter amigos', error: err });
  }
};


exports.addFriend = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    let friend = await User.findOne({ username: req.body.username });
    if (!friend) return res.status(400).json({ message: 'Usuário não encontrado' });

    user.friends.push(friend._id);
    await user.save();
    res.json({ message: 'Amigo adicionado com sucesso' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao adicionar amigo', error: err });
  }
};
