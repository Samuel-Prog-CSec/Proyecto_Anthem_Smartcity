const mongoose = require('mongoose');

const Estacion_Control_Acustico_Schema = new mongoose.Schema({
    // Identificador único para la estación (autogenerado por MongoDB)
    _id: { 
      type: mongoose.Schema.Types.ObjectId, 
      auto: true 
    },

    // Número identificador de la estación
    numero: { 
      type: Number, 
      required: true, 
      unique: true,
      min: 1
    },

    // Nombre o denominación de la estación
    nombre: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Código y clase de la vía donde se encuentra la estación
    cod_via: { 
      type: Number, 
      required: true 
    },
    via_clase: { 
      type: String, 
      required: true, 
      trim: true,
      enum: ['CALLE', 'AVENIDA', 'PLAZA', 'PASEO', 'CARRETERA']
    },
    via_par: { 
      type: String, 
      trim: true, 
      default: null,
      enum: ['DE', 'DEL', 'DE LA', 'DE LOS', 'DE LAS']
    },
    via_nombre: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Dirección exacta de la estación
    direccion: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Coordenadas en diferentes formatos
    longitud_gms: { 
      type: String, 
      required: true 
    }, 
    // Grados, minutos y segundos
    latitud_gms: { 
      type: String, 
      required: true 
    },
    latitud_ed50: { 
      type: Number, 
      required: true 
    },
    longitud_ed50: { 
      type: Number, 
      required: true 
    },
    // Altitud en metros
    altitud_m: { 
      type: Number, 
      required: true,
      min: 0
    },

    // Fecha de alta de la estación (formato dd/mm/yyyy)
    fecha_alta: { 
      type: Date, 
      required: true,
      validate: {
        validator: function(v) {
          return /\d{2}\/\d{2}\/\d{4}/.test(v);
        },
        message: props => `${props.value} no es una fecha válida.`
      }
    },

    // Coordenadas UTM en el sistema de referencia ETRS89
    coordenada_x_etrs89: { 
      type: Number, 
      required: true 
    },
    coordenada_y_etrs89: { 
      type: Number, 
      required: true 
    },

    // Coordenadas en WGS84
    longitud_wgs84: { 
      type: Number, 
      required: true 
    },
    latitud_wgs84: { 
      type: Number, 
      required: true 
    }
}, {
    timestamps: true
});

// Exportamos el modelo para las estaciones de control acústico
module.exports = mongoose.model('Estacion_Control_Acustico', Estacion_Control_Acustico_Schema);
