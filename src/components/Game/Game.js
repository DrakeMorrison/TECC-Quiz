import React from 'react';
import ReactModal from 'react-modal';

import Query from '../Query/Query';
import Answer from '../Answer/Answer';
import Timer from '../Timer/Timer';
import gameRequests from '../../firebaseRequests/games';
import answerRequests from '../../firebaseRequests/answers';
import questionRequests from '../../firebaseRequests/questions';
import authRequests from '../../firebaseRequests/auth';
import friendRequests from '../../firebaseRequests/friends';
import helpers from '../../helpers';
import gameQuestionsRequests from '../../firebaseRequests/gameQuestions';
import userRequests from '../../firebaseRequests/users';

ReactModal.setAppElement('#root');

class Game extends React.Component {
  state = {
    questions: [],
    answers: [],
    friends: [],
    game: {},
    questionNum: 1, // first question
    questionId: '',
    scenarioId: 0,
    nextQuestionNum: 2,
    startTime: Date.now() + 30000, // 30 seconds to finish game
    gameIsWon: false,
    showModal: false,
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
                this.setState({ questions: friendlyQuestionsAndAnswers.questions });

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
    const reducedTime = (document.getElementById('timer-value').dataset.time * 1) - 10000;
    if (reducedTime > 0 && isLastQuestion) { // last wrong question was not deadly
      this.hero();
    } else {
      const nextTime = Date.now() + reducedTime;
      this.setState({ startTime: nextTime });
    }
  };

  gameOver = () => {
    if (!this.state.gameIsWon) {
      const updatedGame = {...this.state.game};
      updatedGame.isSaved = false;
      updatedGame.finalTime = Date.now();
      gameRequests // put to game collection
        .putRequest(updatedGame.id, updatedGame)
        .then(() => {
          this.setState({ showModal: true });
          this.updateUserSaves(false);
        })
        .catch(console.error.bind(console));
    }
  };

  hero = () => {
    this.setState({ gameIsWon: true }, () => {
      this.setState({ showModal: true });
      this.updateUserSaves(true);
    });
  };

  updateGame = (updatedGameObj) => {
    gameRequests
      .putRequest(updatedGameObj.id, updatedGameObj)
      .catch(console.error.bind(console));
  };

  updateUserPoints = (newUserPoints) => {
    const uid = authRequests.getUid();
    userRequests
      .getRequest()
      .then((users) => {
        const currentUser = users.filter(user => user.id === uid)[0];
        const newUser = {...currentUser};
        currentUser.points = currentUser.points || 0;
        newUser.points = currentUser.points + newUserPoints;
        userRequests.putRequest(newUser.fbKey, newUser);
      })
      .catch(console.error.bind(console));
  };

  updateUserSaves = isSaved => {
    const uid = authRequests.getUid();
    userRequests
      .getRequest()
      .then((users) => {
        const currentUser = users.filter(user => user.id === uid)[0];
        const newUser = {...currentUser};
        if (isSaved) {
          newUser.friendsSaved += 1;
        }
        userRequests.putRequest(newUser.fbKey, newUser);
      })
      .catch(console.error.bind(console));
  };

  nextQuestion = (nextId) => {
    this.setState({ questionId: nextId, nextQuestionNum: this.state.nextQuestionNum + 1});
  };

  checkAnswer = (e) => {
    const updatedGame = {...this.state.game};
    const questionsArray = Object.values(this.state.questions);
    const filteredQuestions = questionsArray.filter(question => question.questionNum === this.state.nextQuestionNum);
    const submittedQuestion = this.state.questions.filter(question => question.id === this.state.questionId)[0];
    // const questionPoints = helpers.getClosestClass(e.target,'Game').children[1].children[1].getAttribute('points') * 1;
    const questionPoints  = submittedQuestion.pointValue;
    const answerCorrect = e.target.dataset.iscorrect === 'true';
    const lastQuestion = filteredQuestions[0] === undefined;
    const gameQuestion = {};
    let pointsToAdd = 0;

    if (answerCorrect && lastQuestion) {
      // update game and fire hero
      updatedGame.isSaved = true;
      updatedGame.finalTime = Date.now();
      updatedGame.points += questionPoints;
      pointsToAdd += questionPoints;

      this.updateGame(updatedGame);
      this.hero();
      gameQuestion.isCorrect = true;
      this.updateUserPoints(pointsToAdd);
    } else if (!answerCorrect && !lastQuestion) {
      // change time and next question
      const nextId = filteredQuestions[0].id;
      this.changeTime(false);
      this.nextQuestion(nextId);
      gameQuestion.isCorrect = false;
    } else if (answerCorrect && !lastQuestion) {
      // update game and next question
      const nextId = filteredQuestions[0].id;
      updatedGame.points += questionPoints;
      pointsToAdd += questionPoints;

      this.updateGame(updatedGame);
      this.nextQuestion(nextId);
      gameQuestion.isCorrect = true;
    } else if (!answerCorrect && lastQuestion) {
      // change time and update game
      updatedGame.finalTime = Date.now();

      this.changeTime(true);
      this.updateGame(updatedGame);
      gameQuestion.isCorrect = false;
      this.updateUserPoints(pointsToAdd);
    }
    // Post to game questions collection
    gameQuestion.isCorrect = answerCorrect;
    gameQuestion.gameId = updatedGame.id;
    gameQuestion.questionId = submittedQuestion.id;
    this.addToGameQuestions(gameQuestion);
  };

  addToGameQuestions = (gameQuestionObj) => {
    gameQuestionsRequests
      .postRequest(gameQuestionObj)
      .catch(console.error.bind(console));
  };

  closeModal = () => {
    this.setState({ showModal: false });
    this.props.history.push('/menu');
  };

  render () {
    return (
      <div className='Game'>
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
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel='Minimal Modal Example'
        >
          <h2>{this.state.gameIsWon ? 'You Saved Your Friend!' : 'Game Over'}</h2>
          <button onClick={this.closeModal}>Close Modal</button>
        </ReactModal>
      </div>
    );
  };
}

export default Game;
