// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).send({ message: 'Nome de usuário, senha e e-mail são obrigatórios.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: 'Nome de usuário já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword, // Usando o campo `password`
      email,
    });

    await newUser.save();
    res.status(201).send({ message: 'Usuário registrado com sucesso.' });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).send({ message: 'Erro ao registrar usuário.', error });
  }
};



exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send({ message: 'Nome de usuário e senha são obrigatórios.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    // Verificar a senha com bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Campo `password`
    
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ userId: user._id }, 'sua_chave_secreta', { expiresIn: '1h' });
    res.status(200).send({ token });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).send({ message: 'Erro ao fazer login.', error });
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
