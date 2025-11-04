// Group Chat Functionality
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const chatItems = document.querySelectorAll('.chat-item');
    
    // Handle chat item clicks
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            chatItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // On mobile, show chat area
            if (window.innerWidth <= 480) {
                document.querySelector('.sidebar').classList.add('chat-open');
                document.querySelector('.chat-area').classList.add('chat-open');
            }
        });
    });
    
    // Send message function
    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (messageText === '') {
            return;
        }
        
        // Create new message element
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group right';
        
        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble purple';
        
        const messageP = document.createElement('p');
        messageP.textContent = messageText;
        messageBubble.appendChild(messageP);
        
        const messageInfo = document.createElement('div');
        messageInfo.className = 'message-info';
        
        const currentTime = new Date();
        const hours = currentTime.getHours() % 12 || 12;
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const ampm = currentTime.getHours() >= 12 ? 'pm' : 'am';
        const timeString = `${hours}:${minutes} ${ampm}`;
        
        messageInfo.innerHTML = `
            <span>Bryant Barton</span>
            <div class="dot"></div>
            <span>${timeString}</span>
        `;
        
        messageGroup.appendChild(messageBubble);
        messageGroup.appendChild(messageInfo);
        
        messagesContainer.appendChild(messageGroup);
        
        // Clear input
        messageInput.value = '';
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Send button click event
    sendBtn.addEventListener('click', sendMessage);
    
    // Enter key press event
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Auto-scroll to bottom on page load
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Handle back button on mobile
    function handleMobileNavigation() {
        if (window.innerWidth <= 480) {
            // Add back button functionality if needed
            const chatArea = document.querySelector('.chat-area');
            if (chatArea && !document.querySelector('.back-button')) {
                const backButton = document.createElement('button');
                backButton.className = 'back-button';
                backButton.innerHTML = '← Back';
                backButton.style.cssText = `
                    position: absolute;
                    top: 24px;
                    left: 16px;
                    background: none;
                    border: none;
                    font-family: 'Outfit', sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                    color: #704FE6;
                    cursor: pointer;
                    display: none;
                `;
                
                backButton.addEventListener('click', function() {
                    document.querySelector('.sidebar').classList.remove('chat-open');
                    document.querySelector('.chat-area').classList.remove('chat-open');
                });
                
                chatArea.insertBefore(backButton, chatArea.firstChild);
            }
        }
    }
    
    // Check for mobile on load
    handleMobileNavigation();
    
    // Check for mobile on resize
    window.addEventListener('resize', handleMobileNavigation);
    
    // Active chat indicator
    const activeChatItem = document.querySelector('.chat-item.active .chat-name');
    if (activeChatItem) {
        console.log('Active chat:', activeChatItem.textContent);
    }
    
    // Smooth scroll behavior for messages
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                messagesContainer.scrollTo({
                    top: messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    observer.observe(messagesContainer, {
        childList: true
    });
    
    // Filter button functionality (placeholder)
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            console.log('Filter button clicked');
            // Add filter modal/dropdown functionality here
        });
    }
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-container input, .navbar-search input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (this.closest('.sidebar')) {
                // Filter chat list
                chatItems.forEach(item => {
                    const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
                    if (chatName.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Navbar action buttons functionality
    const navActionBtns = document.querySelectorAll('.navbar-actions .icon-btn');
    navActionBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const actions = ['Messages', 'Bookmarks', 'Notifications', 'Cart'];
            console.log(`${actions[index]} clicked`);
        });
    });
    
    // Profile picture click
    const profilePic = document.querySelector('.profile-pic');
    if (profilePic) {
        profilePic.addEventListener('click', function() {
            console.log('Profile clicked');
            // Add profile menu functionality here
        });
    }
});
