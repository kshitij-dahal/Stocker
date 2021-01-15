import React from 'react';
import LoginScreen from './Screens/LoginScreen';
import StockListScreen from './Screens/StockListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {AuthContext} from './AuthContext';
import {ThemeContext} from './ThemeContext';

import OTPScreen from './Screens/OTPScreen';
import {loginUser, refresh} from './APIConnectors/WealthSimpleConnector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthHeaders } from './APIConnectors/WealthSimpleConnector'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(61, 75, 86)',
    primaryText: 'rbg(255, 255, 255)',
    secondaryText: 'rbg(0, 0, 0)',
    secondaryBackground: 'rbg(211, 211, 211)',
  },
  view: {
    width: '100%',
    height: '10%',
    margin: 'auto',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
};

const Stack = createStackNavigator();

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoggedIn: false,
          };
        case 'SIGN_IN_W_OTP':
          return {
            ...prevState,
            userAccessToken: action.accessToken,
            otpEntered: true,
            isLoggedIn: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            userAccessToken: null,
            otpEntered: false,
            email: '',
            password: '',
          };
        case 'RESTORE_TOKEN':
          return {};
      }
    },
    {
      userAccessToken: null,
      otpEntered: false,
      isLoading: true,
      isLoggedIn: false,
      email: '',
      password: '',
    },
  );

  React.useEffect(() => {
    async function asyncStorage() {
      try {
        console.log("STARTING ISLOGGEDIN")
        const epochSeconds = parseInt(Date.now() / 1000, 10);
        console.log(epochSeconds)
        let token = await JSON.parse(await AsyncStorage.getItem('tokens'));
        console.log(token)
        if(epochSeconds >= token.expiry) {
          try {
            console.log("token has expired")
            let response = await refresh();
            if(response.success) {
              dispatch({type: 'SIGN_IN_W_OTP'});
            } else{
              dispatch({type: 'SIGN_OUT'});
              //some error?
            }
            
          }
          catch (e) {
            return false;
          }
        } else {
            setAuthHeaders(token);
            dispatch({type: 'SIGN_IN_W_OTP'});
            console.log('has not expired')
        }
      } catch (e) {
        console.log('first error')
        dispatch({type: 'SIGN_OUT'});
      }
    }
    asyncStorage();
  }, []);

  const authContext = {
    signIn: async (email, password) => {
      // try login
      let response = await loginUser({email: email, password: password});
      console.log('response ho ');
      console.log(email);
      console.log(password);
      console.log(response);
      if (response.success) {
        dispatch({type: 'SIGN_IN'});
      }
      return response;
    },
    signInWithOtp: async (otp) => {
      // try login

      let response = await loginUser({
        email: state.email,
        password: state.password,
        otp: otp,
      });

      if (response.success) {
        dispatch({type: 'SIGN_IN_W_OTP', accessToken: 'ee'});
      }
      return response;
    },
    signOut: () => dispatch({type: 'SIGN_OUT'}),
  };

  const screens = {
    auth: {
      Login: LoginScreen,
      OTP: OTPScreen,
    },
    user: {
      StockList: StockListScreen,
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={authContext} theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={() => {
              return state.isLoggedIn ? 'StockList' : 'Login';
            }}>
            {Object.entries(
              !state.isLoggedIn ? screens.auth : screens.user,
            ).map(([name, component]) => (
              <Stack.Screen name={name} component={component} />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
