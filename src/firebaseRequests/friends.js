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

export default { postRequest };
