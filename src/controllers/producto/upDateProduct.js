const { Producto, Categoria, Presentacion } = require('../../db');
const { Op } = require('sequelize');

async function updateProduct(req, res){
  try {
    var {id, codigo, nombre, descripcion, lote, p_com_bulto, unidad_p_bulto, p_venta_bulto, p_venta_unidad, iva, total_bulto, cantidad_unidad, img, observacion, categorias, presentacion } = req.body;
    
    if(!codigo || !nombre || !descripcion || p_com_bulto < 0  || unidad_p_bulto < 0  || p_venta_bulto < 0  || p_venta_unidad < 0  || iva < 0 ||  total_bulto < 0 || cantidad_unidad < 0 || !categorias || presentacion < 0)
    {
      return res.status(404).json({error: 'Falta enviar datos obligatorios o los datos son erroneos'});
    }

    const producto = await Producto.findByPk(id, {
      attributes: { 
        exclude: ['presentacion'] 
      },
      include: [
        {
          model: Presentacion,
          as: "ProductoPresentacion"
        },
        {model: Categoria, through: {attributes: []}}
      ],
    });
    if(!producto){
      return res.status(404).json({error: 'Producto id no existe'});
    }

    const dataProducto = {
      codigo: codigo, nombre: nombre,
      descripcion: descripcion, lote: lote, p_com_bulto: p_com_bulto, unidad_p_bulto: unidad_p_bulto, p_venta_bulto:p_venta_bulto, p_venta_unidad: p_venta_unidad, iva:iva, total_bulto: total_bulto, cantidad_unidad: cantidad_unidad, img:img, observacion:observacion, presentacion: presentacion};
    
      const updateProd = await Producto.update({...dataProducto}, {
        where: {
          id: id
        }
      });

      if(updateProd[0] === 1){
        
        categorias = await Categoria.findAll({
          where: {
            id: {[Op.in]: categorias}
          }
        });

        const removeCategorias = await  producto.getCategoria();
        
        await producto.removeCategoria(removeCategorias);
        await producto.addCategoria(categorias); 

        const productoUpdate = await Producto.findByPk(id, {
          attributes: { 
            exclude: ['presentacion'] 
          },
          include: [
            {
              model: Presentacion,
              as: "ProductoPresentacion"
            },
            {model: Categoria, through: {attributes: []}}
          ],
        });

        return res.status(200).json(productoUpdate);
      }else{
        return res.status(403).json({error: 'No se actualizo el producto'});
      }
  } catch (error) {
    return res.status(400).json({error: error.message});
  }
}

module.exports = updateProduct;