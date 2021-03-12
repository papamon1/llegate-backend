const posts = require("../controllers/posts.controller");

var router = require("express").Router();

// Create a new Post
router.post("/", posts.create);

// Retrieve all posts
router.get("/", posts.findAll);

// Retrieve all published posts
router.get("/published", posts.findAllPublished);

// Retrieve a single Tutorial with id
router.get("/:id", posts.findOne);

// Update a Post with id
router.put("/:id", posts.update);

// Delete a Post with id
router.delete("/:id", posts.delete);

// Create a new Post
router.delete("/", posts.deleteAll);

module.exports = router;