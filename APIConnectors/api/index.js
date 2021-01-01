import axios from 'axios';

let url;
url = 'https://trade-service.wealthsimple.com/';

export default axios.create({
  baseURL: url,
});
