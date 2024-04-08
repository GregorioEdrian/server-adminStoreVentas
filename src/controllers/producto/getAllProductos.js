const { Producto, Categoria, Presentacion, Departamento } = require('../../db');

async function getAllProductos(req, res){
  try {
    const productos = await Producto.findAll({
      attributes: { 
        exclude: ['presentacion', 'departamento'] 
      },
      include:[
        {
          model: Presentacion,
          as: "ProductoPresentacion"
        },
        {
          model: Departamento,
          as: "ProductoDepartamento"
        },
        {
          model: Categoria, 
          through: {attributes: []}
        }
      ],
      option: { raw: true }
    });
    
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(400).json({error:error.message});
  }
};

module.exports = getAllProductos;