import React from 'react';
import Rating from './Rating';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const Products = ({ auth, products, addToCart, setView }) => {
  let authIsNull = false;
  if (auth === undefined || auth === null) {
    authIsNull = true;
  }

  return (
    <div>
      <div className="container-fluid">
        {products.map(product => {
          return (
            <div className="wrapper" key={product.id}>
              {authIsNull === false && (
                <Link
                  to={`/products/${product.id}`}
                  onClick={el => setView(product)}
                >
                  <img className="card-img-top" src={product.image}></img>
                </Link>
              )}
              {authIsNull && (
                <img className="card-img-top" src={product.image}></img>
              )}
              <div className="card-body">
                <Rating rating={product.rating} />
                <h5 className="card-title">{product.name}</h5>
                <h4 className="card-price ">
                  ${Number(product.price).toFixed(2)}
                </h4>
                {auth === undefined && (
                  <p>please login or register to add to cart</p>
                )}
                {auth && (
                  <button
                    id="addtocart"
                    type="button"
                    className="btn btn-dark"
                    onClick={() => addToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
