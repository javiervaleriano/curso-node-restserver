const { googleSignIn, login } = require('./auth');
const { buscar } = require('./buscar');
const { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } = require('./categories');
const { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } = require('./products');
const { userDelete, userGet, userPost, userPut } = require('./user');

module.exports = {
  googleSignIn,
  login,
  buscar,
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
  userDelete,
  userGet,
  userPost,
  userPut,
};