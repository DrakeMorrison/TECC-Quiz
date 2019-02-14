import React from 'react';
import {Link} from 'react-router-dom';

class Home extends React.Component {
  render () {
    return (
      <div className='Home'>
        <div className="jumbotron">
          <h1>Friend Savior</h1>
          <p>Save your friends in this exciting game with your quick decision-making!</p>
          <p><Link className='btn btn-lg btn-primary' to='/login'>Login</Link></p>
          <p>Or</p>
          <p><Link to='/register' className='btn btn-lg btn-success'>Register</Link></p>
        </div>
      </div>
    );
  };
}

export default Home;
