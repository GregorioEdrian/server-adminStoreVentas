const { Router } = require('express');
const getNumVenta = require('../controllers/ventas/getNumVenta.js');
const getRateDollar = require('../utils/getRateDollar.js');
const postVenta = require('../controllers/ventas/addVenta.js');
const getTotalsPrice = require('../controllers/ventas/getTotalsPrice.js');
const ventasRouter = Router();

ventasRouter.get('/get-rate-dollar', getRateDollar);
ventasRouter.post('/new-venta', postVenta);
ventasRouter.post('/get-totals', getTotalsPrice);
ventasRouter.get('/', getNumVenta);

module.exports = ventasRouter;