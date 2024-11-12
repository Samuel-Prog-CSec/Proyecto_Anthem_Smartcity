const mongoose = require('mongoose');

// Esquema para cada hora y su validación
const HoraSchema = new mongoose.Schema({
  hora : { type: Number, required: true, min: 1, max: 24 },
  valor: { type: Number, required: true, min: 0},
  validacion: { type: String, enum: ['V', 'N'], required: true }
});

// Definimos el esquema de la colección Aire en MongoDB
const AireSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  origen: { type: String, required: true },
  provincia: { type: Number, required: true, min: 1, max: 50 },
  municipio: { type: Number, required: true },
  estacion: { type: Number, required: true },
  magnitud: { type: Number, required: true, enum: [1, 2, 3, 4, 5] }, // Enum si tiene valores específicos
  punto_muestreo: { type: String, required: true, match: /^[0-9]{8}_[0-9]_[0-9]{2}$/ },
  ano: { type: Number, min: 1900, max: new Date().getFullYear(), required: true },
  mes: { type: Number, min: 1, max: 12, required: true },
  dia: { type: Number, min: 1, max: 31, required: true },
  horas: { type: [HoraSchema], validate: [arrayLimit, '{PATH} debe tener máximo 24 horas'] }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Función para validar que el array de horas tenga 24 elementos máximo
function arrayLimit(val) {
  return val.length > 24;
}

// Índices para mejorar rendimiento
AireSchema.index({ provincia: 1, municipio: 1, estacion: 1, magnitud: 1 });
AireSchema.index({ ano: 1, mes: 1, dia: 1 });

// Exportamos el modelo Aire
module.exports = mongoose.model('Aire', AireSchema);