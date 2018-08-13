import React from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown-now';

import helper from '../../helpers';

class Timer extends React.Component {
  static propTypes = {
    gameOver: PropTypes.func.isRequired,
    startTime: PropTypes.number.isRequired,
  };

  render () {
    const {startTime, gameOver} = this.props;

    return (
      <div className='Timer'>
        <Countdown
          date={startTime}
          intervalDelay={0}
          precision={1}
          renderer={props => <div id='timer-value' className='h1' data-time={props.total}>{helper.formatTime(props.total)}</div>}
          onComplete={gameOver}
        >
          <div className='jumbotron'><h2>Game Over</h2></div>
        </Countdown>
      </div>
    );
  };
}

export default Timer;
