const client = require("./client");

const { authenticate, compare, findUserFromToken, hash } = require("./auth");

const models = ({ products, users, orders, lineItems } = require("./models"));

const faker = require("faker");

const {
  getCart,
  getOrders,
  addToCart,
  getPromo,
  removeFromCart,
  createOrder,
  getLineItems
} = require("./userMethods");

const getProducts = amount => {
  let products = [];
  for (let i = 0; i < amount; i++) {
    let prodName = faker.commerce.productName();
    let price = faker.commerce.price(0.99, 20.0, 2);
    let text = faker.lorem.sentence(5);
    let rating = faker.random.number({ min: 55, max: 100 });
    let img = faker.image.imageUrl(50, 50, "animals", true);
    let newProd = {
      name: prodName,
      price: price,
      description: text,
      rating: rating,
      image: img
    };
    products.push(newProd);
  }
  return products;
};

const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS "lineItems";
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS promos;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'USER',
      CHECK (char_length(username) > 0)
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
			price DECIMAL NOT NULL,
			description VARCHAR(255),
			rating INT,
			image VARCHAR(255),
      CHECK (char_length(name) > 0)
		);

    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      status VARCHAR(10) DEFAULT 'CART',
      total DECIMAL DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

    CREATE TABLE "lineItems"(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "orderId" UUID REFERENCES orders(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 1
    );
    CREATE TABLE promos(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code VARCHAR(100) NOT NULL UNIQUE,
      multiplier DECIMAL NOT NULL
    );
    INSERT INTO promos (code, multiplier) VALUES ('TENOFF', '0.9');
  `;

  await client.query(SQL);

  const _users = {
    lucy: {
      username: "lucy",
      password: "LUCY",
      role: "ADMIN"
    },
    moe: {
      username: "moe",
      password: "MOE",
      role: null
    },
    curly: {
      username: "larry",
      password: "LARRY",
      role: null
    }
  };

  const _products = getProducts(25);

  const [lucy, moe] = await Promise.all(
    Object.values(_users).map(user => users.create(user))
  );
  const [foo, bar, bazz] = await Promise.all(
    Object.values(_products).map(product => products.create(product))
  );

  const _orders = {
    moe: {
      userId: moe.id
    },
    lucy: {
      userId: lucy.id
    }
  };

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});
  const productMap = (await products.read()).reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {});
  return {
    users: userMap,
    products: productMap
  };
};

module.exports = {
  sync,
  models,
  authenticate,
  findUserFromToken,
  getCart,
  getOrders,
  getPromo,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems
};
