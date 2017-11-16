const queryRunner = require("./query-runner");
const nock = require("nock");

describe("runQuery", () => {
  test("should return query result", async () => {
    const server = nock("http://localhost:9000")
      .post("/run-query", "from cards")
      .reply(200, {
        cards: {
          details: {},
          result: {}
        }
      });
    const response = await queryRunner.runQuery("from cards");

    expect(response).toHaveProperty("cards");
    expect(response).toHaveProperty("cards.details");
    expect(response).toHaveProperty("cards.result");
  });

  test("should forward params", async () => {
    const server = nock("http://localhost:9000")
      .post("/run-query", "from cards")
      .query({ id: "1" })
      .reply(200, {
        cards: {
          details: {},
          result: {}
        }
      });
    const response = await queryRunner.runQuery("from cards", { id: "1" });

    expect(response).toHaveProperty("cards");
    expect(response).toHaveProperty("cards.details");
    expect(response).toHaveProperty("cards.result");
  });
  test("should return error on fail", async () => {
    const server = nock("http://localhost:9000")
      .post("/run-query", "from cards")
      .query({ id: "1" })
      .reply(200, () => {
        throw new Error("ERROR!");
      });
    const response = await queryRunner.runQuery("from cards", { id: "1" });

    expect(response).toHaveProperty("message");
  });
});

describe("runNamedQuery", () => {
  test("should return query result", async () => {
    const server = nock("http://localhost:9000")
      .get("/run-query/my-namespace/my-query/1")
      .reply(200, {
        cards: {
          details: {},
          result: {}
        }
      });
    const response = await queryRunner.runNamedQuery(
      "my-namespace",
      "my-query",
      "1"
    );

    expect(response).toHaveProperty("cards");
    expect(response).toHaveProperty("cards.details");
    expect(response).toHaveProperty("cards.result");
  });

  test("should forward params", async () => {
    const server = nock("http://localhost:9000")
      .get("/run-query/my-namespace/my-query/1")
      .query({ id: "1" })
      .reply(200, {
        cards: {
          details: {},
          result: {}
        }
      });
    const response = await queryRunner.runNamedQuery(
      "my-namespace",
      "my-query",
      "1",
      { id: "1" }
    );

    expect(response).toHaveProperty("cards");
    expect(response).toHaveProperty("cards.details");
    expect(response).toHaveProperty("cards.result");
  });

  test("should return error on fail", async () => {
    const server = nock("http://localhost:9000")
      .get("/run-query/my-namespace/my-query/1")
      .query({ id: "1" })
      .reply(500, () => {
        throw new Error("ERROR!");
      });
    const response = await queryRunner.runNamedQuery(
      "my-namespace",
      "my-query",
      "1",
      { id: "1" }
    );

    expect(response).toHaveProperty("message");
  });
});
