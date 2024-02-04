const { TipoDni } = require('../../db');

async function postDniType(req, res){
  try {
    const { tipo } = req.body;
    if(!tipo){
      return res.status(400).json({error: 'Se requiere el tipo de dni para registrar'});
    }


    const newDniType = await TipoDni.create({tipo: tipo.toUpperCase()});

    return res.status(200).json(newDniType);

  } catch (error) {
    return res.status(404).json({error: error.message});
  }
}

module.exports = postDniType;