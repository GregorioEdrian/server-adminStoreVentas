const express = require('express');

const postPresentacion = require('../controllers/presentacion/addPresentacion');
const getAllPresentacion = require('../controllers/presentacion/getPresentacion');
const updatePresentacion = require('../controllers/presentacion/updatePresentacion');

const presentacionRouter = express.Router();

presentacionRouter.post('/', postPresentacion);
presentacionRouter.get('/', getAllPresentacion);
presentacionRouter.put('/', updatePresentacion);

module.exports = presentacionRouter;