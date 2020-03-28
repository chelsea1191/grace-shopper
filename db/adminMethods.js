const client = require("./client");

const changePromoStatus = async (promoId, status) => {
  await client.query(`UPDATE promos SET status=$2 WHERE id=$1`, [
    promoId,
    status
  ]);
};

const getAllUsers = async () => {
  const users = await client.query(`SELECT * from users`);
  return await users.rows;
};

const addNewPromo = async (code, description, multiplier) => {
  await client.query(
    `INSERT INTO promos(code, description, multiplier, status) VALUES ($1, $2, $3, $4) returning *`,
    [code, description, multiplier, "active"]
  );
};

const changeUserStatus = async (userId, status) => {
  await client.query(`UPDATE users SET status=$2 WHERE id=$1`, [
    userId,
    status
  ]);
};

module.exports = {
  changePromoStatus,
  getAllUsers,
  addNewPromo,
  changeUserStatus
};
