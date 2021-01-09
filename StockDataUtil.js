export const extractMetricDataSet = (data, metric) => {
  let dataSet = {label: 'metric', values: []};
  let values = [];
  data.forEach((key, index) => {
    values.push({x: index, y: parseFloat(key[metric])});
  });
  dataSet.values = values;
  return dataSet;
};
