const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  if (!authHeader) return res.status(401).json({ message: 'Acesso negado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, 'sua_chave_secreta');
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    res.status(400).json({ message: 'Token inválido' });
  }
};
