// src/pages/EditarCliente.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ClienteForm from '../components/ClienteForm';

const EditarCliente = () => {
  const { id } = useParams();
  return (
    <div>
      <h2>Editar cliente</h2>
      <ClienteForm modo="editar" idCliente={id} />
    </div>
  );
};

export default EditarCliente;
