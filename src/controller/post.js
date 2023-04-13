const Post = require('../model/post');
const Like = require("../model/like");
const Comment = require("../model/comment")

const createPost = async (req, res) => {
  try {
    // Create the new post in the database
    const post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id, // Assuming you have some kind of authentication middleware that sets the user ID on the request object
    });
    
    // Return the new post in the response
    return res.status(201).json({
      postId: post._id,
      title: post.title,
      description: post.description,
      createdTime: post.createdTime.toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create post.' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Find the post in the database
    const post = await Post.findOne({ _id: postId, user: req.user.id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    
    // Delete the post from the database
    await post.remove();
    
    // Return a success response
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete post.' });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate('likes').populate('comments');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getAllPosts = async (req, res) => {
  try {
    const { user } = req;

    const posts = await Post.find({ user: user._id }).populate('comments');
    const result = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const likes = await Like.countDocuments({ postId: post._id });
      result.push({
        id: post._id,
        title: post.title,
        desc: post.description,
        created_at: post.createdAt,
        comments: post.comments,
        likes,
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createPost, deletePost, getPost, getAllPosts };
