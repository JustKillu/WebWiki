const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer'); 
const fs = require('fs'); 
const WikiEntry = require('../models/WikiEntry.js'); 
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/entry', upload.single('image'), body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, content } = req.body;
  let image = '';
  if (req.file) {
    image = {
      data: fs.readFileSync(req.file.path),
      contentType: 'image/png'
    };
  }

  const entry = new WikiEntry({ title, content, image }); 
  await entry.save();
  res.status(201).json({ success: 'Entrada creada exitosamente!', entry });
});

router.get('/entries', async (req, res) => {
  let entries = await WikiEntry.find({});
  entries = entries.map(entry => {
    if (entry.image.data) {
      const img = Buffer.from(entry.image.data).toString('base64');
      entry.image = `data:${entry.image.contentType};base64,${img}`;
    }
    return entry;
  });
  res.json(entries);
});


router.get('/entry/:id', async (req, res) => {
  const { id } = req.params;
  const entry = await WikiEntry.findById(id);
  if (!entry) {
    return res.status(404).json({ error: 'Entrada no encontrada' });
  }
  if (entry.image.data) {
    const img = Buffer.from(entry.image.data).toString('base64');
    entry.image = `data:${entry.image.contentType};base64,${img}`;
  }

  res.json(entry);
});


router.put('/entry/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  let image = '';
  if (req.file) {
    image = {
      data: fs.readFileSync(req.file.path),
      contentType: 'image/png'
    };
  }

  const entry = await WikiEntry.findByIdAndUpdate(id, { title, content, image }, { new: true });
  if (!entry) {
    return res.status(404).json({ error: 'Entrada no encontrada' });
  }
  res.json(entry);
});


router.delete('/entry/:id', async (req, res) => {
  const { id } = req.params;
  const entry = await WikiEntry.findByIdAndDelete(id);
  if (!entry) {
    return res.status(404).json({ error: 'Entrada no encontrada' });
  }
  res.json({ success: 'Entrada eliminada exitosamente!' });
});

router.post('/entry/:id/comment',
  body('username').isLength({ min: 1 }),
  body('content').isLength({ min: 1 }),
  async (req, res) => {
    const { id } = req.params;
    const { username, content } = req.body;
    const entry = await WikiEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    entry.comments.push({ username, content });
    await entry.save();
    res.json(entry);
  }
);

router.delete('/entry/:id/comment/:commentId', async (req, res) => {
  const { id, commentId } = req.params;
  const entry = await WikiEntry.findById(id);
  if (!entry) {
    return res.status(404).json({ error: 'Entrada no encontrada' });
  }
  entry.comments.id(commentId).remove();
  await entry.save();
  res.json(entry);
});

module.exports = router;
