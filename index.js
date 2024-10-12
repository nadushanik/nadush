const input = document.querySelector("input");
const container = document.querySelector(".dropdown-container");
const favorites = document.querySelector(".favorites");


favorites.addEventListener("click", function(evt) {
    let target = evt.target;
    if (!target.classList.contains("btn")) return;

    target.parentElement.remove();
});

async function getALL() {
  const urlRepositories = new URL("https://api.github.com/search/repositories");
  let repositoriesPart = input.value;
  if (repositoriesPart === "") {
    container.innerHTML = "";
    return;
  }
  urlRepositories.searchParams.append("q", repositoriesPart);
  try {
    let response = await fetch(urlRepositories);
    if (response.status === 200) {
      let repositories = await response.json();
      const myArray = repositories.items.slice(0, 5);
      myArray.forEach((todo) => todoHTML(todo));
    } else return null;
  } catch (error) {
    return null;
  }
}
function removePredictions() {
    container.innerHTML = "";
}
window.addEventListener("DOMContentLoaded", getALL);

function todoHTML({ name, stargazers_count, owner }) {
  const todoList = document.getElementById("das");
  todoList.insertAdjacentHTML("beforeend", `<div class="dropdown-content" data-owner="${owner.login}" data-stars="${stargazers_count}">${name}</div>`); 
}

input.addEventListener("input", debounce(getALL, 500));

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function addChosen(target) {
    const todoList = document.getElementById("favorites");
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    todoList.insertAdjacentHTML("beforeend", `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn"></button></div>`); 
  }

container.addEventListener("click", function(evt) {
    let target = evt.target;
    if (!target.classList.contains("dropdown-content")) {
	return;
    }
    addChosen(target);
    input.value = "";
    removePredictions();
});

