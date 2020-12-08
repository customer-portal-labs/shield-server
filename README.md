# Shield Server

[![npm version](https://badge.fury.io/js/%40cplabs%2Fshield-server.svg)](https://badge.fury.io/js/%40cplabs%2Fshield-server)
[![shield: project](https://img.shields.io/badge/shield-project-green.svg?style=flat-square)](https://github.com/shield/shield-server)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-007ACC.svg?style=flat-square)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/customer-portal-labs/shield-server/branch/master/graph/badge.svg?token=U418S5TNWR)](https://codecov.io/gh/customer-portal-labs/shield-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
shield-server

# Serve Static only
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
} = require('@cplabs/shield-server');

const app = express();

app.use(defaultMiddlewares());
app.use(defaultErrorHandlers());

app.listen(8080, () => {
  console.log(`Server start...`);
});
```
