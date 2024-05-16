const { DetalleVenta, Producto, TazaDolar } = require('../../db');
const getConfigCoinIsMlcOrRef = require('../../utils/getConfigCoinIsMlcOrRef')

async function addDetalleVenta(idProdu, idVenta, idTasaDolar, numItems, cant, listAgregados){
  try {
    const configCoin = getConfigCoinIsMlcOrRef()

    if(!idProdu || !idVenta || !idTasaDolar || typeof numItems !== 'number' || numItems <= 0, 
      typeof cant !== 'number' || cant <= 0){
      const error = new Error('Faltan datos para el rejistro del detalle de venta.');
      throw error;
    }
    
    let precioVentaDiaNoIva;
    let totalUsdCantidadNoIva;
    let totalMlcCantidadNoIva;
    let cant_min_mayoreo;
    let totalUsdCantidadConIva;
    let totalMlcCantidadConIva;
    let precioVentaDiaComIva;

    const producto = await Producto.findByPk(idProdu);
    const tasaDolar = await TazaDolar.findByPk(idTasaDolar);

    if (producto === null) {
      const error = new Error(`El producto ${idProdu} que intenta agregar al detalle no existe.`);
      throw error;
    }
    if(tasaDolar === null){
      const error = new Error(`La tasa del dolar de referencia no existe.`);
      throw error;
    }

    if(cant > producto.total_unidades){
      /* if(listAgregados.length > 0){
        for(const element of listAgregados){
          const rest_total_unidades = cant + producto.total_unidades;
          const rest_nuevaCantBulto = Math.floor(rest_total_unidades / producto.unidad_p_bulto);
          const rest_nuevaCantidadUnid = rest_total_unidades % producto.unidad_p_bulto;
          // Realiza la actualización en la base de datos
          await producto.update({ total_bulto: rest_nuevaCantBulto,
            cantidad_unidad: rest_nuevaCantidadUnid, total_unidades: rest_total_unidades 
          });
        }
      }  */  
      const error = new Error(`La cantidad de ${producto.nombre} a vender excede la cantidad disponible en inventario.`);
      throw error;
    }

    //=====================================================================

    if(!configCoin || configCoin === 'mlc'){     
      
      cant_min_mayoreo = producto.cant_min_mayoreo;

      if(cant >= cant_min_mayoreo && cant_min_mayoreo > 0){
        precioVentaDiaNoIva = producto.p_venta_mayor;
        precioVentaDiaComIva = producto.total_v_mayor;
      }else{
        precioVentaDiaNoIva = producto.p_venta_unidad;
        precioVentaDiaComIva = producto.p_v_total_unidad
      }
      totalMlcCantidadNoIva = precioVentaDiaNoIva * cant
      totalMlcCantidadConIva = precioVentaDiaComIva * cant;

      totalUsdCantidadNoIva = totalMlcCantidadNoIva / tasaDolar.tasa;    
      totalUsdCantidadConIva = totalMlcCantidadConIva / tasaDolar.tasa;
      /* precioVentaDiaComIva = precioVentaDiaNoIva * (1 + IVA_producto/100) */

      const detalleVenta = await DetalleVenta.create({
        cant: cant,
        numeroItems: numItems, 
        precioVentaDiaNoIva: precioVentaDiaNoIva,
        precioVentaDiaComIva: precioVentaDiaComIva,
        totalUsdCantidadNoIva: totalUsdCantidadNoIva,
        totalMlcCantidadNoIva: totalMlcCantidadNoIva,
        totalUsdCantidadConIva: totalUsdCantidadConIva,
        totalMlcCantidadConIva: totalMlcCantidadConIva,
        iva:producto.iva,
        productId: idProdu,
        idVenta: idVenta ? idVenta: null,
        idTasaDolar: idTasaDolar,
      });
      
      // Actualiza la cantidad del producto
      const total_unidades = producto.total_unidades - cant;
      const nuevaCantBulto = Math.floor(total_unidades / producto.unidad_p_bulto);
      const nuevaCantidadUnid = total_unidades % producto.unidad_p_bulto;
    
      // Realiza la actualización en la base de datos
      await producto.update({ total_bulto: nuevaCantBulto,
        cantidad_unidad: nuevaCantidadUnid, total_unidades: total_unidades 
      });
      return detalleVenta.dataValues;

    }else if(configCoin === 'ref'){

      cant_min_mayoreo = producto.cant_min_mayoreo;

      if(cant >= cant_min_mayoreo && cant_min_mayoreo > 0){
        precioVentaDiaNoIva = producto.p_venta_mayor;
        precioVentaDiaComIva = producto.total_v_mayor;
      }else{
        precioVentaDiaNoIva = producto.p_venta_unidad;
        precioVentaDiaComIva = producto.p_v_total_unidad
      }
      totalMlcCantidadNoIva = (precioVentaDiaNoIva * cant) * tasaDolar.tasa
      totalMlcCantidadConIva = (precioVentaDiaComIva * cant) * tasaDolar.tasa;

      totalUsdCantidadNoIva = (precioVentaDiaNoIva * cant);    
      totalUsdCantidadConIva = (precioVentaDiaComIva * cant);
      /* precioVentaDiaComIva = precioVentaDiaNoIva * (1 + IVA_producto/100) */

      const detalleVenta = await DetalleVenta.create({
        cant: cant,
        numeroItems: numItems, 
        precioVentaDiaNoIva: precioVentaDiaNoIva,
        precioVentaDiaComIva: precioVentaDiaComIva,
        totalUsdCantidadNoIva: totalUsdCantidadNoIva,
        totalMlcCantidadNoIva: totalMlcCantidadNoIva,
        totalUsdCantidadConIva: totalUsdCantidadConIva,
        totalMlcCantidadConIva: totalMlcCantidadConIva,
        iva:producto.iva,
        productId: idProdu,
        idVenta: idVenta ? idVenta: null,
        idTasaDolar: idTasaDolar,
      });
      
      // Actualiza la cantidad del producto
      const total_unidades = producto.total_unidades - cant;
      const nuevaCantBulto = Math.floor(total_unidades / producto.unidad_p_bulto);
      const nuevaCantidadUnid = total_unidades % producto.unidad_p_bulto;
    
      // Realiza la actualización en la base de datos
      await producto.update({ total_bulto: nuevaCantBulto,
        cantidad_unidad: nuevaCantidadUnid, total_unidades: total_unidades 
      });
      return detalleVenta.dataValues;
    }    
       
  } catch (error) {
    throw error; 
  }
}

module.exports = addDetalleVenta;