const router = require('express').Router();
const { Key } = require('../db/models');
module.exports = router;

//get keys pk #1
router.get('/', async (req, res, next) => {
  try {
    const keys = await Key.findByPk(1);
    res.json(keys);
  } catch (error) {
    next(error);
  }
});

router.put('/zoomlink', async (req, res, next) => {
  try {
    const keys = await Key.findByPk(1);
    keys.update({
      link: req.body.link,
    });
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});

router.put('/roomcode', async (req, res, next) => {
  try {
    const keys = await Key.findByPk(1);
    keys.update({
      roomCode: req.body.roomCode,
    });
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});

router.put('/gamestatus', async (req, res, next) => {
  try {
    const keys = await Key.findByPk(1);
    let prevStatus = keys.dataValues.gameActive;
    keys.update({
      gameActive: !prevStatus,
    });
    res.json(!prevStatus);
  } catch (error) {
    next(error);
  }
});

router.patch('/reset', async (req, res, next) => {
  try {
    const keys = await Key.findByPk(1);
    await keys.update({
      link:
        'https://us02web.zoom.us/j/EXAMPLE-TESTpwd=EXAMPLE-ZOOM-LINK-FOR-TESTING...',
      roomCode: null,
      gameActive: false,
      availablePhotoIDs: [],
    });
    await keys.update({
      availablePhotoIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    });
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});
