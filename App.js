import React from 'react';
import LoginScreen from './Screens/LoginScreen';
import StockListScreen from './Screens/StockListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './AuthContext';

const Stack = createStackNavigator();

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            userAccessToken: action.accessToken,
            isSignOut: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            userAccessToken: action.accessToken,
          };
        case 'RESTORE_TOKEN':
          return {};
      }
    },
    {
      userAccessToken: null,
      isLoading: true,
      isSignOut: false,
    },
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        // try login
        const responseTokens = {accessToken: 0};

        if (email !== undefined) {
          dispatch({type: 'SIGN_IN', accessToken: responseTokens.accessToken});
        }
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userAccessToken == null ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="StockList" component={StockListScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
