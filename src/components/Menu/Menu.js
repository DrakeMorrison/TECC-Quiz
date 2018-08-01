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
    currentUser: {},
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
                    this.setState({ currentUser });
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
        <blockquote key={friend.id}>
          <p>{friend.name}</p>
        </blockquote>
      );
    });

    const gameList = this.state.games.map(game => {
      const goodGame = game.isSaved ? 'game btn btn-success' : 'game btn btn-danger';
      return (
        <Link className={goodGame} to={{ pathname: `completegame/${game.id}`, state: { games: this.state.games } }} key={game.id}>
          <p>Creation Time: {game.creationTime}</p>
          {/* TODO: import MomentJS for gameTime */}
          <p>Points: {game.points}</p>
        </Link>
      );
    }).reverse().slice(0, 5);

    const awardList = this.state.userAwards.map(award => {

      const pointsOrFriends = award.pointAward ? (
        <p>You Have Achieved At Least <span className='badge'>{award.pointValue}</span> Points!</p>
      ) : (
        <p>Congratulations! You Have Saved <span className='badge'>{award.numSaved}</span> Of Your Friends!</p>
      );

      return (
        <div className="media well" key={award.id}>
          <div className="media-left">
            <img className="media-object img-responsive" src={award.icon} alt="..."></img>
          </div>
          <div className="media-body">
            <h4 className="media-heading">{award.name}</h4>
            {pointsOrFriends}
          </div>
        </div>
      );
    });

    return (
      <div className='Menu'>
        <Link className='col-xs-4 menu-friends' to={{pathname: '/friends', state: { friends: this.state.friends }}}>
          <h3 className='linkHeader'>Friends</h3>
          {friendNames}
        </Link>
        <div className='col-xs-4'>
          <div className='stats'>
            <span className='h4 stats'>Total Friends Saved: {this.state.currentUser.friendsSaved}</span>
            <span className='h4 stats'>Total Points: {this.state.currentUser.points}</span>
            {/* Progress Bar */}
          </div>

          <Link className='btn btn-primary center-block' to='/game/1'>Keep Your Friend Alive During A Shooting</Link>
          <Link className='btn btn-primary center-block hidden' to='/game/2'>Burning Building</Link>
          <button className='btn btn-danger center-block' onClick={logoutClickEvent}>Logout</button>
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
