const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User.js'); 
const axios = require('axios');
const router = express.Router();

router.post('/register',
  body('username').isLength({ min: 1 }),
  body('password').isLength({ min: 1 }),
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }

    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ success: 'Registro exitoso!' });
  }
);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'usuario invalido o contraseña erronea' });
  }

  const token = jwt.sign({ id: user.id, rol: user.rol }, 'your_jwt_secret');
  res.json({ token, rol: user.rol }); 
});


router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(user);
});

router.get('/allusers', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, 'your_jwt_secret', async (err, user) => {
    if (err) return res.sendStatus(403); 

    const userDetails = await User.findById(user.id); 
    if (!userDetails) return res.sendStatus(404); 
    if (userDetails.rol !== 'adm') return res.status(403).json({ error: 'Acceso denegado' });
    const users = await User.find({});
    res.json(users);
  });
});

router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email,rol } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  user.username = username;
  user.email = email;
  user.rol = rol;
  await user.save();

  res.json({ success: 'Usuario actualizado con éxito!' });
});

router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  await User.deleteOne({ _id: id });

  res.json({ success: 'Usuario eliminado con éxito!' });
});

router.put('/user/:username/exp', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.exp += 1;
    await user.save();
    res.json({ message: 'Experiencia actualizada con éxito' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Ruta para obtener las preguntas del día
router.get('/user/:username/questions', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if (user.questionsToday >= 5) {
      return res.json({ questions: [] });
    }
    const questions = await axios.get('https://opentdb.com/api.php?amount=5&category=9&type=multiple');
    if (!questions.data.results) {
      return res.status(500).json({ message: 'No se pudieron obtener las preguntas de la API de trivia' });
    }
    res.json({ questions: questions.data.results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Ruta para incrementar el contador de preguntas del día
router.put('/user/:username/increment', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.questionsToday += 1;
    await user.save();
    res.json({ message: 'Contador de preguntas incrementado con éxito' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para resetear el contador de preguntas del día
router.put('/user/:username/reset', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    user.questionsToday = 0;
    await user.save();
    res.json({ message: 'Contador de preguntas reseteado con éxito' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener el valor actual de questionsToday
router.get('/user/:username/questionsToday', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ questionsToday: user.questionsToday });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;