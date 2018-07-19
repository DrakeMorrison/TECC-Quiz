import React from 'react';

import Query from '../Query/Query';
import Answer from '../Answer/Answer';
import Timer from '../Timer/Timer';
import gameRequests from '../../firebaseRequests/games';
import answerRequests from '../../firebaseRequests/answers';
import questionRequests from '../../firebaseRequests/questions';
import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';

class Game extends React.Component {
  state = {
    questions: [],
    answers: [],
    friends: [],
    questionNum: 1,
    correctQuery: '',
  };

  componentDidMount () {
    const scenarioId = this.props.match.params.scenario;
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

        this.setState({ questions });
        answerRequests
          .getRequest()
          .then(answers => {

            this.setState({ answers });
            friendRequests
              .getByUidRequest(uid)
              .then(friends => {

                this.setState({ friends });
                const correctQuestionArray = questions.filter(question => question.questionNum === this.state.questionNum);
                const correctQuery = correctQuestionArray[0].text;
                this.setState({ correctQuery });
                gameRequests
                  .postRequest(newGameObj);
              });
          });
      })
      .catch(console.error.bind(console));
  }

  changeTime = () => {};
  gameOver = () => {};
  checkAnswer = () => {};

  render () {
    return (
      <div className='Game'>
        <h2>Game</h2>
        <Timer className='col-xs-12'/>
        <Query
          className='col-xs-12'
          query={this.state.correctQuery}
        />
        <Answer
          className='col-xs-12'
          answers={this.state.answers}
          checkAnswer={this.checkAnswer}
        />

      </div>
    );
  };
}

export default Game;
