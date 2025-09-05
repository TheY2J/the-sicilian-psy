// ===== Therapist Dashboard Functions =====
let sessionData = null;
let isMonitoring = false;
let monitoringInterval = null;
let sessionStartTime = null;
let currentSessionDuration = 0;

// Initialize the therapist dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadSessionData();
  startMonitoring();
  updateUI();
});

// Load session data from localStorage or simulate real-time data
function loadSessionData() {
  // Try to load from localStorage first (from completed sessions)
  const storedData = localStorage.getItem('sessionData');
  if (storedData) {
    sessionData = JSON.parse(storedData);
    updateSessionInfo();
  } else {
    // Simulate active session data
    sessionData = {
      startTime: new Date(),
      scenario: 'Height Exposure Therapy',
      difficulty: 'Level 2',
      patientName: 'John Doe',
      patientId: 'VR-2025-001',
      heartRateReadings: [],
      stressLevels: [],
      engagementScores: [],
      sessionEvents: [
        {
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          event: 'Session Started',
          details: 'Height Exposure Therapy - Level 2'
        }
      ]
    };
    sessionStartTime = sessionData.startTime;
    isMonitoring = true;
  }
}

// Start real-time monitoring simulation
function startMonitoring() {
  if (monitoringInterval) return;
  
  monitoringInterval = setInterval(() => {
    if (isMonitoring) {
      updateVitals();
      updateSessionDuration();
      generateAIRecommendations();
    }
  }, 2000);
}

// Update real-time vitals
function updateVitals() {
  // Simulate heart rate (70-90 BPM with some variation)
  const baseHeartRate = 75;
  const variation = Math.sin(Date.now() / 10000) * 5 + Math.random() * 3;
  const heartRate = Math.round(baseHeartRate + variation);
  
  document.getElementById('heartRate').textContent = heartRate;
  
  // Store heart rate reading
  if (sessionData) {
    sessionData.heartRateReadings.push({
      timestamp: new Date(),
      value: heartRate
    });
  }
  
  // Update stress level based on heart rate
  let stressLevel = 'Low';
  let stressColor = 'trend-down';
  if (heartRate > 85) {
    stressLevel = 'High';
    stressColor = 'trend-up';
  } else if (heartRate > 80) {
    stressLevel = 'Medium';
    stressColor = 'trend-stable';
  }
  
  document.getElementById('stressLevel').textContent = stressLevel;
  const stressTrend = document.querySelector('#stressLevel').parentElement.querySelector('.vital-trend');
  stressTrend.innerHTML = `<span class="${stressColor}">${heartRate > 80 ? '↑' : heartRate < 75 ? '↓' : '↔'}</span><span>${heartRate > 80 ? 'Rising' : heartRate < 75 ? 'Improving' : 'Stable'}</span>`;
  
  // Simulate respiration rate (12-20 breaths/min)
  const respirationRate = Math.round(14 + Math.random() * 4);
  document.getElementById('respirationRate').textContent = respirationRate;
  
  // Simulate SpO2 (96-100%)
  const spo2 = (98 + Math.random() * 2).toFixed(1);
  document.getElementById('spo2').textContent = spo2;
  
  // Simulate engagement (70-95%)
  const engagement = Math.round(80 + Math.random() * 15);
  document.getElementById('engagement').textContent = engagement + '%';
  
  // Update session progress
  const progress = Math.min((currentSessionDuration / 600) * 100, 100); // 10 minute session
  document.getElementById('sessionProgress').textContent = Math.round(progress) + '%';
}

// Update session duration
function updateSessionDuration() {
  if (sessionStartTime) {
    const now = new Date();
    const diff = now - sessionStartTime;
    currentSessionDuration = Math.floor(diff / 1000);
    
    const minutes = Math.floor(currentSessionDuration / 60);
    const seconds = currentSessionDuration % 60;
    const durationText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('sessionDuration').textContent = `Duration: ${durationText}`;
    document.getElementById('totalDuration').textContent = durationText;
  }
}

// Update session information
function updateSessionInfo() {
  if (!sessionData) return;
  
  document.getElementById('patientName').textContent = sessionData.patientName || 'John Doe';
  document.getElementById('currentSession').textContent = `Current Session: ${sessionData.scenario || 'Height Exposure Therapy'}`;
  
  // Update session status
  const statusIndicator = document.getElementById('sessionStatus');
  const statusText = document.getElementById('sessionStatusText');
  
  if (sessionData.endTime) {
    statusIndicator.className = 'status-indicator inactive';
    statusText.textContent = 'Session Completed';
    isMonitoring = false;
  } else {
    statusIndicator.className = 'status-indicator';
    statusText.textContent = 'Session Active';
    isMonitoring = true;
  }
}

