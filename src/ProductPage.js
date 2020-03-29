import React from 'react';
import Rating from './Rating';

const ProductPage = ({ product, addToCart }) => {
  return (
    <div>
      <img src={product.image} />
      <h1>{product.name}</h1>
      <Rating rating={product.rating} />
      <p>Average User Rating: {product.rating}</p>
      <p className='price'>Price: ${Number(product.price).toFixed(2)}</p>
      <p>Description: {product.description}</p>
      <p>Color: {product.color}</p>
      <p>Material: {product.material}</p>
      <button
        id='addtocart'
        type='button'
        className='btn btn-dark'
        onClick={() => addToCart(product.id)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;
