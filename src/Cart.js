import React, { useState, useEffect } from "react";
import axios from "axios";
import PromoDisplay from "./PromoDisplay.js";
import verify from "./verify";

const Cart = ({
<<<<<<< HEAD
  promo,
  multiplier,
  promoDescription,
  setPromo,
  allPromos,
  subtotal,
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  setIsSubmitted,
  products
}) => {
  let cartId = cart.id;
  let promoId;
=======
	promo,
	setPromo,
	promoDescription,
	setPromoDescription,
	multiplier,
	setMultiplier,
	subtotal,
	lineItems,
	cart,
	createOrder,
	removeFromCart,
	products
}) => {
	const [isSubmitted, setIsSubmitted] = useState(false);
>>>>>>> master

	const onChange = ev => {
		let uppercaseInput = ev.target.value.toUpperCase();
		setPromo(uppercaseInput);
	};

<<<<<<< HEAD
  const onPromoSubmit = ev => {
    ev.preventDefault();
    setIsSubmitted(true);
    const filtered = allPromos.filter(each => each.code === promo)[0];
    if (filtered) {
      promoId = filtered.id;
      axios.post("/api/sendPromo", { cartId, promoId });
    }
  };

  return (
    <div>
      <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
      <button
        type="button"
        className="btn btn-dark"
        disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
        onClick={createOrder}
      >
        Create Order
      </button>
      <ul>
        {lineItems
          .filter(lineItem => lineItem.orderId === cart.id)
          .map(lineItem => {
            const product = products.find(
              product => product.id === lineItem.productId
            );
            return (
              <li key={lineItem.id}>
                {product && product.name} <br />
                <span className="quantity">Quantity: {lineItem.quantity}</span>
                <button onClick={() => removeFromCart(lineItem.id)}>
                  Remove From Cart
                </button>
                item subtotal: $
                {Number(lineItem.quantity * product.price).toFixed(2)}
              </li>
            );
          })}
      </ul>
      <p>cart subtotal: ${subtotal}</p>
      <form onSubmit={onPromoSubmit}>
        <input placeholder="promo code" value={promo} onChange={onChange} />
        <button>submit promo code</button>
        <PromoDisplay
          promoDescription={promoDescription}
          multiplier={multiplier}
        />
      </form>
    </div>
  );
=======
	const onPromoSubmit = ev => {
		ev.preventDefault();
		setIsSubmitted(true);
		axios.post("/api/getPromo", { promo }).then(response => {
			setPromoDescription(response.data.description);
			setMultiplier(response.data.multiplier);
		});
	};

	const handleAddress = async e => {
		let address = await verify(e).catch(err => console.log(err));
		console.log(address);
		// await axios
		// 	.post("/api/address", { address, user })
		// 	.then(response => console.log(response));
	};

	return (
		<div>
			<h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
			<button
				type="button"
				className="btn btn-dark"
				disabled={!lineItems.find(lineItem => lineItem.orderId === cart.id)}
				onClick={createOrder}
			>
				Create Order
			</button>
			<ul>
				{lineItems
					.filter(lineItem => lineItem.orderId === cart.id)
					.map(lineItem => {
						const product = products.find(
							product => product.id === lineItem.productId
						);
						return (
							<li key={lineItem.id}>
								{product && product.name} <br />
								<span className="quantity">Quantity: {lineItem.quantity}</span>
								<button onClick={() => removeFromCart(lineItem.id)}>
									Remove From Cart
								</button>
								item subtotal: $
								{Number(lineItem.quantity * product.price).toFixed(2)}
							</li>
						);
					})}
			</ul>
			<p>cart subtotal: ${subtotal}</p>
			<form onSubmit={onPromoSubmit}>
				<input placeholder="promo code" value={promo} onChange={onChange} />
				<button>submit promo code</button>
				{isSubmitted && (
					<PromoDisplay
						promoDescription={promoDescription}
						multiplier={multiplier}
					/>
				)}
			</form>
			<form onSubmit={handleAddress}>
				<input placeholder="Address" />
				<input placeholder="City" />
				<input placeholder="State" />
				<input placeholder="Zip" />
				<button>Use This Address</button>
			</form>
		</div>
	);
>>>>>>> master
};

export default Cart;
