import React from 'react'
import { Skeleton, Card, Avatar } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;

function HomeProductCard({product, loading}) {
    return (
        <Skeleton loading={loading} avatar active>
            <Card
                hoverable
                cover={<img src={product.images && product.images.length ? product.images[0].url : 'https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345'} style={{height: "150px", objectFit: "contain"}} className="p-1" />}
                actions={[
                    <>
                        <Link to={`/product/${product.slug}`}>
                            <EyeOutlined key="detail" />
                        </Link>
                    </>,
                    <ShoppingCartOutlined key="cart" />,
                ]}
                >
                    <Meta
                    title={product.title}
                    description={product.description}
                    />
            </Card>
         </Skeleton>
    )
}

export default HomeProductCard