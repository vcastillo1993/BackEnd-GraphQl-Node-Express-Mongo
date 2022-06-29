/* defininendo objetos de GraphQL o tipos de datos */
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require("graphql");
const { User, Post, Comment } = require('../models');


const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "The user type",/* tipo de datos del usuario */
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    /* password: { type: GraphQLString }, */
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
    createdAt: { type: GraphQLString },

  },
});

const PostType = new GraphQLObjectType({
  name: "PostType",
  description: "the Post type",
  fields:()=> ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    /* a qui relacionamos el usuario que crea el póst, para traer el autor en la insercion 
       se debe realizar por medio de una consulta a la db */
    autor: {
      type: UserType, resolve(parent) {
        return User.findById(parent.autorId)
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent){
        return Comment.find({postId: parent.id})/* a qui traigo todos los comentarios que esten relacionados con el post  */
      }
    }
    
  })
})

const CommentType = new GraphQLObjectType({
  name: "CommentType",
  description: "The comment type",
  fields: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId);
      }
    },
    post: {
      type: PostType, 
      resolve(parent) {
        return Post.findById(parent.postId)
      }
    }
  }
})

module.exports = {
  UserType,
  PostType,
  CommentType
}