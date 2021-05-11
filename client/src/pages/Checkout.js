import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCart, emptyUserCart, saveAddress } from '../functions/user';
import { applyCoupon } from '../functions/coupon';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

const Checkout = ({history}) => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('')
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
    const [discountError, setDiscountError] = useState('')

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
            setCoupon('')
            setTotalAfterDiscount(0)
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

    const applyDiscountCoupon = () => {
        console.log('Coupon to apply => ', coupon)
        applyCoupon(coupon, user.token)
        .then(res => {
            console.log('coupon apply response data => ', res.data)
            if (res.data) {
                setTotalAfterDiscount(res.data)
                dispatch({
                    type: 'COUPON_APPLIED',
                    payload: true
                })
            }

            if (res.data.err) {
                setDiscountError(res.data.err)
                dispatch({
                    type: 'COUPON_APPLIED',
                    payload: false
                })
            }
        }).catch(err => console.log(err))
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
                <div>
                    <input type="text" className="form-control" value={coupon} onChange={e => {
                        setCoupon(e.target.value)
                        setDiscountError('')
                    }} />
                    {discountError && (<div className="bg-danger my-2 p-2 text-white">{discountError}</div>)}
                    <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
                </div>
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
                {totalAfterDiscount > 0 && (
                    <div className="bg-success my-2 p-2 text-white">Discount Applied Total Payable ${totalAfterDiscount}</div>
                )}
                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-primary" disabled={!addressSaved || !products.length} onClick={() => history.push('/payment')}>Place Order</button>
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
