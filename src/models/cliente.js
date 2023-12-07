const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>{
  sequelize.define('cliente', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,      
      allowNull: false,
    },
    nombre:{
      type: DataTypes.STRING ,
      allowNull: false
    },
    correo:{
      type: DataTypes.STRING,
      allowNull: false
    },
    direccion:{
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono:{
      type: DataTypes.STRING,
      allowNull: false
    },
    dni:{
      type: DataTypes.STRING,
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
    tableName: 'cliente'    
  })
}