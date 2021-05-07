import React, {useState, useEffect} from 'react';
import { getProducts, fetchProductsByFilter } from './../functions/product';
import { getCategories } from './../functions/category';
import { getSubs } from './../functions/sub';
import {useDispatch, useSelector} from 'react-redux';
import HomeProductCard from './../components/cards/HomeProductCard';
import Star from './../components/forms/Star';
import { Spin, Space, Menu, Slider, Checkbox, Radio } from 'antd';
import { DollarOutlined, DownSquareOutlined, StarOutlined } from '@ant-design/icons';

const {SubMenu} = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState('');
    const [star, setStar] = useState('');
    const [brands, setBrands] = useState(['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS']);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState(['Black', 'Brown', 'Silver', 'White', 'Blue']);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');

    const dispatch = useDispatch();
    const { search } = useSelector(state => ({...state}));
    const { text } = search;

    // first way for loading products
    useEffect(() => {
        loadAllProducts();

        // fetch categories
        getCategories().then(res => setCategories(res.data)).catch(err => console.log(err))
        getSubs().then(res => setSubs(res.data)).catch(err => console.log(err))
    }, []);
    
    const fetchProducts = arg => {
        fetchProductsByFilter(arg).then(res => setProducts(res.data)).catch(err => console.log(err))
    }

    const loadAllProducts = () => {
        setLoading(true);
        getProducts(12).then(res => {
            setProducts(res.data);
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);
        })
    }


    // 2. load products on user search input
    useEffect(() => {
        const delayed = setTimeout(() => {
            text && fetchProducts({query : text});
        }, 300)

        return () => clearTimeout(delayed);
    }, [text]);

    // useEffect(() => {
    //     fetchProducts({ price }) 
    // }, [ok]);

    const handleSlider = value => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        });
        
        setCategoryIds([])
        setStar('')
        setSub('')
        setBrand('')
        setColor('')
        setShipping('')
        setPrice(value);
        setTimeout(() => {
            fetchProducts({ price })
        }, 300);
    }

    const showCategories = () => categories.map(cat => (
        <div key={cat._id}>
            <Checkbox onChange={handleCheck} className="pb-2 pl-4 pr-4" value={cat._id} name="category" checked={categoryIds.includes(cat._id)}>{cat.name}</Checkbox>
        </div>
    ))

    const handleCheck = e => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: ''}
        });

        setPrice([0, 0]);
        setStar('')
        setSub('')
        setBrand('')
        setColor('')
        setShipping('')

        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);

        // if found is the state remove it else add it
        if (foundInTheState === -1) {
            // Mean not in the array
            inTheState.push(justChecked);
        } else {
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        fetchProducts({category: inTheState})
    }

    const handleStarClick = num => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: ''}
        });

        setPrice([0, 0]);
        setCategoryIds([]);
        setSub('')
        setBrand('')
        setStar(num);
        fetchProducts({ stars: num })
    }

    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    )

    const showSubs = () => subs.map(s => (
        <div className='p-1 m-1 badge badge-secondary' key={s._id} style={{cursor: 'pointer'}} onClick={() => handleSubs(s)}>{s.name}</div>
    ))

    const handleSubs = s => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: ''}
        });

        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('')
        setSub(s);
        setBrand('')
        setColor('')
        setShipping('')
        fetchProducts({ sub })
    }

    const showBrands = () => brands.map(b => <Radio value={b} name={b} checked={b === brand} onChange={handleBrand} className="pb-1 pl-4 pr-4" style={{display: 'block'}}>{b}</Radio>)

    const handleBrand = e => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: ''}
        });

        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('')
        setSub('');
        setColor('')
        setShipping('')
        setBrand(e.target.value)
        fetchProducts({ brand: e.target.value })
    }

    const showColors = () => colors.map(c => <Radio value={c} name={c} checked={c === color} onChange={handleColor} className="pb-1 pl-4 pr-4" style={{display: 'block'}}>{c}</Radio>)

    const handleColor = e => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: ''}
        });

        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('')
        setSub('');
        setBrand('')
        setShipping('')
        setColor(e.target.value)
        fetchProducts({ color: e.target.value })
    }
    
    const showShipping = () => (
        <>
            <Checkbox className="pb-2 pl-4 pr-4" onChange={handleShipping} value="Yes" checked={shipping === "Yes"}>Yes</Checkbox>
            <Checkbox className="pb-2 pl-4 pr-4" onChange={handleShipping} value="No" checked={shipping === "No"}>No</Checkbox>
        </>
    )

    const handleShipping = e => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: ''}
        });

        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('')
        setSub('');
        setBrand('')
        setColor('')
        setShipping(e.target.value)
        fetchProducts({ shipping: e.target.value })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <h2>Search Filters</h2>

                    <Menu mode="inline" defaultOpenKeys={["1", '2', '3', '4', '5', '6', '7']}>
                        <SubMenu key={'1'} title={<span className="h6"><DollarOutlined /> Price</span>}>
                            <div>
                                <Slider
                                className="ml-4 mr-4"
                                tipFormatter={(v) => `$${v}`}
                                range
                                value={price}
                                onChange={handleSlider}
                                max="4999"
                                />
                            </div>
                        </SubMenu>
                        <SubMenu key={'2'} title={<span className="h6"><DownSquareOutlined /> Categories</span>}>
                            <div>
                                {showCategories()}
                            </div>
                        </SubMenu>
                        <SubMenu key={'3'} title={<span className="h6"><StarOutlined /> Rating</span>}>
                            <div>
                                {showStars()}
                            </div>
                        </SubMenu>
                        <SubMenu key={'4'} title={<span className="h6"><DownSquareOutlined /> Sub Categories</span>}>
                            <div>
                                {showSubs()}
                            </div>
                        </SubMenu>
                        <SubMenu key={'5'} title={<span className="h6"><DownSquareOutlined /> Brands</span>}>
                            <div className="pr-4">
                                {showBrands()}
                            </div>
                        </SubMenu>
                        <SubMenu key={'6'} title={<span className="h6"><DownSquareOutlined /> Colors</span>}>
                            <div className="pr-4">
                                {showColors()}
                            </div>
                        </SubMenu>
                        <SubMenu key={'7'} title={<span className="h6"><DownSquareOutlined /> Shipping</span>}>
                            <div className="pr-4">
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="col-md-9">
                    {loading ? 
                        (<Space size="middle">
                            <Spin size="large" />
                        </Space>) 
                    : 
                        (<>
                            <h2>Products</h2>
                            {products.length < 1 ? (<h5 className="text-center">No Products yet.</h5>) : (
                                <div className="row">
                                    {products.map(product => (
                                        <div key={product._id} className="col-md-4">
                                            <HomeProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>)
                    }
                </div>
            </div>
        </div>
    )
}

export default Shop
