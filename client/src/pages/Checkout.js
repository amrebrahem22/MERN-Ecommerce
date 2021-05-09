import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCart, emptyUserCart, saveAddress } from '../functions/user';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

const Checkout = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector(state => ({...state}))

    useEffect(() => {
        if(user) {
            getUserCart(user.token)
            .then(res => {
                console.log('cart get response => ', JSON.stringify(res.data, null, 4))
                setProducts(res.data.products)
                setTotal(res.data.cartTotal)
            }).catch(err => console.log(err))
        }
    }, [user])

    const emptycart = () => {
        // remove from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cart')
        }

        // remove from redux store
        dispatch({
            type: 'ADD_TO_CART',
            payload: []
        })

        // remove from backend
        emptyUserCart(user.token)
        .then(res => {
            setProducts([])
            setTotal([0])
            toast.success('Cart is empty, Continue Shopping.')
        })
        .catch(err => console.log(err))
    }

    const saveAddressToDb = () => {
        saveAddress(address, user.token)
        .then(res => {
            if (res.data.ok) {
                setAddressSaved(true)
                toast.success('Address Saved')
            }
        })
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br/>
                <br/>
                <ReactQuill theme="snow" value={address} onChange={e => setAddress(e)} />
                <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>Save</button>
                <hr />
                <h4>Got coupon?</h4>
                <br />
                coupon input to apply
            </div>
            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr/>
                <p>Products {products.length}</p>
                <hr/>
                {products.map((p, i) => (
                    <div key={i}>
                        <p>
                            {p.product.title} {p.color} x {p.count} ={' '}
                            ${p.product.price * p.count}
                        </p>
                    </div>
                ))}
                <hr/>
                <p>Cart Total:  ${total}</p>
                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-primary" disabled={!addressSaved || !products.length}>Place Order</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button onClick={emptycart} className="btn btn-primary">Empty Cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
