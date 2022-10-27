const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    });
  }

  try {

    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    // Leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    // Verificar que el uid exista en la BD
    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - el uid no existe en la BD'
      });
    }

    // Verificar si el uid está habilitado (state: true)
    if (!usuario.state) {
      return res.status(401).json({
        msg: 'Token no válido - state: false'
      });
    }

    req.usuario = usuario;

    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido'
    });
  }

};

module.exports = {
  validarJWT
};