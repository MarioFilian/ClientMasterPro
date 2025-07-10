// models/db.js
const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'admin',
  server: 'NOTEBOOK', // Ej: 'localhost'
  database: 'DireccionesClientesDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

module.exports = { sql, config };
