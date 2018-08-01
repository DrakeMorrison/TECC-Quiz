import React, { Component } from 'react';
import {Route, BrowserRouter, Redirect, Switch}  from 'react-router-dom';
import Firebase from 'firebase';

import './App.css';
import Friends from '../components/Friends/Friends';
import Game from '../components/Game/Game';
import GameReview from '../components/GameReview/GameReview';
import Home from '../components/Home/Home';
import Login from '../components/Login/Login';
import Menu from '../components/Menu/Menu';
import Register from '../components/Register/Register';
import FirebaseConnection from '../firebaseRequests/connection';
FirebaseConnection();

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};

const PrivateRoute = ({component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          renderMergedProps(component, props, rest)
        ) : (
          <Redirect
            to={{ pathname: '/login', state: {from: props.location}}}
          />
        )
      }
    />
  );
};

const PublicRoute = ({component, authed, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          renderMergedProps(component, props, rest)
        ) : (
          <Redirect
            to={{ pathname: '/menu', state: {from: props.location}}}
          />
        )
      }
    />
  );
};

class App extends Component {
  state = {
    authed: false,
  };

  componentDidMount () {
    this.removeListener = Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({authed: true});
      } else {
        this.setState({authed: false});
      }
    });
  }

  componentWillUnmount () {
    this.removeListener();
  }

  runAway = () => {
    this.setState({authed: false});
  }

  render () {
    return (
      <div className="App">
        <BrowserRouter>
          <div className='container'>
            <div className='row'>
              <Switch>
                <Route
                  path='/'
                  exact
                  component={Home}
                />
                <PublicRoute
                  path='/register'
                  authed={this.state.authed}
                  component={Register}
                />
                <PublicRoute
                  path='/login'
                  authed={this.state.authed}
                  component={Login}
                />
                <PrivateRoute
                  path='/menu'
                  authed={this.state.authed}
                  component={Menu}
                  runAway={this.runAway}
                />
                <PrivateRoute
                  path='/game/:scenario'
                  authed={this.state.authed}
                  component={Game}
                />
                <PrivateRoute
                  path='/completegame/:id'
                  authed={this.state.authed}
                  component={GameReview}
                />
                <PrivateRoute
                  path='/friends'
                  authed={this.state.authed}
                  component={Friends}
                />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
