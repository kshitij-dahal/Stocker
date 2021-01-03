import React from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';

const EPSDataSet = (data) => {
  let dataSet = {label: 'EPS', values: []};
  data.forEach((fiscalDate) => {
    dataSet.values.push(parseFloat(fiscalDate.EPS));
  });
  console.log('this is the dataset');
  dataSet.values = dataSet.values.slice(0,9);
  console.log(dataSet);
  return dataSet;
};

const StockDataScreen = ({route, navigation}) => {
  const {data} = route.params;
  console.log('this is the data');
  console.log(data);
  return (
    <View style={{flex: 1}}>
      <Text>P/E Ratio: {data[0].PERatio}</Text>
      <Text>Profit Margin: {data[0].ProfitMargin}</Text>
      <LineChart
        style={{width: '100%', height: '70%'}}
        data={{dataSets: [EPSDataSet(data)]}}
      />
    </View>
  );
};

export default StockDataScreen;
