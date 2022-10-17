const { request, response } = require('express');

const userGet = (req = request, res = response) => {

  const { qlq = 'no sé', nojoa = 'fresas' } = req.query;

  res.json({
    msg: 'get API - controlador',
    nojoa,
    qlq
  });
};

const userPost = (req = request, res = response) => {

  const { nombre, edad } = req.body;

  res.json({
    msg: 'post API - controlador',
    nombre,
    edad,
    saludo: `Hola, mi nombre es ${nombre} y tengo ${edad} años de edad`
  });

};

const userPut = (req = request, res = response) => {

  const { id } = req.params;

  res.status(500).json({
    msg: 'put API - controlador',
    id
  });
};

const userPatch = (req, res) => {
  res.json({
    msg: 'patch API - controlador'
  });
};

const userDelete = (req, res) => {
  res.json({
    msg: 'delete API - controlador'
  });
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userPatch,
  userDelete
};