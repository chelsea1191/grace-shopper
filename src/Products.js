import React from 'react';
import Rating from './Rating';

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      <div className='container-fluid'>
        {products.map(product => {
          return (
            <div className='wrapper' key={product.id}>
              <img className='card-img-top' src={product.image}></img>
              <div className='card-body'>
                <Rating rating={product.rating} />
                <h5 className='card-title'>{product.name}</h5>
                <h4 className='card-price '>
                  ${Number(product.price).toFixed(2)}
                </h4>
                <button
                  id='addtocart'
                  type='button'
                  className='btn btn-dark'
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
