const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('tazaDolar',{
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,      
      allowNull: false,
    },
    tasa:{
      type: DataTypes.REAL,
      allowNull: false
    },
    fecha:{
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    tableName: 'tazaDolar',
    hooks: {
      beforeCreate: (tazaDolar, options) => {
        // Obtener la fecha actual en la zona horaria de Venezuela
        const now = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
        const fechaActual = new Date(now);

        // Convertir la fecha de la taza a día, mes y año
        const fechaTaza = new Date(tazaDolar.fecha);
        fechaTaza.setHours(0, 0, 0, 0); // Establecer horas, minutos, segundos y milisegundos a 0

        // Comparar solo día, mes y año
        if (fechaTaza.getTime() > fechaActual.setHours(0, 0, 0, 0)) {
          throw new Error('La fecha de la taza de dólar no puede ser en el futuro');
        }
        if (fechaTaza.getTime() < fechaActual.setHours(0, 0, 0, 0)) {
          throw new Error('La fecha de la taza de dólar no puede ser en el pasado');
        }
      },
      beforeUpdate: (tazaDolar, options) => {
        // Obtener la fecha actual en la zona horaria de Venezuela
        const now = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
        const fechaActual = new Date(now);

        // Convertir la fecha de la taza a día, mes y año
        const fechaTaza = new Date(tazaDolar.fecha);
        fechaTaza.setHours(0, 0, 0, 0); // Establecer horas, minutos, segundos y milisegundos a 0

        // Comparar solo día, mes y año
        if (fechaTaza.getTime() > fechaActual.setHours(0, 0, 0, 0)) {
          throw new Error('La fecha de la taza de dólar no puede ser en el futuro');
        }
        if (fechaTaza.getTime() < fechaActual.setHours(0, 0, 0, 0)) {
          throw new Error('La fecha de la taza de dólar no puede ser en el pasado');
        }
      }
    }
  }

 )}