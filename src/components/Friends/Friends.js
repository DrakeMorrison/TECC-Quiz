import React from 'react';

import friendRequests from '../../firebaseRequests/friends';

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

  render () {
    const friendNames = this.state.friends.map(friend => {
      return (
        <p key={friend.id} data-id={friend.id}>{friend.name}
          <button className='btn btn-danger' onClick={this.deleteFriend}>Delete</button>
        </p>
      );
    });
    return (
      <div className='Friends'>
        <h2>My Friends</h2>
        {friendNames}
      </div>
    );
  };
}

export default Friends;
