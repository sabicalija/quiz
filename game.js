document.addEventListener("DOMContentLoaded", init, false);

function init() {
  const buttonStartGame = document.getElementById("quiz-start-game");
  buttonStartGame.addEventListener("click", startGameHandler, false);

  loadSettings();
  loadHandlers();
}

function startGameHandler() {
  const buttonStartGame = document.getElementById("quiz-start-game");
  buttonStartGame.disabled = "disabled";
  startGame(settings.token);
}

function startGame(token) {
  const apiData = {
    apiKey: token,
    limit: 10,
  };

  const mainQuiz = document.querySelector("main.quiz");
  const articleQuestionelem = mainQuiz.querySelector("article");

  const difficulty = document.getElementById("settings-difficulty");
  apiData.difficulty = difficulty.value;

  const apiUrl = new URL("https://quizapi.io/api/v1/questions");
  const params = new URLSearchParams(apiData);
  const url = apiUrl + "?" + params;

  fetch(url)
    .then(async (response) => {
      const data = await response.json();
      startRound(articleQuestionelem, data, 0);
    })
    .catch((e) => {
      console.log(e);
    });
  // updateResult(element, testData(2));
}

function startRound(root, questions, i) {
  updateQuestion(root, questions[i], {
    submitLabel: "Next",
    inputElemType: questions[i].multiple_correct_answers == "true" ? "checkbox" : "radio",
  });
}
