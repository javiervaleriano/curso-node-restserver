const { request, response } = require('express');
const Categoria = require('../models/categoria');

const obtenerCategorias = async (req = request, res = response) => {

  const { desde = 0, limite = 5 } = req.query;
  const query = { state: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate('user', 'name')
      .skip(desde)
      .limit(limite)
  ]);

  res.json({
    total,
    categorias,
  });

};


const obtenerCategoria = async (req = request, res = response) => {

  const { id } = req.params;

  const categoria = await Categoria.findById(id)
    .populate('user');

  res.json(categoria);

};


const crearCategoria = async (req = request, res = response) => {

  const name = req.body.name.toUpperCase();

  const categoriaDB = await Categoria.findOne({ name });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoría ${categoriaDB.name} ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    name,
    user: req.usuario._id,
  };

  const categoria = new Categoria(data);

  await categoria.save();

  res.status(201).json(categoria);

};


const actualizarCategoria = async (req = request, res = response) => {

  const { id } = req.params;

  const { state, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.usuario._id;

  const existeCategoria = await Categoria.findOne({ name: data.name });
  if (existeCategoria) {
    return res.status(400).json({
      msg: `Ya existe la categoría con el nombre ${existeCategoria.name}`
    });
  }

  const categoriaActualizada = await Categoria.findByIdAndUpdate(id, data, { new: true })
    .populate('user', 'name');

  res.json({
    msg: 'Categoría actualizada',
    categoriaActualizada,
  });

};


const borrarCategoria = async (req = request, res = response) => {

  const { id } = req.params;

  const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { state: false }, { new: true })
    .populate('user');

  res.json({
    msg: 'Categoría borrada',
    categoriaBorrada,
  });

};


module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
};