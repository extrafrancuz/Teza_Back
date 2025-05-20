require("./config/db");

const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const port = process.env.PORT;

const UserRouter = require("./routes/usersRoute");
const RentRouter = require("./routes/rentsRoute");
const JobRouter = require("./routes/jobsRoute");
const BlogsRouter = require("./routes/blogsRoute");
const FeedbackRouter = require("./routes/feedbackRoute");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api", UserRouter);
app.use("/api", RentRouter);
app.use("/api", JobRouter);
app.use("/api", BlogsRouter);
app.use("/api", FeedbackRouter);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});