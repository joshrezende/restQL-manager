"use strict";

/* eslint-disable no-console */

const app = require("./app");

const PORT = process.env.RESTQL_MANAGER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
