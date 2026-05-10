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

// Smooth Scroll Navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Progress Bars Animation
function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        const percent = fill.getAttribute('data-percent');
        fill.style.width = percent + '%';
    });
}

// Trigger animation when skills section is in view
const skillsSection = document.getElementById('skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(skillsSection);

// Notes System
const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('notes-list');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <span>${note.text}</span>
            <button class="delete-btn" data-index="${index}">&times;</button>
        `;
        notesList.appendChild(noteElement);
    });
}

function addNote() {
    const text = noteInput.value.trim();
    if (text) {
        notes.push({ text, id: Date.now() });
        localStorage.setItem('notes', JSON.stringify(notes));
        noteInput.value = '';
        renderNotes();
        showNotification('Đã thêm ghi chú mới!');
    }
}

addNoteBtn.addEventListener('click', addNote);
noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNote();
    }
});

notesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        showNotification('Đã xóa ghi chú!');
    }
});

renderNotes();

// Deadline Timer
const deadlineInput = document.getElementById('deadline-input');
const setDeadlineBtn = document.getElementById('set-deadline-btn');
const countdownElement = document.getElementById('countdown');

let deadlineInterval;

function setDeadline() {
    const deadline = new Date(deadlineInput.value);
    if (deadline > new Date()) {
        localStorage.setItem('deadline', deadline.toISOString());
        startCountdown();
        showNotification('Đã đặt deadline!');
    } else {
        showNotification('Vui lòng chọn thời gian trong tương lai!', 'error');
    }
}

function startCountdown() {
    clearInterval(deadlineInterval);
    const deadline = new Date(localStorage.getItem('deadline'));
    
    deadlineInterval = setInterval(() => {
        const now = new Date();
        const diff = deadline - now;
        
        if (diff <= 0) {
            countdownElement.innerHTML = 'Đã hết hạn!';
            countdownElement.style.color = '#ff6b6b';
            clearInterval(deadlineInterval);
            showNotification('Deadline đã đến!', 'warning');
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        
        // Warning when less than 1 hour
        if (diff < 3600000) { // 1 hour in milliseconds
            countdownElement.style.color = '#ff6b6b';
            if (diff < 300000) { // 5 minutes
                showNotification('Sắp đến hạn nộp bài!', 'warning');
            }
        } else {
            countdownElement.style.color = '#ffb6c1';
        }
    }, 1000);
}

setDeadlineBtn.addEventListener('click', setDeadline);

// Load saved deadline
const savedDeadline = localStorage.getItem('deadline');
if (savedDeadline) {
    deadlineInput.value = new Date(savedDeadline).toISOString().slice(0, 16);
    startCountdown();
}

// Notification System
const notification = document.getElementById('notification');

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fade-in Animation on Scroll
const fadeElements = document.querySelectorAll('section > .container');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Any initialization code here
});