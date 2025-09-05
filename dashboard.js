// ===== Helpers =====
const $ = (q, scope = document) => scope.querySelector(q);
const $$ = (q, scope = document) => Array.from(scope.querySelectorAll(q));
const toast = $('#toast');

function showToast(msg = 'Done!') {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

// ===== Section Nav =====
function activateSection(id) {
  $$('.main-content').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
  $$('.nav-link').forEach(n => n.classList.remove('active'));
  const link = $(`.nav-link[data-target="${id}"]`);
  if (link) link.classList.add('active');
  // close dropdown if open
  $('#profileDropdown').classList.remove('show');

  // Save active section to localStorage
  localStorage.setItem('activeSection', id);
}

// Check for saved section on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedSection = localStorage.getItem('activeSection') || 'dashboard';
  activateSection(savedSection);
});

$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (link.dataset.target === 'reports') {
      window.location.href = 'report_final.html';
      return;
    }
    activateSection(link.dataset.target);
  });
});

// shortcuts from buttons with data-target
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-target]');
  if (el && !el.classList.contains('nav-link')) {
    if (el.dataset.target === 'reports') {
      window.location.href = 'report_final.html';
      return;
    }
    activateSection(el.dataset.target);
  }
});

// ===== Profile Dropdown =====
const profileBtn = $('#userProfile');
const dropdown = $('#profileDropdown');
profileBtn.addEventListener('click', (e) => {
  dropdown.classList.toggle('show');
  e.stopPropagation();
});
document.addEventListener('click', (e) => {
  if (!profileBtn.contains(e.target)) dropdown.classList.remove('show');
});

// ===== Theme Toggle =====
const themeToggle = $('#themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLightTheme = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
  showToast(isLightTheme ? 'Light theme activated ☀️' : 'Dark theme activated 🌙');
  dropdown.classList.remove('show');
});

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    const themeSelect = $('#themeSelect');
    if (themeSelect) themeSelect.value = 'Light';
  }
});

$('#logoutBtn').addEventListener('click', () => showToast('Logged out'));

// ===== Profile actions (from final.html behavior) =====
const saveProfileBtn = $('#saveProfile');
if (saveProfileBtn) {
  saveProfileBtn.addEventListener('click', () => showToast('Profile saved ✔'));
}

const savePrefsBtn = $('#savePrefs');
if (savePrefsBtn) {
  savePrefsBtn.addEventListener('click', () => showToast('Preferences updated 💾'));
}

const themeSelect = $('#themeSelect');
if (themeSelect) {
  themeSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Light') {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ===== Therapy Sessions (redirect to video session) =====
const modal = $('#sessionModal');
const closeModal = $('#closeModal');
const startBtn = $('#startSessionBtn');

$$('.session-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.dataset.session || 'Therapy Session';
    const sessionType = card.dataset.session;
    const videoId = card.dataset.video;
    const exerciseType = card.dataset.exercise;
    const moodVideo = card.dataset.video; // For mood enhancer videos
    
    // Check if this is an exercise card (has data-exercise attribute)
    if (exerciseType) {
      // Navigate to exercise detail page
      const url = `exercise-detail.html?exercise=${encodeURIComponent(exerciseType)}`;
      window.location.href = url;
      return;
    }
    
    // Check if this is a mood enhancer video card (has data-video but no data-session)
    if (moodVideo && !sessionType) {
      // Navigate to video player page
      const url = `video-player.html?video=${encodeURIComponent(moodVideo)}`;
      window.location.href = url;
      return;
    }
    
    // Handle regular therapy session cards
    if (sessionType && videoId) {
      const url = `video-session.html?session=${encodeURIComponent(sessionType)}&video=${encodeURIComponent(videoId)}`;
      window.location.href = url;
      return;
    }

    // Fallback: open modal if data is missing
    $('#modalTitle').textContent = name;
    $('#modalBody').textContent = `You're starting "${name}". Put on your headset and follow the on-screen guidance.`;
    modal.classList.add('show');

    modal.dataset.sessionType = sessionType;
    modal.dataset.videoId = videoId;
  });
});

closeModal.addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('show');
});

startBtn.addEventListener('click', () => {
  const sessionType = modal.dataset.sessionType;
  const videoId = modal.dataset.videoId;

  // Redirect to video session page with parameters
  window.location.href = `video-session.html?session=${sessionType}&video=${videoId}`;
});

// ===== Dropdown functionality =====
function setupDropdown(dropdownId, gridId) {
  const dropdownBtn = $(`#${dropdownId}`);
  const sessionsGrid = $(`#${gridId}`);
  
  dropdownBtn.addEventListener('click', () => {
    const isExpanded = dropdownBtn.classList.contains('expanded');
    
    if (isExpanded) {
      // Collapse
      dropdownBtn.classList.remove('expanded');
      sessionsGrid.classList.add('collapsed');
      dropdownBtn.querySelector('.dropdown-text').textContent = 'Expand';
    } else {
      // Expand
      dropdownBtn.classList.add('expanded');
      sessionsGrid.classList.remove('collapsed');
      dropdownBtn.querySelector('.dropdown-text').textContent = 'Collapse';
    }
  });
}

// Setup all dropdowns
setupDropdown('dropdownBtn1', 'sessionsGrid1');
setupDropdown('dropdownBtn2', 'sessionsGrid2');
setupDropdown('dropdownBtn3', 'sessionsGrid3');

// ===== Open first dropdown by default =====
window.addEventListener('DOMContentLoaded', () => {
  const firstBtn = document.getElementById('dropdownBtn1');
  const firstGrid = document.getElementById('sessionsGrid1');
  
  // Expand first
  firstBtn.classList.add('expanded');
  firstGrid.classList.remove('collapsed');
  firstBtn.querySelector('.dropdown-text').textContent = 'Collapse';

  // Make sure others are collapsed
  ['2', '3'].forEach(num => {
    const btn = document.getElementById(`dropdownBtn${num}`);
    const grid = document.getElementById(`sessionsGrid${num}`);
    btn.classList.remove('expanded');
    grid.classList.add('collapsed');
    btn.querySelector('.dropdown-text').textContent = 'Expand';
  });
});
$('#newSession').addEventListener('click', () => {
  $('#modalTitle').textContent = 'New Session';
  $('#modalBody').textContent = 'Create a custom therapy session tailored to your needs.';
  modal.classList.add('show');
});
$('#exportReport').addEventListener('click', () => showToast('Report exported 📤'));
$('#startBreathing').addEventListener('click', () => {
  showToast('Breathing cycle started 🧘');
  // Simulate breathing exercise timer
  setTimeout(() => showToast('Breathing cycle completed 🎉'), 5000);
});

// ===== Progress Ring (demo animation to 70%) =====
function animateRing(el, target = 70, duration = 900) {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const val = Math.round(p * target);
    el.style.setProperty('--p', val);
    $('#goalText').textContent = val + '%';
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Initialize progress ring animation
document.addEventListener('DOMContentLoaded', () => {
  animateRing($('#goalRing'), 70);
  
  // Set card indices for staggered animation
  $$('.session-card').forEach((card, index) => {
    card.style.setProperty('--card-index', index);
  });
});