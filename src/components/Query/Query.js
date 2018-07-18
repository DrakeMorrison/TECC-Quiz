import React from 'react';
// import PropTypes from 'prop-types';

class Query extends React.Component {
  render () {
    const {friends, questions, questionNum} = this.props;

    const currentQuestion = questions[questionNum];

    return (
      <div className='Query'>
        <h2>Query</h2>
        {/* {currentQuestion} */}
      </div>
    );
  };
}

export default Query;
