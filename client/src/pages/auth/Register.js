import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase";
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux';

const Register = ({history}) => {

    const [email, setEmail] = useState('');

    let { user } = useSelector(state => ({...state}));

    useEffect(() => {
        if (user && user.token) history.push('/');
    }, [user]);

    const handleSubmit = async e => {
        e.preventDefault();

        const config = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: 'http://localhost:3000/register/complete',
            // This must be true
            handleCodeInApp: true
        };

        await auth.sendSignInLinkToEmail(email, config);

        toast.success(`Email is sent to ${email}. click the link to complete the registeration.`)

        // save user to local host
        window.localStorage.setItem('emailForRegisteration', email);
        // clear the email input
        setEmail('');
    }

    const registerForm = () => <form onSubmit={handleSubmit}>
        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus placeholder="Email"/>
        <button type="submit" className="btn btn-raised my-2" >Register</button>
    </form>

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2>Register</h2>
                    {registerForm()}
                </div>
            </div>
        </div>
    );
}

export default Register;