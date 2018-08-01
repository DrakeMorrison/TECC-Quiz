import React from 'react';
import { Link } from 'react-router-dom';

import friendRequests from '../../firebaseRequests/friends';
import authRequests from '../../firebaseRequests/auth';
import './Friends.css';

class Friends extends React.Component {
  state = this.props.location.state;

  deleteFriend = (e) => {
    const friendId = e.target.parentNode.dataset.id;
    friendRequests
      .deleteRequest(friendId)
      .then(() => {
        const newFriends = this.state.friends.filter(friend => friend.id !== friendId);
        this.setState({friends: newFriends});
      })
      .catch(console.error.bind(console));
  };

  addFriend = (e) => {
    const friend = {};
    friend.uid = authRequests.getUid();
    friend.name = e.target.parentNode.parentNode.children[0].value;
    friendRequests
      .postRequest(friend)
      .then((res) => {
        friend.id = res.data.name;
        const newState = {...this.state};
        newState.friends.push(friend);
        this.setState({ newState });
      })
      .catch(console.error.bind(console));
  };

  render () {
    const friendNames = this.state.friends.map(friend => {
      return (
        <div key={friend.id} data-id={friend.id} className='well well-sm'>
          <h4>{friend.name}</h4>
          <button className='btn btn-danger' onClick={this.deleteFriend}>Delete</button>
        </div>
      );
    }).reverse();
    return (
      <div className='Friends'>
        <div className='container'>
          <h2>My Friends</h2>

          <div className="input-group col-xs-12 col-sm-6 col-sm-offset-3">
            <input type="text" className="form-control" placeholder="New Friend Name" />
            <span className="input-group-btn">
              <button className="btn btn-success" type="button" onClick={this.addFriend}>Add Friend</button>
            </span>
          </div>
          <div className='col-xs-12 col-sm-6 col-sm-offset-3'>
            {friendNames}
          </div>
          <Link to='/menu'>Back to Menu</Link>
        </div>
      </div>
    );
  };
}

export default Friends;
