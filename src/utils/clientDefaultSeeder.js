const { Cliente } = require('../db');

async function clientDefaultSeeder(){

  try {
    const clientDefault = {
      nombre : 'Cliente',
      correo : null,
      direccion : 'Local 01',
      telefono : '00000000000',
      dni : '000000',
      clienteTipoDni : '1'
    }

    const existDefault = await Cliente.findOne({where: {dni: clientDefault.dni}})

    if (existDefault === null) {
      await Cliente.create(clientDefault);
    } 

    return 0
  } catch (error) {
    return console.log(error)
  }

}

module.exports = clientDefaultSeeder;