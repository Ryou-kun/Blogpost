//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lod = require("lodash");
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.URL);
}

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model('Blog', blogSchema);

const posts = async function () {
  const i = await Blog.find();
  if (Array.isArray(i)) {
    return i;
  } else {
    return [];
  }
};


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', async function (req, res) {
  const fetchedPost = await posts();
  res.render('home', { posts: fetchedPost, text: homeStartingContent, lod: lod});
});

app.get('/contact', function (req, res) {
  res.render('contact', { contact: contactContent });
});
    
app.get('/about', function (req, res) {
  res.render('about', { about: aboutContent });
});

app.get('/compose', function (req, res) {
  res.render('compose',);
});

app.post('/compose', async function (req, res) {
  const post = await new Blog({
    title: req.body.titles,
    content: req.body.posts
  });
  await post.save();
  res.redirect('/');
});

app.get('/post/:title', async function (req, res) {
  const fetchedPost = await posts();

  fetchedPost.forEach(function (post) {
    if (lod.kebabCase(post._id) === lod.kebabCase(req.params.title)) {
      res.render("post", { post: post })
    } else {
      console.log("No match found");
    }
  });

});

app.listen(3000 || process.env.PORT, function() {
  console.log("Server running at http://localhost:3000/");
});
