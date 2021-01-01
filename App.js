import React from 'react';
import LoginScreen from './Screens/LoginScreen';
import StockListScreen from './Screens/StockListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './AuthContext';
import OTPScreen from './Screens/OTPScreen';

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

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        // try login
        const responseTokens = {accessToken: 0};

        if (email !== undefined) {
          await dispatch({type: 'SIGN_IN', email: email, password: password});
          return true;
        }
        return false;
      },
      signInWithOtp: async (otp) => {
        // try login
        const responseTokens = {accessToken: 0};

        if (otp !== undefined) {
          await dispatch({type: 'SIGN_IN_W_OTP', accessToken: 'ee'});
          return true;
        }
        return false;
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
    }),
    [],
  );

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
