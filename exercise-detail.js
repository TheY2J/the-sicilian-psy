// Exercise Detail Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Get exercise data from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseType = urlParams.get('exercise');
  
  if (exerciseType) {
    loadExerciseData(exerciseType);
  } else {
    // Default to breathing exercise if no parameter
    loadExerciseData('heights-breathing');
  }
});

// Exercise data mapping
const exerciseData = {
  // Fear of Heights Exercises
  'heights-breathing': {
    title: 'Controlled Breathing',
    icon: '🌬️',
    category: 'Fear of Heights',
    duration: '5-10 min',
    purpose: 'Manage acute anxiety',
    description: 'Follow breathing patterns to calm your nervous system when facing heights. This technique helps manage acute anxiety and panic responses.',
    instructions: [
      'Find a comfortable seated or standing position',
      'Inhale slowly through your nose for 4 seconds',
      'Hold your breath for 4 seconds',
      'Exhale slowly through your mouth for 6 seconds',
      'Repeat this cycle 5-10 times',
      'Focus on the rhythm and feel your body relaxing'
    ],
    benefits: [
      { icon: '🧠', text: 'Reduces Panic' },
      { icon: '💪', text: 'Builds Control' },
      { icon: '🎯', text: 'Improves Focus' },
      { icon: '😌', text: 'Promotes Calm' }
    ]
  },
  
  'heights-grounding': {
    title: 'Grounded Stance',
    icon: '👣',
    category: 'Fear of Heights',
    duration: '5-15 min',
    purpose: 'Counteract instability',
    description: 'Practice stable positioning to counteract feelings of instability in high places. Build confidence through proper stance and body awareness.',
    instructions: [
      'Stand with your feet shoulder-width apart',
      'Distribute your weight evenly between both feet',
      'Feel the connection between your feet and the ground',
      'Slightly bend your knees to improve stability',
      'Practice shifting weight gently from side to side',
      'Maintain this stance for 2-3 minutes'
    ],
    benefits: [
      { icon: '⚖️', text: 'Improves Balance' },
      { icon: '💪', text: 'Builds Confidence' },
      { icon: '🎯', text: 'Reduces Dizziness' },
      { icon: '😌', text: 'Creates Stability' }
    ]
  },
  
  'heights-reframing': {
    title: 'Cognitive Reframing',
    icon: '🧠',
    category: 'Fear of Heights',
    duration: '10-20 min',
    purpose: 'Challenge fearful thoughts',
    description: 'Learn to reframe anxious thoughts about heights into more balanced perspectives. Challenge and replace irrational fears with realistic thinking.',
    instructions: [
      'Identify the anxious thought (e.g., "I\'m going to fall!")',
      'Challenge its validity - is there evidence for this thought?',
      'Replace it with a more balanced, realistic thought',
      'Repeat the new thought several times to reinforce it',
      'Practice this technique daily for best results',
      'Keep a journal of your thought patterns'
    ],
    benefits: [
      { icon: '🧠', text: 'Changes Thinking' },
      { icon: '💪', text: 'Builds Resilience' },
      { icon: '🎯', text: 'Reduces Fear' },
      { icon: '😌', text: 'Promotes Logic' }
    ]
  },
  
  // Fear of Darkness Exercises
  'darkness-sensory': {
    title: 'Sensory Amplification',
    icon: '👂',
    category: 'Fear of Darkness',
    duration: '10-15 min',
    purpose: 'Shift focus from darkness',
    description: 'Redirect attention from absence of light to other sensory experiences. This technique helps shift focus away from darkness-related fears.',
    instructions: [
      'Close your eyes and focus on ambient sounds around you',
      'Identify and name each sound you can detect',
      'Pay attention to tactile sensations (clothing, chair, etc.)',
      'Notice your breathing rhythm and body temperature',
      'Describe these sensations to yourself mentally',
      'Practice for 10-15 minutes daily'
    ],
    benefits: [
      { icon: '👂', text: 'Enhances Hearing' },
      { icon: '🤲', text: 'Improves Touch' },
      { icon: '🎯', text: 'Reduces Fear' },
      { icon: '😌', text: 'Promotes Calm' }
    ]
  },
  
  'darkness-vision': {
    title: 'Peripheral Vision',
    icon: '👁️',
    category: 'Fear of Darkness',
    duration: '5-10 min',
    purpose: 'Reduce hyper-vigilance',
    description: 'Expand your peripheral vision to counteract tunnel vision in darkness. This exercise helps reduce hyper-vigilance and anxiety in dark environments.',
    instructions: [
      'Consciously relax your gaze in the dark environment',
      'Try to notice the outermost edges of your visual field',
      'Without moving your eyes, expand your awareness',
      'Practice soft focus rather than intense staring',
      'Notice how this reduces feelings of tension',
      'Practice for 5-10 minutes at a time'
    ],
    benefits: [
      { icon: '👁️', text: 'Expands Vision' },
      { icon: '💪', text: 'Reduces Tension' },
      { icon: '🎯', text: 'Improves Awareness' },
      { icon: '😌', text: 'Promotes Relaxation' }
    ]
  },
  
  'darkness-light': {
    title: 'Light Control',
    icon: '💡',
    category: 'Fear of Darkness',
    duration: '10-20 min',
    purpose: 'Build empowerment',
    description: 'Gradually increase tolerance to darkness while maintaining control. This technique builds empowerment and sense of agency in dark environments.',
    instructions: [
      'Start with maximum brightness and get comfortable',
      'Gradually decrease the light in small steps',
      'Stay at each level until your anxiety reduces',
      'If overwhelmed, return to a brighter level',
      'Practice this progression daily',
      'Celebrate each small victory'
    ],
    benefits: [
      { icon: '💡', text: 'Builds Control' },
      { icon: '💪', text: 'Increases Confidence' },
      { icon: '🎯', text: 'Reduces Fear' },
      { icon: '😌', text: 'Promotes Empowerment' }
    ]
  },
  
  // PTSD Exercises
  'ptsd-anchoring': {
    title: 'Present-Moment Anchoring',
    icon: '⚓',
    category: 'PTSD Therapy',
    duration: '5-15 min',
    purpose: 'Prevent flashbacks',
    description: 'Re-engage with present reality when experiencing PTSD symptoms. This emergency technique helps prevent or interrupt flashbacks and dissociation.',
    instructions: [
      'Name three things you can feel right now',
      'Identify two things you can hear',
      'Notice one thing you can see in detail',
      'Focus on your breath moving in and out',
      'Repeat a grounding phrase: "I am here now"',
      'Practice this sequence when symptoms arise'
    ],
    benefits: [
      { icon: '⚓', text: 'Grounds You' },
      { icon: '💪', text: 'Prevents Flashbacks' },
      { icon: '🎯', text: 'Improves Focus' },
      { icon: '😌', text: 'Promotes Safety' }
    ]
  },
  
  'ptsd-safe': {
    title: 'Safe Space Visualization',
    icon: '🏠',
    category: 'PTSD Therapy',
    duration: '10-25 min',
    purpose: 'Create mental escape',
    description: 'Develop and access a mental sanctuary when triggers become overwhelming. This exercise helps create a mental escape hatch during distress.',
    instructions: [
      'Before sessions, practice visualizing a detailed safe place',
      'Include all sensory details (sights, sounds, smells)',
      'During distress, close your eyes and visit this mental space',
      'Stay there until your physiology calms down',
      'Return to the present feeling more regulated',
      'Practice accessing this space daily'
    ],
    benefits: [
      { icon: '🏠', text: 'Creates Safety' },
      { icon: '💪', text: 'Builds Resilience' },
      { icon: '🎯', text: 'Reduces Stress' },
      { icon: '😌', text: 'Promotes Peace' }
    ]
  },
  
  'ptsd-narrative': {
    title: 'Narrative Coherence',
    icon: '📖',
    category: 'PTSD Therapy',
    duration: '15-30 min',
    purpose: 'Process memories',
    description: 'Reframe traumatic experiences as completed events rather than ongoing threats. This technique helps process memories safely and constructively.',
    instructions: [
      'After an exposure segment, verbally narrate what happened',
      'Use the third person (e.g., "The person in the scenario...")',
      'Describe events in chronological order',
      'Focus on facts rather than emotions',
      'End with a statement about safety in the present',
      'Practice this technique with a therapist'
    ],
    benefits: [
      { icon: '📖', text: 'Processes Trauma' },
      { icon: '💪', text: 'Builds Understanding' },
      { icon: '🎯', text: 'Reduces Fear' },
      { icon: '😌', text: 'Promotes Healing' }
    ]
  },
  
  // Common Exercises
  'common-diaphragmatic': {
    title: 'Diaphragmatic Breathing',
    icon: '🫁',
    category: 'Common Exercise',
    duration: '5-15 min',
    purpose: 'Regulate nervous system',
    description: 'Deep breathing technique to lower baseline anxiety and manage stress. This is the foundational breathing technique for anxiety management.',
    instructions: [
      'Place one hand on your chest, the other on your abdomen',
      'Inhale slowly through your nose for 4 seconds',
      'Feel your abdomen expand while your chest remains still',
      'Hold for 4 seconds',
      'Exhale slowly through your mouth for 6 seconds',
      'Repeat for 5-10 cycles, multiple times daily'
    ],
    benefits: [
      { icon: '🫁', text: 'Regulates Breathing' },
      { icon: '💪', text: 'Reduces Stress' },
      { icon: '🎯', text: 'Improves Focus' },
      { icon: '😌', text: 'Promotes Calm' }
    ]
  },
  
  'common-pmr': {
    title: 'Progressive Muscle Relaxation',
    icon: '💪',
    category: 'Common Exercise',
    duration: '15-25 min',
    purpose: 'Release tension',
    description: 'Systematically tense and release muscle groups to reduce physical anxiety. This technique helps recognize and release muscle tension that accompanies anxiety.',
    instructions: [
      'Start with your feet, tense muscles for 5 seconds',
      'Release suddenly and notice the sensation of relaxation',
      'Move upward to calves, thighs, abdomen, hands, arms',
      'Continue to shoulders, neck, and facial muscles',
      'Practice daily for 10-15 minutes',
      'Focus on the contrast between tension and relaxation'
    ],
    benefits: [
      { icon: '💪', text: 'Releases Tension' },
      { icon: '💪', text: 'Reduces Anxiety' },
      { icon: '🎯', text: 'Improves Sleep' },
      { icon: '😌', text: 'Promotes Relaxation' }
    ]
  },
  
  'common-observation': {
    title: 'Mindful Observation',
    icon: '🔍',
    category: 'Common Exercise',
    duration: '5-15 min',
    purpose: 'Ground in present',
    description: 'Divert attention from anxious thoughts to external, neutral stimuli. This mindfulness practice helps ground you in the present moment.',
    instructions: [
      'Select a neutral object in your environment',
      'Focus on it intently for 1-2 minutes',
      'Notice its color, shape, texture, and other qualities',
      'If your mind wanders, gently return focus to the object',
      'Practice this daily with different objects',
      'Gradually increase the observation time'
    ],
    benefits: [
      { icon: '🔍', text: 'Improves Focus' },
      { icon: '💪', text: 'Reduces Anxiety' },
      { icon: '🎯', text: 'Grounds You' },
      { icon: '😌', text: 'Promotes Mindfulness' }
    ]
  }
};

