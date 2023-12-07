const { Presentacion } = require('../../db');

async function updatePresentacion(req, res) {
  try {
    const { id, nombre } = req.body;

    if((typeof id !== 'number') | !nombre){
      return res.status(403).json({error: 'Faltan datos obligatorios'});
    }

    const updatePre = await Presentacion.update({nombre: nombre}, {
      where: {
        id: id
      }
    });
    if(updatePre[0] === 1){
      const preUpdate = await Presentacion.findOne({ where: { id: id } });
      return res.status(200).json(preUpdate);
    }else{
      return res.status(403).json({error: 'No se actualizo la categoía'});
    }

  } catch (error) {
    return res.status(403).json({error: error.message});
  }
}

module.exports = updatePresentacion;