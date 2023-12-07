const { Categoria } = require('../../db');

async function addCategoria(req, res){
  try {
    var {nombre } = req.body;    
    if(!nombre){
      return res.status(404).json({error: 'Falta enviar datos obligatorios'});
    }    
    const categoria = await Categoria.create({nombre: nombre});
    return res.status(200).json(categoria);

  } catch (error) {
    return res.status(404).json({error: error.message});
  };  
};

module.exports = addCategoria;