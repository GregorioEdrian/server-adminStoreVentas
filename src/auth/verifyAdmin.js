const { decodeToken } = require('./verifyTokens');
const {Usuario} = require('../db')

async function verifyAdmin(token){
    const decoded = decodeToken(token);
    if(decoded){
      const user = decoded.user
      if(user.level === 'admin' || user.level === 'root'){
        const found = await Usuario.findOne({where: {correo: user.correo}})
        if(found && found.accessLevel === user.level) {
          return true
        }
      }  
    }
  return false
};

module.exports = { verifyAdmin };