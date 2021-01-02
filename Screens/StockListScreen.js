import React from 'react';
import {useEffect} from 'react';
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

const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{item.symbol}</Text>
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
  }, [portfolioStocks, searchText]);

  return (
    <SafeAreaView>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={setSearchText}
        value={searchText}
      />
      <FlatList
        data={displayedStocks}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        extraData={selectedId}
      />
    </SafeAreaView>
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
