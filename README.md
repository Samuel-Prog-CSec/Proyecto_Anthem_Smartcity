# Proyecto Anthem Smartcity

## ¿cómo puedo optimizar el modelo y el esquema de Aire?

Para optimizar el modelo y el esquema de Aire, puedes seguir estos pasos:

Añadir Validaciones: Asegúrate de que los campos tengan las validaciones adecuadas, como required, min, max, etc.
Añadir Índices: Si hay campos que se consultan frecuentemente, considera añadir índices para mejorar el rendimiento de las consultas.
Eliminar Campos Innecesarios: Asegúrate de que solo los campos necesarios estén presentes en el esquema.
Usar timestamps: Añadir marcas de tiempo (createdAt y updatedAt) para rastrear cuándo se crean y actualizan los documentos.
Aquí tienes una versión optimizada del modelo y el esquema de Aire:

const mongoose = require('mongoose');

// Definimos el esquema de la colección Aire en MongoDB
const AireSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  PROVINCIA: { type: Number, required: true },
  MUNICIPIO: { type: Number, required: true },
  ESTACION: { type: Number, required: true },
  MAGNITUD: { type: Number, required: true },
  PUNTO_MUESTREO: { type: String, required: true },
  ANO: { type: Number, required: true, min: 1900, max: new Date().getFullYear() },
  MES: { type: Number, required: true, min: 1, max: 12 },
  DIA: { type: Number, required: true, min: 1, max: 31 },
  H01: { type: Number, required: true },
  V01: { type: String, required: true },
  H02: { type: Number, required: true },
  V02: { type: String, required: true },
  H03: { type: Number, required: true },
  V03: { type: String, required: true },
  H04: { type: Number, required: true },
  V04: { type: String, required: true },
  H05: { type: Number, required: true },
  V05: { type: String, required: true },
  H06: { type: Number, required: true },
  V06: { type: String, required: true },
  H07: { type: Number, required: true },
  V07: { type: String, required: true },
  H08: { type: Number, required: true },
  V08: { type: String, required: true },
  H09: { type: Number, required: true },
  V09: { type: String, required: true },
  H10: { type: Number, required: true },
  V10: { type: String, required: true },
  H11: { type: Number, required: true },
  V11: { type: String, required: true },
  H12: { type: Number, required: true },
  V12: { type: String, required: true },
  H13: { type: Number, required: true },
  V13: { type: String, required: true },
  H14: { type: Number, required: true },
  V14: { type: String, required: true },
  H15: { type: Number, required: true },
  V15: { type: String, required: true },
  H16: { type: Number, required: true },
  V16: { type: String, required: true },
  H17: { type: Number, required: true },
  V17: { type: String, required: true },
  H18: { type: Number, required: true },
  V18: { type: String, required: true },
  H19: { type: Number, required: true },
  V19: { type: String, required: true },
  H20: { type: Number, required: true },
  V20: { type: String, required: true },
  H21: { type: Number, required: true },
  V21: { type: String, required: true },
  H22: { type: Number, required: true },
  V22: { type: String, required: true },
  H23: { type: Number, required: true },
  V23: { type: String, required: true },
  H24: { type: Number, required: true },
  V24: { type: String, required: true },
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Añadir índices para mejorar el rendimiento de las consultas
AireSchema.index({ PROVINCIA: 1, MUNICIPIO: 1, ESTACION: 1, MAGNITUD: 1 });

module.exports = mongoose.model('Aire', AireSchema);
Puntos clave:
Validaciones: Añadir validaciones como required, min, y max para asegurar la integridad de los datos.
Índices: Añadir índices en los campos que se consultan frecuentemente para mejorar el rendimiento.
Marcas de tiempo: Añadir timestamps para rastrear cuándo se crean y actualizan los documentos.
Auto-generación de _id: Usar { type: mongoose.Schema.Types.ObjectId, auto: true } para que Mongoose maneje automáticamente la generación de _id.
Con estas optimizaciones, el modelo y el esquema de Aire deberían ser más eficientes y fáciles de mantener.


