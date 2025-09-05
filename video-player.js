// Video Player JavaScript
document.addEventListener('DOMContentLoaded', () => {
  console.log('Video player initializing...');
  
  // Get video data from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const videoType = urlParams.get('video');
  
  console.log('Video type from URL:', videoType);
  
  if (videoType) {
    loadVideoData(videoType);
  } else {
    // Default to first relaxing video if no parameter
    loadVideoData('relaxing-video1.mp4');
  }
  
  initializeVideoPlayer();
});

// Video data mapping
const videoData = {
  'relaxing-video1.mp4': {
    title: 'Nature Immersion',
    icon: '🌿',
    category: 'Mood Enhancer',
    duration: '1 min',
    purpose: 'Boost mood and reduce stress',
    description: 'Peaceful natural environments to boost mood and reduce stress. Immerse yourself in calming nature scenes.',
    videoFile: 'relaxing-video1.mp4',
    info: 'This nature immersion video features serene landscapes, gentle water sounds, and peaceful forest scenes designed to calm your mind and lift your spirits. Perfect for stress relief and mood enhancement.'
  },
  
  'relaxing-video2.mp4': {
    title: 'Therapeutic Music',
    icon: '🎵',
    category: 'Mood Enhancer',
    duration: '1 min',
    purpose: 'Emotional healing through music',
    description: 'Immersive musical experiences designed for emotional healing. Let the therapeutic sounds wash over you.',
    videoFile: 'relaxing-video2.mp4',
    info: 'This therapeutic music video combines soothing melodies with beautiful visual elements to create a healing experience. The carefully selected music helps reduce anxiety and promotes emotional well-being.'
  },
  
  'relaxing-video3.mp4': {
    title: 'Art Therapy',
    icon: '🎨',
    category: 'Mood Enhancer',
    duration: '1 min',
    purpose: 'Creative expression and healing',
    description: 'Creative expression through beautiful art and visual experiences. Stimulate your creativity and imagination.',
    videoFile: 'relaxing-video3.mp4',
    info: 'This art therapy video showcases beautiful artwork, creative processes, and inspiring visual elements. It\'s designed to stimulate creativity, reduce stress, and provide a sense of artistic fulfillment.'
  },
  
  'relaxing-video4.mp4': {
    title: 'Social Connection',
    icon: '👥',
    category: 'Mood Enhancer',
    duration: '1 min',
    purpose: 'Community and connection',
    description: 'Virtual social spaces for community building and support. Feel connected and supported.',
    videoFile: 'relaxing-video4.mp4',
    info: 'This social connection video features heartwarming scenes of community, friendship, and human connection. It\'s designed to combat loneliness and promote feelings of belonging and support.'
  }
};

function loadVideoData(videoType) {
  console.log('Loading video data for:', videoType);
  
  // If videoType is a filename, use it directly
  let video;
  if (videoType && videoType.includes('.mp4')) {
    // Direct filename provided
    video = {
      title: getVideoTitle(videoType),
      icon: getVideoIcon(videoType),
      category: 'Mood Enhancer',
      duration: '1 min',
      purpose: 'Mood Enhancement',
      description: 'Relaxing video for mood enhancement and stress relief.',
      videoFile: videoType,
      info: 'This relaxing video is designed to help improve your emotional state and reduce stress.'
    };
  } else {
    // Look up in video data
    video = videoData[videoType];
    if (!video) {
      console.error('Video not found:', videoType);
      return;
    }
  }
  
  console.log('Video object:', video);
  
  // Update page title
  document.title = `NeuroVR - ${video.title}`;
  
  // Update header elements
  if (document.getElementById('videoCategory')) {
    document.getElementById('videoCategory').textContent = video.category;
  }
  if (document.getElementById('videoTitle')) {
    document.getElementById('videoTitle').innerHTML = `
      <span>${video.icon}</span>
      ${video.title}
    `;
  }
  if (document.getElementById('videoDescription')) {
    document.getElementById('videoDescription').textContent = video.description;
  }
  if (document.getElementById('videoDuration')) {
    document.getElementById('videoDuration').textContent = video.duration;
  }
  if (document.getElementById('videoPurpose')) {
    document.getElementById('videoPurpose').textContent = video.purpose;
  }
  if (document.getElementById('videoInfo')) {
    document.getElementById('videoInfo').textContent = video.info;
  }
  
  // Set video source
  const videoElement = document.getElementById('videoPlayer');
  const videoSource = document.getElementById('videoSource');
  
  if (videoElement && videoSource) {
    console.log('Setting video source to:', video.videoFile);
    
    // Set the video source to the actual file
    videoSource.src = video.videoFile;
    videoElement.load(); // Reload the video element with the new source
    
    // Add error handling
    videoElement.addEventListener('error', (e) => {
      console.error('Video loading error:', e);
      console.error('Video source:', video.videoFile);
    });
    
    videoElement.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully:', video.videoFile);
    });
    
    videoElement.addEventListener('canplay', () => {
      console.log('Video can play:', video.videoFile);
    });
    
    // Force video to be ready
    videoElement.preload = 'auto';
  } else {
    console.error('Video element or source not found');
  }
}

