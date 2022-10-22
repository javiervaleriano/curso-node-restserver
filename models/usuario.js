const { Schema, model } = require('mongoose');

const USUARIO_SCHEMA = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  google: {
    type: Boolean,
    default: false
  },
  state: {
    type: Boolean,
    default: true
  }
});

USUARIO_SCHEMA.methods.toJSON = function () {
  const { __v, password, ...usuario } = this.toObject();
  return usuario;
}

module.exports = model('Usuario', USUARIO_SCHEMA);