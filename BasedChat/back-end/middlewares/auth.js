const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); // Log para verificar o cabeçalho de autorização

  if (!authHeader) {
    console.error('Token não fornecido.');
    return res.status(401).json({ message: 'Acesso negado, token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Token não encontrado no cabeçalho.');
    return res.status(401).json({ message: 'Token inválido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log para verificar se o token foi decodificado corretamente
    req.userId = decoded.userId; // Atribuir `userId` a partir do token decodificado
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    return res.status(400).json({ message: 'Token inválido' });
  }
};
