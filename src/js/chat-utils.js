// Chat Utility Functions
import { db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where,
    orderBy, 
    limit,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/**
 * Format timestamp to readable time
 * @param {Firebase.Timestamp} timestamp 
 * @returns {string}
 */
export function formatMessageTime(timestamp) {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Just now (< 1 min)
    if (diffMins < 1) return 'Just now';
    
    // Minutes ago (< 1 hour)
    if (diffMins < 60) return `${diffMins}m ago`;
    
    // Hours ago (< 24 hours)
    if (diffHours < 24) return `${diffHours}h ago`;
    
    // Days ago (< 7 days)
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // Full date
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    
    return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes} ${ampm}`;
}

/**
 * Sanitize message text to prevent XSS
 * @param {string} text 
 * @returns {string}
 */
export function sanitizeMessage(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Validate message before sending
 * @param {string} message 
 * @returns {Object} {valid: boolean, error: string}
 */
export function validateMessage(message) {
    if (!message || message.trim().length === 0) {
        return { valid: false, error: 'Message cannot be empty' };
    }
    
    if (message.length > 1000) {
        return { valid: false, error: 'Message too long (max 1000 characters)' };
    }
    
    return { valid: true, error: null };
}

/**
 * Delete old messages (cleanup utility)
 * @param {number} daysOld - Delete messages older than X days
 */
export async function deleteOldMessages(daysOld = 30) {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const messagesRef = collection(db, 'globalChat');
        const q = query(
            messagesRef, 
            where('timestamp', '<', cutoffDate),
            limit(500) // Process in batches
        );
        
        const snapshot = await getDocs(q);
        
        const deletePromises = [];
        snapshot.forEach((docSnap) => {
            deletePromises.push(deleteDoc(doc(db, 'globalChat', docSnap.id)));
        });
        
        await Promise.all(deletePromises);
        
        console.log(`Deleted ${deletePromises.length} old messages`);
        return deletePromises.length;
        
    } catch (error) {
        console.error('Error deleting old messages:', error);
        throw error;
    }
}

/**
 * Get message statistics
 * @returns {Promise<Object>}
 */
export async function getMessageStats() {
    try {
        const messagesRef = collection(db, 'globalChat');
        const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1000));
        
        const snapshot = await getDocs(q);
        
        const stats = {
            totalMessages: snapshot.size,
            uniqueUsers: new Set(),
            messagesPerUser: {},
            firstMessage: null,
            lastMessage: null
        };
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            stats.uniqueUsers.add(data.userId);
            
            if (!stats.messagesPerUser[data.userId]) {
                stats.messagesPerUser[data.userId] = 0;
            }
            stats.messagesPerUser[data.userId]++;
            
            if (!stats.firstMessage || data.timestamp < stats.firstMessage) {
                stats.firstMessage = data.timestamp;
            }
            
            if (!stats.lastMessage || data.timestamp > stats.lastMessage) {
                stats.lastMessage = data.timestamp;
            }
        });
        
        stats.uniqueUsers = stats.uniqueUsers.size;
        
        return stats;
        
    } catch (error) {
        console.error('Error getting message stats:', error);
        throw error;
    }
}

/**
 * Export chat history
 * @param {number} limitCount - Number of messages to export
 * @returns {Promise<Array>}
 */
export async function exportChatHistory(limitCount = 1000) {
    try {
        const messagesRef = collection(db, 'globalChat');
        const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(limitCount));
        
        const snapshot = await getDocs(q);
        
        const messages = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                message: data.message,
                userName: data.userName,
                timestamp: data.timestamp?.toDate().toISOString() || null
            });
        });
        
        return messages.reverse(); // Oldest first
        
    } catch (error) {
        console.error('Error exporting chat history:', error);
        throw error;
    }
}

/**
 * Download chat history as JSON
 */
export async function downloadChatHistory() {
    try {
        const messages = await exportChatHistory();
        
        const dataStr = JSON.stringify(messages, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('Chat history downloaded successfully');
        
    } catch (error) {
        console.error('Error downloading chat history:', error);
        alert('Failed to download chat history');
    }
}

/**
 * Search messages
 * @param {string} searchTerm 
 * @param {number} limitCount 
 * @returns {Promise<Array>}
 */
export async function searchMessages(searchTerm, limitCount = 100) {
    try {
        const messagesRef = collection(db, 'globalChat');
        const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(limitCount));
        
        const snapshot = await getDocs(q);
        
        const results = [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.message.toLowerCase().includes(lowerSearchTerm) ||
                data.userName.toLowerCase().includes(lowerSearchTerm)) {
                results.push({
                    id: doc.id,
                    ...data
                });
            }
        });
        
        return results;
        
    } catch (error) {
        console.error('Error searching messages:', error);
        throw error;
    }
}

/**
 * Check if user can send message (rate limiting)
 * @param {string} userId 
 * @returns {boolean}
 */
const messageTimestamps = new Map();
export function canSendMessage(userId, maxMessagesPerMinute = 10) {
    const now = Date.now();
    const userTimestamps = messageTimestamps.get(userId) || [];
    
    // Remove timestamps older than 1 minute
    const recentTimestamps = userTimestamps.filter(ts => now - ts < 60000);
    
    if (recentTimestamps.length >= maxMessagesPerMinute) {
        return false;
    }
    
    recentTimestamps.push(now);
    messageTimestamps.set(userId, recentTimestamps);
    
    return true;
}

/**
 * Format message with mentions, links, etc.
 * @param {string} text 
 * @returns {string}
 */
export function formatMessageContent(text) {
    // Auto-link URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    
    // Format mentions (@username)
    const mentionRegex = /@(\w+)/g;
    text = text.replace(mentionRegex, '<span class="mention">@$1</span>');
    
    // Format hashtags (#tag)
    const hashtagRegex = /#(\w+)/g;
    text = text.replace(hashtagRegex, '<span class="hashtag">#$1</span>');
    
    return text;
}

export default {
    formatMessageTime,
    sanitizeMessage,
    validateMessage,
    deleteOldMessages,
    getMessageStats,
    exportChatHistory,
    downloadChatHistory,
    searchMessages,
    canSendMessage,
    formatMessageContent
};