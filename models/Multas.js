const mongoose = require('mongoose');

const MultaSchema = new mongoose.Schema({
    // Identificador único de la multa (autogenerado por MongoDB)
     _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },

    // Tipo de infracción (Leve, Grave, Muy Grave)
    calificacion: {
        type: String,
        required: true,
        enum: ['LEVE', 'GRAVE', 'MUY GRAVE'], // Definimos los valores válidos
        trim: true
    },

    // Lugar de la infracción
    lugar: {
        type: String,
        required: true,
        trim: true
    },

    // Fecha de denuncia en formato mes/año (MM/YYYY)
    fdenun: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Validamos que el formato sea MM/YYYY
                const regex = /^\d{2}\/\d{4}$/;
                if (!regex.test(v)) {
                    return false;
                }
                
                // Extraemos mes y año del formato
                const [mes, ano] = v.split('/');
                const mesNumerico = parseInt(mes, 10);  // Convertimos el mes a un número
                const anoNumerico = parseInt(ano, 10);  // Convertimos el año a un número
                
                // Validamos que el mes esté entre 01 y 12 y el año esté entre 1900 y 9999
                return mesNumerico >= 1 && mesNumerico <= 12 && anoNumerico >= 1900 && anoNumerico <= 9999;
            },
            message: props => `${props.value} no es un formato válido para la fecha de denuncia. El mes debe estar entre 01 y 12 y el año entre 1900 y 9999.`
        }
    },
    
    hora: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Validamos que el formato sea HH.MM
                const regex = /^(?:[01]?[0-9]|2[0-3])\.[0-5]?[0-9]$/;
                if (!regex.test(v)) {
                    return false;
                }
                
                // Extraemos hora y minutos del formato
                const [hora, minutos] = v.split('.');  // Separamos la hora de los minutos
                const horaNumerica = parseInt(hora, 10);  // Convertimos la hora a número
                const minutosNumericos = parseInt(minutos, 10);  // Convertimos los minutos a número
                
                // Validamos que la hora esté entre 00 y 11 y los minutos entre 00 y 59
                return horaNumerica >= 0 && horaNumerica <= 11 && minutosNumericos >= 0 && minutosNumericos <= 59;
            },
            message: props => `${props.value} no es un formato válido para la hora. La hora debe estar entre 00 y 11 y los minutos entre 00 y 59.`
        }
    },    

    // Importe del boletín (monto económico)
    imp_bol: {
        type: Number,
        required: true,
        min: [0, 'El importe no puede ser negativo']
    },

    // Si tiene descuento (Si o No)
    descuento: {
        type: String,
        required: true,
        enum: ['SI', 'NO'],
        trim: true
    },

    // Puntos detraídos por la infracción
    puntos: {
        type: Number,
        required: true,
        min: [0, 'Los puntos no pueden ser negativos'],
        max: [15, 'Los puntos no pueden ser mayores a 15']
    },

    // Denunciante (quién realiza la denuncia)
    denunciante: {
        type: String,
        required: true,
        trim: true, 
        enum: ['AGENTES DE MOVILIDAD', 'POLICIA MUNICIPAL', 'SER'] // Definimos los valores válidos
    },

    // Hecho denunciado (descripción de la infracción)
    hecho_bol: {
        type: String,
        required: true,
        trim: true
    },

    // Velocidad límite, si es un radar (si aplica)
    vel_limite: {
        type: Number,
        min: [0, 'La velocidad límite no puede ser negativa'],
        default: null, // Por si no aplica
        validate: {
            validator: function(v) {
                // Validamos que el hecho de la infracción sea 'SOBREPASAR LA VELOCIDAD MÁXIMA'
                return this.hecho_bol === 'SOBREPASAR LA VELOCIDAD MÁXIMA EN VÍAS LIMITADAS EN 60 KM/H O MÁS.' 
                || this.hecho_bol === 'SOBREPASAR LA VELOCIDAD MÁXIMA EN VÍAS LIMITADAS HASTA 50 KM/H.';
            },
            message: props => `${props.value} si no se se sobrepasa la velocidad máxima en vías limitadas no aplica.`
        }
    },

    // Velocidad medida, si es un radar (si aplica)
    vel_circula: {
        type: Number,
        min: [0, 'La velocidad medida no puede ser negativa'],
        default: null, // Por si no aplica
        validate: {
            validator: function(v) {
                // Validamos que el hecho de la infracción sea 'SOBREPASAR LA VELOCIDAD MÁXIMA'
                return this.hecho_bol === 'SOBREPASAR LA VELOCIDAD MÁXIMA EN VÍAS LIMITADAS EN 60 KM/H O MÁS.' 
                || this.hecho_bol === 'SOBREPASAR LA VELOCIDAD MÁXIMA EN VÍAS LIMITADAS HASTA 50 KM/H.';
            },
            message: props => `${props.value} si no se se sobrepasa la velocidad máxima en vías limitadas no aplica.`
        }
    },

    // Coordenadas geográficas de la infracción
    coordenada_x: {
        type: Number,
        required: true,
        default: null // Por si no hay datos
    },
    coordenada_y: {
        type: Number,
        required: true,
        default: null // Por si no hay datos
    },

    // Número de boletines (en caso de registros agrupados)
    num_boletines: {
        type: Number,
        required: true,
        min: [1, 'El número de boletines debe ser al menos 1'],
        default: 1
    },

    // Importe total agrupado (si hay varios boletines en el mismo lugar o tipo de infracción)
    importe: {
        type: Number,
        required: true,
        min: [0, 'El importe total no puede ser negativo'],
        default: function() {
            return this.imp_bol * this.num_boletines; // Calculamos el importe total
        }
    }
    }, {
    timestamps: true // Crea createdAt y updatedAt automáticamente
});

// Índices para mejorar rendimientto
multaSchema.index({ calificacion: 1, lugar: 1, fdenun: 1 , hecho_bol: 1});

// Exportamos el modelo Multas
module.exports = mongoose.model('Multa', MultaSchema);