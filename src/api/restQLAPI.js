// This makes requests to restQL manager API
const request = require("superagent");

// Processing request
export function processResult(response) {
  return JSON.parse(response.body.text);
}

// Tenant operations
export function loadTenants(callback) {
  const loadTenantsUrl = "/tenants";

  request
    .get(loadTenantsUrl)
    .set("Content-Type", "text/plain")
    .set("Accept", "application/json")
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

export function loadResourcesFromTenant(tenant, callback) {
  const loadTenantResourcesUrl = "/resources/" + tenant;

  request
    .get(loadTenantResourcesUrl)
    .set("Content-Type", "text/plain")
    .set("Accept", "application/json")
    .end((err, body) => {
      return callback({
        error: err,
        body: body.text !== undefined ? JSON.parse(body.text) : body
      });
    });
}

export function updateResource(authorizationKey, tenant, resource, callback) {
  const updateTenantResourceUrl = "/resources/" + tenant + "/update";

  const requestBody = {
    ...resource,
    "authorization-key": authorizationKey
  };

  request
    .post(updateTenantResourceUrl)
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .send(requestBody)
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

// Running Queries
export function runQuery(
  queryString,
  queryParams = "",
  tenant = null,
  callback
) {
  const runQueryUrl =
    "/run-query?" + queryParams + (tenant ? "&tenant=" + tenant : "");

  let body = {
    query: queryString
  };

  request
    .post(runQueryUrl)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send(body)
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

// Saving a query
export function saveQuery(tenant, namespace, queryName, queryString, callback) {
  const saveQueryUrl =
    "/ns/" +
    namespace +
    "/query/" +
    queryName +
    (tenant ? "?tenant=" + tenant : "");

  let body = {
    query: queryString
  };

  request
    .post(saveQueryUrl)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send(body)
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

// Loading namespaces
export function loadNamespaces(callback) {
  const loadNamespacesUrl = "/namespaces";

  request
    .get(loadNamespacesUrl)
    .set("Content-Type", "text/plain")
    .set("Accept", "application/json")
    .send()
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

// Loading Queries
export function loadQueries(namespace, callback) {
  const loadQueriesUrl = "/ns/" + namespace;

  request
    .get(loadQueriesUrl)
    .set("Content-Type", "text/plain")
    .set("Accept", "application/json")
    .send()
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

// Loading all query revisions
export function loadRevisions(namespace, query, callback) {
  const revisionsUrl = "/ns/" + namespace + "/query/" + query;

  request
    .get(revisionsUrl)
    .set("Content-Type", "text/plain")
    .set("Accept", "application/json")
    .send()
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

// Loading a query revision
export function loadRevisionByUrl(revisionUrl, callback) {
  request
    .get(revisionUrl)
    .set("Content-Type", "text/plain")
    .set("Accept", "application/json")
    .send()
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}

// Loading a query revision
export function loadRevision(namespace, queryName, revision, callback) {
  const revisionUrl =
    "/ns/" + namespace + "/query/" + queryName + "/revision/" + revision;

  request
    .get(revisionUrl)
    .set("Content-Type", "text/plain")
    .set("Accept", "application/json")
    .send()
    .end((err, body) => {
      return callback({
        error: err,
        body: body
      });
    });
}
