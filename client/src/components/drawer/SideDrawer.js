import React from 'react'
import { Drawer, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const imageStyle = {
    width: '100%',
    height: '50px',
    objectFit: 'cover'
}

const defaultImage = 'https://eg.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/415302/1.jpg?4345'

const SideDrawer = () => {
    const dispatch = useDispatch();
    const {drawer, cart} = useSelector(state => ({...state}))

    return (
        <Drawer
        title={`Cart - ${cart.length} products`}
        placement="right"
        closable={false}
        onClose={() => {
            dispatch({
                type: 'SET_VISIBLE',
                payload: false
            })
        }}
        visible={drawer}
        className="text-center"
        >
            {cart.map(p => (
                <div className="row" key={p._id}>
                    <div className="col">
                        {p.images[0] ? (
                            <>
                                <img src={p.images[0].url} style={imageStyle} title={p.title} />
                                <p className="text-center bg-secondary text-light">{`${p.title} x ${p.count}`}</p>
                            </>
                        ) : (
                            <>
                                <img src={defaultImage} style={imageStyle} title={p.title} />
                                <p className="text-center bg-secondary text-light">{`${p.title} x ${p.count}`}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
            <Link to="/cart">
                <button className="text-center btn btn-primary btn-raised btn-block" onClick={() => {
                    dispatch({
                        type: 'SET_VISIBLE',
                        payload: false
                    })
                }}>Add To Cart</button>
            </Link>
        </Drawer>
    )
}

export default SideDrawer
