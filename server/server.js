require('./config/config.js');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const path = require('path');


let {mongoose} = require('./db/mongoose');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

let app = express();
const port = process.env.PORT;


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}



app.use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-auth, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE, OPTIONS');
          next();
});


app.use(bodyParser.json());

app.get('/members', authenticate, (req, res)=>{
  res.send({
    text:`These kittens are only avalable to members!`,
    image:[
      'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
      'https://media.giphy.com/media/5kjsIIc47PKRq/giphy.gif',
      'https://media.giphy.com/media/GKnJPvJh59ywg/giphy.gif'
      ]
  });
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'first_name', 'last_name']);
  let user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send({
      _id: user._id,
      email: user.email,
      token
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.post(`/users/login`, (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({
        _id: user._id,
        email: user.email,
        token
      });
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get(`/users/me`, authenticate, (req, res) => {
  res.send(req.user);
});

// Changes user data besides password
app.patch(`/users/me`, authenticate, (req, res) => {
  let body = _.pick(req.body, ['email', 'first_name', 'last_name']);

  return User.findOneAndUpdate({_id: req.user._id}, {$set: body}, {new: true}).then((user)=>{
  if (!user) {
    return res.status(404).send();
  }
  // success case
  res.send(req.user);

  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.patch(`/users/password_change`, authenticate, (req, res) => {

  let body = _.pick(req.body, ['password']);

  req.user.changePassword().then((password) => {
    // console.log(user);
    User.findOneAndUpdate({_id: req.user._id}, {$set: {password}}, {new: true}).then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send({user});
    })
  }).catch((e)=>{
      res.status(400).send(e);
    });
});


app.delete(`/users/me`, authenticate, (req, res) => {
  req.user.remove().then((user) => {
    res.status(200).send(user);
  }, () => {
    res.status(400).send();
  });
});

app.delete(`/users/me/token`, authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, ()=>{
  console.log(`App started on port ${port}`);
});

module.exports = {app};
