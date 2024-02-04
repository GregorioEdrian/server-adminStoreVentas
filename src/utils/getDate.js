const axios = require('axios');

async function getDate(){
  try {
   
    const { data } = await axios.get('https://worldtimeapi.org/api/timezone/America/Caracas');
    /* const data = await response.json(); */
    const currentDate = new Date(data.utc_datetime);
    //obtener la hora
    const hora = String(currentDate.getHours()).padStart(2, '0');
    const minutos = String(currentDate.getMinutes()).padStart(2, '0');
    const segundos = String(currentDate.getSeconds()).padStart(2, '0');
    //obtener la fecha
    const dia = String(currentDate.getDate()).padStart(2, '0');
    const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
    const anio = String(currentDate.getFullYear());
    //data
    const fecha = new Date(`${anio}-${mes}-${dia}T${hora}:${minutos}:${segundos}`);
      
    return fecha;
  } catch (error) {
    return res.status(400).json({error: error});
  }
}

module.exports = getDate;