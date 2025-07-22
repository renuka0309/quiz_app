import React, { useState, useRef } from "react";
import './App.css';

export default function QuizApp() {
  const questions = [
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What color is the sky?", answer: "blue" },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answersList, setAnswersList] = useState([]);
  const [aboutText, setAboutText] = useState("");


  function createAttemptLimiter(maxAttempts) {
    let attempts = maxAttempts;

    return function () {
      if (attempts > 1) {
        attempts--;
        return attempts;
      } else {
        attempts = 0;
        return 0;
      }
    };
  }

  const limitRef = useRef(createAttemptLimiter(3));

  const handleSubmit = () => {
    if (
      userAnswer.trim().toLowerCase() ===
      questions[currentQuestion].answer.toLowerCase()
    ) {
      setResult("✅ Correct!");
      setScore((prev) => prev + 1); // increment score
      setDisabled(true);
    } else {
      const remaining = limitRef.current();
      if (remaining > 0) {
        setResult(`❌ Wrong. ${remaining} attempts left.`);
      } else {
        setResult("❌ No more attempts left!");
        setDisabled(true);
      }
    }
  };

 const handleNextQuestion = () => {
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion((prev) => prev + 1);
    setUserAnswer("");
    setResult("");
    setDisabled(false);
    limitRef.current = createAttemptLimiter(3); // reset attempts
  } else {
    setResult(`🎉 Quiz Finished! Final Score: ${score}`);
    setDisabled(true);
    setQuizFinished(true); // ✅ mark quiz as finished
  }
};

function showAnswers() {
  const allAnswers = questions.map((q, idx) => `Q${idx + 1}: ${q.answer}`);
  setAnswersList(allAnswers);
}



  
  return (
   
    <div>
      <h2>Quiz App</h2>
      <p>Score: {score}</p>
      <p>Question: {questions[currentQuestion].question}</p>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={disabled}
      />
      <button onClick={handleSubmit} disabled={disabled}>
        Submit
      </button>

      <p>{result}</p>

      {disabled && currentQuestion < questions.length && (
        <button onClick={handleNextQuestion}>Next Question</button>
      )}

      <button onClick={showAnswers} disabled={!quizFinished}>
  Show Answers
</button>



 {answersList.map((ans, idx) => (
    <p key={idx}>{ans}</p>
  ))}

    </div>
  );
}
