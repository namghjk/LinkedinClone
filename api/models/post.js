const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  description: String,
  imageURL: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;
