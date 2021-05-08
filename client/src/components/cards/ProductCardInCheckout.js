import React from 'react'
import ModalImage from 'react-modal-image'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'

const ProductCardInCheckout = ({p}) => {
    let colors = ['Black', 'Brown', 'Silver', 'White', 'Blue']
    const dispatch = useDispatch()

    const handleColorchange = e => {
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            } 

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].color = e.target.value
                }
            })

            // save to local storage
            localStorage.setItem('cart', JSON.stringify(cart))

            // Diapatch to redux store
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart
            })
        }
    }
    
    const handleCountchange = e => {
        let count = e.target.value < 1 ? 1 : e.target.value;

        if (count > p.quantity) {
            toast.error(`Max Avaliable quantity: ${p.quantity}`)
            return;
        }

        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            } 

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart[i].count = count
                }
            })

            // save to local storage
            localStorage.setItem('cart', JSON.stringify(cart))

            // Diapatch to redux store
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart
            })
        }
    }

    const handleRemove = e => {
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            } 

            cart.map((product, i) => {
                if (product._id === p._id) {
                    cart.splice(i, 1)
                }
            })

            // save to local storage
            localStorage.setItem('cart', JSON.stringify(cart))

            // Diapatch to redux store
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart
            })
        }
    }

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{width: '100px', height: 'auto'}}>
                        {p.images.length ? <ModalImage small={p.images[0].url} large={p.images[0].url} /> : <ModalImage small={'https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345'} large={'https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345'} />}
                    </div>
                </td>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select className="form-control" name="color" onChange={handleColorchange}>
                        {p.color ? (<option>{p.color}</option>) : (<option>Select</option>)}
                        {colors.filter(c => c !== p.color).map(color => (<option value={color} key={color}>{color}</option>))}
                    </select>
                </td>
                <td><input type="number" value={p.count} onChange={handleCountchange} className="form-control" /></td>
                <td>{p.shipping === 'Yes' ? <CheckCircleOutlined className="text-success" /> : <CloseCircleOutlined className="text-danger" />}</td>
                <td><CloseOutlined onClick={handleRemove} className="text-danger"/></td>
            </tr>
        </tbody>
    )
}

export default ProductCardInCheckout
