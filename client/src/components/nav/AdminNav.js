import React from 'react';
import { Link } from 'react-router-dom';

function AdminNav() {
    return (
        <nav>
            <div className="nav flex-column">
                <li className="nav-item">
                    <Link to='/admin/dashboard' className="nav-link">Dashobard</Link>
                </li>
                <li className="nav-item">
                    <Link to='/admin/product' className="nav-link">Product</Link>
                </li>
                <li className="nav-item">
                    <Link to='/admin/products' className="nav-link">Products</Link>
                </li>
                <li className="nav-item">
                    <Link to='/admin/category' className="nav-link">Category</Link>
                </li>
                <li className="nav-item">
                    <Link to='/admin/sub' className="nav-link">Sub Category</Link>
                </li>
                <li className="nav-item">
                    <Link to='/admin/coupon' className="nav-link">Coupon</Link>
                </li>
                <li className="nav-item">
                    <Link to='/user/admin' className="nav-link">Password</Link>
                </li>
            </div>
        </nav>
    )
}

export default AdminNav;
