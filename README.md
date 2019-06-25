# sls-api-browse

[![Build Status](https://travis-ci.org/janis-commerce/sls-api-browse.svg?branch=master)](https://travis-ci.org/janis-commerce/sls-api-browse)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/sls-api-browse/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/sls-api-browse?branch=master)

An integration handler for Serverless and JANIS Views API Browse

# Installation

```
npm install @janiscommerce/sls-api-browse
```

# Usage

- API Browse Data
```js
'use strict';

const { SlsApiBrowseData } = require('@janiscommerce/sls-api-browse');

module.exports.handler = (...args) => SlsApiBrowseData.handler(...args);
```

- API Browse Filters
```js
'use strict';

const { SlsApiBrowseFilters } = require('@janiscommerce/sls-api-browse');

module.exports = SlsApiBrowseFilters.handler;
```

# Function minimal configuration

```yml
functions:
  handler: path/to/your.handler
  events:
    - http:
        integration: lambda
        path: view/{entity}/browse/data
        method: GET
        request:
          parameters:
            paths:
              entity: true
```