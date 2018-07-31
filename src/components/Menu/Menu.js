import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import gameRequests from '../../firebaseRequests/games';
import awardRequests from '../../firebaseRequests/awards';
import userRequests from '../../firebaseRequests/users';
import './Menu.css';

class Menu extends React.Component {
  static propTypes = {
    runAway: PropTypes.func.isRequired,
  };

  state = {
    friends: [],
    games: [],
    userAwards: [],
  };

  componentDidMount () {
    const uid = authRequests.getUid();
    friendRequests
      .getByUidRequest(uid)
      .then(friends => {
        this.setState({ friends });
        gameRequests
          .getByUidRequest(uid)
          .then(games => {
            this.setState({ games });
            awardRequests
              .getRequest()
              .then(awards => {
                userRequests
                  .getRequest()
                  .then((users) => {
                    const currentUser = users.filter(user => user.id === uid)[0];
                    this.setUserAwards(awards, currentUser);
                  });
              });
          });
      })
      .catch(console.error.bind(console));
  }

  setUserAwards = (awards, currentUser) => {
    const userAwards = awards.filter(award => {
      if (award.pointAward) {
        return currentUser.points >= award.pointValue;
      } else {
        return currentUser.friendsSaved >= award.numSaved;
      }
    });
    this.setState({ userAwards });
  };

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
    }).reverse().slice(0, 10);

    const awardList = this.state.userAwards.map(award => {
      return (
        <div className="media" key={award.id}>
          <div className="media-left">
            <img className="media-object img-responsive" src={award.icon} alt="..."></img>
          </div>
          <div className="media-body">
            <h4 className="media-heading">{award.name}</h4>
            <p>Points: <span className='badge'>{award.pointValue || 0}</span></p>
            <p>Friends Saved: <span className='badge'>{award.numSaved || 0}</span></p>
          </div>
        </div>
      );
    });

    return (
      <div className='Menu'>
        <Link className='col-xs-4 menu-friends' to={{pathname: '/friends', state: { friends: this.state.friends }}}>
          <h3>Friends</h3>
          {friendNames}
        </Link>
        <div className='col-xs-4'>
          <h2>Menu</h2>
          <Link className='btn btn-primary center-block' to='/game/1'>School Shooting</Link>
          <Link className='btn btn-primary center-block' to='/game/2'>Burning Building</Link>
          <button className='btn btn-danger center-block' onClick={logoutClickEvent}>Logout</button>
          <Link className='center-block' to='/'>Back</Link>
          <h2>Awards</h2>
          {awardList}
        </div>
        <div className='col-xs-4 menu-games'>
          <h3>Games</h3>
          {gameList}
        </div>
      </div>
    );
  };
}

export default Menu;
