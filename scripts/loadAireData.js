const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Aire = require('../models/Aire'); // Importa el modelo

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const loadCSV = () => {
  fs.createReadStream('path_to_csv_file.csv')  // Reemplaza con la ruta a tu archivo CSV
    .pipe(csv())
    .on('data', async (row) => {
      try {
        // Mapea el CSV a tu modelo de Mongoose
        const nuevoDato = new Aire({
          puntoMuestreo: row.puntoMuestreo,
          fecha: new Date(row.fecha),
          H01: row.H01,
          H02: row.H02,
          validaciones: {
            H01: row.V01,
            H02: row.V02
          }
        });
        await nuevoDato.save();
      } catch (err) {
        console.error(err);
      }
    })
    .on('end', () => {
      console.log('Todos los datos han sido importados');
      mongoose.disconnect();
    });
};

loadCSV();