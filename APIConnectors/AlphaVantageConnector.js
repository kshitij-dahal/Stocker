import axios from 'axios';

let url;
url = 'https://www.alphavantage.co/';

const apikey = 'EBXOMMPP2OGNKLGR';

const processStockData = (data) => {
  let finalData = [];

  // structure
  // contains all required info in an object in order of decreasing fiscal date

  // DPS
  data.cashFlowResult.reduce((accumulator, currentValue, index) => {
    let stockInfo = {
      fiscalDateEnding: currentValue.fiscalDateEnding,
      DPS: (
        currentValue.dividendPayout /
        data.balanceSheetResult[index].commonStockSharesOutstanding
      ).toFixed(2),
    };
    accumulator.push(stockInfo);
  }, finalData);

  return data;
};

export const getStockData = async (symbol) => {
  let overViewResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => {
      const attributesNeeded = ['PERatio', 'ProfitMargin'];
      const reducedResult = Object.keys(res).reduce(
        (accumulator, currentValue) => {
          if (attributesNeeded.includes(currentValue)) {
            accumulator[currentValue] = res[currentValue];
          }
        },
        {},
      );
      return reducedResult;
    })
    .catch((err) => {
      console.log(err);
    });
  let cashFlowResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=CASH_FLOW&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => {
      const attributesNeededForEveryFiscalDate = [
        'fiscalDateEnding',
        'dividendPayout',
        'netIncome',
      ];
      const reducedResult = res.quarterlyReports.reduce(
        (accumulator, fiscalDateInfo) => {
          let eachDate = {};
          attributesNeededForEveryFiscalDate.forEach(
            (key) => (eachDate[key] = fiscalDateInfo[key]),
          );
          accumulator.push(eachDate);
        },
        [],
      );
      return reducedResult;
    })
    .catch((err) => {
      console.log(err);
    });
  let balanceSheetResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=BALANCE_SHEET&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => {
      const attributesNeededForEveryFiscalDate = [
        'fiscalDateEnding',
        'commonStockSharesOutstanding',
      ];
      const additionalAttributesNeededForLatestfiscalDate = [
        'goodwill',
        'currentLongTermDebt',
        'longTermDebt',
        'totalCurrentAssets',
        'totalLiabilities',
        'totalShareholderEquity',
        'totalCurrentAssets',
      ];
      const reducedResult = res.quarterlyReports.reduce(
        (accumulator, fiscalDateInfo) => {
          let eachDate = {};
          if (accumulator.isEmpty()) {
            additionalAttributesNeededForLatestfiscalDate.forEach(
              (key) => (eachDate[key] = fiscalDateInfo[key]),
            );
          }
          attributesNeededForEveryFiscalDate.forEach(
            (key) => (eachDate[key] = fiscalDateInfo[key]),
          );
          accumulator.push(eachDate);
        },
        [],
      );
      return reducedResult;
    })
    .catch((err) => {
      console.log(err);
    });
  let earningsResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=EARNINGS&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => {
      const attributesNeededForEveryFiscalDate = [
        'fiscalDateEnding',
        'commonStockSharesOutstanding',
      ];
      const additionalAttributesNeededForLatestfiscalDate = [
        'goodwill',
        'currentLongTermDebt',
        'longTermDebt',
        'totalCurrentAssets',
        'totalLiabilities',
        'totalShareholderEquity',
        'totalCurrentAssets',
      ];
      const reducedResult = res.quarterlyReports.reduce(
        (accumulator, fiscalDateInfo) => {
          let eachDate = {};
          if (accumulator.isEmpty()) {
            additionalAttributesNeededForLatestfiscalDate.forEach(
              (key) => (eachDate[key] = fiscalDateInfo[key]),
            );
          }
          attributesNeededForEveryFiscalDate.forEach(
            (key) => (eachDate[key] = fiscalDateInfo[key]),
          );
          accumulator.push(eachDate);
        },
        [],
      );
      return reducedResult;
    })
    .catch((err) => {
      console.log(err);
    });

  return processStockData({
    overViewResult: overViewResult,
    cashFlowResult: cashFlowResult,
    balanceSheetResult: balanceSheetResult,
    earningsResult: earningsResult,
  });
};
