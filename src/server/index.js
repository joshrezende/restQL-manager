"use strict";

/* eslint-disable no-console */

/* istanbul ignore next */
const app = require("./app");

/* istanbul ignore next */
const PORT = process.env.RESTQL_MANAGER_PORT || 3000;

/* istanbul ignore next */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
