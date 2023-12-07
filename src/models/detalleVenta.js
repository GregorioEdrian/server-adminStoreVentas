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
    precioVentaDia:{
      type: DataTypes.REAL,
      allowNull: false
    },
    totalUsdCantidad:{
      type: DataTypes.REAL,
      allowNull: false
    },
    totalMlcCantidad:{
      type: DataTypes.REAL,
      allowNull: false
    },
    iva:{
      type: DataTypes.REAL,
      allowNull: false
    }
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'detalleVenta'    
  })
}