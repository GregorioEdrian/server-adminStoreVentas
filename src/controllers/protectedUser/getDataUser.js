const { Usuario } = require('../../db')
const { generateInfo } = require('../../auth/generateTokens')

async function getDataUser(req, res){
  try {
    const user = req.user;
    const newUser = await Usuario.findOne({ where: { id : user.id } });
    if(newUser === null){
      return res.status(403).json({error: 'Unregistered user, please create an account, go to create an account to register. '});
    }
    var data = newUser.dataValues;  
    data = generateInfo(data)
   return res.status(200).json(data);   
  } catch (error) {
    return res.status(400).json({error: error}); 
  }

   
}

module.exports = {getDataUser};