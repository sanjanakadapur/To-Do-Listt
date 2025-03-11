document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const tasksList = document.getElementById('tasksList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');

    // Tasks array to store tasks
    let tasks = [];

    // Load tasks from localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Render tasks to the DOM
    function renderTasks() {
        // Clear the current list
        tasksList.innerHTML = '';

        // Update task count
        const totalTasks = tasks.length;
        taskCount.textContent = `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;

        // If no tasks, show empty message
        if (tasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-list';
            emptyMessage.textContent = 'No tasks yet. Add a task to get started!';
            tasksList.appendChild(emptyMessage);
            return;
        }

        // Render each task
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) {
                taskItem.classList.add('completed');
            }

            taskItem.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                </div>
                <i class="fas fa-trash task-delete" data-index="${index}"></i>
            `;

            tasksList.appendChild(taskItem);
        });
    }

    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText) {
            tasks.push({
                text: taskText,
                completed: false,
                createdAt: new Date().getTime()
            });

            saveTasks();
            renderTasks();

            // Clear input field
            taskInput.value = '';
            taskInput.focus();
        }
    }

    // Toggle task completion
    function toggleTaskComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    // Delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // Clear completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }

    // Clear all tasks
    function clearAllTasks() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }

    // Event Listeners

    // Add task when button is clicked
    addTaskBtn.addEventListener('click', addTask);

    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Handle task checkbox toggle and delete button clicks
    tasksList.addEventListener('click', function(e) {
        // Handle checkbox clicks
        if (e.target.classList.contains('task-checkbox')) {
            const index = parseInt(e.target.dataset.index);
            toggleTaskComplete(index);
        }

        // Handle delete clicks
        if (e.target.classList.contains('task-delete')) {
            const index = parseInt(e.target.dataset.index);
            deleteTask(index);
        }
    });

    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    // Clear all tasks
    clearAllBtn.addEventListener('click', clearAllTasks);

    // Load tasks on page load
    loadTasks();
});