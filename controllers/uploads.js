const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { subirArchivo } = require('../helpers');
const { Producto, Usuario } = require('../models');


const mostrarImagen = async (req = request, res = response) => {

  const { coleccion, id } = req.params;
  const noImgPath = path.join(__dirname, '../assets/no-image.jpg');

  let modelo = undefined;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) return res.sendFile(noImgPath);

      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) return res.sendFile(noImgPath);

      break;

    default:
      return res.status(500).json({
        msg: 'Colección sin validar por el momento. Disculpe las molestias.'
      });
  }

  if (modelo.img) {
    const actualImagenPath = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(actualImagenPath)) return res.sendFile(actualImagenPath);
  }

  res.sendFile(noImgPath);

};

const cargarArchivo = async (req = request, res = response) => {

  try {
    // Imágenes
    const nombre = await subirArchivo(req.files, undefined, 'imgs');

    // Textos
    // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');

    res.json({ nombre });

  } catch ({ status, err }) {
    res.status(status).json({ err });
  }

};

const actualizarImagen = async (req = request, res = response) => {

  const { coleccion, id } = req.params;

  let modelo = undefined;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el usuario con el id ${id}`
        });
      }

      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el producto con el id ${id}`
        });
      }

      break;

    default:
      return res.status(500).json({
        msg: 'Colección sin validar por el momento. Disculpe las molestias.'
      });
  }

  // Limpieza de imágenes previas
  if (modelo.img) {
    const actualImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(actualImagen)) fs.unlinkSync(actualImagen);
  }

  modelo.img = await subirArchivo(req.files, undefined, coleccion);
  await modelo.save();

  res.json(modelo);

};

const actualizarImagenCloudinary = async (req = request, res = response) => {

  const { coleccion, id } = req.params;

  let modelo = undefined;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el usuario con el id ${id}`
        });
      }

      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe el producto con el id ${id}`
        });
      }

      break;

    default:
      return res.status(500).json({
        msg: 'Colección sin validar por el momento. Disculpe las molestias.'
      });
  }

  // Limpieza de imágenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split('/'),
      nombre = nombreArr[nombreArr.length - 1].split('.'),
      [publicId] = nombre;

    cloudinary.uploader.destroy(`RestServer-NodeJS/${coleccion}/${publicId}`);
  }

  try {
    const { tempFilePath } = req.files.archivo,
      { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        folder: `RestServer-NodeJS/${coleccion}`
      });

    modelo.img = secure_url;
    await modelo.save();

    res.json(modelo);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Ha ocurrido un error inesperado. Disculpa las molestias.'
    });
  }

};

module.exports = {
  mostrarImagen,
  cargarArchivo,
  actualizarImagen,
  actualizarImagenCloudinary,
};