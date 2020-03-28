import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PromoDisplay from './PromoDisplay.js';
import verify from './verify';

const Cart = ({
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
  isSubmitted,
  products,
  setLineItems,
  updateCart,
}) => {
  let cartId = cart.id;
  let promoId;

  const onChange = ev => {
    let uppercaseInput = ev.target.value.toUpperCase();
    setPromo(uppercaseInput);
  };

  const onPromoSubmit = ev => {
    ev.preventDefault();
    setIsSubmitted(true);

    const filtered = allPromos.filter(each => each.code === promo)[0];
    if (filtered) {
      promoId = filtered.id;
      axios.post('/api/sendPromo', { cartId, promoId });
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
    const newQuantity = Number(e.target.value);
    setNewQuantity(lineItem, newQuantity);
  };

  const setNewQuantity = async (lineItem, num) => {
    if (num === 0) {
      removeFromCart(lineItem.id);
    } else {
      const newLineItem = { ...lineItem, quantity: num };
      const filteredLineItems = lineItems.filter(i => i.id !== newLineItem.id);
      const updatedLineItems = [...filteredLineItems, newLineItem];
      await axios
        .put(`/api/updateCart/${newLineItem.id}`, newLineItem)
        .then(setLineItems(updatedLineItems));
    }
  };

  const incrementQuantity = lineItem => {
    const plusQuantity = lineItem.quantity + 1;
    setNewQuantity(lineItem, plusQuantity);
  };
  const decrementQuantity = lineItem => {
    const minusQuantity = lineItem.quantity - 1;
    setNewQuantity(lineItem, minusQuantity);
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
                {product.description}
                <div className="quantity">
                  <label htmlFor="name">Quantity: </label>
                  <span className="input-group-btn">
                    <button
                      type="button"
                      className="btn btn-danger btn-number"
                      onClick={() => decrementQuantity(lineItem)}
                    >
                      -
                    </button>
                  </span>
                  <input
                    id="quantity-field"
                    type="text"
                    name="quantity"
                    defaultValue={lineItem.quantity}
                    onChange={e => changeQuantity(lineItem, e)}
                  />
                  <span className="input-group-btn">
                    <button
                      type="button"
                      className="btn btn-success btn-number"
                      onClick={() => incrementQuantity(lineItem)}
                    >
                      +
                    </button>
                  </span>
                </div>
                <div>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => removeFromCart(lineItem.id)}
                  >
                    Remove From Cart
                  </button>
                </div>
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
            promo={promo}
            allPromos={allPromos}
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
        <button type="button" className="btn btn-secondary">
          Use This Address
        </button>
      </form>
    </div>
  );
};

export default Cart;
