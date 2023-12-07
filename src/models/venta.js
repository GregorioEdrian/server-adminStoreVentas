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
    total_venta:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    fecha_venta:{
      type: DataTypes.DATE,
      allowNull: false,
    },
    iva:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    descuento:{
      type: DataTypes.REAL,
      allowNull: false,
    },
    subtotal:{
      type: DataTypes.REAL,
      allowNull: false
    },
    total:{
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
    tableName: 'venta',
    hooks: {
      beforeCreate: (venta, options) => {
        const sumaPagos = venta.pago_usd + venta.pago_mlc_efectivo + venta.pago_mlc_punto + venta.pago_mlc_digital;
        
        // Verificar si la suma de pagos es igual al total de la venta
        if (sumaPagos < venta.total) {
          throw new Error('La suma de los pagos no coincide con el total de la venta');
        }
      }      
    }
  }
)}