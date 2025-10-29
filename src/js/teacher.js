// Import Firebase and navigation
import { initializeAllNavigation } from './navigation.js';
import { redirectBasedOnAuth, isUserAuthenticated, getCurrentUserData } from './firebase-config.js';

// Teacher JavaScript

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

// Teacher Profile Management
function initTeacherProfile() {
  const editProfileBtn = document.querySelector('.edit-profile-btn');
  const saveProfileBtn = document.querySelector('.save-profile-btn');
  const profileForm = document.querySelector('.profile-form');
  
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      // Enable form editing
      const inputs = profileForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.disabled = false;
        input.style.backgroundColor = 'white';
      });
      
      editProfileBtn.style.display = 'none';
      saveProfileBtn.style.display = 'inline-block';
      
      showToast('Profile editing enabled!', 'info');
    });
  }
  
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      // Save profile changes
      const inputs = profileForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.disabled = true;
        input.style.backgroundColor = '#f5f5f5';
      });
      
      saveProfileBtn.style.display = 'none';
      editProfileBtn.style.display = 'inline-block';
      
      showToast('Profile saved successfully!', 'success');
    });
  }
}

// Course Creation System
function initCourseCreation() {
  const createCourseBtn = document.querySelector('.create-course-btn');
  const courseForm = document.querySelector('.course-form');
  const submitCourseBtn = document.querySelector('.submit-course-btn');
  
  if (createCourseBtn) {
    createCourseBtn.addEventListener('click', () => {
      // Show course creation form
      if (courseForm) {
        courseForm.style.display = 'block';
        courseForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  if (submitCourseBtn && courseForm) {
    submitCourseBtn.addEventListener('click', () => {
      const courseTitle = courseForm.querySelector('#course-title')?.value;
      const courseDescription = courseForm.querySelector('#course-description')?.value;
      const courseCategory = courseForm.querySelector('#course-category')?.value;
      
      if (courseTitle && courseDescription && courseCategory) {
        createCourse(courseTitle, courseDescription, courseCategory);
      } else {
        showToast('Please fill in all required fields!', 'error');
      }
    });
  }
}

function createCourse(title, description, category) {
  // Show loading state
  const submitBtn = document.querySelector('.submit-course-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Creating...';
  submitBtn.disabled = true;
  
  // Simulate course creation
  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    showToast('Course created successfully!', 'success');
    
    // Reset form
    const courseForm = document.querySelector('.course-form');
    if (courseForm) {
      courseForm.reset();
      courseForm.style.display = 'none';
    }
    
    // Add course to list
    addCourseToList(title, description, category);
    
  }, 2000);
}

function addCourseToList(title, description, category) {
  const courseList = document.querySelector('.course-list');
  if (!courseList) return;
  
  const courseItem = document.createElement('div');
  courseItem.className = 'course-item';
  courseItem.innerHTML = `
    <div class="course-header">
      <h3>${title}</h3>
      <span class="course-category">${category}</span>
    </div>
    <p class="course-description">${description}</p>
    <div class="course-actions">
      <button class="edit-course-btn">Edit</button>
      <button class="delete-course-btn">Delete</button>
      <button class="view-students-btn">View Students</button>
    </div>
  `;
  
  courseList.appendChild(courseItem);
  
  // Add event listeners for course actions
  const editBtn = courseItem.querySelector('.edit-course-btn');
  const deleteBtn = courseItem.querySelector('.delete-course-btn');
  const viewStudentsBtn = courseItem.querySelector('.view-students-btn');
  
  editBtn.addEventListener('click', () => {
    showToast('Edit course functionality coming soon!', 'info');
  });
  
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this course?')) {
      courseItem.remove();
      showToast('Course deleted!', 'success');
    }
  });
  
  viewStudentsBtn.addEventListener('click', () => {
    showToast('View students functionality coming soon!', 'info');
  });
}

// Student Management
function initStudentManagement() {
  const studentCards = document.querySelectorAll('.student-card');
  
  studentCards.forEach(card => {
    const gradeBtn = card.querySelector('.grade-btn');
    const messageBtn = card.querySelector('.message-btn');
    const viewProgressBtn = card.querySelector('.view-progress-btn');
    
    if (gradeBtn) {
      gradeBtn.addEventListener('click', () => {
        const studentName = card.querySelector('.student-name')?.textContent;
        showGradeModal(studentName);
      });
    }
    
    if (messageBtn) {
      messageBtn.addEventListener('click', () => {
        const studentName = card.querySelector('.student-name')?.textContent;
        showMessageModal(studentName);
      });
    }
    
    if (viewProgressBtn) {
      viewProgressBtn.addEventListener('click', () => {
        const studentName = card.querySelector('.student-name')?.textContent;
        showProgressModal(studentName);
      });
    }
  });
}

