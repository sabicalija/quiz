function updateQuestion(root, data, opts) {
  const { submitLabel, inputElemType } = opts;
  clearQuestion(root);
  const header = createHeader(data);
  const form = createForm(data, inputElemType);
  const footer = createFooter(data);

  root.appendChild(header);
  root.appendChild(form);
  root.appendChild(footer);
}

function clearQuestion(root) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  const round = root.parentNode.querySelector(".round");
  if (round) root.parentNode.removeChild(round);
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
  div.setAttribute("class", "round success");
  setTimeout(function () {
    div.classList.toggle("animate");
  }, 10);

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
  div.setAttribute("class", "round failure");
  setTimeout(function () {
    div.classList.toggle("animate");
  }, 10);

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
  labelAnswer.setAttribute("tabindex", 0);
  labelAnswer.addEventListener("keydown", function (event) {
    if (event.code === "Space" || event.code === "Enter") {
      inputAnswer.checked = !inputAnswer.checked;
    }
  });
  labelAnswer.textContent = answers[answer];
  divAnswer.appendChild(labelAnswer);

  return divAnswer;
}

function createSubmitDiv(data) {
  const divSubmit = document.createElement("div");

  const inputSubmit = document.createElement("input");
  inputSubmit.setAttribute("type", "submit");
  inputSubmit.setAttribute("class", "btn");
  divSubmit.appendChild(inputSubmit);

  return divSubmit;
}
