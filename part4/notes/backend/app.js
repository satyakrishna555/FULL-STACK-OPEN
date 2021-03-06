const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const config = require('./utils/config');
const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');

const app = express();

logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
