const express = require('express');

const postDepartamento = require('../controllers/departamento/postDepartamento');
const getAllDepartamento = require('../controllers/departamento/getDepartamento');
const upDateDepartamento = require('../controllers/departamento/upDateDepartamento');

const routerDepartamento = express.Router();

routerDepartamento.post('/', postDepartamento);
routerDepartamento.get('/', getAllDepartamento);
routerDepartamento.put('/', upDateDepartamento);

module.exports = routerDepartamento;