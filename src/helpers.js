const replaceFriendName = ({questions, answers, friends}) => {
  const friendlyAnswers = answers;
  const friendlyQuestions = questions;
  return {
    questions: friendlyQuestions,
    answers: friendlyAnswers,
  };
};

export default replaceFriendName;
