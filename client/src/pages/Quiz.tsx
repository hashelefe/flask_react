import React, { useState, useEffect } from 'react';
import { Question, User } from '../types';
import httpClient from '../httpClient';

const QuizComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFetched, setIsFetched] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("//localhost:5000/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  const base_url = "http://localhost:5000/";

  const fetch_questions = async () => {
    try {
      const response = await httpClient.get(base_url + '/api/questions/1');
      const jsonData = await response.data; // Parse JSON data
      const processedQuestions = jsonData.map((question: any) => {
        const answersList = question.answers.split(',');
        return { ...question, answers: answersList };
      });
      setQuestions(processedQuestions);
      setIsFetched(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const submitQuiz = async () => {
    // Check if an answer is selected
    if (selectedAnswer === null) {
      alert('Please select an answer before submitting.');
      return;
    }

    // Calculate score based on correct answers
    const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedAnswer;
    setCorrectAnswers(correctAnswers + (isCorrect ? 1 : 0)); // Update score only if correct

    // Set game over state
    setGameOver(true);
    console.log(user?.email, correctAnswers)
    try {
      const resp = await httpClient.post(base_url+"/api/add_score", {
          user: user?.name,
          quiz_id: 3,
          score: correctAnswers
      })

    } catch(err: any) {
      console.log(err)
    }
    finally {
    // Reset selected answer for next quiz
    setSelectedAnswer(null);
    }
  };

  const handleNextQuestion = () => {
    // Check if answer is selected
    if (selectedAnswer === null) {
      alert('Please select an answer before moving on.');
      return;
    }

    // Check if current question is the last one
    if (currentQuestionIndex === questions.length - 1) {
      submitQuiz();
      return;
    }

    // Update score based on current answer (optional for immediate feedback)
    const isCorrect = questions[currentQuestionIndex].correctAnswer === selectedAnswer;
    setCorrectAnswers(correctAnswers + (isCorrect ? 1 : 0)); // Update score only if correct

    // Update current question index and reset selected answer
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
  };

  return (
    <div className='flex flex-col w-3/4 m-auto justify-center text-center mt-5 p-5'>
      {!user && <h1 className='font-bold text-lg p-4'>Aby wziąć udział w quizie, najpierw musisz sie zalogować!</h1>}
      {user && !isFetched &&
      <div className="">
        <h1 className='font-bold text-lg p-4'>Witam w quizie o AI!</h1>
        
        <button
          className='bg-[#318822] text-white p-3 rounded-md w-1/2 m-auto'
          onClick={fetch_questions}
          disabled={isFetched} // Disable button after fetching
        >
          Start quiz!
        </button> 
      </div>}
      {isFetched && (
        <div>
          {gameOver ? (
            <div>
              <h2 className='font-bold text-lg p-4'>Koniec quizu!</h2>
              <p>Twój wynik to: {correctAnswers} / {questions.length}</p>
            </div>
          ) : (
            <div className="flex flex-col justify-center">
              <h1 className='font-bold text-lg p-4'>{questions[currentQuestionIndex].question}</h1>
              <p>
                {questions[currentQuestionIndex].answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`p-5 font-bold border-2 border-indigo-500 rounded m-3 ${index === selectedAnswer ? 'bg-[#318822] text-white' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null} // Disable buttons after answer selection
                  >
                    {answer}
                  </button>
                ))}
              </p>
              <div className="flex justify-evenly mt-5">
                <button
                  className="bg-[#318822] text-white p-3 rounded-md"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null} // Disable button until answer selected
                >
                  Nastepne pytanie
                </button>
                <button
                  className="bg-gray-400 text-white p-3 rounded-md"
                  onClick={submitQuiz}
                >
                  Zakończ quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
