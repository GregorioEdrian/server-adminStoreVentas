const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('venta', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,      
      allowNull: false,
    },
    num_factura:{
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    num_items:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_venta_mlc_noIva:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    total_venta_usd_noIva:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    total_venta_mlc_conIva:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    total_venta_usd_conIva:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    fecha_venta:{
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_Iva_Sale:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    import_igtf:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    descuento:{
      type: DataTypes.REAL,
      allowNull: true,
    },
    subtotal_mlc:{
      type: DataTypes.REAL,
      allowNull: false
    },
    total_mlc:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    subtotal_usd:{
      type: DataTypes.REAL,
      allowNull: false
    },
    total_usd:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    pago_usd:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    pago_mlc_efectivo:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    pago_mlc_punto:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    pago_mlc_digital:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    tasa_ref_venta:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    vuelto_mlc:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    vuelto_usd:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    status:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },   
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'venta'
  }
)}