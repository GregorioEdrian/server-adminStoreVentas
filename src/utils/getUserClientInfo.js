function getUserInfo(user){
  return{
    id: user.id,
    nombre: user.nombre,
    correo: user.correo,
    direccion: user.direccion,
    telefono: user.telefono,
    dni: user.dni,
    password: user.password,
    level: user.level,
    delete: user.delete
  }
}

module.exports = {getUserInfo};