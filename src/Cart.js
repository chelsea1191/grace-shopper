import React from "react";

const Cart = ({
  subtotal,
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products
}) => {
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
      <p>cart subtotal: ${subtotal}</p>
    </div>
  );
};

export default Cart;
