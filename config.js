const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
let NODE_ENV = process.env.NODE_ENV;
BASE_URL = NODE_ENV == "development" ? `${process.env.LOCAL_URL}:${process.env.BACKEND_PORT}` : process.env.BACKEND_URL;
MONGO_DB_URL = NODE_ENV == "development" ? process.env.MONGO_DB_URL : process.env.MONGO_DB_URL;
WEB_NAME = process.env.WEB_NAME;

module.exports = {
  BASE_URL,
  MONGO_DB_URL,
  WEB_NAME
};
