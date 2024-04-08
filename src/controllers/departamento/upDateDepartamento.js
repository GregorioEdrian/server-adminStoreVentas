const { Departamneto } = require('../../db');

async function upDateDepartamento(req, res) {
  try {
    const { id, nombre } = req.body;

    if((typeof id !== 'number') | !nombre){
      return res.status(403).json({error: 'Faltan datos obligatorios'});
    }

    const updateDep = await Departamneto.update({nombre: nombre}, {
      where: {
        id: id
      }
    });
    if(updateDep[0] === 1){
      const depUpdate = await Departamneto.findOne({ where: { id: id } });
      return res.status(200).json(depUpdate);
    }else{
      return res.status(403).json({error: 'No se actualizo la categoía'});
    }

  } catch (error) {
    return res.status(403).json({error: error.message});
  }
}

module.exports = upDateDepartamento;