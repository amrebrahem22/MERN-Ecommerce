import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import './App.css';
import Home from './pages/Home';
import Product from './pages/Product';
import Category from './pages/Category';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Sub from './pages/Sub';
import Payment from './pages/Payment';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SideDrawer from './components/drawer/SideDrawer';
import RegisterComplete from './pages/auth/RegisterComplete';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import CategoryUpdate from './pages/admin/category/CategoryUpdate';
import ProductCreate from './pages/admin/product/ProductCreate';
import ProductUpdate from './pages/admin/product/ProductUpdate';
import AllProducts from './pages/admin/product/AllProducts';
import SubCreate from './pages/admin/sub/SubCreate';
import SubUpdate from './pages/admin/sub/SubUpdate';
import CreateCoupon from './pages/admin/coupon/CreateCoupon';
import History from './pages/user/History';
import Wishlist from './pages/user/Wishlist';
import Password from './pages/user/Password';
import Header from './components/nav/Header';
import { currentUser } from './functions/auth';
import UserRouter from './components/routes/UserRouter';
import AdminRouter from './components/routes/AdminRouter';

function App() {
  const dispatch = useDispatch();

  // to check the firebase user state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token).then((res) => {
          // dispatch the loggin action
          dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id
              }
          });
      })
      .catch(err => console.log(err))
      }
    });

    // cleanup
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/register/complete' component={RegisterComplete} />
        <Route exact path='/forgot/password' component={ForgotPassword} />
        <UserRouter exact path='/user/history' component={History} />
        <UserRouter exact path='/user/wishlist' component={Wishlist} />
        <UserRouter exact path='/user/password' component={Password} />
        <AdminRouter exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRouter exact path='/admin/category' component={CategoryCreate} />
        <AdminRouter exact path='/admin/category/:slug' component={CategoryUpdate} />
        <AdminRouter exact path='/admin/sub' component={SubCreate} />
        <AdminRouter exact path='/admin/sub/:slug' component={SubUpdate} />
        <AdminRouter exact path='/admin/product' component={ProductCreate} />
        <AdminRouter exact path='/admin/products' component={AllProducts} />
        <AdminRouter exact path='/admin/product/:slug' component={ProductUpdate} />
        <AdminRouter exact path='/admin/coupon' component={CreateCoupon} />
        <Route exact path='/product/:slug' component={Product} />
        <Route exact path='/categories/:slug' component={Category} />
        <Route exact path='/subs/:slug' component={Sub} />
        <Route exact path='/shop' component={Shop} />
        <Route exact path='/cart' component={Cart} />
        <Route exact path='/checkout' component={Checkout} />
        <Route exact path='/payment' component={Payment} />
      </Switch>
    </div>
  );
}

export default App;