function loadExerciseData(exerciseType) {
  const exercise = exerciseData[exerciseType];
  if (!exercise) {
    console.error('Exercise not found:', exerciseType);
    return;
  }
  
  // Update page title
  document.title = `NeuroVR - ${exercise.title}`;
  
  // Update header elements
  document.getElementById('exerciseCategory').textContent = exercise.category;
  document.getElementById('exerciseTitle').innerHTML = `
    <span>${exercise.icon}</span>
    ${exercise.title}
  `;
  document.getElementById('exerciseDescription').textContent = exercise.description;
  document.getElementById('exerciseDuration').textContent = exercise.duration;
  document.getElementById('exercisePurpose').textContent = exercise.purpose;
  
  // Update instructions
  const instructionsList = document.getElementById('exerciseInstructions');
  instructionsList.innerHTML = exercise.instructions.map(instruction => 
    `<li>${instruction}</li>`
  ).join('');
  
  // Update benefits
  const benefitsGrid = document.getElementById('benefitsGrid');
  benefitsGrid.innerHTML = exercise.benefits.map(benefit => 
    `<div class="benefit-item">
      <div class="benefit-icon">${benefit.icon}</div>
      <div class="benefit-text">${benefit.text}</div>
    </div>`
  ).join('');
  
  // Set up demo functionality
  setupDemo(exerciseType);
}

