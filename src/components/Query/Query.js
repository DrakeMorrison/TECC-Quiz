import React from 'react';
// import PropTypes from 'prop-types';

class Query extends React.Component {
  render () {
    const {friends, questions} = this.props;// Needs question Number to tell which question to display;
    return (
      <div className='Query'>
        <h2>Query</h2>
      </div>
    );
  };
}

export default Query;
