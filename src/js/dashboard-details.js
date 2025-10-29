// Import Firebase and navigation
import { initializeAllNavigation } from './navigation.js';
import { redirectBasedOnAuth, isUserAuthenticated, getCurrentUserData } from './firebase-config.js';

// Dashboard Details JavaScript

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

// Video Player Controls
function initVideoPlayer() {
  const videoPlayer = document.querySelector('.video-player');
  const playButton = document.querySelector('.play-button');
  const progressBar = document.querySelector('.progress-bar');
  const volumeSlider = document.querySelector('.volume-slider');
  const fullscreenButton = document.querySelector('.fullscreen-button');

  if (videoPlayer && playButton) {
    playButton.addEventListener('click', () => {
      if (videoPlayer.paused) {
        videoPlayer.play();
        playButton.innerHTML = '⏸️';
                } else {
        videoPlayer.pause();
        playButton.innerHTML = '▶️';
      }
    });
  }

  if (videoPlayer && progressBar) {
    videoPlayer.addEventListener('timeupdate', () => {
      const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
      progressBar.style.width = progress + '%';
    });

    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickTime = (clickX / width) * videoPlayer.duration;
      videoPlayer.currentTime = clickTime;
    });
  }

  if (videoPlayer && volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      videoPlayer.volume = e.target.value / 100;
    });
  }

  if (videoPlayer && fullscreenButton) {
    fullscreenButton.addEventListener('click', () => {
      if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
            }
        });
    }
}

// Course Progress Tracking
function initProgressTracking() {
  const progressItems = document.querySelectorAll('.progress-item');
  
  progressItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Mark as completed
      item.classList.add('completed');
      
      // Update progress percentage
      const completedItems = document.querySelectorAll('.progress-item.completed').length;
      const totalItems = progressItems.length;
      const percentage = (completedItems / totalItems) * 100;
      
      const progressBar = document.querySelector('.course-progress-bar');
      if (progressBar) {
        progressBar.style.width = percentage + '%';
      }
      
      // Show completion toast
      showToast(`Lesson ${index + 1} completed!`, 'success');
    });
  });
}

// Discussion/Comments System
function initDiscussionSystem() {
  const commentForm = document.querySelector('.comment-form');
  const commentList = document.querySelector('.comment-list');
  
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const commentText = commentForm.querySelector('textarea').value;
      if (commentText.trim()) {
        addComment(commentText);
        commentForm.querySelector('textarea').value = '';
      }
        });
    }
}

function addComment(text) {
  const commentList = document.querySelector('.comment-list');
  if (!commentList) return;
  
  const userData = getCurrentUserData();
  const userName = userData?.displayName || userData?.username || 'Anonymous';
  
  const commentElement = document.createElement('div');
  commentElement.className = 'comment-item';
  commentElement.innerHTML = `
    <div class="comment-avatar">
      <span>${userName.charAt(0).toUpperCase()}</span>
    </div>
    <div class="comment-content">
      <div class="comment-header">
        <span class="comment-author">${userName}</span>
        <span class="comment-time">Just now</span>
      </div>
      <div class="comment-text">${text}</div>
    </div>
  `;
  
  commentList.appendChild(commentElement);
  commentList.scrollTop = commentList.scrollHeight;
  
  showToast('Comment added!', 'success');
}

// Resource Downloads
function initResourceDownloads() {
  const downloadButtons = document.querySelectorAll('.download-btn');
  
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const resourceName = btn.dataset.resource;
      showToast(`Downloading ${resourceName}...`, 'info');
      
      // Simulate download
      setTimeout(() => {
        showToast(`${resourceName} downloaded successfully!`, 'success');
      }, 2000);
    });
  });
}

