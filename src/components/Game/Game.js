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
        <Query
          friends={this.state.friends}
          questions={this.state.questions}
        />
        <Answer
          answers={this.state.answers}
        />
        <Timer />
      </div>
    );
  };
}

export default Game;
