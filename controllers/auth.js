const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJwt');
const { googleVerify } = require('../helpers/googleVerify');


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

const googleSignIn = async (req = request, res = response) => {

  try {

    const { id_token } = req.body;

    const { email, name, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ email });

    // Crear usuario si no existe en BD
    if (!usuario) {
      const data = {
        name,
        email,
        password: ':P',
        img,
        google: true
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario no está activo en la BD
    if (!usuario.state) {
      return res.status(401).json({
        msg: 'Usuario bloqueado. Hable con el administrador'
      });
    }

    // Generar JWT
    const jwt = await generarJWT(usuario.id);

    res.json({
      msg: 'Google Sign In exitoso',
      usuario,
      jwt
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'No se pudo verificar el Token - Google Token: ID_TOKEN'
    })
  }

};


module.exports = {
  login,
  googleSignIn
};