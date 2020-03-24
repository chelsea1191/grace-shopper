import React from "react";

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      <div className="container">
        {products.map(product => {
          return (
            <div className="card" key={product.id}>
              <div className="productBox">
                <div className="productImg">
                  <img className="card-img-top" src={product.image}></img>
                </div>
                <div className="productText" class="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <span className="card-text">
                    Description: {product.description}
                  </span>
                  <span className="card-text">
                    User Rating: {product.rating}
                  </span>
                  <span className="card-text">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                class="btn btn-dark"
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
