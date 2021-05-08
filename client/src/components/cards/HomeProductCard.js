import React from 'react'
import { Skeleton, Card } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux';
import {showAverage} from '../../functions/rating';

const { Meta } = Card;

function HomeProductCard({product, loading}) {

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
        <Skeleton loading={loading} avatar active>
            {product && product.ratings && product.ratings.length > 0 ? showAverage(product) : <div className="text-center p-2" >no rating yet</div> }
            
            <Card
                hoverable
                cover={<img src={product.images && product.images.length ? product.images[0].url : 'https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345'} style={{height: "150px", objectFit: "contain"}} className="p-1" />}
                actions={[
                    <>
                        <Link to={`/product/${product.slug}`}>
                            <EyeOutlined key="detail" />
                        </Link>
                    </>,
                    <ShoppingCartOutlined key="cart" onClick={handleAddToCart}/>,
                ]}
                >
                    <Meta
                    title={`${product.title} - $${product.price}`}
                    description={product.description}
                    />
            </Card>
         </Skeleton>
    )
}

export default HomeProductCard
