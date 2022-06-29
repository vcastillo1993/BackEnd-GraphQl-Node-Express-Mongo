const { GraphQLList, GraphQLID } = require("graphql");
const { UserType, PostType, CommentType } = require("./types");
const { User, Post, Comment } = require('../models');
/* const { find, findById } = require("../models/User"); */

/* consulta cacica para listar usuario */
const users = {
  type: new GraphQLList(UserType),
  async resolve() {
    const users = await User.find()
    return users
  }
}

/* consulta para retornar un unio usuario apartir de un ID */
const user = {
  type: UserType,
  description: "Get a user by ID",
  args: {
    id: { type: GraphQLID },
  },
  resolve(_, args) {
    console.log('id del usuario a buscar en queries : ', args)
    const usuario = User.findById(args.id)
    return usuario
  }
}

/* consulta para listar todos los posts */
const posts = {
  type: new GraphQLList(PostType),
  description: "Get all post",
  async resolve() {
    const publicaciones = await Post.find()
    return publicaciones
  }
}
/* consulta para un post */
const post = {
  type: PostType,
  description: "Get post",
  args: {
    id: { type: GraphQLID }
  },
  async resolve(_, args) {
    const post = await Post.findById(args.id)
    return post    
  }
}

const comments = {
  type: new GraphQLList (CommentType),
  description: "Get all posts",
  async resolve(){
    const comentarios = await Comment.find()
    return comentarios
  }
}

const commentSingle = {
  type: CommentType,
  description: "Get Comment",
  args: {
    id: { type: GraphQLID}
  },
  async resolve(_, args) {
    const comentario = await Comment.findById(args.id)
    return comentario
  }

}

module.exports = { users, user, posts, post, comments, commentSingle }