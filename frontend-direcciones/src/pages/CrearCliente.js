// src/pages/CrearCliente.js
import React from 'react';
import ClienteForm from '../components/ClienteForm';

const CrearCliente = () => (
  <div>
    <h2>Registrar nuevo cliente</h2>
    <ClienteForm modo="crear" />
  </div>
);

export default CrearCliente;
