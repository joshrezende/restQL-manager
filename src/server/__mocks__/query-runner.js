const runQuery = jest.fn((queryText, params) => Promise.resolve({}));
const runNamedQuery = jest.fn((namespace, name, revision) =>
  Promise.resolve({})
);

module.exports = {
  runQuery,
  runNamedQuery
};
