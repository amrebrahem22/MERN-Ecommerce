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
import Header from './components/nav/Header';

function App() {
  const dispatch = useDispatch();

  // to check the firebase user state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        dispatch({type: 'LOGGED_IN_USER', payload: { email: user.email, token: idTokenResult.token}});
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
      </Switch>
    </div>
  );
}

export default App;
