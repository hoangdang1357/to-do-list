document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const taskTableBody = document.querySelector('#taskTable tbody');
    taskTableBody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            <td>
                <button class="edit" onclick="editTask(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

async function addTask() {
    const name = document.getElementById('taskName').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;

    await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, dueDate }),
    });

    document.getElementById('taskName').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDueDate').value = '';
    
    loadTasks(); // Tải lại danh sách task sau khi thêm mới
}

async function editTask(id) {
    const name = prompt('Enter new task name:');
    const description = prompt('Enter new task description:');
    const dueDate = prompt('Enter new task due date (YYYY-MM-DD):');

    await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, dueDate }),
    });

    loadTasks(); // Tải lại danh sách task sau khi chỉnh sửa
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, {
        method: 'DELETE',
    });

    loadTasks(); // Tải lại danh sách task sau khi xóa
}

async function searchTask() {
    const searchValue = document.getElementById('searchTask').value.toLowerCase();
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const taskTableBody = document.querySelector('#taskTable tbody');
    taskTableBody.innerHTML = '';

    tasks.filter(task => task.name.toLowerCase().includes(searchValue)).forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            <td>
                <button class="edit" onclick="editTask(${task.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}
