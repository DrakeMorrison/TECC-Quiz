import React from 'react';

class Answer extends React.Component {
  render () {
    const {answers, checkAnswer, questionId} = this.props;

    const questionAnswers = answers.filter(answer => answer.questionId === questionId * 1);

    const allAnswers = questionAnswers.map((answer) => {
      return (
        <button className='btn btn-default' iscorrect={answer.isCorrect.toString()} key={answer.id} onClick={checkAnswer}>{answer.answerText}</button>
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
