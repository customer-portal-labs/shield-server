const express = require('express');
const defaultMiddlewares = require('../../dist/middlewares/default');
const defaultErrorHandlers = require('../../dist/middlewares/errorHandler');
const app = express();

app.use(defaultMiddlewares());
/**
 * Do your stuff
 */

app.get('/', (req, res) => {
  res.send('Hello Shield');
});

app.use(defaultErrorHandlers())

app.listen(8080, () => {
  console.log('Server start!');
});
