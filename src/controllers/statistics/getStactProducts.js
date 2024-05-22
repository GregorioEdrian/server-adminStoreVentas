const { Producto, Departamento } = require('../../db')
const getAllVentasInLastThirtyDay = require('../../utils/getSellForThirtyDay')

async function getSatactProducts(req, res){
  try {

    const user = req.user;
    if(!user || user.level !== 'root'){
      return res.status(400).json({message: 'No tiene permisos para solicitar esta información'})
    }
    
    let allProducts = await Producto.findAll({ where: {
      delete: false
    } })        
    let allDepartamento = await Departamento.findAll()     
       
    if(allProducts.length && allDepartamento.length){

      const arrAllDepartamento = []
      const arrAllProducts = []

      const totalsProducts = {
        totalProductsIn:{},
        totalStockIn:{},
        totalStimateSellIn:{},
        totalProducts: 0,
        totalProductsInStock: 0,
        totalEstimatedVenta: 0,
      }

      for(let i = 0; i < allDepartamento.length; i++){
        const departamento = allDepartamento[i].dataValues; 
        arrAllDepartamento.push(departamento)
      }
      allDepartamento = null;

      for(let i = 0; i < allProducts.length; i++){
        const producto = allProducts[i].dataValues;
        arrAllProducts.push(producto)
      }
      allProducts = null; 
                  
      totalsProducts.totalProducts = arrAllProducts.length

      for(let k = 0; k < arrAllDepartamento.length; k++){
        const departId = arrAllDepartamento[k].id
        const departNombre = arrAllDepartamento[k].nombre        
        const lisProductsForDepartamento = arrAllProducts.filter((product) => product.departamento === departId )
                
        const n = lisProductsForDepartamento.length
        
        let totalStockIn = 0
        let totalStimateSellIn = 0
        for(let r = 0; r < lisProductsForDepartamento.length; r++){
          const prod = lisProductsForDepartamento[r]
          totalStockIn = prod.total_unidades + totalStockIn
          totalStimateSellIn = totalStimateSellIn + ( prod.total_unidades * prod.p_v_total_unidad )
        }
        
        totalsProducts.totalProductsInStock = totalsProducts.totalProductsInStock + totalStockIn
        totalsProducts.totalEstimatedVenta = parseFloat((totalsProducts.totalEstimatedVenta + totalStimateSellIn).toFixed(2))
        totalsProducts.totalProductsIn[departNombre] = n 
        totalsProducts.totalStockIn[departNombre] = totalStockIn
        totalsProducts.totalStimateSellIn[departNombre] = parseFloat((totalStimateSellIn).toFixed(2))
      } 

      const dataSells = await getAllVentasInLastThirtyDay()

      return res.status(200).json({totalsProducts: totalsProducts, dataSells: dataSells})
    }
    if(!allProducts.length){
      return res.status(202).json({message: 'No hay productos para mostrar estadisticas'})
    }
    if(!allDepartamento.length){
      return res.status(202).json({message: 'No hay departamentos registrados con productos'})
    }
    return res.status(400).json({message: 'Algo ha salido mal'})

  } catch (error) {
    return res.status(404).json({error: error})
  }
}

module.exports = getSatactProducts;