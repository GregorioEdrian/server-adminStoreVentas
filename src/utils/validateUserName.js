const { Usuario } = require('../db');

async function validateUserName(username){
    const isValidUserName = await Usuario.findOne({ where: { emailRegister: username } });
    if(isValidUserName === null){
      return true;
    }else{
      return false;
    }
};

async function validateUserNameAdmin(username){
  const isValidUserName = await Usuario.findOne({ where: { email : username } });
  if(isValidUserName === null){
    return true;
  }else{
    return false;
  }
};

module.exports = { validateUserName, validateUserNameAdmin }