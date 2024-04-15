const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    username: String,
    content: String,
    date: { type: Date, default: Date.now }
  });
  
const FormularioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: { 
        data: {
          type: Buffer,
          required: false
        },
        contentType: {
          type: String,
          required: false
        }},
    username: {type:String,
                required:true
    },
    status: {
        type: String,
        enum: ['en espera', 'aprobado', 'denegado'],
        default: 'en espera'
    },
    comments: [CommentSchema]
});

module.exports = mongoose.model('Formulario', FormularioSchema);
