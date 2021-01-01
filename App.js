import React from 'react';
import LoginScreen from './Screens/LoginScreen';
import StockListScreen from './Screens/StockListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './AuthContext';
import OTPScreen from './Screens/OTPScreen';
import {loginUser} from './APIConnectors/WealthSimpleConnector';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            email: action.email,
            password: action.password,
            isSignOut: false,
          };
        case 'SIGN_IN_W_OTP':
          return {
            ...prevState,
            userAccessToken: action.accessToken,
            otpEntered: true,
            isSignOut: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
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
      isSignOut: false,
      email: '',
      password: '',
    },
  );

  React.useEffect(async () => {
    try {
      let token = JSON.parse(await AsyncStorage.getItem('tokens'));
    } catch (e) {}
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
        dispatch({type: 'SIGN_IN', email: email, password: password});
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
        await dispatch({type: 'SIGN_IN_W_OTP', accessToken: 'ee'});
        return true;
      }
      return false;
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
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={() => {
            return state.userAccessToken == null ? 'Login' : 'StockList';
          }}>
          {Object.entries(
            state.userAccessToken == null ? screens.auth : screens.user,
          ).map(([name, component]) => (
            <Stack.Screen name={name} component={component} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
