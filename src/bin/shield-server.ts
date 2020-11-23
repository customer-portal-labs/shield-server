#!/usr/bin/env node
import fs from 'fs';
import http from 'http';
import https from 'https';
import arg from 'arg';
import chalk from 'chalk';
import figlet from 'figlet';
import path from 'path';
import Express from 'express';
import { useDefaultMiddlewares, useErrorHandler } from '../middlewares';
import { IConfig } from '../models/Config';
import { getConfig } from '../config';
const pkgJSON = require('../../package.json');

const args = arg({
  // Types
  '--help': Boolean,
  '--version': Boolean,
  '--debug': Boolean,
  '--cors': Boolean,
  '--historyApiFallback': Boolean,
  '--verbose': arg.COUNT, // Counts the number of times --verbose is passed
  '--port': Number, // --port <number> or --port=<number>
  '--publicPath': String, // --publicPath <string> or --publicPath=<string>

  // Aliases
  '-V': '--version',
  '-v': '--verbose',
  '-n': '--name', // -n <string>; result is stored in --name
  '--label': '--name', // --label <string> or --label=<string>;
  //     result is stored in --name
});

if (args['--help']) {
  console.log(chalk.red(figlet.textSync('Shield')));
}

const config: IConfig = getConfig();

if (args._ && args._.length > 0) {
  const staticDir = args._[0];
  config.staticDir = staticDir;
  console.log(staticDir);
  console.log(config.staticDir);
  console.log(path.resolve(config.staticDir));
}

if (Number.isInteger(args['--port'])) {
  config.port = args['--port'];
}

if (args['--debug']) {
  config.debug = true;
}

if (args['--cors']) {
  config.cors = true;
}

if (args['--historyApiFallback']) {
  config.historyApiFallback = true;
}

if (args['--version']) {
  console.log(`shield-server v${pkgJSON.version}`);
}

if (!args['--help'] && !args['--version']) {
  const app = Express();

  useDefaultMiddlewares(app, config);
  useErrorHandler(app, config);
  let protocol = 'http';
  let server = null;
  if (config.ssl) {
    protocol += 's';
    const sslOptions = {
      key: fs.readFileSync(config.ssl.key),
      cert: fs.readFileSync(config.ssl.cert),
    };
    server = https.createServer(sslOptions, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(config.port, () => {
    console.log(chalk.green(figlet.textSync('Shield')));
    console.log(
      chalk.green(`Server start on ${protocol}://localhost:${config.port}`)
    );
  });
}
