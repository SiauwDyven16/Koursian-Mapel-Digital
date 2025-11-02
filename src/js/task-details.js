// Import Firebase and navigation
import { initializeAllNavigation } from './navigation.js';
import { redirectBasedOnAuth, getCurrentUserData, getCurrentUser, app } from './firebase-config.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

const storage = getStorage(app);
let selectedFiles = [];

// Task Details JavaScript

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

// Task Submission System
function initTaskSubmission() {
  const submitButton = document.querySelector('.submit-task-btn');
  const taskForm = document.querySelector('.task-form');
  
  if (submitButton && taskForm) {
    submitButton.addEventListener('click', () => {
      const taskTitle = taskForm.querySelector('#task-title')?.value;
      const taskDescription = taskForm.querySelector('#task-description')?.value;
      const taskFiles = taskForm.querySelector('#task-files')?.files;
      
      if (taskTitle && taskDescription) {
        submitTask(taskTitle, taskDescription, taskFiles);
      } else {
        showToast('Please fill in all required fields!', 'error');
      }
    });
  }
}

async function submitTask(title, description, files) {
  const submitButton = document.querySelector('.submit-task-btn');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;

  try {
    const user = getCurrentUser();
    const uid = user?.uid || 'anonymous';
    const now = Date.now();

    const filesToUpload = files && files.length ? Array.from(files) : selectedFiles;
    const uploaded = [];

    for (const f of filesToUpload) {
      if (f.size > 20 * 1024 * 1024) {
        showToast(`${f.name} terlalu besar (>20MB)`, 'error');
        continue;
      }
      const path = `tasks/${uid}/${now}_${f.name}`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, f, { contentType: f.type || 'application/octet-stream' });
      const url = await getDownloadURL(ref);
      uploaded.push({ name: f.name, url });
    }

    selectedFiles = [];
    const fileList = document.querySelector('.file-list');
    if (fileList) fileList.innerHTML = '';

    showToast(`Task submitted with ${uploaded.length} file(s).`, 'success');
    updateTaskStatus('submitted');
  } catch (e) {
    console.error('Submit task error:', e);
    showToast('Gagal upload file tugas.', 'error');
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

function updateTaskStatus(status) {
  const statusElement = document.querySelector('.task-status');
  if (statusElement) {
    statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.className = `task-status ${status}`;
  }
}

// File Upload System
function initFileUpload() {
  const fileInput = document.querySelector('#task-files');
  const fileList = document.querySelector('.file-list');
  const dropZone = document.querySelector('.file-drop-zone');
  const uploadTrigger = document.getElementById('uploadTrigger');

  const allowed = [
    'application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain','application/zip','application/x-zip-compressed','application/x-rar-compressed','image/png','image/jpeg','image/jpg'
  ];

  const refreshList = () => displaySelectedFiles(selectedFiles, fileList);
  const choose = () => fileInput && fileInput.click();
  if (uploadTrigger) uploadTrigger.addEventListener('click', choose);

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      const filtered = files.filter(f => allowed.includes(f.type) || f.name.match(/\.(pdf|docx?|pptx?|xlsx?|txt|zip|rar|png|jpe?g)$/i));
      selectedFiles = selectedFiles.concat(filtered);
      refreshList();
    });
  }
  
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files || []);
      const filtered = files.filter(f => allowed.includes(f.type) || f.name.match(/\.(pdf|docx?|pptx?|xlsx?|txt|zip|rar|png|jpe?g)$/i));
      selectedFiles = selectedFiles.concat(filtered);
      refreshList();
    });
  }
}

