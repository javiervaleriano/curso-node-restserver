const { request, response } = require("express");

const esAdminRole = (req = request, res = response, next) => {

  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Se quiere validar el rol sin previa verificación del JWT'
    });
  }

  const { role, name } = req.usuario;

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} no es administrador - No puede hacer esto`
    });
  }

  next();

};

const tieneRoleValido = (...roles) => {

  return (req = request, res = response, next) => {

    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere validar el rol sin previa verificación del JWT'
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        msg: `Solo los roles ${roles} están permitidos`
      });
    }

    next();
  };

};

module.exports = {
  esAdminRole,
  tieneRoleValido
};