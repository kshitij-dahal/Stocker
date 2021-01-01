import React from 'react';
import {View, Button, TextInput, Alert} from 'react-native';
import {AuthContext} from '../AuthContext';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View>
      <TextInput
        autoCompleteType="email"
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        secureTextEntry
        autoCompleteType="password"
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
      />
      <AuthContext.Consumer>
        {(data) => (
          <Button
            title="Login With WealthSimple"
            onPress={async () => {
              let result = await data.signIn(email, password);
              if (result.success) {
                setEmail('');
                setPassword('');
                navigation.navigate('OTP');
              } else {
                if (result.status === 400) {
                  Alert.alert(
                    'Incorrect Login Information',
                    'Please enter correct login credentials.',
                    [{text: 'OK'}],
                  );
                } else {
                  Alert.alert('Server Error', 'Please try again later.', [
                    {text: 'OK'},
                  ]);
                }
              }
            }}
          />
        )}
      </AuthContext.Consumer>
    </View>
  );
};

export default LoginScreen;

// stack navigator for clicking on stocks
// when navigating can just pass in param to route
// check if user is logged in from checking storage for user token
// use context to pass data down to componets at many nesting levels
// props.chihldren can be used to have a border around stuff

// for cleaner code if you need to pass down something that is only needed
// at the deepest level, pass down the ocmponent itself and not liike avatar
// size or sth so that it is not known what exactly is passed down
