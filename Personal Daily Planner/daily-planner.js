document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  // Attach event for Clear All button
  const clearBtn = document.getElementById("clear-all");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all tasks?")) {
        localStorage.removeItem("tasks");
        document.getElementById("task-list").innerHTML = "";
      }
    });
  }
});

function addTask() {
  const taskInput = document.getElementById("task");
  const prioritySelect = document.getElementById("priority-select");
  const dueDateInput = document.getElementById("due-date");
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  if (priority === "select" || priority === "") {
    alert("Please select a priority.");
    return;
  }

  if (dueDate === "") {
    alert("Please set a due date.");
    return;
  }

  const task = {
    text: taskText,
    priority: priority,
    due: dueDate,
    completed: false
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTask(task);
  taskInput.value = "";
  prioritySelect.value = "select";
  dueDateInput.value = "";
}

function displayTask(task) {
  const taskList = document.getElementById("task-list");

  const li = document.createElement("li");
  li.classList.add(task.priority);
  if (task.completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.className = "complete-checkbox";

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    updateCompletionStatus(task);
    li.classList.toggle("completed", task.completed);
  });

  const taskContent = document.createElement("div");
  const priorityText = task.priority.replace("priority-", "");
  const formattedPriority = priorityText.charAt(0).toUpperCase() + priorityText.slice(1);
  const formattedDue = task.due ? new Date(task.due).toLocaleString() : "No due date";

  taskContent.innerHTML = `
    <p><strong>Task:</strong> ${task.text}</p>
    <p><strong>Priority:</strong> ${formattedPriority}</p>
    <p><strong>Due:</strong> ${formattedDue}</p>
  `;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "task-buttons";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.onclick = () => {
    const newText = prompt("Edit your task:", task.text);
    if (newText && newText.trim()) {
      updateTask(task, newText.trim());
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => {
    if (confirm("Are you sure you want to delete this task?")) {
    li.remove();
    deleteTask(task);
    }
  };

  buttonsDiv.appendChild(editBtn);
  buttonsDiv.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(taskContent);
  li.appendChild(buttonsDiv);
  taskList.appendChild(li);
}

function deleteTask(taskToDelete) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task =>
    !(task.text === taskToDelete.text &&
      task.priority === taskToDelete.priority &&
      task.due === taskToDelete.due)
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(oldTask, newText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.findIndex(task =>
    task.text === oldTask.text &&
    task.priority === oldTask.priority &&
    task.due === oldTask.due
  );

  if (index !== -1) {
    tasks[index].text = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    location.reload();
  }
}

function updateCompletionStatus(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.findIndex(task =>
    task.text === updatedTask.text &&
    task.priority === updatedTask.priority &&
    task.due === updatedTask.due
  );

  if (index !== -1) {
    tasks[index].completed = updatedTask.completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => displayTask(task));
}