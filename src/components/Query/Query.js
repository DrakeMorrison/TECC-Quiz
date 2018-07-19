import React from 'react';
// import PropTypes from 'prop-types';

class Query extends React.Component {

  render () {
    const { questions, questionId } = this.props;
    const query = questions.filter(question => question.id === questionId)
      .map(question => {
        return (
          <p key={question.id}>{question.text}</p>
        );
      });
    // correctQuestion[0].text.replace(/friend/i, friends[0].name);

    return (
      <div className='Query'>
        <h2>Query</h2>
        {query}
      </div>
    );
  };
}

export default Query;
