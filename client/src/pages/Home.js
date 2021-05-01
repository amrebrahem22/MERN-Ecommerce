import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import NewArrivals from '../components/cards/NewArrivals';
import BestSellers from '../components/cards/BestSellers';
import Typewriter from 'typewriter-effect';
import { getCategories, listSubs } from '../functions/category';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [subs, setSubs] = useState([]);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data)).catch(err => console.log(err));
        listSubs().then(res => setSubs(res.data)).catch(err => console.log(err));
    }, [])

    return (
        <div>
            <div className="jumbotron text-center text-danger" style={{fontWeight: 'bold', fontSize: '3em'}}>
            <Typewriter
                options={{
                    strings: ['Latest Products', 'Best Sellers', 'New Arrivals'],
                    autoStart: true,
                    loop: true,
                }}
                />
            </div>
            <div className="container" >
                <div className="jumbotron text-center p-2" style={{fontWeight: 'bold', fontSize: '2em'}}>New Arrivals</div>
                <NewArrivals />
                <div className="jumbotron text-center p-2 mt-3" style={{fontWeight: 'bold', fontSize: '2em'}}>Best Sellers</div>
                <BestSellers />
                <div className="jumbotron text-center p-2 mt-3" style={{fontWeight: 'bold', fontSize: '2em'}}>Categories</div>
                <div className="row">
                    {categories.map(category => (
                        <div className="col"><Link to={`/categories/${category.slug}`} className="btn btn-default">{category.name}</Link></div>
                    ))}
                </div>
                <div className="jumbotron text-center p-2 mt-3" style={{fontWeight: 'bold', fontSize: '2em'}}>Sub Categories</div>
                <div className="row">
                    {subs && subs.map(category => (
                        <div className="col"><Link to={`/subs/${category.slug}`} className="btn btn-default">{category.name}</Link></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;