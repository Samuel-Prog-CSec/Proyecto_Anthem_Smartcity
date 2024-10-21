const mongoose = require('mongoose');

// Definimos el esquema de la colección Aire en MongoDB
// PENDIENTE: COMPROBAR VALIDACIONES DE LOS CAMPOS
const AireSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  provincia: { type: Number },
  municipio: { type: Number },
  estacion: { type: Number },
  magnitud: { type: Number },
  punto_muestreo: { type: String },
  ano: { type: Number },
  mes: { type: Number, min: 1, max: 12 },
  dia: { type: Number, min: 1, max: 31 },
  h: [{ type: Number }], // Array para los campos H
  v: [{ type: String }], // Array para los campos V
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Añadir índices para mejorar el rendimiento de las consultas
AireSchema.index({ PROVINCIA: 1, MUNICIPIO: 1, ESTACION: 1, MAGNITUD: 1 });

// Exportamos el modelo Aire
module.exports = mongoose.model('Aire', AireSchema);