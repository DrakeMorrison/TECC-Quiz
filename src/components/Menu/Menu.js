import React from 'react';
import { Link } from 'react-router-dom';
// import Prop-types from 'prop-types';

import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import gameRequests from '../../firebaseRequests/games';
import './Menu.css';

class Menu extends React.Component {
  state = {
    friends: [],
    games: [],

  };

  componentDidMount () {
    const uid = authRequests.getUid();
    friendRequests
      .getByUidRequest(uid)
      .then((friends) => {
        this.setState({ friends });
        gameRequests
          .getRequest()
          .then((games) => {
            this.setState({ games });
          });
      })
      .catch(console.error.bind(console));
  }

  render () {
    const {runAway} = this.props;

    const logoutClickEvent = () => {
      runAway();
      authRequests.logoutUser();
    };

    const friendNames = this.state.friends.map(friend => {
      return (
        <p key={friend.id}>{friend.name}</p>
      );
    });

    const gameList = this.state.games.map(game => {
      return (
        <div key={game.id}>
          <p>Creation Time: {game.creationTime}</p>
          <p>Points: {game.points}</p>
        </div>
      );
    });

    return (
      <div className='Menu'>
        <div className='col-xs-4 menu-friends'>
          <h4>Friends</h4>
          {friendNames}
        </div>
        <div className='col-xs-4'>
          <h2>Menu</h2>
          <Link className='btn btn-primary' to='/game'>Scenario 1</Link>
          <Link className='btn btn-primary' to='/game'>Scenario 2</Link>
          <button className='btn btn-danger' onClick={logoutClickEvent}>Logout</button>
        </div>
        <div className='col-xs-4 menu-games'>
          <h4>Games</h4>
          {gameList}
        </div>
      </div>
    );
  };
}

export default Menu;
