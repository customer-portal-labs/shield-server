import Express from 'express';
import { useDefaultMiddlewares, useErrorHandler } from './middlewares';

// export default (controllers = [], middlewares = []) => {

// };

const app = Express();

useDefaultMiddlewares(app);
useErrorHandler(app);

export default app;
