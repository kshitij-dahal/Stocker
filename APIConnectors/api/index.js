import axios from 'axios';

var url;
if( process.env.NODE_ENV === 'development') {
  url = `https://trade-service.wealthsimple.com/`;
}

export default axios.create({
    baseURL: url,
});