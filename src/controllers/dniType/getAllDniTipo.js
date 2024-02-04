const { TipoDni } = require('../../db');

async function getAllDniType(req, res){
  try {
    
    const allDniType = await TipoDni.findAll();

    return res.status(200).json(allDniType);

  } catch (error) {
    return res.status(404).json({error: error.message});
  }
}

module.exports = getAllDniType;