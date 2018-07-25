import axios from 'axios';
import constants from '../constants';

const getByScenarioRequest = (scenarioId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/questions.json?orderBy="scenarioId"&equalTo=${scenarioId}`)
      .then(res => {
        const stuff = [];
        if (res.data !== null) {
          Object.keys(res.data).forEach(fbKey => {
            res.data[fbKey].id = fbKey;
            stuff.push(res.data[fbKey]);
          });
        }
        resolve(stuff);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getById = (Id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/questions/${Id}.json`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default { getByScenarioRequest, getById };
