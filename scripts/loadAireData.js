const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Aire = require('../models/Aire'); // Importar modelo
require('dotenv').config(); // Cargar variables de entorno

// Conectar a MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(error => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir del script con error
  });

const BATCH_SIZE = 1000; // Tamaño del lote para inserciones en MongoDB (2000 recomendable para grandes volúmenes)
const BUFFER_SIZE = 128 * 1024; // Tamaño del buffer de lectura (128 KB | 256 KB recomendable para grandes volúmenes)

const loadCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const batch = [];
    const readStream = fs.createReadStream(filePath, { highWaterMark: BUFFER_SIZE }); // Ajustar el tamaño del buffer
    // const savePromises = [];

    readStream
      .pipe(csv())
      .on('data', (row) => {
        // Procesar solo las horas con validación 'V'
        const horasValidas = [];
        for (let i = 1; i <= 24; i++) {
          const hora = i;
          const valor = parseFloat(row[`H${i.toString().padStart(2, '0')}`]);
          const validacion = row[`V${i.toString().padStart(2, '0')}`];

          // Solo añadir datos con validación "V"
          if (validacion === 'V') {
            horasValidas.push({ hora, valor, validacion });
          }
        }

        const nuevoDato = new Aire({
          origen: filePath,
          provincia: parseInt(row.PROVINCIA, 10), // Convertir a entero en base
          municipio: parseInt(row.MUNICIPIO, 10),
          estacion: parseInt(row.ESTACION, 10),
          magnitud: parseInt(row.MAGNITUD, 10),
          punto_muestreo: row.PUNTO_MUESTREO,
          ano: parseInt(row.ANO, 10),
          mes: parseInt(row.MES, 10),
          dia: parseInt(row.DIA, 10),
          horas: horasValidas
        });

        // savePromises.push(nuevoDato.save());
        batch.push(nuevoDato);

        // Si el lote alcanza el tamaño definido, insertar en la base de datos
        if (batch.length >= BATCH_SIZE) {
          readStream.pause();
          Aire.insertMany(batch)
            .then(() => {
              batch.length = 0; // Vaciar el lote
              readStream.resume();
            })
            .catch(error => {
              console.error(`Error al insertar el lote en la base de datos:`, error);
              reject(error);
            });
        }
      })
      .on('end', async () => {
        try {
          // Insertar cualquier dato restante en el lote
          if (batch.length > 0) {
            await Aire.insertMany(batch);
          }
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
    
    const loadPromises = files.map(file => {
      const filePath = path.join(dirPath, file);
      console.log(`Cargando datos de: ${file}`);
      return loadCSV(filePath)
        .then(() => console.log(`Carga completa de: ${file}`))
        .catch(error => console.error(`Error al cargar ${file}:`, error));
    });

    await Promise.all(loadPromises);
    console.log('Todos los archivos CSV de la carpeta han sido cargados');
  } catch (error) {
    console.error('Error al procesar los archivos CSV:', error);
  } finally {
    try {
      await mongoose.disconnect();
      console.log('Conexión a MongoDB cerrada');
    } catch (error) {
      console.error('Error al cerrar la conexión a MongoDB:', error);
    }
  }
};

// Llamar a la función con la ruta de la carpeta "Aire"
const dirPath = 'C:\Users\samue\Desktop\dataset\datos_hpe\Aire';
loadAllCSVFiles(dirPath);