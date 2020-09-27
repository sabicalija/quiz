document.addEventListener("DOMContentLoaded", init, false);

let settings = {
  defaults: {
    token: "",
  },
};

function init() {
  const inputApiToken = document.getElementById("api-token");
  api_token = inputApiToken.value;
  const buttonNewQuestion = document.getElementById("quiz-new-question");
  buttonNewQuestion.addEventListener("click", loadDemoQuestionHandler, false);

  loadSettings();
  loadHandlers();
  // loadDemoQuestion(api_token);
}

function loadSettings() {
  settings = Object.assign({}, settings.defaults, JSON.parse(localStorage.getItem("settings")));
  updateToken(settings.token);
}

function updateToken(token) {
  const input = document.getElementById("api-token");
  input.value = token;
}

function loadHandlers() {
  const btnSaveApiToken = document.querySelector("div.api > input[value='Save']");
  btnSaveApiToken.addEventListener("click", () => {
    const apiToken = document.getElementById("api-token").value;
    saveApiToken(apiToken);
  });

  const btnDeleteApiToken = document.querySelector("div.api > input[value='Delete']");
  btnDeleteApiToken.addEventListener("click", () => {
    document.getElementById("api-token").value = settings.defaults.token;
    saveApiToken(settings.defaults.token);
  });

  const btnTogglePwdVisibility = document.getElementById("api-token-toggle");
  btnTogglePwdVisibility.addEventListener("click", () => {
    const token = document.getElementById("api-token");
    const type = token.getAttribute("type") === "password" ? "text" : "password";
    token.setAttribute("type", type);
    btnTogglePwdVisibility.classList.toggle("fa-eye-slash");
  });
}

function saveApiToken(token) {
  settings.token = token;
  localStorage.setItem("settings", JSON.stringify(settings));
  loadSettings();
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
  if (data.multiple_correct_answers == "true") {
    updateQuestion(root, data, "checkbox");
  } else {
    updateQuestion(root, data, "radio");
  }
}

function updateQuestion(root, data, elemType) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  const header = createHeader(data);
  const form = createForm(data, elemType);
  const footer = createFooter(data);

  root.appendChild(header);
  root.appendChild(form);
  root.appendChild(footer);
}

function createHeader(data) {
  const header = document.createElement("header");

  const id = createHeaderElement(data, "ID", "id");
  const cat = createHeaderElement(data, "Category", "category");
  const diff = createHeaderElement(data, "Difficulty", "difficulty");

  header.appendChild(id);
  header.appendChild(cat);
  header.appendChild(diff);

  return header;
}

function createHeaderElement(o, label, name) {
  const headerElement = document.createElement("div");

  const spanLabel = document.createElement("span");
  spanLabel.textContent = label;
  headerElement.appendChild(spanLabel);

  const spanValue = document.createElement("span");
  spanValue.textContent = o[name];
  headerElement.appendChild(spanValue);

  return headerElement;
}

function createForm(data, elemType) {
  const form = document.createElement("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let round = true;
    if (data.multiple_correct_answers == "true") {
      round = checkAnswerMultiple(data);
    } else {
      round = checkAnswerSingle(data);
    }

    updateRound(round);
  });

  const fieldsetQuestion = createQuestionFieldset(data, elemType);
  form.appendChild(fieldsetQuestion);

  const divSubmit = createSubmitDiv(data);
  form.appendChild(divSubmit);

  return form;
}

function checkAnswerMultiple(data) {
  let result = true;
  const answers = document.querySelectorAll("form > fieldset > div.answer > input");
  for (const answer of answers) {
    const id = answer.id;
    if (
      (data.correct_answers[id + "_correct"] == "false" && answer.checked) ||
      (data.correct_answers[id + "_correct"] == "true" && !answer.checked)
    ) {
      result = false;
      break;
    }
  }
  return result;
}

function checkAnswerSingle(data) {
  let result = true;
  const answers = document.querySelectorAll("form > fieldset > div.answer > input");
  for (const answer of answers) {
    const id = answer.id;
    if (
      (data.correct_answers[id + "_correct"] == "false" && answer.checked) ||
      (data.correct_answers[id + "_correct"] == "true" && !answer.checked)
    ) {
      result = false;
      break;
    }
  }
  return result;
}

function updateRound(success) {
  const quiz = document.querySelector("main.quiz");
  const round = document.querySelector("main.quiz > div.round");

  if (round) {
    quiz.removeChild(round);
  }

  if (success) {
    updateSuccess(quiz);
  } else {
    updateFailure(quiz);
  }
}

function updateSuccess(root) {
  const success = createSuccessElement();
  root.appendChild(success);
}

function createSuccessElement() {
  const div = document.createElement("div");
  div.setAttribute("class", "round");

  const message = document.createElement("p");
  message.textContent = "Congratulation. You're right!";
  div.appendChild(message);

  // const next = document.createElement("button");
  // next.textContent = "New Round";
  // div.appendChild(next);

  return div;
}

function updateFailure(root) {
  const failure = createFailureElement();
  root.appendChild(failure);
}

function createFailureElement() {
  const div = document.createElement("div");
  div.setAttribute("class", "round");

  const message = document.createElement("p");
  message.textContent = "Game Over.";
  div.appendChild(message);

  // const next = document.createElement("button");
  // next.textContent = "New Round";
  // div.appendChild(next);

  return div;
}

function createFooter(data) {
  const footer = document.createElement("footer");

  const tags = createTags(data);
  footer.appendChild(tags);

  return footer;
}

function createTags(data) {
  const tags = document.createElement("div");

  const title = document.createElement("span");
  title.textContent = "Tags:";
  tags.appendChild(title);

  for (const tag of data.tags) {
    const tagElem = document.createElement("span");
    tagElem.textContent = tag.name;
    tags.appendChild(tagElem);
  }

  return tags;
}

function createQuestionFieldset(data, elemType) {
  const fieldsetQuestion = document.createElement("fieldset");

  const legendQuestion = document.createElement("legend");
  legendQuestion.textContent = data.question;
  fieldsetQuestion.appendChild(legendQuestion);

  for (const answer in data.answers) {
    if (data.answers[answer]) {
      const answerDiv = createAnswerDiv(data.answers, answer, elemType);
      fieldsetQuestion.appendChild(answerDiv);
    }
  }

  return fieldsetQuestion;
}

function createAnswerDiv(answers, answer, elemType = "radio") {
  const id = answer;
  const divAnswer = document.createElement("div");
  divAnswer.setAttribute("class", "answer");

  const inputAnswer = document.createElement("input");
  inputAnswer.setAttribute("id", id);
  inputAnswer.setAttribute("type", elemType);
  inputAnswer.setAttribute("name", "question");
  inputAnswer.setAttribute("value", answers[answer]);
  divAnswer.appendChild(inputAnswer);

  const labelAnswer = document.createElement("label");
  labelAnswer.setAttribute("for", id);
  labelAnswer.textContent = answers[answer];
  divAnswer.appendChild(labelAnswer);

  return divAnswer;
}

function createSubmitDiv(data) {
  const divSubmit = document.createElement("div");

  const inputSubmit = document.createElement("input");
  inputSubmit.setAttribute("type", "submit");
  divSubmit.appendChild(inputSubmit);

  return divSubmit;
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
