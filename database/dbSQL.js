const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    user: process.env.DB_USER, // Asegúrate de definir estas variables en tu .env
    password: process.env.DB_PASSWORD ,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Utiliza true para Azure
        trustServerCertificate: true, // Cambia esto según sea necesario
    },
};

// Crea un pool de conexiones
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a la base de datos');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Detiene el proceso si no se puede conectar
    });

// Exporta el pool prometido
module.exports = { sql, poolPromise };
