const { Venta } = require('../../db');

async function getNumVenta(req, res){
  try {
    
    const numsFacturas = await Venta.findAll({
      attributes: ['num_factura']
    })
    if(numsFacturas.length === 0 || !numsFacturas){
      return res.status(200).json(1)
    }
    const numsFacturasInt = numsFacturas.map(num => parseInt(num.dataValues.num_factura, 10));
    const mayor = Math.max(...numsFacturasInt);
    const valorFactura = mayor + 1;
    return res.status(200).json(valorFactura)

  } catch (error) {
    return res.status(400).json({error: error});
  }

}

module.exports = getNumVenta;