$(document).ready(function () {
  loadTasks();

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskTableBody = $("#taskTable tbody");
    taskTableBody.empty(); // Clear the table before adding new rows

    tasks.forEach((task) => {
      const row = `
          <tr>
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            <td>
              <button class="edit" onclick="editTask(${task.id})">Edit</button>
              <button class="delete" onclick="deleteTask(${
                task.id
              })">Delete</button>
            </td>
          </tr>
        `;
      taskTableBody.append(row); // Append the row to the table body
    });
  }

  function addTask() {
    const name = $("#taskName").val().trim(); // Remove leading/trailing spaces
    const description = $("#taskDescription").val().trim(); // Remove leading/trailing spaces
    const dueDate = $("#taskDueDate").val().trim(); // Remove leading/trailing spaces

    // Log values for debugging
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Due Date:", dueDate);

    if (!name || !description || !dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const id = Date.now(); // Unique ID based on timestamp

    tasks.push({ id, name, description, dueDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Clear the input fields
    $("#taskName").val("");
    $("#taskDescription").val("");
    $("#taskDueDate").val("");

    loadTasks(); // Refresh the task list
  }

  window.editTask = function (id) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) return;

    const task = tasks[taskIndex];

    const newName = prompt("Enter new task name:", task.name);
    const newDescription = prompt(
      "Enter new task description:",
      task.description
    );
    const newDueDate = prompt(
      "Enter new task due date (YYYY-MM-DD):",
      task.dueDate
    );

    if (!newName || !newDescription || !newDueDate) {
      alert("All fields are required.");
      return;
    }

    tasks[taskIndex] = {
      ...task,
      name: newName,
      description: newDescription,
      dueDate: newDueDate,
    };
    localStorage.setItem("tasks", JSON.stringify(tasks));

    loadTasks(); // Refresh the task list
  };

  window.deleteTask = function (id) {
    // Show confirmation dialog before deleting
    const confirmation = confirm("Are you sure you want to delete this task?");

    if (confirmation) {
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter((task) => task.id !== parseInt(id)); // Remove the task by ID
      localStorage.setItem("tasks", JSON.stringify(tasks)); // Save updated tasks to localStorage

      loadTasks(); // Refresh the task list
    } else {
      console.log("Task deletion canceled");
    }
  };

  $("#searchTask").on("input", function () {
    const searchValue = $(this).val().toLowerCase();
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskTableBody = $("#taskTable tbody");
    taskTableBody.empty(); // Clear the table before adding new rows

    tasks
      .filter((task) => task.name.toLowerCase().includes(searchValue))
      .forEach((task) => {
        const row = `
            <tr>
              <td>${task.name}</td>
              <td>${task.description}</td>
              <td>${new Date(task.dueDate).toLocaleDateString()}</td>
              <td>
                <button class="edit" onclick="editTask(${
                  task.id
                })">Edit</button>
                <button class="delete" onclick="deleteTask(${
                  task.id
                })">Delete</button>
              </td>
            </tr>
          `;
        taskTableBody.append(row); // Append the row to the table body
      });
  });

  // Bind the addTask function to the Add Task button
  $("#addTaskButton").click(addTask);
});
