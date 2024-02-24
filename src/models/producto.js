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
    p_venta_mayor:{ 
      type: DataTypes.REAL,
      allowNull: false
    },
    cant_min_mayoreo:{ 
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
    total_v_mayor:{ 
      type: DataTypes.REAL,
      allowNull: false
    },
    observacion:{
      type:DataTypes.STRING,
      allowNull: true
    },
    venta_por:{
      type:DataTypes.ENUM('unit', 'divisible'),
      allowNull: false,
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
        producto.total_unidades = (totalUnidad);
        
        pTotalBulto = parseFloat((producto.p_venta_bulto * parseFloat((1 + (producto.iva/100)).toFixed(2))).toFixed(2))
        producto.p_v_total_bulto = pTotalBulto;

        pTotalUnidad = (producto.p_venta_unidad * parseFloat((1 + producto.iva/100).toFixed(2))).toFixed(2)
        producto.p_v_total_unidad = parseFloat(pTotalUnidad);        
      },
    }
  }
  
)}  