function setupDemo(exerciseType) {
  const startDemoBtn = document.getElementById('startDemoBtn');
  const demoContainer = document.getElementById('demoContainer');
  
  startDemoBtn.addEventListener('click', () => {
    startExerciseDemo(exerciseType, demoContainer);
  });
}

function startExerciseDemo(exerciseType, container) {
  // Clear previous demo
  container.innerHTML = '';
  
  // Create demo based on exercise type
  switch(exerciseType) {
    case 'heights-breathing':
    case 'common-diaphragmatic':
      createBreathingDemo(container);
      break;
    case 'heights-grounding':
      createGroundingDemo(container);
      break;
    case 'heights-reframing':
      createReframingDemo(container);
      break;
    case 'darkness-sensory':
      createSensoryDemo(container);
      break;
    case 'darkness-vision':
      createVisionDemo(container);
      break;
    case 'darkness-light':
      createLightDemo(container);
      break;
    case 'ptsd-anchoring':
      createAnchoringDemo(container);
      break;
    case 'ptsd-safe':
      createSafeSpaceDemo(container);
      break;
    case 'ptsd-narrative':
      createNarrativeDemo(container);
      break;
    case 'common-pmr':
      createPMRDemo(container);
      break;
    case 'common-observation':
      createObservationDemo(container);
      break;
    default:
      container.innerHTML = '<div class="demo-placeholder">Demo not available for this exercise</div>';
  }
}

