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
    const allQuestions = [];
    this.setState({ currentGameId: this.props.match.params.id }, () => {
      gameQuestionsRequests
        .getByGameIdRequest(this.state.currentGameId)
        .then((data) => {
          data.forEach(gameQuestion => {
            questionRequests
              .getRequest()
              .then((res) => {
                console.error(res); // TODO: wip
                allQuestions.push(res);
                this.setState({ matchingGameQuestions: allQuestions });
              });
          });
          const currentGame = this.props.location.state.games.filter(game => game.id === this.state.currentGameId)[0];
          this.setState({ currentGame });
        })
        .catch(console.error.bind(console));
    });
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
