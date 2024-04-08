const { Producto, Categoria, Presentacion, Departamento } = require('../../db');
const { Op } = require('sequelize');

async function addProducto(req, res){
  try {

    const {newProduct, presentacion, departamento } = req.body;
    var { codigo, 
      nombre, 
      descripcion, 
      lote, 
      p_com_bulto, 
      unidad_p_bulto, 
      p_venta_bulto, 
      p_venta_unidad, 
      iva, total_bulto, 
      cantidad_unidad, 
      img, observacion, 
      categorias, 
      p_venta_mayor, 
      cant_min_mayoreo,
      venta_por 
    } = newProduct

    const typesVentasPor = ['unit', 'divisible']
    
    if(!codigo || !nombre || !descripcion || p_com_bulto < 0  || unidad_p_bulto < 0  || p_venta_bulto < 0  || p_venta_unidad < 0  || iva < 0 ||  total_bulto < 0 || cantidad_unidad < 0 || p_venta_mayor < 0, cant_min_mayoreo < 0 || !typesVentasPor.includes(venta_por) ){
      return res.status(404).json({error: 'Falta enviar datos obligatorios o los datos son erroneos'});
    }

    const findPresentacion = await Presentacion.findByPk(presentacion.id);
    if(findPresentacion === null){
      return res.status(404).json({error: 'Datos de la presentación del producto incorrectos'});
    }

    const findDepartamento = await Departamento.findByPk(departamento.id);
    if(findDepartamento === null){
      return res.status(404).json({error: 'Datos del departamento del producto incorrectos'});
    }

    const totalVMayor = p_venta_mayor * parseFloat((1 + (iva/100)).toFixed(2))
    const total_v_mayor = (totalVMayor);
    
    const producto = await Producto.create({
      codigo: codigo, nombre: nombre,
      descripcion: descripcion, lote: lote, 
      p_com_bulto: p_com_bulto, unidad_p_bulto: unidad_p_bulto, 
      p_venta_bulto:p_venta_bulto, p_venta_unidad: p_venta_unidad, 
      iva:iva, total_bulto: total_bulto, cantidad_unidad: cantidad_unidad, 
      img:img, observacion:observacion, presentacion: presentacion.id, 
      p_venta_mayor: p_venta_mayor, cant_min_mayoreo: cant_min_mayoreo, 
      total_v_mayor: total_v_mayor, venta_por: venta_por, departamento: departamento.id
    });
    
    categorias = await Categoria.findAll({
      where: {
        id: {[Op.in]: categorias}
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

    return res.status(200).json(productcreated);

  } catch (error) {
    return res.status(404).json({error: error.message});
  };  
};

module.exports =  addProducto;