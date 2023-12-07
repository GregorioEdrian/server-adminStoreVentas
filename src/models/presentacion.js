const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('presentacion', {
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
    tableName: 'presentacion',
    hooks: {
      beforeValidate: (presentacion, options) => {
        if (presentacion.nombre) {
          presentacion.nombre = presentacion.nombre.toLowerCase(); // Convierte a minúsculas antes de validar
        }
      },
    }
  }
)}