import React, {useState, useEffect} from 'react';
import { Spin, Space } from 'antd';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import AdminNav from '../../../components/nav/AdminNav';
import {updateCategory, getCategory} from '../../../functions/category';

const CategoryUpdate = ({history, match}) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector(state => ({...state}));

    useEffect(() => {
        loadCategory();
    }, []);

    const loadCategory = () => getCategory(match.params.slug).then(res => setName(res.data.name))

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        updateCategory(match.params.slug, {name}, user.token)
        .then(res => {
            setLoading(false);
            setName('');
            toast.success(`Category ${res.data.name} Updated Successfully.`);
            history.push('/admin/category')
        }).catch(err => {
            console.log(err)
            setLoading(false);
            if (err.response.status === 400) toast.error(err.response.data)
        }) 
    }

    const CategoryUpdateForm = () => (
        <form onSubmit={handleSubmit}>
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
                    <h1>Update Category</h1>
                    {loading ? (<Space size="middle">
                            <Spin size="large" />
                        </Space>)  : CategoryUpdateForm()}
                    <hr />
                </div>
            </div>
        </div>
    )
}

export default CategoryUpdate
