const { Venta, Departamento } = require('../db') 
const { Op } = require('sequelize');
const axios = require('axios')

async function getAllVentasInLastThirtyDay(){
  try {
    let allDepartamento = await Departamento.findAll()
    
    let dataSells = []
    const arrAllDepartamento = []
    const { data } = await axios.get('https://worldtimeapi.org/api/timezone/America/Caracas')
    const currentDate = new Date(data.utc_datetime);
    
    const lessThirtyDay = new Date(currentDate);
    lessThirtyDay.setDate(currentDate.getDate() - 30);
    lessThirtyDay.setHours(0, 0, 0, 0);

    if(allDepartamento.length){
      for(let i = 0; i < allDepartamento.length; i++){
        const departamento = allDepartamento[i].dataValues; 
        arrAllDepartamento.push(departamento)
      }
      allDepartamento = null;
      
      for (let i = 0; i < 30; i++) {
        let arrAllVentas = []
        const init_day = new Date(lessThirtyDay);
        init_day.setDate(lessThirtyDay.getDate() + i)
        init_day.setHours(0, 0, 0, 0)
        const end_day = new Date(init_day)
        end_day.setHours(23, 59, 59, 0)

        let allVentas = await Venta.findAll({
          where: {
            fecha_venta: {
              [Op.between]: [ init_day, end_day]
            },
            status: true
          }
        });
        for (let v = 0; v < allVentas.length; v++) {
          const sells = allVentas[v].dataValues;
          arrAllVentas.push(sells)
        }

        const dia = String(end_day.getDate()).padStart(2, '0');
        const mes = String(end_day.getMonth() + 1).padStart(2, '0');
        const anio = String(end_day.getFullYear());
        
        const dataVent = {
          date: `${anio}-${mes}-${dia}`,
        }

        for (let j = 0; j < arrAllDepartamento.length; j++) {

          const depart = arrAllDepartamento[j];
          const idDepart = depart.id
          const nameDepart = depart.nombre 
          const ventForDepartamento = arrAllVentas.filter((vent) => idDepart === vent.ventaDepartamento)
          let totalSellsBs = 0
          let totalSellsRef = 0
          for (let r = 0; r < ventForDepartamento.length; r++) {
            const sells = ventForDepartamento[r]
            totalSellsBs = totalSellsBs + sells.total_venta_mlc_conIva,
            totalSellsRef = totalSellsRef + sells.total_venta_usd_conIva
          }
          dataVent[nameDepart + 'Bs'] = totalSellsBs
          dataVent[nameDepart + 'Ref'] = totalSellsRef
        }   
        dataSells.push(dataVent)
      }
    }

    return dataSells;
    
  } catch (error) {
    return error
  }
}

module.exports = getAllVentasInLastThirtyDay;