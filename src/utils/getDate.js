const axios = require('axios');

async function getDate(){
  try {
   
    //const { data } = await axios.get('https://worldtimeapi.org/api/timezone/America/Caracas'); data.utc_datetime
    /* const data = await response.json(); */
    const currentDate = new Date();
    //obtener la hora UTC
    const hora = String(currentDate.getUTCHours()).padStart(2, '0');
    const minutos = String(currentDate.getUTCMinutes()).padStart(2, '0');
    const segundos = String(currentDate.getUTCSeconds()).padStart(2, '0');
    //obtener la fecha
    const dia = String(currentDate.getUTCDate()).padStart(2, '0');
    const mes = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    const anio = String(currentDate.getUTCFullYear());
    //data
    const fecha = new Date(`${anio}-${mes}-${dia}T${hora}:${minutos}:${segundos}+0000`);
      
    return fecha;
  } catch (error) {
    return res.status(400).json({error: error});
  }
}

module.exports = getDate;