const { Categoria } = require('../../db');

async function updateCategoria(req, res) {
  try {
    const { id, nombre } = req.body;
    if((typeof id !== 'number') | !nombre){
      return res.status(403).json({error: 'Faltan datos obligatorios'});
    }

    const updateCat = await Categoria.update({nombre: nombre}, {
      where: {
        id: id
      }
    });
    if(updateCat[0] === 1){
      const catUpdate = await Categoria.findOne({ where: { id: id } });
      return res.status(200).json(catUpdate);
    }else{
      return res.status(403).json({error: 'No se actualizo la categoía'});
    }

  } catch (error) {
    return res.status(403).json({error: error.message});
  }
}

module.exports = updateCategoria;