const replaceFriendName = ({questions, answers, friends}) => {
  const friendlyAnswers = answers;
  const friendlyQuestions = questions;
  return {
    questions: friendlyQuestions,
    answers: friendlyAnswers,
  };
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
