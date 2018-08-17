import KeenDataviz from 'keen-dataviz';
import KeenAnalysis from 'keen-analysis'; // API client

import 'keen-dataviz/dist/keen-dataviz.css';

const chart = new KeenDataviz({
  // Required:
  container: '#my-chart-div', // querySelector,

  // Optional:
  title: 'New Customers per Week',
  showLoadingSpinner: true
});

// use keen-analysis.js to run a query
const client = new KeenAnalysis({
  // replace with your project id and read key
  projectId: 'PROJECT_ID',
  readKey: 'READ_KEY'
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'pageviews',
    timeframe: 'this_7_days',
    interval: 'daily'
  })
  .then(results => {
    // Handle the result
    chart
      .render(results);
  })
  .catch(error => {
    // Handle the error
    chart
      .message(error.message);
  });
