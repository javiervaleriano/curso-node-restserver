const { Router } = require('express');
const { check, query } = require('express-validator');
const { userGet, userPost, userPut, userDelete } = require('../controllers/user');
const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/dbValidators');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();


const optionalObj = { checkFalsy: true, nullable: true };

router.get('/', [
  query('limite', 'El límite debe ser un número')
    .isNumeric()
    .optional(optionalObj),
  query('desde', 'El parámetro "desde" debe ser un número')
    .isNumeric()
    .optional(optionalObj),
  validarCampos
], userGet);

router.post('/', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'No es un correo válido').isEmail(),
  check('email').custom(existeEmail),
  check('password', 'La contraseña debe ser de al menos 6 caracteres').isLength({ min: 6 }),
  // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom(esRoleValido),
  validarCampos
], userPost);

router.put('/:id', [
  check('id', 'El ID no es válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('role').custom(esRoleValido),
  validarCampos
], userPut);

router.delete('/:id', [
  check('id', 'El ID no es válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], userDelete);

module.exports = router;