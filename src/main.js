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
      const checkClass = item.check ? "grey" : "";
      taskListContainer.innerHTML += `<div class="main__todo-bullet"><li class="bullet ${checkClass}" id=${item.id}>${item.taskValue}</li> <input type="checkbox" id=${item.id} class="checkbox" ${inputCheck} value="${item.taskValue}"></input> <br></div>`;
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
      `<div class="main__todo-bullet"><li class="bullet" id=${id}>${taskValue}</li><input type="checkbox" id=${id} class="checkbox" value="${taskValue}"><br></div>`
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
    let bullet = document.getElementById(`${item.id}`);
    if (item.id == elementId) {
      if (item.check) {
        item.check = false;
        bullet.classList.remove("grey");
        return item;
      }
      item.check = true;
      bullet.classList.add("grey");
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
document.getElementById("rates").addEventListener("click", function () {
  if (document.getElementById("currency").style.display === "none") {
    document.getElementById("currency").style.display = "block";
    getRates();
  } else {
    document.getElementById("currency").style.display = "none";
  }
});

function getRates() {
  const url = "https://www.cbr-xml-daily.ru/daily_json.js";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let USDrate = data.Valute.USD.Value;
      let USD = document.getElementById("usd");
      USD.innerHTML = USD.innerHTML.replace("00,0000", USDrate);

      let EURrate = data.Valute.EUR.Value;
      let EUR = document.getElementById("eur");
      EUR.innerHTML = EUR.innerHTML.replace("00,0000", EURrate);

      let GBPrate = data.Valute.GBP.Value;
      let GBP = document.getElementById("gbp");
      GBP.innerHTML = GBP.innerHTML.replace("00,0000", GBPrate);

      let CNYrate = data.Valute.CNY.Value;
      let CNY = document.getElementById("cny");
      CNY.innerHTML = CNY.innerHTML.replace("00,0000", CNYrate);
    })
    .catch((error) => {
      console.error("Ошибка: ", error);
    });
}

//Calendar
const date = document.querySelector(".month__date"),
  daysContainer = document.querySelector(".container__days"),
  prev = document.querySelector(".month__prev"),
  next = document.querySelector(".month__next");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
const eventsArr = [];
getEvents();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  let day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay();
  date.innerHTML = months[month] + " " + year;

  let days = "";

  {
    if (day == 1) {
      day = 0;
    } else
      if (day == 2) {
        day = 1;
      } else
        if (day == 3) {
          day = 2;
        } else
          if (day == 4) {
            day = 3;
          } else
            if (day == 5) {
              day = 4;
            } else
              if (day == 6) {
                day = 5;
              } else {
                day = 6;
              }
  }

  for (let x = day; x > 0; x--) {
    days += `<div class="container__day--prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    activeDay = i;
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
        event = true;
      }
    });
    if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
      if (event) {
        days += `<div class="container__day--active--event">${i}</div>`
      } else {
        days += `<div class="container__day--today">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="container__day--event">${i}</div>`
      } else {
        days += `<div class="container__day">${i}</div>`;
      }
    }
  }
  for (let j = 1; j <= nextDays; j++) {
    if (nextDays == 7) {
      days += ``;
    } else {
      days += `<div class="container__day--next-date">${j}</div>`;
    }
  }
  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

date.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

const addEventTitle = document.getElementById("event"),
  addEventDay = document.getElementById("event-day"),
  addEventFrom = document.getElementById("event-time-from"),
  addEventTo = document.getElementById("event-time-to"),
  addEventBtn = document.getElementById("event-add"),
  listEventBtn = document.getElementById("event-list"),
  delEventBtn = document.getElementById("event-del");

addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  };
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  };
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

function addListner() {
  const days = document.querySelectorAll(".container__day, .container__day--prev-date, .container__day--next-date, .container__day--active--event, .container__day--active, .container__day--event, .container__day--today, .container__day--today--active--event");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("container__day--active");
      });
      if (e.target.classList.contains("container__day--prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".container__day");
          days.forEach((day) => {
            if (!day.classList.contains("container__day--prev-date") &&
              day.innerHTML === e.target.innerHTML) {
              day.classList.add("container__day--active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("container__day--next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".container__day");
          days.forEach((day) => {
            if (!day.classList.contains("container__day--next-date") &&
              day.innerHTML === e.target.innerHTML) {
              day.classList.add("container__day--active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("container__day--active");
      }
    });
  });
};

addEventBtn.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventDay = new Date(addEventDay.value);
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "" || eventDay === "") {
    alert("Blank fields. Repeat the input");
    return;
  };

  let enterDay = eventDay.getDate();
  let enterMonth = eventDay.getMonth() + 1;
  let enterYear = eventDay.getFullYear();
  let todayDay = today.getDate();
  let todayMonth = today.getMonth() + 1;
  let todayYear = today.getFullYear();

  if (enterDay < todayDay && enterMonth <= todayMonth && enterYear <= todayYear) {
    alert("The entered date is in the past. Enter the correct date!");
    return;
  };

  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (timeFromArr.length !== 2 || timeToArr.length !== 2 || timeFromArr[0] > 23 || timeFromArr[1] > 59 || timeToArr[0] > 23 || timeToArr[1] > 59) {
    alert("Incorrect time format");
    return;
  }
  const newEvent = {
    day: eventDay.getDate(),
    month: eventDay.getMonth() + 1,
    year: eventDay.getFullYear(),
    events: [
      {
        title: eventTitle,
        time: eventTimeFrom + "-" + eventTimeTo,
      },
    ],
  };
  updateEvents(activeDay);
  eventsArr.push(newEvent);

  eventsArr.sort(function (a, b) {
    if (a.year < b.year) return -1;
    if (a.year > b.year) return 1;
    // при равных score сортируем по time
    if (a.month < b.month) return -1;
    if (a.month > b.month) return 1;
    // при равных score сортируем по time
    if (a.day < b.day) return -1;
    if (a.day > b.day) return 1;
    return 0;
  });

  saveEvents();
  initCalendar();
  addEventTitle.value = "";
  addEventDay.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
});

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function updateEvents(date) {
  const currentTask = document.getElementById(`container-event`);
  let events = "";
  eventsArr.forEach((event) => {
    if (date === event.day && month + 1 === event.month && year === event.year) {
      event.events.forEach((event) => {
        events += `Date: ${date} ${months[month]} ${year}. Event: ${event.title}. Time: ${event.time}<br>`;
      });
      currentTask.classList.add('container__event');
      currentTask.innerHTML = events;
    }
  });
  if (events === "") {
    events = ``;
    currentTask.classList.remove('container__event');
    currentTask.innerHTML = events;
  };

  saveEvents();
}

function deleteAllEvents() {
  let flag = confirm("Are you sure you want to delete calendar entries?");
  if (flag) {
    localStorage.clear();
    localStorage.setItem("taskList", JSON.stringify(taskList));
    location.reload();
  }
}
delEventBtn.addEventListener("click", deleteAllEvents);

function listEvents() {
  const currentTask = document.getElementById(`container-event`);
  let events = "";
  eventsArr.forEach((event) => {
    events += `Date: ${event.day} ${months[event.month - 1]} ${event.year}. Event: ${event.events[0].title}. Time: ${event.events[0].time}<br>`
  });
  currentTask.classList.add('container__event');
  currentTask.innerHTML = events;
}
listEventBtn.addEventListener("click", listEvents);