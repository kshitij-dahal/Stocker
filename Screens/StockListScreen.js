import React from 'react';
import {useEffect} from 'react';
import {ThemeContext} from '../ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {getPortfolio} from '../APIConnectors/WealthSimpleConnector';
import {buttons, text, inputBox} from './styles';

const Item = ({item, onPress, style}) => (
  <TouchableOpacity 
    onPress={onPress}
    style={buttons.stockButton}>
    <Text style={text.buttonText}>{item.symbol}</Text>
  </TouchableOpacity>
);

const StockListScreen = () => {
  const [selectedId, setSelectedId] = React.useState(null);
  const [portfolioStocks, setPortfolioStocks] = React.useState([]);
  const [displayedStocks, setDisplayedStocks] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.symbol)}
        style={{backgroundColor}}
      />
    );
  };

  useEffect(() => {
    const getPortfolioData = async () => {
      const data = await getPortfolio();
      console.log('got it here');
      console.log(data);
      setPortfolioStocks(data.portfolio);
      setDisplayedStocks(JSON.parse(JSON.stringify(data.portfolio)));
    };
    getPortfolioData();
  }, []);

  useEffect(() => {
    const newDisplayedStocks = JSON.parse(
      JSON.stringify(
        portfolioStocks.filter((stock) =>
          stock.symbol.toLowerCase().includes(searchText.toLowerCase()),
        ),
      ),
    );
    setDisplayedStocks(newDisplayedStocks);
  }, [searchText, portfolioStocks]);

  const noStocksComponent = () => (
    <View style={{alignItems: 'center'}}>
      <Text style={styles.noStocksDisplay}>No Stocks Available</Text>
    </View>
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
          <SafeAreaView style={styles.safeView}>
            <SearchBar
              round={true}
              inputStyle={{
                fontFamily: 'FuturaPT-Book'
              }}
              placeholder="Type Here..."
              onChangeText={setSearchText}
              value={searchText}
              containerStyle={{
                marginBottom:10,  
                width: "100%",
              }}
            />
            <FlatList
              style={{width:"96%"}}
              data={displayedStocks}
              renderItem={renderItem}
              keyExtractor={(item) => item.symbol}
              extraData={selectedId}
              ListEmptyComponent={() => noStocksComponent()}
            />
          </SafeAreaView>
        </LinearGradient>
      </View>
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  safeView: {
    height:"100%",
    width: "100%",
    alignItems: 'center'
  },
  noStocksDisplay: {
    fontSize: 25, 
    fontFamily: "FuturaPT-Book",
    color: 'white',
    margin: 10
  } 
});

export default StockListScreen;

// stack navigator for clicking on stocks
// when navigating can just pass in param to route
// check if user is logged in from checking storage for user token
// use context to pass data down to componets at many nesting levels
// props.chihldren can be used to have a border around stuff

// for cleaner code if you need to pass down something that is only needed
// at the deepest level, pass down the ocmponent itself and not liike avatar
// size or sth so that it is not known what exactly is passed down
