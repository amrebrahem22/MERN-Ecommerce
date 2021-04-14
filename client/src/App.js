import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import './App.css';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterComplete from './pages/auth/RegisterComplete';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import History from './pages/user/History';
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
      <ToastContainer />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/register/complete' component={RegisterComplete} />
        <Route exact path='/forgot/password' component={ForgotPassword} />
        <UserRouter exact path='/user/history' component={History} />
        <UserRouter exact path='/user/password' component={Password} />
        <AdminRouter exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRouter exact path='/admin/category' component={CategoryCreate} />
      </Switch>
    </div>
  );
}

export default App;
