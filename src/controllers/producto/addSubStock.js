const { Producto, Presentacion, Categoria } = require('../../db');

async function addSubProduct(req, res){
  try {
    const {idProduct, cant, tipo} = req.body;
    const user = req.user;
    const tipos = ['unit', 'bulto']
    if(!idProduct || !cant){
      return res.status(400).json({error: 'Faltan datos obligatorios'})
    }

    if(!tipos.includes(tipo)){
      return res.status(400).json({error: 'El tipo de cantidad debe ser unitario o por bulto'})
    }

    if(cant < 0 && user.level !== 'root'){
      return res.status(400).json({error: 'Usuario no tiene atributos para restar productos de inventario'})
    }

    const product = await Producto.findByPk(idProduct)
    if (product === null) {
      const error = `El producto que intenta actualizar no existe en el registro.`
      return res.status(400).json({error: error})
    }

    let cantidad_unidad = product.cantidad_unidad;
    let total_bulto = product.total_bulto;
    let total_unidades = product.total_unidades;
    let unidad_p_bulto = product.unidad_p_bulto;

    if(tipo === 'unit'){
      if(cant < 0 && Math.abs(cant) > total_unidades){
        const error = `No se puede restar una cantidad mayor a la existente`
        return res.status(400).json({error: error})
      }
      if(cant < 0 && Math.abs(cant) <= cantidad_unidad){
        cantidad_unidad = cantidad_unidad + cant;
        total_unidades = total_unidades + cant;
      }else if(cant < 0 && Math.abs(cant) > cantidad_unidad){
        total_unidades = total_unidades + cant;
        const resto = total_unidades % unidad_p_bulto
        total_bulto = (total_unidades - resto) / unidad_p_bulto
        cantidad_unidad = total_unidades - (total_bulto * unidad_p_bulto)
      }else if(cant > 0){
        total_unidades = total_unidades + cant;
        const resto = total_unidades % unidad_p_bulto
        total_bulto = (total_unidades - resto) / unidad_p_bulto
        cantidad_unidad = total_unidades - (total_bulto * unidad_p_bulto)
      }
      
      const updateProduct = await Producto.update({
        cantidad_unidad: cantidad_unidad,
        total_unidades: total_unidades,
        total_bulto: total_bulto
      }, {
        where: {
          id: idProduct
        }
      });
      if(updateProduct[0] === 1){
        const productoUpdate = await Producto.findByPk(idProduct, {
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
    }else if(tipo === 'bulto'){
      if(cant > 0){
        total_bulto = total_bulto + cant
        total_unidades = (total_bulto * unidad_p_bulto) + cantidad_unidad;
      }else if(cant < 0 && Math.abs(cant) > total_bulto){
        const error = `No se puede restar una cantidad mayor a la existente`
        return res.status(400).json({error: error})
      }else if(cant < 0 && Math.abs(cant) < total_bulto){
        total_bulto = total_bulto + cant
        total_unidades = (total_bulto * unidad_p_bulto) + cantidad_unidad;
      }
      
      const updateProduct = await Producto.update({
        total_bulto: total_bulto,
        total_unidades: total_unidades
      }, {
        where: {
          id: idProduct
        }
      });
      
      if(updateProduct[0] === 1){
        const productoUpdate = await Producto.findByPk(idProduct, {
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
    }else{
      return res.status(400).json({error: 'El tipo de cantidad debe ser unitario o por bulto'})
    }

  } catch (error) {
    return res.status(400).json({error: error})
  }
} 

module.exports = addSubProduct;