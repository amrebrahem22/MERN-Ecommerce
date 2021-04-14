import react from 'react';
import AdminNav from '../../../components/nav/AdminNav';

const SubCreate = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    <h1>Create Sub Category</h1>
                </div>
            </div>
        </div>
    )
}

export default SubCreate;