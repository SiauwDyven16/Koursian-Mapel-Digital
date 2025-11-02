// Import Firebase and navigation
import { initializeAllNavigation } from './navigation.js';
import { redirectBasedOnAuth, isUserAuthenticated, getCurrentUserData } from './firebase-config.js';

// Video Lesson JavaScript

// Mobile Menu Toggle
function initMobileMenu() {
  // Create menu toggle button
  const menuToggle = document.createElement("button");
  menuToggle.className = "menu-toggle";
  menuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
  document.body.appendChild(menuToggle);

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);

  const sidebar = document.querySelector(".sidebar");

  // Toggle menu
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
    menuToggle.classList.toggle("active");
  });

  // Close menu when clicking overlay
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
    menuToggle.classList.remove("active");
  });

  // Close menu when clicking nav item
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 360) {
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
        menuToggle.classList.remove("active");
      }
    });
  });
}

// Navigation Active State
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all items
      navItems.forEach((nav) => nav.classList.remove("active"));

      // Add active class to clicked item
      item.classList.add("active");
    });
  });
}

// Video Player Management
function initVideoPlayer() {
  const videoPlayer = document.querySelector('.video-player');
  const playButton = document.querySelector('.play-button');
  const progressBar = document.querySelector('.progress-bar');
  const volumeSlider = document.querySelector('.volume-slider');
  const fullscreenButton = document.querySelector('.fullscreen-button');
  const speedButton = document.querySelector('.speed-button');
  
  if (!videoPlayer) return;
  
  // Play/Pause functionality
  if (playButton) {
    playButton.addEventListener('click', () => {
      if (videoPlayer.paused) {
        videoPlayer.play();
        playButton.innerHTML = '⏸️';
        playButton.classList.add('playing');
      } else {
        videoPlayer.pause();
        playButton.innerHTML = '▶️';
        playButton.classList.remove('playing');
      }
    });
  }
  
  // Progress bar
  if (progressBar) {
    videoPlayer.addEventListener('timeupdate', () => {
      const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
      progressBar.style.width = progress + '%';
    });
    
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      videoPlayer.currentTime = percentage * videoPlayer.duration;
    });
  }
  
  // Volume control
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      videoPlayer.volume = e.target.value / 100;
    });
  }
  
  // Fullscreen
  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', () => {
      if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
      } else if (videoPlayer.webkitRequestFullscreen) {
        videoPlayer.webkitRequestFullscreen();
      } else if (videoPlayer.msRequestFullscreen) {
        videoPlayer.msRequestFullscreen();
      }
    });
  }
  
  // Playback speed
  if (speedButton) {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    let currentSpeedIndex = 2; // Default to 1x speed
    
    speedButton.addEventListener('click', () => {
      currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
      videoPlayer.playbackRate = speeds[currentSpeedIndex];
      speedButton.textContent = speeds[currentSpeedIndex] + 'x';
      showToast(`Playback speed: ${speeds[currentSpeedIndex]}x`, 'info');
    });
  }
}

// Lesson Navigation
function initLessonNavigation() {
  const lessonItems = document.querySelectorAll('.lesson-item');
  const prevButton = document.querySelector('.prev-lesson-btn');
  const nextButton = document.querySelector('.next-lesson-btn');
  
  let currentLessonIndex = 0;
  
  // Lesson item click
  lessonItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Remove active class from all items
      lessonItems.forEach(lesson => lesson.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Update current lesson index
      currentLessonIndex = index;
      
      // Load lesson content
      loadLessonContent(item.dataset.lessonId);
    });
  });
  
  // Previous lesson
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentLessonIndex > 0) {
        currentLessonIndex--;
        lessonItems[currentLessonIndex].click();
      }
    });
  }
  
  // Next lesson
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentLessonIndex < lessonItems.length - 1) {
        currentLessonIndex++;
        lessonItems[currentLessonIndex].click();
      }
    });
  }
}

function loadLessonContent(lessonId) {
  // Simulate loading lesson content
  showToast(`Loading lesson: ${lessonId}`, 'info');
  
  // Update video source (in a real app, this would load from a database)
  const videoPlayer = document.querySelector('.video-player');
  if (videoPlayer) {
    // videoPlayer.src = `path/to/lesson/${lessonId}.mp4`;
    showToast(`Lesson ${lessonId} loaded successfully`, 'success');
  }
}

// Note Taking System
function initNoteTaking() {
  const noteInput = document.querySelector('.note-input');
  const saveNoteButton = document.querySelector('.save-note-btn');
  const notesList = document.querySelector('.notes-list');
  
  if (!noteInput || !saveNoteButton || !notesList) return;
  
  // Save note
  saveNoteButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText) {
      const note = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toLocaleTimeString(),
        lessonId: getCurrentLessonId()
      };
      
      saveNoteToStorage(note);
      displayNote(note);
      noteInput.value = '';
      showToast('Note saved successfully!', 'success');
    }
  });
  
  // Load existing notes
  loadNotes();
}

