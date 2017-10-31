"use strict";
const Promise = require("es6-promise").Promise;
const mongoose = require("mongoose");
const MongooseMap = require("mongoose-map")(mongoose);

mongoose.Promise = Promise;

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/restql";
mongoose.connection.on("connected", () => {
  console.log("Mongoose default connection open to " + MONGO_URL);
});

mongoose.connection.on("error", err => {
  console.log("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

const db = mongoose.connect(MONGO_URL, {
  useMongoClient: true
});

const QuerySchema = new mongoose.Schema(
  {
    name: String,
    namespace: String,
    size: Number,
    revisions: [
      {
        text: String
      }
    ]
  },
  {
    collection: "query"
  }
);

const TenantSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    mappings: MongooseMap
  },
  {
    collection: "tenant"
  }
);

module.exports = {
  Query: mongoose.model("Query", QuerySchema),
  Tenant: mongoose.model("Tenant", TenantSchema)
};
