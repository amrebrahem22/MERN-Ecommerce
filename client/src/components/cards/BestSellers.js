import React, {useEffect, useState} from 'react';
import { Pagination } from 'antd';
import HomeProductCard from './HomeProductCard';
import {getProductsFilter, getProductsTotal} from '../../functions/product';
import LoadingCard from './LoadingCard';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadProducts();
    }, [page]);

    useEffect(() => {
        getProductsTotal().then(res => setProductsCount(res.data)).catch(err => console.log(err));
    }, []);

    const loadProducts = () => {
        setLoading(true);
        getProductsFilter('sold', 'desc', page).then(res => {
            setProducts(res.data);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('HOME LOAD PRODUCTS FAILD=>', err)
        })
    }

    return (
        <>
            {loading ? (<LoadingCard count={3} />) : (
                <div className="row">
                    {products.map(product => (
                        <div className="col-md-4">
                            <HomeProductCard product={product} loading={loading} />
                        </div>
                    ))}
                </div>
            )}
            <div className="row">
                <nav className="col-md-4 offset-md-4 text-center pt-2 p-3">
                    <Pagination current={page} total={(productsCount / 3) * 10} onChange={value => setPage(value)}/>
                </nav>
            </div>
        </>
    );
}

export default BestSellers;