const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const models = db.models;

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.json());

const isLoggedIn = (req, res, next) => {
	if (!req.user) {
		const error = Error("not authorized");
		error.status = 401;
		return next(error);
	}
	next();
};

const isAdmin = (req, res, next) => {
	if (req.user.role !== "ADMIN") {
		return next(Error("not authorized"));
	}
	next();
};

app.use((req, res, next) => {
	const token = req.headers.authorization;
	if (!token) {
		return next();
	}
	db.findUserFromToken(token)
		.then(auth => {
			req.user = auth;
			next();
		})
		.catch(ex => {
			const error = Error("not authorized");
			error.status = 401;
			next(error);
		});
});

app.post("/api/auth", (req, res, next) => {
	db.authenticate(req.body)
		.then(token => res.send({ token }))
		.catch(() => {
			const error = Error("not authorized");
			error.status = 401;
			next(error);
		});
});

app.get("/api/auth", isLoggedIn, (req, res, next) => {
	res.send(req.user);
});

app.get("/api/getAllUsers", (req, res, next) => {
	db.getAllUsers()
		.then(users => res.send(users))
		.catch(next);
});

app.post("/api/changeUserStatus", (req, res, next) => {
	db.changeUserStatus(req.body.userId, req.body.selection)
		.then(response => res.send(response))
		.catch(next);
});

app.get("/api/getCart", (req, res, next) => {
	db.getCart(req.user.id)
		.then(cart => res.send(cart))
		.catch(next);
});

app.get("/api/getOrders", (req, res, next) => {
	db.getOrders(req.user.id)
		.then(orders => res.send(orders))
		.catch(next);
});

app.get("/api/getPromos", (req, res, next) => {
	db.getAllPromos()
		.then(promos => res.send(promos))
		.catch(next);
});

app.post("/api/rateItem", (req, res, next) => {
	db.rateItem(req.body.rating, req.body.itemId, req.body.orderId)
		.then(response => res.send(response))
		.catch(next);
});

app.post("/api/createOrder", (req, res, next) => {
	db.createOrder(req.user.id, req.body)
		.then(order => res.send(order))
		.catch(next);
});

app.get("/api/getLineItems", (req, res, next) => {
	db.getLineItems(req.user.id)
		.then(lineItems => res.send(lineItems))
		.catch(next);
});

app.post("/api/getPromo", (req, res, next) => {
	db.getPromo(req.body)
		.then(promo => {
			res.send(promo);
		})
		.catch(next);
});

app.put("/api/updateCart/:id", (req, res, next) => {
	db.updateLineItems(req.body.id, req.body.quantity).then(response => {
		res.status(200).send(response);
	});
});

app.post("/api/sendPromo", (req, res, next) => {
	db.applyPromo(req.body.cartId, req.body.promoId)
		.then(response => res.send(response))
		.catch(next);
});

app.post("/api/removePromo", (req, res, next) => {
	db.removePromo(req.body.cartId)
		.then(response => res.send(response))
		.catch(next);
});

app.post("/api/addPromo", (req, res, next) => {
	db.addNewPromo(
		req.body.codeInput,
		req.body.descriptionInput,
		req.body.multiplierInput
	)
		.then(response => {
			res.send(response);
		})
		.catch(next);
});

app.post("/api/addToCart", (req, res, next) => {
	db.addToCart({ userId: req.user.id, productId: req.body.productId })
		.then(lineItem => res.send(lineItem))
		.catch(next);
});

app.delete("/api/removeFromCart/:id", (req, res, next) => {
	db.removeFromCart({ userId: req.user.id, lineItemId: req.params.id })
		.then(() => res.sendStatus(204))
		.catch(next);
});

app.get("/api/products", (req, res, next) => {
	db.models.products
		.read()
		.then(products => res.send(products))
		.catch(next);
});

// update password
app.put("/api/auth/:id", (req, res, next) => {
	db.models.users
		.update(req.body)
		.then(response => res.send(response))
		.catch(next);
});

app.post("/api/changePromoStatus", (req, res, next) => {
	db.changePromoStatus(req.body.promoId, req.body.selection)
		.then(response => res.send(response))
		.catch(next);
});

Object.keys(models).forEach(key => {
	app.get(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
		models[key]
			.read({ user: req.user })
			.then(items => res.send(items))
			.catch(next);
	});
	app.post(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
		models[key]
			.create({ user: req.user })
			.then(items => res.send(items))
			.catch(next);
	});
});

app.post("/api/address", (req, res, next) => {
	db.addAddress(req.body)
		.then(address => res.send(address))
		.catch(next);
});

app.post("/api/createUser", (req, res, next) => {
	db.models.users
		.create(req.body)
		.then(user => res.send(user))
		.catch(next);
});

app.post("/api/getAddresses", (req, res, next) => {
	db.getAddresses(req.body.userId)
		.then(response => {
			res.send(response);
		})
		.catch(next);
});

app.get("/*", (req, res, next) =>
	res.sendFile(path.join(__dirname, "index.html"))
);

app.use((req, res, next) => {
	const error = {
		message: `page not found ${req.url} for ${req.method}`,
		status: 404
	};
	next(error);
});

app.post("/api/address", (req, res, next) => {
	db.addAddress(req.body)
		.then(address => res.send(address))
		.catch(next);
});

app.use((err, req, res, next) => {
	console.log(err.status);
	res.status(err.status || 500).send({ message: err.message });
});

module.exports = app;
