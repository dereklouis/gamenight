const db = require('./server/db/db');
const { User, Game, Key } = require('./server/db/models/');

const seedGames = async () => {
  try {
    await Game.findOrCreate({
      where: {
        name: 'Among Us',
        path: 'amongUs',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Settlers of Catan',
        path: 'catan',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Blather Round',
        path: 'blatherRound',
      },
    });
    await Game.findOrCreate({
      where: {
        name: "Champ'd Up",
        path: 'champdUp',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Codenames',
        path: 'codenames',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Drawful',
        path: 'drawful',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Fibbage',
        path: 'fibbage',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Gartic Phone',
        path: 'garticPhone',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'GeoGuessr',
        path: 'geoGuessr',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Skribbl',
        path: 'skribbl',
      },
    });
    await Game.findOrCreate({
      where: {
        name: 'Quiplash',
        path: 'quiplash',
      },
    });
    console.log('Games have been seeded to the DB!');
  } catch (error) {
    console.error(error);
  }
};

const seedKeys = async () => {
  try {
    const key = await Key.findOrCreate({
      where: {
        id: 1,
      },
    });
    console.log('Keys have been seeded to the DB!');
  } catch (error) {
    console.error(error);
  }
};

seedGames();
seedKeys();
