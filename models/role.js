const { Schema, model } = require('mongoose');

const ROLE_SCHEMA = Schema({
  "role": {
    type: String,
    required: [true, 'El rol es obligatorio']
  }
});

module.exports = model('Role', ROLE_SCHEMA);