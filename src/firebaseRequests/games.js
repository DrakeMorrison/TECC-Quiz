import axios from 'axios';
import constants from '../constants';

const getByUidRequest = (uid) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/game.json?orderBy="uid"&equalTo="${uid}"`)
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

const postRequest = (game) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${constants.firebaseConfig.databaseURL}/game.json`, game)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const putRequest = (gameId, game) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${constants.firebaseConfig.databaseURL}/game/${gameId}.json`, game)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default { getByUidRequest, postRequest, putRequest };
