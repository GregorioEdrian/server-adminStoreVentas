//Ruta para la table productos.
const express = require('express');
const  addProducto  = require('../controllers/producto/addProduct.js');
const getAllProductos = require('../controllers/producto/getAllProductos.js');
const updateProduct = require('../controllers/producto/upDateProduct.js');

const productRouter = express.Router();
// TODAS LAS REQ QUE LLEGUEN A ESTE ARCHIVO TIENEN EL "/producto" IMPLICITO

//para llegar a la ruta 3001/producto/"lo que se necesita";
productRouter.post('/', addProducto);
productRouter.get('/', getAllProductos);
productRouter.put('/', updateProduct);


module.exports = productRouter;