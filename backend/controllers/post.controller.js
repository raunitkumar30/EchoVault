const postModel = require("../models/post.model");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await postModel.create({
      user: req.user.id,
      content: content.trim(),
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all posts for logged in user
const getPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ posts });
  } catch (err) {
    console.error("Get posts error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content cannot be empty" });
    }

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this post" });
    }

    post.content = content.trim();
    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.error("Update post error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await postModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.error("Delete post error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPost, getPosts, updatePost, deletePost };
