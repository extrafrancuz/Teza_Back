const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const blogsController = require("../controllers/blogsController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/blogs", upload.single("image"), blogsController.createBlog);

router.get("/blogs", blogsController.getBlogs);
router.get("/blogs/:id", blogsController.getBlogByID);
router.get("/blogs/author/:author", blogsController.getBlogAuthor);
router.post("/blogs/liked", blogsController.getLikedBlogsByUser);

router.put("/blogs/:id", blogsController.EditBlogByID);
router.delete("/blogs/:id", blogsController.DeleteBlogByID);

router.post("/blogs/:id/like", blogsController.toggleBlogLike);
router.post("/blogs/:id/comment", blogsController.PostBlogComment);

module.exports = router;
