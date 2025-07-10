// src/pages/ListaClientes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const navigate = useNavigate();

  const fetchClientes = () => {
    axios.get('http://localhost:3001/api/clientes').then(res => {
      setClientes(res.data);
    });
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`http://localhost:3001/api/clientes/${id}`);
        fetchClientes();
      } catch (error) {
        alert('Error al eliminar el cliente. Asegúrate de eliminar primero sus direcciones.');
        console.error(error);
      }
    }
  };

  return (
    <div className="container">
      <div className="button-group" style={{ justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Link to="/crear">
          <button>+ Crear Cliente</button>
        </Link>
      </div>

      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {clientes.map(cliente => (
            <li key={cliente.IDCliente} className="card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <button
                  onClick={() => setSeleccionado(seleccionado === cliente.IDCliente ? null : cliente.IDCliente)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    color: '#4a90e2',
                    textAlign: 'left',
                    flexGrow: 1,
                  }}
                >
                  {cliente.Nombre} {cliente.Apellido}
                </button>

                <div className="button-group" style={{ gap: '8px' }}>
                  <button
                    onClick={() => navigate(`/editar/${cliente.IDCliente}`)}
                    className="button-secondary"
                    title="Editar Cliente"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarCliente(cliente.IDCliente)}
                    className="button-danger"
                    title="Eliminar Cliente"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>

              {seleccionado === cliente.IDCliente && (
                <div style={{ marginTop: '15px', width: '100%' }}>
                  <p><strong>Correo:</strong> {cliente.CorreoElectronico}</p>
                  <h4>Direcciones:</h4>
                  {cliente.Direcciones && cliente.Direcciones.length > 0 ? (
                    cliente.Direcciones.map((dir, i) => (
                      <div key={i} style={{ border: '1px dashed gray', padding: 12, borderRadius: 6, marginBottom: 12 }}>
                        <p><strong>Etiqueta:</strong> {dir.NombreEtiqueta}</p>
                        <p><strong>Provincia:</strong> {dir.Provincia}, <strong>Cantón:</strong> {dir.Canton}</p>
                        {dir.Parroquia && <p><strong>Parroquia:</strong> {dir.Parroquia}</p>}
                        <p><strong>Dirección:</strong> {dir.CallePrincipal} y {dir.CalleSecundaria || '(sin calle secundaria)'}</p>
                        <p><strong>Número:</strong> {dir.NumeroCasa}</p>
                        <p><strong>Teléfono:</strong> {dir.Telefono}</p>
                        <p><strong>Principal:</strong> {dir.EsPrincipal ? 'Sí' : 'No'}</p>
                      </div>
                    ))
                  ) : (
                    <p>No hay direcciones registradas para este cliente.</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaClientes;
