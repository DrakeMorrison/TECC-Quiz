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

export default { replaceFriendName, getClosestClass };