## ¿se puede agrupar o usar array para los h o los v? No se si esto sería correcto o recomendable

Sí, puedes agrupar los campos H y V en arrays si tienen una estructura repetitiva y si no necesitas acceder a ellos individualmente con nombres específicos. Esto puede hacer que tu esquema sea más limpio y manejable. Sin embargo, debes considerar cómo vas a acceder y manipular estos datos en tu aplicación.

Aquí tienes una versión del esquema que agrupa los campos H y V en arrays:
file:///c%3A/Users/samue/Desktop/Proyecto_Anthem_Smartcity/models/Aire.js
const mongoose = require('mongoose');

// Definimos el esquema de la colección Aire en MongoDB
const AireSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  PROVINCIA: { type: Number, required: true },
  MUNICIPIO: { type: Number, required: true },
  ESTACION: { type: Number, required: true },
  MAGNITUD: { type: Number, required: true },
  PUNTO_MUESTREO: { type: String, required: true },
  ANO: { type: Number, required: true, min: 1900, max: new Date().getFullYear() },
  MES: { type: Number, required: true, min: 1, max: 12 },
  DIA: { type: Number, required: true, min: 1, max: 31 },
  H: [{ type: Number, required: true }], // Array para los campos H
  V: [{ type: String, required: true }], // Array para los campos V
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Añadir índices para mejorar el rendimiento de las consultas
AireSchema.index({ PROVINCIA: 1, MUNICIPIO: 1, ESTACION: 1, MAGNITUD: 1 });

module.exports = mongoose.model('Aire', AireSchema);

### Actualización del Código de Inserción:
También necesitarás actualizar tu código de inserción para manejar estos arrays:
file:///c%3A/Users/samue/Desktop/Proyecto_Anthem_Smartcity/scripts/loadAireData.js
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Aire = require('../models/Aire');
const { connectDB, disconnectDB } = require('../config/database');

const loadCSV = async () => {
  // Conectar a MongoDB
  await connectDB();

  const inserts = [];

  fs.createReadStream('Anthem_CTC_Aire_Abril.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      // Mapea el CSV a tu modelo de Mongoose
      const nuevoDato = new Aire({
        _id: new mongoose.Types.ObjectId(),
        PROVINCIA: row.PROVINCIA,
        MUNICIPIO: row.MUNICIPIO,
        ESTACION: row.ESTACION,
        MAGNITUD: row.MAGNITUD,
        PUNTO_MUESTREO: row.PUNTO_MUESTREO,
        ANO: row.ANO,
        MES: row.MES,
        DIA: row.DIA,
        H: [row.H01, row.H02, row.H03, row.H04, row.H05, row.H06, row.H07, row.H08, row.H09, row.H10, row.H11, row.H12, row.H13, row.H14, row.H15, row.H16, row.H17, row.H18, row.H19, row.H20, row.H21, row.H22, row.H23, row.H24],
        V: [row.V01, row.V02, row.V03, row.V04, row.V05, row.V06, row.V07, row.V08, row.V09, row.V10, row.V11, row.V12, row.V13, row.V14, row.V15, row.V16, row.V17, row.V18, row.V19, row.V20, row.V21, row.V22, row.V23, row.V24],
      });

      inserts.push(nuevoDato.save());
    })
    .on('end', async () => {
      try {
        await Promise.all(inserts);
        console.log('Todos los datos han sido importados');
      } catch (err) {
        console.error(`Error al insertar datos: ${err.message}`);
      } finally {
        await disconnectDB();
        console.log('Conexión a MongoDB cerrada');
      }
    });
};

