const replaceFriendName = ({questions, answers, friends}) => {
  if (friends[0] !== undefined) {
    const friendName = friends[0].name;

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
  console.error(timeNumber);
  if (timeString.length < 5) {
    formattedTime = timeString.slice(0, 1) + '.' + timeString.slice(1,2);
  } else {
    formattedTime = timeString.slice(0, 2) + '.' + timeString.slice(2, 3);
  }
  return formattedTime;
};

export default { replaceFriendName, getClosestClass, formatTime };
