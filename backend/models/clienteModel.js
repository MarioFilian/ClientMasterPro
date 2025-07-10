const { sql, config } = require('./db');

// Insertar un nuevo cliente
exports.insertarCliente = async (nombre, apellido, correo) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('Nombre', sql.VarChar, nombre)
    .input('Apellido', sql.VarChar, apellido)
    .input('Correo', sql.VarChar, correo)
    .query(`
      INSERT INTO Cliente (Nombre, Apellido, CorreoElectronico)
      OUTPUT INSERTED.IDCliente
      VALUES (@Nombre, @Apellido, @Correo)
    `);
  return result.recordset[0].IDCliente;
};

// Actualizar cliente existente
exports.actualizarCliente = async (id, nombre, apellido, correo) => {
  const pool = await sql.connect(config);
  await pool.request()
    .input('IDCliente', sql.Int, id)
    .input('Nombre', sql.VarChar, nombre)
    .input('Apellido', sql.VarChar, apellido)
    .input('Correo', sql.VarChar, correo)
    .query(`
      UPDATE Cliente
      SET Nombre = @Nombre,
          Apellido = @Apellido,
          CorreoElectronico = @Correo
      WHERE IDCliente = @IDCliente
    `);
};

// Eliminar cliente (verifica que no tenga direcciones si no usas ON DELETE CASCADE)
exports.eliminarClientePorId = async (id) => {
  const pool = await sql.connect(config);
  await pool.request()
    .input('IDCliente', sql.Int, id)
    .query(`
      DELETE FROM Cliente WHERE IDCliente = @IDCliente
    `);
};

// Obtener todos los clientes con sus direcciones (para lista completa)
exports.obtenerClientesYDirecciones = async () => {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .query(`
      SELECT c.*, d.*
      FROM Cliente c
      LEFT JOIN Direccion d ON c.IDCliente = d.IDCliente
    `);
  return result.recordset;
};

// ✅ Obtener UN cliente con todas sus direcciones (modo edición)
exports.obtenerClienteConDirecciones = async (idCliente) => {
  const pool = await sql.connect(config);

  // Obtener datos del cliente
  const clienteResult = await pool.request()
    .input('IDCliente', sql.Int, idCliente)
    .query('SELECT * FROM Cliente WHERE IDCliente = @IDCliente');

  if (clienteResult.recordset.length === 0) return null;

  // Obtener direcciones asociadas
  const direccionesResult = await pool.request()
    .input('IDCliente', sql.Int, idCliente)
    .query('SELECT * FROM Direccion WHERE IDCliente = @IDCliente');

  const cliente = clienteResult.recordset[0];
  cliente.Direcciones = direccionesResult.recordset;

  return cliente;
};