function createBreathingDemo(container) {
  container.innerHTML = `
    <div style="width: 150px; height: 150px; border-radius: 50%; background: #3b82f6; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; animation: breathe 8s infinite ease-in-out;" id="breathing-circle">
      INHALE
    </div>
    <style>
      @keyframes breathe {
        0% { transform: scale(0.8); background: #3b82f6; }
        25% { transform: scale(1.5); background: #2563eb; }
        50% { transform: scale(1.5); background: #2563eb; }
        75% { transform: scale(0.8); background: #3b82f6; }
        100% { transform: scale(0.8); background: #3b82f6; }
      }
    </style>
  `;
  
  // Update breathing text
  const circle = document.getElementById('breathing-circle');
  const updateBreathText = () => {
    const time = Date.now() % 14000;
    if (time < 4000) {
      circle.textContent = 'INHALE';
    } else if (time < 8000) {
      circle.textContent = 'HOLD';
    } else {
      circle.textContent = 'EXHALE';
    }
    requestAnimationFrame(updateBreathText);
  };
  updateBreathText();
}

function createGroundingDemo(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
      <div style="display: flex; gap: 40px;">
        <div style="width: 80px; height: 120px; background: #6b7280; border-radius: 40px; animation: ground 4s infinite ease-in-out;"></div>
        <div style="width: 80px; height: 120px; background: #6b7280; border-radius: 40px; animation: ground 4s infinite ease-in-out; animation-delay: 0.5s;"></div>
      </div>
      <div style="font-size: 48px; color: #10b981;">⚖️</div>
    </div>
    <style>
      @keyframes ground {
        0% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0); }
      }
    </style>
  `;
}

function createReframingDemo(container) {
  container.innerHTML = `
    <div style="width: 100%; max-width: 400px; margin: 0 auto;">
      <div style="background: #ef4444; color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; transition: all 0.5s ease;">
        <p style="font-weight: bold; margin: 0;">"I'm going to fall!"</p>
      </div>
      <div style="font-size: 48px; margin: 20px 0; text-align: center;">
        ⬇️
      </div>
      <div style="background: #10b981; color: white; padding: 20px; border-radius: 12px; transition: all 0.5s ease;">
        <p style="font-weight: bold; margin: 0;">"I'm safe and secure on this stable surface."</p>
      </div>
    </div>
  `;
}

function createSensoryDemo(container) {
  container.innerHTML = `
    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
      <div style="width: 80px; height: 80px; border-radius: 50%; background: #4a6cf7; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; animation: pulse 2s infinite;">👂</div>
      <div style="width: 80px; height: 80px; border-radius: 50%; background: #10b981; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; animation: pulse 2s infinite; animation-delay: 0.5s;">🤲</div>
      <div style="width: 80px; height: 80px; border-radius: 50%; background: #ef4444; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; animation: pulse 2s infinite; animation-delay: 1s;">👁️</div>
      <div style="width: 80px; height: 80px; border-radius: 50%; background: #6b7280; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; animation: pulse 2s infinite; animation-delay: 1.5s;">🌬️</div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    </style>
  `;
}

function createVisionDemo(container) {
  container.innerHTML = `
    <div style="width: 200px; height: 200px; position: relative; margin: 0 auto;">
      <div style="width: 100%; height: 100%; border-radius: 50%; border: 2px dashed #4a6cf7; position: absolute; top: 0; left: 0; animation: expand 6s infinite;"></div>
      <div style="width: 100px; height: 100px; border-radius: 50%; background: rgba(74, 108, 247, 0.5); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: focus 6s infinite;"></div>
    </div>
    <style>
      @keyframes focus {
        0%, 30% { width: 100px; height: 100px; opacity: 0.8; }
        50%, 80% { width: 200px; height: 200px; opacity: 0.4; }
        100% { width: 100px; height: 100px; opacity: 0.8; }
      }
      @keyframes expand {
        0%, 30% { width: 100%; height: 100%; opacity: 0.3; }
        50%, 80% { width: 130%; height: 130%; top: -15%; left: -15%; opacity: 0.6; }
        100% { width: 100%; height: 100%; opacity: 0.3; }
      }
    </style>
  `;
}

function createLightDemo(container) {
  container.innerHTML = `
    <div style="width: 250px; height: 150px; background: #000; border-radius: 12px; position: relative; overflow: hidden; margin: 0 auto;">
      <div style="width: 60px; height: 60px; background: #ffd700; border-radius: 50%; position: absolute; top: 20px; left: 50%; transform: translateX(-50%); box-shadow: 0 0 50px 20px rgba(255, 215, 0, 0.5);" id="light-bulb"></div>
      <div style="width: 80%; margin: 100px auto 0;">
        <input type="range" min="0" max="100" value="100" style="width: 100%;" id="light-slider">
      </div>
    </div>
  `;
  
  // Add slider functionality
  const slider = document.getElementById('light-slider');
  const bulb = document.getElementById('light-bulb');
  slider.addEventListener('input', function() {
    const value = this.value;
    bulb.style.boxShadow = `0 0 ${value/2}px ${value/5}px rgba(255, 215, 0, ${value/200})`;
    bulb.style.opacity = value/100;
  });
}

function createAnchoringDemo(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 15px; max-width: 300px; margin: 0 auto;">
      <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px; animation: appear 0.5s forwards; opacity: 0;">
        <span style="color: #10b981; font-weight: bold;">1</span>
        <span>Name three things you can feel</span>
      </div>
      <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px; animation: appear 0.5s forwards; opacity: 0; animation-delay: 0.5s;">
        <span style="color: #10b981; font-weight: bold;">2</span>
        <span>Identify two things you can hear</span>
      </div>
      <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px; animation: appear 0.5s forwards; opacity: 0; animation-delay: 1s;">
        <span style="color: #10b981; font-weight: bold;">3</span>
        <span>Notice one thing you can see</span>
      </div>
    </div>
    <style>
      @keyframes appear {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  `;
}