function getVideoTitle(filename) {
  const titles = {
    'relaxing-video1.mp4': 'Nature Immersion',
    'relaxing-video2.mp4': 'Therapeutic Music',
    'relaxing-video3.mp4': 'Art Therapy',
    'relaxing-video4.mp4': 'Social Connection'
  };
  return titles[filename] || 'Relaxing Video';
}

function getVideoIcon(filename) {
  const icons = {
    'relaxing-video1.mp4': '🌿',
    'relaxing-video2.mp4': '🎵',
    'relaxing-video3.mp4': '🎨',
    'relaxing-video4.mp4': '👥'
  };
  return icons[filename] || '🎬';
}

function showVideoPlaceholder(video) {
  const videoWrapper = document.querySelector('.video-wrapper');
  videoWrapper.innerHTML = `
    <div class="video-placeholder">
      <div class="placeholder-icon">${video.icon}</div>
      <div class="placeholder-text">${video.title}</div>
      <div class="placeholder-subtext">Video file: ${video.videoFile}</div>
      <div class="placeholder-subtext" style="margin-top: 10px; font-size: 12px;">
        Add your MP4 file to the project folder to enable video playback
      </div>
    </div>
  `;
}

function initializeVideoPlayer() {
  const video = document.getElementById('videoPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const muteBtn = document.getElementById('muteBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const currentTimeDisplay = document.getElementById('currentTime');
  const totalTimeDisplay = document.getElementById('totalTime');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  
  // Play/Pause functionality
  playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
  
  // Stop functionality
  stopBtn.addEventListener('click', () => {
    video.pause();
    video.currentTime = 0;
    updatePlayPauseButton();
  });
  
  // Mute functionality
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    updateMuteButton();
  });
  
  // Volume control
  volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value / 100;
    if (video.volume > 0) {
      video.muted = false;
      updateMuteButton();
    }
  });
  
  // Progress bar click
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
  });
  
  // Fullscreen functionality
  fullscreenBtn.addEventListener('click', () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });
  
  // Repeat functionality
  repeatBtn.addEventListener('click', () => {
    video.currentTime = 0;
    video.play();
  });
  
  // Video event listeners
  video.addEventListener('play', updatePlayPauseButton);
  video.addEventListener('pause', updatePlayPauseButton);
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('loadedmetadata', updateDuration);
  video.addEventListener('volumechange', updateMuteButton);
  
  function updatePlayPauseButton() {
    const icon = document.getElementById('playPauseIcon');
    const text = document.getElementById('playPauseText');
    
    if (video.paused) {
      icon.textContent = '▶️';
      text.textContent = 'Play';
    } else {
      icon.textContent = '⏸️';
      text.textContent = 'Pause';
    }
  }
  
  function updateMuteButton() {
    const icon = document.getElementById('muteIcon');
    const text = document.getElementById('muteText');
    
    if (video.muted || video.volume === 0) {
      icon.textContent = '🔇';
      text.textContent = 'Unmute';
    } else {
      icon.textContent = '🔊';
      text.textContent = 'Mute';
    }
  }
  
  function updateProgress() {
    if (video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      progressFill.style.width = percentage + '%';
      currentTimeDisplay.textContent = formatTime(video.currentTime);
    }
  }
  
  function updateDuration() {
    if (video.duration) {
      totalTimeDisplay.textContent = formatTime(video.duration);
    }
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Initialize button states
  updatePlayPauseButton();
  updateMuteButton();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const video = document.getElementById('videoPlayer');
  
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      break;
    case 'KeyM':
      video.muted = !video.muted;
      updateMuteButton();
      break;
    case 'KeyF':
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
      break;
    case 'KeyR':
      video.currentTime = 0;
      video.play();
      break;
  }
});

function updateMuteButton() {
  const video = document.getElementById('videoPlayer');
  const icon = document.getElementById('muteIcon');
  const text = document.getElementById('muteText');
  
  if (video.muted || video.volume === 0) {
    icon.textContent = '🔇';
    text.textContent = 'Unmute';
  } else {
    icon.textContent = '🔊';
    text.textContent = 'Mute';
  }
}
