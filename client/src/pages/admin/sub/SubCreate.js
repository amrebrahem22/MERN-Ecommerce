import React, {useState, useEffect} from 'react';
import { Spin, Space } from 'antd';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AdminNav from '../../../components/nav/AdminNav';
import {getCategories} from '../../../functions/category';
import {createSub, getSubs, removeSub} from '../../../functions/sub';

function SubCreate() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subs, setSubs] = useState([]);
    const [keyword, setKeyword] = useState([]);
    const [category, setCategory] = useState('');

    const { user } = useSelector(state => ({...state}));

    useEffect(() => {
        loadCategories();
        loadSubs();
    }, []);

    const loadCategories = () => getCategories().then(res => setCategories(res.data))
    const loadSubs = () => getSubs().then(res => setSubs(res.data))

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        createSub({name, parent: category}, user.token)
        .then(res => {
            setLoading(false);
            setName('');
            toast.success(`Category ${res.data.name} Created Successfully.`);
            loadSubs();
        }).catch(err => {
            console.log(err)
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data)
        }) 
    }

    const handleRemove = (slug) => {
        setLoading(true);
        if (window.confirm('Delete?')) {
            removeSub(slug, user.token)
            .then(res => {
                setLoading(false);
                loadSubs();
                toast.error(`${res.data.name} Category Deleted.`)
            }).catch(err => {
                console.log(err)
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data)
            }) 
        }
    }

    const CategoryCreateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Parent Category</label>
                <select class="form-control" onChange={e => setCategory(e.target.value)}>
                    <option>Please Select</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <input type="text" value={name} className="form-control" onChange={e => setName(e.target.value)} placeholder="Category Name" autoFocus />
            <button className="btn btn-outline-primary my-2">Create</button>
        </form>
    );

    const searched = keyword => c => c.name.toLowerCase().includes(keyword);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <h1>Sub Category Create</h1>
                    {loading ? (<Space size="middle">
                            <Spin size="large" />
                        </Space>)  : CategoryCreateForm()}
                    
                    <input type="text" value={keyword} className="form-control mb-2" onChange={e => setKeyword(e.target.value)} placeholder="Search Category" />

                    {subs.filter(searched(keyword)).map(c => (
                        <div className="alert alert-secondary" key={c.id}>
                            {c.name}
                            <span onClick={() => handleRemove(c.slug)} className="btn btn-sm float-right">
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/sub/${c.slug}`} >
                                <span className="btn btn-sm float-right">
                                    <EditOutlined className="text-primary" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SubCreate
