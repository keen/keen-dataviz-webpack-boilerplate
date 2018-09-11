import KeenDataviz from 'keen-dataviz';
import KeenAnalysis from 'keen-analysis'; // API client

import 'keen-dataviz/dist/keen-dataviz.css';

const client = new KeenAnalysis({
  projectId: '5b8e35a4c9e77c00014d9bb0',
  masterKey: '1BEA62A77AA0E8215174A933BDD0FBE19F4B463E6DF77B19133925E5355907AF',
  readKey: '31D5CD12F3F3FDD585BCE74EC1238AC3E23F93302D303721A6E5097C34C838B48F7F88419F2B9F0D8E85892FDD6E864D8124C563F95300F5FE0FDC93412B868C4C27D00A45D86213ED2DA5A3C33707270D7837D72B8F75B4F648A4E76A56D3B1'
});

let savedQueryName = 'orders-per-week';

if (window.location.href.indexOf('forceNewSavedQuery') > -1) {
  // just for debugging - create new saved query every time: http://localhost:3000/?forceNewSavedQuery=1
  savedQueryName = 'orders-per-week-' + Math.floor(Math.random() * 100 * Math.random() * 100);
}

function createNewSavedQuery(){
  console.log('create new saved query...');
  client
    .put(client.url('queries', 'saved', savedQueryName))
    .auth(client.masterKey())
    .send({
      query: {
        analysis_type: 'count',
        event_collection: 'logins',
        timeframe: 'this_303_days',
        interval: 'weekly',
        refresh_rate: 14400,
        filters: [
          {
            operator: 'eq',
            property_name: 'geo_information.country',
            property_value: 'China'
          }
        ]
      },
      metadata: {
        display_name: 'Weekly Number of Logins',
        visualization: {
          chart_type: 'area'
        }
      }
    })
    .then(res => {
      console.log('... created', res);
      return getResult();
    })
    .catch(err => {
      console.log(err);
    });
}

function getResult(){
  console.log('run getResult for saved query named: ', savedQueryName);
  return client
    .query('saved', savedQueryName)
    .then(res => {
      console.log('got result', res);

      if (!res.result) {
        const seconds = 10;
        console.log(`... no result yet, running query again in ${seconds} secs`);
        setTimeout(() => {
          getResult();
        }, 1000 * seconds);
        return;
      }

      // create a keenDataviz instance
      const ordersperweekDataviz = new KeenDataviz({
        container: '#my-chart-div',
        type: 'area',
        results: res // pass the response into the KeenDataviz instance
      });
    })
    .catch(err => {
      if (err && !err.ok && err.error_code === 'ResourceNotFoundError') {
        // saved query doesn't exist yet - create a new one
        console.log('saved query not found', err);
        return createNewSavedQuery();
      }
      // other errors
      console.log(err);
    });
}

getResult();
