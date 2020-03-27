import React, { useState, useEffect } from "react";
import axios from "axios";
import PromoDisplay from "./PromoDisplay.js";
import verify from "./verify";

const Cart = ({
  promo,
  promoDescription,
  setPromo,
  allPromos,
  subtotal,
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  setIsSubmitted,
  isSubmitted,
  products,
  setLineItems,
  removePromo
}) => {
  let cartId = cart.id;
  let promoId;

  const onChange = ev => {
    let uppercaseInput = ev.target.value.toUpperCase();
    setPromo(uppercaseInput);
  };

  const onPromoSubmit = ev => {
    ev.preventDefault();
    const filtered = allPromos.filter(each => each.code === promo)[0];
    if (filtered.status === "active") {
      setIsSubmitted(true);
      //if its a valid active promo code
      promoId = filtered.id;
      axios.post("/api/sendPromo", { cartId, promoId });
    } else {
      //if inactive or invalid
      setIsSubmitted("invalid");
    }
  };

  const handleAddress = async e => {
    let address = await verify(e).catch(err => console.log(err));
    console.log(address);
    // await axios
    // 	.post("/api/address", { address, user })
    // 	.then(response => console.log(response));
  };

  const changeQuantity = (lineItem, e) => {
    const newLineItem = { ...lineItem, quantity: Number(e.target.value) };
    const filteredLineItems = lineItems.filter(i => i.id !== newLineItem.id);
    const updatedLineItems = [...filteredLineItems, newLineItem];
    setLineItems(updatedLineItems);
  };

  return (
    <div>
      <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
      <button
        type="button"
        type="button"
        className="btn btn-secondary"
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
                {product.description} <br />${product.price} each
                <div className="quantity">
                  <label htmlFor="name">Quantity: </label>
                  <input
                    type="text"
                    name="quantity"
                    defaultValue={lineItem.quantity}
                    onChange={e => changeQuantity(lineItem, e)}
                  />
                </div>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => removeFromCart(lineItem.id)}
                >
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
        <button type="button" className="btn btn-secondary">
          submit promo code
        </button>
        {isSubmitted && (
          <PromoDisplay
            isSubmitted={isSubmitted}
            cart={cart}
            promoDescription={promoDescription}
            removePromo={removePromo}
          />
        )}
      </form>
      <form onSubmit={handleAddress}>
        <input placeholder="Address" />
        <input placeholder="City" />
        <input placeholder="State" />
        <input placeholder="Zip" />
        <button type="button" className="btn btn-secondary">
          Use This Address
        </button>
      </form>
    </div>
  );
};

export default Cart;
