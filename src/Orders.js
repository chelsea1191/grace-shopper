import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const Orders = ({ lineItems, setLineItems, orders, products, setView }) => {
  const edit = async (e, itemId, orderId) => {
    let rating = e.target.previousElementSibling.value;
    axios
      .post('/api/rateItem', { rating, itemId, orderId })
      .then((response) =>
        setLineItems([
          ...lineItems.filter((item) => item.id !== itemId),
          response.data.rows[0]
        ])
      );
  };

  return (
    <div>
      <h2>Orders ({orders.length})</h2>
      <ul>
        {orders.map((order) => {
          const _lineItems = lineItems.filter(
            (lineItem) => lineItem.orderId === order.id
          );
          return (
            <li key={order.id}>
              <div>OrderID: {order.id.slice(0, 4)}</div>
              <p>Shipping Address: {order.address}</p>
              <ul>
                {_lineItems.map((lineItem) => {
                  const product = products.find(
                    (product) => product.id === lineItem.productId
                  );
                  return (
                    <div>
                      <li key={lineItem.id}>
                        <Link
                          to={`/products/${product.id}`}
                          onClick={(el) => setView(product)}>
                          <img className='avatar' src={product.image}></img>
                        </Link>
                        {product && product.name}
                        <span className='quantity'>
                          Quantity: {lineItem.quantity}
                        </span>
                        {lineItem.rating && (
                          <span>user rating: {lineItem.rating}</span>
                        )}
                        <div>
                          <label htmlFor='rating'>Rate this item</label>
                          <select id='rating'>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                          </select>
                          <button
                            onClick={(e) => edit(e, lineItem.id, order.id)}>
                            submit
                          </button>
                        </div>
                      </li>
                      <hr />
                    </div>
                  );
                })}
              </ul>
              <p>order total: ${order.total}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;
