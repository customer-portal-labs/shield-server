const express = require('express');
const {defaultMiddlewares, defaultErrorHandlers} = require('../../dist');
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
