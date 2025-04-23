const taskInput = document.getElementById('taskInput');
const taskNew = document.getElementById('taskNew');
const taskInProgress = document.getElementById('taskInProgress');
const taskCompleted = document.getElementById('taskCompleted');
const counterDisplay = document.getElementById('taskCounters');

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskNew.innerHTML = '';
  taskInProgress.innerHTML = '';
  taskCompleted.innerHTML = '';

  let countNew = 0;
  let countInProgress = 0;
  let countCompleted = 0;

  const newTasks = tasks.filter(t => t.status === 'new');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  newTasks.forEach((task, i) => {
    const li = createTaskElement(task.text, i + 1, tasks.indexOf(task));
    taskNew.appendChild(li);
    countNew++;
  });

  inProgressTasks.forEach((task, i) => {
    const li = createTaskElement(task.text, i + 1, tasks.indexOf(task));
    taskInProgress.appendChild(li);
    countInProgress++;
  });

  completedTasks.forEach((task, i) => {
    const li = createTaskElement(task.text, i + 1, tasks.indexOf(task));
    taskCompleted.appendChild(li);
    countCompleted++;
  });

  counterDisplay.innerHTML = `
    <div class="counter-box">
      <span>Всього: ${tasks.length}</span>
      <span>В процесі: ${countInProgress}</span>
      <span>Завершено: ${countCompleted}</span>
    </div>
  `;
}

function createTaskElement(text, number, index) {
  const li = document.createElement('li');
  li.draggable = true;
  li.ondragstart = (e) => drag(e, index);
  li.dataset.index = index;
  const strongText = document.createElement('strong');
  strongText.textContent = `${number}. ${text}`;

  const span = document.createElement('span');
  span.appendChild(strongText);

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Видалити';
  delBtn.onclick = () => deleteTask(index);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'task-buttons';
  buttonWrapper.appendChild(delBtn);

  li.appendChild(span);
  li.appendChild(buttonWrapper);
  return li;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, status: 'new' });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskInput.value = '';
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev, index) {
  ev.dataTransfer.setData("text/plain", index);
}

function drop(ev, newStatus) {
  ev.preventDefault();
  const index = ev.dataTransfer.getData("text/plain");
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].status = newStatus;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

loadTasks();
