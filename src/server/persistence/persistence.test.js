import persistence from ".";
import { db, Tenant, Query } from "./models";
import mongoose from "mongoose";

function cleanup(collection, callback) {
  db.dropCollection(collection, function(err, removed) {
    if (callback) {
      callback();
    }
  });
}

describe("#loadTenants", () => {
  beforeEach(() => {
    cleanup("tenant");
  });

  afterAll(done => {
    cleanup("tenant", done);
  });

  test("should find all Tenants", () => {
    return Tenant.create({
      _id: "New Tenant"
    }).then(tenant => {
      return persistence.loadTenants().then(tenants => {
        expect(tenants.length).toEqual(1);
      });
    });
  });

  test("should return the _ids", () => {
    return Tenant.create({
      _id: "New Tenant"
    }).then(tenant => {
      return persistence.loadTenants().then(tenants => {
        tenants.forEach(tenant => {
          expect(tenant._id).not.toBe(null);
        });
      });
    });
  });

  test("should return empty list on error", () => {
    return persistence.loadTenants().then(tenants => {
      expect(tenants.length).toEqual(0);
    });
  });
});

describe("#loadResourcesFromTenant", () => {
  beforeEach(() => {
    cleanup("tenant");
  });

  afterAll(done => {
    cleanup("tenant", done);
  });

  test("should return the mappings", () => {
    return Tenant.create({
      _id: "New Tenant",
      mappings: { api_1: "http://example.com/api1" }
    }).then(tenant => {
      return persistence.loadResourcesFromTenant(tenant._id).then(mappings => {
        expect(mappings.length).toEqual(1);
      });
    });
  });

  test("should adapt each resource", () => {
    return Tenant.create({
      _id: "New Tenant",
      mappings: { api_1: "http://example.com/api1" }
    }).then(tenant => {
      return persistence.loadResourcesFromTenant(tenant._id).then(mappings => {
        mappings.forEach(mapping => {
          expect(mapping["base-url"]).toEqual("http://example.com");
          expect(mapping.name).toBe("api_1");
          expect(mapping.url).toBe("http://example.com/api1");
        });
      });
    });
  });

  test("should return empty list on error", () => {
    return persistence
      .loadResourcesFromTenant(mongoose.Types.ObjectId("123456789012"))
      .then(mappings => {
        expect(mappings.length).toBe(0);
      });
  });
});

describe("#loadNamespaces", () => {
  beforeEach(() => {
    cleanup("query");
  });

  afterAll(done => {
    cleanup("query", done);
  });

  test("should return all namespaces", () => {
    return Query.create({
      name: "Query 1",
      namespace: "namespace"
    }).then(query => {
      return persistence.loadNamespaces().then(namespaces => {
        expect(namespaces.length).toBe(1);
      });
    });
  });

  test("should return empty list on error", () => {
    return persistence.loadNamespaces().then(namespaces => {
      expect(namespaces.length).toBe(0);
    });
  });
});

describe("#loadQueries", () => {
  beforeEach(() => {
    cleanup("query");
  });

  afterAll(done => {
    cleanup("query", done);
  });

  test("should return all queries in the namespace", () => {
    return Query.create({
      name: "Query 1",
      namespace: "namespace"
    }).then(query => {
      return persistence.loadQueries("namespace").then(queries => {
        expect(queries.length).toBe(1);
      });
    });
  });

  test("should build the queries", () => {
    return Query.create({
      name: "Query 2",
      namespace: "namespace",
      size: 1,
      revisions: []
    }).then(query => {
      return persistence.loadQueries("namespace").then(queries => {
        expect(queries[0].id).toBe("Query 2");
        expect(queries[0].revisions).toBe("/ns/namespace/query/Query 2");
        expect(queries[0]["last-revision"]).toBe("/ns/namespace/Query 2/1");
      });
    });
  });

  test("should return empty list on error", () => {
    return persistence.loadQueries("namespace").then(queries => {
      expect(queries.length).toBe(0);
    });
  });
});

describe("#saveResource", () => {
  beforeEach(() => {
    cleanup("tenant");
  });

  afterAll(done => {
    cleanup("tenant", done);
  });

  test("should add resource to tenant", () => {
    return Tenant.create({
      _id: "New Tenant"
    }).then(tenant => {
      return persistence
        .saveResource(tenant._id, "api", "http://example.com")
        .then(tenant => {
          expect(tenant.mappings.get("api")).toEqual("http://example.com");
        });
    });
  });
});

describe("#loadQueryRevision", () => {
  beforeEach(() => {
    cleanup("query");
  });

  afterAll(done => {
    cleanup("query", done);
  });

  test("should load specific revision", () => {
    return Query.create({
      name: "query",
      namespace: "my_namespace",
      revisions: [{ text: "from cards" }]
    }).then(query => {
      return persistence
        .loadQueryRevision("my_namespace", "query", 1)
        .then(dbQuery => {
          expect(dbQuery).toEqual("from cards");
        });
    });
  });
});

describe("#loadQueryRevisions", () => {
  beforeEach(() => {
    cleanup("query");
  });

  afterAll(done => {
    cleanup("query", done);
  });

  test("should load all revisions", () => {
    return Query.create({
      name: "query",
      namespace: "my_namespace",
      revisions: [{ text: "from cards" }]
    }).then(query => {
      return persistence
        .loadQueryRevisions("my_namespace", "query")
        .then(revisions => {
          expect(revisions.length).toBe(1);
        });
    });
  });
  test("should build all revisions", () => {
    return Query.create({
      name: "query",
      namespace: "my_namespace",
      revisions: [{ text: "from cards" }]
    }).then(query => {
      return persistence
        .loadQueryRevisions("my_namespace", "query")
        .then(revisions => {
          expect(revisions[0].index).toBe(1);
          expect(revisions[0].link).toBe("/run-query/my_namespace/query/1");
          expect(revisions[0].query).toBe(
            "/ns/my_namespace/query/query/revision/1"
          );
        });
    });
  });
});

describe("#addQuery", () => {
  beforeEach(() => {
    cleanup("query");
  });

  afterAll(done => {
    cleanup("query", done);
  });

  test("should create a new query", () => {
    return persistence
      .addQuery("my_namespace", "my_query", "from cards")
      .then(query => {
        expect(query.location).toEqual("/run-query/my_namespace/my_query/1");
      });
  });

  test("should add a new revision", () => {
    return Query.create({
      namespace: "my_namespace",
      name: "my_query",
      revisions: [{ text: "from planets" }],
      size: 1
    }).then(query => {
      return persistence
        .addQuery(query.namespace, query.name, "from cards")
        .then(dbQuery => {
          expect(dbQuery.location).toEqual(
            "/run-query/my_namespace/my_query/2"
          );
        });
    });
  });
});

afterAll(() => {
  db.close();
});
