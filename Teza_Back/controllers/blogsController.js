const Blog = require("../models/Blog");
const fs = require("fs");
const path = require("path");
const BACKEND_URL = process.env.BACKEND_URL;

exports.createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newBlog = new Blog({
      title,
      content,
      author,
      image,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Obține toate blogurile, sortate descrescător după data creării
exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 12; // Default to 12 items per page
    const skip = (page - 1) * limit;

    const sortOrder = req.query.sort === "asc" ? 1 : -1; // Default to descending order

    // Get total count before pagination
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    // Get paginated data
    const blogs = await Blog.find()
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    // Check if there are more documents by querying for one more
    const hasNextPage = await Blog.findOne()
      .sort({ createdAt: sortOrder })
      .skip(skip + limit)
      .limit(1)
      .then((doc) => !!doc);

    res.status(200).json({
      status: "SUCCESS",
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          hasNextPage,
          hasPrevPage: page > 1,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Obține un blog după ID
exports.getBlogByID = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.image = `${BACKEND_URL}${blog.image}`;
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getBlogAuthor = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.author });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    console.log(req.params.author);
  }
};

// Editează un blog după ID
exports.EditBlogByID = async (req, res) => {
  try {
    const { title, content } = req.body;
    let updateData = { title, content };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog Updated", blog });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Șterge un blog după ID
exports.DeleteBlogByID = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.image) {
      const imagePath = path.join(__dirname, blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Adaugă un like unui blog
exports.toggleBlogLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Use email instead of userId
    const userEmail = req.body.email;
    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    if (!blog.likedUsers) {
      blog.likedUsers = [];
    }

    const hasLiked = blog.likedUsers.includes(userEmail);

    if (hasLiked) {
      // If the user has already liked, remove the like
      blog.likes -= 1;
      blog.likedUsers = blog.likedUsers.filter((email) => email !== userEmail);
    } else {
      // If the user hasn't liked, add the like
      blog.likes += 1;
      blog.likedUsers.push(userEmail);
    }

    await blog.save();
    res.status(200).json({ likes: blog.likes, liked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.PostBlogComment = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      author: req.body.author,
    };

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getLikedBlogsByUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const blogs = await Blog.find({ likedUsers: email });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
