const { Venta, Usuario } = require('../../db');
const { Op } = require('sequelize');
const getDate = require('../../utils/getDate');


async function getCutClose(req, res){
  const listDetalleVenta = [];
  try {
    const {initDay, endDay} = req.params;
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

    if(!initDay && !endDay){
      return res.status(200).json({error: 'indique un rango de fecha correcto'});
    }else{
      
      const init_day = new Date(initDay);
      const end_day = new Date(endDay);
      
      const ventas = await Venta.findAll({
        where: {
          fecha_venta: {
            [Op.between]: [ init_day, end_day]
          },
          ventaUsuario: user.id
        }
      });
      const lisData = []
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
        }
        
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({data : infoCuotClose})
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