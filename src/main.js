//to-do list

const message = document.querySelector(".main__todo-message");
const taskListContainer = document.querySelector(".main__todo-list");
let taskList = [];

//show to-do list onload

function showListOnload() {
  showDoughnutChart();
  const taskListString = localStorage.getItem("taskList");
  if (taskListString != null) {
    message.innerText = "";
    message.classList.remove("main__todo-message");
    const taskListArr = JSON.parse(taskListString);
    taskList = taskListArr;
    taskListContainer.innerHTML = "";
    taskList.forEach((item) => {
      const inputCheck = item.check ? "checked" : "";
      taskListContainer.innerHTML += `<div class="main__todo-bullet"><li class="bullet">${item.taskValue}</li> <input type="checkbox" id=${item.id} class="checkbox" ${inputCheck} value="${item.taskValue}"></input> <br></div>`;
    });
  }
}

document.addEventListener("DOMContentLoaded", showListOnload);

//add tasks

const addBtn = document.querySelector(".btn-add");

function addTask() {
  const taskInput = document.getElementById("task");
  let taskValue = taskInput.value;
  message.innerText = "";
  message.classList.remove("main__todo-message");
  if (taskValue !== "") {
    const id = Math.floor(Math.random() * 100);
    document.getElementById("task").placeholder = "New task";
    taskList.push({ taskValue, id, check: false });
    localStorage.setItem("taskList", JSON.stringify(taskList));
    taskListContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="main__todo-bullet"><li class="bullet">${taskValue}</li><input type="checkbox" id=${id} class="checkbox" value="${taskValue}"><br></div>`
    );
    taskInput.value = "";
  } else {
    document.getElementById("task").placeholder = "Add a task!";
  }
  checkProgress();
}

addBtn.addEventListener("click", addTask);

//count checked and unchecked boxes

function showChecked(event) {
  renderChecked(event.target);
}

function checkProgress() {
  let tasks = JSON.parse(localStorage.getItem("taskList"));
  let checked = [];
  let unchecked = [];
  if (tasks !== null) {
    tasks.forEach((task) => {
      if (task.check === true) {
        checked.push(task);
      } else {
        unchecked.push(task);
      }
    });
    localStorage.setItem("unchecked", JSON.stringify(unchecked));
    localStorage.setItem("checked", JSON.stringify(checked));
  }
  showDoughnutChart();
}

document.addEventListener("change", showChecked);
document.addEventListener("change", checkProgress);

//check and uncheck checkboxes
function renderChecked(element) {
  const elementId = element.id;
  const arrCards = taskList.map((item) => {
    if (item.id == elementId) {
      if (item.check) {
        item.check = false;
        return item;
      }
      item.check = true;
      return item;
    }
    return item;
  });
  taskList = arrCards;
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

//doughnut-chart (progress); shows progress onload and onclick
import Chart from "chart.js/auto";
let chart = null;

function showDoughnutChart() {
  let checkedTasks = JSON.parse(localStorage.getItem("checked"));
  let done = checkedTasks !== null ? checkedTasks.length : 0;
  let uncheckedTasks = JSON.parse(localStorage.getItem("unchecked"));
  let toDo = uncheckedTasks !== null ? uncheckedTasks.length : 1;
  const graph = document.querySelector(".doughnut");
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(graph, {
    type: "doughnut",
    data: {
      labels: ["Done", "To Do"],
      datasets: [
        {
          label: "Tasks",
          data: [done, toDo],
          backgroundColor: ["rgb(202, 177, 202)", "rgb(153, 147, 147)"],
          hoverOffset: 2,
        },
      ],
    },
  });
}

//delete todo list
const clearBtn = document.querySelector(".btn-delete");
function deleteTaskList() {
  if (taskList !== null) {
    taskListContainer.innerHTML = "";
    taskList = [];
    localStorage.clear();
  }
  showDoughnutChart();
}
clearBtn.addEventListener("click", deleteTaskList);

// Погода

const apiKey = "a60fa55cb3d341dd95d140431240303";

// Элементы на странице

const header = document.querySelector(".weather");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

function removeCard() {
  const prevCard = document.querySelector(".card");
  if (prevCard) prevCard.remove();
}

//Слушаем отправку формы
form.onsubmit = function (e) {
  //Отменяем отправку формы
  e.preventDefault();

  //Берем значение из инпута, обрезаем пробелы
  let city = input.value.trim();
  console.log(city);

  //Делаем запрос на сервер
  //Адрес запроса
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  //Выполняем запрос

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(data);
      if (data.error) {
        // Если есть ошибка - выводим ее

        //Удаляем предыдущую карточку
        removeCard();

        //Отобразить карточку с ошибкой
        const html = `<div class="card">Enter the city</div>`;
        header.insertAdjacentHTML("afterend", html);
      } else {
        // Если ошибки нет - выводим карточку

        //Удаляем предыдущую карточку
        removeCard();

        //Отображаем полученные данные в карточке
        // Разметка для карточки

        const html = `<div class="card">
                        <h2 class="card-city">${data.location.name} <span>${data.location.country}</span></h2>

                        <div class="card-weather">
                            <div class="card-value">${data.current.temp_c}<sup>°C</sup></div>
                            <img  class="card-img"  src="./public/5538410.png" alt="weather">
                        </div>

                        <div class="card-description">${data.current.condition.text}</div>

                    </div>`;

        //Отображаем карточку на странице
        header.insertAdjacentHTML("afterend", html);
      }
    });
};

// joke section

document.addEventListener("DOMContentLoaded", getJoke);

function getJoke() {
  const apis = [
    "https://geek-jokes.sameerkumar.website/api?format=json",
    "https://icanhazdadjoke.com",
    "https://official-joke-api.appspot.com/random_joke",
  ];

  const randomApi = apis[Math.floor(Math.random() * apis.length)];

  fetch(randomApi, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let joke = "";
      if (data.joke) {
        joke = data.joke;
      } else if (data.setup) {
        joke = `${data.setup} ${data.punchline}`;
      }
      document.getElementById("joke").innerText = joke;
    })
    .catch((error) => console.error("Ошибка:", error));
}

//currency
document.addEventListener("DOMContentLoaded", getRates);

function getRates() {
  const url = "https://www.cbr-xml-daily.ru/daily_json.js";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let USDrate = data.Valute.USD.Value;
      let USD = document.getElementById("USD");
      USD.innerHTML = USD.innerHTML.replace("00,0000", USDrate);

      let EURrate = data.Valute.EUR.Value;
      let EUR = document.getElementById("EUR");
      EUR.innerHTML = EUR.innerHTML.replace("00,0000", EURrate);

      let GBPrate = data.Valute.GBP.Value;
      let GBP = document.getElementById("GBP");
      GBP.innerHTML = GBP.innerHTML.replace("00,0000", GBPrate);

      let CNYrate = data.Valute.CNY.Value;
      let CNY = document.getElementById("CNY");
      CNY.innerHTML = CNY.innerHTML.replace("00,0000", CNYrate);
    })
    .catch((error) => {
      console.error("Ошибка: ", error);
    });
}

//Calendar

//Create items for calendar

const calendar = document.querySelector(".calendar");
const date = document.querySelector(`.date`);
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayButton = document.querySelector(`.today-btn`);

//create today date

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

//current month
function currentMonth() {
  date.innerHTML = months[month] + " " + year;
  initCalendar();
}
currentMonth();

//prev month
prev.addEventListener(`click`, function () {
  month = month - 1;
  if (month < 0) {
    year = year - 1;
    month = 11;
  }
  currentMonth();
});

//next month
next.addEventListener(`click`, function () {
  month = month + 1;
  if (month > 11) {
    year = year + 1;
    month = 0;
  }
  currentMonth();
});

//today button
todayButton.addEventListener(`click`, function () {
  month = today.getMonth();
  year = today.getFullYear();
  currentMonth();
});

// add calendar days
function initCalendar() {
  const firstDay = new Date(year, month, 1); // первый день текущего месяца
  const lastDay = new Date(year, month + 1, 0); // последний день текущего месяца
  const prevLastDay = new Date(year, month, 0); // последний день предыдущего месяца
  const prevDay = prevLastDay.getDate(); // день недели последнего дня предыдущего месяца
  const lastDate = lastDay.getDate(); // день недели последнего дня текущего месяца
  let day = firstDay.getDay(); // день недели первого дня текущего месяца
  const nextDays = 7 - lastDay.getDay();
  if (day === 0) {
    day = 6;
  };
  if (day === 1) {
    day = 0;
  };
  if (day === 2) {
    day = 1;
  };
  if (day === 3) {
    day = 2;
  };
  if (day === 4) {
    day = 3;
  };
  if (day === 5) {
    day = 4;
  };
  if (day === 6) {
    day = 5;
  };
  let days = "";
  for (let i = day; i > 0; i--) {
    days += `<div class="day prev-date">${prevDay - i + 1}</div>`;
  };

  const todayNumber = today.getDate();
  for (let j = 1; j < lastDate + 1; j++) {
    if (j == todayNumber && month == new Date().getMonth() && year == new Date().getFullYear()) {
      days += `<div class="day today">${j}</div>`;
    } else 
    
{    days += `<div class="day">${j}</div>`;
}  }

  for (let j = 1; j <= nextDays; j++) {
    if (nextDays == 7) {
      days += ``;
    }
    else { days += `<div class="day next-date">${j}</div>`; }
  }

  daysContainer.innerHTML = days;
}
//end calendar
