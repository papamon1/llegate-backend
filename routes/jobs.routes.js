const postsCtlr = require("../controllers/posts.controller");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var router = require("express").Router();

// Create a new Post
router.post("/", jsonParser, postsCtlr.create);

// Get properties
router.get("/", jsonParser, postsCtlr.findJobs);

module.exports = router;
