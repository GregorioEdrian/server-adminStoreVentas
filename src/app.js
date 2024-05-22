const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const { authenticate } = require('./auth/athenticate');

//Require All Routes.
const productRouter = require('./routes/productosRouter.js')
const categoriasRouter = require('./routes/categoriasRouter.js');
const presentacionRouter = require('./routes/presentacionRouter.js');
const clientRouter = require('./routes/clientRouter.js');
const usuarioRouter = require('./routes/usuarioRouter.js');
const dniTipoRouter = require('./routes/dniTipoRouter.js');
const ventasRouter = require('./routes/ventasRouter.js');
const routerLoginRegister = require('./routes/routerLoginRegister.js');
const tokenRouter = require('./routes/routerToken.js');
const routerDataUser = require('./routes/routerProtecteDateUser')
const routerDepartamento = require('./routes/routerDepartamento.js')

require('./db.js');

const server = express();

server.name = 'Magnament Inventari';

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(cors({
  origin: ['http://localhost:3000', 'https://admin-ventas-mukafe.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept',  'Authorization']
}));

//server.use('/', routes);
server.use('/data-user', authenticate, routerDataUser);

server.use('/categorias', categoriasRouter);
server.use('/productos', authenticate ,productRouter);
server.use('/presentacion', presentacionRouter);
server.use('/departamento', routerDepartamento);
server.use('/tipoDni', dniTipoRouter);
server.use('/cliente', clientRouter);
server.use('/venta', authenticate, ventasRouter);
server.use('/usuario', usuarioRouter);
server.use('/sign-in-out', routerLoginRegister);
server.use('/token', tokenRouter);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
