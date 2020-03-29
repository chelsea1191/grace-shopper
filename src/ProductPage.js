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
}) => {
  // make quantity field & buttons appear if item is in cart
  // need a toggle so that if user's cart has product with this product id,
  // the quantity component will be rendered

  // quantity component needs to take in a lineItem which we dont have here on
  // the Product Page

  // Need to find the product in the user's cart and get corresponding line item

  const isProductInCart = () => {
    console.log(lineItems);
  };
  // isProductInCart();
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
      {/* <Quantity
        decrementQuantity={decrementQuantity}
        lineItem={lineItem}
        changeQuantity={changeQuantity}
        incrementQuantity={incrementQuantity}
      /> */}
    </div>
  );
};

export default ProductPage;
