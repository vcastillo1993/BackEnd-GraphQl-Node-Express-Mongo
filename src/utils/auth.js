/* Aquí configuramos ha jsonwebtoken para que nos retorne el token del Usuario logueado...
cabe resaltar que el token que se genera es de tipo String */
const jwt = require('jsonwebtoken')

const createJWToken = (valor) => {
  console.log('usuario que llega al token', valor)
  return jwt.sign({ valor }, 'codificado_victor', {
    /* aqui defino el tiempo en el que el token debe expirar */
    expiresIn: '1d'
  })
}

module.exports = {
  createJWToken
}