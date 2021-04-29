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
