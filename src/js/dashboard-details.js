// Bootcamp Detail JavaScript

const taskbtn = document.getElementById("task");
const taskList = document.querySelector(".task-list");

taskbtn.addEventListener("click", () => {
    if (taskList.style.display === "flex") {
        taskList.style.display = "none"; // sembunyikan
    } else {
        taskList.style.display = "flex"; // tampilkan
    }
});


// Tab Switching
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            
            const tabName = btn.textContent.trim();
            console.log('Tab switched to:', tabName);
            
            // Here you would typically show/hide content based on tab
            // For now, we'll just log it
        });
    });
}

// Section Accordion
function initAccordion() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.closest('.content-section');
            const wasCollapsed = section.classList.contains('collapsed');
            
            // Toggle collapsed state
            section.classList.toggle('collapsed');
            
            // Animate content
            const content = section.querySelector('.section-content');
            if (content) {
                if (wasCollapsed) {
                    // Expanding
                    content.style.maxHeight = content.scrollHeight + 'px';
                    setTimeout(() => {
                        content.style.maxHeight = 'none';
                    }, 300);
                } else {
                    // Collapsing
                    content.style.maxHeight = content.scrollHeight + 'px';
                    setTimeout(() => {
                        content.style.maxHeight = '0';
                    }, 10);
                }
            }
            
            console.log('Section toggled:', header.querySelector('h3').textContent);
        });
    });
}

// Lesson Click Handler
function initLessons() {
    const lessonItems = document.querySelectorAll('.lesson-item');
    
    lessonItems.forEach(lesson => {
        lesson.addEventListener('click', () => {
            const lessonName = lesson.querySelector('.lesson-name').textContent;
            const duration = lesson.querySelector('.lesson-duration').textContent;
            
            console.log('Lesson clicked:', lessonName, '-', duration);
            
            // Here you would typically open a video player or lesson content
            showToast(`Opening: ${lessonName}`, 'info');
        });
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-container input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Search submitted:', searchInput.value);
                // Navigate to search results
            }
        });
    }
}

// // Icon Button Actions
// function initIconButtons() {
//     const iconBtns = document.querySelectorAll('.icon-btn');
    
//     iconBtns.forEach((btn, index) => {
//         btn.addEventListener('click', () => {
//             const actions = ['Messages', 'Bookmarks', 'Notifications', 'Cart'];
//             console.log(`${actions[index]} clicked`);
//             showToast(`${actions[index]} opened`, 'info');
//         });
//     });
// }

// Profile Avatar Click
function initAvatar() {
    const avatar = document.querySelector('.avatar');
    
    if (avatar) {
        avatar.addEventListener('click', () => {
            console.log('Profile clicked');
            showToast('Profile opened', 'info');
        });
    }
}

// Toast Notification System
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 120px;
        right: 32px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#704FE6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-family: 'Lufga', sans-serif;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Progress Tracking
function initProgressTracking() {
    const lessons = document.querySelectorAll('.lesson-item');
    const completedLessons = new Set();
    
    lessons.forEach((lesson, index) => {
        lesson.addEventListener('click', () => {
            if (!completedLessons.has(index)) {
                completedLessons.add(index);
                lesson.style.opacity = '0.6';
                
                // Show progress
                const totalLessons = lessons.length;
                const progress = Math.round((completedLessons.size / totalLessons) * 100);
                console.log(`Course Progress: ${progress}%`);
            }
        });
    });
}

// Keyboard Navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close modals (if any)
        if (e.key === 'Escape') {
            console.log('ESC pressed');
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const lessons = Array.from(document.querySelectorAll('.lesson-item'));
            const focusedIndex = lessons.findIndex(lesson => 
                lesson === document.activeElement
            );
            
            if (focusedIndex !== -1) {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowDown' 
                    ? Math.min(focusedIndex + 1, lessons.length - 1)
                    : Math.max(focusedIndex - 1, 0);
                lessons[nextIndex].focus();
            }
        }
    });
}

// Video Player (Placeholder)
function openVideoPlayer(lessonName) {
    console.log('Opening video player for:', lessonName);
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const player = document.createElement('div');
    player.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
    `;
    
    player.innerHTML = `
        <h2 style="margin-bottom: 16px; font-family: 'Lufga', sans-serif;">${lessonName}</h2>
        <div style="background: #f0f0f0; height: 400px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            <p style="font-family: 'Lufga', sans-serif; color: #666;">Video Player Placeholder</p>
        </div>
        <button onclick="this.closest('.video-modal').remove()" style="margin-top: 16px; padding: 12px 24px; background: #704FE6; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: 'Lufga', sans-serif; font-weight: 600;">Close</button>
    `;
    
    modal.appendChild(player);
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Scroll to Top
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #704FE6;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 12px rgba(112, 79, 230, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
            setTimeout(() => scrollBtn.style.opacity = '1', 10);
        } else {
            scrollBtn.style.opacity = '0';
            setTimeout(() => scrollBtn.style.display = 'none', 300);
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Responsive Adjustments
function handleResize() {
    const width = window.innerWidth;
    
    if (width <= 360) {
        document.body.classList.add('mobile');
        document.body.classList.remove('tablet', 'laptop');
    } else if (width <= 768) {
        document.body.classList.add('tablet');
        document.body.classList.remove('mobile', 'laptop');
    } else if (width <= 1440) {
        document.body.classList.add('laptop');
        document.body.classList.remove('mobile', 'tablet');
    } else {
        document.body.classList.remove('mobile', 'tablet', 'laptop');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .scroll-to-top:hover {
        background: #5a3eb8 !important;
        transform: scale(1.1);
    }

    .lesson-item {
        transition: all 0.3s;
    }

    .lesson-item:focus {
        outline: 2px solid #704FE6;
        outline-offset: -2px;
    }

    .section-content {
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }

    .content-section.collapsed .section-content {
        max-height: 0;
    }

    .tab-btn {
        transition: all 0.3s;
    }
`;
document.head.appendChild(style);

// Local Storage for Progress
function saveProgress() {
    const completedLessons = [];
    document.querySelectorAll('.lesson-item').forEach((lesson, index) => {
        if (lesson.style.opacity === '0.6') {
            completedLessons.push(index);
        }
    });
    localStorage.setItem('courseProgress', JSON.stringify(completedLessons));
}

function loadProgress() {
    const saved = localStorage.getItem('courseProgress');
    if (saved) {
        const completedLessons = JSON.parse(saved);
        document.querySelectorAll('.lesson-item').forEach((lesson, index) => {
            if (completedLessons.includes(index)) {
                lesson.style.opacity = '0.6';
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bootcamp Detail Page initialized');
    
    initTabs();
    initAccordion();
    initLessons();
    initSearch();
    initIconButtons();
    initAvatar();
    initProgressTracking();
    initKeyboardNav();
    initScrollToTop();
    
    // Load saved progress
    loadProgress();
    
    // Save progress on lesson click
    document.querySelectorAll('.lesson-item').forEach(lesson => {
        lesson.addEventListener('click', saveProgress);
    });
    
    // Handle resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Matematika XI RPL 4! 📚', 'success');
    }, 500);
});

// Export functions for potential use elsewhere
window.bootcampDetail = {
    showToast,
    openVideoPlayer,
    saveProgress,
    loadProgress
};
