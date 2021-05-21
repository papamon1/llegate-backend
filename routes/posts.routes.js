const posts = require("../controllers/posts.controller");
const bodyParser = require ('body-parser')
var jsonParser = bodyParser.json()

var router = require("express").Router();

// Create a new Post
router.post("/", jsonParser, posts.create);

// Retrieve all posts
router.get("/", posts.findAll);

// Retrieve all published posts
router.get("/published", posts.findAllPublished);

// Retrieve a single Post with id
router.get("/:id", posts.findOne);

// Update a Post with id
router.put("/:id", posts.update);

// Delete a Post with id
router.delete("/:id", posts.delete);

// Create a new Post
router.delete("/", posts.deleteAll);

module.exports = router;