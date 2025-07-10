// src/components/ClienteDetalle.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ClienteDetalle = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/clientes')
      .then(res => {
        const cli = res.data.find(c => c.IDCliente === parseInt(id));
        setCliente(cli);
      });
  }, [id]);

  if (!cliente) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{cliente.Nombre} {cliente.Apellido}</h2>
      <p><strong>Correo:</strong> {cliente.CorreoElectronico}</p>
      <h4>Direcciones:</h4>
      {cliente.Direcciones.map((dir, i) => (
        <div key={i} style={{ border: '1px dashed gray', padding: 8, marginBottom: 10 }}>
          <p><strong>Etiqueta:</strong> {dir.NombreEtiqueta}</p>
          <p><strong>Dirección:</strong> {dir.CallePrincipal} y {dir.CalleSecundaria}</p>
          <p><strong>Provincia:</strong> {dir.Provincia}, Cantón: {dir.Canton}</p>
          <p><strong>Número:</strong> {dir.NumeroCasa}</p>
          <p><strong>Teléfono:</strong> {dir.Telefono}</p>
          <p><strong>Principal:</strong> {dir.EsPrincipal ? 'Sí' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};

export default ClienteDetalle;
