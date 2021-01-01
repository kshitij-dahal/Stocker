import API from './api';

export const loginUser = (userData) => ( async() => { 
    await API.post('/auth/login', userData)
        .then((response) => {
            const {tokens} = {
                access: response.headers.get('x-access-token'),
                refresh: response.headers.get('x-refresh-token'),
              }
              localStorage.setItem("tokens", tokens)
              setAuthHeaders(tokens);
              return {
                  success: true,
                  status: response.status,
              }
        })
        .catch(err => {
            return {
                success: false,
                status: err.response.status,
            }
        })
    });
        
const setAuthHeaders = (tokens) => {
    API.defaults.headers.common['X-Access-Token'] = tokens.access;
    API.defaults.headers.common['X-Refresh-Token'] = tokens.refresh;
}
