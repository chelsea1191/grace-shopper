import React from 'react';
import Rating from './Rating';
import Quantity from './Quantity';

const ProductPage = ({
  product,
  addToCart,
  decrementQuantity,
  changeQuantity,
  incrementQuantity,
  lineItems,
  setNewQuantity,
}) => {
  return (
    <div>
      <img src={product.image} />
      <h1>{product.name}</h1>
      <Rating rating={product.rating} />
      <p>Average User Rating: {product.rating}</p>
      <p className="price">Price: ${Number(product.price).toFixed(2)}</p>
      <p>Description: {product.description}</p>
      <p>Color: {product.color}</p>
      <p>Material: {product.material}</p>
      <button
        id="addtocart"
        type="button"
        className="btn btn-dark"
        onClick={() => addToCart(product.id)}
      >
        Add to Cart
      </button>
      <Quantity
        decrementQuantity={decrementQuantity}
        changeQuantity={changeQuantity}
        incrementQuantity={incrementQuantity}
        product={product}
        lineItems={lineItems}
        setNewQuantity={setNewQuantity}
      />
    </div>
  );
};

export default ProductPage;
