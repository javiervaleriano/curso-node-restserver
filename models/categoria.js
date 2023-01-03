const { Schema, model } = require('mongoose');

const CATEGORIA_SCHEMA = Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  }
});

CATEGORIA_SCHEMA.methods.toJSON = function () {
  const { __v, ...categoria } = this.toObject();

  if (categoria.user._id) {
    categoria.user.uid = categoria.user._id;
    delete categoria.user._id;
  }

  return { ...categoria };
}


module.exports = model('Categoria', CATEGORIA_SCHEMA);