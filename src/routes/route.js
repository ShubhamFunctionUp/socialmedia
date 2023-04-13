const express = require('express')
const router = express()
// const comment = require("../controller/comment")
const like = require("../controller/like")
// const follow = require("../controller/follow")
const user = require("../controller/user")
const {
    authMiddleware
} = require("../middleware/auth")
const followController = require("../controller/follow")
const post = require("../controller/post")

// User
router.post("/register", user.register)
router.post("/authenticate", user.loginForAuthenication)


// Follow 
router.post('/follow/:id', authMiddleware, followController.followUser)
router.post('/unfollow/:id', authMiddleware, followController.unfollowUser)
router.get('/user', authMiddleware, followController.getUserProfile)

// Post
router.post("/posts",authMiddleware, post.createPost)
router.post("/posts/:id",authMiddleware, post.deletePost)

// Like
router.post('/like/:id', authMiddleware, like.likePost);
router.post('/unlike/:id', authMiddleware, like.unlikePost);
module.exports = router