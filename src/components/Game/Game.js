import React from 'react';

import Query from '../Query/Query';
import Answer from '../Answer/Answer';
import Timer from '../Timer/Timer';
import gameRequests from '../../firebaseRequests/games';
import answerRequests from '../../firebaseRequests/answers';
import questionRequests from '../../firebaseRequests/questions';
import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import replaceFriendName from '../../helpers';

class Game extends React.Component {
  state = {
    questions: [],
    answers: [],
    friends: [],
    questionNum: 1,
    // friendlyQuery: '',
    questionId: '',
    scenarioId: 0,
    nextQuestionNum: 2,
  };

  componentDidMount () {
    const scenarioId = this.props.match.params.scenario * 1;
    this.setState({ scenarioId });
    const uid = authRequests.getUid();
    const newGameObj = {
      creationTime: Date.now(),
      finalTime: 0,
      isSaved: false,
      points: 0,
      scenarioId: scenarioId,
      uid: uid,
    };

    questionRequests
      .getByScenarioRequest(scenarioId)
      .then((questions) => {

        answerRequests
          .getRequest()
          .then(answers => {

            friendRequests
              .getByUidRequest(uid)
              .then(friends => {

                const firstQuestionArray = questions.filter(question => question.questionNum === this.state.questionNum && question.scenarioId === scenarioId);
                const questionId = firstQuestionArray[0].id;
                this.setState({ questionId });
                this.setState({ questions });
                const friendlyQuestionsAndAnswers = replaceFriendName({ questions, answers, friends });
                this.setState({ answers: friendlyQuestionsAndAnswers.answers });
                this.setState({ friends: friendlyQuestionsAndAnswers.friends });

                gameRequests
                  .postRequest(newGameObj);
              });
          });
      })
      .catch(console.error.bind(console));
  }

  changeTime = () => {};

  gameOver = () => {
    alert('game over');
  };

  checkAnswer = (e) => {
    if (e.target.dataset.iscorrect === 'true') {
      // correct answer

    } else {
      // wrong answer
      // subtract 10 seconds from timer
    }
    const questionsArray = Object.values(this.state.questions);

    const filteredQuestions = questionsArray.filter(question => question.questionNum === this.state.nextQuestionNum);
    if (filteredQuestions[0] === undefined) {
      this.gameOver();
    } else {
      const nextId = filteredQuestions[0].id;
      this.setState({ questionId: nextId, nextQuestionNum: this.state.nextQuestionNum + 1});
      // post to gameQuestions
    }
  };

  render () {
    return (
      <div className='Game'>
        <h2>Game</h2>
        <Timer className='col-xs-12'/>
        <Query
          className='col-xs-12'
          questions={this.state.questions}
          questionId={this.state.questionId}
        />
        <Answer
          className='col-xs-12'
          answers={this.state.answers}
          checkAnswer={this.checkAnswer}
          questionId={this.state.questionId}
        />
      </div>
    );
  };
}

export default Game;
