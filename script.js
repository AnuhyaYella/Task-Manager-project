// DOM Elements
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filters button");
const totalTasks = document.getElementById("total-tasks");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks_v1")) || [];
let currentFilter = "all";

// Add Task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const prio = priority.value;

  if (!text) {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    date,
    priority: prio,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskDate.value = "";
});

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks_v1", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "pending")
    filteredTasks = tasks.filter((t) => !t.completed);
  else if (currentFilter === "completed")
    filteredTasks = tasks.filter((t) => t.completed);

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "done" : ""}`;

    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${
      task.id
    }">
        <span class="task-text">${task.text}</span>
        ${task.date ? `<small class="date">📅 ${task.date}</small>` : ""}
        <small class="priority ${task.priority.toLowerCase()}">${
      task.priority
    }</small>
      </div>
      <button class="delete" data-id="${task.id}">🗑</button>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

// Update Stats
function updateStats() {
  totalTasks.textContent = tasks.length;
  pendingTasks.textContent = tasks.filter((t) => !t.completed).length;
  completedTasks.textContent = tasks.filter((t) => t.completed).length;
}

// Task Actions (mark complete, delete)
taskList.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.type === "checkbox") {
    const task = tasks.find((t) => t.id == id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }

  if (e.target.classList.contains("delete")) {
    tasks = tasks.filter((t) => t.id != id);
    saveTasks();
    renderTasks();
  }
});

// Filter Buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Load tasks on page load
renderTasks();
