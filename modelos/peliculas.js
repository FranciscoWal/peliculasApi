// src/modelos.js
const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la película es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres'],
  },
  trailerLink: {
    type: String,
    required: [true, 'El link del tráiler es obligatorio'],
    trim: true,
  },
  poster: {
    type: String,
    required: [true, 'El poster en Base64 es obligatorio'],
    trim: true,
    validate: {
      validator: function (v) {
        return /^data:image\/[a-zA-Z]+;base64,/.test(v);
      },
      message: (props) => `${props.value} no es una cadena Base64 válida para una imagen`,
    },
  },
  genero: {
    type: [String],
    required: [true, 'El género es obligatorio'],
    enum: {
      values: [
        'Acción',
        'Aventura',
        'Comedia',
        'Drama',
        'Terror',
        'Ciencia Ficción',
        'Fantasía',
        'Romance',
        'Documental',
        'Animación',
      ],
      message: '{VALUE} no es un género válido',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);
module.exports = Pelicula;