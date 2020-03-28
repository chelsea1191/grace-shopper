const client = require('./client');

const changePromoStatus = async (promoId, status) => {
  const promo = await client.query(
    `UPDATE promos SET status=$2 WHERE id=$1 returning *`,
    [promoId, status]
  );
  return await promo;
};

const getAllUsers = async () => {
  const users = await client.query(
    `SELECT * from users ORDER BY role, username`
  );
  return await users.rows;
};

const addNewPromo = async (code, description, multiplier) => {
  const newPromo = await client.query(
    `INSERT INTO promos(code, description, multiplier, status) VALUES ($1, $2, $3, $4) returning *`,
    [code, description, multiplier, 'active']
  );
  return await newPromo;
};

const changeUserStatus = async (userId, status) => {
  const results = await client.query(
    `UPDATE users SET status=$2 WHERE id=$1 returning *`,
    [userId, status]
  );
  return await results;
};

module.exports = {
  changePromoStatus,
  getAllUsers,
  addNewPromo,
  changeUserStatus
};
