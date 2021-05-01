import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'
import { Card, Tabs } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ProductListItems from './ProductListItems';
import RateProductModal from '../modals/RateProductModal';
import {showAverage} from '../../functions/rating';

const {Meta} = Card;
const {TabPane} = Tabs;

function SingleProduct({product, onStarClick, star}) {
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
                        <>
                            <ShoppingCartOutlined className="text-success" /> <br/> Add to Cart
                        </>,
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
