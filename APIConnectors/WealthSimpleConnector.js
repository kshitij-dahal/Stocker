import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (userData) => {
  console.log('at the top');
  let hello = await API.post('/auth/login', userData)
    .then(async (response) => {
      const {tokens} = {
        access: response.headers.get('x-access-token'),
        refresh: response.headers.get('x-refresh-token'),
      };
      try {
        await AsyncStorage.setItem('tokens', tokens);
      } catch (e) {
        // Restoring token failed
      }

      setAuthHeaders(tokens);
      return {
        success: true,
        status: response.status,
      };
    })
    .catch((err) => {
      console.log('heres it');
      console.log(err);
      if (userData.otp === undefined) {
        if (err.response.status === 401) {
          return {success: true};
        } else {
          return {
            success: false,
            status: err.response.status,
          };
        }
      } else {
        return {
          success: false,
          status: err.response.status,
        };
      }
    });
  console.log('axios homie');
  console.log(hello);
  return hello;
};

const setAuthHeaders = (tokens) => {
  API.defaults.headers.common['X-Access-Token'] = tokens.access;
  API.defaults.headers.common['X-Refresh-Token'] = tokens.refresh;
};
