const addDetalleVenta = require('../detalleVenta/addDetalleVenta.js');
const { Venta, Usuario, Cliente, DetalleVenta, TazaDolar, Producto, Departamento } = require('../../db');
const getDate = require('../../utils/getDate');
require('dotenv').config();
const restoreStock = require('../../utils/restoreStock.js');

const {
  IGFT
} = process.env;

async function postVenta(req, res){
  const listDetalleVenta = [];
  try {
    const {listDataProduct, idUser, idClient, idTasaDolar, 
      pago_usd, pago_mlc_efectivo, pago_mlc_punto, pago_mlc_digital, idDepartamento} = req.body;

    if(!listDataProduct || !idUser || !idClient || !idTasaDolar || typeof pago_usd !== 'number' 
      || typeof pago_mlc_efectivo !== 'number'  || typeof pago_mlc_punto !== 'number'  
      || typeof pago_mlc_digital  !== 'number' || typeof idDepartamento !== 'number'){
      return res.status(400).json({error: 'Faltan datos para registrar la venta'});
    }
    if(pago_usd < 0 || pago_mlc_efectivo < 0 || pago_mlc_punto < 0 || pago_mlc_digital < 0){
      return res.status(400).json({error: 'Valores de pago no pueden ser negativos'});
    }
    const userData = await Usuario.findByPk(idUser);
    const clientData = await Cliente.findByPk(idClient);
    const departamento = await Departamento.findByPk(idDepartamento);
    if(!userData){
      return res.status(400).json({error: 'El usuario enviado no existe'});
    }
    if(!clientData){
      return res.status(400).json({error: 'El cliente enviado no existe'});
    }
    if(!departamento){
      return res.status(400).json({error: 'El departamento enviado no existe'});
    }

    const tasaRef = await TazaDolar.findByPk(idTasaDolar);
    if(!tasaRef){
      return res.status(400).json({ error : 'La tasa del dolar de referencia no existe.'});
    }

    
    let num_factura;
    let num_items = 0;
    let total_venta_mlc_noIva = 0;
    let total_venta_usd_noIva = 0;
    let total_venta_mlc_conIva = 0;
    let total_venta_usd_conIva = 0;
    let fecha_venta;
    let import_igtf;
    let total_Iva_Sale = 0;
    

     //obtaining  the dollar rate.
    const dataTasaDolar = await TazaDolar.findAll({
      attributes: ['id']
    });

    let tasaDolar;
    let mayorIdTasaDolar;
    if(dataTasaDolar.length === 0 || !dataTasaDolar){
      return res.status(400).json({ error : 'La tasa del dolar de referencia no existe.'});
    }else{      
      const dataIdToInt = dataTasaDolar.map(num => parseInt(num.dataValues.id, 10));
      mayorIdTasaDolar = Math.max(...dataIdToInt);
      tasaDolar = await TazaDolar.findByPk(mayorIdTasaDolar);
      tasaDolar = tasaDolar.dataValues.tasa;
      if(!tasaDolar){
        return res.status(400).json({ error : 'La tasa del dolar de referencia no existe.'});
      }else{
        if(parseInt(mayorIdTasaDolar, 10) != parseInt(idTasaDolar, 10)){
          return res.status(400).json({ error : 'La tasa del dolar de referencia no coincide con la ultima tasa registrada por favor verifique.'})
        }
      }
    }
    
    //building the sales detail list.
    for (const element of listDataProduct) {                
      const detalleVenta = await addDetalleVenta(element.id, null, idTasaDolar, element.numItems, element.cant, listDetalleVenta);
      listDetalleVenta.push(detalleVenta);
    }
    
    //sales totals calculations.        
    for(const element of listDetalleVenta){
      num_items = num_items + element.numeroItems;
      total_venta_mlc_noIva = total_venta_mlc_noIva + element.totalMlcCantidadNoIva;
      total_venta_usd_noIva = total_venta_usd_noIva + element.totalUsdCantidadNoIva;
      total_venta_mlc_conIva = total_venta_mlc_conIva + element.totalMlcCantidadConIva;
      total_venta_usd_conIva = total_venta_usd_conIva + element.totalUsdCantidadConIva;
      total_Iva_Sale = total_Iva_Sale + ( total_venta_mlc_conIva -  total_venta_mlc_noIva);
    };
    
    //obtaining  the invoice number.
    const numsFacturas = await Venta.findAll({
      attributes: ['num_factura']
    })
    if(numsFacturas.length === 0){
      num_factura = 1
    }else{      
      const numsFacturasInt = numsFacturas.map(num => parseInt(num.dataValues.num_factura, 10));
      const mayor = Math.max(...numsFacturasInt);
      num_factura = mayor + 1;
    }
    
    //obtaining the date of sale.
    fecha_venta = await getDate();

    //Calculating the cost in dollars and in local currency.
    //if the payment includes dollars or not.
    if(pago_usd > 0){
      import_igtf = pago_usd * (parseFloat(IGFT)/100);
    }else{
      import_igtf = 0;
    }
    
    //sales totals.
    const total_with_tax = total_venta_mlc_conIva + import_igtf * tasaDolar;
    const total_with_tax_usd = total_with_tax / tasaDolar;
    
    //compare total due with payment sent.
    const totalSent =  pago_usd * tasaDolar + pago_mlc_efectivo + pago_mlc_punto + pago_mlc_digital;
    
    if(parseFloat(total_with_tax.toFixed(2)) > parseFloat(totalSent.toFixed(2))){
      await restoreStock(listDetalleVenta)
      return res.status(404).json({error: 'El monto enviado a pagar es menor al monto requerido.'})
    }
    console.log(fecha_venta)
    const dataVenta = {
      num_factura: num_factura,
      num_items: num_items,
      total_venta_mlc_noIva: total_venta_mlc_noIva,
      total_venta_usd_noIva: total_venta_usd_noIva,
      total_venta_mlc_conIva: total_venta_mlc_conIva,
      total_venta_usd_conIva: total_venta_usd_conIva,
      fecha_venta: fecha_venta,
      total_Iva_Sale: total_Iva_Sale,
      import_igtf: import_igtf,
      subtotal_mlc: total_venta_mlc_noIva,
      total_mlc: total_with_tax,
      subtotal_usd: total_venta_usd_noIva,
      total_usd: total_with_tax_usd,      
      pago_usd: pago_usd,
      pago_mlc_efectivo: pago_mlc_efectivo,
      pago_mlc_punto: pago_mlc_punto,
      pago_mlc_digital: pago_mlc_digital,
      tasa_ref_venta: tasaDolar,
      ventaCliente: idClient,
      ventaUsuario: idUser,
      ventaDepartamento: idDepartamento,
      vuelto_mlc: totalSent - total_with_tax,
      vuelto_usd : (totalSent - total_with_tax) / tasaDolar,
    }

    
    const createVenta = await Venta.create(dataVenta)

    for (const element of listDetalleVenta) {               
      const updateDetalle = await DetalleVenta.findByPk(element.id);
      await updateDetalle.update({ idVenta: createVenta.id });
    }
    const idVenta = createVenta.dataValues.id;
    const resulVenta = await Venta.findByPk(idVenta, {
      include: [
        { model: Cliente, as: 'venta_cliente'},
        { model: Usuario, as: 'venta_usuario', attributes: {exclude: [ 'password', 'level', 'delete' ]}  }   
      ],
      attributes: { exclude: ['ventaCliente', 'ventaUsuario', 'clienteVenta', 'usuarioVenta'] }
    });
    
    const allDetalleVenta = await DetalleVenta.findAll({where: {  idVenta : idVenta },
      include: [
        { model: Producto, as: 'producto', 
        attributes: [ 'id', 'nombre', 'descripcion' ] },   
      ], 
      attributes: { exclude: ['idDetalleVenta', 'productId', 'idVenta', 'idTasaDolar'] }
    })

    return res.status(200).json({venta : resulVenta, detalleVenta: allDetalleVenta});

  } catch (error) {
    await restoreStock(listDetalleVenta)
    return res.status(400).json({ error : error.message})
  }
}

module.exports = postVenta;