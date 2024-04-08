const { Departamento } = require('../../db');

async function getAllDepartamento(req, res){
  try {
    const data = await Departamento.findAll();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(404).json({error: error.messge});
  }
}

module.exports = getAllDepartamento;