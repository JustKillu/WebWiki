require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const wikiRoutes = require('./routes/wikiRoutes.js');

// Inicializar la aplicación Express
const app = express();

// Permitir solicitudes CORS desde tu aplicación React
app.use(cors());

// Usar express.json() como middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI);


app.use(authRoutes);
app.use(wikiRoutes);

app.listen(3001, () => console.log('Server is running on http://localhost:3001'));
