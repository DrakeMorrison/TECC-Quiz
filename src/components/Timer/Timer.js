import React from 'react';

import Countdown from 'react-countdown-now';

class Timer extends React.Component {
  render () {
    const {startTime, gameOver} = this.props;

    return (
      <div className='Timer'>
        <Countdown
          date={startTime}
          intervalDelay={0}
          precision={1}
          renderer={props => <div id='timer-value'>{props.total}</div>}
          onComplete={gameOver}
        >
          <div className='jumbotron'><h2>Game Over</h2></div>
        </Countdown>
      </div>
    );
  };
}

export default Timer;
