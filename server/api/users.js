const router = require('express').Router();
const { User } = require('../db/models');
module.exports = router;

const getUser = async (reqName) => {
  const user = await User.findOne({
    where: {
      name: reqName,
    },
  });
  return user;
};

//get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

//update attending status for user
router.put('/attending/:userName', async (req, res, next) => {
  try {
    const user = await getUser(req.params.userName);
    await user.update({
      attending: req.body.answer,
    });
    res.send(req.body.answer);
  } catch (error) {
    next(error);
  }
});

//update user voted for
router.put('/vote/:userName', async (req, res, next) => {
  try {
    const user = await getUser(req.params.userName);
    const instance = await user.dataValues;
    const prevArr = instance.votedFor;
    const prevVoteCount = instance.votesRemaining;
    if (req.body.vote === '+') {
      await user.update({
        votedFor: [...prevArr, req.body.game],
        votesRemaining: prevVoteCount - 1,
      });
    } else if (req.body.vote === '-') {
      await user.update({
        votedFor: prevArr.filter((game) => game !== req.body.game),
        votesRemaining: prevVoteCount + 1,
      });
    }
    res.json(user.dataValues.votedFor);
  } catch (error) {
    next(error);
  }
});

//get single user
router.get('/:userName', async (req, res, next) => {
  try {
    const user = await getUser(req.params.userName);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

//find or create user
router.put('/', async (req, res, next) => {
  try {
    const userName = req.body.name;
    const user = await User.findOrCreate({
      where: {
        name: userName,
      },
    });
    res.send(`${userName} is in the database!`);
  } catch (error) {
    next(error);
  }
});

//reset
router.patch('/reset', async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    await allUsers.forEach((user) =>
      user.update({
        attending: 'n/a',
        votesRemaining: 3,
        votedFor: [],
      })
    );
    res.sendStatus(202);
  } catch (error) {
    console.error(error);
  }
});
