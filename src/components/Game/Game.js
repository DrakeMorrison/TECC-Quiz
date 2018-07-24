import React from 'react';

import Query from '../Query/Query';
import Answer from '../Answer/Answer';
import Timer from '../Timer/Timer';
import gameRequests from '../../firebaseRequests/games';
import answerRequests from '../../firebaseRequests/answers';
import questionRequests from '../../firebaseRequests/questions';
import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import helpers from '../../helpers';

class Game extends React.Component {
  state = {
    questions: [],
    answers: [],
    friends: [],
    game: {},
    questionNum: 1,
    questionId: '',
    scenarioId: 0,
    nextQuestionNum: 2,
    startTime: Date.now() + 30000,
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
                const friendlyQuestionsAndAnswers = helpers.replaceFriendName({ questions, answers, friends });
                this.setState({ answers: friendlyQuestionsAndAnswers.answers });
                this.setState({ friends: friendlyQuestionsAndAnswers.friends });

                gameRequests
                  .postRequest(newGameObj)
                  .then((res) => {

                    newGameObj.id = res.data.name;
                    this.setState({ game: newGameObj});
                  });
              });
          });
      })
      .catch(console.error.bind(console));
  }

  changeTime = (isLastQuestion) => { // reduce time left by 10 seconds on a wrong click
    const reducedTime = (document.getElementById('timer-value').innerText * 1) - 10000;
    if (reducedTime > 0 && isLastQuestion) { // last wrong question was not deadly
      this.hero();
    } else {
      const nextTime = Date.now() + reducedTime;
      this.setState({ startTime: nextTime });
    }
  };

  gameOver = () => {
    const updatedGame = {...this.state.game};
    updatedGame.isSaved = false;
    updatedGame.finalTime = Date.now();
    gameRequests // put to game collection
      .putRequest(updatedGame.id, updatedGame)
      .then(() => {
        // TODO: decide if user should be redirected to menu or review page
        alert('game over');
      })
      .catch(console.error.bind(console));
  };

  hero = () => {
    alert('you saved your friend');
  };

  updateGame = (updatedGameObj) => {
    gameRequests
      .putRequest(updatedGameObj.id, updatedGameObj)
      .catch(console.error.bind(console));
  };

  nextQuestion = (nextId) => {
    this.setState({ questionId: nextId, nextQuestionNum: this.state.nextQuestionNum + 1});
  };

  checkAnswer = (e) => {
    const updatedGame = {...this.state.game};
    const questionsArray = Object.values(this.state.questions);
    const filteredQuestions = questionsArray.filter(question => question.questionNum === this.state.nextQuestionNum);
    const questionPoints = helpers.getClosestClass(e.target,'Game').children[1].children[1].getAttribute('points') * 1;
    const answerCorrect = e.target.dataset.iscorrect === 'true';
    const lastQuestion = filteredQuestions[0] === undefined;

    if (answerCorrect && lastQuestion) {
      // update game and fire hero
      updatedGame.isSaved = true;
      updatedGame.finalTime = Date.now();
      updatedGame.points += questionPoints;

      this.updateGame(updatedGame);
      this.hero();
    } else if (!answerCorrect && !lastQuestion) {
      // change time and next question
      const nextId = filteredQuestions[0].id;
      this.changeTime(false);
      this.nextQuestion(nextId);
    } else if (answerCorrect && !lastQuestion) {
      // update game and next question
      const nextId = filteredQuestions[0].id;
      updatedGame.points += questionPoints;

      this.updateGame(updatedGame);
      this.nextQuestion(nextId);
    } else if (!answerCorrect && lastQuestion) {
      // change time and update game
      updatedGame.finalTime = Date.now();

      this.changeTime(true);
      this.updateGame(updatedGame);
    }
    // TODO: post to game questions

  };

  render () {
    return (
      <div className='Game'>
        <h2>Game</h2>
        <Query
          className='col-xs-9'
          questions={this.state.questions}
          questionId={this.state.questionId}
        />
        <Timer
          className='col-xs-3'
          gameOver={this.gameOver}
          startTime={this.state.startTime}
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
