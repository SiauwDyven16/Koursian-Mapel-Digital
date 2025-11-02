// Navigation Manager
import { isUserAuthenticated, getCurrentUserData, signOutUser } from './firebase-config.js';

// Navigation configuration
const navigationConfig = {
  // Landing page buttons
  'sign-in-link': () => window.location.href = 'sign-in.html',
  'sign-up-link': () => window.location.href = 'sign-up.html',
  'hero-link-container': () => {
    if (isUserAuthenticated()) {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'sign-in.html';
    }
  },
  'class-link': () => {
    if (isUserAuthenticated()) {
      window.location.href = 'browse.html';
    } else {
      window.location.href = 'sign-in.html';
    }
  },
  
  // Dashboard navigation
  'nav-item[href="#"]': (element) => {
    const text = element.querySelector('span')?.textContent?.toLowerCase();
    switch(text) {
      case 'dashboard':
        window.location.href = 'dashboard.html';
        break;
      case 'browse':
        window.location.href = 'browse.html';
        break;
      case 'my class':
        window.location.href = 'dashboard-details.html';
        break;
      case 'teacher':
        window.location.href = 'teacher.html';
        break;
    }
  },
  
  // Course cards
  'course-card': (element) => {
    const courseTitle = element.querySelector('h4')?.textContent;
    console.log('Course clicked:', courseTitle);
    // Navigate to course details
    window.location.href = 'dashboard-details.html';
  },
  
  // Browse card
  'browse-card': () => {
    window.location.href = 'browse.html';
  },
  
  // Task buttons
  'task-working-btn': (element) => {
    console.log('Start working clicked');
    // Navigate to task details
    window.location.href = 'task-details.html';
  },
  
  // Category filters
  'category-btn': (element) => {
    const category = element.querySelector('span:last-child')?.textContent;
    console.log('Category selected:', category);
    // Filter courses by category
    filterCoursesByCategory(category);
  }
};

// Function to initialize navigation
export function initializeNavigation() {
  // Add click handlers for all navigation elements
  Object.keys(navigationConfig).forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const handler = navigationConfig[selector];
        if (typeof handler === 'function') {
          handler(element);
        }
      });
    });
  });
  
  // Special handling for specific elements
  initializeSpecialNavigation();
}

// Special navigation handlers
function initializeSpecialNavigation() {
  // Get Started button logic
  const getStartedBtn = document.querySelector('.hero-link-container');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isUserAuthenticated()) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'sign-in.html';
      }
    });
  }
  
  // View All Class button logic
  const viewAllClassBtn = document.querySelector('.class-link');
  if (viewAllClassBtn) {
    viewAllClassBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isUserAuthenticated()) {
        window.location.href = 'browse.html';
      } else {
        window.location.href = 'sign-in.html';
      }
    });
  }
  
  // Sign In/Sign Up links
  const signInLink = document.querySelector('.sign-in-link');
  const signUpLink = document.querySelector('.sign-up-link');
  
  if (signInLink) {
    signInLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'sign-in.html';
    });
  }
  
  if (signUpLink) {
    signUpLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'sign-up.html';
    });
  }
  
  // Dashboard navigation items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const text = item.querySelector('span')?.textContent?.toLowerCase();
      
      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));
      // Add active class to clicked item
      item.classList.add('active');
      
      switch(text) {
        case 'dashboard':
          window.location.href = 'dashboard.html';
          break;
        case 'browse':
          window.location.href = 'browse.html';
          break;
        case 'my class':
          window.location.href = 'dashboard-details.html';
          break;
        case 'teacher':
          window.location.href = 'teacher.html';
          break;
        case 'logout':
          signOutUser();
          break;
      }
    });
  });
  
  // Course cards
  const courseCards = document.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    card.addEventListener('click', () => {
      const courseTitle = card.querySelector('h4')?.textContent;
      console.log('Course clicked:', courseTitle);
      window.location.href = 'dashboard-details.html';
    });
  });
  
  // Browse card
  const browseCard = document.querySelector('.browse-card');
  if (browseCard) {
    browseCard.addEventListener('click', () => {
      window.location.href = 'browse.html';
    });
  }
  
  // Task working buttons
  const taskButtons = document.querySelectorAll('.task-working-btn');
  taskButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Start working clicked');
      window.location.href = 'task-details.html';
    });
  });
}

// Function to filter courses by category
function filterCoursesByCategory(category) {
  const courseCards = document.querySelectorAll('.course-card');
  
  courseCards.forEach(card => {
    const cardTitle = card.querySelector('h4')?.textContent.toLowerCase();
    const cardMeta = card.querySelector('.course-meta')?.textContent.toLowerCase();
    
    if (category === 'All' || 
        cardTitle.includes(category.toLowerCase()) || 
        cardMeta.includes(category.toLowerCase())) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Function to add hover animations to buttons
export function addHoverAnimations() {
  // Add hover effects to all buttons and clickable elements
  const clickableElements = document.querySelectorAll(`
    .nav-link,
    .sign-in-link,
    .sign-up-link,
    .hero-link-container,
    .class-link,
    .nav-item,
    .course-card,
    .browse-card,
    .category-btn,
    .task-working-btn,
    .icon-btn,
    .promotion-card,
    button,
    .btn
  `);
  
  clickableElements.forEach(element => {
    // Add hover class for CSS animations
    element.addEventListener('mouseenter', () => {
      element.classList.add('hover-effect');
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove('hover-effect');
    });
    
    // Add click animation
    element.addEventListener('mousedown', () => {
      element.classList.add('click-effect');
    });
    
    element.addEventListener('mouseup', () => {
      element.classList.remove('click-effect');
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove('click-effect');
    });
  });
}

// Function to initialize all navigation features
export function initializeAllNavigation() {
  initializeNavigation();
  addHoverAnimations();
  
  // Add CSS for hover animations
  addHoverCSS();
}

// Function to add CSS for hover animations
function addHoverCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* Hover animations for all buttons */
    .nav-link,
    .sign-in-link,
    .sign-up-link,
    .hero-link-container,
    .class-link,
    .nav-item,
    .course-card,
    .browse-card,
    .category-btn,
    .task-working-btn,
    .icon-btn,
    .promotion-card,
    button,
    .btn {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    
    /* Hover effects */
    .nav-link:hover,
    .sign-in-link:hover,
    .sign-up-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(112, 79, 230, 0.15);
    }
    
    .hero-link-container:hover,
    .class-link:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(112, 79, 230, 0.2);
    }
    
    .nav-item:hover {
      background-color: rgba(112, 79, 230, 0.1);
      transform: translateX(4px);
    }
    
    .course-card:hover,
    .browse-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }
    
    .category-btn:hover {
      background-color: #704FE6;
      color: white;
      transform: scale(1.05);
    }
    
    .task-working-btn:hover {
      background-color: #5a3eb8;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(112, 79, 230, 0.3);
    }
    
    .icon-btn:hover {
      background-color: rgba(112, 79, 230, 0.1);
      transform: scale(1.1);
    }
    
    .promotion-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    /* Click effects */
    .click-effect {
      transform: scale(0.95) !important;
      transition: transform 0.1s ease !important;
    }
    
    /* Smooth transitions for all interactive elements */
    * {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Focus states for accessibility */
    button:focus,
    .btn:focus,
    .nav-link:focus,
    .nav-item:focus {
      outline: 2px solid #704FE6;
      outline-offset: 2px;
    }
  `;
  
  document.head.appendChild(style);
}

// Export for use in other files
export { navigationConfig, filterCoursesByCategory };
