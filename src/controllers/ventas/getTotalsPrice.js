const { Producto, TazaDolar } = require('../../db');
const getConfigCoinIsMlcOrRef = require('../../utils/getConfigCoinIsMlcOrRef')

async function getTotalsPrice(req, res){
  try {
    const configCoin = getConfigCoinIsMlcOrRef()
    const { idRate, dataProduct } = req.body;
    if(!idRate || dataProduct.length === 0){
      return res.status(400).json({error: 'Faltan datos para la consulta'})
    }

    //obtaining  the dollar rate.
    const rateDollar = await TazaDolar.findOne({ where: { id: idRate } });
    if(!rateDollar){
      return res.status(400).json({error: 'la tasa de referencia no existe'});
    }
    const rateDollarDataValues = rateDollar.dataValues;
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
     
      if(parseInt(mayorIdTasaDolar, 10) != parseInt(idRate, 10)){
        return res.status(400).json({ error : 'La tasa del dolar de referencia no coincide con la ultima tasa registrada por favor verifique.'})
      }      
    }    

    let subTotal = 0;
    let total = 0;
    //=====================================

    for(const elem of dataProduct){
      const prod = await Producto.findOne({where: {id: elem.id}});
      if(!prod){
        return res.status(400).json({error: 'Uno de los productos a consultar no existe'});
      }else{
        const valueProduct = prod.dataValues;
        const cantSell = elem.cantSell;
        const numItems = elem.numItems
        
        if(cantSell >= valueProduct.cant_min_mayoreo && valueProduct.cant_min_mayoreo > 0){
          const subCostVenta = valueProduct.p_venta_mayor * cantSell;
          const totalCostVenta = valueProduct.total_v_mayor * cantSell;
          subTotal = subTotal + subCostVenta;
          total = total + totalCostVenta;
        }else{
          const subCostVenta = valueProduct.p_venta_unidad * cantSell;
          const totalCostVenta = valueProduct.p_v_total_unidad * cantSell;
          subTotal = subTotal + subCostVenta;
          total = total + totalCostVenta;
        }
        
      }
    }
    
    if(!configCoin || configCoin === 'mlc'){
      let totalFact_ref = parseFloat((total / tasaDolar).toFixed(2, 10));
      let subTotal_ref = parseFloat((subTotal / tasaDolar).toFixed(2, 10));

      const data = {
        subTotal: parseFloat(subTotal.toFixed(2, 10)),
        total : parseFloat(total.toFixed(2, 10)),
        subTotal_ref : subTotal_ref,
        totalFact_ref: totalFact_ref
      }
      return res.status(200).json(data);

    }else if(configCoin === 'ref'){
      let totalFact_ref = parseFloat((total).toFixed(2, 10));
      let subTotal_ref = parseFloat((subTotal).toFixed(2, 10));
      const dataSubTotal = subTotal * tasaDolar
      const dataTotal = total * tasaDolar

      const data = {
        subTotal: parseFloat(dataSubTotal.toFixed(2, 10)),
        total : parseFloat(dataTotal.toFixed(2, 10)),
        subTotal_ref : subTotal_ref,
        totalFact_ref: totalFact_ref
      }
      return res.status(200).json(data);
    }

    

  } catch (error) {
    return res.status(400).json({error: error})
  }
}

module.exports = getTotalsPrice;