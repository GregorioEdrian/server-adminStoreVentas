const { Venta, DetalleVenta, Producto } = require('../../db');
require('dotenv').config();
const restoreStock = require('../../utils/restoreStock.js');

const deleteVenta = async (req, res) => {
  try {
    const { numbersell } = req.params;
    
    if(!numbersell || typeof parseInt(numbersell) !== 'number' || parseInt(numbersell) < 0 || parseInt(numbersell) !== parseFloat(numbersell) ){
      return res.status(404).json({error: 'Deve enviar un número de factura correcto'});
    }

    const seacrhVenta = await Venta.findOne({
      where: {
        num_factura: numbersell
      },
      include: 'detalleVenta'
    })
    if(!seacrhVenta){
      return res.status(400).json({error: 'No hay ventas asociadas a este número de factura'})
    }

    const idVenta = seacrhVenta.dataValues.id;
    const seacrhDetalleVenta = await DetalleVenta.findAll({
      where: {
        idVenta: idVenta
      }
    })

    const productVentas = []
    for (let i = 0; i < seacrhDetalleVenta.length; i++) {
      const element = seacrhDetalleVenta[i];
      productVentas.push(element.dataValues)
    }

    await restoreStock(productVentas)
    
    for(let i = 0; i < productVentas.length; i++){
      const id_detalle = productVentas[i].id
      await DetalleVenta.update({delete: true}, {
        where: {
          id: id_detalle
        }
      });
    }
    console.log('aqui')
    await Venta.update({status: false}, {
      where: {
        num_factura: numbersell
      },
    })

    return res.status(200).json({message: 'Venta eliminada correctamente'})

  } catch (error) {
    return res.status(404).json({error: error})
  }
}

module.exports = deleteVenta;