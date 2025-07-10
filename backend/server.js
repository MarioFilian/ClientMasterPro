// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/clientes', clienteRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
