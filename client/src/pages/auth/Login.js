import React, { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Spin, Space } from 'antd';
import { createOrUpdateUser } from '../../functions/auth';

const Login = ({ history }) => {

    const [email, setEmail] = useState('amrebrahem226@gmail.com');
    const [password, setPassword] = useState('12141618');
    const [loading, setLoading] = useState(false);

    let dispatch = useDispatch();

    let { user } = useSelector(state => ({...state}));

    useEffect(() => {
        let intended = history.location.state;
        if(intended) {
            console.log(intended);
            return;
        } else {
            if (user && user.token) history.push('/');
        }
    }, [user, history]);

    const roleBasedRedirect = res => {
        let intended = history.location.state;
        if(intended) {
            history.push(intended.from)
        } else {

            if (res.data.role === 'admin') {
                history.push('/admin/dashboard')
            } else {
                history.push('/user/history')
            }
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true)
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            // get the user from the result
            const { user } = result;
            // get the id token
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token).then((res) => {
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
                roleBasedRedirect(res);
            })
            .catch(err => console.log(err))

            history.push('/')
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    }

    const googleLogin = async () => {
        auth.signInWithPopup(googleAuthProvider).then(async result => {
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            
            createOrUpdateUser(idTokenResult.token).then((res) => {
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
                roleBasedRedirect(res);
            })
            .catch(err => console.log(err))
            history.push('/');
        }).catch(error => {
            console.log(error);
            toast.error(error.message);
        })
    }

    const loginForm = () => <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus placeholder="Email"/>
        </div>
        <div className="form-group">
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
        </div>
        <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            icon={<MailOutlined />}
            size="large"
            disabled={!email || password.length < 6}
        >
            Login with Email/Password
        </Button>

        <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
        >
            Login with Google
        </Button>

        <Link to='/forgot/password' className="float-right text-danger">Forgot Password?</Link>
    </form>

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 text-center">
                    {loading ? 
                        (<Space size="middle">
                            <Spin size="large" />
                        </Space>) 
                    : 
                        (<>
                            <h2>Login</h2>
                            {loginForm()}
                        </>)
                    }
                </div>
            </div>
        </div>
    );
}

export default Login;