import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import ProductListItems from './ProductListItems';

const {Meta} = Card;

function SingleProduct({product}) {
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
                    ]}
                >
                    <Meta title={product.title} />
                    <ProductListItems product={product}/>
                </Card>
            </div>  
        </>
    )
}

export default SingleProduct
