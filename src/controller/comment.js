const Post = require('../model/post');
const Comment = require('../model/comment');

exports.addComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req;
      const { comment } = req.body;
  
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const newComment = new Comment({ comment, postId: id, userId: user._id });
      await newComment.save();
  
      post.comments.push(newComment._id);
      await post.save();
  
      res.json({ commentId: newComment._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };