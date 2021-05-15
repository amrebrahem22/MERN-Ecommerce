import React, { useEffect, lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import SideDrawer from './components/drawer/SideDrawer';
import Header from './components/nav/Header';
import { currentUser } from './functions/auth';
import UserRouter from './components/routes/UserRouter';
import AdminRouter from './components/routes/AdminRouter';
import {LoadingOutlined} from '@ant-design/icons';
import './App.css';
// Lazy
const Home = lazy(() => import('./pages/Home'));
const Product = lazy(() => import('./pages/Product'));
const Category = lazy(() => import('./pages/Category'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Sub = lazy(() => import('./pages/Sub'));
const Payment = lazy(() => import('./pages/Payment'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CategoryCreate = lazy(() => import('./pages/admin/category/CategoryCreate'));
const CategoryUpdate = lazy(() => import('./pages/admin/category/CategoryUpdate'));
const ProductCreate = lazy(() => import('./pages/admin/product/ProductCreate'));
const ProductUpdate = lazy(() => import('./pages/admin/product/ProductUpdate'));
const AllProducts = lazy(() => import('./pages/admin/product/AllProducts'));
const SubCreate = lazy(() => import('./pages/admin/sub/SubCreate'));
const SubUpdate = lazy(() => import('./pages/admin/sub/SubUpdate'));
const CreateCoupon = lazy(() => import('./pages/admin/coupon/CreateCoupon'));
const History = lazy(() => import('./pages/user/History'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const Password = lazy(() => import('./pages/user/Password'));

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
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __ React Redux EC
          <LoadingOutlined />
          MMERCE __
        </div>
      }
      >
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
    </Suspense>
  );
}

export default App;
