import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClienteForm = ({ modo, idCliente }) => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    direcciones: [
      {
        nombreEtiqueta: '',
        provincia: '',
        canton: '',
        parroquia: '',
        callePrincipal: '',
        calleSecundaria: '',
        numeroCasa: '',
        referencia: '',
        telefono: '',
        email: '',
        esPrincipal: false,
      },
    ],
  });

const soloLetras = (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor);
const soloNumeros = (valor) => /^[0-9]*$/.test(valor);

const eliminarDireccion = (index) => {
  if (cliente.direcciones.length === 1) {
    alert('Debe haber al menos una dirección.');
    return;
  }

  const nuevasDirecciones = cliente.direcciones.filter((_, i) => i !== index);
  setCliente({ ...cliente, direcciones: nuevasDirecciones });
};

useEffect(() => {
  const cargarCliente = async () => {
    if (modo === 'editar' && idCliente) {
      try {
        const res = await axios.get(`http://localhost:3001/api/clientes/${idCliente}`);
        const cli = res.data;
        setCliente({
          nombre: cli.Nombre || '',
          apellido: cli.Apellido || '',
          correo: cli.CorreoElectronico || '',
          direcciones: (cli.Direcciones || []).map(dir => ({
            nombreEtiqueta: dir.NombreEtiqueta || '',
            provincia: dir.Provincia || '',
            canton: dir.Canton || '',
            parroquia: dir.Parroquia || '',
            callePrincipal: dir.CallePrincipal || '',
            calleSecundaria: dir.CalleSecundaria || '',
            numeroCasa: dir.NumeroCasa || '',
            referencia: dir.Referencia || '',
            telefono: dir.Telefono || '',
            email: dir.Email || '',
            esPrincipal: !!dir.EsPrincipal
          }))
        });
      } catch (error) {
        console.error('Error al cargar cliente:', error);
        alert('Error al obtener datos del cliente.');
      }
    }
  };

  cargarCliente();
}, [modo, idCliente]);



  const handleClienteChange = (e) => {
  const { name, value } = e.target;

  if (['nombre', 'apellido'].includes(name) && !soloLetras(value)) return;

  setCliente({ ...cliente, [name]: value });
};

  const handleDireccionChange = (index, e) => {
  const nuevas = [...cliente.direcciones];
  const { name, value, type, checked } = e.target;

  // Validaciones específicas por campo
  if (['provincia', 'canton', 'parroquia', 'nombreEtiqueta'].includes(name) && !soloLetras(value)) return;
  if (name === 'telefono') {
  if (!soloNumeros(value) || value.length > 10) return;
}

// if (name === 'numeroCasa') {
//   if (!soloNumeros(value)) return;
// }

  if (name === 'esPrincipal' && checked) {
    nuevas.forEach((dir, i) => {
      dir.esPrincipal = i === index;
    });
  } else {
    nuevas[index][name] = type === 'checkbox' ? checked : value;
  }

  setCliente({ ...cliente, direcciones: nuevas });
};

  const addDireccion = () => {
    setCliente({
      ...cliente,
      direcciones: [
        ...cliente.direcciones,
        {
          nombreEtiqueta: '',
          provincia: '',
          canton: '',
          parroquia: '',
          callePrincipal: '',
          calleSecundaria: '',
          numeroCasa: '',
          referencia: '',
          telefono: '',
          email: '',
          esPrincipal: false,
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposObligatorios = [
      'nombreEtiqueta', 'provincia', 'canton',
      'callePrincipal', 'calleSecundaria', 'numeroCasa', 'telefono'
    ];

    const direccionValida = cliente.direcciones.every((dir, i) => {
      return camposObligatorios.every(campo => {
        const valor = dir[campo];
        if (!valor || valor.trim() === '') {
          alert(`Falta completar el campo obligatorio "${campo}" en la dirección #${i + 1}`);
          return false;
        }
        return true;
      });
    });

    if (!direccionValida) return;

    const principales = cliente.direcciones.filter(d => d.esPrincipal);
    if (principales.length !== 1) {
      alert('Debe haber exactamente una dirección principal.');
      return;
    }

    try {
      if (modo === 'crear') {
        await axios.post('http://localhost:3001/api/clientes', cliente);
        alert('Cliente creado correctamente.');
      } else {
        await axios.put(`http://localhost:3001/api/clientes/${idCliente}`, cliente);
        alert('Cliente actualizado correctamente.');
      }
      navigate('/');
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Ocurrió un error al guardar el cliente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{modo === 'crear' ? 'Crear Cliente' : 'Editar Cliente'}</h2>

      <input
        name="nombre"
        placeholder="Nombre"
        value={cliente.nombre}
        onChange={handleClienteChange}
        required
      />
      <input
        name="apellido"
        placeholder="Apellido"
        value={cliente.apellido}
        onChange={handleClienteChange}
        required
      />
      <input
        name="correo"
        placeholder="Correo electrónico"
        value={cliente.correo}
        onChange={handleClienteChange}
        required
      />

      <h3>Direcciones</h3>
      {cliente.direcciones.map((dir, i) => (
  <div key={i} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
    <input name="nombreEtiqueta" placeholder="Etiqueta" value={dir.nombreEtiqueta} onChange={(e) => handleDireccionChange(i, e)} required />
    <input name="provincia" placeholder="Provincia" value={dir.provincia} onChange={(e) => handleDireccionChange(i, e)} required />
    <input name="canton" placeholder="Cantón" value={dir.canton} onChange={(e) => handleDireccionChange(i, e)} required />
    <input name="parroquia" placeholder="Parroquia" value={dir.parroquia} onChange={(e) => handleDireccionChange(i, e)} />
    <input name="callePrincipal" placeholder="Calle Principal" value={dir.callePrincipal} onChange={(e) => handleDireccionChange(i, e)} required />
    <input name="calleSecundaria" placeholder="Calle Secundaria" value={dir.calleSecundaria} onChange={(e) => handleDireccionChange(i, e)} required />
    <input name="numeroCasa" placeholder="Número de Casa" value={dir.numeroCasa} onChange={(e) => handleDireccionChange(i, e)} required />
    <input name="referencia" placeholder="Referencia" value={dir.referencia} onChange={(e) => handleDireccionChange(i, e)} />
    <input name="telefono" placeholder="Teléfono" value={dir.telefono} onChange={(e) => handleDireccionChange(i, e)} required />
    <input name="email" placeholder="Correo" value={dir.email} onChange={(e) => handleDireccionChange(i, e)} />
    <label>
      ¿Principal?
      <input
        type="checkbox"
        name="esPrincipal"
        checked={dir.esPrincipal}
        onChange={(e) => handleDireccionChange(i, e)}
      />
    </label>
    <div style={{ textAlign: 'right' }}>
      <button type="button" onClick={() => eliminarDireccion(i)} style={{ color: 'red' }}>
        ❌ Eliminar Dirección
      </button>
    </div>
  </div>
))}

      <button type="button" onClick={addDireccion}>+ Agregar Dirección</button>
      <br />
      <button type="submit">{modo === 'crear' ? 'Guardar Cliente' : 'Actualizar Cliente'}</button>
    </form>
  );
};

export default ClienteForm;
