const replaceFriendName = ({questions, answers, friends}) => {
  if (friends[0] !== undefined) {
    const friendlyName = friends[0].name;
    const friendName = friendlyName.charAt(0).toUpperCase() + friendlyName.substring(1);

    const friendlyAnswers = answers.map(answer => {
      const newAnswerText = answer.answerText.replace(/(your friend)/gi, friendName);
      const newAnswerObject = {...answer};
      newAnswerObject.answerText = newAnswerText;
      return newAnswerObject;
    });

    const friendlyQuestions = questions.map(question => {
      const newQuestionText = question.text.replace(/(your friend)/gi, friendName);
      const newQuestionObject = {...question};
      newQuestionObject.text = newQuestionText;
      return newQuestionObject;
    });

    return {
      questions: friendlyQuestions,
      answers: friendlyAnswers,
    };
  } else {
    return {
      questions,
      answers,
    };
  }
};

const getClosestClass = function (elem, selectedClass) {
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.classList.contains(selectedClass)) {
      return elem;
    }
  }
  return null;
};

const formatTime = (timeNumber) => {
  const timeString = timeNumber.toString();
  let formattedTime = timeString;
  if (timeString.length < 5) {
    formattedTime = timeString.slice(0, 1) + '.' + timeString.slice(1,2);
  } else {
    formattedTime = timeString.slice(0, 2) + '.' + timeString.slice(2, 3);
  }
  return formattedTime;
};

const awardProgress = (awards, user) => {
  const filteredAwards = awards.filter(award => {
    if (award.pointAward && award.pointValue > (user.points || 0)) {
      return true;
    }
    return false;
  });

  const sortedAwards = filteredAwards.sort(((a, b) => {
    return a.pointValue - b.pointValue;
  }));

  const nextAward = sortedAwards[0];

  if (nextAward !== undefined) {
    const progressRatio = (user.points / nextAward.pointValue) * 100;

    return progressRatio.toString() + '%';
  } else {
    return '100%';
  }
};

export default { replaceFriendName, getClosestClass, formatTime, awardProgress };
