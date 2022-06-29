const { GraphQLString, GraphQLID } = require("graphql");
/* trallendo el modelo User de mongo para almacenarlo */
const { User, Post, Comment } = require('../models')
const { createJWToken } = require('../utils/auth')
const { PostType, CommentType } = require('./types')

/* Mutacion que permite registrar un usuario y generar un pase de acceso "Token" */
const register = {
  type: GraphQLString,
  description: "Esto registrar un nuevo Usuario y un retorna un token",
  args: {/* esta propiedad es para recibir los valores de la mutacion */
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString }
  },
  async resolve(_, args) {
    const { username, password, email, displayName } = args;
    const newUser = new User({ username, password, email, displayName });/* Aqui creamos el usuario en la bd de mongo */
    const valor = await newUser.save();
    console.log('Datos del usuario creado : ', valor)
    /* a qui llamamos ha auth.js para crear el token de logueo enviandole el usuario creado */
    const token = createJWToken({ _id: valor.username, email: valor.email, displayName: valor.displayName });
    console.log('este es el token creado del nuevo usuario', token)
    return token
  }
};

/* Funcion para hacer Login */
const login = {
  type: GraphQLString,
  description: "Esto es para iniciar sesion login y retorna un token",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  async resolve(_, args) {
    /* validando la existencia del usuario y la contraseña desde la db*/
    const user = await User.findOne({ email: args.email, password: args.password });
    /* si el User.findOne no existe retornar Error */
    if (!user) throw new Error("Error de email o password")
    /* const { email, password } = args; */
    console.log("valores de la funcion login : ", args)

    const token = createJWToken(user);
    console.log('token del usuario logueado'.token)
    return token
  }
}

const createPost = {
  type: PostType,
  description: "Create a new post",
  args: {/* autorId: { type: GraphQLString}, */
    title: { type: GraphQLString },
    body: { type: GraphQLString }
  },
  async resolve(_, args, { verifiedUser }) {
    console.log('valor de verifiedUser', verifiedUser)
    const newPost = new Post({
      autorId: verifiedUser._id, /* este valor llega al types.js para consultar el usuario que crea el post */
      title: args.title,
      body: args.body
    })
    await newPost.save()
    console.log('nueva publicacion : ', newPost)
    return newPost
  }
}

/* actualizar post */
const updatePost = {
  type: PostType,
  description: "Update a post",
  args: {
    id: { type: GraphQLID },/* se establece el id para identificar el post ha modificar  */
    title: { type: GraphQLString },
    body: { type: GraphQLString }
  },
  async resolve(_, args, { verifiedUser }) {/*El verifiedUser se extrae para validar que el post ha modificar pertecese al usuario que esta logueado, y que solo el como creador del post puede acceder y modificarlo   */
    if (!verifiedUser) throw new Error("No estas autorizado");
    
      const updatePost = await Post.findOneAndUpdate(
        { id: args.id, autorId: verifiedUser._id },/* a qui verificamos que coincida el id del autor del pos con el id del autor logueado */
        {
          title: args.title,
          body: args.body
        },
        {
          new: true,
          runValidators: true
        }
      )

    return updatePost
  }
}

const deletePost = {
  type: GraphQLString,
  description: "Delete a post",
  args: {
    postId: { type: GraphQLID }
  },
  async resolve(_, { postId} , { verifiedUser } ){
    if(!verifiedUser) throw new Error("Usuario no autorizado");
    const postDeleted = await Post.findByIdAndDelete({
      _id:postId,
      autorId: verifiedUser._id
    })
    if(!postDeleted) throw new Error('Post not found');
    return "Post deleted"
  }
}

const addComment = {
  type: CommentType,
  description: "Add a comment to a post ",
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLID },
  },
  async resolve(_, {comment, postId}, {verifiedUser}){
    const newComment = new Comment({
      comment: comment,
      postId,
      userId: verifiedUser._id
    })
    await newComment.save();
    return newComment
  }
}

const updateComment = {
  type: CommentType,
  description: "Update a comment",
  args: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString }
  },
  async resolve(_, {id, comment}, { verifiedUser }){
    if(!verifiedUser) throw new Error(' Unauthorized');
    const commentUpdated = await Comment.findOneAndUpdate(
      {/* verificando que el id del comment coincida con el id del usuario que lo creo  */
        _id: id,
        userId: verifiedUser._id
      },
      {
        comment
      }
    );
    if(!commentUpdated) throw new Error("Comentario no encontrado");
    console.log("valor del updatecomment ", commentUpdated)
    return commentUpdated 
  }
}

const deleteComment = {
  type: GraphQLString,
  description: "Delete a comment",
  args: {
    id: { type: GraphQLID},
  },
  async resolve(_, { id }, { verifiedUser }){
    if(!verifiedUser) throw new Error("Usuario no autorizado")
    const commentDelete = await Comment.findByIdAndDelete({
      _id: id,
      userId: verifiedUser._id
    })
    if(!commentDelete) throw new Error('Comment not found');
    return "Comment delete"
  }
}

module.exports = {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment

}