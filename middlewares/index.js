const validarArchivo = require('./validarArchivo');
const validarCampos = require('./validarCampos');
const validarJWT = require('./validarJwt');
const validarRoles = require('./validarRoles');

module.exports = {
  ...validarArchivo,
  ...validarCampos,
  ...validarJWT,
  ...validarRoles
};