function saveNoteToStorage(note) {
  const notes = JSON.parse(localStorage.getItem('videoNotes') || '[]');
  notes.push(note);
  localStorage.setItem('videoNotes', JSON.stringify(notes));
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('videoNotes') || '[]');
  const currentLessonId = getCurrentLessonId();
  
  // Filter notes for current lesson
  const lessonNotes = notes.filter(note => note.lessonId === currentLessonId);
  
  // Display notes
  notesList.innerHTML = '';
  lessonNotes.forEach(note => displayNote(note));
}

function displayNote(note) {
  const noteElement = document.createElement('div');
  noteElement.className = 'note-item';
  noteElement.innerHTML = `
    <div class="note-content">${note.text}</div>
    <div class="note-meta">
      <span class="note-time">${note.timestamp}</span>
      <button class="delete-note-btn" data-note-id="${note.id}">Delete</button>
    </div>
  `;
  
  notesList.appendChild(noteElement);
  
  // Add delete functionality
  const deleteBtn = noteElement.querySelector('.delete-note-btn');
  deleteBtn.addEventListener('click', () => {
    deleteNote(note.id);
    noteElement.remove();
  });
}

function deleteNote(noteId) {
  const notes = JSON.parse(localStorage.getItem('videoNotes') || '[]');
  const updatedNotes = notes.filter(note => note.id !== noteId);
  localStorage.setItem('videoNotes', JSON.stringify(updatedNotes));
  showToast('Note deleted', 'info');
}

function getCurrentLessonId() {
  const activeLesson = document.querySelector('.lesson-item.active');
  return activeLesson ? activeLesson.dataset.lessonId : 'default';
}

// Quiz System
function initQuizSystem() {
  const quizButton = document.querySelector('.quiz-button');
  const quizModal = document.querySelector('.quiz-modal');
  const quizQuestions = document.querySelectorAll('.quiz-question');
  const submitQuizButton = document.querySelector('.submit-quiz-btn');
  
  if (!quizButton || !quizModal) return;
  
  // Open quiz
  quizButton.addEventListener('click', () => {
    quizModal.style.display = 'flex';
    startQuiz();
  });
  
  // Close quiz
  const closeQuizButton = quizModal.querySelector('.close-quiz-btn');
  if (closeQuizButton) {
    closeQuizButton.addEventListener('click', () => {
      quizModal.style.display = 'none';
    });
  }
  
  // Submit quiz
  if (submitQuizButton) {
    submitQuizButton.addEventListener('click', () => {
      submitQuiz();
    });
  }
}

function startQuiz() {
  const quizQuestions = document.querySelectorAll('.quiz-question');
  quizQuestions.forEach((question, index) => {
    question.style.display = index === 0 ? 'block' : 'none';
  });
  
  showToast('Quiz started! Answer all questions to complete.', 'info');
}

function submitQuiz() {
  const answers = [];
  const quizQuestions = document.querySelectorAll('.quiz-question');
  
  quizQuestions.forEach(question => {
    const selectedAnswer = question.querySelector('input:checked');
    if (selectedAnswer) {
      answers.push(selectedAnswer.value);
    }
  });
  
  if (answers.length === quizQuestions.length) {
    const score = calculateScore(answers);
    showQuizResults(score);
  } else {
    showToast('Please answer all questions before submitting.', 'error');
  }
}

function calculateScore(answers) {
  // Simple scoring system - in a real app, this would check against correct answers
  const correctAnswers = ['A', 'B', 'C', 'A']; // Example correct answers
  let score = 0;
  
  answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score++;
    }
  });
  
  return Math.round((score / correctAnswers.length) * 100);
}

function showQuizResults(score) {
  const quizModal = document.querySelector('.quiz-modal');
  const quizContent = quizModal.querySelector('.quiz-content');
  
  quizContent.innerHTML = `
    <div class="quiz-results">
      <h3>Quiz Results</h3>
      <div class="score-display">
        <span class="score">${score}%</span>
        <span class="score-text">${score >= 70 ? 'Great job!' : 'Keep studying!'}</span>
      </div>
      <button class="close-quiz-btn">Close</button>
    </div>
  `;
  
  // Add close functionality
  const closeBtn = quizContent.querySelector('.close-quiz-btn');
  closeBtn.addEventListener('click', () => {
    quizModal.style.display = 'none';
  });
  
  showToast(`Quiz completed! Score: ${score}%`, score >= 70 ? 'success' : 'info');
}

