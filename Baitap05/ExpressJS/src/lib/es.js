// lib/es.js
require("dotenv").config();
const { Client } = require("@elastic/elasticsearch");

const es = new Client({
  node: process.env.ES_URL,
  auth: { apiKey: process.env.ES_API_KEY },
});

module.exports = es;
