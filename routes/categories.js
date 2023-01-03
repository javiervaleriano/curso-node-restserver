const { Router } = require('express');
const { check, query, param, body } = require('express-validator');
const { crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria } = require('../controllers');
const { existeCategoriaPorId } = require('../helpers/dbValidators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/*
* {{url}}/api/categorias
*/

const optionalObj = { checkFalsy: true, nullable: true };

router.get('/', [
  query('limite', 'El límite debe ser un número')
    .isNumeric().optional(optionalObj),
  query('desde', 'El parámetro "desde" debe ser un número')
    .isNumeric().optional(optionalObj),
  validarCampos
], obtenerCategorias);


router.get('/:id', [
  param('id', 'El ID no es válido').isMongoId(),
  param('id').custom(existeCategoriaPorId),
  validarCampos
], obtenerCategoria);


router.post('/', [
  validarJWT,
  check('name', 'El nombre es obligatorio').notEmpty(),
  validarCampos
], crearCategoria);


router.put('/:id', [
  validarJWT,
  param('id', 'El ID no es válido').isMongoId(),
  param('id').custom(existeCategoriaPorId),
  body('name', 'El nombre es obligatorio').notEmpty(),
  validarCampos
], actualizarCategoria);


router.delete('/:id', [
  validarJWT,
  esAdminRole,
  param('id', 'El ID no es válido').isMongoId(),
  param('id').custom(existeCategoriaPorId),
  validarCampos
], borrarCategoria);


module.exports = router;