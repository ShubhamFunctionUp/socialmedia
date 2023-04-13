const Post = require('../model/post');
const Like = require('../model/like');


exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const like = await Like.findOne({ postId: id, userId: user._id });
    if (like) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    const newLike = new Like({ postId: id, userId: user._id });
    await newLike.save();

    post.likes.push(newLike._id);
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const like = await Like.findOne({ postId: id, userId: user._id });
    if (!like) {
      return res.status(400).json({ message: 'Post not liked' });
    }

    await like.delete();

    post.likes = post.likes.filter((likeId) => likeId.toString() !== like._id.toString());
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};