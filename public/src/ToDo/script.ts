// Task Interface to define the structure of a task
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

// TaskManager class to encapsulate task logic
class TaskManager {
    private tasks: Task[] = [];
    private taskListElement: HTMLElement;
    private inputField: HTMLInputElement;

    constructor(taskListElementId: string, inputFieldId: string) {
        this.taskListElement = document.getElementById(taskListElementId) as HTMLElement;
        this.inputField = document.getElementById(inputFieldId) as HTMLInputElement;
        this.listenForEnterKey();
    }

    // Display tasks based on the selected filter
    private displayTasks(filter: 'all' | 'completed' | 'incomplete'): void {
        this.taskListElement.innerHTML = ''; // Clear the current list

        const filteredTasks = this.tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'incomplete') return !task.completed;
            return true; // For 'all', return all tasks
        });

        filteredTasks.forEach(task => {
            const taskItem = this.createTaskItem(task);
            this.taskListElement.appendChild(taskItem);
        });
    }

    // Create HTML structure for a task item
    private createTaskItem(task: Task): HTMLElement {
        const taskItem = document.createElement('li');
        taskItem.classList.toggle('completed', task.completed);
        taskItem.setAttribute('data-id', task.id.toString());

        taskItem.innerHTML = `
            <input type="radio" ${task.completed ? 'checked' : ''} onclick="taskManager.toggleComplete(${task.id})" />
            <span onclick="taskManager.editTask(${task.id})">${task.text}</span>
            <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">X</button>
        `;

        return taskItem;
    }

    // Add a new task
    public addTask(): void {
        const taskText = this.inputField.value.trim();

        if (taskText === "") {
            return; // Don't add empty tasks
        }

        // Create a task object
        const task: Task = {
            id: Date.now(), // Unique ID based on timestamp
            text: taskText,
            completed: false
        };

        this.tasks.push(task);
        this.inputField.value = ''; // Clear the input field
        this.displayTasks('all'); // Refresh the list
    }

    // Toggle completion status of a task
    public toggleComplete(taskId: number): void {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed; // Toggle the completed status
            this.displayTasks('all'); // Refresh the list
        }
    }

    // Delete a task
    public deleteTask(taskId: number): void {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.displayTasks('all');
    }

    // Edit an existing task
    public editTask(taskId: number): void {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            const taskItem = this.taskListElement.querySelector(`li[data-id='${taskId}']`) as HTMLElement;
            const span = taskItem.querySelector('span')!;
            const input = document.createElement('input');

            input.value = task.text;
            taskItem.classList.add('editing');
            span.style.display = 'none'; // Hide the span
            taskItem.appendChild(input);

            // Listen for Enter key to save changes
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    task.text = input.value;
                    taskItem.classList.remove('editing');
                    span.style.display = 'inline-block'; // Show the span
                    span.textContent = input.value;
                    this.displayTasks('all'); // Refresh the list
                }
            });

            // Listen for clicking outside to save changes
            input.addEventListener('blur', () => {
                task.text = input.value;
                taskItem.classList.remove('editing');
                span.style.display = 'inline-block'; // Show the span
                span.textContent = input.value;
                this.displayTasks('all'); // Refresh the list
            });
        }
    }

    // Listen for the Enter key to add tasks
    private listenForEnterKey(): void {
        this.inputField.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.addTask(); // Add the task when Enter is pressed
            }
        });
    }

    // Clear all tasks
    public clearAllTasks(): void {
        this.tasks = [];
        this.displayTasks('all'); // Refresh the list
    }
}

// Initialize TaskManager
const taskManager = new TaskManager('task-list', 'task-input');

// Global function to interact with TaskManager
function clearAllTasks(): void {
    taskManager.clearAllTasks();
}