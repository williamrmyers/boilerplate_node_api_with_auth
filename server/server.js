require('./config/config.js');

const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

let app = express();
const port = process.env.PORT;


app.get('/', (req, res)=>{
  res.send(`Hello Express.js!`)
});


app.listen(port, ()=>{
  console.log(`App started on port ${port}`);
});
