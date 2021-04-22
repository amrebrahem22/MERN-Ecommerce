import React from 'react';
import { Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';


const { Meta } = Card;

function ProductCard({product, handleRemove}) {

    return (
        <div>
            <Card
                hoverable
                cover={<img src={product.images && product.images.length ? product.images[0].url : 'https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345'} style={{height: "150px", objectFit: "contain"}} className="p-1" />}
                actions={[<Link to={`/admin/product/${product.slug}`}><EditOutlined /></Link>, <DeleteOutlined onClick={() => handleRemove(product.slug)} className="text-danger" />]}
            >
                <Meta title={product.title} description={`${product.description && product.description.substring(0, 30)}...`} />
            </Card>
        </div>
    )
}

export default ProductCard