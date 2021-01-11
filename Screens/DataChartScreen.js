import React from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';

const DataChartScreen = ({route, navigation}) => {
  const {dataSet, metric} = route.params;

  return (
    <View>
      <Text>{metric}</Text>
      <LineChart
        style={{width: '100%', height: '70%'}}
        data={{dataSets: [dataSet]}}
        legend={{enabled: false}}
        chartDescription={{text: ''}}
        xAxis={{
          gridDashedLine: {
            lineLength: 4,
            spaceLength: 2,
            phase: 4,
          },
          labelRotationAngle: -60,
          valueFormatter: dataSet.values.map((item) => item.date),
        }}
        yAxis={{zeroLine: {enabled: false}}}
        chartBackgroundColor={1}
      />
    </View>
  );
};

export default DataChartScreen;
