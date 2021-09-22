const { green, red } = require('chalk');
const { db } = require('../server/db');
const Guests = require('../server/db/models/Guests');
const { uuid } = require('uuidv4');

const codeShortener = () => {
  return uuid().slice(0, 5).toUpperCase();
};

const guests = [
  {
    full_name: 'Emma Jackson',
    plus_one: 'Clark Perkins',
    guest_key: codeShortener(),
    ceremony: '',
    reception: '',
    number_of_guests: 0,
    notes: '',
  },
  {
    full_name: 'Molly Corn',
    plus_one: '',
    guest_key: codeShortener(),
    ceremony: '',
    reception: '',
    number_of_guests: 0,
    notes: '',
  },
  {
    full_name: 'Garrett Law',
    plus_one: 'Doug Rosenthal',
    guest_key: codeShortener(),
    ceremony: '',
    reception: '',
    number_of_guests: 0,
    notes: '',
  },
];

const seed = async () => {
  try {
    await db.sync({ force: true });
    const createdGuests = await Promise.all(
      guests.map((guest) => {
        return Guests.create(guest);
      })
    );
  } catch (err) {
    console.log(red(err));
  }
};

module.exports = seed;
// If this module is being required from another module, then we just export the
// function, to be used as necessary. But it will run right away if the module
// is executed directly (e.g. `node seed.js` or `npm run seed`)
if (require.main === module) {
  seed()
    .then(() => {
      console.log(green('Seeding success!'));
      db.close();
    })
    .catch((err) => {
      console.error(red('Oh noes! Something went wrong!'));
      console.error(err);
      db.close();
    });
}
