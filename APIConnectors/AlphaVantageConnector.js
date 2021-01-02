import axios from 'axios';

let url;
url = 'https://www.alphavantage.co/';

const apikey = 'EBXOMMPP2OGNKLGR';

export const getStockData = async (symbol) => {
  let stockData = [];
  let overViewResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => {
        const attributesNeeded = ['PERatio','ProfitMargin'];
        const reducedResult = Object.keys(res).reduce((accumulator,currentValue) => {
            if(attributesNeeded.includes(currentValue)){
                accumulator[currentValue] = res[currentValue];
            }
        },{});
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
        const attributesNeededForEveryFiscalYear = ['fiscalDateEnding','dividendPayout','netIncome'];
        const reducedResult = res['annualReports'].reduce((accumulator,fiscalYearInfo) => {
            let eachYear = {};
            attributesNeededForEveryFiscalYear.forEach((key)=>eachYear[key] = fiscalYearInfo[key])
            accumulator.push(eachYear);
        },[]);
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
        const attributesNeededForEveryFiscalYear = ['fiscalDateEnding','commonStockSharesOutstanding'];
        const additionalAttributesNeededForLatestFiscalYear = ['goodwill','currentLongTermDebt','longTermDebt','totalCurrentAssets','totalLiabilities','totalShareholderEquity','totalCurrentAssets'];
        const reducedResult = res['annualReports'].reduce((accumulator,fiscalYearInfo) => {
            let eachYear = {};
            if(accumulator.isEmpty()){
                additionalAttributesNeededForLatestFiscalYear.forEach((key)=>eachYear[key] = fiscalYearInfo[key])
            }
            attributesNeededForEveryFiscalYear.forEach((key)=>eachYear[key] = fiscalYearInfo[key])
            accumulator.push(eachYear);
        },[]);
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
        const attributesNeededForEveryFiscalYear = ['fiscalDateEnding','commonStockSharesOutstanding'];
        const additionalAttributesNeededForLatestFiscalYear = ['goodwill','currentLongTermDebt','longTermDebt','totalCurrentAssets','totalLiabilities','totalShareholderEquity','totalCurrentAssets'];
        const reducedResult = res['annualReports'].reduce((accumulator,fiscalYearInfo) => {
            let eachYear = {};
            if(accumulator.isEmpty()){
                additionalAttributesNeededForLatestFiscalYear.forEach((key)=>eachYear[key] = fiscalYearInfo[key])
            }
            attributesNeededForEveryFiscalYear.forEach((key)=>eachYear[key] = fiscalYearInfo[key])
            accumulator.push(eachYear);
        },[]);
        return reducedResult;
    })
    .catch((err) => {
      console.log(err);
    });
};
