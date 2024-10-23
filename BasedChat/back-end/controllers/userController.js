// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  try {
    // Criar um novo usuário
    let newUser = new User({
      username,
      email,
      phoneNumber,
      passwordHash: password, // O hash será gerado no middleware do schema
    });

    // Salvar no banco de dados
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao registrar usuário', error });
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
    let user = await User.findById(req.user.id).populate('friends', 'username avatar status');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(user.friends);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter amigos', error: err });
  }
};


exports.addFriend = async (req, res) => {
  try {
    const userId = req.user.id; // O ID do usuário autenticado
    const { friendUsername } = req.body;

    // Encontrar o usuário atual
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Encontrar o amigo pelo username
    let friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ message: 'Amigo não encontrado' });
    }

    // Verificar se já são amigos
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Este usuário já está na sua lista de amigos' });
    }

    // Adicionar amigo a lista de amigos
    user.friends.push(friend._id);

    // Opcional: Adicionar o usuário à lista de amigos do amigo também (amizade bidirecional)
    friend.friends.push(user._id);

    // Salvar as alterações
    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Amigo adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar amigo', error: err });
  }
};
