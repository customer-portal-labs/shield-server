# Shield Server

[![Build Status](https://github.com/customer-portal-labs/shield-server/workflows/Build/badge.svg)](https://github.com/customer-portal-labs/shield-server/actions)
[![npm version](https://img.shields.io/npm/v/@cplabs/shield-server?logo=npm)](https://www.npmjs.com/package/@cplabs/shield-server)
[![shield: project](https://img.shields.io/badge/shield-project-green.svg?style=flat-square)](https://github.com/customer-portal-labs/shield-server)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-007ACC.svg?style=flat-square)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/customer-portal-labs/shield-server/branch/master/graph/badge.svg?token=U418S5TNWR)](https://codecov.io/gh/customer-portal-labs/shield-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Shield Server is a express middlewares bundle, which could help developer to bootstrap a backend project in few minutes.

The features provided by Shield Server

- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Compression](https://developer.mozilla.org/fr/docs/Web/HTTP/Compression)
- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [JSend (JSON Response Specification)](https://github.com/omniti-labs/jsend)
- [Reverse Proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
- [HTTP Header Security](https://owasp.org/www-project-secure-headers/)
- [Splunk Logger (HEC - HTTP Event Collector)](https://docs.splunk.com/Documentation/Splunk/8.1.1/Data/UsetheHTTPEventCollector)
- Error Handlers

Top features are powered by following popular middlewares:

- [body-parser](https://github.com/expressjs/body-parser)
- [compression](https://github.com/expressjs/compression)
- [connect-history-api-fallback](https://github.com/bripkens/connect-history-api-fallback)
- [cookie-parser](https://github.com/expressjs/cookie-parser)
- [cors](https://github.com/expressjs/cors)
- [helmet](https://github.com/helmetjs/helmet)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [morgan](https://github.com/expressjs/morgan)

## Getting Started

### Installation

```shell
npm install @cplabs/shield-server

# or use yarn

yarn add @cplabs/shield-server
```

### Usage

#### Codeless mode

```shell
# Default
shield-server .

```

##### Codeless CLI Configuration

- **--port**
- **--cors**
- **--debug**
- **--history-api-fallback**
- **--ssl-cert**
- **--ssl-key**

#### Middleware mode

```js
const express = require('express');
const {
  defaultMiddlewares,
  defaultErrorHandlers,
  logger,
} = require('@cplabs/shield-server');

const app = express();

app.use(defaultMiddlewares());
app.use(defaultErrorHandlers());

app.listen(8080, () => {
  logger.info(`Server start...`);
});
```

## Configuration

### Default configs

https://github.com/customer-portal-labs/shield-server/blob/9394a255a6c7ee206730918e6f7fa1b4d63c0862/src/config.ts#L9-L27

### Options

#### name

type String

The application name

#### compression

#### cors

#### corsOption

#### mode

- `static`
- `api`
- `fullstack`

#### morganFormat

- `combined`
- `common`
- `dev`
- `short`
- `tiny`

#### port

type int

default 8080

#### debug

type boolean

default `false`

#### ssl

#### splunk

##### splunk.httpRequest

##### splunk.

#### staticDir

#### publicPath

#### proxies

#### rewrite

#### historyApiFallback

#### helmetOption

#### loggerLevel

#### requestBodySize
