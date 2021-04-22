import React, {useState, useEffect} from 'react';
import SingleProduct from '../components/cards/SingleProduct';
import { getProduct } from '../functions/product'

function Product({match}) {
    const [product, setProduct] = useState({})
    const {slug} = match.params;

    useEffect(() => {
        loadProduct();
    }, [])

    const loadProduct = () => getProduct(slug).then(res => setProduct(res.data)).catch(err => console.log(err))

    return (
        <div className="container-fluid">
            <div className="row">
                <SingleProduct product={product} />
            </div>
        </div>
    )
}

export default Product
