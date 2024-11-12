const mongoose = require('mongoose');

const Punto_Medida_Trafico_Schema = new mongoose.Schema({
    // Identificador único para el punto de medida (autogenerado por MongoDB)
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },

    // Tipo de elemento de control (URB o M-30)
    tipo_elem: { 
        type: String, 
        required: true, 
        enum: ['URB', 'M30'] 
    },

    // Código de distrito donde se ubica el punto de medida
    distrito: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 21 
    },

    // Identificador único y permanente del punto de medida
    id: { 
        type: String, 
        required: true, 
        unique: true
    },

    // Código de centralización
    cod_cent: { 
        type: String, 
        required: true 
    },

    // Nombre o denominación del punto de medida
    nombre: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // Coordenadas UTM del punto de medida (en metros)
    utm_x: { 
        type: Number, 
        required: true 
    },
    utm_y: { 
        type: Number, 
        required: true 
    },

    // Coordenadas en WGS84 para mapas y sistemas de navegación
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

// Exportamos el modelo para los puntos de medida de tráfico
module.exports = mongoose.model('Punto_Medida_Trafico', Punto_Medida_Trafico_Schema);