const { Schema, model } = require('mongoose');

const PRODUCTO_SCHEMA = Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
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
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
  description: { type: String },
  available: {
    type: Boolean,
    default: true,
  },
  img: { type: String },
});

PRODUCTO_SCHEMA.methods.toJSON = function () {
  const { __v, ...producto } = this.toObject();

  if (producto.user._id) {
    producto.user.uid = producto.user._id;
    delete producto.user._id;
  }

  return { ...producto };
}


module.exports = model('Producto', PRODUCTO_SCHEMA);