const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('categoria', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,      
      allowNull: false,
    },
    nombre:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      collate: 'utf8_general_ci'
    }
  },   
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'categoria',
    hooks: {
      beforeValidate: (categoria, options) => {
        if (categoria.nombre) {
          categoria.nombre = categoria.nombre.toLowerCase(); // Convierte a minúsculas antes de validar
        }
      },
    }
  }
)}