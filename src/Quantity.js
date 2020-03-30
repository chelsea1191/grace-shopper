import React from 'react';

const Quantity = ({
  decrementQuantity,
  lineItems,
  product,
  changeQuantity,
  incrementQuantity,
  setNewQuantity,
}) => {
  // const item = lineItems.filter(lineItem => lineItem.productId === product.id);

  return lineItems.map(lineItem => {
    if (lineItem.productId === product.id) {
      return (
        <div className="quantity" key={lineItem.id}>
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
      );
    } else {
      return null;
    }
  });
};

export default Quantity;
