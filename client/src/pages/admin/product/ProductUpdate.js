import React, {useState, useEffect} from 'react';
import { Spin, Space, Select } from 'antd';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import AdminNav from '../../../components/nav/AdminNav';
import {getProduct, updateProduct} from '../../../functions/product';
import {getCategories, getCategorySubs} from '../../../functions/category';
import UploadImage from '../../../components/forms/UploadImage';

const {Option} = Select;

const initailState = {
    title: '',
    description: '',
    price: 0,
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

function ProductUpdate({match, history}) {

    const [values, setValues] = useState(initailState);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subOptions, setSubOptions] = useState([]);
    const [defaultSubs, setDefaultSubs] = useState([]);
    const [showSubs, setShowSubs] = useState(false);
    const [loading, setLoading] = useState(false);
    const { title, description, price, category, subs, shipping, quantity, images, colors, brands, color, brand, } = values;

    const { user } = useSelector(state => ({...state}));

    useEffect(() => {
        loadCategories();
        loadProduct(match.params.slug);
    }, [])

    const loadCategories = () => getCategories().then(res => setCategories(res.data));
    const loadProduct = slug => getProduct(slug).then(res => {
        setValues({...values, ...res.data})
        console.log('PRODUCT', res)
        let arr = [];
        if(res.data.category != null) {
            getCategorySubs(res.data.category._id).then(response => setSubOptions(response.data)).catch(err => console.log(err))
            setShowSubs(true)
        }
        res.data.subs.map(s => arr.push(s._id))
        console.log(arr)
        setDefaultSubs(arr);
    });

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        values.subs = defaultSubs;
        values.category= selectedCategory ? selectedCategory : values.category;

        updateProduct(match.params.slug, values, user.token)
        .then(res => {
            setLoading(false);
            toast.success(`${res.data.title} Updated Suucessfully.`);
            history.push('/admin/products')
        }).catch(err => {
            setLoading(false);
            console.log('PRODUCT FAILD TO UPDATE', err)
            toast.error(err.response.data.err)
        })
    }

    const handleChange = e => {
        setValues({...values, [e.target.name]: e.target.value});
    }
    
    const handleCategoryChange = e => {
        setValues({...values, subs: []});
        setSelectedCategory(e.target.value);
        getCategorySubs(e.target.value).then(res => setSubOptions(res.data)).catch(err => console.log(err))
        setShowSubs(true);
        setDefaultSubs([]);
        if(values.category._id == e.target.value) {
            loadProduct(match.params.slug)
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <h1>Product Update</h1>
                    {loading ? 
                        (<Space size="middle">
                            <Spin size="large" />
                        </Space>) :

                    (<form onSubmit={handleSubmit}>
                        {JSON.stringify(values.images)}
                        <div className="py-3">
                            <UploadImage values={values} setValues={setValues} />
                        </div>
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
                            <select name="shipping" value={shipping === "Yes"? "Yes" : "No"} className="form-control" onChange={handleChange}>
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
                            <select name="category" className="form-control" value={selectedCategory ? selectedCategory : category._id} onChange={handleCategoryChange}>
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
                                    onChange={value => setDefaultSubs(value)}
                                    value={defaultSubs}
                                >
                                    {subOptions.length > 0 && subOptions.map(s => <Option key={s._id} value={s._id}>{s.name}</Option>) }
                                </Select>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Color</label>
                            <select name="color" className="form-control" value={color} onChange={handleChange}>
                                <option>Please Select</option>
                                {colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Brand</label>
                            <select name="brand" className="form-control" value={brand} onChange={handleChange}>
                                <option>Please Select</option>
                                {brands.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-outline-info">Save</button>
                    </form>)
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate