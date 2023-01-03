const { request, response } = require('express');
const Producto = require('../models/producto');

const obtenerProductos = async (req = request, res = response) => {

  const { desde = 0, limite = 5 } = req.query;
  const query = { state: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(desde)
      .limit(limite)
  ]);

  res.json({
    total,
    productos,
  });

};


const obtenerProducto = async (req = request, res = response) => {

  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.json(producto);

};


const crearProducto = async (req = request, res = response) => {

  let { state, user, name, ...body } = req.body;

  name = name.toUpperCase();

  const productoDB = await Producto.findOne({ name });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.name} ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    user: req.usuario._id,
    name,
    ...body,
  };

  const producto = new Producto(data);

  await producto.save();

  res.status(201).json(producto);

};


const actualizarProducto = async (req = request, res = response) => {

  const { id } = req.params;

  const { state, user, ...data } = req.body;

  data.user = req.usuario._id;
  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  const existeProducto = await Producto.findOne({ name: data.name });
  if (existeProducto && id !== existeProducto.id) {
    return res.status(400).json({
      msg: `Ya existe un producto con el nombre ${existeProducto.name}`
    });
  }

  const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true })
    .populate('user', 'name')
    .populate('category', 'name');

  res.json({
    msg: 'Producto actualizado',
    productoActualizado,
  });

};


const borrarProducto = async (req = request, res = response) => {

  const { id } = req.params;

  const productoBorrado = await Producto.findByIdAndUpdate(id, { state: false }, { new: true })
    .populate('user', 'name')
    .populate('category', 'name');

  res.json({
    msg: 'Producto borrado',
    productoBorrado,
  });

};


module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};