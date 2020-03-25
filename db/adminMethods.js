const client = require("./client");

const changePromoStatus = async (promoId, status) => {
  await client.query(`UPDATE promos SET status=$2 WHERE id=$1`, [
    promoId,
    status
  ]);
};

const getAllUsers = async () => {
  return await client.query("SELECT * from users").rows;
};

const addNewPromo = async (code, description, multiplier) => {
  await client.query(
    `INSERT INTO promos(code, description, multiplier, status) VALUES ($1, $2, $3, $4) returning *`,
    [code, description, multiplier, "active"]
  );
};

module.exports = {
  changePromoStatus,
  getAllUsers,
  addNewPromo
};
