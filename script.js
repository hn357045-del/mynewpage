// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Motivational Messages
const messages = [
    "Stay focused and productive! 🌟",
    "You've got this! 💪",
    "One step at a time! 🚀",
    "Keep pushing forward! 🔥",
    "Believe in yourself! ✨",
    "Great job staying on track! 🎯",
    "Productivity is a habit! 📈",
    "Focus on progress, not perfection! 🌈"
];

function updateMotivationalMessage() {
    const messageElement = document.getElementById('motivational-message');
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageElement.textContent = randomMessage;
    messageElement.style.animation = 'none';
    setTimeout(() => {
        messageElement.style.animation = 'fade-in 1s ease-in-out';
    }, 10);
}

setInterval(updateMotivationalMessage, 30000); // Change every 30 seconds

// Clock Functionality
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Analog clock
    const hourDeg = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
    const minuteDeg = now.getMinutes() * 6;
    const secondDeg = now.getSeconds() * 6;
    
    document.getElementById('hour-hand').style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    document.getElementById('minute-hand').style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    document.getElementById('second-hand').style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
}

setInterval(updateClock, 1000);
updateClock();

// Pomodoro Timer
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let currentMode = 'work';

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');
const modeBtns = document.querySelectorAll('.mode-btn');

const modeSettings = {
    'work': 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60
};

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                showNotification(`Time's up! ${currentMode === 'work' ? 'Take a break!' : 'Back to work!'}`, 'success');
                playNotificationSound();
                
                // Auto-switch modes
                if (currentMode === 'work') {
                    switchMode('short-break');
                } else {
                    switchMode('work');
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = modeSettings[currentMode];
    updateTimerDisplay();
}

function switchMode(mode) {
    currentMode = mode;
    timeLeft = modeSettings[mode];
    updateTimerDisplay();
    
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchMode(btn.dataset.mode);
        resetTimer();
    });
});

// Task List
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-task" data-index="${index}">&times;</button>
        `;
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        renderTasks();
        showNotification('Task added successfully!');
    }
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const index = e.target.closest('li').querySelector('.delete-task').dataset.index;
        tasks[index].completed = e.target.checked;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        showNotification(e.target.checked ? 'Task completed! 🎉' : 'Task marked as pending');
    }
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        showNotification('Task deleted');
    }
});

renderTasks();

// Notes
const notesTextarea = document.getElementById('notes-textarea');
const saveNotesBtn = document.getElementById('save-notes-btn');

notesTextarea.value = localStorage.getItem('notes') || '';

saveNotesBtn.addEventListener('click', () => {
    localStorage.setItem('notes', notesTextarea.value);
    showNotification('Notes saved successfully!');
});

// Deadlines
const deadlineTask = document.getElementById('deadline-task');
const deadlineTime = document.getElementById('deadline-time');
const addDeadlineBtn = document.getElementById('add-deadline-btn');
const deadlineList = document.getElementById('deadline-list');

let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];

function renderDeadlines() {
    deadlineList.innerHTML = '';
    deadlines.forEach((deadline, index) => {
        const li = document.createElement('li');
        const deadlineDate = new Date(deadline.time);
        const timeString = deadlineDate.toLocaleString();
        
        li.innerHTML = `
            <div>
                <strong>${deadline.task}</strong>
                <div class="deadline-time">${timeString}</div>
            </div>
            <button class="delete-task" data-index="${index}">&times;</button>
        `;
        deadlineList.appendChild(li);
    });
}

function addDeadline() {
    const task = deadlineTask.value.trim();
    const time = deadlineTime.value;
    
    if (task && time) {
        deadlines.push({ task, time });
        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        deadlineTask.value = '';
        deadlineTime.value = '';
        renderDeadlines();
        showNotification('Deadline added!');
        checkDeadlines();
    }
}

addDeadlineBtn.addEventListener('click', addDeadline);

deadlineList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        const index = e.target.dataset.index;
        deadlines.splice(index, 1);
        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        renderDeadlines();
        showNotification('Deadline removed');
    }
});

function checkDeadlines() {
    const now = new Date();
    deadlines.forEach(deadline => {
        const deadlineTime = new Date(deadline.time);
        const timeDiff = deadlineTime - now;
        
        if (timeDiff <= 0) {
            showNotification(`Deadline reached: ${deadline.task}`, 'warning');
            playNotificationSound();
        } else if (timeDiff <= 3600000) { // 1 hour
            showNotification(`Deadline approaching: ${deadline.task} (${Math.floor(timeDiff / 60000)} minutes left)`, 'warning');
        }
    });
}

setInterval(checkDeadlines, 60000); // Check every minute
renderDeadlines();

// Alarms
const alarmTime = document.getElementById('alarm-time');
const alarmLabel = document.getElementById('alarm-label');
const setAlarmBtn = document.getElementById('set-alarm-btn');
const alarmList = document.getElementById('alarm-list');
const alarmModal = document.getElementById('alarm-modal');
const dismissAlarmBtn = document.getElementById('dismiss-alarm');
const alarmMessage = document.getElementById('alarm-message');

let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
let alarmCheckInterval;

function renderAlarms() {
    alarmList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${alarm.label}</strong>
                <div class="alarm-time">${alarm.time}</div>
            </div>
            <button class="delete-task" data-index="${index}">&times;</button>
        `;
        alarmList.appendChild(li);
    });
}

function addAlarm() {
    const time = alarmTime.value;
    const label = alarmLabel.value.trim() || 'Alarm';
    
    if (time) {
        alarms.push({ time, label });
        localStorage.setItem('alarms', JSON.stringify(alarms));
        alarmTime.value = '';
        alarmLabel.value = '';
        renderAlarms();
        showNotification('Alarm set!');
        startAlarmChecking();
    }
}

setAlarmBtn.addEventListener('click', addAlarm);

alarmList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task')) {
        const index = e.target.dataset.index;
        alarms.splice(index, 1);
        localStorage.setItem('alarms', JSON.stringify(alarms));
        renderAlarms();
        showNotification('Alarm removed');
    }
});

function startAlarmChecking() {
    clearInterval(alarmCheckInterval);
    alarmCheckInterval = setInterval(() => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        
        alarms.forEach(alarm => {
            if (alarm.time === currentTime) {
                triggerAlarm(alarm.label);
            }
        });
    }, 1000);
}

function triggerAlarm(label) {
    alarmMessage.textContent = `⏰ ${label}`;
    alarmModal.classList.add('show');
    playNotificationSound();
}

dismissAlarmBtn.addEventListener('click', () => {
    alarmModal.classList.remove('show');
});

startAlarmChecking();
renderAlarms();

// Notification System
const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback: no sound
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateMotivationalMessage();
    // Randomize particle positions
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * 8;
        particle.style.left = randomLeft + '%';
        particle.style.animationDelay = randomDelay + 's';
    });

    // Add random floating to bears
    const bears = document.querySelectorAll('.bear');
    bears.forEach(bear => {
        const randomDelay = Math.random() * 4;
        bear.style.animationDelay = randomDelay + 's';
    });
});