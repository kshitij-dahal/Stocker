import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../AuthContext';
import {ThemeContext} from '../ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import {buttons, text, inputBox} from './styles';
import Dialog from 'react-native-dialog';

const OTPScreen = ({route, navigation}) => {
  const { email, password } = route.params;
  const [otp, setOtp] = React.useState('');
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
              style={[inputBox.textBox, styles.otpBox]}
              secureTextEntry
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={setOtp}
              keyboardType="phone-pad"
              textAlign="center"
              maxLength={6}
              underlineColorAndroid="white"
              justifyContent="space-evenly"
            />
            <AuthContext.Consumer>
              {(data) => (
                <View style={theme.view}>
                  <TouchableOpacity
                    style={buttons.wealthsimpleButton}
                    onPress={async () => {
                      let result = await data.signInWithOtp(otp);
                      if (!result) {
                        setDialogInfo({
                          title: 'Incorrect OTP',
                          description:
                            'Please enter the correct OTP sent to your Email',
                          btnLabel: 'OK',
                          visible: true,
                        });
                      }
                    }}>
                    <Text style={text.buttonText}>Continue with OTP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[buttons.wealthsimpleButton, styles.resentOTPButton]}
                    onPress={async () => {
                      let result = await data.signIn(email, password)
                      if(result.status === 500) {
                        Alert.alert(
                          'Server Error',
                          'Please try again later.',
                          [{text: 'OK'}],
                        );
                      } else {
                        setDialogInfo({
                          title: 'OTP Resent',
                          description:
                            'Another OTP has been resent. Please enter to login.',
                          btnLabel: 'OK',
                          visible: true,
                        });
                      }
                    }}>
                    <Text style={text.buttonText}>Resend OTP</Text>
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

const styles = StyleSheet.create({
  otpBox: {
    fontSize: 24,
    justifyContent: 'center',
    letterSpacing: 30,
    marginBottom: 30
  },
  resentOTPButton: {
    backgroundColor: "#696969",
    width: "80%",
    height: "60%",
    marginTop: 30,
  },

});

export default OTPScreen;
