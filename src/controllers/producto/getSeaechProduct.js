const { Producto, Categoria, Presentacion, Departamento } = require('../../db');
const { Op } = require('sequelize');

async function getSeaechProduct(req, res){
  try {

    const  { wordSearch } = req.params;

    if(!wordSearch){
      return res.status(404).json({error: 'Debe enviar un valor a buscar'})
    };

    const productos = await Producto.findAll({
      where:{
        [Op.or]: [
          {
            codigo: {
              [Op.like]: `%${wordSearch}%`
            }
          },
          {
            nombre: {
              [Op.like]: `%${wordSearch}%`
            }
          },
          
        ]
      },
      attributes: {
        exclude: ['presentacion', 'lote', 'p_com_bulto', 'p_venta_bulto', 'p_venta_unidad', 'departamento'],
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

    const productosLista = [];
    productos.forEach(element => {
      productosLista.push(element.dataValues)
    });
    
    if(productos.length > 0){
      const listProduct = productosLista.filter((prod) => prod.delete === false)
      return res.status(200).json(listProduct);
    }else{
      return res.status(200).json([]);
    }
  } catch (error) {
    return res.status(400).json({error:error.message});
  }
};

module.exports = getSeaechProduct;