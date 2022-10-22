const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const userGet = async (req = request, res = response) => {

  const { limite = 5, desde = 0 } = req.query;
  const queryFilter = { state: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(queryFilter),
    Usuario.find(queryFilter)
      .skip(desde)
      .limit(parseInt(limite))
  ]);

  res.json({
    total,
    usuarios
  });

};

const userPost = async (req = request, res = response) => {

  const { name, email, password, role } = req.body;
  const usuario = new Usuario({ name, email, password, role });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en la BD
  await usuario.save();

  res.json(usuario);

};

const userPut = async (req = request, res = response) => {

  const { id } = req.params;
  const { _id, password, google, ...rest } = req.body;

  // Verificar contra la BD que el ID exista
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, rest, { new: true });

  res.json(usuario);
};

const userDelete = async (req = request, res = response) => {

  const { id } = req.params;

  // Borrar físicamente al usuario
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { state: false });

  res.json(usuario);

};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete
};