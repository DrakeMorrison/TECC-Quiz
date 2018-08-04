import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'moment';

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
              .getById(gameQuestion.questionId)
              .then((res) => {
                res.id = gameQuestion.questionId;
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
        <li className='list-group-item' key={question.id}>
          Question {question.questionNum}: {question.text}</li>
      );
    });

    return (
      <div className='GameReview'>
        <h2>GameReview</h2>
        <Link to='/menu'>Back to Menu</Link>
        <p>Points: {this.state.currentGame.points}</p>
        <p>Creation Time: {Moment(this.state.currentGame.creationTime, 'x').fromNow()}</p>
        <ul className='list-group'>
          {questionList}
        </ul>
      </div>
    );
  };
}

export default GameReview;
