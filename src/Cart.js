import React, { useState } from 'react';
import axios from 'axios';
import PromoDisplay from './PromoDisplay.js';

const Cart = ({
  promo,
  setPromo,
  multiplier,
  setMultiplier,
  subtotal,
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onChange = ev => {
    let uppercaseInput = ev.target.value.toUpperCase();
    setPromo(uppercaseInput);
  };

  const onPromoSubmit = ev => {
    ev.preventDefault();
    setIsSubmitted(true);
    axios
      .post('/api/getPromo', { promo })
      .then(response => setMultiplier(response.data.multiplier));
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
        {isSubmitted && <PromoDisplay multiplier={multiplier} />}
      </form>
    </div>
  );
};

export default Cart;
