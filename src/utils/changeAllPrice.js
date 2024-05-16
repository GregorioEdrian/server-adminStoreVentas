const { Producto } = require('../db')

async function changeAllPriceToDollar(rate){
  let tasa ;
  if(!rate){
    tasa = 380
  }else{
    tasa = rate
  }
  
  let allProducts = await Producto.findAll();
  const lisProduct = []
  for(let i = 0; i < allProducts.length; i++){
    //console.log(allProducts[i].dataValues)
    const prod = allProducts[i].dataValues;
    lisProduct.push(prod)
  }
  allProducts = null
  for (let j = 0; j < lisProduct.length; j++) {
    const prod = lisProduct[j];
    const idProdu = prod.id
    const dataUpdate = {
      p_venta_bulto : prod.p_venta_bulto / tasa,
      p_venta_unidad : prod.p_venta_unidad / tasa,
      p_venta_mayor : prod.p_venta_mayor / tasa,
      p_v_total_bulto : prod.p_v_total_bulto / tasa, 
      p_v_total_unidad : prod.p_v_total_unidad / tasa,
      total_v_mayor : prod.total_v_mayor / tasa
    }
    
    const updateProduct = await Producto.update({...dataUpdate}, {
      where: {
        id: idProdu
      }
    });
  }
}

module.exports = changeAllPriceToDollar;