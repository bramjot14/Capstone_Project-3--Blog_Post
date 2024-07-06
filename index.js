import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;  

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});
const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for posts (for demonstration purposes)
let posts = [];

// Route to render the home page with all posts
app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

// Route to handle form submission and add new posts
app.post("/submit", upload.single("image"), (req, res) => {
  let newPost = {
    title: req.body.title,
    author: req.body.author,
    email: req.body.email,
    category: req.body.category,
    content: req.body.content,
    image: req.file ? `/uploads/${req.file.filename}` : null 
    //condition ? value_if_true : value_if_false)
  };
  console.log("Received new post:", newPost);

  // Add the new post to the posts array
  posts.push(newPost);

  // Redirect to the home page to display all posts
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  let postId = req.params.id;
  let post = posts[postId];
  res.render("edit.ejs", { postId: postId, post: post });
});

// Route to handle the edit form submission
app.post("/edit/:id", upload.single("image"), (req, res) => {
  let postId = req.params.id;
  posts[postId] = {
    title: req.body.title,
    author: req.body.author,
    email: req.body.email,
    category: req.body.category,
    content: req.body.content,
    image: req.file ? `/uploads/${req.file.filename}` : posts[postId].image // Use new image if uploaded, otherwise keep the old one
  };
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  let postId = req.params.id;
  let post = posts[postId];
  res.render("delete.ejs", { postId: postId, post: post });
});

app.post("/delete/:id", (req, res) => {
  let postId = req.params.id;
  let post = posts[postId];
  posts.pop(post);  // OR  posts.splice(post, 1); 
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
