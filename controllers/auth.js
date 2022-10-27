const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJwt');


const login = async (req = request, res = response) => {

  const { email, password } = req.body;

  try {

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - (email)'
      });
    }

    // Si el usuario está activo
    if (!usuario.state) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - state: false'
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      });
    }

    // Generar el JWT
    const jwt = await generarJWT(usuario.id);


    res.json({
      usuario,
      jwt
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Algo salió mal. Por favor, comuníquese con el administrador'
    });
  }

};


module.exports = {
  login
};