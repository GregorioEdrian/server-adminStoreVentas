const { Presentacion } = require('../../db');

async function getAllPresentacion(req, res){
  try {
    const data = await Presentacion.findAll();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(404).json({error: error.messge});
  }
}

module.exports = getAllPresentacion;