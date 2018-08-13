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
        <div key={question.id} className='col-sm-4'>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Question {question.questionNum}</h3>
            </div>
            <div className="panel-body">
              {question.text}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='GameReview'>
        <h2>GameReview</h2>
        <Link to='/menu'>Back to Menu</Link>
        <p>Points: {this.state.currentGame.points}</p>
        <p>Creation Time: {Moment(this.state.currentGame.creationTime, 'x').fromNow()}</p>
        {questionList}
      </div>
    );
  };
}

export default GameReview;
