const {
  insertarCliente,
  actualizarCliente,
  eliminarClientePorId,
  obtenerClientesYDirecciones,
  obtenerClienteConDirecciones
} = require('../models/clienteModel');

const {
  insertarDireccion,
  eliminarDireccionesPorCliente
} = require('../models/direccionModel');

exports.crearCliente = async (req, res) => {
  const { nombre, apellido, correo, direcciones } = req.body;
  try {
    const idCliente = await insertarCliente(nombre, apellido, correo);
    for (const direccion of direcciones) {
      await insertarDireccion(idCliente, direccion);
    }
    res.status(201).json({ message: 'Cliente creado correctamente.' });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al guardar el cliente.' });
  }
};

exports.obtenerClientes = async (req, res) => {
  try {
    const resultados = await obtenerClientesYDirecciones();
    const data = {};
    for (const row of resultados) {
      const id = row.IDCliente;
      if (!data[id]) {
        data[id] = {
          IDCliente: id,
          Nombre: row.Nombre,
          Apellido: row.Apellido,
          CorreoElectronico: row.CorreoElectronico,
          Direcciones: [],
        };
      }
      if (row.IDDireccion) {
        data[id].Direcciones.push({
          IDDireccion: row.IDDireccion,
          NombreEtiqueta: row.NombreEtiqueta,
          Provincia: row.Provincia,
          Canton: row.Canton,
          Parroquia: row.Parroquia,
          CallePrincipal: row.CallePrincipal,
          CalleSecundaria: row.CalleSecundaria,
          NumeroCasa: row.NumeroCasa,
          Referencia: row.Referencia,
          Telefono: row.Telefono,
          Email: row.Email,
          EsPrincipal: row.EsPrincipal,
        });
      }
    }
    res.json(Object.values(data));
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener los clientes.' });
  }
};

exports.obtenerClientePorId = async (req, res) => {
  const idCliente = parseInt(req.params.id);
  try {
    const cliente = await obtenerClienteConDirecciones(idCliente);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.actualizarCliente = async (req, res) => {
  const idCliente = parseInt(req.params.id);
  const { nombre, apellido, correo, direcciones } = req.body;

  try {
    await actualizarCliente(idCliente, nombre, apellido, correo);
    await eliminarDireccionesPorCliente(idCliente);

    for (const direccion of direcciones) {
      await insertarDireccion(idCliente, direccion);
    }

    res.json({ message: 'Cliente actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar el cliente.' });
  }
};

exports.eliminarCliente = async (req, res) => {
  const idCliente = parseInt(req.params.id);
  try {
    // 👇 Primero elimina direcciones relacionadas
    await eliminarDireccionesPorCliente(idCliente);

    // 👇 Luego elimina el cliente
    await eliminarClientePorId(idCliente);

    res.json({ message: 'Cliente y sus direcciones eliminados correctamente.' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente.' });
  }
};
