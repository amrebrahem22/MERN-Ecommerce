import axios from 'axios';

export const createOrUpdateUser = async (authtoken) => {
    return await axios.post(`http://localhost:8000/api/create-or-update-user/`, {}, {
        headers: {
            authtoken
        }
    });
}