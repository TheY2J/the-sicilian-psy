// ===== Therapy Session Functions =====
let sessionActive = false;
let sessionTime = 0;
let timerInterval;
let currentScenario = null;
let currentVideoId = null;
let sessionData = {
  heartRateReadings: [],
  stressLevels: [],
  engagementScores: [],
  sessionEvents: [],
  startTime: null,
  endTime: null,
  scenario: null,
  difficultyChanges: [],
  feedback: {} // to store feedback
};

// Session type names mapping
const sessionNames = {
  'heights': 'Height Exposure Therapy',
  'darkness': 'Darkness Exposure Therapy',
  'ptsd': 'War Soldiers PTSD Therapy'
};

// Initialize the session from URL parameters
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionType = urlParams.get('session');
  const levelParam = urlParams.get('level');
  
  if (sessionType) {
    const level = Number(levelParam) || 1;
    const videoPath = getVideoPath(sessionType, level);
    startTherapySession(sessionType, videoPath);
  }
});

function startTherapySession(sessionType, videoId) {
  currentScenario = sessionType;
  currentVideoId = videoId;

  // Update the session info
  $('#session-type').textContent = sessionNames[sessionType] || sessionType;
  sessionData.scenario = sessionNames[sessionType] || sessionType;

  // Load the local 360 video via 360host.html iframe
  loadLocal360Video(videoId);
}

function loadLocal360Video(videoPath) {
  const iframe = document.getElementById('youtube-player');
  const placeholder = document.getElementById('videoPlaceholder');

  // Embed local 360 player with selected video
  const url = `360host.html?src=${encodeURIComponent(videoPath)}&minimal=1`;
  iframe.src = url;
  iframe.style.display = 'block';
  placeholder.style.display = 'none';
}

function getVideoPath(scenario, level) {
  // Define available levels for each scenario
  const availableLevels = {
    'heights': [1, 2, 3, 4],
    'darkness': [1, 2, 3, 4],
    'ptsd': [1] // Only Level 1 for PTSD
  };
  
  const levels = availableLevels[scenario] || [1, 2, 3, 4];
  const requestedLevel = Number(level) || 1;
  
  // Ensure the requested level is available for this scenario
  const safeLevel = levels.includes(requestedLevel) ? requestedLevel : levels[0];
  
  const mapping = {
    heights: (lvl) => {
      // Special case for level 4 which has a hyphen instead of underscore
      if (lvl === 4) return 'fear-of-heights-4.webm';
      return `fear_of_heights_${lvl}.webm`;
    },
    darkness: (lvl) => `darkness${lvl}.webm`,
    ptsd: (lvl) => `ptsd${lvl}.webm`
  };
  const builder = mapping[scenario];
  if (!builder) return `darkness1.webm`;
  const candidate = builder(safeLevel);
  console.log(`Video path for ${scenario} level ${safeLevel}: ${candidate}`);
  return candidate;
}

function showScenarioSelect() {
  const scenarioModal = document.getElementById('scenarioModal');
  if (scenarioModal) {
    scenarioModal.classList.add('show');
  }
}

function showDifficultyModal(scenario) {
  const difficultyModal = document.getElementById('difficultyModal');
  const difficultyOptions = document.querySelectorAll('.difficulty-option');
  
  if (!difficultyModal) return;
  
  // Define which levels are available for each scenario
  const availableLevels = {
    'heights': [1, 2, 3, 4],
    'darkness': [1, 2, 3, 4],
    'ptsd': [1] // Only Level 1 for PTSD
  };
  
  const levels = availableLevels[scenario] || [1, 2, 3, 4];
  
  // Show/hide difficulty options based on available levels
  difficultyOptions.forEach((option, index) => {
    const level = index + 1;
    if (levels.includes(level)) {
      option.style.display = 'flex';
    } else {
      option.style.display = 'none';
    }
  });
  
  // Update modal title to reflect scenario-specific levels
  const modalTitle = difficultyModal.querySelector('.modal-title');
  if (modalTitle) {
    if (scenario === 'ptsd') {
      modalTitle.textContent = 'PTSD Therapy - Level 1 Only';
    } else {
      modalTitle.textContent = 'Adjust Difficulty Level';
    }
  }
  
  // Update modal body text for PTSD
  const modalBody = difficultyModal.querySelector('.modal-body p');
  if (modalBody && scenario === 'ptsd') {
    modalBody.textContent = 'PTSD therapy is available at Level 1 only, designed for controlled and safe exposure therapy.';
  } else if (modalBody) {
    modalBody.textContent = 'Select the intensity level for your therapy session:';
  }
  
  difficultyModal.classList.add('show');
}

