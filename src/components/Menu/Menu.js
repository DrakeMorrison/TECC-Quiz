import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'moment';

import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import gameRequests from '../../firebaseRequests/games';
import awardRequests from '../../firebaseRequests/awards';
import userRequests from '../../firebaseRequests/users';
import './Menu.css';
import helpers from '../../helpers';

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
                    this.setState({ currentUser }, () => {
                      document.getElementById('progress-bar').style.minWidth = '20%';
                      document.getElementById('progress-bar').style.width = helpers.awardProgress(awards, currentUser);
                    });
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

    const sortedGames = this.state.games.sort((a, b) => {
      return b.finalTime - a.finalTime;
    }).slice(0, 5);

    const gameList = sortedGames.map(game => {
      const goodGame = game.isSaved ? 'game btn btn-success' : 'game btn btn-danger';
      return (
        <Link className={goodGame} to={{ pathname: `completegame/${game.id}`, state: { games: this.state.games } }} key={game.id}>
          <p>Finish Time: {Moment(game.finalTime, 'x').fromNow()}</p>
          <p>Points: {game.points}</p>
        </Link>
      );
    });

    const awardList = this.state.userAwards.map(award => {

      const pointsOrFriends = award.pointAward ? (
        <p>You Have Achieved At Least <span className='badge'>{award.pointValue}</span> Points!</p>
      ) : (
        <p>Congratulations! You Have Saved <span className='badge'>{award.numSaved}</span> Of Your Friends!</p>
      );

      return (
        <div className="media well" key={award.id}>
          <div className="media-left">
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
            <span className='h4 stats'>Total Friends Saved: {this.state.currentUser.friendsSaved || 0}</span>
            <span className='h4 stats'>Total Points: {this.state.currentUser.points || 0}</span>

            <div className="progress">
              <div id='progress-bar' className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
                <span className="sr-only">Progress To Next Award</span>
                Next Award
              </div>
            </div>
          </div>

          <Link className='btn btn-primary btn-lg center-block' to='/game/1'>Keep Your Friend Alive During A Shooting</Link>
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
