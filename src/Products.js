import React from "react";
import Rating from "./Rating";

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      <div className="container-fluid">
        {products.map(product => {
          return (
            <div className="card" key={product.id}>
              <img className="card-img-top" src={product.image}></img>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <span className="card-text">
                  Description: {product.description}
                </span>{" "}
                <br />
                <span className="card-text">
                  User Rating: {product.rating}
                </span>{" "}
                <br />
                <span className="card-price">
                  ${Number(product.price).toFixed(2)}
                </span>
                <Rating rating={product.rating} />
              </div>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
