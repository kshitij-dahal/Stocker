import axios from 'axios';

let url;
url = 'https://www.alphavantage.co/';

const apikey = 'EBXOMMPP2OGNKLGR';

const processStockData = (data) => {
  let finalData = [];

  // structure
  // contains all required info in an object in order of decreasing fiscal date

  // DPS, netIncome, dividendPayoutRatio
  data.cashFlowResult.forEach((key, index) => {
    let stockInfo = {
      fiscalDateEnding: key.fiscalDateEnding,
      DPS: (
        key.dividendPayout /
        data.balanceSheetResult[index].commonStockSharesOutstanding
      ).toFixed(2),
      netIncome: key.netIncome,
    };
    finalData.push(stockInfo);
  });

  finalData[0].dividendPayoutRatio = (
    data.cashFlowResult[0].dividendPayout / data.cashFlowResult[0].netIncome
  ).toFixed(2);

  // p/e ratio, profit margin
  finalData[0].PERatio = data.overViewResult.PERatio;
  finalData[0].ProfitMargin = data.overViewResult.ProfitMargin;

  // goodwill, others missing
  finalData[0].goodwill = data.balanceSheetResult[0].goodwill;

  //EPS
  data.earningsResult.forEach((value, index) => {
    if (index < finalData.length) {
      finalData[index].EPS = value.reportedEPS;
    }
  });

  console.log('ya ya ');
  return {success: true, data: finalData};
};

export const getStockData = async (symbol) => {
  let overViewResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => res.data)
    .then((res) => {
      console.log('here mane');
      console.log(res);
      const attributesNeeded = ['PERatio', 'ProfitMargin'];
      let final = {};
      attributesNeeded.forEach((key) => (final[key] = res[key]));
      return final;
    })
    .catch((err) => {
      return {
        success: false,
        status: err.response.status,
      };
    });
  let cashFlowResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=CASH_FLOW&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => res.data)
    .then((res) => {
      const attributesNeededForEveryFiscalDate = [
        'fiscalDateEnding',
        'dividendPayout',
        'netIncome',
      ];
      let final = [];
      console.log('haha cash flow quarterly');
      console.log(Object.keys(res));
      console.log(res.quarterlyReports);
      res.quarterlyReports.forEach((fiscalDateInfo) => {
        let eachDate = {};
        attributesNeededForEveryFiscalDate.forEach(
          (key) => (eachDate[key] = fiscalDateInfo[key]),
        );
        final.push(eachDate);
      });
      console.log(' cashflow data');
      console.log(final);
      return final;
    })
    .catch((err) => {
      return {
        success: false,
        status: err.response.status,
      };
    });
  let balanceSheetResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=BALANCE_SHEET&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => res.data)
    .then((res) => {
      const attributesNeededForEveryFiscalDate = [
        'fiscalDateEnding',
        'commonStockSharesOutstanding',
      ];
      const additionalAttributesNeededForLatestFiscalDate = [
        'goodwill',
        'currentLongTermDebt',
        'longTermDebt',
        'totalCurrentAssets',
        'totalLiabilities',
        'totalShareholderEquity',
        'totalCurrentAssets',
      ];
      let final = [];

      res.quarterlyReports.forEach((fiscalDateInfo) => {
        let eachDate = {};
        if (final.length === 0) {
          additionalAttributesNeededForLatestFiscalDate.forEach(
            (key) => (eachDate[key] = fiscalDateInfo[key]),
          );
        }
        attributesNeededForEveryFiscalDate.forEach(
          (key) => (eachDate[key] = fiscalDateInfo[key]),
        );
        final.push(eachDate);
      });
      console.log('baalance sheet');
      console.log(final);
      return final;
    })
    .catch((err) => {
      return {
        success: false,
        status: err.response.status,
      };
    });
  let earningsResult = await axios
    .create({
      baseURL: url,
    })
    .get('/query?function=EARNINGS&symbol=' + symbol + '&apikey=' + apikey)
    .then((res) => res.data)
    .then((res) => {
      const attributesNeededForEveryFiscalDate = ['reportedEPS'];
      let final = [];
      console.log('we entered earnings');
      console.log(Object.keys(res));
      res.quarterlyEarnings.forEach((fiscalDateInfo) => {
        let eachDate = {};
        attributesNeededForEveryFiscalDate.forEach(
          (key) => (eachDate[key] = fiscalDateInfo[key]),
        );
        final.push(eachDate);
      });
      console.log('we finished earnings');
      console.log(final);
      return final;
    })
    .catch((err) => {
      return {
        success: false,
        status: err.response.status,
      };
    });

  return processStockData({
    overViewResult: overViewResult,
    cashFlowResult: cashFlowResult,
    balanceSheetResult: balanceSheetResult,
    earningsResult: earningsResult,
  });
};
