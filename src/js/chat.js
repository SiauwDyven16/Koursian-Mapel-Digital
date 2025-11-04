// Multi-Group Chat Functionality with Firebase
import { db, auth } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot,
    serverTimestamp,
    limit,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { 
    formatMessageTime, 
    sanitizeMessage, 
    validateMessage,
    canSendMessage 
} from './chat-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const chatItems = document.querySelectorAll('.chat-item');
    const chatTitle = document.getElementById('chatTitle');
    
    let currentUser = null;
    let unsubscribeMessages = null;
    let currentRoomId = 'global-chat'; // Default room
    
    // Wait for auth state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            
            // Get user data from localStorage
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                currentUser.displayName = userData.displayName || userData.username || user.email;
            }
            
            // Load first chat room by default
            const firstChatItem = document.querySelector('.chat-item');
            if (firstChatItem) {
                firstChatItem.click();
            }
        } else {
            // Redirect to login if not authenticated
            window.location.href = 'sign-in.html';
        }
    });
    
    // Handle chat item clicks
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            chatItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get room info
            const roomId = this.getAttribute('data-room-id');
            const roomName = this.querySelector('.chat-name').textContent;
            
            // Update chat title
            if (chatTitle) {
                chatTitle.textContent = roomName;
            }
            
            // Switch to this room
            switchRoom(roomId, roomName);
            
            // On mobile, show chat area
            if (window.innerWidth <= 480) {
                document.querySelector('.sidebar').classList.add('chat-open');
                document.querySelector('.chat-area').classList.add('chat-open');
            }
        });
    });
    
    // Switch chat room
    function switchRoom(roomId, roomName) {
        // Unsubscribe from previous room
        if (unsubscribeMessages) {
            unsubscribeMessages();
        }
        
        // Update current room
        currentRoomId = roomId;
        
        // Clear messages
        messagesContainer.innerHTML = '<div class="loading-messages"><p>Loading messages...</p></div>';
        
        // Listen to new room
        listenToMessages(roomId);
        
        console.log(`Switched to room: ${roomName} (${roomId})`);
    }
    
    // Listen to messages in realtime for specific room
    function listenToMessages(roomId) {
        const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
        
        // Clear loading indicator
        const loadingEl = messagesContainer.querySelector('.loading-messages');
        
        unsubscribeMessages = onSnapshot(q, (snapshot) => {
            // Remove loading on first load
            if (loadingEl) {
                loadingEl.remove();
            }
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const messageData = change.doc.data();
                    displayMessage(messageData, change.doc.id);
                }
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, (error) => {
            console.error('Error listening to messages:', error);
            messagesContainer.innerHTML = '<div class="error-message">Failed to load messages. Please refresh the page.</div>';
        });
    }
    
    // Display message in UI
    function displayMessage(messageData, messageId) {
        // Check if message already exists
        if (document.querySelector(`[data-message-id="${messageId}"]`)) {
            return;
        }
        
        const isCurrentUser = messageData.userId === currentUser.uid;
        
        const messageGroup = document.createElement('div');
        messageGroup.className = `message-group ${isCurrentUser ? 'right' : 'left'}`;
        messageGroup.setAttribute('data-message-id', messageId);
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `message-bubble ${isCurrentUser ? 'purple' : 'yellow'}`;
        
        const messageP = document.createElement('p');
        messageP.textContent = messageData.message;
        messageBubble.appendChild(messageP);
        
        const messageInfo = document.createElement('div');
        messageInfo.className = 'message-info';
        
        // Format timestamp using utility
        const timeString = formatMessageTime(messageData.timestamp);
        
        messageInfo.innerHTML = `
            <span>${sanitizeMessage(messageData.userName || 'Anonymous')}</span>
            <div class="dot"></div>
            <span>${timeString}</span>
        `;
        
        messageGroup.appendChild(messageBubble);
        messageGroup.appendChild(messageInfo);
        
        messagesContainer.appendChild(messageGroup);
    }
    
    // Send message function
    async function sendMessage() {
        const messageText = messageInput.value.trim();
        
        // Validate message
        const validation = validateMessage(messageText);
        if (!validation.valid) {
            if (validation.error) {
                alert(validation.error);
            }
            return;
        }
        
        // Check rate limiting
        if (!canSendMessage(currentUser.uid)) {
            alert('You are sending messages too fast. Please wait a moment.');
            return;
        }
        
        if (!currentUser) {
            alert('You must be logged in to send messages');
            return;
        }
        
        // Disable send button temporarily
        sendBtn.disabled = true;
        messageInput.disabled = true;
        
        try {
            // Add message to Firestore in specific room
            await addDoc(collection(db, 'chatRooms', currentRoomId, 'messages'), {
                message: sanitizeMessage(messageText),
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                timestamp: serverTimestamp()
            });
            
            // Clear input
            messageInput.value = '';
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            // Re-enable send button
            sendBtn.disabled = false;
            messageInput.disabled = false;
            messageInput.focus();
        }
    }
    
    // Send button click event
    sendBtn.addEventListener('click', sendMessage);
    
    // Enter key press event
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Handle mobile navigation
    function handleMobileNavigation() {
        if (window.innerWidth <= 480) {
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
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-container input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (this.closest('.sidebar')) {
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
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (unsubscribeMessages) {
            unsubscribeMessages();
        }
    });
});