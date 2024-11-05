interface Task {
    id: number;
    text: string;
    completed: boolean;
}

let tasks: Task[] = []; // Array to store tasks

// Function to load tasks from localStorage
function loadTasks(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks); // Parse the stored JSON and assign it to tasks array
    }
    displayTasks('all'); // Display tasks once loaded
}

// Function to add a task
function addTask(): void {
    const inputField = document.getElementById('task-input') as HTMLInputElement;
    const taskText = inputField.value.trim();

    if (taskText === "") {
        return; // Don't add empty tasks
    }

    // Create a task object
    const task: Task = {
        id: Date.now(), // Unique ID based on timestamp
        text: taskText,
        completed: false
    };

    tasks.push(task);  // Store the task in tasks array
    inputField.value = ''; // Clear the input field

    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTasks('all');  // Refresh and display all tasks
}

// Function to display tasks based on the filter
function displayTasks(filter: 'all' | 'completed' | 'incomplete'): void {
    const taskList = document.getElementById('task-list') as HTMLUListElement;
    taskList.innerHTML = ''; // Clear the current list

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true; // For 'all', return all tasks
    });

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.toggle('completed', task.completed);
        taskItem.setAttribute('data-id', task.id.toString());

        taskItem.innerHTML = `
            <input type="radio" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${task.id})" />
            <span onclick="editTask(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
        `;

        taskList.appendChild(taskItem);
    });
}

// Function to toggle completion status using radio button
function toggleComplete(taskId: number): void {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed; // Toggle the completed status
        localStorage.setItem('tasks', JSON.stringify(tasks));  // Update tasks in localStorage
        displayTasks('all'); // Refresh the list
    }
}

// Function to delete a task
function deleteTask(taskId: number): void {
    tasks = tasks.filter(task => task.id !== taskId); // Remove the task by ID
    localStorage.setItem('tasks', JSON.stringify(tasks));  // Update tasks in localStorage
    displayTasks('all'); // Refresh the list
}

// Function to delete all tasks
function clearAllTasks(): void {
    tasks = []; // Clear all tasks from the list
    localStorage.setItem('tasks', JSON.stringify(tasks));  // Clear tasks in localStorage
    displayTasks('all'); // Refresh the list
}

// Function to filter tasks based on their status (All, Completed, Incomplete)
function filterTasks(filter: 'all' | 'completed' | 'incomplete'): void {
    displayTasks(filter); // Display tasks based on the selected filter
}

// Function to edit a task
function editTask(taskId: number): void {
    const task = tasks.find(task => task.id === taskId);
    const taskList = document.getElementById('task-list') as HTMLUListElement;
    const taskItem = taskList.querySelector(`li[data-id='${taskId}']`)!;
    const span = taskItem.querySelector('span')!;
    const input = document.createElement('input');
    
    input.value = task!.text;
    taskItem.classList.add('editing');
    span.style.display = 'none'; // Hide the span
    taskItem.appendChild(input);

    // Listen for Enter key to save changes
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            task!.text = input.value;
            taskItem.classList.remove('editing');
            span.style.display = 'inline-block'; // Show the span
            span.textContent = input.value;
            localStorage.setItem('tasks', JSON.stringify(tasks));  // Update tasks in localStorage
            displayTasks('all'); // Refresh the list
        }
    });

    // Listen for clicking outside to save changes
    input.addEventListener('blur', () => {
        task!.text = input.value;
        taskItem.classList.remove('editing');
        span.style.display = 'inline-block'; // Show the span
        span.textContent = input.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));  // Update tasks in localStorage
        displayTasks('all'); // Refresh the list
    });
}

// Function to listen for the Enter key to add tasks
function listenForEnterKey(): void {
    const inputField = document.getElementById('task-input') as HTMLInputElement;
    
    // Listen for keyup events on the input field
    inputField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addTask(); // Add the task when Enter is pressed
        }
    });
}

// Call the functions to initialize the app
listenForEnterKey();  // Enable Enter key functionality
loadTasks();  // Load tasks from localStorage

localStorage.removeItem('tasks');

