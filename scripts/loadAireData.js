const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Aire = require('../models/Aire');
const { connectDB, disconnectDB } = require('../config/database');

const loadCSVFiles = async () => {
  // Conectar a MongoDB
  await connectDB();

  const directoryPath = path.join(__dirname, '../Aire');
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.csv'));

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const inserts = [];

    // Leer el CSV y guardar los datos en la base de datos
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', async (row) => {
          // Mapea el CSV a tu modelo de Mongoose
          const nuevoDato = new Aire({
            _id: new mongoose.Types.ObjectId(),
            provincia: row.PROVINCIA,
            municipio: row.MUNICIPIO,
            estacion: row.ESTACION,
            magnitud: row.MAGNITUD,
            punto_muestreo: row.PUNTO_MUESTREO,
            ano: row.ANO,
            mes: row.MES,
            dia: row.DIA,
            H: [row.H01, row.H02, row.H03, row.H04, row.H05, row.H06, row.H07, row.H08, row.H09, row.H10, row.H11, 
              row.H12, row.H13, row.H14, row.H15, row.H16, row.H17, row.H18, row.H19, row.H20, row.H21, row.H22, 
              row.H23, row.H24],
            V: [row.V01, row.V02, row.V03, row.V04, row.V05, row.V06, row.V07, row.V08, row.V09, row.V10, row.V11, 
              row.V12, row.V13, row.V14, row.V15, row.V16, row.V17, row.V18, row.V19, row.V20, row.V21, row.V22, 
              row.V23, row.V24],
          });

          inserts.push(nuevoDato.save());
      })
      .on('end', async () => {
        try {
          await Promise.all(inserts);
          console.log(`Todos los datos del archivo ${file} han sido importados`);
        } catch (err) {
          console.error(`Error al insertar datos del archivo ${file}: ${err.message}`);
        }
      });
  }

  // Desconectar de MongoDB después de procesar todos los archivos
  await disconnectDB();
  console.log('Conexión a MongoDB cerrada');
};

loadCSVFiles();