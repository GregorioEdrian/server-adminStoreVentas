const { Producto, Categoria, Presentacion } = require('../../db');
const { Op } = require('sequelize');

async function addProducto(req, res){
  try {
    const {newProduct, presentacion } = req.body;
    var { codigo, nombre, descripcion, lote, p_com_bulto, unidad_p_bulto, p_venta_bulto, p_venta_unidad, iva, total_bulto, cantidad_unidad, img, observacion, categorias } = newProduct

    
    if(!codigo || !nombre || !descripcion || p_com_bulto < 0  || unidad_p_bulto < 0  || p_venta_bulto < 0  || p_venta_unidad < 0  || iva < 0 ||  total_bulto < 0 || cantidad_unidad < 0){
      return res.status(404).json({error: 'Falta enviar datos obligatorios o los datos son erroneos'});
    }

    const findPresentacion = await Presentacion.findByPk(presentacion.id);
    if(findPresentacion === null){
      return res.status(404).json({error: 'Datos de la presentación del producto incorrectos'});
    }
    
    const producto = await Producto.create({
      codigo: codigo, nombre: nombre,
      descripcion: descripcion, lote: lote, p_com_bulto: p_com_bulto, unidad_p_bulto: unidad_p_bulto, p_venta_bulto:p_venta_bulto, p_venta_unidad: p_venta_unidad, iva:iva, total_bulto: total_bulto, cantidad_unidad: cantidad_unidad, img:img, observacion:observacion, presentacion: presentacion.id});
    
    categorias = await Categoria.findAll({
      where: {
        id: {[Op.in]: categorias}
      }
    });
    
    await producto.addCategoria(categorias);
    
    const productcreated = await Producto.findByPk(producto.id, {
      attributes: { 
        exclude: ['presentacion'] 
      },
      include: [
        {
          model: Presentacion,
          as: "ProductoPresentacion"
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