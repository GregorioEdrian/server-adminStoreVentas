const { Departamento } = require('../../db');

async function postDepartamento(req, res){
  try {
    const { nombre } = req.body;
    if(!nombre){
      return res.status(404).json({error: 'Falta enviar datos obligatorios'});
    }
    const departamento = await Departamento.create({nombre: nombre});
    return res.status(200).json(departamento);
    
  } catch (error) {
    return res.status(404).json({error: error.message});
  }
}

module.exports = postDepartamento;