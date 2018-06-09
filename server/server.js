require('./config/config.js');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');


let {mongoose} = require('./db/mongoose');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');




let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


app.get('/', (req, res)=>{
  res.send(`This Is Publicly Available Data.`);
});

app.get('/members', (req, res)=>{
  res.send(`This is private data only avalable to users who are logged in.`);
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'first_name', 'last_name']);
  let user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete(`/users/me/token`, authenticate, (req, res) => {
  console.log(req.token);
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


// User.find({}).then((user) => {
//   console.log({user});
// }).catch((e) => {
//   console.log(`Error running query.`, e);
// });


app.listen(port, ()=>{
  console.log(`App started on port ${port}`);
});
