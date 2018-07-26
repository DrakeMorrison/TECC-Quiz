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
        <button className='btn btn-default' data-iscorrect={answer.isCorrect.toString()} key={answer.id} onClick={checkAnswer}>{answer.answerText}</button>
      );
    });

    return (
      <div className='Answer'>
        <h2>Answer</h2>
        {allAnswers}
      </div>
    );
  };
}

export default Answer;
