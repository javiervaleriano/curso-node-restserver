const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = async (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

  return new Promise((resolve, reject) => {
    const { archivo } = files,
      nombreCortado = archivo.name.split('.'),
      extension = nombreCortado[nombreCortado.length - 1];

    // Validar la extensión
    if (!extensionesValidas.includes(extension)) {
      return reject({
        status: 400,
        err: `La extensión "${extension}" no está permitida. Debe ser una de las siguientes: ${extensionesValidas}`
      });
    }

    const renombreArchivo = `${uuidv4()}.${extension}`,
      uploadPath = path.join(__dirname, '../uploads/', carpeta, renombreArchivo);

    archivo.mv(uploadPath, (err) => {
      if (err) return reject({
        status: 500,
        err
      });

      return resolve(renombreArchivo);
    });
  });

};

module.exports = {
  subirArchivo,
};