function startSession() {
  if (!sessionActive) {
    sessionActive = true;
    
    // Set start time only if not already set (first start)
    if (!sessionData.startTime) {
      sessionData.startTime = new Date();
      sessionData.patientName = 'John Doe';
      sessionData.patientId = 'VR-2025-001';
    }
    
    // Start the timer
    timerInterval = setInterval(updateTimer, 1000);
    
    // Add session start/resume event
    const eventType = sessionData.startTime && sessionTime > 0 ? 'Session Resumed' : 'Session Started';
    sessionData.sessionEvents.push({
      timestamp: new Date(),
      event: eventType,
      details: `Scenario: ${currentScenario || 'Not selected'}`
    });

    // Update button text
    updateStartButton();
  }

  const iframe = document.getElementById('youtube-player');
  if (iframe && iframe.contentWindow) {
    try { iframe.contentWindow.postMessage(JSON.stringify({ type: 'control', action: 'play' }), '*'); } catch (e) {}
  }
}

function pauseSession() {
  if (sessionActive) {
    sessionActive = false;
    clearInterval(timerInterval);
    
    // Add session pause event
    sessionData.sessionEvents.push({
      timestamp: new Date(),
      event: 'Session Paused',
      details: `Duration: ${Math.floor(sessionTime / 60)}:${(sessionTime % 60).toString().padStart(2, '0')}`
    });

    // Update button text
    updateStartButton();
  }

  const iframe = document.getElementById('youtube-player');
  if (iframe && iframe.contentWindow) {
    try { iframe.contentWindow.postMessage(JSON.stringify({ type: 'control', action: 'pause' }), '*'); } catch (e) {}
  }
}

function stopSession() {
  sessionActive = false;
  clearInterval(timerInterval);

  sessionData.endTime = new Date();
  sessionData.sessionEvents.push({
    timestamp: new Date(),
    event: 'Session Completed',
    details: `Total Duration: ${Math.floor(sessionTime / 60)}:${(sessionTime % 60).toString().padStart(2, '0')}`
  });

  // Stop the video playback
  const iframe = document.getElementById('youtube-player');
  if (iframe && iframe.contentWindow) {
    try { 
      iframe.contentWindow.postMessage(JSON.stringify({ type: 'control', action: 'stop' }), '*'); 
    } catch (e) {}
  }

  // Reset button state
  updateStartButton();

  // Show feedback modal (stay on this page)
  const feedbackModal = document.getElementById('feedbackModal');
  if (feedbackModal) feedbackModal.classList.add('show');
}

function adjustDifficulty() {
  if (!currentScenario) {
    alert('Please select a scenario first to adjust difficulty.');
    return;
  }

  showDifficultyModal(currentScenario);
}

function updateSessionDataDisplay() {
  document.getElementById('dataPoints').textContent = sessionData.heartRateReadings.length;
  document.getElementById('stressPoints').textContent = sessionData.stressLevels.length;
  document.getElementById('engagementPoints').textContent = sessionData.engagementScores.length;
  document.getElementById('totalDuration').textContent =
    `${Math.floor(sessionTime / 60)}:${(sessionTime % 60).toString().padStart(2, '0')}`;
  document.getElementById('sessionData').style.display = 'block';
}

function generateReport() {
  if (!sessionData.endTime) {
    alert('No completed session data available for report generation.');
    return;
  }

  // Store session data in localStorage for report generation
  localStorage.setItem('sessionData', JSON.stringify(sessionData));
  
  // Redirect to report page
  window.location.href = 'report.html';
}

