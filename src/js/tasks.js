// Import Firebase and navigation
import { initializeAllNavigation } from './navigation.js';
import { redirectBasedOnAuth, isUserAuthenticated, getCurrentUserData } from './firebase-config.js';

// Tasks JavaScript

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

// Task Management System
function initTaskManagement() {
  const taskCards = document.querySelectorAll('.task-card');
  
  taskCards.forEach(card => {
    const startBtn = card.querySelector('.start-task-btn');
    const viewBtn = card.querySelector('.view-task-btn');
    const submitBtn = card.querySelector('.submit-task-btn');
    
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const taskTitle = card.querySelector('.task-title')?.textContent;
        window.location.href = 'task-details.html';
        showToast(`Starting task: ${taskTitle}`, 'info');
      });
    }
    
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        const taskTitle = card.querySelector('.task-title')?.textContent;
        showTaskDetails(taskTitle);
      });
    }
    
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const taskTitle = card.querySelector('.task-title')?.textContent;
        submitTask(taskTitle);
      });
    }
  });
}

function showTaskDetails(taskTitle) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Task Details - ${taskTitle}</h3>
        <button class="close-modal-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="task-details">
          <div class="detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value">In Progress</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Due Date:</span>
            <span class="detail-value">29-10-2025</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Progress:</span>
            <span class="detail-value">60%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Grade:</span>
            <span class="detail-value">Pending</span>
          </div>
        </div>
        <div class="task-actions">
          <button class="continue-task-btn">Continue Task</button>
          <button class="submit-task-btn">Submit Task</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.close-modal-btn');
  const continueBtn = modal.querySelector('.continue-task-btn');
  const submitBtn = modal.querySelector('.submit-task-btn');
  
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });
  
  continueBtn.addEventListener('click', () => {
    modal.remove();
    window.location.href = 'task-details.html';
  });
  
  submitBtn.addEventListener('click', () => {
    showToast('Task submitted successfully!', 'success');
    modal.remove();
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function submitTask(taskTitle) {
  if (confirm(`Are you sure you want to submit "${taskTitle}"?`)) {
    showToast(`Task "${taskTitle}" submitted successfully!`, 'success');
    
    // Update task status
    const taskCard = document.querySelector(`[data-task="${taskTitle}"]`);
    if (taskCard) {
      const statusElement = taskCard.querySelector('.task-status');
      if (statusElement) {
        statusElement.textContent = 'Submitted';
        statusElement.className = 'task-status submitted';
      }
    }
  }
}

// Task Filtering System
function initTaskFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-input');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      filterTasks(filter);
    });
  });
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      searchTasks(searchTerm);
    });
  }
}

function filterTasks(filter) {
  const taskCards = document.querySelectorAll('.task-card');
  
  taskCards.forEach(card => {
    const status = card.querySelector('.task-status')?.textContent.toLowerCase();
    
    if (filter === 'all' || status === filter) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
  
  showToast(`Filtered by: ${filter}`, 'info');
}

function searchTasks(searchTerm) {
  const taskCards = document.querySelectorAll('.task-card');
  
  taskCards.forEach(card => {
    const title = card.querySelector('.task-title')?.textContent.toLowerCase();
    const description = card.querySelector('.task-description')?.textContent.toLowerCase();
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Task Progress Tracking
function initTaskProgress() {
  const progressBars = document.querySelectorAll('.task-progress-bar');
  
  progressBars.forEach(bar => {
    const percentage = bar.dataset.progress || 0;
    bar.style.width = percentage + '%';
  });
}

// Task Calendar Integration
function initTaskCalendar() {
  const calendarDays = document.querySelectorAll('.calendar-day');
  
  calendarDays.forEach(day => {
    const taskCount = day.dataset.taskCount || 0;
    
    if (taskCount > 0) {
      day.classList.add('has-tasks');
      const taskIndicator = document.createElement('div');
      taskIndicator.className = 'task-indicator';
      taskIndicator.textContent = taskCount;
      day.appendChild(taskIndicator);
    }
    
    day.addEventListener('click', () => {
      const date = day.dataset.date;
      showTasksForDate(date);
    });
  });
}

function showTasksForDate(date) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Tasks for ${date}</h3>
        <button class="close-modal-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="date-tasks">
          <div class="task-item">
            <span class="task-name">Mathematics Assignment</span>
            <span class="task-time">10:00 AM</span>
          </div>
          <div class="task-item">
            <span class="task-name">Physics Lab Report</span>
            <span class="task-time">2:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.close-modal-btn');
  
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
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

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .close-modal-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .task-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .detail-label {
    font-weight: 500;
    color: #333;
  }

  .detail-value {
    font-weight: 600;
    color: #704FE6;
  }

  .task-actions {
    display: flex;
    gap: 10px;
  }

  .task-actions button {
    flex: 1;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .continue-task-btn {
    background: #704FE6;
    color: white;
  }

  .submit-task-btn {
    background: #4caf50;
    color: white;
  }

  .filter-btn.active {
    background: #704FE6;
    color: white;
  }

  .task-status.submitted {
    color: #4caf50;
    background: #c7ffc9;
  }

  .task-status.in-progress {
    color: #ff9800;
    background: #fff3e0;
  }

  .task-status.pending {
    color: #666;
    background: #f5f5f5;
  }

  .calendar-day.has-tasks {
    background: #704FE6;
    color: white;
  }

  .task-indicator {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .date-tasks {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .task-name {
    font-weight: 500;
    color: #333;
  }

  .task-time {
    color: #666;
    font-size: 14px;
  }
`;
document.head.appendChild(style);

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Tasks page initialized");
  // Handle auth/redirects consistently (avoids race conditions)
  redirectBasedOnAuth();

  // Initialize tasks features
  initMobileMenu();
  initNavigation();
  initTaskManagement();
  initTaskFiltering();
  initTaskProgress();
  initTaskCalendar();
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
    showToast(`Welcome to Tasks, ${userName}!`, "success");
  }, 500);
});

// Export functions for potential use elsewhere
window.tasksApp = {
  showToast,
  submitTask,
  filterTasks,
  searchTasks,
  showTaskDetails,
};
