const { Router } = require('express');
const postDniType = require('../controllers/dniType/postDniType.js');
const getAllDniType = require('../controllers/dniType/getAllDniTipo.js');

const dniTipoRouter = Router();

dniTipoRouter.post('/', postDniType);
dniTipoRouter.get('/', getAllDniType);

module.exports = dniTipoRouter;