import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(5);
    let history = useHistory();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(currentValue => --currentValue);
        }, 1000);

        // redirect once count reach to zero
        count === 0 && history.push('/');
        // cleanup
        return () => clearInterval(interval);
    }, [count]);

    return (
        <div className="container p-5 text-center">
            <p>Redirecting you after {count} seconds.</p>
        </div>
    );
}

export default LoadingToRedirect;