// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // Permitir a origem do frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Se for necessário enviar cookies ou credenciais
}));
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/basedchatdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB', err));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/uploads', express.static(uploadDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