// Bookmark System
function initBookmarkSystem() {
  const bookmarkButton = document.querySelector('.bookmark-btn');
  
  if (!bookmarkButton) return;
  
  bookmarkButton.addEventListener('click', () => {
    const lessonId = getCurrentLessonId();
    const timestamp = document.querySelector('.video-player')?.currentTime || 0;
    
    const bookmark = {
      id: Date.now(),
      lessonId: lessonId,
      timestamp: timestamp,
      title: `Bookmark at ${formatTime(timestamp)}`,
      createdAt: new Date().toISOString()
    };
    
    saveBookmark(bookmark);
    bookmarkButton.classList.add('bookmarked');
    showToast('Bookmark saved!', 'success');
  });
}

function saveBookmark(bookmark) {
  const bookmarks = JSON.parse(localStorage.getItem('videoBookmarks') || '[]');
  bookmarks.push(bookmark);
  localStorage.setItem('videoBookmarks', JSON.stringify(bookmarks));
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Responsive Adjustments
function handleResize() {
  const width = window.innerWidth;

  if (width <= 360) {
    document.body.classList.add("mobile");
  } else if (width <= 768) {
    document.body.classList.remove("mobile");
    document.body.classList.add("tablet");
  } else {
    document.body.classList.remove("mobile", "tablet");
  }
}

// Scroll to Top
function initScrollToTop() {
  const scrollBtn = document.createElement("button");
  scrollBtn.className = "scroll-to-top";
  scrollBtn.innerHTML = "↑";
  scrollBtn.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #704FE6;
        color: white;
        border: none;
        font-size: 32px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
        display: none;
    `;

  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = "block";
      setTimeout(() => (scrollBtn.style.opacity = "1"), 10);
    } else {
      scrollBtn.style.opacity = "0";
      setTimeout(() => (scrollBtn.style.display = "none"), 300);
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Toast Notifications
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${
          type === "success"
            ? "#c7ffc9ff"
            : type === "error"
            ? "#f44336"
            : "#704FE6"
        };
        font-size: 24px;
        font-weight: 500;
        color: #4caf50;
        padding: 24px 48px;
        border-radius: 32px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS animations and styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      top: 0px;
      opacity: 0;
    }
    to {
      top: 80px;
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      top: 80px;
      opacity: 1;
    }
    to {
      top: 0px;
      opacity: 0;
    }
  }

  .scroll-to-top {
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .scroll-to-top:hover {
    background: #5a3eb8 !important;
    transform: scale(1.1);
  }

  .play-button.playing {
    background: #ff4444;
  }

  .progress-bar {
    cursor: pointer;
    transition: width 0.1s ease;
  }

  .lesson-item.active {
    background: #704FE6;
    color: white;
  }

  .lesson-item:hover {
    background: #dec8fe;
    color: #704fe6;
  }

  .note-item {
    background: #f5f5f5;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    border-left: 4px solid #704FE6;
  }

  .note-content {
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .note-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #666;
  }

  .delete-note-btn {
    background: #ff4444;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  .quiz-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .quiz-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .quiz-question {
    margin-bottom: 20px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .quiz-question h4 {
    margin-bottom: 15px;
    color: #333;
  }

  .quiz-option {
    margin: 10px 0;
    padding: 10px;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .quiz-option:hover {
    background: #f0f0f0;
  }

  .quiz-option input[type="radio"] {
    margin-right: 10px;
  }

  .quiz-results {
    text-align: center;
  }

  .score-display {
    margin: 20px 0;
  }

  .score {
    font-size: 48px;
    font-weight: bold;
    color: #704FE6;
    display: block;
  }

  .score-text {
    font-size: 18px;
    color: #666;
  }

  .bookmark-btn.bookmarked {
    background: #ff4444;
    color: white;
  }

  .bookmark-btn.bookmarked::after {
    content: " ✓";
  }

  .video-controls {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
  }

  .video-controls button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .video-controls button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .progress-container {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    cursor: pointer;
  }

  .progress-bar {
    height: 100%;
    background: #704FE6;
    border-radius: 3px;
    width: 0%;
  }

  .volume-slider {
    width: 80px;
  }

  .speed-button {
    min-width: 50px;
  }
`;
document.head.appendChild(style);

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Video Lesson page initialized");
  // Handle auth/redirects consistently (avoids race conditions)
  redirectBasedOnAuth();

  // Initialize video lesson features
  initMobileMenu();
  initNavigation();
  initVideoPlayer();
  initLessonNavigation();
  initNoteTaking();
  initQuizSystem();
  initBookmarkSystem();
  initScrollToTop();

  // Initialize navigation and hover animations
  initializeAllNavigation();

  // Handle resize
  handleResize();
  window.addEventListener("resize", handleResize);

  // Show welcome toast with user data
  const userData = getCurrentUserData();
  const userName = userData?.displayName || userData?.username || 'User';
  setTimeout(() => {
    showToast(`Welcome to Video Lessons, ${userName}!`, "success");
  }, 500);
});

// Export functions for potential use elsewhere
window.videoLessonApp = {
  showToast,
  loadLessonContent,
  saveNoteToStorage,
  deleteNote,
  calculateScore,
  saveBookmark,
  formatTime,
};
