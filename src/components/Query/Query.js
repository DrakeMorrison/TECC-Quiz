import React from 'react';
import PropTypes from 'prop-types';

class Query extends React.Component {
  static propTypes = {
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
    questionId: PropTypes.string.isRequired,
  };

  render () {
    const { questions, questionId } = this.props;

    const query = questions.filter(question => question.id === questionId)
      .map(question => {
        return (
          <p key={question.id} points={question.pointValue * 1}>{question.text}</p>
        );
      });

    return (
      <div className='Query'>
        <h2>Query</h2>
        {query}
      </div>
    );
  };
}

export default Query;
