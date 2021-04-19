import React, {useState, useEffect} from 'react';
import { Spin, Space, Select } from 'antd';
import {toast} from 'react-toastify';
import AdminNav from '../../../components/nav/AdminNav';
import { useSelector } from 'react-redux';
import ProductCard from '../../../components/cards/ProductCard';
import {getProducts, removeProduct} from '../../../functions/product';

function AllProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const {user} = useSelector(state => ({...state}));

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = () => {
        setLoading(true);
        getProducts(10).then(res => {
            setLoading(false);
            setProducts(res.data)
        })
    };

    const removeProductBySlug = slug => {
        setLoading(true);
        removeProduct(slug, user.token)
        .then(res => {
            setLoading(false);
            loadProducts();
            toast.success(`${res.data.title} Deleted.`)
        }).catch(err => {
            setLoading(false);
            toast.error(`${err.message}`)
        })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <h1>All Products</h1>
                    {loading ? 
                        (<Space size="middle">
                            <Spin size="large" />
                        </Space>) : (
                            <div className="row">
                                {products.map(product => (
                                    <div className="col-md-4" key={product._id}>
                                        <ProductCard product={product} handleRemove={removeProductBySlug}/>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default AllProducts
