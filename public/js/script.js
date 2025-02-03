document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = ''; // Kosongkan task list
                tasks.forEach(task => {
                    const card = document.createElement('div');
                    card.className = 'task-card';
                    card.innerHTML = `
                        <p>${task.task}</p>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                    `;
                    taskList.appendChild(card);
                });
            });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = taskInput.value;
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        })
        .then(response => response.json())
        .then(() => {
            taskInput.value = '';
            fetchTasks();
        });
    });

    window.deleteTask = (id) => {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchTasks();
        });
    };

    fetchTasks();
});