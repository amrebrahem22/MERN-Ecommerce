import React, {useState, useEffect} from 'react';
import { Spin, Space, Select } from 'antd';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminNav from '../../../components/nav/AdminNav';
import {createProduct} from '../../../functions/product';
import {getCategories, getCategorySubs} from '../../../functions/category';

const {Option} = Select;

const initailState = {
    title: '',
    description: '',
    price: 0,
    categories: [],
    category: '',
    subs: [],
    shipping: 'No',
    quantity: 0,
    images: [],
    colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
    color: '',
    brand: '',

}

function ProductCreate() {

    const [values, setValues] = useState(initailState);
    const [subOptions, setSubOptions] = useState([]);
    const [showSubs, setShowSubs] = useState(false);
    const { title, description, price, categories, category, subs, shipping, quantity, images, colors, brands, color, brand, } = values;

    const { user } = useSelector(state => ({...state}));

    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = () => getCategories().then(res => setValues({...values, categories: res.data}));

    const handleSubmit = e => {
        e.preventDefault();

        createProduct(values, user.token)
        .then(res => {
            console.log(res)
            toast.success(`Product ${res.data.title} Created.`)
        }).catch(err => {
            console.log(err)
            toast.error(err.response.data.err)
        })
    }

    const handleChange = e => {
        setValues({...values, [e.target.name]: e.target.value});
    }
    
    const handleCategoryChange = e => {
        setValues({...values, subs: [], category: e.target.value});
        getCategorySubs(e.target.value).then(res => setSubOptions(res.data)).catch(err => console.log(err))
        setShowSubs(true);
    }
    const handleSelectChange = value => {
        setValues({...values, subs: value});
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <h1>Product Create</h1>

                    <form onSubmit={handleSubmit}>
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
                            <label>Category</label>
                            <select name="category" className="form-control" onChange={handleCategoryChange}>
                                <option>Please Select</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        {showSubs && (
                            <div>
                                <label>Sub Categories</label>
                                    <Select
                                    mode="multiple"
                                    name="subs"
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    onChange={handleSelectChange}
                                    value={subs}
                                >
                                    {subOptions.length > 0 && subOptions.map(s => <Option key={s._id} value={s._id}>{s.name}</Option>) }
                                </Select>
                            </div>
                        )}
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
