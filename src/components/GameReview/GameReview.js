import React from 'react';

import gameQuestionsRequests from '../../firebaseRequests/gameQuestions';
import questionRequests from '../../firebaseRequests/questions';

class GameReview extends React.Component {
  state = {
    games: [],
    gameQuestions: [],
    currentGameId: '',
    currentGame: {},
    matchingGameQuestions: [],
  };

  componentDidMount () {
    this.setState({ currentGameId: this.props.match.params.id });
    const allQuestions = [];

    gameQuestionsRequests
      .getByGameIdRequest(this.state.currentGameId)
      .then((data) => {
        data.forEach(gameQuestion => {
          questionRequests
            .getById(gameQuestion.questionId)
            .then((res) => {
              allQuestions.push(res);
              this.setState({ matchingGameQuestions: allQuestions });
            });
        });
        const currentGame = this.props.location.state.games.filter(game => game.id === this.state.currentGameId)[0];
        this.setState({ currentGame });
      })
      .catch(console.error.bind(console));
  }

  render () {
    const questionList = this.state.matchingGameQuestions.map(question => {
      return (
        <li key={question.id}>Question {question.questionNum}: {question.text}</li>
      );
    });

    return (
      <div className='GameReview'>
        <h2>GameReview</h2>
        <p>Id: {this.state.currentGame.id}</p>
        <p>Points: {this.state.currentGame.points}</p>
        <ul>
          {questionList}
        </ul>
      </div>
    );
  };
}

export default GameReview;
