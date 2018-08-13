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
        <div className="panel panel-default col-sm-4"
          key={answer.id}
          onClick={checkAnswer}
          data-iscorrect={answer.isCorrect}
        >
          <div className="panel-body">
            {answer.answerText}
          </div>
        </div>
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
