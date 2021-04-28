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
    console.log('user instance--->', user);
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
    res.send('voted for route hit');
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
    console.log(222, user);
    res.send(`${userName} is in the database!`);
  } catch (error) {
    next(error);
  }
});
