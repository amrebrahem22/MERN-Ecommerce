import React from 'react';
import NewArrivals from '../components/cards/NewArrivals';
import BestSellers from '../components/cards/BestSellers';
import Typewriter from 'typewriter-effect';

const Home = () => {

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
            </div>
        </div>
    );
}

export default Home;