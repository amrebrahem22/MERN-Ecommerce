import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase";
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { Spin, Space } from 'antd';
import { useSelector } from 'react-redux';

const ForgotPassword = ({ history }) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    let { user } = useSelector(state => ({...state}));

    useEffect(() => {
        if (user && user.token) history.push('/');
    }, [user]);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url: 'http://localhost:3000/login',
            handleCodeInApp: true
        };

        await auth.sendPasswordResetEmail(email, config)
        .then(() => {
            setEmail('');
            setLoading(false);
            toast.success('Check Your Email for Password reset Link.')
        }).catch((error) => {
            setLoading(false);
            toast.error(error.message);
            console.log('ERROR MESSAGE IN PASSWORD RESET: ', error)
        })
    }

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
                            <h2>Forgot Password</h2>
                            <form onSubmit={handleSubmit} >
                                <div className="form-group">
                                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus placeholder="Email"/>
                                </div>
                                <Button type="default" onClick={handleSubmit} disabled={!email}>Submit</Button>
                            </form>
                        </>)
                    }
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;