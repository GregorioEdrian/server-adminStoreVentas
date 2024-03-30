const {Router} = require('express');
const { postLoginUser } = require('../controllers/loginRegister/loginUser');
const { postRegisterUser } = require('../controllers/loginRegister/postRegister');
const { deleteSingOut } = require('../controllers/loginRegister/singOut');
const { postRegisterFromRoot } = require('../controllers/loginRegister/registerFromRoot')

const routerLoginRegister = Router();

routerLoginRegister.post('/register-user', postRegisterUser);
routerLoginRegister.post('/register-user-root', postRegisterFromRoot);
routerLoginRegister.post('/login', postLoginUser);
routerLoginRegister.delete('/sign-out', deleteSingOut)

module.exports = routerLoginRegister;