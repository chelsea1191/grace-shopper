import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PromoDisplay from './PromoDisplay.js';
import verify from './verify';

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
  removePromo,
  headers,
  total,
}) => {
  let cartId = cart.id;
  let promoId;
  let shipping = 5.99;
  const onChange = ev => {
    let uppercaseInput = ev.target.value.toUpperCase();
    setPromo(uppercaseInput);
  };

  const onPromoSubmit = ev => {
    ev.preventDefault();
    const filtered = allPromos.filter(each => each.code === promo)[0];
    if (filtered.status === 'active') {
      setIsSubmitted(true);
      //if its a valid active promo code
      promoId = filtered.id;
      axios.post('/api/sendPromo', { cartId, promoId });
    } else {
      //if inactive or invalid
      setIsSubmitted('invalid');
    }
  };

  const handleAddress = async e => {
    e.preventDefault();
    let addressRaw = e.target;
    await verify(addressRaw, auth.id);
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
      await axios.put(`/api/updateCart/${newLineItem.id}`, newLineItem).then(
        axios.get('/api/getLineItems', headers()).then(response => {
          setLineItems(response.data);
        })
      );
    }
  };

  const getTax = () => {
    if (subtotal * 0.93 - 5.99 <= 0) {
      return 0;
    } else {
      let tax = subtotal * 0.07;
      return tax;
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
              <li className="horizontal" key={lineItem.id}>
                <img className="avatar" src={product.image}></img>
                {product && product.name} <br />${product.price} each <br />{' '}
                item subtotal: $
                {Number(lineItem.quantity * product.price).toFixed(2)}
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
                    className="quantity-field"
                    type="text"
                    name="quantity"
                    value={lineItem.quantity}
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
              </li>
            );
          })}
      </ul>
      <p>shipping (3-5 business days): ${shipping}</p>
      <p>tax: ${getTax().toFixed(2)} </p>
      <p>order total: ${subtotal.toFixed(2)}</p>
      <form onSubmit={onPromoSubmit}>
        <input placeholder="promo code" value={promo} onChange={onChange} />
        <button type="submit" className="btn btn-secondary">
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
