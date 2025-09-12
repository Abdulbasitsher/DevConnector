import express from 'express';
import User from '../../models/User.js'; 
import Profile from '../../models/Profile.js';
import Post from "../../models/Post.js";
import { check, validationResult } from 'express-validator';
import auth from "../../middleware/auth.js";

const router = express.Router();

// @route   POST /post
// @desc    Create post
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required").not().isEmpty()
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = new Post({
        text: req.body.text,
        user: req.user.id,
        avatar: user.avatar,
        name: user.name,
      });

      const newPost = await post.save();
      res.json(newPost);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// @route GET /get
// @desc get all posts
// @private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({date: -1})
    res.json(posts)
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server Error" });
  }
})


// @route GET /get/:id
// @desc get post by id
// @private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post){
      return res.status(404).json({err : "post not found"}) 
    }
    res.json(post)
  } catch (error) {
      console.error(error.message);
      
    if(err.kind == "ObjectId" ){
      return res.status(404).json({err : "post not found"}) 
    }
      res.status(500).json({ error: "Server Error" });
  }
})


// @route Delete /delete/:id
// @desc delete post by id
// @private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post){
      return res.status(404).json({err : "post not found"}) 
    }

    if(post.user.toString() !== req.user.id){
      res.status(401).json({msg: "user not authorized"})
    }
    await post.remove()
    res.json({msg: "post deleted"})
  } catch (error) {
      console.error(error.message);
      
    if(error.kind == "ObjectId" ){
      return res.status(404).json({err : "post not found"}) 
    }
      res.status(500).json({ error: "Server Error" });
  }
})
// @route   PUT /api/posts/likes/:id
// @desc    Like post by id
// @access  Private
router.put("/likes/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if post already liked by this user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    // Add new like
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});
// @route   PUT /api/posts/unlike/:id
// @desc    Unlike post by id
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if the post has not been liked by this user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: "Post has not been liked yet" });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    // Remove like
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});
// @route   POST /post/comment/:id
// @desc    Create a comment on a post
// @access  Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required").not().isEmpty()
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      const comment = {
        text: req.body.text,
        user: req.user.id,
        avatar: user.avatar,
        name: user.name,
      };

      // Add new comment at the start
      post.comments.unshift(comment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);
// @route   DELETE /post/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Pull out the comment
    const comment = post.comments.find(
      (c) => c.id === req.params.comment_id
    );

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Remove the comment
    post.comments = post.comments.filter(
      (c) => c.id !== req.params.comment_id
    );

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});




export default router;
