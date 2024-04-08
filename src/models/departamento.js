const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('departamento', {
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
    tableName: 'departamento',
    hooks: {
      beforeValidate: (departamento, options) => {
        if (departamento.nombre) {
          departamento.nombre = departamento.nombre.toLowerCase(); // Convierte a minúsculas antes de validar
        }
      },
    }
  }
)}