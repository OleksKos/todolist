const addTaskBtn = document.querySelector('.todolist__addbtn');
const deskTaskInput = document.querySelector('.todolist__input');
const tasksWrapper = document.querySelector('.todolist__list');
// const deleteBtn = document.querySelectorAll('.todolist__deletebtn');
const selectColor = document.querySelector('.todolist__select');
const btnFilterImportant = document.querySelector('.todolist__important');
const btnFilterDate = document.querySelector('.todolist__date');
let todoItemElems = [];
let todoItemCheckbox = [];
let todolistDeleteBtn = [];
let num = [];
let tasks;
let complited, checkedItem, littleDesc, bigDesc;
let numOfPoint;

deskTaskInput.addEventListener('keyup', (e) => {
  // debugger;
  // console.log(e.keyCode);
  if (e.keyCode === 13) {
    addTask();
  }
})

const d = new Date().toString();
const pos = d.indexOf('GMT');
const trimDate = d.slice(0, pos - 4);

// debugger;

!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
filterComplited();
function filterComplited() {
  let complitedTasks = tasks.filter(item => item.complited === true);
  // console.log(complitedTasks);
  let notComplitedTasks = tasks.filter(item => item.complited === false);
  // console.log(notComplitedTasks);
  tasks = [...notComplitedTasks, ...complitedTasks];
  // console.log(tasks);
}

function createTemplate(task, index) {
  // debugger;
  if (task.complited === true) {
    complited = 'complited';
    checkedItem = 'checked';
  } else {
    complited = '';
    checkedItem = '';
  }
  numOfPoint = task.description.indexOf('.');
  if (numOfPoint === -1) {
    bigDesc = task.description;
    littleDesc = '';
  } else {
    bigDesc = task.description.substring(0, numOfPoint + 1);
    littleDesc = task.description.substring(numOfPoint + 1);
  }
  return `
    <li class="todolist__item ${complited}" data-index="${index}">
      <div>
        <input type="checkbox" name="${task.description}" class="todolist__checkbox" data-index="${index}">
      </div>
      <div class="todolist__circle ${task.importance}"></div>
      <div class="todolist__text">
        <h4 class="todolist__big-title ${checkedItem}">
          ${bigDesc}
        </h4>
        <span class="todolist__small-title">
          ${littleDesc}
        </span>
      </div>
      <div class="todolist__time">${task.date}</div>
      <div class="todolist__deletebtn fas fa-trash-alt">
      </div>
    </li>
  `
}



const fillHtmlList = () => {
  tasksWrapper.innerHTML = "";
  num = [];
  deskTaskInput.value = '';
  if (tasks.length > 0) {
    // filterTasks();
    tasks.forEach((item, index) => {
      tasksWrapper.innerHTML += createTemplate(item, index);
      if (item.complited === true) {
        num.push(index);
      }
    });
    todoItemElems = document.querySelectorAll('.todolist__item');
    todoItemCheckbox = document.querySelectorAll('.todolist__checkbox');
    todolistDeleteBtn = document.querySelectorAll('.todolist__deletebtn');

    todoItemCheckbox.forEach(item => {
      for (let i = 0; i < num.length; i++) {
        if (item.getAttribute("data-index") == num[i]) {
          item.checked = true;
        }
      }
    });

    todolistDeleteBtn.forEach((item, index) => {
      item.addEventListener('click', () => {
        // debugger
        tasks.splice(index, 1);
        num.splice(item.getAttribute("data-index"), 1);
        item.parentElement.classList.add('delition');
        setTimeout(() => {
          item.parentElement.remove();
          updateLocal();
          fillHtmlList();
        }, 1000);
      })
    })

    todoItemCheckbox.forEach((item, index) => {
      item.addEventListener('change', () => {
        // debugger;
        tasks[index].complited = !tasks[index].complited;
        const currentLi = item.parentElement.parentElement;
        currentLi.classList.toggle('complited');
        const bigTitle = currentLi.querySelector('.todolist__big-title');
        bigTitle.classList.toggle('checked');
        filterComplited();
        updateLocal();
        setTimeout(fillHtmlList, 1000);
      })
    })
    if (todoItemElems.length > 3) {
      for (let i = 0; i < 3; i++) {
        todoItemElems[i].classList.add('border');
      }
    }
  }
}

fillHtmlList();

// const date = '13:15';
let date;
let color = 'red';
// console.log(color);

selectColor.addEventListener('change', (e) => {
  // debugger;
  // console.log(e.target.selectedIndex);
  if (e.target.selectedIndex === 0) {
    color = 'red';
  } else if (e.target.selectedIndex === 1) {
    color = 'yellow';
  } else if (e.target.selectedIndex === 2) {
    color = 'green';
  }
})


function Task(description, date, color) {
  this.description = description;
  this.date = date;
  this.importance = color;
  this.trueDate = Date.now();
  this.complited = false;
}

const updateLocal = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // console.log(tasks);
}

function addTask() {
  // debugger;
  const newTask = new Task(deskTaskInput.value, getTaskReationTime(), color);
  tasks.push(newTask);
  // tasks.reverse();
  filterComplited();
  updateLocal();
  fillHtmlList();
  // tasksWrapper.innerHTML += createTemplate(newTask);
}

addTaskBtn.addEventListener('click', addTask);


btnFilterImportant.addEventListener('click', () => {
  let redTasks = tasks.filter(item => item.importance === 'red');
  // console.log(redTasks);
  let yellowTasks = tasks.filter(item => item.importance === 'yellow');
  // console.log(yellowTasks);
  let greenTasks = tasks.filter(item => item.importance === 'green');
  // console.log(greenTasks);
  tasks = [...redTasks, ...yellowTasks, ...greenTasks];
  // console.log(tasks);
  filterComplited();
  fillHtmlList();
})

btnFilterDate.addEventListener('click', () => {
  // debugger;
  // console.log(tasks.date);
  tasks.sort((a, b) => {
    return (a.trueDate) - (b.trueDate);
  })
  // tasks.sort(function (a, b) { return a - b; });
  // console.log(tasks);
  // tasks = [...task];
  filterComplited();
  fillHtmlList();
})

function addLeadingZero(d) {
  return (d < 10) ? '0' + d : d;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getTaskReationTime(t = new Date()) {
  let Y = t.getFullYear();
  let M = addLeadingZero(t.getMonth() + 1);
  let D = addLeadingZero(t.getDate());
  let d = days[t.getDay()];
  let h = addLeadingZero(t.getHours());
  let m = addLeadingZero(t.getMinutes());
  // return `${Y}/${M}/${D} ${d}, ${h}:${m}`;
  return `${D}.${M}.${Y.toString().slice(2)} ${d}, ${h}:${m}`;
}
