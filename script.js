// Clock Function
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.innerText = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);

// Task List Functionality
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-table tbody tr').forEach(taskRow => {
        const task = {
            text: taskRow.querySelector('.task-text').innerText,
            duration: taskRow.querySelector('.task-duration').innerText.split(' ')[0],
            restTimes: taskRow.querySelector('.task-rest').innerText.split(' × ')[0],
            restDuration: taskRow.querySelector('.task-rest').innerText.split(' × ')[1],
            completed: taskRow.querySelector('.task-checkbox').checked
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('task-list');
    
    tasks.forEach(task => {
        const activityDurationMinutes = parseInt(task.duration);
        const restTimesCount = parseInt(task.restTimes);
        const restDurationMinutes = parseInt(task.restDuration);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="task-text">${task.text}</td>
            <td class="task-duration">${task.duration} menit</td>
            <td class="task-rest">${task.restTimes} kali × ${task.restDuration} menit</td>
            <td>
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(this)">
            </td>
            <td>
                <button class="edit-btn" onclick="editTask(this)">Edit</button>
                <button class="delete-btn" onclick="deleteTask(this)">Hapus</button>
                <button class="start-task-btn" onclick="startTaskTimer(${activityDurationMinutes}, ${restTimesCount}, ${restDurationMinutes})">Mulai</button>
            </td>
        `;
        
        taskList.appendChild(row);
    });
}

function addTask() {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const activityDurationInput = document.getElementById('activity-duration');
    const restTimesInput = document.getElementById('rest-times');
    const restDurationInput = document.getElementById('rest-duration');
    
    const taskText = newTaskInput.value;
    const activityDuration = activityDurationInput.value;
    const restTimes = restTimesInput.value;
    const restDuration = restDurationInput.value;

    if (taskText === '' || activityDuration === '' || restTimes === '' || restDuration === '') {
        alert('Isi semua kolom!');
        return;
    }

    const activityDurationMinutes = parseInt(activityDuration);
    const restTimesCount = parseInt(restTimes);
    const restDurationMinutes = parseInt(restDuration);

    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="task-text">${taskText}</td>
        <td class="task-duration">${activityDuration} menit</td>
        <td class="task-rest">${restTimes} kali × ${restDuration} menit</td>
        <td>
            <input type="checkbox" class="task-checkbox" onclick="toggleComplete(this)">
        </td>
        <td>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(this)">Hapus</button>
            <button class="start-task-btn" onclick="startTaskTimer(${activityDurationMinutes}, ${restTimesCount}, ${restDurationMinutes})">Mulai</button>
        </td>
    `;

    taskList.appendChild(row);
    newTaskInput.value = '';
    activityDurationInput.value = '';
    restTimesInput.value = '';
    restDurationInput.value = '';

    saveTasks();
}

function toggleComplete(checkbox) {
    const row = checkbox.parentNode.parentNode;
    if (checkbox.checked) {
        row.classList.add('completed');
    } else {
        row.classList.remove('completed');
    }
    saveTasks();
}

function editTask(button) {
    const row = button.parentNode.parentNode;
    const taskTextElement = row.querySelector('.task-text');
    const taskDurationElement = row.querySelector('.task-duration');
    const taskRestElement = row.querySelector('.task-rest');
    
    const newTaskText = prompt('Edit aktivitas:', taskTextElement.innerText);
    const newTaskDuration = prompt('Durasi aktivitas (menit):', taskDurationElement.innerText.split(' ')[0]);
    const newRestTimes = prompt('Jumlah istirahat:', taskRestElement.innerText.split(' × ')[0]);
    const newRestDuration = prompt('Durasi istirahat (menit):', taskRestElement.innerText.split(' × ')[1]);

    if (newTaskText !== null && newTaskText.trim() !== '') {
        taskTextElement.innerText = newTaskText;
    }

    if (newTaskDuration !== null && newTaskDuration.trim() !== '' &&
        newRestTimes !== null && newRestTimes.trim() !== '' &&
        newRestDuration !== null && newRestDuration.trim() !== '') {
        taskDurationElement.innerText = `${newTaskDuration} menit`;
        taskRestElement.innerText = `${newRestTimes} kali × ${newRestDuration} menit`;
        saveTasks();
    }
}

function deleteTask(button) {
    const row = button.parentNode.parentNode;
    row.remove();
    saveTasks();
}

// Timer Functionality
let timerInterval;
let timeLeft = 0;

function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('timer-display').innerText = `${minutes}:${seconds}`;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            document.getElementById('timer-display').innerText = '00:00';
            const endSound = document.getElementById('end-sound');
            endSound.play(); // Play the sound when time is up
            showNotification(); // Show notification
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 0;
    updateTimerDisplay();
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('hidden');
    const endSound = document.getElementById('end-sound');
    endSound.pause(); // Pause the sound
    endSound.currentTime = 0; // Reset the audio to the start
}

function startTaskTimer(activityDuration, restTimes, restDuration) {
    const activityTime = parseInt(activityDuration) * 60; // Convert minutes to seconds
    timeLeft = activityTime;
    updateTimerDisplay();
    startTimer();
}

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);
