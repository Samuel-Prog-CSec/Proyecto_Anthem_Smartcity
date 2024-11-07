const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Aire = require('../models/Aire'); // Importar modelo

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const loadCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const savePromises = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Procesar solo las horas con validación 'V'
        const horasValidas = [];
        for (let i = 1; i <= 24; i++) {
          if (row[`V${i}`] === 'V') {
            horasValidas.push({ hora: i, valor: parseFloat(row[`H${i}`]), validacion: 'V' });
          }
        }

        const nuevoDato = new Aire({
          origen: filePath,
          provincia: parseInt(row.PROVINCIA, 10),
          municipio: parseInt(row.MUNICIPIO, 10),
          estacion: parseInt(row.ESTACION, 10),
          magnitud: parseInt(row.MAGNITUD, 10),
          punto_muestreo: row.PUNTO_MUESTREO,
          ano: parseInt(row.ANO, 10),
          mes: parseInt(row.MES, 10),
          dia: parseInt(row.DIA, 10),
          horas: horasValidas
        });

        savePromises.push(nuevoDato.save());
      })
      .on('end', async () => {
        try {
          await Promise.all(savePromises);
          resolve();
        } catch (error) {
          console.error(`Error al guardar los datos del archivo ${filePath}:`, error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error(`Error al leer el archivo ${filePath}:`, error);
        reject(error);
      });
  });
};

const loadAllCSVFiles = async (dirPath) => {
  try {
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.csv'));
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      console.log(`Cargando datos de: ${file}`);
      await loadCSV(filePath);  // Esperar a que cada archivo se procese completamente antes de seguir
      console.log(`Carga completa de: ${file}`);
    }
    console.log('Todos los archivos CSV de la carpeta han sido cargados');
  } catch (error) {
    console.error('Error al procesar los archivos CSV:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Llamar a la función con la ruta de la carpeta "Aire"
const dirPath = 'C:\\Users\\Samuel\\Desktop\\UNIVERSIDAD\\CUARTO\\Sistemas_Ubicuos\\PRACTICAS\\datos_hpe\\Aire';
loadAllCSVFiles(dirPath);