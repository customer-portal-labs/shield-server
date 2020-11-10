// import yargs from 'yargs';
import arg from 'arg';
import Express from 'express';
import { useDefaultMiddlewares, useErrorHandler } from '../middlewares';
import config from '../config';

const args = arg({
  // Types
  '--help': Boolean,
  '--version': Boolean,
  '--debug': Boolean,
  '--verbose': arg.COUNT, // Counts the number of times --verbose is passed
  '--port': Number, // --port <number> or --port=<number>
  '--name': String, // --name <string> or --name=<string>
  '--tag': [String], // --tag <string> or --tag=<string>

  // Aliases
  '-V': '--version',
  '-v': '--verbose',
  '-n': '--name', // -n <string>; result is stored in --name
  '--label': '--name', // --label <string> or --label=<string>;
  //     result is stored in --name
});

console.log(args);

// const args = yargs
//   .option('mode', {
//     alias: 'm',
//     choices: ['static', 'api', 'fullstack'],
//     default: 'static',
//     description:
//       "Server Mode, You can pick one from 'static', 'api', 'fullstack'",
//   })
//   .option('port', {
//     alias: 'p',
//     number: true,
//     default: 8080,
//   })
//   .option('staticPath', {
//     alias: 'path',
//   });

// const app = Express();

// useDefaultMiddlewares(app);
// useErrorHandler(app);

// (async () => {
//   await app.listen(config.port);
//   console.log(`Shield Server is running on port: ${config.port}`);
// })();