// Quiz/Assessment System
function initQuizSystem() {
  const quizForm = document.querySelector('.quiz-form');
  const submitQuizBtn = document.querySelector('.submit-quiz-btn');
  
  if (quizForm && submitQuizBtn) {
    submitQuizBtn.addEventListener('click', () => {
      const answers = [];
      const questions = quizForm.querySelectorAll('.quiz-question');
      
      questions.forEach((question, index) => {
        const selectedAnswer = question.querySelector('input:checked');
        if (selectedAnswer) {
          answers.push({
            questionIndex: index,
            answer: selectedAnswer.value
          });
        }
      });
      
      if (answers.length === questions.length) {
        // Calculate score
        const score = calculateQuizScore(answers);
        showQuizResults(score, questions.length);
      } else {
        showToast('Please answer all questions!', 'error');
      }
    });
  }
}

function calculateQuizScore(answers) {
  // Simple scoring system - in real app, this would check against correct answers
  return Math.floor(Math.random() * answers.length) + 1;
}

function showQuizResults(score, total) {
  const percentage = (score / total) * 100;
  let message = `Quiz completed! Score: ${score}/${total} (${percentage.toFixed(1)}%)`;
  let type = 'success';
  
  if (percentage < 60) {
    message += ' - Try again!';
    type = 'error';
  } else if (percentage < 80) {
    message += ' - Good job!';
    type = 'info';
  } else {
    message += ' - Excellent!';
    type = 'success';
  }
  
  showToast(message, type);
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

// Add CSS animations
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

  .comment-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #704FE6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
  }

  .comment-author {
    font-weight: 600;
    color: #333;
  }

  .comment-time {
    color: #666;
    font-size: 14px;
  }

  .comment-text {
    color: #555;
    line-height: 1.5;
  }

  .progress-item.completed {
    background: #c7ffc9;
    border-color: #4caf50;
  }

  .progress-item.completed::before {
    content: '✓';
    color: #4caf50;
    font-weight: bold;
    }
`;
document.head.appendChild(style);

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard Details page initialized");
  // Handle auth/redirects consistently (avoids race conditions)
  redirectBasedOnAuth();

  // Initialize dashboard details features
  initMobileMenu();
  initNavigation();
  initVideoPlayer();
    initProgressTracking();
  initDiscussionSystem();
  initResourceDownloads();
  initQuizSystem();
    initScrollToTop();
  initSectionsAccordionWithAnimation();
    
  // Initialize navigation and hover animations
  initializeAllNavigation();
    
    // Handle resize
    handleResize();
  window.addEventListener("resize", handleResize);
    
  // Show welcome toast with user data
  const userData = getCurrentUserData();
  const userName = userData?.displayName || userData?.username || 'User';
    setTimeout(() => {
    showToast(`Welcome to Course Details, ${userName}!`, "success");
    }, 500);
});

// Export functions for potential use elsewhere
window.dashboardDetailsApp = {
    showToast,
  addComment,
  calculateQuizScore,
};

// Accordion with smooth animation for course content sections
function initSectionsAccordionWithAnimation() {
  const sections = document.querySelectorAll('.content-section');
  const contents = document.querySelectorAll('.content-section .section-content');

  // Inject header animation styles
  const style = document.createElement('style');
  style.textContent = `
    .content-section .section-header {
      transition: background-color 250ms ease, box-shadow 250ms ease, transform 250ms ease;
      will-change: background-color, box-shadow, transform;
    }
    .content-section .section-header.open {
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transform: translateZ(0);
    }
  `;
  document.head.appendChild(style);

  contents.forEach(content => {
    content.style.overflow = 'hidden';
    content.style.maxHeight = '0px';
    content.style.transition = 'max-height 300ms ease';
  });

  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    if (!header || !content) return;
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
      // close all
      document.querySelectorAll('.content-section .section-content').forEach(c => {
        c.style.maxHeight = '0px';
      });
      document.querySelectorAll('.content-section .section-header').forEach(h => h.classList.remove('open'));
      // toggle current
      if (!isOpen) {
        // set to scrollHeight for smooth open
        content.style.maxHeight = content.scrollHeight + 'px';
        header.classList.add('open');
      } else {
        content.style.maxHeight = '0px';
        header.classList.remove('open');
      }
    });
  });
}