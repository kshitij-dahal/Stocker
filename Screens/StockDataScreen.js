import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import {getStockData} from '../APIConnectors/AlphaVantageConnector';

const EPSDataSet = (data) => {
  let dataSet = {label: 'EPS', values: []};
  data.forEach((fiscalDate) => {
    dataSet.values.push(parseFloat(fiscalDate.EPS));
  });
  console.log('this is the dataset');
  dataSet.values = dataSet.values.slice(0, 9);
  console.log(dataSet);
  return dataSet;
};

const DPSDataSet = (data) => {
  let dataSet = {label: 'DPS', values: []};
  data.forEach((fiscalDate) => {
    dataSet.values.push(parseFloat(fiscalDate.DPS));
  });
  console.log('this is the dataset');
  dataSet.values = dataSet.values.slice(0, 9);
  console.log(dataSet);
  return dataSet;
};

const StockDataScreen = ({route, navigation}) => {
  const [data, setData] = React.useState([]);
  const {symbol} = route.params;

  useEffect(() => {
    const getData = async () => {
      const stockData = await getStockData(symbol);
      if (stockData.success) {
        setData(stockData.data);
      } else {
        setData([]);
      }
    };
    getData();
  }, [symbol]);

  return (
    <View style={{flex: 1}}>
      {data.length !== 0 ? (
        <>
          <Text>P/E Ratio: {data[0].PERatio}</Text>
          <Text>Profit Margin: {data[0].ProfitMargin}</Text>
          <LineChart
            style={{width: '100%', height: '70%'}}
            data={{dataSets: [DPSDataSet(data)]}}
          />
        </>
      ) : (
        <Text>Error</Text>
      )}
    </View>
  );
};
export default StockDataScreen;
