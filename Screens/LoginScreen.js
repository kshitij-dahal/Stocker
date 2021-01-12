import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import {AuthContext} from '../AuthContext';
import {ThemeContext} from '../ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import {buttons, text, inputBox} from './styles';
import Dialog from 'react-native-dialog';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [dialogInfo, setDialogInfo] = React.useState({
    title: '',
    description: '',
    btnLabel: '',
    visible: false,
  });

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <View style={theme.background}>
          <LinearGradient
            //theme.colors.background rgb(149, 163, 173)
            colors={[theme.colors.background, '#979899']}
            style={theme.linearGradient}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}>
            <Dialog.Container visible={dialogInfo.visible}>
              <Dialog.Title>{dialogInfo.title}</Dialog.Title>
              <Dialog.Description>{dialogInfo.description}</Dialog.Description>
              <Dialog.Button
                label={dialogInfo.btnLabel}
                onPress={() => setDialogInfo({...dialogInfo, visible: false})}
              />
            </Dialog.Container>
            <TextInput
              style={inputBox.textBox}
              autoCompleteType="email"
              placeholder="Email"
              onChangeText={setEmail}
              underlineColorAndroid="white"
              placeholderTextColor="black"
              value={email}
              textAlign={'left'}
            />
            <TextInput
              style={inputBox.textBox}
              secureTextEntry
              autoCompleteType="password"
              placeholder="Password"
              underlineColorAndroid="white"
              placeholderTextColor="black"
              onChangeText={setPassword}
              value={password}
              textAlign={'left'}
            />
            <AuthContext.Consumer>
              {(data) => (
                <View style={theme.view}>
                  <TouchableOpacity
                    style={buttons.wealthsimpleButton}
                    onPress={async () => {
                      let result = await data.signIn(email, password);
                      setPassword('');
                      if (result.success) {
                        navigation.navigate('OTP', {
                          email: email,
                          password: password,
                        });
                      } else {
                        if (result.status === 400) {
                          setDialogInfo({
                            title: 'Incorrect Login Credentials',
                            description:
                              'Incorrect email or password. Please try again.',
                            btnLabel: 'OK',
                            visible: true,
                          });
                        } else {
                          setDialogInfo({
                            title: 'Server Error',
                            description: 'Please try again later.',
                            btnLabel: 'OK',
                            visible: true,
                          });
                        }
                      }
                    }}>
                    <Text style={text.buttonText}>Login with WealthSimple</Text>
                  </TouchableOpacity>
                </View>
              )}
            </AuthContext.Consumer>
          </LinearGradient>
        </View>
      )}
    </ThemeContext.Consumer>
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
