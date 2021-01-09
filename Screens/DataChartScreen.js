import React from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';

const DataChartScreen = ({route, navigation}) => {
  const {dataSet} = route.params;

  return (
    <View>
      <Text> Data chart Screen</Text>
      <LineChart
        style={{width: '100%', height: '70%'}}
        data={{dataSets: [dataSet]}}
      />
    </View>
  );
};

export default DataChartScreen;
