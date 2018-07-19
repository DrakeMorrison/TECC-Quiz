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
    friendlyQuery: '',
    questionId: '',
  };

  componentDidMount () {
    const scenarioId = this.props.match.params.scenario * 1;
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
                const correctQuestionArray = questions.filter(question => question.questionNum === this.state.questionNum && question.scenarioId === scenarioId);
                const questionId = correctQuestionArray[0].id;
                const correctQuery = correctQuestionArray[0].text;
                const friendlyQuery = correctQuery.replace(/(your friend)/i, this.state.friends[0].name);
                this.setState({ friendlyQuery, questionId });
                gameRequests
                  .postRequest(newGameObj);
              });
          });
      })
      .catch(console.error.bind(console));
  }

  changeTime = () => {};
  gameOver = () => {};
  checkAnswer = (check) => {
    if (check === true) {
      // correct answer
      this.setState({ questionNum: this.state.questionNum + 1});
    } else {
      // wrong answer
      // subtract 10 seconds from timer
    }
  };

  render () {
    return (
      <div className='Game'>
        <h2>Game</h2>
        <Timer className='col-xs-12'/>
        <Query
          className='col-xs-12'
          query={this.state.friendlyQuery}
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
