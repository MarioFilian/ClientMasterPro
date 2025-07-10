// routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/', clienteController.crearCliente);
router.get('/', clienteController.obtenerClientes);
router.put('/:id', clienteController.actualizarCliente);   // 🔄
router.delete('/:id', clienteController.eliminarCliente);  // ❌
router.get('/:id', clienteController.obtenerClientePorId);


module.exports = router;

