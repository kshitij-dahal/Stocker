import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {getStockData} from '../APIConnectors/AlphaVantageConnector';
import {buttons, text, inputBox} from './styles';
import {ThemeContext} from '../ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import {extractMetricDataSet} from '../StockDataUtil';


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
        console.log(stockData.data)
      } else {
        setData([]);
      }
    };
    getData();
  }, [symbol]);

  const tableHead = ['Overview'];

  const tableData = [];
    for (let i = 0; i < 30; i += 1) {
      const rowData = [];
      for (let j = 0; j < 2; j += 1) {
        rowData.push(`${i}${j}`);
      }
      tableData.push(rowData);
    }


  const OverViewDataComponent = ({metric, amount}) => (
    <TouchableOpacity
      style={buttons.overViewButton}
      onPress={async () => {
        navigation.navigate('DataChart', {
          dataSet: extractMetricDataSet(data, metric)
        });
      }}
    >
      <Text style={text.stockDataName}>{metric}</Text>
      <Text style={text.stockDataAmount}>{amount}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <View style={theme.background}>
          <LinearGradient
            //theme.colors.background rgb(149, 163, 173)
            colors={[theme.colors.background, '#979899']}
            style={theme.linearGradient}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}>
              <ScrollView style={styles.dataWrapper} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flex: 1, width: "100%", padding: 5, alignItems: "center", justifyContent: "flex-start"}}>
                {data.length !== 0 ? (
                  <>
                    <Text style={text.stockDataSymbol}>{symbol}</Text>
                    <OverViewDataComponent metric={"EPS"} amount={10}/>
                    <OverViewDataComponent metric={"DPS"} amount={5}/>
                    <OverViewDataComponent metric={"Price"} amount={19}/>


                  </>
                ) : (
                  <Text>Error</Text>
                )}
              </View>

              <View style={styles.container}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}} style={{width: "100%"}}>
                      <Row data={tableHead} style={styles.header} textStyle={styles.text}/>
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                      <Table style={{width: "100%"}} borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        {
                          tableData.map((rowData, index) => (
                            <Row
                              key={index}
                              data={rowData}
                              style={[styles.row, index%2 && {backgroundColor: '#F7F6E7', width: "100%"}]}
                              textStyle={styles.text}
                            />
                          ))
                        }
                      </Table>
                    </ScrollView>
              </View>
              </ScrollView>
            </LinearGradient>
        </View>
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "95%", alignItems: 'center', justifyContent: 'center'},
  header: { height: 50, backgroundColor: '#537791', width: "100%" },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1,  width: "100%"},
  row: { height: 40, backgroundColor: '#E7E6E1', width: "100%" }
});


export default StockDataScreen;
