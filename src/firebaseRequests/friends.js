import axios from 'axios';
import constants from '../constants';

const postRequest = (friend) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${constants.firebaseConfig.databaseURL}/friends.json`, friend)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getByUidRequest = (uid) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${constants.firebaseConfig.databaseURL}/friends.json?orderBy="uid"&equalTo="${uid}"`)
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

export default { postRequest, getByUidRequest };
