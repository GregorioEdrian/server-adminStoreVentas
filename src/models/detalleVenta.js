const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('detalleVenta',{
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,      
      allowNull: false,
    },
    numeroItems:{
      type: DataTypes.REAL,
      allowNull: false
    },
    cant:{
      type: DataTypes.REAL,
      allowNull: false
    },
    precioVentaDiaNoIva:{
      type: DataTypes.REAL,
      allowNull: false
    },
    precioVentaDiaComIva:{
      type: DataTypes.REAL,
      allowNull: false
    },
    totalUsdCantidadNoIva:{
      type: DataTypes.REAL,
      allowNull: false
    },
    totalMlcCantidadNoIva:{
      type: DataTypes.REAL,
      allowNull: false
    },
    totalUsdCantidadConIva:{
      type: DataTypes.REAL,
      allowNull: false
    },
    totalMlcCantidadConIva:{
      type: DataTypes.REAL,
      allowNull: false
    },
    iva:{
      type: DataTypes.REAL,
      allowNull: false
    },
    delete:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'detalleVenta'    
  })
}