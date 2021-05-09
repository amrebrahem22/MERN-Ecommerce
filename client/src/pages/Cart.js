import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import {userCart} from '../functions/user';


const Cart = ({history}) => {
    const {user, cart} = useSelector(state => ({...state}));
    const dispatch = useDispatch();

    const gettotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const saveOrderToDb = () => {
        userCart(cart, user.token)
        .then(res => {
            console.log('cart response => ', res)
            if (res.data.ok) history.push('/checkout')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="container-fluid pt-2">
            <div className="row">
                <h4>Cart / {cart.length} proucts</h4>
            </div>
            <div className="row">
                <div className="col-md-8">
                    {!cart.length ? (<h4 className="text-center">No Products in the cart, <Link to="/shop">Continue Shopping</Link></h4>) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr className="thead-light">
                                    <th scope="col">Image</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Brand</th>
                                    <th scope="col">Color</th>
                                    <th scope="col">Count</th>
                                    <th scope="col">Shipping</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            {cart.map(p => (
                                <ProductCardInCheckout key={p._id} p={p} />
                            ))}
                        </table>
                    )}
                </div>
                <div className="col-md-4">
                    <h4>Order Summary</h4>
                    <hr/>
                    <h5>Products</h5>
                    {cart.map((item, i) => (
                        <div key={i}>
                            <p>
                                {item.title} x {item.count} = ${item.price * item.count}
                            </p>
                        </div>
                    ))}
                    <hr />
                    Total: <b>${gettotal()}</b>
                    <hr />
                    {user? (
                        <button className="btn btn-sm btn-primary mt-2" onClick={saveOrderToDb} disabled={!cart.length}>Proceed To checkout</button>
                    ) : (
                        <Link to={{
                            pathname: '/login',
                            state: { from: 'cart' }
                        }} className="btn btn-sm btn-primary mt-2">Login To checkout</Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart
