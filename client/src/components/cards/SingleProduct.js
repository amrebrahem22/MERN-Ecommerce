import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'
import { Card, Tabs } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux';
import ProductListItems from './ProductListItems';
import RateProductModal from '../modals/RateProductModal';
import {showAverage} from '../../functions/rating';

const {Meta} = Card;
const {TabPane} = Tabs;

function SingleProduct({product, onStarClick, star}) {
    const {user, cart} = useSelector(state => ({...state}));
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        let cart = [];

        if (typeof window !== 'undefined') {
            // if the cart in localStorage
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }

            // push the new item to the cart
            cart.push({
                ...product,
                count: 1
            });

            // remove duplicates
            let unique = _.uniqWith(cart, _.isEqual);

            // save to local storage
            localStorage.setItem('cart', JSON.stringify(unique))

            // Diapatch to redux store
            dispatch({
                type: 'ADD_TO_CART',
                payload: unique
            })

            dispatch({
                type: 'SET_VISIBLE',
                payload: true
            })

        }
    }
    return (
        <>
            <div className="col-md-7">
                {product.images && product.images.length === 0 ? (
                    <Card
                    cover={<img src={product.images && product.images.length ? product.images[0].url : 'https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345'} style={{height: "450px", objectFit: "contain"}} className="p-1" />}
                    />
                ) : (
                    <Carousel autoPlay infiniteLoop showArrows>
                        {product.images && product.images.map(image => (
                            <img src={image.url} />
                        ))}
                    </Carousel>
                )}
                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {product.description && product.description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        Call Us on xxxxx xxxx xxxx to Learn More about this product.
                    </TabPane>
                </Tabs>
            </div>  
            <div className="col-md-5">
                <Card 
                    actions={[
                        <div onClick={handleAddToCart}>
                            <ShoppingCartOutlined className="text-success" /> <br/> Add to Cart
                        </div>,
                        <Link to="/">
                            <HeartOutlined className="text-info" /> <br /> Add to Wishlist
                        </Link>,
                        <RateProductModal>
                            <StarRatings
                                rating={star}
                                starRatedColor="red"
                                changeRating={onStarClick}
                                numberOfStars={5}
                                isSelectable={true}
                                name={product._id}
                            />
                        </RateProductModal>
                    ]}
                >
                    <Meta title={product.title} />

                    {product && product.ratings && product.ratings.length > 0 ? showAverage(product) : 'no rating yet' }
                    
                    <ProductListItems product={product}/>
                </Card>
            </div>  
        </>
    )
}

export default SingleProduct
