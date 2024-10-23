// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/friends', auth, userController.getFriends);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/friends', auth, userController.getFriends);
router.post('/add-friend', auth, userController.addFriend);

module.exports = router;
