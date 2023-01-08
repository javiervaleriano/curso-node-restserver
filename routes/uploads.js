const { Router } = require('express');
const { check, param } = require('express-validator');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivo } = require('../middlewares');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.get('/:coleccion/:id', [
  check('id', 'El id debe ser de Mongo').isMongoId(),
  param('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], mostrarImagen);

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
  validarArchivo,
  check('id', 'El id debe ser de Mongo').isMongoId(),
  param('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

module.exports = router;