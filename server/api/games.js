const router = require('express').Router();
const { Game } = require('../db/models');
module.exports = router;

//get all games
router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll();
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
});

//vote for a game
router.put('/:gameName', async (req, res, next) => {
  try {
    const gameToUpdate = await Game.findOne({
      where: {
        path: req.params.gameName,
      },
    });

    const currentVoteCount = gameToUpdate.dataValues.voteCount;
    if (req.body.vote === '+') {
      await gameToUpdate.update({
        voteCount: currentVoteCount + 1,
      });
    } else if (req.body.vote === '-' && currentVoteCount > 0) {
      await gameToUpdate.update({
        voteCount: currentVoteCount - 1,
      });
    }
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    next(error);
  }
});

//get all games
router.patch('/reset', async (req, res, next) => {
  try {
    const allGames = await Game.findAll();
    await allGames.forEach((game) =>
      game.update({
        voteCount: 0,
      })
    );
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});
