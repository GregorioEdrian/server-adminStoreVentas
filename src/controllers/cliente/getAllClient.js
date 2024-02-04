const { Cliente } = require('../../db');

async function getAllClient(req, res){

  try {
    const allClient = await Cliente.findAll();
    return res.status(200).json(allClient);
  } catch (error) {
    return res.status(400).json({error: error});
  }
};

module.exports = getAllClient;