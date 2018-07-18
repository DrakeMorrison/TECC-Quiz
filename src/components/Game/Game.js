import React from 'react';

import Query from '../Query/Query';
import Answer from '../Answer/Answer';
import Timer from '../Timer/Timer';
// import gameRequests from '../../firebaseRequests/games';
import answerRequests from '../../firebaseRequests/answers';
import questionRequests from '../../firebaseRequests/questions';
import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';

class Game extends React.Component {
  state = {
    questions: [],
    answers: [],
    friends: [],
  };

  componentDidMount () {
    const scenarioId = this.props.match.params.scenario;
    const uid = authRequests.getUid();

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
              });
          });
      })
      .catch();
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
          friends={this.state.friends}
          questions={this.state.questions}
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
