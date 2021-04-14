import React, {useState, useEffect} from 'react';
import { Spin, Space } from 'antd';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminNav from '../../../components/nav/AdminNav';
import {getCategories} from '../../../functions/category';
import {updateSub, getSub } from '../../../functions/sub';

function SubUpdate({match, history}) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [sub, setSub] = useState([]);
    const [parent, setParent] = useState('');

    const { user } = useSelector(state => ({...state}));

    useEffect(() => {
        loadCategories();
        loadSub();
    }, []);

    const loadCategories = () => getCategories().then(res => setCategories(res.data))
    const loadSub = () => getSub(match.params.slug).then(res => {
        setName(res.data.name);
        setParent(res.data.parent)
    })

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        updateSub(match.params.slug, {name, parent}, user.token)
        .then(res => {
            setLoading(false);
            setName('');
            toast.success(`Category ${res.data.name} Created Successfully.`);
            history.push('/admin/sub');
        }).catch(err => {
            console.log(err)
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data)
        }) 
    }

    const CategoryCreateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Parent Category</label>
                <select class="form-control" onChange={e => setParent(e.target.value)}>
                    <option>Please Select</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id} selected={c._id === parent}>{c.name}</option>
                    ))}
                </select>
            </div>
            <input type="text" value={name} className="form-control" onChange={e => setName(e.target.value)} placeholder="Category Name" autoFocus />
            <button className="btn btn-outline-primary my-2">Update</button>
        </form>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <h1>Sub Category Update</h1>
                    {loading ? (<Space size="middle">
                            <Spin size="large" />
                        </Space>)  : CategoryCreateForm()}
                </div>
            </div>
        </div>
    )
}

export default SubUpdate
