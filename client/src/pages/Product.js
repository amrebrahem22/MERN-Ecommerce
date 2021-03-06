import React, {useState, useEffect} from 'react';
import SingleProduct from '../components/cards/SingleProduct';
import { getProduct, productStar, getRelated } from '../functions/product';
import { useSelector } from 'react-redux';
import HomeProductCard from '../components/cards/HomeProductCard';

function Product({match}) {
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);
    const [star, setStar] = useState(0);
    // redux
    const { user } = useSelector((state) => ({ ...state }));

    const { slug } = match.params;

    useEffect(() => {
        loadProduct();
    }, [slug]);

    useEffect(() => {
        if (product.ratings && user) {
        let existingRatingObject = product.ratings.find(
            (ele) => ele.postedBy.toString() === user._id.toString()
        );
        existingRatingObject && setStar(existingRatingObject.star); // current user's star
        }
    });

    const loadProduct = () => getProduct(slug).then(res => {
        setProduct(res.data)
        console.log(res.data)

        getRelated(res.data._id)
        .then(res => setRelated(res.data))
        .catch(err=> console.log(err))
    })
    .catch(err => console.log(err))

    const onStarClick = (newRating, name) => {
        setStar(newRating);
        productStar(name, newRating, user.token).then(res => {
            console.log('Star clicked response => ', res.data);
            loadProduct();
        }).catch(err => console.log(err))
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <SingleProduct product={product} onStarClick={onStarClick} star={star} />
            </div>

            <div className="row">
                <div className="text-center pt-5 pb-5" style={{width: '100%'}}>
                    <hr />
                    <h4>Related Products</h4>
                    <hr />
                </div>
            </div>

            <div className="row pb-5">
                {related.length ? (
                    related.map(r => (
                        <div className="col-md-4" key={r._id}>
                            <HomeProductCard product={r} />
                        </div>
                    ))
                ) : (
                    <div className="text-center col">No Products Found</div>
                )}
            </div>
        </div>
    )
}

export default Product
