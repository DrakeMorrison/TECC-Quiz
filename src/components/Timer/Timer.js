import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import MomentCountdown from 'react-moment-countdown';

class Timer extends React.Component {
  static propTypes = {
    gameOver: PropTypes.func.isRequired,
    startTime: PropTypes.number.isRequired,
  };

  render () {
    const {startTime, gameOver} = this.props;
    const dateInFuture = Moment(startTime, 'x');

    return (
      <div className='Timer'>
        {/* <Countdown
          date={startTime}
          intervalDelay={0}
          precision={1}
          renderer={props => <div id='timer-value'>{props.total}</div>}
          onComplete={gameOver}
        >
          <div className='jumbotron'><h2>Game Over</h2></div>
        </Countdown> */}
        <MomentCountdown
          toDate={dateInFuture}
          onCountdownEnd={gameOver}
          targetFormatMask='ss'
        >
        </MomentCountdown>
      </div>
    );
  };
}

export default Timer;
