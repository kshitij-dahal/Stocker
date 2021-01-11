import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const LoadableView = (props) => {
  return (
    <View style={props.style} pointerEvents={props.loading ? 'none' : 'auto'}>
      {props.children}
      {props.loading ? (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default LoadableView;
