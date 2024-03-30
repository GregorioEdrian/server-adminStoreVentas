const axios = require('axios');
const cheerio = require('cheerio');
const { TazaDolar } = require('../db');
const https = require('https');

async function getRateDollar(req, res){
  try {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    const url = 'https://www.bcv.org.ve/';

    const response = await axios.get(url, { httpsAgent });
    const html = response.data;
    const $ = cheerio.load(html);
    const dollarElement = $('#dolar > div > div > div.col-sm-6.col-xs-6.centrado > strong');
    const rateDollar = dollarElement.text();
    const textRateDollar = rateDollar.trim().replace(',', '.');
    const numberRateDolar = parseFloat(textRateDollar);

    if(!numberRateDolar){
      return res.status(404).json({error: 'no se pudo obtener la tasa del dolar'});
    }

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
    const dataTasaDollar = {tasa: Number(numberRateDolar.toFixed(2)), fecha: fecha}
    const dataMoreRecent = await TazaDolar.findOne({order: [['fecha', 'DESC']]});

    if(!dataMoreRecent){
      const newTasaDolar = await TazaDolar.create(dataTasaDollar); 
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(newTasaDolar);     
    }else{
      const fechaDataRate = new Date(dataMoreRecent.dataValues.fecha);
      const anio1 = fechaDataRate.getFullYear();
      const mes1 = fechaDataRate.getMonth();
      const dia1 = fechaDataRate.getDate();

      // Extraer año, mes y día de la segunda fecha
      const anio2 = fecha.getFullYear();
      const mes2 = fecha.getMonth();
      const dia2 = fecha.getDate();

      if (anio1 === anio2 && mes1 === mes2 && dia1 === dia2) {
        const horaReferencia = new Date(fechaDataRate);
        horaReferencia.setHours(12, 0, 0, 0);
        if (fechaDataRate.getHours() < horaReferencia.getHours() && fecha.getHours() < horaReferencia.getHours()) {
          res.setHeader('Cache-Control', 'no-store');
          return res.status(200).json(dataMoreRecent);
        } else if (fechaDataRate.getHours() > horaReferencia.getHours() && fecha.getHours() > horaReferencia.getHours()) {
          return res.status(200).json(dataMoreRecent);
        }else if (fechaDataRate.getHours() < horaReferencia.getHours() && fecha.getHours() > horaReferencia.getHours()) {
          const newTasaDolar = await TazaDolar.create(dataTasaDollar);
          res.setHeader('Cache-Control', 'no-store');
          return res.status(200).json(newTasaDolar);
        } 
      } else if (anio1 > anio2 || (anio1 === anio2 && mes1 > mes2) || (anio1 === anio2 && mes1 === mes2 && dia1 > dia2)) {
        return res.status(400).json({error: 'La fecha de la petición es inferior a ultima fecha registrada'});
      } else {
        const newTasaDolar = await TazaDolar.create(dataTasaDollar);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json(newTasaDolar);
      }
    }
    res.setHeader('Cache-Control', 'no-store');  
    return res.status(200).json(dataMoreRecent);

  } catch (error) {
    return res.status(400).json({error: error});
  }
}

module.exports = getRateDollar;