const { request, response } = require('express');
const { Categoria, Producto, Usuario } = require('../models');
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
  'categorias',
  'productos',
  'roles',
  'usuarios',
],
  queryFilter = { state: true };


const buscarUsuarios = async (termino = '', res = response) => {

  if (!termino) {
    const [quantity, usuarios] = await Promise.all([
      Usuario.count(queryFilter),
      Usuario.find(queryFilter)
    ]);
    return res.json({
      quantity,
      results: usuarios
    });
  }

  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : []
    });
  }

  const regex = new RegExp(termino, 'i');
  const searchObj = {
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }]
  };

  const [quantity, usuarios] = await Promise.all([
    Usuario.count(searchObj),
    Usuario.find(searchObj)
  ]);

  res.json({
    quantity,
    results: usuarios
  });

};

const buscarCategorias = async (termino = '', res = response) => {

  if (!termino) {
    const [quantity, categorias] = await Promise.all([
      Categoria.count(queryFilter),
      Categoria.find(queryFilter)
    ]);
    return res.json({
      quantity,
      results: categorias
    });
  }

  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : []
    });
  }

  const regex = new RegExp(termino, 'i');
  const searchObj = { name: regex, state: true };

  const [quantity, categorias] = await Promise.all([
    Categoria.count(searchObj),
    Categoria.find(searchObj)
  ]);

  res.json({
    quantity,
    results: categorias
  });

};

const buscarProductos = async (termino = '', res = response) => {

  if (!termino) {
    const [quantity, productos] = await Promise.all([
      Producto.count(queryFilter),
      Producto.find(queryFilter)
        .populate('category', 'name')
    ]);
    return res.json({
      quantity,
      results: productos
    });
  }

  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const producto = await Producto.findById(termino)
      .populate('category', 'name');
    return res.json({
      results: producto ? [producto] : []
    });
  }

  const regex = new RegExp(termino, 'i');
  const searchObj = { name: regex, state: true };

  const [quantity, productos] = await Promise.all([
    Producto.count(searchObj)
      .populate('category', 'name'),
    Producto.find(searchObj)
      .populate('category', 'name')
  ]);

  res.json({
    quantity,
    results: productos
  });

};


const buscar = (req = request, res = response) => {

  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones que puedes buscar son: ${coleccionesPermitidas}`
    });
  }

  switch (coleccion) {
    case 'categorias':
      buscarCategorias(termino, res);
      break;
    case 'productos':
      buscarProductos(termino, res);
      break;
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;
    default:
      res.status(500).json({
        msg: 'Petición inhabilitada temporalmente'
      });
  }

};


module.exports = {
  buscar,
};