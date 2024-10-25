const mongoose = require('mongoose');

// Definimos el esquema de la colección Aire en MongoDB
// PENDIENTE: COMPROBAR VALIDACIONES DE LOS CAMPOS
const AireSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  origen: { type: String, required: true },
  provincia: { type: Number, required: true },
  municipio: { type: Number, required: true },
  estacion: { type: Number, required: true },
  magnitud: { type: Number, required: true },
  punto_muestreo: { type: String, required: true }, // PENDIENTE: match: /^[0-9]{2}[0-9]{2}[0-9]{2}_[0-9]{2}_[0-9]$/
  ano: { type: Number, max: new Date().getFullYear(), required: true },
  mes: { type: Number, min: 1, max: 12, required: true },
  dia: { type: Number, min: 1, max: 31, required: true },
  h: [{ type: Number, required: true, }], // Array para los campos H
  v: [{ type: String, enum: ['V', 'N'], required: true, }], // Array para los campos V
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Añadir índices para mejorar el rendimiento de las consultas
AireSchema.index({ provincia: 1, municipio: 1, estacion: 1, magnitud: 1 });

// Exportamos el modelo Aire
module.exports = mongoose.model('Aire', AireSchema);