function emergencyStop() {
  if (confirm('Are you sure you want to perform an emergency stop? This will immediately end the session and play a calming mood enhancer video.')) {
    if (sessionActive) {
      sessionData.sessionEvents.push({
        timestamp: new Date(),
        event: 'Emergency Stop',
        details: 'Session terminated by therapist/patient safety protocol - Mood enhancer video activated'
      });
    }

    // End session and remain on this page without showing feedback
    sessionActive = false;
    clearInterval(timerInterval);
    
    // Reset button state
    updateStartButton();
    
    const iframe = document.getElementById('youtube-player');
    if (iframe) {
      iframe.style.display = 'none';
      iframe.src = '';
    }
    
    // Play emergency mood enhancer video
    playEmergencyMoodVideo();
    
    const status = document.querySelector('.status-indicator');
    if (status) {
      const span = status.querySelector('span');
      if (span) span.textContent = 'Emergency Stop - Mood Enhancer Active';
      status.style.background = 'rgba(255, 193, 7, 0.2)';
    }

    // Persist data for report (if user wants to generate later)
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  }
}

function playEmergencyMoodVideo() {
  // Array of mood enhancer videos
  const moodVideos = [
    'relaxing-video1.mp4',
    'relaxing-video2.mp4', 
    'relaxing-video3.mp4',
    'relaxing-video4.mp4'
  ];
  
  // Select random video
  const randomVideo = moodVideos[Math.floor(Math.random() * moodVideos.length)];
  
  // Get video titles for display
  const videoTitles = {
    'relaxing-video1.mp4': 'Nature Immersion',
    'relaxing-video2.mp4': 'Therapeutic Music',
    'relaxing-video3.mp4': 'Art Therapy',
    'relaxing-video4.mp4': 'Social Connection'
  };
  
  const videoTitle = videoTitles[randomVideo] || 'Calming Video';
  
  // Create video element
  const videoContainer = document.querySelector('.video-container');
  if (videoContainer) {
    // Hide placeholder
    const placeholder = document.getElementById('videoPlaceholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    // Create or update emergency video element
    let emergencyVideo = document.getElementById('emergencyVideo');
    if (!emergencyVideo) {
      emergencyVideo = document.createElement('video');
      emergencyVideo.id = 'emergencyVideo';
      emergencyVideo.className = 'emergency-mood-video';
      emergencyVideo.controls = true;
      emergencyVideo.autoplay = true;
      emergencyVideo.loop = true;
      emergencyVideo.muted = false;
      emergencyVideo.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      `;
      videoContainer.appendChild(emergencyVideo);
    }
    
    // Set video source
    emergencyVideo.src = randomVideo;
    emergencyVideo.load();
    
    // Show emergency message
    const emergencyMessage = document.createElement('div');
    emergencyMessage.id = 'emergencyMessage';
    emergencyMessage.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      background: rgba(255, 193, 7, 0.9);
      color: #000;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      z-index: 1000;
      backdrop-filter: blur(10px);
    `;
    emergencyMessage.innerHTML = `
      <div style="font-size: 18px; margin-bottom: 5px;">🚨 Emergency Mode Activated</div>
      <div style="font-size: 14px;">Playing: ${videoTitle} - Take deep breaths and focus on the calming content</div>
    `;
    
    // Remove existing message if any
    const existingMessage = document.getElementById('emergencyMessage');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    videoContainer.appendChild(emergencyMessage);
    
    // Auto-hide message after 10 seconds
    setTimeout(() => {
      if (emergencyMessage) {
        emergencyMessage.style.opacity = '0';
        emergencyMessage.style.transition = 'opacity 2s ease';
        setTimeout(() => {
          if (emergencyMessage.parentNode) {
            emergencyMessage.remove();
          }
        }, 2000);
      }
    }, 10000);
    
    // Add event listener for when video ends
    emergencyVideo.addEventListener('ended', () => {
      // Loop the video
      emergencyVideo.currentTime = 0;
      emergencyVideo.play();
    });
    
    console.log('Emergency mood video activated:', randomVideo);
  }
}

// Function to manually select a specific mood enhancer video
function selectMoodEnhancer(videoFile) {
  // Close the mood enhancer modal
  const moodModal = document.getElementById('moodModal');
  if (moodModal) {
    moodModal.classList.remove('show');
  }
  
  const videoTitles = {
    'relaxing-video1.mp4': 'Nature Immersion',
    'relaxing-video2.mp4': 'Therapeutic Music',
    'relaxing-video3.mp4': 'Art Therapy',
    'relaxing-video4.mp4': 'Social Connection'
  };
  
  const videoTitle = videoTitles[videoFile] || 'Calming Video';
  
  // Create video element
  const videoContainer = document.querySelector('.video-container');
  if (videoContainer) {
    // Hide placeholder
    const placeholder = document.getElementById('videoPlaceholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    // Create or update mood video element
    let moodVideo = document.getElementById('moodVideo');
    if (!moodVideo) {
      moodVideo = document.createElement('video');
      moodVideo.id = 'moodVideo';
      moodVideo.className = 'mood-enhancer-video';
      moodVideo.controls = true;
      moodVideo.autoplay = true;
      moodVideo.loop = true;
      moodVideo.muted = false;
      moodVideo.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      `;
      videoContainer.appendChild(moodVideo);
    }
    
    // Set video source
    moodVideo.src = videoFile;
    moodVideo.load();
    
    // Show message
    const message = document.createElement('div');
    message.id = 'moodMessage';
    message.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      background: rgba(16, 185, 129, 0.9);
      color: #fff;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      z-index: 1000;
      backdrop-filter: blur(10px);
    `;
    message.innerHTML = `
      <div style="font-size: 18px; margin-bottom: 5px;">🌿 Mood Enhancer Active</div>
      <div style="font-size: 14px;">Playing: ${videoTitle} - Relax and enjoy the calming content</div>
    `;
    
    // Remove existing message if any
    const existingMessage = document.getElementById('moodMessage');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    videoContainer.appendChild(message);
    
    // Auto-hide message after 8 seconds
    setTimeout(() => {
      if (message) {
        message.style.opacity = '0';
        message.style.transition = 'opacity 2s ease';
        setTimeout(() => {
          if (message.parentNode) {
            message.remove();
          }
        }, 2000);
      }
    }, 8000);
    
    // Add event listener for when video ends
    moodVideo.addEventListener('ended', () => {
      // Loop the video
      moodVideo.currentTime = 0;
      moodVideo.play();
    });
    
    console.log('Mood enhancer video activated:', videoFile);
  }
}

// Function to show mood enhancer selection modal
function showMoodEnhancerSelect() {
  const moodModal = document.getElementById('moodModal');
  if (moodModal) {
    moodModal.classList.add('show');
  }
}

// ===== Modal Behavior =====
document.addEventListener('DOMContentLoaded', () => {
  // Scenario Selection Modal
  const scenarioModal = document.getElementById('scenarioModal');
  const closeScenarioModal = document.getElementById('closeScenarioModal');
  const scenarioOptions = document.querySelectorAll('.scenario-option');

  if (closeScenarioModal && scenarioModal) {
    closeScenarioModal.addEventListener('click', () => scenarioModal.classList.remove('show'));
    scenarioModal.addEventListener('click', (e) => { 
      if (e.target === scenarioModal) scenarioModal.classList.remove('show'); 
    });
  }

  scenarioOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selection from all options
      scenarioOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selection to clicked option
      option.classList.add('selected');
      
      const scenario = option.dataset.scenario;
      const scenarioNames = {
        'heights': 'Height Exposure Therapy',
        'darkness': 'Darkness Exposure Therapy',
        'ptsd': 'War Soldiers PTSD Therapy'
      };

      currentScenario = scenario;
      sessionData.scenario = scenarioNames[scenario];
      document.getElementById('session-type').textContent = sessionNames[scenario];

      // Close scenario modal and open difficulty modal
      scenarioModal.classList.remove('show');
      
      // Show difficulty selection with appropriate levels
      showDifficultyModal(scenario);
    });
  });

  // Difficulty Selection Modal
  const difficultyModal = document.getElementById('difficultyModal');
  const closeDifficultyModal = document.getElementById('closeDifficultyModal');
  const difficultyOptions = document.querySelectorAll('.difficulty-option');

  if (closeDifficultyModal && difficultyModal) {
    closeDifficultyModal.addEventListener('click', () => difficultyModal.classList.remove('show'));
    difficultyModal.addEventListener('click', (e) => { 
      if (e.target === difficultyModal) difficultyModal.classList.remove('show'); 
    });
  }

  // Mood Enhancer Selection Modal
  const moodModal = document.getElementById('moodModal');
  const closeMoodModal = document.getElementById('closeMoodModal');

  if (closeMoodModal && moodModal) {
    closeMoodModal.addEventListener('click', () => moodModal.classList.remove('show'));
    moodModal.addEventListener('click', (e) => { 
      if (e.target === moodModal) moodModal.classList.remove('show'); 
    });
  }

  difficultyOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selection from all options
      difficultyOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Add selection to clicked option
      option.classList.add('selected');
      
      const level = Number(option.dataset.level);
      const videoPath = getVideoPath(currentScenario, level);
      loadLocal360Video(videoPath);

      const label = ['Level 1', 'Level 2', 'Level 3', 'Level 4'][level - 1];
      sessionData.difficultyChanges.push({
        timestamp: new Date(),
        newDifficulty: label,
        sessionTime: sessionTime
      });
      sessionData.sessionEvents.push({
        timestamp: new Date(),
        event: 'Difficulty Adjusted',
        details: `Changed to: ${label}`
      });
      
      const notesContent = document.querySelector('.notes-content');
      if (notesContent) {
        notesContent.textContent = `Difficulty set to ${label}. Adjusting exposure intensity.`;
      }

      // Close difficulty modal
      difficultyModal.classList.remove('show');
    });
  });

  // Feedback Modal
  const moodScale = document.getElementById('moodScale');
  if (moodScale) {
    for (let i = 1; i <= 10; i++) {
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="mood" value="${i}" ${i === 5 ? 'checked' : ''}><span class="scale-value" data-value="${i}">${i}</span>`;
      moodScale.appendChild(label);
    }
  }

  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackModal = document.getElementById('feedbackModal');
  const closeFeedbackModal = document.getElementById('closeFeedbackModal');
  if (closeFeedbackModal && feedbackModal) {
    closeFeedbackModal.addEventListener('click', () => feedbackModal.classList.remove('show'));
    feedbackModal.addEventListener('click', (e) => { if (e.target === feedbackModal) feedbackModal.classList.remove('show'); });
  }
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const moodRating = document.querySelector('input[name="mood"]:checked').value;
      const feeling = document.querySelector('input[name="feeling"]:checked').value;
      const immersive = document.querySelector('input[name="immersive"]:checked').value;
      const overwhelmed = document.getElementById('overwhelmedText').value.trim();
      const comments = document.getElementById('feedbackComments').value.trim();

      sessionData.feedback = { mood: moodRating, feeling, immersive, overwhelmed, comments, timestamp: new Date().toISOString() };

      // Keep user on the same page, enable report button, and update UI
      if (feedbackModal) feedbackModal.classList.remove('show');
      const reportsBtn = document.getElementById('reportsBtn');
      if (reportsBtn) reportsBtn.classList.add('enabled');
      updateSessionDataDisplay();

      // Reset player and show completion state
      const iframe = document.getElementById('youtube-player');
      if (iframe) { iframe.style.display = 'none'; iframe.src = ''; }
      const placeholder = document.getElementById('videoPlaceholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
        const h3 = placeholder.querySelector('h3');
        const p = placeholder.querySelector('p');
        if (h3) h3.textContent = 'VR Session Complete';
        if (p) p.textContent = 'Session data collected - Generate AI report';
      }
      const status = document.querySelector('.status-indicator');
      if (status) {
        const span = status.querySelector('span');
        if (span) span.textContent = 'Session Ended - Report Available';
        status.style.background = 'rgba(107, 114, 128, 0.2)';
      }

      // Persist for report.html
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    });
  }

  // ===== Add mood color logic and option button selection (match feedback.js) =====
  function valueToHsl(value) {
    const v = Number(value);
    const t = (v - 1) / 9; // 0..1
    const h = Math.round(t * 120); // 0 (red) to 120 (green)
    return `hsl(${h}, 80%, 45%)`;
  }

  function updateMoodColors() {
    document.querySelectorAll('.mood-scale .scale-value').forEach(span => {
      span.style.background = 'transparent';
      span.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      span.style.color = '#9aa';
    });
    const checked = document.querySelector('.mood-scale input:checked');
    if (checked) {
      const value = checked.value;
      const color = valueToHsl(value);
      const span = checked.nextElementSibling;
      span.style.background = color;
      span.style.borderColor = color;
      span.style.color = '#fff';
    }
  }

  // Initialize mood colors and listeners if mood scale exists
  if (document.querySelector('.mood-scale')) {
    updateMoodColors();
    document.querySelectorAll('.mood-scale input').forEach(radio => {
      radio.addEventListener('change', updateMoodColors);
    });
  }

  // Option button selection handling (visual state + radio check)
  document.addEventListener('click', (e) => {
    const label = e.target.closest('.option-btn');
    if (!label) return;
    const input = label.querySelector('input[type="radio"]');
    if (!input) return;
    const container = label.parentElement;
    container.querySelectorAll('.option-btn').forEach(l => l.classList.remove('selected'));
    label.classList.add('selected');
    input.checked = true;
  });
});

function startMonitoringSimulation() {
  setInterval(() => {
    if (sessionActive) {
      // Generate and store heart rate data
      const heartRate = 70 + Math.random() * 20;
      document.getElementById('heartRate').textContent = Math.round(heartRate);
      sessionData.heartRateReadings.push(heartRate);

      // Generate and display respiration rate (breaths per minute)
      const respiration = 12 + Math.random() * 8; // 12-20 bpm typical
      const rrEl = document.getElementById('respirationRate');
      if (rrEl) rrEl.textContent = Math.round(respiration);
      const rrFill = document.querySelector('.respiration-rate .metric-fill');
      if (rrFill) rrFill.style.width = Math.min(Math.max(((respiration - 8) / 24) * 100, 0), 100) + '%';

      // Generate and display SpO2 percentage
      const spo2 = 96 + Math.random() * 4; // 96-100%
      const spo2El = document.getElementById('spo2');
      if (spo2El) spo2El.textContent = spo2.toFixed(1);
      const spo2Fill = document.querySelector('.spo2 .metric-fill');
      if (spo2Fill) spo2Fill.style.width = Math.min(Math.max(spo2, 0), 100) + '%';

      // Update progress
      const progress = Math.min((sessionTime / 600) * 100, 100); // 10 minute session
      document.getElementById('progress').textContent = Math.round(progress);
      document.querySelector('.session-progress .metric-fill').style.width = progress + '%';
    }
  }, 2000);
}

function updateTimer() {
  sessionTime++;
  const minutes = Math.floor(sessionTime / 60);
  const seconds = sessionTime % 60;
  document.getElementById('timer').textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStartButton() {
  const startBtn = document.getElementById('startResumeBtn');
  if (startBtn) {
    if (sessionActive) {
      startBtn.innerHTML = '<span>⏸</span> Session Active';
      startBtn.classList.remove('primary');
    } else if (sessionTime > 0) {
      startBtn.innerHTML = '<span>▶</span> Resume Session';
      startBtn.classList.add('primary');
    } else {
      startBtn.innerHTML = '<span>▶</span> Start Session';
      startBtn.classList.add('primary');
    }
  }
}

// Initialize monitoring simulation on page load
startMonitoringSimulation();