// Generate AI recommendations based on current data
function generateAIRecommendations() {
  const recommendations = document.getElementById('aiRecommendations');
  const heartRate = parseInt(document.getElementById('heartRate').textContent);
  const stressLevel = document.getElementById('stressLevel').textContent;
  const progress = parseInt(document.getElementById('sessionProgress').textContent);
  
  let newRecommendations = [];
  
  // Heart rate based recommendations
  if (heartRate > 85) {
    newRecommendations.push({
      title: '⚠️ High Heart Rate Alert',
      text: 'Patient showing elevated heart rate. Consider reducing difficulty or providing breathing guidance.'
    });
  } else if (heartRate < 70) {
    newRecommendations.push({
      title: '📈 Ready for Challenge',
      text: 'Heart rate is stable and low. Patient may be ready for increased difficulty level.'
    });
  }
  
  // Progress based recommendations
  if (progress > 50 && stressLevel === 'Low') {
    newRecommendations.push({
      title: '🎯 Progress Assessment',
      text: 'Patient is adapting well. Consider advancing to next difficulty level in 2-3 minutes.'
    });
  }
  
  // Update recommendations display
  if (newRecommendations.length > 0) {
    recommendations.innerHTML = newRecommendations.map(rec => `
      <div class="recommendation-item">
        <div class="recommendation-title">${rec.title}</div>
        <div class="recommendation-text">${rec.text}</div>
      </div>
    `).join('');
  }
}

// Update session events
function addSessionEvent(event, details) {
  const eventsContainer = document.getElementById('sessionEvents');
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  
  const eventElement = document.createElement('div');
  eventElement.className = 'history-item';
  eventElement.innerHTML = `
    <div class="history-time">${timeString}</div>
    <div class="history-event">${event}</div>
  `;
  
  eventsContainer.insertBefore(eventElement, eventsContainer.firstChild);
  
  // Keep only last 10 events
  while (eventsContainer.children.length > 10) {
    eventsContainer.removeChild(eventsContainer.lastChild);
  }
  
  // Store in session data
  if (sessionData) {
    sessionData.sessionEvents.unshift({
      timestamp: now,
      event: event,
      details: details
    });
  }
}

// Session control functions
function pauseSession() {
  if (isMonitoring) {
    isMonitoring = false;
    addSessionEvent('Session Paused', 'Therapist paused the session');
    showNotification('Session paused by therapist');
  } else {
    isMonitoring = true;
    addSessionEvent('Session Resumed', 'Therapist resumed the session');
    showNotification('Session resumed by therapist');
  }
}

function adjustDifficulty() {
  const newLevel = prompt('Enter new difficulty level (1-4):', '2');
  if (newLevel && newLevel >= 1 && newLevel <= 4) {
    addSessionEvent('Difficulty Adjusted', `Changed to Level ${newLevel}`);
    showNotification(`Difficulty adjusted to Level ${newLevel}`);
    
    // Update session data
    if (sessionData) {
      sessionData.difficulty = `Level ${newLevel}`;
      document.getElementById('currentSession').textContent = 
        `Current Session: ${sessionData.scenario} - Level ${newLevel}`;
    }
  }
}

function sendMessage() {
  const message = prompt('Enter message to send to patient:');
  if (message) {
    addSessionEvent('Message Sent', `"${message}"`);
    showNotification('Message sent to patient');
  }
}

function emergencyStop() {
  if (confirm('Are you sure you want to perform an emergency stop? This will immediately end the session.')) {
    isMonitoring = false;
    clearInterval(monitoringInterval);
    
    // Update UI
    const statusIndicator = document.getElementById('sessionStatus');
    const statusText = document.getElementById('sessionStatusText');
    statusIndicator.className = 'status-indicator danger';
    statusText.textContent = 'Emergency Stop';
    
    addSessionEvent('Emergency Stop', 'Session terminated by therapist');
    showNotification('Emergency stop activated - Session terminated');
    
    // Store session data
    if (sessionData) {
      sessionData.endTime = new Date();
      sessionData.sessionEvents.push({
        timestamp: new Date(),
        event: 'Emergency Stop',
        details: 'Session terminated by therapist for safety'
      });
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    }
  }
}

function refreshData() {
  showNotification('Data refreshed');
  updateUI();
}

// Update all UI elements
function updateUI() {
  updateSessionInfo();
  updateVitals();
  updateSessionDuration();
  generateAIRecommendations();
  
  // Update summary statistics
  if (sessionData && sessionData.heartRateReadings.length > 0) {
    const avgHeartRate = Math.round(
      sessionData.heartRateReadings.reduce((sum, reading) => sum + reading.value, 0) / 
      sessionData.heartRateReadings.length
    );
    document.getElementById('avgHeartRate').textContent = avgHeartRate + ' BPM';
  }
  
  // Update success rate based on stress levels
  const stressLevel = document.getElementById('stressLevel').textContent;
  let successRate = 85;
  if (stressLevel === 'High') successRate = 60;
  else if (stressLevel === 'Medium') successRate = 75;
  else if (stressLevel === 'Low') successRate = 90;
  
  document.getElementById('successRate').textContent = successRate + '%';
  document.getElementById('peakStress').textContent = stressLevel;
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(59, 130, 246, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
});
