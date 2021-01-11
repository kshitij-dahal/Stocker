import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {getStockData} from '../APIConnectors/AlphaVantageConnector';
import {buttons, text, inputBox} from './styles';
import {ThemeContext} from '../ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import {
  extractMetricDataSet,
  extractOverviewInformation,
} from '../Utils/StockDataUtil';

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
  const [overview, setOverview] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const {symbol} = route.params;

  useEffect(() => {
    const getData = async () => {
      const stockData = await getStockData(symbol);
      if (stockData.success) {
        await setData(stockData.data);
        console.log(stockData.data[0]);
        await setOverview(extractOverviewInformation(stockData.data[0]));
      } else {
        await setData([]);
      }
      setLoading(false);
    };
    getData();
  }, [symbol]);

  const tableHead = ['Overview'];
  const OverViewDataComponent = ({metric, amount}) => (
    <TouchableOpacity
      style={buttons.overViewButton}
      onPress={async () => {
        navigation.navigate('DataChart', {
          dataSet: extractMetricDataSet(data, metric),
          metric: metric,
        });
      }}>
      <Text style={text.stockDataName}>{metric}</Text>
      <Text style={text.stockDataAmount}>{amount}</Text>
    </TouchableOpacity>
  );

  const gradientLoadingStyle = (existingTheme) => {
    let copy = JSON.parse(JSON.stringify(existingTheme));
    if (loading) {
      copy.opacity = 0.5;
    }
    return copy;
  };

  //const o3verview = [['PE Ratio', 5], ["Profit Margin", 10000000], ['Goodwill', "None"]]

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <View
          style={theme.background}
          pointerEvents={loading ? 'none' : 'auto'}>
          <LinearGradient
            //theme.colors.background rgb(149, 163, 173)
            colors={[theme.colors.background, '#979899']}
            style={gradientLoadingStyle(theme.linearGradient)}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}>
            {data.length !== 0 || loading ? (
              <ScrollView
                style={styles.dataWrapper}
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    padding: 5,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Text style={text.stockDataSymbol}>{symbol}</Text>
                  <OverViewDataComponent metric={'EPS'} amount={10} />
                  <OverViewDataComponent metric={'DPS'} amount={5} />
                  <OverViewDataComponent metric={'Price'} amount={19} />
                </View>
                <View style={styles.container}>
                  <Table style={{width: '100%', alignItems: 'center'}}>
                    <Row
                      data={tableHead}
                      style={styles.header}
                      textStyle={text.stockDataSymbol}
                    />
                  </Table>
                  <ScrollView style={styles.dataWrapper}>
                    <Table
                      style={{width: '100%'}}
                      borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                      {overview.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          style={[
                            styles.row,
                            index % 2 && {
                              backgroundColor: '#f2f4f5',
                              width: '100%',
                            },
                          ]}
                          textStyle={styles.text}
                        />
                      ))}
                    </Table>
                  </ScrollView>
                </View>
              </ScrollView>
            ) : (
              <Text>Error</Text>
            )}
          </LinearGradient>
          {loading ? (
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
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 50,
    backgroundColor: '#404244',
    width: '100%',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    fontFamily: 'FuturaPT-Book',
  },
  dataWrapper: {
    marginTop: -1,
    width: '100%',
  },
  row: {
    height: 40,
    backgroundColor: '#b3c0c4',
    width: '100%',
  },
});

export default StockDataScreen;
