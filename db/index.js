const client = require("./client");

const { authenticate, compare, findUserFromToken, hash } = require("./auth");

const models = ({ products, users, orders, lineItems } = require("./models"));

const faker = require("faker");

const {
	changePromoStatus,
	getAllUsers,
	addNewPromo,
	changeUserStatus
} = require("./adminMethods");

const {
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
	rateItem
} = require("./userMethods");


const getProducts = (amount) => {
  let products = [];
  for (let i = 0; i < amount; i++) {
    let prodName = faker.commerce.productName();
    let price = faker.commerce.price(0.99, 20.0, 2);
    let text = faker.lorem.sentence(5);
    let rating = faker.random.number({ min: 3, max: 5 });
    let img = faker.image.imageUrl(300, 300, 'animals', true);
    let color = faker.commerce.color();
    let material = faker.commerce.productMaterial();
    let newProd = {
      name: prodName,
      price: price,
      description: text,
      rating: rating,
      image: img,
      color: color,
      material: material
    };
    products.push(newProd);
  }
  return products;
};

const sync = async () => {
	const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS addresses;
    DROP TABLE IF EXISTS "lineItems";
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS promos;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE promos(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code VARCHAR(100) NOT NULL UNIQUE,
      description VARCHAR(300) NOT NULL,
      multiplier DECIMAL NOT NULL,
      status VARCHAR
    );

    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'USER',
      status VARCHAR,
      CHECK (char_length(username) > 0)
    );


    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
			price DECIMAL NOT NULL,
			description VARCHAR(255),
			rating INT,
      image VARCHAR(255),
      material VARCHAR(255),
      color VARCHAR(50),
      CHECK (char_length(name) > 0)
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      status VARCHAR(10) DEFAULT 'CART',
      total DECIMAL(100, 2) DEFAULT 0,
      promo UUID REFERENCES promos(id) DEFAULT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

    CREATE TABLE "lineItems"(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "orderId" UUID REFERENCES orders(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 1,
      rating INT DEFAULT null
    );

    CREATE TABLE addresses(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customerId UUID REFERENCES users(id) NOT NULL,
      address VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zip VARCHAR(100) NOT NULL
    );

    INSERT INTO promos (code, description, multiplier, status) VALUES ('TENOFF', 'take 10% off any purchase', '0.9', 'active');
    INSERT INTO promos (code, description, multiplier, status) VALUES ('SPRING20', 'take 20% off any purchase', '0.8', 'active');
    INSERT INTO promos (code, description, multiplier, status) VALUES ('UNF40', 'take 40% off any purchase', '0.6', 'inactive');
  `;

  await client.query(SQL);

  const _users = {
    lucy: {
      username: 'lucy',
      password: 'LUCY',
      role: 'ADMIN',
      status: 'active'
    },
    moe: {
      username: 'moe',
      password: 'MOE',
      role: null,
      status: 'active'
    },
    curly: {
      username: 'larry',
      password: 'LARRY',
      role: null,
      status: 'active'
    }
  };

  const _products = getProducts(25);

  const [lucy, moe] = await Promise.all(
    Object.values(_users).map((user) => users.create(user))
  );
  const [foo, bar, bazz] = await Promise.all(
    Object.values(_products).map((product) => products.create(product))
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

const addAddress = async address => {
	const SQL =
		"INSERT INTO addresses(CustomerId, address, city, state, zip) values($1, $2, $3, $4, $5) returning *";
	return (
		await client.query(SQL, [
			address.id,
			address.address,
			address.city,
			address.state,
			address.zip
		])
	).rows[0];
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
	getLineItems,
	applyPromo,
	getAllPromos,
	updateLineItems,
	removePromo,
	changePromoStatus,
	getAllUsers,
	addNewPromo,
	rateItem,
	changeUserStatus,
	addAddress
};
