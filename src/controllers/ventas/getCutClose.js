const { Venta, DetalleVenta, Producto, Usuario, Departamento } = require('../../db');
const { Op } = require('sequelize');
const htmlCutClose = require('../pdfCreate/htmlCutClose');
const generatePdfCutClose = require('../../utils/generatePdfCutClose')

async function getCutClose(req, res){
  const listDetalleVenta = [];
  try {
    const {initDay, endDay, departamento} = req.params;
    const user = req.user;
    
    const infoCuotClose = {
      pago_usd : 0,
      pago_mlc_efectivo: 0,
      pago_mlc_punto: 0,
      pago_mlc_digital: 0,
      total_venta_usd: 0,
      total_venta_mlc: 0, 
      vuelto_mlc: 0,
      vuelto_usd: 0,
    }

    if(typeof departamento !== 'number' && departamento <= 0){
      return res.status(200).json({error: 'Departamento para el cierre incorrecto'});
    }

    let depart = await Departamento.findByPk(departamento, {
      attributes: ['nombre']
    });
    depart = depart.dataValues;

    if(!initDay || !endDay){
      return res.status(200).json({error: 'indique un rango de fecha correcto'});
    }else{
      
      const init_day = new Date(initDay);
      const end_day = new Date(endDay);
      
      const ventas = await Venta.findAll({
        where: {
          fecha_venta: {
            [Op.between]: [ init_day, end_day]
          },
          ventaDepartamento: departamento
        }
      });
      const lisData = []
      const listDetalleVenta = []
      if(ventas.length){
        ventas.forEach(element => {
          lisData.push(element.dataValues)
        });
        
        for(let j = 0; j < lisData.length; j++){
          const element = lisData[j];
          infoCuotClose.pago_usd = infoCuotClose.pago_usd + element.pago_usd;
          infoCuotClose.pago_mlc_efectivo = infoCuotClose.pago_mlc_efectivo + element.pago_mlc_efectivo;
          infoCuotClose.pago_mlc_punto = infoCuotClose.pago_mlc_punto + element.pago_mlc_punto;
          infoCuotClose.vuelto_mlc = infoCuotClose.vuelto_mlc + element.vuelto_mlc;
          infoCuotClose.vuelto_usd = infoCuotClose.vuelto_usd + element.vuelto_usd;
          infoCuotClose.total_venta_mlc = infoCuotClose.total_venta_mlc + element.total_venta_mlc_conIva
          infoCuotClose.total_venta_usd = infoCuotClose.total_venta_usd + element.total_venta_usd_conIva
          infoCuotClose.pago_mlc_digital = infoCuotClose.pago_mlc_digital + element.pago_mlc_digital
          const idVenta = element.id;               
      
          const DetallesVentas = await DetalleVenta.findAll({
            where: {
              idVenta: idVenta,
            },
            include: [
              {
                model: Producto,
                as: 'producto',
                attributes: ['id', 'descripcion'],
              },
              {
                model: Venta,
                as: 'venta',
                attributes: ['id', 'num_factura', 'fecha_venta', 
                'total_mlc', 'total_usd', 'pago_usd', 'pago_mlc_efectivo', 'pago_mlc_punto',
                'pago_mlc_digital', 'tasa_ref_venta', 'vuelto_mlc', 'vuelto_usd', 'ventaUsuario'
                ],
              },
            ],
          });

          if(DetallesVentas.length){
            for (let h = 0; h < DetallesVentas.length; h++) {
              const element = DetallesVentas[h];
              let detalle = element.dataValues;
              const producto = detalle.producto.dataValues;
              const venta = detalle.venta.dataValues;
              const user = await Usuario.findByPk(venta.ventaUsuario, {
                attributes: ['nombre']
              });
              detalle.user = user.dataValues
              detalle.producto = producto;
              detalle.venta = venta;
              listDetalleVenta.push(detalle)
            }
          } 
        }

        const DataVentasDetalles = [];
        for(let k = 0; k < lisData.length; k++){
          const venta = lisData[k];
          const arrVentaDetalle = listDetalleVenta.filter((detalle) => detalle.idVenta === venta.id);
          DataVentasDetalles.push(arrVentaDetalle)
        }
        const htmlAllData = htmlCutClose(DataVentasDetalles, initDay, endDay, depart.nombre, infoCuotClose)
        const bs64Pdf = await generatePdfCutClose(htmlAllData);
                
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({data : infoCuotClose, bs64pdf: bs64Pdf})

      }else{
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({data : infoCuotClose})
      };      
    }   
    
    /* return res.status(200).json({ventas}) */
  } catch (error) {
    return res.status(400).json({ error : error.message})
  }
}

module.exports = getCutClose;