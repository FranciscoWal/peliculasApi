const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');

const app = express();

// Configuración de middlewares
app.use(express.json({ limit: '10mb' })); // Límite para JSON (Base64)
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cors());

// Conexión a MongoDB
const conectarDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://teamForge:9qXqaYyr0twKlIiB@peliculasbd.jbaqjnz.mongodb.net/peliculas?retryWrites=true&w=majority&appName=PeliculasBD'
    );
    console.log(`Base de datos conectada: ${conn.connection.name}`);
  } catch (error) {
    console.error('Error en la conexión a MongoDB:', error.message);
    process.exit(1);
  }
};

// Ejecutar la conexión
conectarDB();

// Rutas
const apiPeliculasRutas = require('./rutas/rutaPeliculas');
app.use('/api', apiPeliculasRutas);

// Manejador de error 404
app.use((req, res, next) => {
  next(createError(404, 'Ruta no encontrada'));
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

// Iniciar servidor
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('Error en el servidor:', error.message);
});