document.addEventListener("DOMContentLoaded", initCommon, false);

let settings = {
  defaults: {
    token: "",
  },
};

function initCommon() {
  loadNavigation();
  loadNavigationHandlers();
}

function loadSettings() {
  settings = Object.assign({}, settings.defaults, JSON.parse(localStorage.getItem("settings")));
  updateToken(settings.token);
}

function updateToken(token) {
  const input = document.getElementById("api-token");
  input.value = token;
}

function saveToken(token) {
  settings.token = token;
  localStorage.setItem("settings", JSON.stringify(settings));
  loadSettings();
}

function loadHandlers() {
  const btnSaveApiToken = document.querySelector("div.api > input[value='Save']");
  btnSaveApiToken.addEventListener("click", () => {
    const apiToken = document.getElementById("api-token").value;
    saveToken(apiToken);
  });

  const btnDeleteApiToken = document.querySelector("div.api > input[value='Delete']");
  btnDeleteApiToken.addEventListener("click", () => {
    document.getElementById("api-token").value = settings.defaults.token;
    saveToken(settings.defaults.token);
  });

  const btnTogglePwdVisibility = document.getElementById("api-token-toggle");
  const handler = () => {
    const token = document.getElementById("api-token");
    const type = token.getAttribute("type") === "password" ? "text" : "password";
    token.setAttribute("type", type);
    btnTogglePwdVisibility.classList.toggle("fa-eye-slash");
  };
  btnTogglePwdVisibility.addEventListener("click", handler);
  btnTogglePwdVisibility.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter") {
      handler();
    }
  });
}

function loadNavigation() {
  const navElems = document.querySelectorAll(".navbar > .main-nav > li > a");
  const path = location.pathname;
  for (const elem of navElems) {
    const href = elem.getAttribute("href");
    if (href.endsWith(path)) {
      elem.parentNode.classList.toggle("active");
      break;
    }
  }
}

function loadNavigationHandlers() {
  const selectNavigation = document.getElementById("nav-dropdown");
  selectNavigation.value = "." + window.location.pathname;
  selectNavigation.addEventListener("change", (event) => {
    window.location.assign(event.target.value);
  });
}
