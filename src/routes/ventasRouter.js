const { Router } = require('express');
const getNumVenta = require('../controllers/ventas/getNumVenta.js');
const getRateDollar = require('../utils/getRateDollar.js');
const postVenta = require('../controllers/ventas/addVenta.js');
const ventasRouter = Router();

ventasRouter.get('/get-rate-dollar', getRateDollar);
ventasRouter.post('/new-venta', postVenta);
ventasRouter.get('/', getNumVenta);

module.exports = ventasRouter;