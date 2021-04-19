import React, {useState} from 'react'
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';
import {LoadingOutlined} from '@ant-design/icons'

function UploadImage({values, setValues}) {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(state => ({...state}));
    let allUploadedImages = values.images;

    const handleUploadImage = e => {
        setLoading(true);
        // get files
        let files = e.target.files;
        for(let i = 0; i < files.length; i++) {
            Resizer.imageFileResizer(files[i], 720, 720, "JPEG", 100, 0, (uri) => {
                axios.post('http://localhost:8000/api/uploadimages', {image: uri}, {headers:{authtoken: user ? user.token : ""}})
                .then(res => {
                    console.log('UPLOAD IMAGE RES =>', res);
                    allUploadedImages.push(res.data);
                    setValues({...values, images: allUploadedImages});
                    setLoading(false);
                })
                .catch(err => {
                    console.log('CLOUDINARY UPLOAD FAILD => ', err);
                    setLoading(false);
                });
            }, 'base64');
        }
    }

    const handleImageRemove = public_id => {
        setLoading(true);
        axios.post('http://localhost:8000/api/removeimage', {public_id}, {headers:{authtoken: user ? user.token : ""}})
        .then(res => {
            console.log('Remove IMAGE RES =>', res);
            const {images} = values;
            let filteredImages = images.filter(item => item.public_id !== public_id)
            setValues({...values, images: filteredImages});
            setLoading(false);
        })
        .catch(err => {
            console.log('CLOUDINARY REMOVE FAILD => ', err);
            setLoading(false);
        });
    }

    return (
        <>
            <div className="row">
                {loading && <LoadingOutlined/>}
                {values.images && values.images.map(image => <Badge count="X" style={{cursor: "pointer"}} key={image.public_id} onClick={() => handleImageRemove(image.public_id)}>
                    <Avatar src={image.url} size={60} className="m-3" shape="square"/>
                </Badge>)}
            </div>
            <div className="row">
                <label className="btn btn-primary">
                    Choose File
                    <input type="file" multiple hidden accept="images/*" onChange={handleUploadImage} />
                </label>
            </div>
        </>
    )
}

export default UploadImage
