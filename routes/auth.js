const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();


router.post('/login', [
  check('email', 'El correo es obligatorio').notEmpty(),
  check('email', 'El correo no es válido').isEmail(),
  check('password', 'La contraseña es obligatoria').notEmpty(),
  validarCampos
], login);

router.post('/google', [
  check('id_token', 'El Token de Google es obligatorio').notEmpty(),
  validarCampos
], googleSignIn);


module.exports = router;