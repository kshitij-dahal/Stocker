import React, {useContext} from 'react';
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
import LoadableView from '../Components/LoadableView';
import Dialog from 'react-native-dialog';
import {AuthContext} from '../AuthContext';

const Item = ({item, onPress, style}) => (
  <TouchableOpacity onPress={onPress} style={buttons.stockButton}>
    <Text style={text.buttonText}>{item.symbol}</Text>
  </TouchableOpacity>
);

const StockListScreen = ({navigation}) => {
  const [stockList, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'FETCH_STOCK_LIST':
          return {
            ...prevState,
            loading: true,
          };
        case 'FETCH_STOCK_LIST_SUCCESS':
          return {
            ...prevState,
            portfolioStocks: action.portfolioStocks,
            displayedStocks: action.portfolioStocks,
            loading: false,
          };
        case 'FETCH_STOCK_LIST_FAILURE':
          return {
            ...prevState,
            dialogInfo: {
              title: 'Server Error',
              description: 'Please try again later.',
              btnLabel: 'OK',
              visible: true,
            },
            loading: false,
          };
        case 'SEARCH':
          return {
            ...prevState,
            searchText: action.searchText,
            displayedStocks: prevState.portfolioStocks.filter((stock) =>
              stock.symbol
                .toLowerCase()
                .includes(action.searchText.toLowerCase()),
            ),
          };
        case 'SELECT_STOCK':
          return {
            ...prevState,
            selectedId: action.symbol,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            dialogInfo: {
              ...prevState.dialogInfo,
              visible: false,
            },
          };
      }
    },
    {
      selectedId: null,
      portfolioStocks: [],
      displayedStocks: [],
      searchText: '',
      loading: true,
      dialogInfo: {
        title: '',
        description: '',
        btnLabel: '',
        visible: false,
      },
    },
  );

  const renderItem = ({item}) => {
    const backgroundColor =
      item.id === stockList.selectedId ? '#6e3b6e' : '#f9c2ff';

    return (
      <Item
        item={item}
        onPress={async () => {
          dispatch({type: 'SELECT_STOCK', symbol: item.symbol});
          navigation.navigate('StockData', {
            symbol: item.symbol,
          });
        }}
        style={{backgroundColor}}
      />
    );
  };

  useEffect(() => {
    dispatch({type: 'FETCH_STOCK_LIST'});
    // const data = {
    //   success: true,
    //   portfolio: [{symbol: 'AAPL'}, {symbol: 'TSLA'}],
    // };
    getPortfolio().then((data) => {
      console.log('what is this');
      console.log(data);
      if (data.success) {
        dispatch({
          type: 'FETCH_STOCK_LIST_SUCCESS',
          portfolioStocks: data.portfolio,
        });
      } else {
        dispatch({
          type: 'FETCH_STOCK_LIST_FAILURE',
        });
      }
    });
  }, []);

  const noStocksComponent = () => (
    <View style={{alignItems: 'center'}}>
      {stockList.loading ? (
        <></>
      ) : (
        <Text style={styles.noStocksDisplay}>No Stocks Available</Text>
      )}
    </View>
  );

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <LoadableView style={theme.background} loading={stockList.loading}>
          <LinearGradient
            //theme.colors.background rgb(149, 163, 173)
            colors={[theme.colors.background, '#979899']}
            style={theme.linearGradient}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}>
            <AuthContext.Consumer>
              {(data) => (
                <Dialog.Container visible={stockList.dialogInfo.visible}>
                  <Dialog.Title>{stockList.dialogInfo.title}</Dialog.Title>
                  <Dialog.Description>
                    {stockList.dialogInfo.description}
                  </Dialog.Description>
                  <Dialog.Button
                    label={stockList.dialogInfo.btnLabel}
                    onPress={() => {
                      dispatch({type: 'SIGN_OUT'});
                      data.signOut();
                    }}
                  />
                </Dialog.Container>
              )}
            </AuthContext.Consumer>
            <SafeAreaView style={styles.safeView}>
              <SearchBar
                round={true}
                inputStyle={{
                  fontFamily: 'FuturaPT-Book',
                }}
                placeholder="Type Here..."
                onChangeText={(text) =>
                  dispatch({type: 'SEARCH', searchText: text})
                }
                value={stockList.searchText}
                containerStyle={{
                  marginBottom: 10,
                  width: '100%',
                }}
              />
              <FlatList
                style={{width: '96%'}}
                data={stockList.displayedStocks}
                renderItem={renderItem}
                keyExtractor={(item) => item.symbol}
                extraData={stockList.selectedId}
                ListEmptyComponent={() => noStocksComponent()}
              />
            </SafeAreaView>
          </LinearGradient>
        </LoadableView>
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  safeView: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  noStocksDisplay: {
    fontSize: 25,
    fontFamily: 'FuturaPT-Book',
    color: 'white',
    margin: 10,
  },
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
