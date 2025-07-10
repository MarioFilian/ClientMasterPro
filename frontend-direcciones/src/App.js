// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrearCliente from './pages/CrearCliente';
import ListaClientes from './pages/ListaClientes';
import EditarCliente from './pages/EditarCliente';
import './styles.css';


function App() {
  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        <h1>Gestión de Clientes</h1>
        <Routes>
          <Route path="/" element={<ListaClientes />} />
          <Route path="/crear" element={<CrearCliente />} />
          <Route path="/editar/:id" element={<EditarCliente />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;