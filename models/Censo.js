const mongoose = require('mongoose');

// Esquema para representar los datos de censo poblacional
const CensoSchema = new mongoose.Schema({
    // Identificador único del censo (autogenerado por MongoDB)
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },

    // Código del distrito municipal (número entero)
    cod_distrito: { 
        type: Number, 
        required: true, 
        min: 1, 
        index: true // Indexado para facilitar consultas por distrito
    },
  
    // Nombre o literal del distrito (texto)
    desc_distrito: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // Código combinado del distrito y barrio (número entero)
    cod_dist_barrio: { 
        type: Number, 
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'El código de distrito-barrio debe ser un número entero'
        },
        index: true
    },

    // Literal o nombre del barrio (texto)
    desc_barrio: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // Código específico del barrio dentro del distrito (número entero)
    cod_barrio: { 
        type: Number, 
        min: 1,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'El código de barrio debe ser un número entero'
        }
    },

    // Código combinado del distrito y sección (número entero)
    cod_dist_seccion: { 
        type: Number, 
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'El código de distrito-sección debe ser un número entero'
        }
    },

    // Código específico de la sección dentro del distrito (número entero)
    cod_seccion: { 
        type: Number, 
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'El código de sección debe ser un número entero'
        }
    },

    // Edad en años de los residentes (número entero)
    cod_edad_int: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 120, // Edad máxima razonable
        validate: {
            validator: Number.isInteger,
            message: 'La edad debe ser un número entero'
        }
    },

    // Total de hombres españoles (número entero, 0 si no hay datos)
    espanoles_hombres: { 
        type: Number, 
        required: true, 
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'El total de hombres españoles debe ser un número entero'
        }
    },

    // Total de mujeres españolas (número entero, 0 si no hay datos)
    espanoles_mujeres: { 
        type: Number, 
        required: true, 
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'El total de mujeres españolas debe ser un número entero'
        }
    },

    // Total de hombres extranjeros (número entero, 0 si no hay datos)
    extranjeros_hombres: { 
        type: Number, 
        required: true, 
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'El total de hombres extranjeros debe ser un número entero'
        }
    },

    // Total de mujeres extranjeras (número entero, 0 si no hay datos)
    extranjeros_mujeres: { 
        type: Number, 
        required: true, 
        default: 0,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'El total de mujeres extranjeras debe ser un número entero'
        }
    }
    }, {
    timestamps: true // Añade createdAt y updatedAt automáticamente
    });

// Índices adicionales para optimizar consultas frecuentes
CensoSchema.index({ cod_distrito: 1, cod_dist_barrio: 1, cod_seccion: 1, cod_edad_int: 1 });

// Exportamos el modelo Censo
module.exports = mongoose.model('Censo', CensoSchema);