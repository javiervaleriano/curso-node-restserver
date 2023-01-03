const { Router } = require('express');
const { check, query, param, body } = require('express-validator');
const { obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto } = require('../controllers');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/dbValidators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/*
* {{url}}/api/productos
*/

const optionalObj = { checkFalsy: true, nullable: true };

router.get('/', [
  query('limite', 'El límite debe ser un número')
    .isNumeric().optional(optionalObj),
  query('desde', 'El parámetro "desde" debe ser un número')
    .isNumeric().optional(optionalObj),
  validarCampos
], obtenerProductos);


router.get('/:id', [
  param('id', 'El ID no es válido').isMongoId(),
  param('id').custom(existeProductoPorId),
  validarCampos
], obtenerProducto);


router.post('/', [
  validarJWT,
  check('name', 'El nombre es obligatorio').notEmpty(),
  body('price', 'El precio debe ser un valor numérico')
    .isNumeric().optional(optionalObj),
  body('category', 'La categoría no es un ID de Mongo válido').isMongoId(),
  body('category').custom(existeCategoriaPorId),
  validarCampos
], crearProducto);


router.put('/:id', [
  validarJWT,
  param('id', 'El ID no es válido').isMongoId(),
  param('id').custom(existeProductoPorId),
  validarCampos
], actualizarProducto);


router.delete('/:id', [
  validarJWT,
  esAdminRole,
  param('id', 'El ID no es válido').isMongoId(),
  param('id').custom(existeProductoPorId),
  validarCampos
], borrarProducto);


module.exports = router;