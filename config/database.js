const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno desde .env

const connectDB = async () => {
    try {
        console.log('Intentando conectar a MongoDB...');
        
        const conn = await mongoose.connect(process.env.MONGO_URI_WIND, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Conexión a MongoDB establecida como: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error al conectar a MongoDB: ${err.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Conexión a MongoDB cerrada');
    } catch (err) {
        console.error(`Error al desconectar de MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = { connectDB, disconnectDB };