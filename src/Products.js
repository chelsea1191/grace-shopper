import React from "react";

const Products = ({ products, addToCart }) => {
	return (
		<div>
			<h2>Products</h2>
			<ul>
				{products.map(product => {
					return (
						<li key={product.id}>
							<div className="productBox">
								<div className="productImg">
									<img src={product.image}></img>
								</div>
								<div className="productText">
									<span>{product.name}</span>
									<span>Description: {product.description}</span>
									<span>User Rating: {product.rating}</span>
									<span>${Number(product.price).toFixed(2)}</span>
								</div>
							</div>
							<button onClick={() => addToCart(product.id)}>Add to Cart</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Products;
