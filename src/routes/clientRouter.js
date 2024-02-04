const { Router } = require('express');
const postNewClient = require('../controllers/cliente/postNewClient.js');
const getAllClient = require('../controllers/cliente/getAllClient.js');
const getClientDni = require('../controllers/cliente/getClientDni.js')

const clientRouter = Router();

clientRouter.post('/', postNewClient);
clientRouter.get('/dni/dni/:dni/idTipoDni/:idTipoDni', getClientDni);
clientRouter.get('/',  getAllClient);

module.exports = clientRouter;