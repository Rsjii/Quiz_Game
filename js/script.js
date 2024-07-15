// Constants and Variables for Quiz
const quizData = [];
let currentQuestionIndex = 0;
let points = 0;
let timer;
const timeLimit = 20;
let quizOver = false;

// DOM Elements
const questionBox = document.getElementById("questionBox");
const options = document.querySelectorAll("input[name='option']");
const submitButton = document.getElementById("submit");
const resetButton = document.getElementById("reset");
const timerElement = document.getElementById("time");
const pointsElement = document.getElementById("points-count");
const topicSelection = document.getElementById("front-page");
const quizSection = document.getElementById("quiz");
const startGameButton = document.getElementById("start-game");
const topicSelect = document.getElementById("topic");
const loadingAnimation = document.getElementById("loading-animation");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const backButton = document.getElementById("back-button"); 



const difficultySelect = document.getElementById("difficulty");

// Event listener for start game button
startGameButton.addEventListener("click", () => {
    const selectedTopic = topicSelect.value;
    const selectedDifficulty = difficultySelect.value; 
    toggleLoadingAnimation(true);
    fetchQuestions(selectedTopic, selectedDifficulty); 
    topicSelection.style.display = "none"; 
});

// Event listener for back button
backButton.addEventListener("click", () => {
    quizOver = false;
    currentQuestionIndex = 0;
    points = 0;
    pointsElement.textContent = points;
    quizSection.style.display = "none"; 
    topicSelection.style.display = "flex"; 
});

function fetchQuestions(topic, difficulty) {
    fetch(`https://opentdb.com/api.php?amount=1&category=${topic}&difficulty=${difficulty}&type=multiple`)
        .then(response => response.json())
        .then(data => {
            const question = data.results[0];
            quizData.push({
                question: question.question,
                answers: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
                correct_answer: question.correct_answer
            });
            toggleLoadingAnimation(false); 
            loadNextQuestion();
        })
        .catch(error => {
            toggleLoadingAnimation(false);
            console.error("Failed to fetch questions:", error);
            alert("Failed to fetch questions. Please try again later.");
        });
}

// Event listener for submit button
submitButton.addEventListener("click", () => {
    if (quizOver) return;

    const selectedOption = document.querySelector("input[name='option']:checked");
    if (selectedOption) {
        const answer = selectedOption.value;
        const correctAnswer = quizData[currentQuestionIndex].correct_answer;

        if (answer === correctAnswer) {
            points++;
            pointsElement.textContent = points;
        } else {
            highlightAnswers(answer, correctAnswer);
            endQuiz();
            return; 
        }

        clearInterval(timer);
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadNextQuestion();
        } else {
            fetchQuestions(topicSelect.value, difficultySelect.value);
        }
    } else {
        alert("Please select an answer before submitting.");
    }
});

// Event listener for reset button
resetButton.addEventListener("click", () => {
    quizOver = false;
    currentQuestionIndex = 0;
    points = 0;
    pointsElement.textContent = points;
    fetchQuestions(topicSelect.value, difficultySelect.value);
    resetButton.style.display = "none";
    submitButton.style.display = "block";
});

// Function to load next question
function loadNextQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionBox.textContent = currentQuestion.question;
    options.forEach((option, index) => {
        option.nextElementSibling.textContent = currentQuestion.answers[index];
        option.value = currentQuestion.answers[index];
        option.checked = false; 
        option.nextElementSibling.style.backgroundColor = "#f9f9f9"; 
        option.nextElementSibling.style.color = "#333"; 
    });
    startTimer();
}

// Function to start timer for each question
function startTimer() {
    let timeRemaining = timeLimit;
    timerElement.textContent = timeRemaining;
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

// Function to end the quiz
function endQuiz() {
    quizOver = true;
    questionBox.textContent = `Quiz Over! You scored ${points} points.`;
    submitButton.style.display = "none";
    resetButton.style.display = "block";
    clearInterval(timer);
}

// Function to toggle loading animation
function toggleLoadingAnimation(show) {
    if (show) {
        loadingAnimation.style.display = "flex"; 
        quizSection.style.display = "none";
    } else {
        loadingAnimation.style.display = "none"; 
        quizSection.style.display = "block"; 
    }
}

// Function to highlight correct and incorrect answers
function highlightAnswers(selectedAnswer, correctAnswer) {
    options.forEach(option => {
        const label = option.nextElementSibling;
        if (option.value === selectedAnswer) {
            label.style.backgroundColor = "#f44336"; 
            label.style.color = "#fff";
        } else if (option.value === correctAnswer) {
            label.style.backgroundColor = "#4CAF50"; 
            label.style.color = "#fff";
        } else {
            label.style.backgroundColor = "#f9f9f9"; 
            label.style.color = "#333";
        }
    });
}

// Event listener for options to highlight selected option
options.forEach(option => {
    option.addEventListener("change", () => {
        options.forEach(opt => {
            const label = opt.nextElementSibling;
            if (opt.checked) {
                label.style.backgroundColor = "#2196F3"; 
                label.style.color = "#fff";
            } else {
                label.style.backgroundColor = "#f9f9f9"; 
                label.style.color = "#333";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    topicSelection.style.display = "block"; 
    quizSection.style.display = "none";
});
