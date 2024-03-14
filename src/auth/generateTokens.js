const jwt = require('jsonwebtoken');
const { SECRECT_KEY } = process.env;

function sign(payload, isAccessToken){
  return jwt.sign(payload, isAccessToken? process.env.ACCESS_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: 43200,
  })
};

function generateAccessToken(user){
  return sign({user}, true);
};

function generateRefreshToken(user){
  return sign({user}, false);
};

function generateInfo(data){
  const dataUser = {
      id: data.id,
      nombre: data.nombre,
      correo: data.correo,
      level: data.level,
      delete: data.delete
  }
  return dataUser
};

module.exports = { generateAccessToken, generateRefreshToken, generateInfo }
