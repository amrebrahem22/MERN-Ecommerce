import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase";
import { toast } from 'react-toastify';

const RegisterComplete = ({history}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegisteration'));
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Email and Password is required.');
            return;
        }

        if (password.length < 6) {
            toast.error('Password should be more than 6 characters.');
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            // console.log('RESULT: ', result);
            if (result.user.emailVerified) {
                // remove email from local storage
                window.localStorage.removeItem('emailForRegisteration');
                // get the user id token
                let user = auth.currentUser
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult()
                console.log(user)
            }
        } catch(error) {
            console.log(error);
        }
        
    }

    const registerCompleteForm = () => <form onSubmit={handleSubmit}>
        <input type="email" className="form-control" value={email} placeholder="Email" disabled/>
        <input type="password" className="form-control my-2" value={password} onChange={e => setPassword(e.target.value)} autoFocus placeholder="Password"/>
        <button type="submit" className="btn btn-raised my-2" >Complete Registeration</button>
    </form>

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h2>Complete Registeration</h2>
                    {registerCompleteForm()}
                </div>
            </div>
        </div>
    );
}

export default RegisterComplete;