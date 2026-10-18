const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

// Create a new post (protected)
router.post("/create", authMiddleware, createPost);

// Get all posts for logged in user (protected)
router.get("/", authMiddleware, getPosts);

// Update a post by ID (protected)
router.put("/:id", authMiddleware, updatePost);

// Delete a post by ID (protected)
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
