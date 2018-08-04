import React from 'react';
import PropTypes from 'prop-types';

class Answer extends React.Component {
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.object).isRequired,
    checkAnswer: PropTypes.func.isRequired,
    questionId: PropTypes.string.isRequired,
  };

  render () {
    const {answers, checkAnswer, questionId} = this.props;

    const questionAnswers = answers.filter(answer => answer.questionId === questionId * 1);

    const allAnswers = questionAnswers.map((answer) => {
      return (
        <a className='btn btn-primary btn-lg col-sm-3 col-sm-offset-1' key={answer.id} onClick={checkAnswer}>{answer.answerText}</a>
      );
    });

    return (
      <div className='Answer'>
        {allAnswers}
      </div>
    );
  };
}

export default Answer;
