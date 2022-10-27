const validarCampos = require('./validarCampos');
const validarJWT = require('./validarJwt');
const validarRoles = require('./validarRoles');

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validarRoles
};