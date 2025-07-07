const express = require('express');
const ruta = express.Router();
let Pelicula = require('../modelos/peliculas');


ruta.route('/add').post(async (req, res, next) => {
    try {
        if (req.body.poster && Buffer.byteLength(req.body.poster, 'utf8') > 10 * 1024 * 1024) {
            return next(new Error('La imagen en Base64 excede el límite de 10 MB'));
        }
        //Crear Pelicual (Dios)
        const pelicual = new Pelicula({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            trailerLink: req.body.trailerLink,
            poster: req.body.poster,
            genero: req.body.genero
        });
        const nuevaPelicula = await pelicual.save();
        res.status(201).json({
            message: 'Película registrada exitosamente',
            pelicula: nuevaPelicula,
        });
    } catch (err) {
        // Manejar errores de validación de Mongoose
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Errores de validación',
                details: Object.values(err.errors).map((err) => err.message),
            });
        }
        next(err);

    }
});

//Obtener todas las peliculas
ruta.route('/peliculas').get((req, res) => {
    Pelicula.find()
        .then((data) => {
            res.send(data)
        })
        .catch((error) => {
            console.log(error)
        })
});

ruta.route('/peliculas/:id').get((req,res)=>{
    Pelicula.findById(req.params.id)
    .then((data)=>{
        res.send(data);
    })
    .catch((error)=>{
        console.log(error)
    });
});

ruta.route('/editar/:id').put((req,res)=>{
    Pelicula.findByIdAndUpdate(req.params.id,{
        $set:req.body
    })
    .then((data)=>{
        console.log('Se actualizo correctamente: ')
    })
    .catch((error)=>{
        console.log(error)
    })
});

ruta.route('/eliminar/:id').delete((req,res)=>{
    Pelicula.findByIdAndDelete(req.params.id)
    .then((data)=>{
        res.send(data)
    })
    .catch((error)=>{
        console.log(error)
    })
});



// Ruta para visualizar el poster por ID
ruta.get('/peliculas/:id/poster', async (req, res, next) => {
    try {
        // Buscar la película por ID
        const pelicula = await Pelicula.findById(req.params.id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        // Extraer la cadena Base64 y el tipo de imagen
        const base64String = pelicula.poster;
        if (!base64String || !base64String.startsWith('data:image/')) {
            return res.status(400).json({ error: 'No se encontró una imagen válida en Base64' });
        }

        // Separar el prefijo (data:image/jpeg;base64,) de la parte Base64
        const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ error: 'Formato Base64 inválido' });
        }

        const imageType = matches[1]; // Ejemplo: jpeg, png
        const base64Data = matches[2]; // Datos Base64

        // Convertir Base64 a buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Enviar la imagen con el tipo de contenido correcto
        res.set('Content-Type', `image/${imageType}`);
        res.send(imageBuffer);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID inválido' });
        }
        next(error);
    }
});




module.exports = ruta