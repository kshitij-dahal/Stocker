import {overviewInformation} from '../constants';

export const extractMetricDataSet = (data, metric) => {
  let dataSet = {label: metric, values: []};
  let values = [];
  console.log('HEREHEr');
  console.log(data);
  data.forEach((key, index) => {
    values.push({
      x: index,
      y: parseFloat(key[metric]),
      date: key.fiscalDateEnding,
    });
  });
  dataSet.values = values.slice(0,7);
  return dataSet;
};

export const extractOverviewInformation = (data) => {
  const attributesNeeded = [
    'PERatio',
    'ProfitMargin',
    'goodwill',
    'netIncome',
    'totalCurrentAssets',
    'totalCurrentLiabilities',
  ];
  let final = [];
  const dataString = JSON.stringify(data);
  JSON.parse(dataString, function (key, value) {
    if (attributesNeeded.includes(key)) {
      final.push([overviewInformation[key], value]);
    }
  });
  return final;
};
