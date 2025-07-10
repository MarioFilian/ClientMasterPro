// src/components/ClienteList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/clientes').then(res => {
      setClientes(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Clientes Registrados</h2>
      <ul>
        {clientes.map(cliente => (
          <li key={cliente.IDCliente}>
            <button onClick={() => setSeleccionado(cliente.IDCliente)}>
              {cliente.Nombre} {cliente.Apellido}
            </button>

            {seleccionado === cliente.IDCliente && (
              <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                <p><strong>Correo:</strong> {cliente.CorreoElectronico}</p>
                <h4>Direcciones:</h4>
                {cliente.Direcciones.map((dir, i) => (
                  <div key={i} style={{ border: '1px dashed gray', padding: 8, marginBottom: 10 }}>
                    <p><strong>Etiqueta:</strong> {dir.NombreEtiqueta}</p>
                    <p><strong>Provincia:</strong> {dir.Provincia}, <strong>Cantón:</strong> {dir.Canton}</p>
                    {dir.Parroquia && <p><strong>Parroquia:</strong> {dir.Parroquia}</p>}
                    <p><strong>Dirección:</strong> {dir.CallePrincipal} y {dir.CalleSecundaria || '(sin calle secundaria)'}</p>
                    <p><strong>Número:</strong> {dir.NumeroCasa}</p>
                    {dir.Referencia && <p><strong>Referencia:</strong> {dir.Referencia}</p>}
                    <p><strong>Teléfono:</strong> {dir.Telefono}</p>
                    {dir.Email && <p><strong>Email:</strong> {dir.Email}</p>}
                    <p><strong>Principal:</strong> {dir.EsPrincipal ? 'Sí' : 'No'}</p>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClienteList;