loadCSV();
Puntos clave:
Agrupación en Arrays: Agrupar los campos H y V en arrays hace que el esquema sea más limpio y manejable.
Actualización del Código de Inserción: Asegúrate de actualizar tu lógica de inserción para manejar los arrays correctamente.
Validaciones y Índices: Mantén las validaciones y los índices para asegurar la integridad y el rendimiento de los datos.
Con estas optimizaciones, tu esquema y tu lógica de inserción deberían ser más eficientes y fáciles de mantener.


## Varios aires:
Entiendo, si tienes un archivo CSV para cada mes y quieres procesarlos todos, puedes modificar tu código para leer y procesar todos los archivos CSV en el directorio Aire. Aquí tienes una versión optimizada del código que procesa todos los archivos CSV en el directorio Aire:

const fs = require('fs');
const path = require('path');
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

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        // Mapea el CSV a tu modelo de Mongoose
        const nuevoDato = new Aire({
          _id: new mongoose.Types.ObjectId(),
          PROVINCIA: row.PROVINCIA,
          MUNICIPIO: row.MUNICIPIO,
          ESTACION: row.ESTACION,
          MAGNITUD: row.MAGNITUD,
          PUNTO_MUESTREO: row.PUNTO_MUESTREO,
          ANO: row.ANO,
          MES: row.MES,
          DIA: row.DIA,
          H: [row.H01, row.H02, row.H03, row.H04, row.H05, row.H06, row.H07, row.H08, row.H09, row.H10, row.H11, row.H12, row.H13, row.H14, row.H15, row.H16, row.H17, row.H18, row.H19, row.H20, row.H21, row.H22, row.H23, row.H24],
          V: [row.V01, row.V02, row.V03, row.V04, row.V05, row.V06, row.V07, row.V08, row.V09, row.V10, row.V11, row.V12, row.V13, row.V14, row.V15, row.V16, row.V17, row.V18, row.V19, row.V20, row.V21, row.V22, row.V23, row.V24],
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

file:///c%3A/Users/samue/Desktop/Proyecto_Anthem_Smartcity/scripts/loadAireData.js
Puntos clave:
Lectura de todos los archivos CSV en el directorio: Usa fs.readdirSync para leer todos los archivos CSV en el directorio Aire.
Procesamiento de cada archivo CSV: Usa un bucle for para procesar cada archivo CSV.
Manejo de inserciones en paralelo: Usa Promise.all para manejar las inserciones en paralelo.
Desconexión de MongoDB al final: Desconecta de MongoDB después de procesar todos los archivos.
Con estas modificaciones, tu código debería ser capaz de procesar todos los archivos CSV en el directorio Aire de manera eficiente.



## tengo una duda de cómo organizar mi bd en mongoDB para este proyecto. Actualmente estoy guardando dentro de la BD "Pruebas" una carpeta para cada sección de colecciones (Aire, Trafico, Multas, etc.). Dentro de estas carpetas, para cada archivo .csv hay una colección (por ejemplo, en la carpeta Aires hay 12 colecciones porque hay 12 csv de esta sección). Mi duda es cómo optimizar la BD para una mejor y más eficiente gestión, ¿este planteamiento que estoy siguiendo es correcto o sería mejor sólo tener una colleción en cada carpeta (esta colección sería la combinación de las que había antes)' Debes tener en cuenta que ahora mismo estoy realizando la ingesta en BD, pero en el futuro, tendré que desarrollar el front-end y tendré que realizar muchas consultas a la BD para poder visualizar datos, por lo que la implementación y estructura a seguir debe ser lo más favorable y óptima para cuando llegue ese momento.

Para optimizar la estructura de tu base de datos en MongoDB, es importante considerar tanto la eficiencia de las consultas como la facilidad de mantenimiento. Aquí hay algunas recomendaciones para estructurar tu base de datos de manera más eficiente:

1. Una Colección por Tipo de Datos
En lugar de tener una colección separada para cada archivo CSV, es más eficiente tener una sola colección para cada tipo de datos (por ejemplo, Aire, Trafico, Multas). Esto facilita las consultas y el mantenimiento de la base de datos.

2. Añadir Metadatos para Diferenciar los Datos
Para diferenciar los datos que provienen de diferentes archivos CSV, puedes añadir un campo adicional que indique el origen de los datos, como el mes o el nombre del archivo.

3. Índices para Mejorar el Rendimiento de las Consultas
Asegúrate de añadir índices en los campos que se consultan frecuentemente para mejorar el rendimiento de las consultas.

4. Estructura de Documentos
Asegúrate de que la estructura de los documentos sea consistente y que los campos estén bien definidos.

Ejemplo de Estructura Optimizada

Esquema de Aire

const mongoose = require('mongoose');

// Definimos el esquema de la colección Aire en MongoDB
const AireSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  PROVINCIA: { type: Number, required: true },
  MUNICIPIO: { type: Number, required: true },
  ESTACION: { type: Number, required: true },
  MAGNITUD: { type: Number, required: true },
  PUNTO_MUESTREO: { type: String, required: true },
  ANO: { type: Number, required: true, min: 1900, max: new Date().getFullYear() },
  MES: { type: Number, required: true, min: 1, max: 12 },
  DIA: { type: Number, required: true, min: 1, max: 31 },
  H: [{ type: Number, required: true }], // Array para los campos H
  V: [{ type: String, required: true }], // Array para los campos V
  origen: { type: String, required: true } // Campo adicional para indicar el origen de los datos
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Añadir índices para mejorar el rendimiento de las consultas
AireSchema.index({ PROVINCIA: 1, MUNICIPIO: 1, ESTACION: 1, MAGNITUD: 1 });

module.exports = mongoose.model('Aire', AireSchema);

Código de Inserción

const fs = require('fs');
const path = require('path');
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
      .on('data', (row) => {
        // Mapea el CSV a tu modelo de Mongoose
        const nuevoDato = new Aire({
          _id: new mongoose.Types.ObjectId(),
          PROVINCIA: row.PROVINCIA,
          MUNICIPIO: row.MUNICIPIO,
          ESTACION: row.ESTACION,
          MAGNITUD: row.MAGNITUD,
          PUNTO_MUESTREO: row.PUNTO_MUESTREO,
          ANO: row.ANO,
          MES: row.MES,
          DIA: row.DIA,
          H: [row.H01, row.H02, row.H03, row.H04, row.H05, row.H06, row.H07, row.H08, row.H09, row.H10, row.H11, row.H12, row.H13, row.H14, row.H15, row.H16, row.H17, row.H18, row.H19, row.H20, row.H21, row.H22, row.H23, row.H24],
          V: [row.V01, row.V02, row.V03, row.V04, row.V05, row.V06, row.V07, row.V08, row.V09, row.V10, row.V11, row.V12, row.V13, row.V14, row.V15, row.V16, row.V17, row.V18, row.V19, row.V20, row.V21, row.V22, row.V23, row.V24],
          origen: file // Añadir el nombre del archivo como origen
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

Ventajas de Esta Estructura
Consultas Más Simples: Tener una sola colección por tipo de datos facilita las consultas y reduce la complejidad.
Mejor Rendimiento: Los índices en los campos consultados frecuentemente mejoran el rendimiento de las consultas.
Facilidad de Mantenimiento: Una estructura más simple es más fácil de mantener y escalar.
Flexibilidad: El campo origen permite diferenciar los datos según su origen, lo que facilita el análisis y la depuración.
Resumen
Una Colección por Tipo de Datos: Agrupa todos los datos de un tipo en una sola colección.
Añadir Metadatos: Usa un campo adicional para indicar el origen de los datos.
Índices: Añade índices en los campos que se consultan frecuentemente.
Consistencia: Asegúrate de que la estructura de los documentos sea consistente.
Con esta estructura, tu base de datos será más eficiente y fácil de gestionar, lo que te permitirá desarrollar el front-end y realizar consultas de manera más efectiva.