/* esquema o modelo de datos del usuario para mongo*/
const { model, Schema } = require('mongoose')

const userSchema = new Schema ({
   username: {
     type: String,
     required: true
   },
   password: {
     type: String,
     required: true,
     select: false /* esta propiedad es para evitar ver lacontraseña cuando se obtenga el token */
   },
   email: {
     type: String,
     required: true,
     unique: true,
     match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Proporcione una direccion de email valido"
      ]
   },
   displayName: {
     type: String,
     required: true
   }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = model("User", userSchema)