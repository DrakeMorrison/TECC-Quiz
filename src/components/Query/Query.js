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
          <h3 key={question.id} points={question.pointValue * 1}>{question.text}</h3>
        );
      });

    return (
      <div className='Query'>
        <div className='page-header'>
          {query}
        </div>
      </div>
    );
  };
}

export default Query;
