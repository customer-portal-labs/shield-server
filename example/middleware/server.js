const express = require('express');
const {
  useDefaultMiddlewares,
  useErrorHandler,
} = require('../../dist/middlewares');

const app = express();

useDefaultMiddlewares(app);
/**
 * Do your stuff
 */

app.get('/', (req, res) => {
  res.send('Hello Shield');
});
useErrorHandler(app);

app.listen(8080, () => {
  console.log('Server start!');
});
