const { Producto, Departamento } = require('../../db')


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
        totalProducts: 0,
        totalProductsInStock: 0,
        totalEstimatedVenta: 0,
      }
      
      const listArrProductDepartaments = {}

      for(let i = 0; i < allDepartamento.length; i++){
        const departamento = allDepartamento[i].dataValues;
        const departamentoNombre = departamento.nombre        
        arrAllDepartamento.push(departamento)
        totalsProducts[departamentoNombre] = 0
        listArrProductDepartaments[departamentoNombre] = []
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
           
        let nStock = 0
        let totalVenta = 0
        for(let r = 0; r < lisProductsForDepartamento.length; r++){
          const prod = lisProductsForDepartamento[r]
          nStock = prod.total_unidades + nStock
          totalVenta = totalVenta + ( prod.total_unidades * prod.p_v_total_unidad )
        }
        totalsProducts.totalProductsInStock = totalsProducts.totalProductsInStock + nStock
        totalsProducts.totalEstimatedVenta = totalsProducts.totalEstimatedVenta + totalVenta
        totalsProducts[departNombre] = nStock
        const totalRegistrosIn = 'totalRegistrosIn' + `${departNombre}`
        const totalSellEstimateIn = 'totalSellEstimateIn' + `${departNombre}`
        totalsProducts[totalRegistrosIn] = n
        totalsProducts[totalSellEstimateIn] = totalVenta
        listArrProductDepartaments[departNombre] = lisProductsForDepartamento
      }
      
      return res.status(200).json({totalsProducts: totalsProducts, listArrProductDepartaments: listArrProductDepartaments})
    }
    if(!allProducts.length){
      res.status(202).json({message: 'No hay productos para mostrar estadisticas'})
    }
    if(!allDepartamento.length){
      res.status(202).json({message: 'No hay departamentos registrados con productos'})
    }
    return res.status(400).json({message: 'Algo ha salido mal'})

  } catch (error) {
    return res.status(404).json({error: error})
  }
}

module.exports = getSatactProducts;