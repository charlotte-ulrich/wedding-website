const router = require('express').Router();
const Guests = require('../db/models/Guests');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const guests = await Guests.findAll();
    res.json(guests);
  } catch (err) {
    next(err);
  }
});

router.get('/:guest_key', async (req, res, next) => {
  try {
    const { guest_key } = req.params;
    const invitation = await Guests.findOne({
      where: {
        guest_key,
      },
    });
    res.json(invitation);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const notes = Guests.build(req.body);
    await notes.save();
    const returnedNotes = notes.toJSON();
    res.json(returnedNotes);
  } catch (err) {
    next(err);
  }
});

router.put('/:guest_key', async (req, res, next) => {
  try {
    const { guest_key } = req.params;
    const rsvp = await Guests.findOne({
      where: {
        guest_key,
      },
    });
    await rsvp.update(req.body);
    res.send(rsvp);
  } catch (err) {
    next(err);
  }
});
