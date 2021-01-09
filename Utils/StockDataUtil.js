import { overviewInformation } from "../constants"

export const extractMetricDataSet = (data, metric) => {
  let dataSet = {label: metric, values: []};
  let values = [];
  data.forEach((key, index) => {
    values.push({x: index, y: parseFloat(key[metric])});
  });
  dataSet.values = values;
  return dataSet;
};

export const extractOverviewInformation = (data) => {
  const attributesNeeded = ['PERatio', 'ProfitMargin', 'goodwill', "netIncome"];
  let final = [];
  const dataString = JSON.stringify(data)
  JSON.parse(dataString, function(key, value) {
    if(attributesNeeded.includes(key)) {
      final.push([overviewInformation[key], value])
    }
  });
  return final
}