function displaySelectedFiles(files, fileList) {
  if (!fileList) return;
  
  fileList.innerHTML = '';
  
  files.forEach((file, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <div class="file-info">
        <span class="file-name">${file.name}</span>
        <span class="file-size">${formatFileSize(file.size)}</span>
      </div>
      <button class="remove-file-btn" data-index="${index}">×</button>
    `;
    
    fileList.appendChild(fileItem);
  });
  
  // Add remove file functionality
  const removeButtons = fileList.querySelectorAll('.remove-file-btn');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.getAttribute('data-index'));
      if (!isNaN(i)) {
        selectedFiles.splice(i, 1);
        displaySelectedFiles(selectedFiles, fileList);
      }
    });
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Task Timer System
function initTaskTimer() {
  const startTimerBtn = document.querySelector('.start-timer-btn');
  const timerDisplay = document.querySelector('.timer-display');
  const pauseTimerBtn = document.querySelector('.pause-timer-btn');
  const stopTimerBtn = document.querySelector('.stop-timer-btn');
  
  let timerInterval;
  let startTime;
  let elapsedTime = 0;
  let isRunning = false;
  
  if (startTimerBtn) {
    startTimerBtn.addEventListener('click', () => {
      if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
        isRunning = true;
        
        startTimerBtn.style.display = 'none';
        pauseTimerBtn.style.display = 'inline-block';
        stopTimerBtn.style.display = 'inline-block';
        
        showToast('Timer started!', 'info');
      }
    });
  }
  
  if (pauseTimerBtn) {
    pauseTimerBtn.addEventListener('click', () => {
      if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        
        pauseTimerBtn.textContent = 'Resume';
        pauseTimerBtn.classList.add('resume');
      } else {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
        isRunning = true;
        
        pauseTimerBtn.textContent = 'Pause';
        pauseTimerBtn.classList.remove('resume');
      }
    });
  }
  
  if (stopTimerBtn) {
    stopTimerBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      elapsedTime = 0;
      
      if (timerDisplay) {
        timerDisplay.textContent = '00:00:00';
      }
      
      startTimerBtn.style.display = 'inline-block';
      pauseTimerBtn.style.display = 'none';
      stopTimerBtn.style.display = 'none';
      pauseTimerBtn.textContent = 'Pause';
      pauseTimerBtn.classList.remove('resume');
      
      showToast('Timer stopped!', 'info');
    });
  }
  
  function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    
    if (timerDisplay) {
      timerDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}

// Task Progress Tracking
function initTaskProgress() {
  const progressItems = document.querySelectorAll('.task-step');
  
  progressItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Mark as completed
      item.classList.add('completed');
      
      // Update progress percentage
      const completedItems = document.querySelectorAll('.task-step.completed').length;
      const totalItems = progressItems.length;
      const percentage = (completedItems / totalItems) * 100;
      
      const progressBar = document.querySelector('.task-progress-bar');
      if (progressBar) {
        progressBar.style.width = percentage + '%';
      }
      
      const progressText = document.querySelector('.progress-text');
      if (progressText) {
        progressText.textContent = `${completedItems}/${totalItems} steps completed`;
      }
      
      showToast(`Step ${index + 1} completed!`, 'success');
    });
  });
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

  .file-drop-zone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;
  }

  .file-drop-zone.drag-over {
    border-color: #704FE6;
    background-color: #f0f0ff;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .file-info {
    display: flex;
    flex-direction: column;
  }

  .file-name {
    font-weight: 500;
    color: #333;
  }

  .file-size {
    font-size: 12px;
    color: #666;
  }

  .remove-file-btn {
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
  }

  .task-step.completed {
    background: #c7ffc9;
    border-color: #4caf50;
  }

  .task-step.completed::before {
    content: '✓';
    color: #4caf50;
    font-weight: bold;
  }

  .timer-display {
    font-family: 'Courier New', monospace;
    font-size: 24px;
    font-weight: bold;
    color: #704FE6;
  }

  .task-status.submitted {
    color: #4caf50;
    background: #c7ffc9;
  }

  .task-status.pending {
    color: #ff9800;
    background: #fff3e0;
  }
`;
document.head.appendChild(style);

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Task Details page initialized");
  // Handle auth/redirects consistently (avoids race conditions)
  redirectBasedOnAuth();

  // Initialize task details features
  initMobileMenu();
  initNavigation();
  initTaskSubmission();
  initFileUpload();
  initTaskTimer();
  initTaskProgress();
  initScrollToTop();
  initSectionsAccordion();

  // Initialize navigation and hover animations
  initializeAllNavigation();

  // Handle resize
  handleResize();
  window.addEventListener("resize", handleResize);

  // Show welcome toast with user data
  const userData = getCurrentUserData();
  const userName = userData?.displayName || userData?.username || 'User';
  setTimeout(() => {
    showToast(`Welcome to Task Details, ${userName}!`, "success");
  }, 500);
});

// Export functions for potential use elsewhere
window.taskDetailsApp = {
  showToast,
  submitTask,
  updateTaskStatus,
  formatFileSize,
};

// Accordion for course content sections
function initSectionsAccordion() {
  const contents = document.querySelectorAll('.content-section .section-content');
  contents.forEach(c => c.style.display = 'none');

  const headers = document.querySelectorAll('.content-section .section-header');
  // Inject header animation styles
  const style = document.createElement('style');
  style.textContent = `
    .content-section .section-header {
      transition: background-color 250ms ease, box-shadow 250ms ease, transform 250ms ease;
      will-change: background-color, box-shadow, transform;
    }
    .content-section .section-header.open {
      background-color: #f4f0ff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transform: translateZ(0);
    }
  `;
  document.head.appendChild(style);
  headers.forEach(header => {
    const content = header.nextElementSibling;
    if (!content) return;
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const isOpen = content.style.display !== 'none';
      document.querySelectorAll('.content-section .section-content').forEach(c => c.style.display = 'none');
      document.querySelectorAll('.content-section .section-header').forEach(h => h.classList.remove('open'));
      content.style.display = isOpen ? 'none' : '';
      if (!isOpen) header.classList.add('open');
    });
  });
}
