document.addEventListener("DOMContentLoaded", init, false);

function init() {
  const buttonNewQuestion = document.getElementById("quiz-new-question");
  buttonNewQuestion.addEventListener("click", loadDemoQuestionHandler, false);
  loadSettings();
  loadHandlers();
  // loadDemoQuestion(api_token);
}

function loadDemoQuestionHandler() {
  loadQuestion(settings.token);
}

function loadDemoQuestion() {
  loadQuestion(settings.token);
}

function loadQuestion(token) {
  const apiData = {
    apiKey: token,
    limit: 1,
  };

  const mainQuiz = document.querySelector("main.quiz");
  const articleQuestionelem = mainQuiz.querySelector("article");

  const category = document.getElementById("settings-category");
  if (category.value !== "default") apiData.category = category.value;

  const difficulty = document.getElementById("settings-difficulty");
  if (difficulty.value !== "default") apiData.difficulty = difficulty.value;

  const apiUrl = new URL("https://quizapi.io/api/v1/questions");
  const params = new URLSearchParams(apiData);
  const url = apiUrl + "?" + params;

  fetch(url)
    .then(async (response) => {
      const data = await response.json();
      updateResult(articleQuestionelem, data[0]);
    })
    .catch((e) => {
      console.log(e);
    });
  // updateResult(element, testData(2));
}

function updateResult(root, data) {
  updateQuestion(root, data, {
    submitLabel: "Submit",
    inputElemType: data.multiple_correct_answers == "true" ? "checkbox" : "radio",
  });
}

const testData = (idx) => {
  idx = typeof idx !== "undefined" ? idx : Math.round(Math.random(0, 1));
  const data = [
    {
      id: 1079,
      question: "Which command do we need to execute to check the available repos in yum (CentOS)",
      description: null,
      answers: {
        answer_a: "yum repolist",
        answer_b: "yum listrepo",
        answer_c: "yum searchrepo",
        answer_d: "yum reposearch",
        answer_e: "yum reposhow",
        answer_f: "yum showrepo",
      },
      multiple_correct_answers: "false",
      correct_answers: {
        answer_a_correct: "true",
        answer_b_correct: "false",
        answer_c_correct: "false",
        answer_d_correct: "false",
        answer_e_correct: "false",
        answer_f_correct: "false",
      },
      correct_answer: null,
      explanation: null,
      tip: null,
      tags: [{ name: "Linux" }],
      category: "Linux",
      difficulty: "Medium",
    },
    {
      id: 677,
      question: "What is the default working directory of the Linux administrator user?",
      description: null,
      answers: {
        answer_a: "/root",
        answer_b: "Doesn't have one",
        answer_c: "/usr/admin",
        answer_d: "/administrator",
        answer_e: "/admin",
        answer_f: "/home/root",
      },
      multiple_correct_answers: "true",
      correct_answers: {
        answer_a_correct: "true",
        answer_b_correct: "true",
        answer_c_correct: "false",
        answer_d_correct: "false",
        answer_e_correct: "false",
        answer_f_correct: "false",
      },
      correct_answer: null,
      explanation:
        "The default working directory is always /root. This directory is kept only for the root user and no other.",
      tip: null,
      tags: [{ name: "BASH" }, { name: "Linux" }],
      category: "Linux",
      difficulty: "Easy",
    },
    {
      id: 21,
      question:
        "Which of the following is a text editor that can be used in command mode to edit files on a Linux system?",
      description: null,
      answers: {
        answer_a: "vi or vim",
        answer_b: "lsof",
        answer_c: "open",
        answer_d: "edit",
        answer_e: null,
        answer_f: null,
      },
      multiple_correct_answers: "false",
      correct_answers: {
        answer_a_correct: "true",
        answer_b_correct: "false",
        answer_c_correct: "false",
        answer_d_correct: "false",
        answer_e_correct: "false",
        answer_f_correct: "false",
      },
      correct_answer: "answer_a",
      explanation: null,
      tip: null,
      tags: [{ name: "Linux" }],
      category: "Linux",
      difficulty: "Easy",
    },
  ];
  return data[idx];
};
