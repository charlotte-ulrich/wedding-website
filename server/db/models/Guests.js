const Sequelize = require('sequelize');
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

// const SALT_ROUNDS = 5;

const Guests = db.define('guest', {
  full_name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  plus_one: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
  },
  guest_key: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  ceremony: {
    type: Sequelize.ENUM('attending', 'regrets', ''),
    defaultValue: '',
  },
  reception: {
    type: Sequelize.ENUM('attending', 'regrets', ''),
    defaultValue: '',
  },
  number_of_guests: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  notes: {
    type: Sequelize.TEXT,
  },
});

module.exports = Guests;

/**
 * instanceMethods
 */
Guests.prototype.correctPassword = function (candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

Guests.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT);
};

/**
 * classMethods
 */
Guests.authenticate = async function ({ guest_key }) {
  const guest = await this.findOne({ where: { guest_key } });
  if (!guest || !(await guest.correctPassword(guest_key))) {
    const error = Error('Incorrect code');
    error.status = 401;
    throw error;
  }
  return guest.generateToken();
};

Guests.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const guest = Guests.findByPk(id);
    if (!guest) {
      throw 'nooo';
    }
    return guest;
  } catch (ex) {
    const error = Error('bad token');
    error.status = 401;
    throw error;
  }
};

/**
 * hooks
 */
// const hashPassword = async (guest) => {
//in case the password has been changed, we want to encrypt it with bcrypt
//   if (guest.changed('password')) {
//     guest.password = await bcrypt.hash(guest.password, SALT_ROUNDS);
//   }
// };

// User.beforeCreate(hashPassword);
// User.beforeUpdate(hashPassword);
// User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));
