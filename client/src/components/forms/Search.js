import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

function Search() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { search } = useSelector(state => ({...state}));

    const { text } = search;

    const handleChange = e => {
        console.log(e)
        dispatch({
            type: 'SEARCH_QUERY',
            payload: {text: e.target.value}
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        history.push(`/shop?${text}`);
    }

    return (
        <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
            <span class="form-group"> 
                <input type="text" className="form-control" onChange={handleChange} />
                <button type="submit" class="btn btn-primary"><SearchOutlined /></button>
            </span>
        </form>
    )
}

export default Search
