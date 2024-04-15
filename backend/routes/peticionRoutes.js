const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' });
const Formulario = require('../models/peticion.js');
const { body, validationResult } = require('express-validator');

router.post('/formulario', upload.single('image'), async (req, res) => {
    const { title, content, username, status, imageData } = req.body;
    let image = '';

    if (req.file) {
        image = {
            data: fs.readFileSync(req.file.path),
            contentType: 'image/png'
        };
    } else if (imageData) {
       
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const dataBuffer = Buffer.from(base64Data, 'base64');

        image = {
            data: dataBuffer,
            contentType: 'image/png'
        };
    }
    
    const formulario = new Formulario({ title, content, image, username, status });

    try {
        await formulario.save();
        res.send('Formulario recibido y guardado en la base de datos');
    } catch (err) { 
        res.status(500).send('Hubo un error al guardar el formulario');
    }
});



router.put('/formulario/:id', upload.single('image'), async (req, res) => {
    const { title, content, status } = req.body;
    let image = '';
    if (req.file) {
        image = {
            data: fs.readFileSync(req.file.path),
            contentType: 'image/png'
        };
    }

    try {
        const formulario = await Formulario.findById(req.params.id);

        if (title) formulario.title = title;
        if (content) formulario.content = content;
        if (status) formulario.status = status;
        if (image) formulario.image = image;

        await formulario.save();

        res.send('Formulario actualizado con éxito');
    } catch (err) {
        res.status(500).send('Hubo un error al actualizar el formulario');
    }
});

router.delete('/formulario/:id', async (req, res) => {
    try {
        await Formulario.findByIdAndDelete(req.params.id);
        res.send('Formulario eliminado con éxito');
    } catch (err) {
        res.status(500).send('Hubo un error al eliminar el formulario');
    }
});


router.get('/formulario', async (req, res) => {
    try {
        let formularios = await Formulario.find({});
        formularios = formularios.map(formulario => {
            if (formulario.image.data) {
                const img = Buffer.from(formulario.image.data).toString('base64');
                formulario.image = `data:${formulario.image.contentType};base64,${img}`;
            }
            return formulario;
        });
        res.json(formularios);
        
    } catch (err) {
        res.status(500).send('Hubo un error al recuperar los formularios');
    }
});

router.get('/admin', async (req, res) => {
    try {
        let formularios = await Formulario.find({});
        formularios = formularios.map(formulario => {
            if (formulario.image.data) {
                const img = Buffer.from(formulario.image.data).toString('base64');
                formulario.image = `data:${formulario.image.contentType};base64,${img}`;
            }
            return formulario;
        });
        res.json(formularios);
    } catch (err) {
        console.error(err); 
        res.status(500).send('Hubo un error al recuperar los formularios');
    }
});

router.delete('/formulario/:id/comment/:commentId', async (req, res) => {
    const { id, commentId } = req.params;
    const entry = await Formulario.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    
    const commentIndex = entry.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex !== -1) {
      entry.comments.splice(commentIndex, 1);
      await entry.save();
    }
    
    res.json(entry);
  });

  router.post('/formulario/:id/comment',
  body('username').isLength({ min: 1 }),
  body('content').isLength({ min: 1 }),
  async (req, res) => {
    const { id } = req.params;
    const { username, content } = req.body;
    const entry = await Formulario.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    const date = new Date();
    entry.comments.push({ username, content, date });
    await entry.save();
    res.json(entry);
  }
);

router.get('/formulario/:id', async (req, res) => {
    const { id } = req.params;
    const entry = await Formulario.findById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }
    if (entry.image.data) {
      const img = Buffer.from(entry.image.data).toString('base64');
      entry.image = `data:${entry.image.contentType};base64,${img}`;
    }
  
    res.json(entry);
  });

module.exports = router;
