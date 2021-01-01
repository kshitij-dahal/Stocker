import React from 'react';
import {View, Button} from 'react-native';

const StockListScreen = () => {
  return (
    <View>
      <Button title="Were at stocklist" />
    </View>
  );
};

export default StockListScreen;

// stack navigator for clicking on stocks
// when navigating can just pass in param to route
// check if user is logged in from checking storage for user token
// use context to pass data down to componets at many nesting levels
// props.chihldren can be used to have a border around stuff

// for cleaner code if you need to pass down something that is only needed
// at the deepest level, pass down the ocmponent itself and not liike avatar
// size or sth so that it is not known what exactly is passed down
