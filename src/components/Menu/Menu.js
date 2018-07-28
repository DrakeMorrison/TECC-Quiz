import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import gameRequests from '../../firebaseRequests/games';
import './Menu.css';

class Menu extends React.Component {
  static propTypes = {
    runAway: PropTypes.func.isRequired,
  };

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
        <Link to={{ pathname: `completegame/${game.id}`, state: { games: this.state.games } }} key={game.id}>
          <p>Creation Time: {game.creationTime}</p>
          <p>Points: {game.points}</p>
        </Link>
      );
    }).reverse();

    return (
      <div className='Menu'>
        <Link className='col-xs-4 menu-friends' to={{pathname: '/friends', state: { friends: this.state.friends }}}>
          <h4>Friends</h4>
          {friendNames}
        </Link>
        <div className='col-xs-4'>
          <h2>Menu</h2>
          <Link className='btn btn-primary' to='/game/1'>Scenario 1</Link>
          <Link className='btn btn-primary' to='/game/2'>Scenario 2</Link>
          <button className='btn btn-danger' onClick={logoutClickEvent}>Logout</button>
          <Link to='/'>Back</Link>
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
