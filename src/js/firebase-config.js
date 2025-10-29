// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD9PuaSWK6-rK1B0VKIrY1dgQsK6CevNk",
  authDomain: "website-mapel-digital.firebaseapp.com",
  projectId: "website-mapel-digital",
  storageBucket: "website-mapel-digital.firebasestorage.app",
  messagingSenderId: "237511903481",
  appId: "1:237511903481:web:50105212d92efdfc6aba28",
  measurementId: "G-TTZQ3NTRZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication state management
let currentUser = null;
let userData = null;
let userDataRefreshed = false;

// Listen to authentication state changes
let authInitialized = false;
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  
  if (user) {
    try {
      // Get user data from Firestore
      const { getUserData } = await import('./user-utils.js');
      userData = await getUserData(user.uid);
      
      // Update UI based on authentication state
      updateUIForAuthenticatedUser(userData);
      
      // Store user data in localStorage for quick access
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        ...userData
      }));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    userData = null;
    localStorage.removeItem('currentUser');
    updateUIForUnauthenticatedUser();
  }
  authInitialized = true;
  userDataRefreshed = !!userData;
});

// Function to update UI for authenticated user
function updateUIForAuthenticatedUser(userData) {
  // Update avatar in dashboard if exists
  const avatar = document.querySelector('.avatar img');
  if (avatar && userData) {
    const photoSrc = userData.profilePhoto || userData.photoURL || avatar.getAttribute('src');
    if (photoSrc) {
      avatar.setAttribute('src', photoSrc);
    }
    console.log('User logged in:', userData.username || userData.email);
  }
  
  // Update any user-specific content
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(element => {
    if (userData) {
      element.textContent = userData.displayName || userData.username || 'User';
    }
  });
}

// Function to update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
  console.log('User logged out');
}

// Function to check if user is authenticated
export function isUserAuthenticated() {
  return currentUser !== null;
}

// Function to get current user
export function getCurrentUser() {
  return currentUser;
}

// Function to get current user data
export function getCurrentUserData() {
  return userData;
}

// Function to sign out
export async function signOutUser() {
  try {
    await signOut(auth);
    window.location.href = 'landing.html';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

// Function to redirect based on authentication state
export function redirectBasedOnAuth() {
  const currentPage = window.location.pathname.split('/').pop();

  const doRedirect = async () => {
    const isAuthed = isUserAuthenticated();
    let hasProfile = !!(userData && userData.profileComplete);

    // Ensure we have fresh userData if authenticated
    if (isAuthed && !hasProfile) {
      try {
        const { getUserData } = await import('./user-utils.js');
        const fresh = await getUserData(currentUser.uid);
        if (fresh) {
          userData = fresh;
          hasProfile = !!fresh.profileComplete;
          localStorage.setItem('currentUser', JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            ...fresh
          }));
          userDataRefreshed = true;
        }
      } catch (e) {
        console.warn('Failed to refresh user data for redirect:', e);
      }
    }

    if (isAuthed) {
      // Authenticated users should not stay on auth pages
      if (currentPage === 'sign-in.html' || currentPage === 'sign-up.html') {
        if (hasProfile) {
          window.location.href = 'dashboard.html';
        } else {
          window.location.href = 'setup-profile.html';
        }
        return;
      }

      // If on setup-profile but profile already complete, go to dashboard
      if (currentPage === 'setup-profile.html' && hasProfile) {
        window.location.href = 'dashboard.html';
        return;
      }

    } else {
      // Unauthenticated users should not access protected pages
      const protectedPages = ['dashboard.html', 'dashboard-details.html', 'setup-profile.html'];
      if (protectedPages.includes(currentPage)) {
        window.location.href = 'sign-in.html';
        return;
      }
    }
  };

  if (authInitialized) {
    doRedirect();
  } else {
    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe();
      doRedirect();
    });
  }
}

// Export Firebase instances
export { app, auth, db };
