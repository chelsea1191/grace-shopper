import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import Login from './Login';
import CreateUser from './CreateUser';
import Orders from './Orders';
import Cart from './Cart';
import Products from './Products';
import ProductPage from './ProductPage';
import AdminPromos from './AdminPromos';
import AdminUsers from './AdminUsers';
import UserProfile from './UserProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const headers = () => {
  const token = window.localStorage.getItem('token');
  return {
    headers: {
      authorization: token
    }
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
  const [subtotal, setSubtotal] = useState('');
  const [lineItems, setLineItems] = useState([]);
  const [multiplier, setMultiplier] = useState(null);
  const [promoDescription, setPromoDescription] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [total, setTotal] = useState('');
  const [tax, setTax] = useState('');
  const [productView, setView] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then((response) => setProducts(response.data));
  }, [auth]);

  useEffect(() => {
    axios.get('/api/getAllUsers').then((response) => {
      setUsers(response.data);
    });
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      const userId = { userId: auth.id };
      axios.post('/api/getAddresses', userId).then((response) => {
        if (response.data.rows.length === 0) {
          if (auth.username === 'lucy') {
            axios
              .post('/api/address', {
                id: auth.id,
                address: '1 UNF Dr',
                city: 'Jacksonville',
                state: 'Florida',
                zip: '32256'
              })
              .then((response) => setAddresses([response.data]));
          } else if (auth.username === 'moe') {
            axios
              .post('/api/address', {
                id: auth.id,
                address: '10150 Beach Blvd',
                city: 'Jacksonville',
                state: 'Florida',
                zip: '32246'
              })
              .then((response) => setAddresses([response.data]));
          } else {
            axios
              .post('/api/address', {
                id: auth.id,
                address: '501 W Adams St',
                city: 'Jacksonville',
                state: 'Florida',
                zip: '32202'
              })
              .then((response) => setAddresses([response.data]));
          }
        } else {
          setAddresses(response.data.rows);
        }
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      const token = window.localStorage.getItem('token');
      axios.get('/api/getLineItems', headers()).then((response) => {
        setLineItems(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    axios.get('/api/getPromos').then((response) => {
      setAllPromos(response.data);
    });
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getCart', headers()).then((response) => {
        setCart(response.data);
        if (response.data.promo === null || response.data.promo === undefined) {
        } else {
          let filtered = allPromos.filter(
            (each) => each.id === response.data.promo
          );
          setMultiplier(filtered[0].multiplier);
          setPromoDescription(filtered[0].description);
          setIsSubmitted(true);
        }
      });
    }
  }, [auth, isSubmitted]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getOrders', headers()).then((response) => {
        setOrders(response.data);
      });
    }
  }, [auth]);

  const login = async (credentials) => {
    const token = (await axios.post('/api/auth', credentials)).data.token;
    window.localStorage.setItem('token', token);
    exchangeTokenForAuth();
  };

  const exchangeTokenForAuth = async () => {
    const response = await axios.get('/api/auth', headers());
    setAuth(response.data);
    if (response.data.role === 'ADMIN') {
      console.log('user is admin');
      setIsAdmin(true);
    }
  };

  const logout = () => {
    window.location.hash = '#';
    window.localStorage.removeItem('token');
    setAuth({});
    setIsAdmin(false);
    setSelectedAddress([]);
  };

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  useEffect(() => {
    exchangeTokenForAuth();
  }, []);

  useEffect(() => {
    getSubtotal();
  }, [cart, multiplier, auth, lineItems]);

  const createOrder = () => {
    const token = window.localStorage.getItem('token');
    if (selectedAddress.length === 0) {
      alert('please select or enter an address');
    } else {
      axios
        .post('/api/createOrder', { subtotal, selectedAddress }, headers())
        .then((response) => {
          setOrders([response.data, ...orders]);
          const token = window.localStorage.getItem('token');
          return axios.get('/api/getCart', headers());
        })
        .then((response) => {
          setCart(response.data);
        });
      setMultiplier(null);
      setPromoDescription('');
      setSubtotal(0);
      setIsSubmitted(false);
      setSelectedAddress([]);
      //setPromo([]);
    }
  };

  const addToCart = (productId) => {
    axios.post('/api/addToCart', { productId }, headers()).then((response) => {
      const lineItem = response.data;
      const found = lineItems.find((_lineItem) => _lineItem.id === lineItem.id);
      if (!found) {
        setLineItems([...lineItems, lineItem]);
      } else {
        const updated = lineItems.map((_lineItem) =>
          _lineItem.id === lineItem.id ? lineItem : _lineItem
        );
        setLineItems(updated);
      }
    });
  };

  const removeFromCart = (lineItemId) => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(
        lineItems.filter((_lineItem) => _lineItem.id !== lineItemId)
      );
    });
  };

  const changePassword = (newCredentials) => {
    axios.put(`/api/auth/${auth.id}`, newCredentials);
  };

  const totalItemsInCart = () => {
    const quantityArray = lineItems
      .filter((lineItem) => lineItem.orderId === cart.id)
      .map((item) => item.quantity);
    return quantityArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
  };

  const getSubtotal = () => {
    let runningTotal = 0;
    lineItems
      .filter((lineItem) => lineItem.orderId === cart.id)
      .map((lineItem) => {
        let product = products.find(
          (product) => product.id === lineItem.productId
        );
        if (multiplier == null || multiplier == undefined) {
          runningTotal += product.price * lineItem.quantity;
        } else {
          runningTotal += multiplier * (product.price * lineItem.quantity);
        }
      });
    let shipping = 5.99;
    let tax = 1.07;
    if (lineItems.length === 0) {
      setSubtotal(0);
    } else {
      setSubtotal((runningTotal + shipping) * tax);
    }
  };

  const removePromo = (cartId) => {
    axios.post('/api/removePromo', { cartId }).then((response) => {
      setMultiplier(null);
      setPromoDescription([]);
      setIsSubmitted(false);
    });
  };

  const errrorHandler = (error) => {
    if (error.status === 401) {
      console.log('User is not authorized for this function.');
    } else if (error.status === 404) {
      console.log('Undefined address, page not found.');
    } else if (error.status === 500) {
      console.log(
        'Server could not be more specific on what the exact problem is.'
      );
    }
  };

  const changeQuantity = (lineItem, e) => {
    const newQuantity = Number(e.target.value);
    setNewQuantity(lineItem, newQuantity);
  };

  const setNewQuantity = async (lineItem, num) => {
    if (num === 0) {
      removeFromCart(lineItem.id);
    } else {
      const newLineItem = { ...lineItem, quantity: num };
      await axios.put(`/api/updateCart/${newLineItem.id}`, newLineItem).then(
        axios.get('/api/getLineItems', headers()).then((response) => {
          setLineItems(response.data);
        })
      );
    }
  };

  const incrementQuantity = (lineItem) => {
    const plusQuantity = lineItem.quantity + 1;
    setNewQuantity(lineItem, plusQuantity);
  };
  const decrementQuantity = (lineItem) => {
    const minusQuantity = lineItem.quantity - 1;
    setNewQuantity(lineItem, minusQuantity);
  };

  const { view } = params;

  if (!auth.id) {
    return (
      <Router>
        <div>
          <nav className='navbar navbar-expand-lg navbar-light'>
            <Link className='link navbar-brand mb-0 h1' to='/'>
              <h1>Grace Shopper</h1>
            </Link>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item active'>
                <Link className='link nav-link' to='/login'>
                  Login
                </Link>
              </li>
              <li className='nav-item active'>
                <Link className='link nav-link' to='/register'>
                  Register
                </Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path='/login'>
              <Login login={login} />
            </Route>
            <Route path='/register'>
              <CreateUser auth={auth} setAuth={setAuth} />
            </Route>
            <Route path='/guest'>
              <Products
                addToCart={addToCart}
                products={products}
                setView={setView}
              />
            </Route>
          </Switch>
          <Products
            addToCart={addToCart}
            products={products}
            setView={setView}
          />
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        <div>
          <nav className='navbar navbar-expand-lg navbar-light'>
            <Link className='link navbar-brand mb-0 h1' to='/'>
              <h1> Grace Shopper </h1>
            </Link>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item active'>
                <Link className='link nav-link' to='/'>
                  Shop
                </Link>
              </li>

              <li className='nav-item active'>
                <Link className='link nav-link' to='/orders'>
                  My Orders
                </Link>
              </li>
              {isAdmin === true && (
                <li className='nav-item'>
                  <Link className='link nav-link' to='/adminpromos'>
                    Edit Promos
                  </Link>
                </li>
              )}
              {isAdmin === true && (
                <li className='nav-item'>
                  <Link className='link nav-link' to='/adminusers'>
                    Edit Users
                  </Link>
                </li>
              )}

              <li className='nav-item active'>
                <Link className='link nav-link' to='/userprofile'>
                  User Profile
                </Link>
              </li>
              <li className='nav-link'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={logout}>
                  Logout {auth.firstname} {auth.lastname}
                </button>
              </li>
              <li>
                <Link to='/cart'>
                  <span className='fa-layers fa-fw fa-3x'>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span className='fa-layers-counter'>
                      {totalItemsInCart()}
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path='/orders'>
              <Orders
                lineItems={lineItems}
                products={products}
                orders={orders}
                setLineItems={setLineItems}
                setView={setView}
              />
            </Route>

            <Route path='/adminpromos'>
              <AdminPromos allPromos={allPromos} setAllPromos={setAllPromos} />
            </Route>

            <Route path='/adminusers'>
              <AdminUsers users={users} setUsers={setUsers} />
            </Route>

            <Route path='/userprofile'>
              <UserProfile auth={auth} changePassword={changePassword} />
            </Route>
            <Route path='/cart'>
              <Cart
                addresses={addresses}
                setAddresses={setAddresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                auth={auth}
                promo={promo}
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
                lineItems={lineItems}
                setLineItems={setLineItems}
                removePromo={removePromo}
                headers={headers}
                total={total}
                decrementQuantity={decrementQuantity}
                changeQuantity={changeQuantity}
                incrementQuantity={incrementQuantity}
                setNewQuantity={setNewQuantity}
                setView={setView}
              />
            </Route>
            <Route exact path={`/products/${productView.id}`}>
              <ProductPage
                product={productView}
                addToCart={addToCart}
                lineItems={lineItems}
                decrementQuantity={decrementQuantity}
                changeQuantity={changeQuantity}
                incrementQuantity={incrementQuantity}
                setNewQuantity={setNewQuantity}
                cart={cart}
              />
            </Route>
            <Route path='/'>
              <Products
                auth={auth}
                setView={setView}
                addToCart={addToCart}
                products={products}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
};

export default App;
