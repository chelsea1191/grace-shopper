const { Client } = require("pg");

const client = new Client(
	process.env.DATABASE_URL || "postgres://localhost/university_grace_shopper"
);

client.connect();

module.exports = client;
