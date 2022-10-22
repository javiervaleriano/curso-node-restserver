const mongoose = require('mongoose');

const dbConnection = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Conexión a la base de datos exitosa');

  } catch (error) {
    console.log(error);
    throw new Error('Error en la conexión a la base de datos');
  }
}

module.exports = {
  dbConnection
};