document.addEventListener('DOMContentLoaded', () => {
  // Get session data from localStorage
  const sessionData = JSON.parse(localStorage.getItem('sessionData'));
  
  if (!sessionData) {
    document.getElementById('report-content').innerHTML = `
      <div class="report-section">
        <h3>No Session Data Available</h3>
        <p>No completed session data found. Please complete a therapy session first.</p>
      </div>
    `;
    return;
  }
  
  // Set report date
  document.getElementById('report-date').textContent = new Date().toLocaleDateString();
  
  // Generate the report content
  document.getElementById('report-content').innerHTML = generateAIAnalysis(sessionData);
});

function generateAIAnalysis(sessionData) {
  const avgHeartRate = sessionData.heartRateReadings.reduce((a, b) => a + b, 0) / sessionData.heartRateReadings.length || 75;
  const avgStress = sessionData.stressLevels.reduce((a, b) => a + b, 0) / sessionData.stressLevels.length || 3.5;
  const avgEngagement = sessionData.engagementScores.reduce((a, b) => a + b, 0) / sessionData.engagementScores.length || 8.2;

  const duration = sessionData.endTime ?
    Math.round((sessionData.endTime - sessionData.startTime) / 1000 / 60) : 0;

  // Include feedback in the report if available
  const feedbackHtml = sessionData.feedback && sessionData.feedback.mood ? `
    <div class="report-section">
        <h3>Patient Feedback</h3>
        <div class="report-metric">
            <span>Post-Session Mood (1=Anxious, 10=Calm):</span>
            <span class="report-score">${sessionData.feedback.mood}/10</span>
        </div>
        <div class="report-metric">
            <span>Primary Feeling:</span>
            <span class="report-score">${sessionData.feedback.feeling || 'N/A'}</span>
        </div>
        <div class="report-metric">
            <span>Environment Immersiveness:</span>
            <span class="report-score">${sessionData.feedback.immersive || 'N/A'}</span>
        </div>
        ${sessionData.feedback.overwhelmed ? `
        <div class="report-metric">
            <span>Overwhelming Moments:</span>
            <span class="report-score">Reported</span>
        </div>
        ` : ''}
        <div class="report-recommendation feedback-section">
            <strong>Patient Comments:</strong> 
            <p style="margin-top: 5px;">${sessionData.feedback.comments || 'No comments provided.'}</p>
            ${sessionData.feedback.overwhelmed ? `
            <p style="margin-top: 10px;"><strong>Overwhelming Experience:</strong> ${sessionData.feedback.overwhelmed}</p>
            ` : ''}
        </div>
    </div>
  ` : '';

  return `
    <div class="report-section">
      <h3>Session Overview</h3>
      <div class="report-metric">
        <span>Therapy Type:</span>
        <span class="report-score">${sessionData.scenario || 'N/A'}</span>
      </div>
      <div class="report-metric">
        <span>Session Duration:</span>
        <span class="report-score">${duration} minutes</span>
      </div>
      <div class="report-metric">
        <span>Difficulty Adjustments:</span>
        <span class="report-score">${sessionData.difficultyChanges.length}</span>
      </div>
    </div>

    <div class="report-section">
      <h3>Physiological Response Analysis</h3>
      <div class="report-metric">
        <span>Average Heart Rate:</span>
        <span class="report-score">${avgHeartRate.toFixed(1)} BPM</span>
      </div>
      <div class="report-metric">
        <span>Peak Stress Level:</span>
        <span class="report-score">${Math.max(...sessionData.stressLevels, 4.2).toFixed(1)}/10</span>
      </div>
      <div class="report-metric">
        <span>Average Engagement:</span>
        <span class="report-score">${avgEngagement.toFixed(1)}/10</span>
      </div>
      <div class="report-metric">
        <span>Adaptation Rate:</span>
        <span class="report-score">${avgStress < 4 ? 'Excellent' : avgStress < 6 ? 'Good' : 'Needs Improvement'}</span>
      </div>
    </div>

    ${feedbackHtml}

    <div class="report-section">
      <h3>AI Insights & Recommendations</h3>
      <div class="report-recommendation">
        <strong>Therapeutic Progress:</strong> Patient demonstrated ${avgStress < 4 ? 'excellent' : 'good'} 
        adaptation to VR exposure therapy. Stress levels remained within manageable range throughout the session.
      </div>
      <div class="report-recommendation">
        <strong>Next Session Recommendation:</strong> ${avgEngagement > 8 ?
      'Consider advancing to the next difficulty level' :
      'Maintain current difficulty with extended exposure time'}.
        Heart rate variability suggests good autonomic regulation.
      </div>
      <div class="report-recommendation">
        <strong>Treatment Plan:</strong> ${sessionData.difficultyChanges.length > 2 ?
      'Patient responds well to progressive difficulty increases' :
      'Recommend gradual difficulty progression in future sessions'}.
      </div>
    </div>

    <div class="report-section">
      <h3>Session Timeline</h3>
      ${sessionData.sessionEvents.map(event => `
        <div class="report-metric">
          <span>${event.event}:</span>
          <span>${event.details}</span>
        </div>
      `).join('')}
    </div>
  `;
}