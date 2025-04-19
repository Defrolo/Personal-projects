document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const categorySelect = document.getElementById('category-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterSelect = document.getElementById('filter-select');
    const filterCategorySelect = document.getElementById('filter-category-select');

    // --- Data Persistence (localStorage) ---

    const getTasks = () => {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    let tasks = getTasks();

    // --- Render Tasks ---

    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear existing list
        const currentFilter = filterSelect.value;
        const currentCategoryFilter = filterCategorySelect.value;

        const filteredTasks = tasks.filter(task => {
            // Status filter
            const statusMatch = currentFilter === 'all' ||
                                (currentFilter === 'completed' && task.completed) ||
                                (currentFilter === 'active' && !task.completed);

            // Category filter
            const categoryMatch = currentCategoryFilter === 'all' || task.category === currentCategoryFilter;

            return statusMatch && categoryMatch;
        });


        if (filteredTasks.length === 0) {
             if (tasks.length > 0) {
                // Filters applied, but no matching tasks
                taskList.innerHTML = '<li class="no-tasks-message">No tasks match the current filters.</li>';
            } else {
                // No tasks at all
                 taskList.innerHTML = '<li class="no-tasks-message">No tasks added yet.</li>';
            }
            return;
        }


        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            if (task.completed) {
                li.classList.add('completed');
            }

            // Task Content Div
            const taskContentDiv = document.createElement('div');
            taskContentDiv.classList.add('task-content');

            // Task Text Span
            const taskTextSpan = document.createElement('span');
            taskTextSpan.classList.add('task-text');
            taskTextSpan.textContent = task.text;
            taskTextSpan.addEventListener('dblclick', () => enableEditing(li, task.id)); // Double click to edit

            // Edit Input
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.classList.add('edit-input');
            editInput.value = task.text;
            editInput.style.display = 'none'; // Initially hidden
            editInput.addEventListener('blur', () => saveEdit(li, task.id, editInput));
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit(li, task.id, editInput);
                } else if (e.key === 'Escape') {
                    cancelEdit(li, editInput);
                }
            });


            // Category Badge
            const categoryBadge = document.createElement('span');
            categoryBadge.classList.add('category-badge');
            categoryBadge.textContent = task.category;

            taskContentDiv.appendChild(taskTextSpan);
            taskContentDiv.appendChild(editInput); // Add edit input
            taskContentDiv.appendChild(categoryBadge);


            // Actions Div
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            // Complete Button
            const completeBtn = document.createElement('button');
            completeBtn.innerHTML = '&#x2714;'; // Checkmark
            completeBtn.classList.add('complete-btn');
            completeBtn.setAttribute('aria-label', task.completed ? 'Mark as active' : 'Mark as complete');
            completeBtn.addEventListener('click', () => toggleComplete(task.id));

            // Edit Button
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '&#x270E;'; // Pencil
            editBtn.classList.add('edit-btn');
            editBtn.setAttribute('aria-label', 'Edit task');
            editBtn.addEventListener('click', () => enableEditing(li, task.id));

            // Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '&#x1F5D1;'; // Trash can
            deleteBtn.classList.add('delete-btn');
            deleteBtn.setAttribute('aria-label', 'Delete task');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            actionsDiv.appendChild(completeBtn);
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(taskContentDiv);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
    };

    // --- CRUD Operations ---

    // Create (Add Task)
    const addTask = () => {
        const taskText = taskInput.value.trim();
        const taskCategory = categorySelect.value;

        if (taskText === '') {
            alert('Please enter a task description.');
            taskInput.focus();
            return;
        }

        const newTask = {
            id: Date.now().toString(), // Simple unique ID
            text: taskText,
            category: taskCategory,
            completed: false
        };

        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();

        taskInput.value = ''; // Clear input
        categorySelect.value = 'General'; // Reset category
        taskInput.focus();
    };

    // Update (Toggle Complete)
    const toggleComplete = (id) => {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks(tasks);
        renderTasks();
    };

     // Update (Edit Task Text)
    const enableEditing = (li, id) => {
        const taskTextSpan = li.querySelector('.task-text');
        const editInput = li.querySelector('.edit-input');

        if (li.classList.contains('editing')) return; // Already editing

        li.classList.add('editing');
        taskTextSpan.style.display = 'none';
        editInput.style.display = 'inline-block';
        editInput.value = taskTextSpan.textContent; // Ensure current value
        editInput.focus();
        editInput.select(); // Select text
    };

    const saveEdit = (li, id, input) => {
        const newText = input.value.trim();
        const taskTextSpan = li.querySelector('.task-text');

        if (newText === '') {
            // If new text is empty, maybe delete or revert? For now, revert.
             alert("Task text cannot be empty. Reverting changes.");
             cancelEdit(li, input);
             return;
        }

        if (li.classList.contains('editing')) { // Only save if in editing mode
             tasks = tasks.map(task =>
                task.id === id ? { ...task, text: newText } : task
            );
            saveTasks(tasks);
            taskTextSpan.textContent = newText; // Update span immediately for visual feedback
            cancelEdit(li, input); // Exit editing mode
            // No need to call renderTasks() fully unless filters change text visibility
        }
    };

     const cancelEdit = (li, input) => {
        const taskTextSpan = li.querySelector('.task-text');
        li.classList.remove('editing');
        input.style.display = 'none';
        taskTextSpan.style.display = 'inline-block'; // Or 'flex' if it was display:flex
    };


    // Delete Task
    const deleteTask = (id) => {
         if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks(tasks);
            renderTasks();
        }
    };

    // --- Event Listeners ---

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterSelect.addEventListener('change', renderTasks);
    filterCategorySelect.addEventListener('change', renderTasks);

    // --- Initial Load ---
    renderTasks();
});
