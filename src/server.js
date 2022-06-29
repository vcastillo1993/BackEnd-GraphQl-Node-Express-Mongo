const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema =  require ('./graphql/schema');
const { connectDB } = require('./db');
const { authenticate } = require('./middlewares/auth')

connectDB()
const app = express()

app.use(authenticate)

/* creando rutas */
app.get('/', function(req, res) {
  res.send('hello world');
});

/* estableciendo ruta vista de graphql */
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql:true
}))

app.listen(4200)
console.log('server is running on port 4200')
