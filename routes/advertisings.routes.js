const advertisings = require("../controllers/advertisings.controller");

var router = require("express").Router();

// Create a new Tutorial
router.post("/", advertisings.create);

// Retrieve all advertisings
router.get("/", advertisings.findAll);

// Retrieve all published advertisings
router.get("/published", advertisings.findAllPublished);

// Retrieve a single Tutorial with id
router.get("/:id", advertisings.findOne);

// Update a Tutorial with id
router.put("/:id", advertisings.update);

// Delete a Tutorial with id
router.delete("/:id", advertisings.delete);

// Create a new Tutorial
router.delete("/", advertisings.deleteAll);

module.exports = router;