function createSafeSpaceDemo(container) {
  container.innerHTML = `
    <div style="width: 100%; height: 150px; background: linear-gradient(135deg, #87ceeb, #e0f7fa); border-radius: 12px; position: relative; overflow: hidden;">
      <div style="width: 60px; height: 60px; background: #ffd700; border-radius: 50%; position: absolute; top: 20px; right: 20px;"></div>
      <div style="width: 0; height: 0; border-left: 100px solid transparent; border-right: 100px solid transparent; border-bottom: 60px solid #4caf50; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);"></div>
      <div style="width: 100%; height: 30px; background: #2196f3; position: absolute; bottom: 0; left: 0;"></div>
    </div>
  `;
}

function createNarrativeDemo(container) {
  container.innerHTML = `
    <div style="max-width: 400px; margin: 0 auto;">
      <textarea style="width: 100%; height: 120px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; font-size: 16px; resize: none;" placeholder="Describe what happened in the third person..."></textarea>
      <button style="margin-top: 15px; padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer;">Save Narrative</button>
    </div>
  `;
}

function createPMRDemo(container) {
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 300px; margin: 0 auto;">
      <div style="padding: 15px 10px; background: white; border-radius: 8px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); animation: tense 4s infinite; gap: 12px;">
        <span style="flex: 1; text-align: left; font-weight: 500;">Feet</span>
        <span style="color: #6b7280; font-size: 22px;">🦶</span>
      </div>
      <div style="padding: 15px 10px; background: white; border-radius: 8px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); animation: tense 4s infinite; gap: 12px;">
        <span style="flex: 1; text-align: left; font-weight: 500;">Arms</span>
        <span style="color: #6b7280; font-size: 22px;">💪</span>
      </div>
      <div style="padding: 15px 10px; background: white; border-radius: 8px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); animation: tense 4s infinite; gap: 12px;">
        <span style="flex: 1; text-align: left; font-weight: 500;">Shoulders</span>
        <span style="color: #6b7280; font-size: 22px;">👤</span>
      </div>
      <div style="padding: 15px 10px; background: white; border-radius: 8px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); animation: tense 4s infinite; gap: 12px;">
        <span style="flex: 1; text-align: left; font-weight: 500;">Face</span>
        <span style="color: #6b7280; font-size: 22px;">😊</span>
      </div>
    </div>
    <style>
      @keyframes tense {
        0%, 60% { background: white; }
        70%, 80% { background: #ffe0b2; }
        90%, 100% { background: white; }
      }
    </style>
  `;
}

function createObservationDemo(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
      <div style="width: 120px; height: 120px; background: #6b7280; border-radius: 12px; position: relative; overflow: hidden;">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 10px; transform: translateY(100%); transition: transform 0.5s;">
          <p style="margin: 0; font-size: 12px;">Texture: Smooth</p>
          <p style="margin: 0; font-size: 12px;">Color: Blue</p>
        </div>
      </div>
      <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">02:00</div>
    </div>
  `;
}

// Practice button functionality
document.getElementById('practiceBtn').addEventListener('click', () => {
  alert('Practice session would start here. This would integrate with the VR therapy system.');
});
