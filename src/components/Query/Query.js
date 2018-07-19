import React from 'react';
// import PropTypes from 'prop-types';

class Query extends React.Component {

  render () {
    const { query } = this.props;
    // correctQuestion[0].text.replace(/friend/i, friends[0].name);

    return (
      <div className='Query'>
        <h2>Query</h2>
        <p>{query}</p>
      </div>
    );
  };
}

export default Query;
