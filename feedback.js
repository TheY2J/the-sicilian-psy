document.addEventListener('DOMContentLoaded', () => {
  // Generate mood scale
  const moodScale = document.getElementById('moodScale');
  for (let i = 1; i <= 10; i++) {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="radio" name="mood" value="${i}" ${i === 5 ? 'checked' : ''}>
      <span class="scale-value" data-value="${i}">${i}</span>
    `;
    moodScale.appendChild(label);
  }
  
  // Initialize mood colors
  updateMoodColors();
  
  // Set up event listeners for mood scale
  document.querySelectorAll('.mood-scale input').forEach(radio => {
    radio.addEventListener('change', updateMoodColors);
  });
  
  // Option button selection handling
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
  
  // Form submission
  document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmit);
});

// Function to map mood value to HSL color (1=red, 10=green)
function valueToHsl(value) {
  const v = Number(value);
  const t = (v - 1) / 9; // 0..1
  const h = Math.round(t * 120); // 0 (red) to 120 (green)
  return `hsl(${h}, 80%, 45%)`;
}

// Update mood scale colors based on selection
function updateMoodColors() {
  // Reset all mood scale values
  document.querySelectorAll('.mood-scale .scale-value').forEach(span => {
    span.style.background = 'transparent';
    span.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    span.style.color = '#9aa';
  });

  // Set the checked one
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

function handleFeedbackSubmit(e) {
  e.preventDefault();
  
  const moodRating = document.querySelector(`input[name="mood"]:checked`).value;
  const feeling = document.querySelector(`input[name="feeling"]:checked`).value;
  const immersive = document.querySelector(`input[name="immersive"]:checked`).value;
  const overwhelmed = document.getElementById('overwhelmedText').value.trim();
  const comments = document.getElementById('feedbackComments').value.trim();

  // Get existing session data
  let sessionData = JSON.parse(localStorage.getItem('sessionData')) || {};
  
  // Add feedback to session data
  sessionData.feedback = {
    mood: moodRating,
    feeling,
    immersive,
    overwhelmed,
    comments,
    timestamp: new Date().toISOString()
  };
  
  // Save updated session data
  localStorage.setItem('sessionData', JSON.stringify(sessionData));

  // Open AI analysis report immediately
  window.location.href = 'report.html';
}