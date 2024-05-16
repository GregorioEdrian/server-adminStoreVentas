const { Categoria } = require('../../db');
const changeAllPriceToDollar = require('../../utils/changeAllPrice')

async function getAllCategorias(req, res){
  try {
    const categorias = await Categoria.findAll();
    await changeAllPriceToDollar(38)
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(404).json({error: error.messge});
  };
};

module.exports = getAllCategorias;