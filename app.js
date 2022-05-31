require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

app.use(express.static('public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save((err) => {
    if (!err) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({
    email: username
  }, (err, foundUser) => {
    if (foundUser.password === password) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, () => {
  console.log("This server is running in port 3000.");
});
