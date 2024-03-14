const { Router } = require('express');
const { getDataUser } = require('../controllers/protectedUser/getDataUser');


const routerDataUser = Router();
routerDataUser.get('/', getDataUser);


module.exports = routerDataUser;