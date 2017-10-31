const url = require("url");

const { fetch } = require("cross-fetch");

const RESTQL_SERVER_URL =
  process.env.RESTQL_SERVER_URL || "http://localhost:9000";
const RESTQL_HEADERS = {
  "Content-Type": "text/plain",
  Accept: "application/json"
};

function runQuery(queryText, params) {
  return fetch(
    RESTQL_SERVER_URL +
      "/run-query" +
      url.format({
        query: params
      }),
    {
      method: "POST",
      headers: RESTQL_HEADERS,
      body: queryText
    }
  )
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch(error => {
      return error;
    });
}

function runNamedQuery(namespace, name, revision, params) {
  return fetch(
    RESTQL_SERVER_URL +
      "/run-query/" +
      namespace +
      "/" +
      name +
      "/" +
      revision +
      url.format({
        query: params
      }),
    {
      headers: RESTQL_HEADERS
    }
  )
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch(error => {
      return error;
    });
}

function validateQuery(query, params) {
  return fetch(
    RESTQL_SERVER_URL +
      "/validate-query" +
      url.format({
        query: params
      }),
    {
      headers: RESTQL_HEADERS,
      method: "POST",
      body: query
    }
  ).then(response => {
    if (response.status !== 200) {
      let error = Error(response.message);
      error.response = response;
      throw error;
    } else {
      return true;
    }
  });
}

module.exports = {
  runQuery: runQuery,
  runNamedQuery: runNamedQuery,
  validateQuery: validateQuery
};
