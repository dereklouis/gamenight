const path = require('path');
const express = require('express');
const morgan = require('morgan');
const db = require('./server/db');
const PORT = process.env.PORT || 8080;
const app = express();
const options = {};
const io = require('socket.io', options);
module.exports = app;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./server/api'));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(
      `Gamenight is listening on port ${PORT}`,
      `http://localhost:${PORT}`
    )
  );
  const socket = io(server);
  socket.on('connection', function (socketArg) {
    console.log('socket CONNECT', socketArg.id);

    socketArg.on('DB-Update', function (data) {
      console.log('DB UPDATED');
      socket.sockets.emit('DB-Refresh', 'DB Refresh Activated');
    });
  });
};

const syncDb = () => db.sync();

async function bootApp() {
  await syncDb();
  console.log('db synced');
  await startListening();
}

bootApp();
