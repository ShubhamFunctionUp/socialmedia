const User = require('../model/user');
const Follow = require('../model/follow');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const follow = new Follow({
      follower: req.user._id,
      following: req.params.id,
    });
    await follow.save();
    res.status(200).json({ message: 'User followed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    await Follow.deleteOne({
      follower: req.user._id,
      following: req.params.id,
    });
    res.status(200).json({ message: 'User unfollowed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followers = await Follow.find({ following: req.user._id }).populate('follower', '_id name');
    const following = await Follow.find({ follower: req.user._id }).populate('following', '_id name');
    const profile = {
      name: user.name,
      followers: followers.length,
      following: following.length,
    };
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
