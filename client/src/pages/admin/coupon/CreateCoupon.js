import React, {useState, useEffect} from 'react';
import { Spin, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {toast} from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AdminNav from '../../../components/nav/AdminNav';
import { getCoupons, createCoupon, removeCoupon } from '../../../functions/coupon';

const CreateCoupon = () => {
    const [name, setName] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiry, setExpiry] = useState('');
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);

    const { user } = useSelector(state => ({...state}));

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = () => getCoupons().then(res => setCoupons(res.data))

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        createCoupon({name, discount, expiry}, user.token)
        .then(res => {
            setLoading(false);
            setName('');
            setDiscount('');
            setExpiry('');
            loadCoupons();
            toast.success(`Coupon ${res.data.name} Created Successfully.`);
        }).catch(err => {
            console.log(err)
            setLoading(false);
            toast.error(err.message)
        }) 
    }

    const handleRemove = (couponId) => {
        setLoading(true);
        if (window.confirm('Delete?')) {
            removeCoupon(couponId, user.token)
            .then(res => {
                setLoading(false);
                loadCoupons();
                toast.error(`${res.data.name} Coupon Deleted.`)
            }).catch(err => {
                console.log(err)
                setLoading(false);
                toast.error(err.message)
            }) 
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col-md-10">
                    <h4>Coupon</h4>
                    {loading ? (
                        <Space size="middle">
                            <Spin size="large" />
                        </Space>
                    )  : (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Coupon Name</label>
                                    <input type="text" value={name} className="form-control" onChange={e => setName(e.target.value)} autoFocus required/>
                                </div>
                                <div className="form-group">
                                    <label>Discount %</label>
                                    <input type="text" value={discount} className="form-control" onChange={e => setDiscount(e.target.value)} required/>
                                </div>
                                <div className="form-group">
                                    <label>Expiry</label>
                                    <DatePicker value={expiry} selected={new Date()} className="form-control" onChange={data => setExpiry(data)} required />
                                </div>
                                <button className="btn btn-outline-primary my-2">Create</button>
                            </form>

                            <table className="table table-bordered">
                                <thead>
                                    <tr className="thead-light">
                                        <th scope="col">Name</th>
                                        <th scope="col">Discount</th>
                                        <th scope="col">Expiry</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map(c => (
                                        <tr key={c._id}>
                                            <td>{c.name}</td>
                                            <td>{c.discount}%</td>
                                            <td>{new Date(c.expiry).toLocaleDateString()}</td>
                                            <td><DeleteOutlined className="text-danger" onClick={() => handleRemove(c._id)} /></td>
                                        </tr>
                                    ))}
                                    
                                </tbody>
                            </table>

                        </>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default CreateCoupon
