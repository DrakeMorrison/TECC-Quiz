import React from 'react';

class Answer extends React.Component {
  render () {
    const {answers, questionId} = this.props;

    const questionAnswers = answers.filter(answer => answer.questionId === questionId * 1);

    const allAnswers = questionAnswers.map((answer) => {
      return (
        <p key={answer.id}>{answer.answerText}</p>
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
