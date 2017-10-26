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
yarn start
```

Access http://YOUR_IP_ADDRESS:5000/?targetRuntime=http://YOUR_RESTQL_SERVER_ADDRESS. Example: http://localhost:5000/?targetRuntime=http://localhost:9001


# Production build

To build a production bundle, run:

```shell
yarn build
```

You can now deploy the `build` folder.
