const { Producto, DetalleVenta } = require('../db');

async function restoreStock(listProduct){
  try {
    for(const productDetalle of listProduct){
      const producto = await Producto.findByPk(productDetalle.productId);
      const rest_total_unidades = productDetalle.cant + producto.total_unidades;
      const rest_nuevaCantBulto = Math.floor(rest_total_unidades / producto.unidad_p_bulto);
      const rest_nuevaCantidadUnid = rest_total_unidades % producto.unidad_p_bulto;
      // Realiza la actualización en la base de datos
      await producto.update({ total_bulto: rest_nuevaCantBulto,
        cantidad_unidad: rest_nuevaCantidadUnid, total_unidades: rest_total_unidades 
      });
      const detalleVenta = await DetalleVenta.findByPk(productDetalle.id);
      await detalleVenta.update({delete: true});
    }
  } catch (error) {
    return error
  }
}

module.exports = restoreStock;