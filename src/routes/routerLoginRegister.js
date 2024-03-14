const {Router} = require('express');
const { postLoginUser } = require('../controllers/loginRegister/loginUser');
const { postRegisterUser } = require('../controllers/loginRegister/postRegister');
const { deleteSingOut } = require('../controllers/loginRegister/singOut');


const routerLoginRegister = Router();

routerLoginRegister.post('/register-user', postRegisterUser);
routerLoginRegister.post('/login', postLoginUser);
routerLoginRegister.delete('/sign-out', deleteSingOut)

module.exports = routerLoginRegister;