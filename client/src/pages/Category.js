import React, {useState, useEffect} from 'react';
import { getCategoryProducts } from '../functions/category';
import HomeProductCard from '../components/cards/HomeProductCard';

function Category({match}) {
    const [products, setProducts] = useState([]);

    const { slug } = match.params;

    useEffect(() => {
        loadCategoryProducts()
    }, []);

    const loadCategoryProducts = () => {
        getCategoryProducts(slug).then(res => {
            setProducts(res.data)
            console.log(products)
        }).catch(err=> console.log(err))
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="text-center pt-5 pb-5" style={{width: '100%'}}>
                    <hr />
                    <h4>{slug}</h4>
                    <hr />
                </div>
            </div>

            <div className="row pb-5">
                {products.length ? (
                    products.map(p => (
                        <div className="col-md-4" key={p._id}>
                            <HomeProductCard product={p} />
                        </div>
                    ))
                ) : (
                    <div className="text-center col">No Products Found</div>
                )}
            </div>
        </div>
    )
}

export default Category