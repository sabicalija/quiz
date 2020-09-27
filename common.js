document.addEventListener("DOMContentLoaded", init, false);

function init() {
  loadNavigation();
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