function showGradeModal(studentName) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Grade Assignment - ${studentName}</h3>
        <button class="close-modal-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="grade-form">
          <label for="grade-score">Score:</label>
          <input type="number" id="grade-score" min="0" max="100" placeholder="Enter score">
          <label for="grade-feedback">Feedback:</label>
          <textarea id="grade-feedback" placeholder="Enter feedback for the student"></textarea>
          <button class="submit-grade-btn">Submit Grade</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.close-modal-btn');
  const submitBtn = modal.querySelector('.submit-grade-btn');
  
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });
  
  submitBtn.addEventListener('click', () => {
    const score = modal.querySelector('#grade-score').value;
    const feedback = modal.querySelector('#grade-feedback').value;
    
    if (score && feedback) {
      showToast(`Grade submitted for ${studentName}!`, 'success');
      modal.remove();
    } else {
      showToast('Please fill in all fields!', 'error');
    }
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function showMessageModal(studentName) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Send Message - ${studentName}</h3>
        <button class="close-modal-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="message-form">
          <label for="message-subject">Subject:</label>
          <input type="text" id="message-subject" placeholder="Enter message subject">
          <label for="message-content">Message:</label>
          <textarea id="message-content" placeholder="Enter your message"></textarea>
          <button class="send-message-btn">Send Message</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeBtn = modal.querySelector('.close-modal-btn');
  const sendBtn = modal.querySelector('.send-message-btn');
  
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });
  
  sendBtn.addEventListener('click', () => {
    const subject = modal.querySelector('#message-subject').value;
    const content = modal.querySelector('#message-content').value;
    
    if (subject && content) {
      showToast(`Message sent to ${studentName}!`, 'success');
      modal.remove();
    } else {
      showToast('Please fill in all fields!', 'error');
    }
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function showProgressModal(studentName) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Student Progress - ${studentName}</h3>
        <button class="close-modal-btn">×</button>
      </div>
      <div class="modal-body">
        <div class="progress-stats">
          <div class="stat-item">
            <span class="stat-label">Course Progress:</span>
            <span class="stat-value">75%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Assignments Completed:</span>
            <span class="stat-value">8/10</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Average Grade:</span>
            <span class="stat-value">85%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Last Active:</span>
            <span class="stat-value">2 days ago</span>
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

// Analytics Dashboard
function initAnalytics() {
  const analyticsCards = document.querySelectorAll('.analytics-card');
  
  analyticsCards.forEach(card => {
    const refreshBtn = card.querySelector('.refresh-data-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshAnalyticsData(card);
      });
    }
  });
}

function refreshAnalyticsData(card) {
  const refreshBtn = card.querySelector('.refresh-data-btn');
  const originalText = refreshBtn.textContent;
  
  refreshBtn.textContent = 'Refreshing...';
  refreshBtn.disabled = true;
  
  // Simulate data refresh
  setTimeout(() => {
    refreshBtn.textContent = originalText;
    refreshBtn.disabled = false;
    
    // Update data with random values
    const valueElement = card.querySelector('.analytics-value');
    if (valueElement) {
      const currentValue = parseInt(valueElement.textContent);
      const newValue = currentValue + Math.floor(Math.random() * 10) - 5;
      valueElement.textContent = Math.max(0, newValue);
    }
    
    showToast('Analytics data refreshed!', 'success');
  }, 1500);
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

  .grade-form, .message-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .grade-form input, .message-form input,
  .grade-form textarea, .message-form textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .submit-grade-btn, .send-message-btn {
    background: #704FE6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .progress-stats {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .stat-label {
    font-weight: 500;
    color: #333;
  }

  .stat-value {
    font-weight: 600;
    color: #704FE6;
  }

  .course-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    background: white;
  }

  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .course-category {
    background: #704FE6;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .course-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  .course-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .edit-course-btn {
    background: #ff9800;
    color: white;
  }

  .delete-course-btn {
    background: #f44336;
    color: white;
  }

  .view-students-btn {
    background: #4caf50;
    color: white;
  }
`;
document.head.appendChild(style);

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Teacher page initialized");
  // Handle auth/redirects consistently (avoids race conditions)
  redirectBasedOnAuth();

  // Initialize teacher features
  initMobileMenu();
  initNavigation();
  initTeacherProfile();
  initCourseCreation();
  initStudentManagement();
  initAnalytics();
  initScrollToTop();

  // Initialize navigation and hover animations
  initializeAllNavigation();

  // Handle resize
  handleResize();
  window.addEventListener("resize", handleResize);

  // Show welcome toast with user data
  const userData = getCurrentUserData();
  const userName = userData?.displayName || userData?.username || 'Teacher';
  setTimeout(() => {
    showToast(`Welcome to Teacher Dashboard, ${userName}!`, "success");
  }, 500);
});

// Export functions for potential use elsewhere
window.teacherApp = {
  showToast,
  createCourse,
  addCourseToList,
  showGradeModal,
  showMessageModal,
  showProgressModal,
};
