const { Router } = require('express')
const getNumVenta = require('../controllers/ventas/getNumVenta.js')
const getRateDollar = require('../utils/getRateDollar.js')
const postVenta = require('../controllers/ventas/addVenta.js')
const getTotalsPrice = require('../controllers/ventas/getTotalsPrice.js')
const getCutClose = require('../controllers/ventas/getCutClose.js')
const createPDFCutClose = require('../controllers/pdfCreate/pdfCutClose.js')
const deleteVenta = require('../controllers/ventas/deleteVenta.js')
const getVenta = require('../controllers/ventas/getVenta.js')

const ventasRouter = Router();

ventasRouter.get('/get-rate-dollar', getRateDollar);
ventasRouter.post('/new-venta', postVenta);
ventasRouter.post('/get-totals', getTotalsPrice);
ventasRouter.post('/get-pdf-cut-close', createPDFCutClose);
ventasRouter.delete('/delete-sell/numbersell/:numbersell', deleteVenta)
ventasRouter.get('/cut-close/initDay/:initDay/endDay/:endDay/departamento/:departamento', getCutClose);
ventasRouter.get('/get-venta/num_fact/:num_fact', getVenta);
ventasRouter.get('/', getNumVenta);

module.exports = ventasRouter;