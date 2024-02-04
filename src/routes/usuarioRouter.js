const { Router } = require('express');
const getUser = require('../controllers/usuario/getUserInfo.js');


const usuarioRouter = Router();

usuarioRouter.get('/dni/dni/:dni/idTipoDni/:idTipoDni', getUser);

module.exports = usuarioRouter;