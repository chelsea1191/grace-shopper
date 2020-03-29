const client = require('../client');

const products = {
  read: async () => {
    return (await client.query('SELECT * from products')).rows;
  },
  create: async ({
    name,
    price,
    description,
    rating,
    image,
    color,
    material
  }) => {
    const SQL = `INSERT INTO products(name, price, description, rating, image, color, material) values($1, $2, $3, $4, $5, $6, $7) returning *`;
    return (
      await client.query(SQL, [
        name,
        price,
        description,
        rating,
        image,
        color,
        material
      ])
    ).rows[0];
  }
};

module.exports = products;
