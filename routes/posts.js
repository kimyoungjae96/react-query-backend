const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

function randomErrorMiddleware(req, res, next) {
  const randomError = false;

  if (randomError && Math.random() < 0.05) {
    return res.status(500).json({ error: "랜덤 에러 발생" });
  }

  next();
}

router.use(randomErrorMiddleware);

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jsonFilePath = path.join(__dirname, "../data", "db.json");
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the JSON file" });
    }
    try {
      const jsonData = JSON.parse(data);

      const posts = jsonData.posts;
      const paginatedPosts = jsonData.posts.slice(skip, skip + limit);
      const isLastPage = skip + limit >= posts.length;

      return res.status(200).json({
        posts: paginatedPosts,
        isLastPage,
      });
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse JSON data" });
    }
  });
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;

  const jsonFilePath = path.join(__dirname, "../data", "db.json");
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read the JSON file" });
    }
    try {
      const jsonData = JSON.parse(data);

      const posts = jsonData.posts;
      const post = posts.find((p) => p.id === postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (parseError) {
      res.status(500).json({ error: "Failed to parse JSON data" });
    }
  });
});

module.exports = router;
