import React from 'react';
import { Link } from 'react-router-dom';

import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import userRequests from '../../firebaseRequests/users';

import './Register.css';

class Register extends React.Component {
  state = {
    user: {
      email: '',
      password: '',
      friendName: '',
    },
  };

  registerClickEvent = e => {
    const user = {};
    user.email = this.state.user.email;
    user.password = this.state.user.password;

    e.preventDefault();
    authRequests
      .registerUser(user)
      .then(() => {
        const friend = {};
        friend.uid = authRequests.getUid();
        friend.name = this.state.user.friendName;

        friendRequests
          .postRequest(friend)
          .then(() => {
            userRequests
              .postRequest({
                id: authRequests.getUid(),
                friendsSaved: 0,
              })
              .then(() => {
                this.props.history.push('/menu');
              });
          });
      })
      .catch(console.error.bind(console));
  };

  emailChange = e => {
    const tempUser = { ...this.state.user };
    tempUser.email = e.target.value;
    this.setState({ user: tempUser });
  };

  passwordChange = e => {
    const tempUser = { ...this.state.user };
    tempUser.password = e.target.value;
    this.setState({ user: tempUser });
  };

  friendNameChange = e => {
    const tempUser = { ...this.state.user };
    tempUser.friendName = e.target.value;
    this.setState({ user: tempUser });
  };

  render () {
    const { user } = this.state;
    return (
      <div className="Register">
        <div id="login-form">
          <h1 className="text-center">Register</h1>
          <form className="form-horizontal col-sm-6 col-sm-offset-3">
            <div className="form-group">
              <label htmlFor="inputEmail" className="col-sm-4 control-label">
                Email:
              </label>
              <div className="col-sm-8">
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  placeholder="Email"
                  value={user.email}
                  onChange={this.emailChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword" className="col-sm-4 control-label">
                Password:
              </label>
              <div className="col-sm-8">
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword"
                  placeholder="Password"
                  value={user.password}
                  onChange={this.passwordChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputFriendName" className="col-sm-4 control-label">
                Best Friend's Name:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="inputFriendName"
                  placeholder="John"
                  value={user.friendName}
                  onChange={this.friendNameChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-12 text-center">
                <Link to="/login">Need to Login?</Link>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-12">
                <button
                  type="submit"
                  className="btn btn-default col-xs-12"
                  onClick={this.registerClickEvent}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
