import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

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
const storage = getStorage(app);

// Get elements
const nameInput = document.getElementById('name');
const bioInput = document.getElementById('bio');
const photoUpload = document.getElementById('photoUpload');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('profileForm');

let selectedFile = null;
let currentUser = null;

// Check authentication and load user data
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "sign-in.html";
    return;
  }

  currentUser = user;
  await loadUserData(user);
});

// Load user data and prefill form
async function loadUserData(user) {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Load username ke name field
      if (!userData.displayName && userData.username) {
        nameInput.value = userData.username;
        nameInput.style.background = '#f8f9ff';
        setTimeout(() => nameInput.style.background = '', 2000);
      } else if (userData.displayName) {
        nameInput.value = userData.displayName;
      }
      
      if (userData.bio) {
        bioInput.value = userData.bio;
      }
      
      // Load photo dari base64 atau Firebase Storage URL
      if (userData.profilePhoto) {
        showImagePreview(userData.profilePhoto);
      } else if (userData.photoURL) {
        showImagePreview(userData.photoURL);
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Photo upload handlers
photoUpload.addEventListener('click', () => {
  photoInput.click();
});

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      showImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

function showImagePreview(imageSrc) {
  photoPreview.innerHTML = `<img src="${imageSrc}" alt="Profile photo">`;
  photoPreview.classList.add('has-image');
}

function validateForm() {
  const name = nameInput.value.trim();
  
  if (!name) {
    alert('Name is required');
    return false;
  }
  
  if (name.length < 2) {
    alert('Name must be at least 2 characters');
    return false;
  }
  
  if (name.length > 50) {
    alert('Name must be less than 50 characters');
    return false;
  }
  
  const bio = bioInput.value.trim();
  if (bio.length > 100) {
    alert('Bio must be less than 100 characters');
    return false;
  }
  
  return true;
}

async function compressAndStorePhoto(file, userId) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = async () => {
      // Resize ke max 400x400 untuk balance quality vs size
      const maxSize = 400;
      let { width, height } = img;
      
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with good compression
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        // Store langsung di Firestore user document
        await updateDoc(doc(db, "users", userId), {
          profilePhoto: base64,
          photoUpdated: new Date()
        });
        
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Handle form submission with improved error handling
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  if (!currentUser) return;
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Setting up...';
  submitBtn.style.opacity = '0.6'
  
  try {
    const name = nameInput.value.trim();
    const bio = bioInput.value.trim();
    
    const updateData = {
      displayName: name,
      bio: bio,
      profileComplete: true,
      updatedAt: new Date()
    };
    
    // Handle photo upload if selected
    if (selectedFile) {
      try {
        console.log('Compressing and storing photo...');
        const photoBase64 = await compressAndStorePhoto(selectedFile, currentUser.uid);
        updateData.profilePhoto = photoBase64;
        console.log('Photo stored successfully');
      } catch (error) {
        console.error('Photo processing failed:', error);
        const continueWithoutPhoto = confirm(
          'Photo upload failed. Continue without photo?'
        );
        if (!continueWithoutPhoto) return;
      }
    }
    
    await updateDoc(doc(db, "users", currentUser.uid), updateData);

    // Sync localStorage currentUser so redirect logic reads latest profileComplete
    try {
      const existing = JSON.parse(localStorage.getItem('currentUser') || '{}');
      localStorage.setItem('currentUser', JSON.stringify({
        ...existing,
        uid: currentUser.uid,
        email: currentUser.email,
        ...updateData
      }));
    } catch (_) {}
    
    alert('🎉 Profile setup complete!');
    window.location.href = "dashboard.html";
    
  } catch (error) {
    console.error("Profile setup error:", error);
    alert("Failed to setup profile. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign Up';
  }
});

// Bio validation status (max 100 chars)
const bioStatus = document.getElementById('bioStatus');

function showBioStatus(message, className) {
  if (!bioStatus) return;
  bioStatus.style.opacity = '0';
  setTimeout(() => {
    bioStatus.textContent = message;
    bioStatus.className = `bio-status ${className} show`;
    setTimeout(() => {
      bioStatus.style.opacity = '1';
    }, 10);
  }, 150);
}

function hideBioStatus() {
  if (!bioStatus) return;
  bioStatus.style.opacity = '0';
  setTimeout(() => {
    bioStatus.textContent = '';
    bioStatus.className = 'bio-status';
  }, 150);
}

bioInput.addEventListener('input', function() {
  const length = this.value.length;

  // toggle invalid class
  if (length > 100) {
    this.classList.add('invalid');
    showBioStatus('Max 100 characters only', 'invalid');
    submitBtn.disabled = true;
  } else {
    this.classList.remove('invalid');
    if (length === 0) {
      hideBioStatus();
      submitBtn.disabled = true;
    } else {
      showBioStatus(``, 'valid');
      submitBtn.disabled = false;
    }
  }
});

// Auto-capitalize first letter
nameInput.addEventListener('input', function() {
  const value = this.value;
  if (value.length === 1) {
    this.value = value.charAt(0).toUpperCase();
  }
});