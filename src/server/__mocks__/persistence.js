const loadTenants = jest.fn(() => {});
const loadResourcesFromTenant = jest.fn(tenant => {});
const loadNamespaces = jest.fn(() => Promise.resolve({}));
const saveResource = jest.fn((tenant, name, url) => {});
const loadQueries = jest.fn(namespace => {});
const loadQueryRevision = jest.fn((namespace, query, revision) => {});
const loadQueryRevisions = jest.fn((namespace, query) => {});
const addQuery = jest.fn((namespace, name, text) => {});

module.exports = {
  loadTenants,
  loadResourcesFromTenant,
  loadNamespaces,
  saveResource,
  loadQueries,
  loadQueryRevision,
  loadQueryRevisions,
  addQuery
};
