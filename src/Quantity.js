import React from 'react';

const Quantity = ({
  decrementQuantity,
  lineItem,
  lineItems,
  changeQuantity,
  incrementQuantity,
}) => {
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
  </div>;
};

export default Quantity;
