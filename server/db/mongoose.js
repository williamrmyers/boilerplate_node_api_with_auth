const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
// Allows us to use .then()

mongoose.connect( process.env.MONGODB_URI );

module.exports = { mongoose };
