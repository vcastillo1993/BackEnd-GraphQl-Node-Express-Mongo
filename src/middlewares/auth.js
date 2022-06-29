const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)
  console.log('Este es el REQ',req)
  try {
    const verified = jwt.verify(token, 'codificado_victor')
    console.log('verified ', verified)
     req.verifiedUser = verified.valor
    next()
  } catch (error) {
    next()
  }

}

module.exports = {
  authenticate
}