// models/direccionModel.js
const { sql, config } = require('./db');

exports.insertarDireccion = async (idCliente, direccion) => {
  const pool = await sql.connect(config);
  await pool.request()
    .input('IDCliente', sql.Int, idCliente)
    .input('NombreEtiqueta', sql.VarChar(50), direccion.nombreEtiqueta)
    .input('Provincia', sql.VarChar(50), direccion.provincia)
    .input('Canton', sql.VarChar(50), direccion.canton)
    .input('Parroquia', sql.VarChar(50), direccion.parroquia)
    .input('CallePrincipal', sql.VarChar(100), direccion.callePrincipal)
    .input('CalleSecundaria', sql.VarChar(100), direccion.calleSecundaria)
    .input('NumeroCasa', sql.VarChar(20), direccion.numeroCasa)
    .input('Referencia', sql.VarChar(200), direccion.referencia)
    .input('Telefono', sql.VarChar(10), direccion.telefono)
    .input('Email', sql.VarChar(100), direccion.email)
    .input('EsPrincipal', sql.Bit, direccion.esPrincipal)
    .query(`
      INSERT INTO Direccion (
        IDCliente, NombreEtiqueta, Provincia, Canton, Parroquia,
        CallePrincipal, CalleSecundaria, NumeroCasa, Referencia,
        Telefono, Email, EsPrincipal
      )
      VALUES (
        @IDCliente, @NombreEtiqueta, @Provincia, @Canton, @Parroquia,
        @CallePrincipal, @CalleSecundaria, @NumeroCasa, @Referencia,
        @Telefono, @Email, @EsPrincipal
      )
    `);
};

// models/direccionModel.js
exports.eliminarDireccionesPorCliente = async (idCliente) => {
  const pool = await sql.connect(config);
  await pool.request()
    .input('IDCliente', sql.Int, idCliente)
    .query('DELETE FROM Direccion WHERE IDCliente = @IDCliente');
};