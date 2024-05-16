const { Categoria } = require('../../db')

async function getAllCategorias(req, res){
  try {
    const categorias = await Categoria.findAll();
    
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(404).json({error: error.messge});
  };
};

module.exports = getAllCategorias;