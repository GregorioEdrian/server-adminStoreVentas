const { Cliente } = require('../../db');

async function getClientDni(req, res){

  try {
    const  { dni, idTipoDni } = req.params;   

    if(!dni.toString() || !idTipoDni){
      return res.status(400).json({error: 'debe proveer un DNI'});
    }

    data = {
      dni: dni.toString(),
      clienteTipoDni: parseInt(idTipoDni)
    }
    
    const client = await Cliente.findOne({where: data });

    if(!client){
      return res.status(200).json({});
    }
    return res.status(200).json(client);
  } catch (error) {
    return res.status(400).json({error: error});
  }
};

module.exports = getClientDni;