const { Categoria, Role, Usuario, Producto } = require('../models');

/*
* Roles
*/
const esRoleValido = async (role = '') => {
  const existeRole = await Role.findOne({ role });

  if (!existeRole) {
    throw new Error(`El rol ${role} no está registrado en la BD`);
  }
};

/*
* Usuarios
*/
const existeEmail = async (email = '') => {
  const existeEmail = await Usuario.findOne({ email });

  if (existeEmail) {
    throw new Error(`El correo ${email} ya existe`);
  }
};

const existeUsuarioPorId = async (id = '') => {
  const existeUsuario = await Usuario.findById(id);

  if (!existeUsuario) {
    throw new Error(`El ID no existe: ${id}`);
  }
};

/*
* Categorías
*/
const existeCategoriaPorId = async (id = '') => {

  const existeCategoria = id.match(/^[0-9a-fA-F]{24}$/) && await Categoria.findById(id);

  if (!existeCategoria) {
    throw new Error(`La categoría que buscas por el ID: ${id}, no existe`);
  }

};

/*
* Productos
*/
const existeProductoPorId = async (id = '') => {
  const existeProducto = id.match(/^[0-9a-fA-F]{24}$/) && await Producto.findById(id);

  if (!existeProducto) {
    throw new Error(`El producto que buscas por el ID: ${id}, no existe`);
  }
};


module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
};