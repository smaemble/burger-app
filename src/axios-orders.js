import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://react-burger-app-18153.firebaseio.com/'
});

export default instance;