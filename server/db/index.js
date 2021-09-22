//this is the access point for all things database related!

const db = require('./db');

const Guests = require('./models/Guests');

//associations could go here!

module.exports = {
  db,
  models: {
    Guests,
  },
};
