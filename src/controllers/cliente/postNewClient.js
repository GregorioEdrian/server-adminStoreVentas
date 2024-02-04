const { Cliente } = require('../../db');

async function postNewClient(req, res){
  try {
    const { nombre, correo, direccion, telefono, dni, clienteTipoDni } = req.body;

    if(!nombre || !direccion || !telefono || !dni || !clienteTipoDni ){
      return res.status(400).json({ error: 'Faltan datos obligatorios para el registro' })
    }

    dataSearch = {
      dni: dni.toString(),
      clienteTipoDni: parseInt(clienteTipoDni)
    }
    
    const clientSearch = await Cliente.findOne({where: dataSearch });

    if(clientSearch){
      return res.status(200).json(clientSearch);
    }

    const newClient = await Cliente.create({nombre, correo, direccion, telefono, dni: dni, clienteTipoDni: clienteTipoDni});

    const clientCreate = await Cliente.findByPk(newClient.id);

    return res.status(200).json(clientCreate);

  } catch (error) {
    return res.status(404).json({error: error.message});
  }

}

module.exports = postNewClient;