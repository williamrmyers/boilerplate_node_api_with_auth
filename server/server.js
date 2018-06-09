require('./config/config.js');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {User} =require('./models/user');




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
    res.send(user);
  }).catch((e) => {
    res.status(404).send();
  })
});


// User.find({}).then((user) => {
//   console.log({user});
// }).catch((e) => {
//   console.log(`Error running query.`, e);
// });


app.listen(port, ()=>{
  console.log(`App started on port ${port}`);
});
