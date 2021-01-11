import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (userData) => {
  console.log('at the top');
  let hello = await API.post('/auth/login', userData)
    .then(async (response) => {
      const tokens = {
        access: response.headers['x-access-token'],
        refresh: response.headers['x-refresh-token'],
        expiry: parseInt(response.headers['x-access-token-expires']),
      };
      try {
        const tokenJson = JSON.stringify(tokens);
        await AsyncStorage.setItem('tokens', tokenJson);
      } catch (e) {
        // Restoring token failed
        console.log('i have failed');
      }

      setAuthHeaders(tokens);
      return {
        success: true,
        status: response.status,
      };
    })
    .catch((err) => {
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

export const refresh = async () => {
  let res = await API.post('/auth/refresh', {
    refresh_token: JSON.parse(await AsyncStorage.getItem('tokens')).refresh,
  })
    .then(async (response) => {
      const tokens = {
        access: response.headers['x-access-token'],
        refresh: response.headers['x-refresh-token'],
        expiry: parseInt(response.headers['x-access-token-expires']),
      };
      try {
        const tokenJson = JSON.stringify(tokens);
        await AsyncStorage.setItem('tokens', tokenJson);
      } catch (e) {
        // Restoring token failed
        console.log('i have failed');
      }
      setAuthHeaders(tokens);
    })
    .catch((err) => {
      return err;
    });
  console.log('axios homie');
  console.log(res);
  return res;
};

export const getPortfolio = async () => {
  console.log('lets see');
  console.log(API.defaults);
  let res = await API.get('/account/positions')
    .then(async (response) => {
      const {results} = response.data;
      let stocks = [];
      results.map((position) => {
        if (
          position.stock.security_type.toLowerCase().localeCompare('equity') ===
          0
        ) {
          stocks.push({symbol: position.stock.symbol});
        }
      });
      return {
        success: true,
        portfolio: stocks.sort((a, b) => {
          return a.symbol.localeCompare(b.symbol);
        }),
      };
    })
    .catch((err) => {
      return {success: false, status: err.response.status};
    });
  return res;
};

const setAuthHeaders = (tokens) => {
  API.defaults.headers.common.Authorization = tokens.access;
  //API.defaults.headers.common['X-Refresh-Token'] = tokens.refresh;
  //API.defaults.headers.common['X-Access-Token-Expires'] = tokens.expiry;
};
