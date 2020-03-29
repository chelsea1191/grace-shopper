const client = require("../client");
const { hash } = require("../auth");

const users = {
	read: async () => {
		return (await client.query("SELECT * from users")).rows;
	},
	create: async ({ username, password, role, status }) => {
		const SQL = `INSERT INTO users(username, password, role, status) values($1, $2, $3, $4) returning *`;
		return (
			await client.query(SQL, [username, await hash(password), role, status])
		).rows[0];
	}
};

module.exports = users;
