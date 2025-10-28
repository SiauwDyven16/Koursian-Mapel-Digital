// Dashboard JavaScript

const taskbtn = document.getElementById("task");
const taskList = document.querySelector(".task-list");

taskbtn.addEventListener("click", () => {
    if (taskList.style.display === "flex") {
        taskList.style.display = "none"; // sembunyikan
    } else {
        taskList.style.display = "flex"; // tampilkan
    }
});

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

// Category Filter
function initCategoryFilter() {
  const categoryBtns = document.querySelectorAll(".category-btn");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      categoryBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      btn.classList.add("active");

      // Here you would typically filter courses based on category
      console.log("Category selected:", btn.textContent.trim());
    });
  });
}

// Smooth Scroll for Category Filters
function initSmoothScroll() {
  const categoryFilters = document.querySelector(".category-filters");
  let isDown = false;
  let startX;
  let scrollLeft;

  if (categoryFilters) {
    categoryFilters.addEventListener("mousedown", (e) => {
      isDown = true;
      categoryFilters.style.cursor = "grabbing";
      startX = e.pageX - categoryFilters.offsetLeft;
      scrollLeft = categoryFilters.scrollLeft;
    });

    categoryFilters.addEventListener("mouseleave", () => {
      isDown = false;
      categoryFilters.style.cursor = "grab";
    });

    categoryFilters.addEventListener("mouseup", () => {
      isDown = false;
      categoryFilters.style.cursor = "grab";
    });

    categoryFilters.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - categoryFilters.offsetLeft;
      const walk = (x - startX) * 2;
      categoryFilters.scrollLeft = scrollLeft - walk;
    });
  }
}

// Course Card Interactions
function initCourseCards() {
  const courseCards = document.querySelectorAll(".course-card");

  courseCards.forEach((card) => {
    card.addEventListener("click", () => {
      console.log("Course clicked:", card.querySelector("h4").textContent);
      // Here you would typically navigate to course details
    });
  });

  // Browse card
  const browseCard = document.querySelector(".browse-card");
  if (browseCard) {
    browseCard.addEventListener("click", () => {
      console.log("Browse all bootcamps clicked");
      // Navigate to browse page
    });
  }
}

// Search Functionality
function initSearch() {
  const searchInput = document.querySelector(".search-container input");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      console.log("Searching for:", searchTerm);

      // Here you would typically filter courses
      if (searchTerm.length > 2) {
        // Perform search
        filterCourses(searchTerm);
      }
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        console.log("Search submitted:", searchInput.value);
        // Submit search
      }
    });
  }
}

function filterCourses(searchTerm) {
  const courseCards = document.querySelectorAll(".course-card");

  courseCards.forEach((card) => {
    const title = card.querySelector("h4")?.textContent.toLowerCase() || "";
    const meta =
      card.querySelector(".course-meta")?.textContent.toLowerCase() || "";

    if (title.includes(searchTerm) || meta.includes(searchTerm)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// Icon Button Actions
function initIconButtons() {
  const iconBtns = document.querySelectorAll(".icon-btn");

  iconBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const actions = ["Messages", "Bookmarks", "Notifications", "Cart"];
      console.log(`${actions[index]} clicked`);
      // Handle specific action
    });
  });
}

// Promotion Cards
function initPromotions() {
  const promotionCards = document.querySelectorAll(".promotion-card");

  promotionCards.forEach((card) => {
    card.addEventListener("click", () => {
      console.log("Promotion clicked:", card.querySelector("h3").textContent);
      // Navigate to promotion details
    });
  });
}

// Lazy Loading for Images
function initLazyLoading() {
  const images = document.querySelectorAll(".course-image img");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src; // Trigger load if not already loaded
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Responsive Adjustments
function handleResize() {
  const width = window.innerWidth;

  // Adjust layout based on screen size
  if (width <= 360) {
    // Mobile adjustments
    document.body.classList.add("mobile");
  } else if (width <= 768) {
    // Tablet adjustments
    document.body.classList.remove("mobile");
    document.body.classList.add("tablet");
  } else {
    // Desktop adjustments
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

  .category-filters {
    cursor: grab;
  }

  .category-filters:active {
    cursor: grabbing;
  }
`;
document.head.appendChild(style);

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard initialized");

  initMobileMenu();
  initNavigation();
  initCategoryFilter();
  initSmoothScroll();
  initCourseCards();
  initSearch();
  initIconButtons();
  initPromotions();
  initLazyLoading();
  initScrollToTop();

  // Handle resize
  handleResize();
  window.addEventListener("resize", handleResize);

  // Show welcome toast
  setTimeout(() => {
    showToast("Welcome to Koursian Dashboard!", "success");
  }, 500);
});

// Export functions for potential use elsewhere
window.dashboardApp = {
  showToast,
  filterCourses,
};
