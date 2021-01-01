import React from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import {AuthContext} from '../AuthContext';

const OTPScreen = ({navigation}) => {
  const [otp, setOtp] = React.useState('');

  return (
    <View>
      <TextInput
        secureTextEntry
        autoCompleteType="off"
        autoCorrect={false}
        style={{borderBottomWidth: 2}}
        onChangeText={setOtp}
      />
      <AuthContext.Consumer>
        {(data) => (
          <Button
            title="Continue W OTP"
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
          />
        )}
      </AuthContext.Consumer>
    </View>
  );
};

export default OTPScreen;
