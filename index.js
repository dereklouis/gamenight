const path = require('path');
const express = require('express');
const morgan = require('morgan');
const db = require('./server/db');
// const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 8080;
const app = express();
// const { User, Game } = require('./server/db/models');
require('dotenv').config();
module.exports = app;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./server/api'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not foundxxx');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const startListening = () => {
  app.listen(PORT, () =>
    console.log(
      `Gamenight is listening on port ${PORT}`,
      `http://localhost:${PORT}`
    )
  );
};

const syncDb = () => db.sync();

async function bootApp() {
  await syncDb();
  console.log('db synced');
  await startListening();
}

bootApp();
