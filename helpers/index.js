const dbValidators = require('./dbValidators');
const generarKWT = require('./generarJwt');
const googleVerify = require('./googleVerify');
const subirArchivo = require('./subirArchivo');

module.exports = {
  ...dbValidators,
  ...generarKWT,
  ...googleVerify,
  ...subirArchivo,
};