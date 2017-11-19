[![Build Status](https://travis-ci.org/B2W-BIT/restQL-manager.svg?branch=new-routes)](https://travis-ci.org/B2W-BIT/restQL-manager)
[![codecov](https://codecov.io/gh/thulio/restQL-manager/branch/add-tests/graph/badge.svg)](https://codecov.io/gh/thulio/restQL-manager)

## Running restQL Manager

restQL Manager allows you to easily develop and test new queries, save resources endpoints, check resources status and save queries that can be used by clients just referencing the query's name.

restQL Manager requires a [restQL-server](https://github.com/B2W-BIT/restQL-server) running instance.


## Development server


To install restQL manager dependecies run:

```shell
yarn install
```

To start the development server, run:

```shell
yarn server:start
```

In another shell, run:

```shell
yarn start
```

Access http://localhost:5000/.


# Production build

To build a production bundle, run:

```shell
yarn build
```

You can now deploy the `build` folder.
