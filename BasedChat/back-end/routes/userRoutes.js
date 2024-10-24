const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const upload = require('../middlewares/upload');

router.get('/friends', auth, async (req, res) => {
  try {
    if (!req.userId) {
      console.error('Erro: userId não encontrado na requisição.');
      return res.status(401).send({ message: 'Usuário não autenticado.' });
    }

    const user = await User.findById(req.userId).populate('friends');
    if (!user) {
      console.error('Erro: Usuário não encontrado com o ID:', req.userId);
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    console.log('Amigos encontrados:', user.friends);
    res.status(200).send(user.friends);

  } catch (error) {
    console.error('Erro ao obter amigos:', error);
    res.status(500).send({ message: 'Erro ao obter amigos.', error });
  }
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/add-friend', auth, userController.addFriend);

// Rota para fazer upload da imagem de perfil
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'Nenhum arquivo enviado.' });
    }

    // Atualizar o avatar do usuário
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    user.avatar = `uploads/${req.file.filename}`;
    await user.save();

    res.status(200).send({ message: 'Avatar atualizado com sucesso!', avatar: user.avatar });
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    res.status(500).send({ message: 'Erro ao fazer upload do avatar.', error });
  }
});

module.exports = router;
