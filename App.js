import React from 'react';
import LoginScreen from './Screens/LoginScreen';
import StockListScreen from './Screens/StockListScreen';

const AuthContext = React.createContext();

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
      signIn: async (data) => {
        // try login
        const responseTokens = 0;
        dispatch({type: 'SIGN_IN', accessToken: responseTokens.accessToken});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <LoginScreen />
    </AuthContext.Provider>
  );
};

export default App;
