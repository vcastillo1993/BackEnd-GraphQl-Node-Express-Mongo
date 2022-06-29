const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { users, user, posts, post, comments, commentSingle } = require('./queries')
const { register, login, createPost, updatePost, deletePost, addComment, updateComment, deleteComment } = require('./mutations');

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: 'the root query type',
  fields: {
    users,
    user,
    posts,
    post,
    comments,
    commentSingle
  }
})

/* Creando mutaiones iniciales */
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "The root mutation type",
  fields: {
    register,
    login,
    createPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment
  }
});

/* un esquema es un objeto que tiene listado todas las consultas y mutacoin que se pueden tener en la api */
module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});



