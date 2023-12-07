const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('producto', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    codigo:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre:{
      type:DataTypes.STRING,
      allowNull: false
    },
    descripcion:{
      type:DataTypes.STRING,
      allowNull: false
    },
    lote:{
      type:DataTypes.STRING,
      allowNull: true
    },
    p_com_bulto:{
      type: DataTypes.REAL,
      allowNull: false
    },
    unidad_p_bulto:{
      type: DataTypes.REAL,
      allowNull: false
    },
    p_venta_bulto: {
      type: DataTypes.REAL,
      allowNull: false
    },
    p_venta_unidad: {
      type: DataTypes.REAL,
      allowNull: false
    },
    iva: {
      type: DataTypes.REAL,
      allowNull: false
    },
    total_bulto: {
      type: DataTypes.REAL,
      allowNull: false
    },
    cantidad_unidad:{
      type: DataTypes.REAL,
      allowNull: false
    },
    total_unidades:{//((total_bulto * unidad_p_bulto) + cantidad_unidad)
      type: DataTypes.REAL,
      allowNull: true
    },
    img:{
      type: DataTypes.STRING,
      allowNull: true
    },
    p_v_total_bulto:{ //(p_venta_bulto * (1+ (iva / (100)))
      type: DataTypes.REAL,
      allowNull: true
    },
    p_v_total_unidad:{ //(p_venta_unidad * (1 + (iva / (100)))
      type: DataTypes.REAL,
      allowNull: true
    },
    observacion:{
      type:DataTypes.STRING,
      allowNull: true
    },
    delete:{
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },   
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'producto',
    hooks: {
      beforeCreate: (producto, options) =>{
        //total_unidades = ((total_bulto * unidad_p_bulto) + cantidad_unidad)
        //p_v_total_bulto:{ //(p_venta_bulto * (1+ (iva / (100)))
        //p_v_total_unidad:{ //(p_venta_unidad * (1 + (iva / (100)))
        totalUnidad = producto.total_bulto*producto.unidad_p_bulto + producto.cantidad_unidad
        producto.total_unidades = parseFloat(totalUnidad.toFixed(3));
        
        pTotalBulto = producto.p_venta_bulto * (1 + parseFloat(producto.iva/100))
        producto.p_v_total_bulto = parseFloat(pTotalBulto.toFixed(3));

        pTotalUnidad = producto.p_venta_unidad*(1 + parseFloat(producto.iva/100))
        producto.p_v_total_unidad = parseFloat(pTotalUnidad.toFixed(3));
      },
      beforeUpdate:(producto, options) =>{
        //total_unidades = ((total_bulto * unidad_p_bulto) + cantidad_unidad)
        //p_v_total_bulto:{ //(p_venta_bulto * (1+ (iva / (100)))
        //p_v_total_unidad:{ //(p_venta_unidad * (1 + (iva / (100)))
        totalUnidad = producto.total_bulto*producto.unidad_p_bulto + producto.cantidad_unidad
        producto.total_unidades = parseFloat(totalUnidad.toFixed(3));

        pTotalBulto = producto.p_venta_bulto * (1 + parseFloat(producto.iva/100))
        producto.p_v_total_bulto = parseFloat(pTotalBulto.toFixed(3));

        pTotalUnidad = producto.p_venta_unidad*(1 + parseFloat(producto.iva/100))
        producto.p_v_total_unidad = parseFloat(pTotalUnidad.toFixed(3));
      }
    }
  }
  
)}  