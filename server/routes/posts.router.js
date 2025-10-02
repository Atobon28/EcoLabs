const express = require("express");
const router = express.Router();

const {
  searchPostsByTitleController,
} = require("../controllers/posts.controller");

// GET /posts/search?title=tutorial → posts cuyo title contenga "tutorial"
router.get("/posts/search", searchPostsByTitleController);

module.exports = router;