import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Spin, Space } from 'antd';
import UserNav from '../../components/nav/UserNav';
import { auth } from '../../firebase';

const Password = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        await auth.currentUser.updatePassword(password)
        .then(() => {
            setLoading(false);
            setPassword('');
            toast.success('Password Updated.');
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            toast.error(error.message);
        })
    }

    const PasswordForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Your Password</label>
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} value={password} plaeholder="Enter new Password" disabled={loading}/>
                <button className="btn btn-primary" disabled={!password || password.length < 6 || loading}>Submit</button> 
            </div>
        </form>
    )

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    <h1>Update Password</h1>
                    {loading ? 
                        (<Space size="middle">
                            <Spin size="large" />
                        </Space>) 
                    : 
                        (<>
                            {PasswordForm()}
                        </>)
                    }
                </div>
            </div>
        </div>
    )
}

export default Password
