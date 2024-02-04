const { TipoDni } = require('../../db');

async function defaultDniType(req, res){
  try {
    const defaultDni = ['V', 'E', 'J', 'P'];
    const allTipoDni = await TipoDni.findAll();
    const tipoDniObjects = allTipoDni.map(user => user.get({ plain: true }));

    const arrayTipos = [];
    tipoDniObjects.forEach((element) =>{
      arrayTipos.push(element.tipo);
    })
    
    defaultDni.forEach(async (elem) => {
      
      if( !(arrayTipos.includes(elem.toUpperCase()) || arrayTipos.includes(elem.toLowerCase())) ){
        await TipoDni.create({tipo: elem})
      }
    })

  } catch (error) {
    return console.log(error)
  }
}

module.exports = defaultDniType;