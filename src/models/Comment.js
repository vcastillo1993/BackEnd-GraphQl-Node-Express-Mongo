const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      require: true
    },
    postId: {
      type: String,
      require: true
    },
    userId: {
      type: String,
      require: true
    }, 
  },
  {
    timestamp: true
  }
);

module.exports = model("Comment", commentSchema)