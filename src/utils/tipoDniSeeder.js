module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta los valores por defecto en la tabla
    await queryInterface.bulkInsert('tipoDni', [
      { tipo: 'V' },
      { tipo: 'E' },
      { tipo: 'J' },
      { tipo: 'P' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Elimina los valores insertados si es necesario deshacer el seeder
    await queryInterface.bulkDelete('tipoDni', null, {});
  },
};