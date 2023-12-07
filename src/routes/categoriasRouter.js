const express = require('express');
const addCategoria = require('../controllers/categoria/addCategoria.js');
const getAllCategorias = require('../controllers/categoria/getCategoria.js');
const updateCategoria = require('../controllers/categoria/updateCategoria.js');

const categoriasRouter = express.Router();

categoriasRouter.post('/', addCategoria);
categoriasRouter.get('/', getAllCategorias);
categoriasRouter.put('/', updateCategoria);

module.exports = categoriasRouter;