/* //Variablesd deEntorno
const PORT_LISTEN = process.env.PORT_LISTEN;

//import Routes
const productsRouters = require('./routes/productos');
const categoriasRouter = require('./routes/categorias');


//Create server
const app = express();


// Middlewars
app.use(express.json()); // para poder recibir JSON por req.body


// Permisos -> Cors
app.use(cors()); // Habilito las CORS para que cualquier origen pueda enviar solicitud a mi servidor

// Routers --> Que rutas voy a usar
app.use("/product/", productsRouters);
app.use("/categorias/", categoriasRouter);

app.get("/health-check", (req, res) => {
  res.send("Working");
});

app.listen(PORT_LISTEN, ()=>{
  console.log(`Runing on PORT ${PORT_LISTEN}`)
}); */
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { DB_fORCE, DB_HOST } = process.env;
const dbForce = DB_fORCE == '0' ? false : true;
const defaultDniType = require('./src/controllers/dniType/defaultTipoDni.js');
const clientDefaultSeeder = require('./src/utils/clientDefaultSeeder.js');
//const InitializateDataModels = require('./src/middleware/index.js');

// Syncing all the models at once.
/* conn.sync({ force: true }).then(() => {
  InitializateDataModels().then(() => {
      server.listen(3001, () => {
      console.log('%s listening at 3001'); // eslint-disable-line no-console
    });
  });  
}); */

const port = process.env.PORT || 4000
const portLocalhost = 3001
const getPort = DB_HOST === 'localhost' ? portLocalhost : port

conn.sync({ force: dbForce }).then(() => {
  defaultDniType().then(() => {
    clientDefaultSeeder().then(()=>{
      server.listen(getPort, "0.0.0.0", () => {
      console.log(`%s listening at ${getPort}`); // eslint-disable-line no-console
      });    
    });    
  });  
});
