import React from 'react';
import {View, TextInput, TouchableOpacity, Alert, Text, StyleSheet} from 'react-native';
import {AuthContext} from '../AuthContext';
import {ThemeContext} from '../ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { buttons, text, inputBox } from './styles'


const OTPScreen = ({navigation}) => {
  const [otp, setOtp] = React.useState('');

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <View style={theme.background}>
          <LinearGradient
            colors={[theme.colors.background, '#979899']}
            style={theme.linearGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
          <TextInput
            style={[inputBox.textBox, styles.otpBox]}
            secureTextEntry
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={setOtp}
            keyboardType="phone-pad"
            textAlign="center"
            maxLength={6}
            underlineColorAndroid='white'
            justifyContent='space-evenly'
          />
          <AuthContext.Consumer>
            {(data) => (
              <View style={theme.view}>
                <TouchableOpacity 
                  style={buttons.wealthsimpleButton}
                  onPress={async () => {
                    let result = await data.signInWithOtp(otp);
                    if (!result) {
                      Alert.alert(
                        'Incorrect OTP',
                        'Please enter the correct OTP sent to your Email',
                        [{text: 'OK'}],
                      );
                    }
                  }}
                >
                  <Text style={text.buttonText}>Continue with OTP</Text>
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
    letterSpacing: 30
  }
});

export default OTPScreen;
