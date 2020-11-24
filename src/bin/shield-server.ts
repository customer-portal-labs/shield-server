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
  '--history-api-fallback': Boolean,
  '--port': Number, // --port <number> or --port=<number>
  '--public-path': String, // --public-path <string> or --public-path=<string>
  '--ssl-cert': String,
  '--ssl-key': String,

  // Aliases
  '-V': '--version',
  '-H': '--help',
});

if (args['--help']) {
  const helpMessage = chalk`${figlet.textSync('Shield')}
  {bold USAGE}

      {dim $} {bold shield-server} [--help] --port {underline 8080}

  {bold OPTIONS}
      --help                      Shows this help message
      --version                   Shows version
      --debug                     Turn on debug mode
      --cors                      Turn on cors
      --history-api-fallback      Turn on single page mode
      --port {underline 8080}     The server port
      --public-path               The public path
      --ssl-cert                  The cert path for SSL
      --ssl-key                   The key path for SSL
      
`;
  console.log(helpMessage);
  process.exit(0);
}

if (args['--version']) {
  console.log(`${pkgJSON.version}`);
  process.exit(0);
}

const config: IConfig = getConfig();

if (args._ && args._.length > 0) {
  const staticDir = args._[0];
  config.staticDir = staticDir;
}

if (Number.isInteger(args['--port'])) {
  config.port = args['--port'];
}

if (args['--cors']) {
  config.cors = true;
}

if (args['--history-api-fallback']) {
  config.historyApiFallback = true;
}

if (args['--ssl-cert'] && args['--ssl-key']) {
  config.ssl = {
    cert: args['--ssl-cert'],
    key: args['--ssl-key'],
  };
}

if (args['--debug']) {
  config.debug = true;
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
    if (config.debug) {
      console.log(chalk`
  {bold Debug Mode}

    ${JSON.stringify(config, null, 2)}
  `);
    }
  });
}
