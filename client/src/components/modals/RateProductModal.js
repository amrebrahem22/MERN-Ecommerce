import { StarOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';


function RateProductModal({children}) {
    const {user} = useSelector(state => ({...state}));
    const [modalVisibale, setModalVisibale] = useState(false);
    const history = useHistory();
    const {slug} = useParams();

    const handleModal = () => {
        if (user && user.token) {
            setModalVisibale(true);
        } else {
            history.push({
                pathname: '/login',
                state: { from: `/product/${slug}` }
            });
        }
    }

    return (
        <>
            <div onClick={handleModal}>
                <StarOutlined className="text-danger"/> {" "} <br />
                {user ? 'Leave Rating' : 'Login to Leave Rating'}
            </div>
            <Modal
                title="Leave your Rating"
                centered
                visible={modalVisibale}
                onOk={() => {
                    setModalVisibale(false);
                    toast.success('Rate Added');
                }}
                onCancel={() => setModalVisibale(false)}
            >{children}</Modal>
        </>
    )
}

export default RateProductModal
