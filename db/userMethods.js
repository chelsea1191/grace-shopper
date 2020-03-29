const client = require('./client');

const getCart = async userId => {
  //find current order with CART status else make a new one upon login
  const response = await client.query(
    `SELECT * FROM orders WHERE status='CART' and "userId"=$1`,
    [userId]
  );
  if (response.rows.length) {
    return response.rows[0];
  }
  return (
    await client.query(
      'INSERT INTO orders ("userId") values ($1) returning *',
      [userId]
    )
  ).rows[0];
};

const getOrders = async userId => {
  //get all orders where status is NOT cart
  return (
    await client.query(
      `SELECT * FROM orders WHERE status <> 'CART' and "userId"=$1`,
      [userId]
    )
  ).rows;
};

const getPromo = async promo => {
  return (
    await client.query(`SELECT * FROM promos WHERE code=$1`, [promo.promo])
  ).rows[0];
};

const createOrder = async (userId, total) => {
  //simply changes order status from cart to order and updates total
  const cart = await getCart(userId);
  cart.status = 'ORDER';
  await client.query(`UPDATE orders SET total=$1 WHERE id=$2 returning *`, [
    total.subtotal,
    cart.id,
  ]);
  return (
    await client.query(`UPDATE orders SET status=$1 WHERE id=$2 returning *`, [
      'ORDER',
      cart.id,
    ])
  ).rows[0];
};

const addToCart = async ({ productId, userId }) => {
  const cart = await getCart(userId);
  const response = await client.query(
    //find items in current cart
    `SELECT * from "lineItems" WHERE "orderId"=$1 and "productId"=$2`,
    [cart.id, productId]
  );
  let lineItem;
  if (response.rows.length) {
    //if its already in the cart then add qty
    lineItem = response.rows[0];
    lineItem.quantity++;
    return (
      await client.query(
        `with updated as (
        UPDATE "lineItems"
        set quantity=$1
        WHERE id = $2
          returning *
          )
          select * from updated
          ORDER BY id`,

        // `UPDATE "lineItems" set quantity=$1 WHERE id = $2 returning * ORDER BY id`,
        [lineItem.quantity, lineItem.id]
      )
    ).rows[0];
  } else {
    //if it doesnt exist yet, add it
    return (
      await client.query(
        `with updated as (
          INSERT INTO "lineItems"(
            "productId", "orderId") values ($1, $2)
            returning *
          )
          select * from updated
          ORDER BY id
        `,

        // `INSERT INTO "lineItems"("productId", "orderId") values ($1, $2) returning *`,
        [productId, cart.id]
      )
    ).rows[0];
  }
};

const removeFromCart = async ({ lineItemId, userId }) => {
  const cart = await getCart(userId);
  await client.query(
    `DELETE FROM "lineItems" WHERE id=$1 and "orderId" = $2 returning *`,
    [lineItemId, cart.id]
  );
};

const getLineItems = async userId => {
  //get line items of corresponding order
  const SQL = `
    with updated as (
      SELECT "lineItems".*
        FROM "lineItems"
        JOIN orders
        ON orders.id = "lineItems"."orderId"
        WHERE orders."userId" = $1
    )
    select * from updated
    ORDER BY id
  `;
  return (await client.query(SQL, [userId])).rows;
};

const applyPromo = async (cartId, promoId) => {
  await client.query(`UPDATE orders SET promo=$2 WHERE id=$1 returning *`, [
    cartId,
    promoId,
  ]);
};

const getAllPromos = async () => {
  const results = await client.query(`SELECT * FROM promos ORDER BY id`);
  return results.rows;
};

const updateLineItems = async (lineItemId, lineItemQuantity) => {
  const SQL = `with updated as (
    UPDATE "lineItems"
    set quantity=$2
    WHERE id = $1
      returning *
      )
      select * from updated
      ORDER BY id`;

  const results = await client.query(SQL, [lineItemId, lineItemQuantity]);

  return results.rows[0];
};

const removePromo = async cartId => {
  await client.query(`UPDATE orders SET promo=$2 WHERE id=$1 returning *`, [
    cartId,
    null,
  ]);
};

const rateItem = async (rating, itemId, orderId) => {
  return await client.query(
    `UPDATE "lineItems" SET rating=$1 WHERE id=$2 AND "orderId"=$3 returning *`,
    [rating, itemId, orderId]
  );
};

module.exports = {
  getCart,
  getOrders,
  addToCart,
  getPromo,
  removeFromCart,
  createOrder,
  getLineItems,
  applyPromo,
  getAllPromos,
  updateLineItems,
  removePromo,
  rateItem,
};
