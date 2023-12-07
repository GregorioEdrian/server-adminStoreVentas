const { Presentacion } = require('../../db');

async function postPresentacion(req, res){
  try {
    const { nombre } = req.body;
    if(!nombre){
      return res.status(404).json({error: 'Falta enviar datos obligatorios'});
    }
    const presentacion = await Presentacion.create({nombre: nombre});
    return res.status(200).json(presentacion);
    
  } catch (error) {
    return res.status(404).json({error: error.message});
  }
}

module.exports = postPresentacion;