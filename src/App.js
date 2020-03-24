import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Orders from './Orders';
import Cart from './Cart';
import Products from './Products';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const headers = () => {
  const token = window.localStorage.getItem('token');
  return {
    headers: {
      authorization: token,
    },
  };
};

const App = () => {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));
  const [auth, setAuth] = useState({});
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [promo, setPromo] = useState([]);
  const [allPromos, setAllPromos] = useState([]);
  const [subtotal, setSubtotal] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [multiplier, setMultiplier] = useState(null);
  const [promoDescription, setPromoDescription] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {

  axios.get("/api/products").then(response => setProducts(response.data));
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      const token = window.localStorage.getItem('token');
      axios.get('/api/getLineItems', headers()).then(response => {
        setLineItems(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    axios.get("/api/getPromos").then(response => {
      setAllPromos(response.data);
    });
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getCart', headers()).then(response => {
        setCart(response.data);
        console.log("this user's cart: ", response.data);
        if (response.data.promo === null || response.data.promo === undefined) {
          console.log("promo is null");
        } else {
          console.log("promo is: ", response.data.promo);
          let filtered = allPromos.filter(
            each => each.id === response.data.promo
          );
          setMultiplier(filtered[0].multiplier);
          setPromoDescription(filtered[0].description);
        }
      });
    }
  }, [auth, isSubmitted]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getOrders', headers()).then(response => {
        setOrders(response.data);
      });
    }
  }, [auth]);

  const login = async credentials => {
    const token = (await axios.post('/api/auth', credentials)).data.token;
    window.localStorage.setItem('token', token);
    exchangeTokenForAuth();
  };

  const exchangeTokenForAuth = async () => {
    const response = await axios.get('/api/auth', headers());
    setAuth(response.data);
  };

  const logout = () => {
    window.location.hash = '#';
    window.localStorage.removeItem('token');
    setAuth({});
  };

  useEffect(() => {
    exchangeTokenForAuth();
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  useEffect(() => {
    getSubtotal();
  }, [cart, multiplier]);

  const createOrder = () => {
    const token = window.localStorage.getItem('token');
    axios
      .post('/api/createOrder', { subtotal }, headers())
      .then(response => {
        setOrders([response.data, ...orders]);
        const token = window.localStorage.getItem('token');
        return axios.get('/api/getCart', headers());
      })
      .then(response => {
        setCart(response.data);
      });
    setMultiplier(null);
    setPromoDescription("");
    setSubtotal(0);
  };

  const addToCart = productId => {
    axios.post('/api/addToCart', { productId }, headers()).then(response => {
      const lineItem = response.data;
      const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id);
      if (!found) {
        setLineItems([...lineItems, lineItem]);
      } else {
        const updated = lineItems.map(_lineItem =>
          _lineItem.id === lineItem.id ? lineItem : _lineItem
        );
        setLineItems(updated);
      }
    });
    getSubtotal();
  };

  const removeFromCart = lineItemId => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId));
    });
    getSubtotal();
  };

  const totalItemsInCart = () => {
    const quantityArray = lineItems.map(item => item.quantity);
    return quantityArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  };

  const getSubtotal = () => {
    //gets subtotal of entire cart-- did not take tax into consideration yet
    lineItems
      .filter(lineItem => lineItem.orderId === cart.id)
      .map(lineItem => {
        let product = products.find(
          product => product.id === lineItem.productId
        );
        if (multiplier == null || multiplier == undefined) {
          console.log("multiplier is null");
          setSubtotal(product.price * lineItem.quantity);
        } else {
          console.log("multiplier is: ", multiplier);
          setSubtotal(multiplier * (product.price * lineItem.quantity));
        }
      });
  };

  const { view } = params;

  if (!auth.id) {
    return (
      <Router>
        <div>
          <h1>Grace Shopper</h1>
          <nav className="navbar navbar-expand-lg navbar-light">
            <li className="nav-link active">
              <Link className="link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-link active">
              <Link className="link" to="/register">
                Register
              </Link>
            </li>
          </nav>
          <Switch>
            <Route path="/login">
              <Login login={login} />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        <div>
          <h1>Grace Shopper</h1>
          <nav className="navbar navbar-expand-lg navbar-light">
            <li className="nav-link active">
              <Link className="link" to="/">
                Products
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <span className="fa-layers fa-fw fa-3x">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span className="fa-layers-counter">
                    {totalItemsInCart()}
                  </span>
                </span>
              </Link>
            </li>
            <li className="nav-link">
              <Link className="link" to="/orders">
                My Orders
              </Link>
            </li>
            <li className="nav-link">
              <button type="button" class="btn btn-secondary" onClick={logout}>
                Logout {auth.username}{" "}
              </button>
            </li>
          </nav>
          <Switch>
            <Route path="/orders">
              <Orders
                lineItems={lineItems}
                products={products}
                orders={orders}
              />
            </Route>
            <Route path="/cart">
              <Cart
                promo={promo}
                multiplier={multiplier}
                promoDescription={promoDescription}
                allPromos={allPromos}
                setPromo={setPromo}
                subtotal={subtotal}
                lineItems={lineItems}
                removeFromCart={removeFromCart}
                cart={cart}
                createOrder={createOrder}
                setIsSubmitted={setIsSubmitted}
                isSubmitted={isSubmitted}
                products={products}
              />{' '}
            </Route>
            <Route path="/">
              <Products addToCart={addToCart} products={products} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
};

export default App;
