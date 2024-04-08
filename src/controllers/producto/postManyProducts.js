const { Producto, Categoria, Presentacion, Departamento } = require('../../db');
const { Op } = require('sequelize');

async function postManyProduct(req, res){
  try {

    const { data } = req.body;
    
    const typesVentasPor = ['unit', 'divisible']
    
    if( !data || !(data.length > 0) ){
      return res.status(404).json({error: 'Falta enviar datos obligatorios o los datos son erroneos'});
    }

    let listProductCreate = []

    for(i=0; i < data.length; i++){
      const product = data[i];
      const findPresentacion = await Presentacion.findByPk(product.presentacion.id);
      if(findPresentacion === null){
        return res.status(404).json({error: 'Datos de la presentación del producto incorrectos'});
      }
      const findDepartamento = await Departamento.findByPk(product.departamento.id);
      if(findDepartamento === null){
        return res.status(404).json({error: 'Datos del departamento del producto incorrectos'});
      }
      const totalVMayor = product.p_venta_mayor * parseFloat((1 + (product.iva/100)).toFixed(2))
      const total_v_mayor = parseFloat(totalVMayor.toFixed(2));

      const producto = await Producto.create({
        codigo: product.codigo, nombre: product.nombre,
        descripcion: product.descripcion, lote: product.lote, 
        p_com_bulto: product.p_com_bulto, unidad_p_bulto: product.unidad_p_bulto, 
        p_venta_bulto: product.p_venta_bulto, p_venta_unidad: product.p_venta_unidad, 
        iva: product.iva, total_bulto: product.total_bulto, cantidad_unidad: product.cantidad_unidad, 
        img: product.img, observacion: product.observacion, presentacion: product.presentacion.id, 
        p_venta_mayor: product.p_venta_mayor, cant_min_mayoreo: product.cant_min_mayoreo, 
        total_v_mayor: total_v_mayor, venta_por: product.venta_por, departamento: product.departamento.id
      });

      const categorias = await Categoria.findAll({
        where: {
          id: {[Op.in]: product.categorias}
        }
      });
      await producto.addCategoria(categorias);

      const productcreated = await Producto.findByPk(producto.id, {
        attributes: { 
          exclude: ['presentacion', 'departamento'] 
        },
        include: [
          {
            model: Presentacion,
            as: "ProductoPresentacion"
          },
          {
            model: Departamento,
            as: "ProductoDepartamento"
          },
          {model: Categoria, through: {attributes: []}}
        ],
      });
      listProductCreate.push(productcreated)
    }
    
    return res.status(200).json(listProductCreate);    

  } catch (error) {
    return res.status(404).json({error: error.message});
  };  
};

module.exports =  postManyProduct;