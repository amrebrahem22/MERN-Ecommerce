import React, {useState, useEffect} from 'react';
import { Spin, Space } from 'antd';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminNav from '../../../components/nav/AdminNav';
import {createProduct} from '../../../functions/product';

const initailState = {
    title: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
    color: '',
    brand: '',

}

function ProductCreate() {

    const [values, setValues] = useState(initailState);
    const { title, description, price, categories, category, subs, shipping, quantity, images, colors, brands, color, brand, } = values;

    const handleSubmit = e => {
        e.preventDefault();
    }

    const handleChange = e => {
        // 
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <h1>Product Create</h1>

                    <form onsubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title" className="form-control" value={title} onChange={handleChange} placeholder="Title"/>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" name="description" className="form-control" value={description} onChange={handleChange} placeholder="Description"/>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" name="price" className="form-control" value={price} onChange={handleChange} placeholder="Price"/>
                        </div>
                        <div className="form-group">
                            <label>Shipping</label>
                            <select name="shipping" className="form-control" onChange={handleChange}>
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input type="number" name="quantity" className="form-control" value={quantity} onChange={handleChange} placeholder="Quantity"/>
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <select name="color" className="form-control" onChange={handleChange}>
                                <option>Please Select</option>
                                {colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Brand</label>
                            <select name="brand" className="form-control" onChange={handleChange}>
                                <option>Please Select</option>
                                {brands.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-outline-info">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductCreate
