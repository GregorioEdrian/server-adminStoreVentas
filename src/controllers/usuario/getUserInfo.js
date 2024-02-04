const { Usuario } = require('../../db');

async function getUser(req, res){
  try {
    const  { dni, idTipoDni } = req.params;  

    if(!dni.toString() || !idTipoDni){
      return res.status(400).json({error: 'debe proveer un DNI'});
    }

    data = {
      dni: dni.toString(),
      usuarioTipoDni: parseInt(idTipoDni)
    }
    
    const usuario = await Usuario.findOne({
      where: data, 
      attributes: ['nombre', 'level','usuarioTipoDni', 'id']
    });
      
    if(!usuario){
      return res.status(200).json({});
    }
    return res.status(200).json(usuario);

  } catch (error) {
    return res.status(400).json({error: error});
  }

}

module.exports = getUser;