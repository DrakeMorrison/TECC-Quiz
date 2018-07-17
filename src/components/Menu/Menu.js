import React from 'react';

import authRequests from '../../firebaseRequests/auth';

class Menu extends React.Component {
  render () {
    const {runAway} = this.props;

    const logoutClickEvent = () => {
      runAway();
      authRequests.logoutUser();
    };

    return (
      <div className='Menu'>
        <h2>Menu</h2>
        <button onClick={logoutClickEvent}>Logout</button>
      </div>
    );
  };
}

export default Menu;
