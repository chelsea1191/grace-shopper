import React from "react";

const Cart = ({ lineItems, cart, createOrder, removeFromCart, products }) => {
  const getSubtotal = () => {
    //gets subtotal of entire cart--- did not take tax into consideration yet
    let total = 0;
    lineItems
      .filter(lineItem => lineItem.orderId === cart.id)
      .map(lineItem => {
        let product = products.find(
          product => product.id === lineItem.productId
        );
        total = total + product.price * lineItem.quantity;
      });
    return total.toFixed(2);
  };

  return (
    <div>
      <h2>Cart - {cart.id && cart.id.slice(0, 4)}</h2>
      <button
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
      <p>cart subtotal: ${getSubtotal()}</p>
    </div>
  );
};

export default Cart;
