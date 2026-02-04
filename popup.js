// Popup Script - VibeCoding Extension
// Role: Dumb view layer - captures audio, shows UI

console.log('Popup Loaded');

// DOM Elements
const pingBtn = document.getElementById('pingBtn');
const statusText = document.getElementById('status');

// Ping button click handler
pingBtn.addEventListener('click', async () => {
  statusText.textContent = 'Sending ping...';
  
  try {
    const response = await chrome.runtime.sendMessage({ type: 'PING' });
    console.log('Response from SW:', response);
    statusText.textContent = `Response: ${response?.message || 'No response'}`;
  } catch (error) {
    console.error('Error sending ping:', error);
    statusText.textContent = `Error: ${error.message}`;
  }
});
