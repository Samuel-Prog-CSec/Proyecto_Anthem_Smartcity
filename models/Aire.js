import { Schema, model } from 'mongoose';

const AireSchema = new Schema({
  puntoMuestreo: { type: String, required: true },
  fecha: { type: Date, required: true },
  H01: { type: Number },
  H02: { type: Number },
  // Agrega más campos según el formato del CSV
  validaciones: {
    H01: { type: String },  // Solo si el valor es 'V'
    H02: { type: String },
  }
});

export default model('Aire', AireSchema);