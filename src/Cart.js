import React from "react";
import axios from "axios";

const Cart = ({
  setPromo,
  promo,
  subtotal,
  lineItems,
  cart,
  createOrder,
  removeFromCart,
  products
}) => {
  const onPromoSubmit = ev => {
    ev.preventDefault();
    getPromo(promo);
  };

  const getPromo = async () => {
    await axios
      .get("/api/getPromo", promo)
      .then(response => console.log("response: ", response));
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
      <p>cart subtotal: ${subtotal}</p>
      <form onSubmit={onPromoSubmit}>
        <input
          placeholder="promo code"
          value={promo}
          onChange={ev => setPromo(ev.target.value)}
        />
        <button>submit promo code</button>
      </form>
    </div>
  );
};

export default Cart;
