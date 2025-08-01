function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (!username || !password) {
      document.getElementById("error").innerText = "Please enter both fields";
      return;
    }

    if (!storedUsername && !storedPassword) {
      // First-time user — store credentials
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      window.location.href = "scheduler.html";
    } else if (username === storedUsername && password === storedPassword) {
    
      window.location.href = "scheduler.html";
    } else {
      document.getElementById("error").innerText = "Incorrect username or password";
    }
  }



  window.addEventListener("DOMContentLoaded", () => {
    let tasks = new Map(JSON.parse(localStorage.getItem("tasksMap")) || [
      ["backlog", []],
      ["progress", []],
      ["complete", []],
      ["onhold", []]
    ]);
  
    function saveTasks() {
      localStorage.setItem("tasksMap", JSON.stringify(Array.from(tasks.entries())));
    }
  
    function createTaskElement(content, columnId) {
      const task = document.createElement("div");
      task.className = "task";
      task.draggable = true;
      task.textContent = content;
  
      task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", content);
        e.dataTransfer.setData("from", columnId);
      });
  
      return task;
    }
  
    function render() {
      tasks.forEach((taskList, columnId) => {
        const column = document.getElementById(columnId);
        if (!column) return;
        column.innerHTML = "";
        taskList.forEach(task => {
          column.appendChild(createTaskElement(task, columnId));
        });
      });
    }
  
    window.addTask = function (columnId) {
      const task = prompt("Enter your task:");
      if (task) {
        tasks.get(columnId).push(task);
        saveTasks();
        render();
      }
    }
    function createTaskElement(content, columnId) {
      const task = document.createElement("div");
      task.className = "task";
      task.draggable = true;
    
      const textSpan = document.createElement("span");
      textSpan.textContent = content;
    
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => {
        const updatedList = tasks.get(columnId).filter(t => t !== content);
        tasks.set(columnId, updatedList);
        saveTasks();
        render();
      };
    
      task.appendChild(textSpan);
      task.appendChild(deleteBtn);
    
      task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", content);
        e.dataTransfer.setData("from", columnId);
      });
    
      return task;
    }
    
  
    document.querySelectorAll(".task-list").forEach((col) => {
      col.addEventListener("dragover", (e) => e.preventDefault());
  
      col.addEventListener("drop", (e) => {
        e.preventDefault();
        const taskText = e.dataTransfer.getData("text/plain");
        const from = e.dataTransfer.getData("from");
        const to = col.id;
  
        if (from !== to) {
          const fromTasks = tasks.get(from);
          const toTasks = tasks.get(to);
          tasks.set(from, fromTasks.filter(t => t !== taskText));
          toTasks.push(taskText);
          saveTasks();
          render();
        }
      });
    });
  
    render(); 
  });
  
  