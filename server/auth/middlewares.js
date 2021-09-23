const Guests = require('../db/models/Guests');

const requireToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const guest = await Guests.findByToken(token);
    req.guest = guest;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = requireToken;
