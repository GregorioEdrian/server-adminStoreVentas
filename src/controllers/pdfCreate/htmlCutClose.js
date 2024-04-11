const moment = require('moment-timezone');

const htmlCutClose = (data, initDay, endDay, departamento, infoCuotClose) => {
  
  const getDateMoment = (date) => {
    const fechaModificada = moment.utc(date).tz('America/Caracas');
    const fechaFormateada = fechaModificada.format('YYYY-MM-DD hh:mm:ss');
    return fechaFormateada
  }

  const getHtmlDetailVenta = (arrDetail) => {
    const venta = arrDetail[0].venta;
    const nrows = arrDetail.length;

    const fechaUTC = venta.fecha_venta;
    const fechaModificada = moment.utc(fechaUTC).tz('America/Caracas');
    const fechaFormateada = fechaModificada.format('YYYY-MM-DD hh:mm:ss');
        
    let htmlString = '';

    for(let i = 0; i < nrows; i ++){
      const detalle = arrDetail[i];
      const rowHtml = `
        <tr style="font-size: 10px;">
          <td style="border: 1px #000000 solid; padding: 3px; width: '113px';">${fechaFormateada}</td>
          <td style="border: 1px #000000 solid; padding: 3px; width: '113px';">${detalle.user.nombre}</td>
          <td style="border: 1px #000000 solid; padding: 3px; width: '226px';">${detalle.producto.descripcion}</td>
          <td style="border: 1px #000000 solid; padding: 3px; width: '92px';">${(detalle.cant).toFixed(3)}</td>
          <td style="border: 1px #000000 solid; padding: 3px; width: '92px';">${(detalle.totalMlcCantidadConIva).toFixed(2)}Bs.</td>
          <td style="border: 1px #000000 solid; padding: 3px; width: '92px';">${(detalle.totalUsdCantidadConIva).toFixed(2)}Ref.</td>
          <td style="border: 1px #000000 solid; padding: 3px; width: '92px';">${(venta.tasa_ref_venta).toFixed(2)}</td>
        </tr>
      `
      htmlString = htmlString + rowHtml;
    }
    const totalsHTML = `
      <tr style="background: #dcdcdc; font-size: 10px;">
        <td colspan="2" style="border: 1px #000000 solid; padding: 3px;">T. Venta: ${(venta.total_mlc).toFixed(2)}BS. / ${(venta.total_usd).toFixed(2)}$.</td>
        <td colspan="3" style="border: 1px #000000 solid; padding: 3px;">Pg. Efect. ${(venta.pago_mlc_efectivo).toFixed(2)}Bs. / ${(venta.pago_usd).toFixed(2)}$. - Punto DV. ${(venta.pago_mlc_punto).toFixed(2)} - P. Movil. ${(venta.pago_mlc_digital).toFixed(2)}</td>
        <td colspan="2" style="border: 1px #000000 solid; padding: 3px;">Cambio. ${(venta.vuelto_mlc).toFixed(2)}BS. / ${(venta.vuelto_usd).toFixed(2)}$.</td>
      </tr>
    `
    htmlString = htmlString + totalsHTML
    return htmlString
  }

  const getAllRows = () => {
    let allRowsHtml = ''
    for(let j = 0; j < data.length; j++){
      const arrDetail = data[j];
      const arrHtml = getHtmlDetailVenta(arrDetail);
      allRowsHtml = allRowsHtml + arrHtml;
    }
    return allRowsHtml;
  }


  return ` 
  <!DOCTYPE html>
  <html lang="es">

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>Browser</title>
  </head>

  <body>   
    <h5>Corte de ventas en el rango de fechas (${getDateMoment(initDay)} al ${getDateMoment(endDay)})</h5>  
    <p>Reporte correspondiente a ${departamento.toUpperCase()}</p>
    <div style="display: flex; justify-content: center; flex-direction: column ;min-width: 750px;">
      <table style="border: 1px #000000 solid; border-collapse: collapse; min-width: 733px; ">
        <thead>
          <tr style="background: #dcdcdc; font-size: 10px;">
            <th style="border: 1px #000000 solid; border-collapse: collapse; padding: 3px; width: '113px';">Fecha</th>
            <th style="border: 1px #000000 solid; border-collapse: collapse; padding: 3px; width: '113px';">Vendedor</th>
            <th style="border: 1px #000000 solid; border-collapse: collapse; padding: 3px; width: '226px';">Prod. Descrip.</th>
            <th style="border: 1px #000000 solid; border-collapse: collapse; padding: 3px; width: '92px';">Cantidad</th>
            <th style="border: 1px #000000 solid; border-collapse: collapse; padding: 3px; width: '92px';">Total BS</th>
            <th style="border: 1px #000000 solid; border-collapse: collapse; padding: 3px; width: '92px';">Total Ref</th>
            <th style="border: 1px #000000 solid; border-collapse: collapse; padding: 3px; width: '92px';">Tasa</th>
          </tr>
        </thead>
        <tbody style="min-width: '820px'">
          ${getAllRows()}
        </tbody>
      </table>

      <div style="border: 1px solid rgba(0,0,0,0.3); min-width: 733px; margin: 5px 0;"></div>

      <div style="display: flex; justify-content: center; min-width: 733px; margin: 5px 0;">
        <p>Total vendido en el rango de fecha seleccionado ${(infoCuotClose.total_venta_mlc).toFixed(2)}Bs. 
        equivalente a ${(infoCuotClose.total_venta_usd).toFixed(2)}</p>        
      </div>

      <div style="border: 1px solid rgba(0,0,0,0.3); min-width: 733px;  margin: 5px 0;"></div>
            
    </div>
    <script src="script.js"></script>
  </body>
  
  </html>
  `
}

module.exports = htmlCutClose