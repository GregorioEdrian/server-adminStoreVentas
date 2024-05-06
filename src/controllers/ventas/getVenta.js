const { Venta, Usuario, Cliente, DetalleVenta, Producto } = require('../../db');
const getDate = require('../../utils/getDate');
require('dotenv').config();

const getVenta = async (req, res) => {
  try {
    const { num_fact } = req.params;
    
    const searchVenta = await Venta.findOne({ 
      where: { num_factura: num_fact, status: true },
      include: [
        {
          model: Usuario,
          as: "venta_usuario",
          attributes: { 
            exclude: ['password', 'level', 'delete', 'correo', 'direccion', 'telefono'] 
          },
        },
        {
          model: Cliente,
          as: "venta_cliente",
          attributes: { 
            exclude: ['status', 'direccion'] 
          },
        }
      ],
    })

    if(!searchVenta){
      return res.status(202).json({message: 'No existe venta registrada con este número de factura'});
    }

    const idVenta = searchVenta.dataValues.id
    const listDetalleVenta = []
    const detalleVenta = await DetalleVenta.findAll({
      where: {
        idVenta: idVenta
      }
    })
    for (let i = 0; i < detalleVenta.length; i++) {
      const ventaDetalle = detalleVenta[i].dataValues;
      const idProduct = ventaDetalle.productId;
      const product = await Producto.findByPk(idProduct, {
        attributes: [ 'id', 'nombre', 'descripcion']
      })
      ventaDetalle.product = product.dataValues;
      listDetalleVenta.push(ventaDetalle)
    }

    const venta = searchVenta.dataValues;
    venta.detalleVenta = listDetalleVenta;
    
    return res.status(200).json(venta)

  } catch (error) {
    return res.status(400).json({error: error})
  }
}

module.exports = getVenta;