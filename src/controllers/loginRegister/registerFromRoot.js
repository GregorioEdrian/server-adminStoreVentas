const { Usuario } = require('../../db');
const { encrypPass } = require('../../utils/crypPass');
const { verify } = require('../../auth/verifyGLTK');
const { generatePassword } = require('../../auth/generatePassword');
const { VerifyIsRoot } = require('../../auth/verifyIsUserRoot');
const { createRefreshToken, createAccessToken } = require('../../auth/createTokens');
const { generateInfo } = require('../../auth/generateTokens');
require('dotenv').config();

const {
  PASSWORD_ACCESS
} = process.env;


/* const { sendMailNewUser } = require('../../utils/nodemailer'); */

const postRegisterFromRoot = async (req, res) => {
  try {
    
    const { correo, password, passwordAccess, nombre, direccion, telefono, dni, tipoDni, level } = req.body;

    if(!nombre){
      return res.status(403).json({error: 'No se indicó el nombre'})
    };
    if(!level){
      return res.status(403).json({error: 'No se indicó el tipo de usuario'}) 
    };
    if(!direccion){
      return res.status(403).json({error: 'No se indicó la dirección'})
    };
    if(!telefono){
      return res.status(403).json({error: 'No se indicó el número telefonico'})
    };
    if(!dni){
      return res.status(403).json({error: 'No se indicó el DNI'})
    };
    if(!tipoDni){
      return res.status(403).json({error: 'No se indicó el tipo de DNI'})
    };
    
    if(!correo){
      return res.status(403).json({error: 'No se indicó el email'})
    };
    if(!passwordAccess){
      return res.status(403).json({error: 'No se indicó la contarseña de super usuario'})
    };
    if(!password){
      return res.status(403).json({error: 'No se indicó la contraseña'})
    };

    if(passwordAccess !== PASSWORD_ACCESS){
      return res.status(403).json({error: 'No tiene permisos para el registro'})
    }

    const userRegister = await Usuario.findOne({ where: { correo: correo } });

    if(!(userRegister === null)){
      return res.status(403).json({error: 'El email ya esta registrado'});
    };

    if(!(password.length >= 8 && password.length <= 32) ){
      return res.status(403).json({error: 'La contraseña debe contener entre 8 y 32 caracteres'});
    };

    const passCrypt = await encrypPass(password);
    //const compare = bcrypt.compareSync(password, userPass);    
    
    const registerAcountUser = await Usuario.create({password: passCrypt,
      correo: correo, nombre: nombre , level: level, direccion: direccion, 
      telefono: telefono, dni: dni, usuarioTipoDni: tipoDni
    })

    var data = registerAcountUser.dataValues;
    /* const accessToken = createAccessToken(data);
    const refreshToken = await createRefreshToken(data); */
    /* sendMailNewUser(name, email); */
    /* pass: true, 
      message: 'Correct username and password', 
      user: generateInfo(data),
      accessToken,
      refreshToken */
    return res.status(200).json({
      message: 'Usuario creado satisfactoriamente, puede iniciar sesión'
    });      
    
  } catch (error) {
    return res.status(400).json({error: error.message});
  }
};

module.exports = {postRegisterFromRoot};