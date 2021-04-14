import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { AppstoreOutlined, SettingOutlined, UserAddOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const { SubMenu } = Menu;

function Header() {
    const [current, setCurrent] = useState('home');
    let dispatch = useDispatch();
    let {user} = useSelector(state => ({...state}));
    let history = useHistory();

    const handleClick = e => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({type:'LOGOUT', payload: null});
        history.push('/login');
    }

    return (
        <div>
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="home" icon={<AppstoreOutlined />}>
                    <NavLink to="/">Home</NavLink>
                </Menu.Item>
                {!user && (
                    <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right">
                        <NavLink to="/register">Register</NavLink>
                    </Menu.Item>
                )}

                {!user && (
                    <Menu.Item key="login" icon={<UserOutlined />} className="float-right">
                        <NavLink to="/login">Login</NavLink>
                    </Menu.Item>
                )}
                {user && (
                    <SubMenu key="SubMenu" icon={<SettingOutlined />} className="float-right" title={user? user.email.split('@')[0] : 'Username'}>
                        {user && user.role === 'subscriber' && (
                            <Menu.Item key="dashboard"><NavLink to="/user/history">Dashboard</NavLink></Menu.Item>
                        )}

                        {user && user.role === 'admin' && (
                            <Menu.Item key="dashboard"><NavLink to="/admin/dashboard">Dashboard</NavLink></Menu.Item>
                        )}
                        <Menu.Item icon={<LogoutOutlined />} onClick={logout}>Logout</Menu.Item>
                    </SubMenu>
                )}
            </Menu>
        </div>
    )
}

export default Header
