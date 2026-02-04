// Offscreen Document - VibeCoding Extension
// This runs in a hidden document context for AI processing
console.log('Offscreen Loaded');

// Message handler - receives messages from Service Worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Offscreen received message:', message.type);

  switch (message.type) {
    case 'PING_OFFSCREEN':
      console.log('Offscreen processing PING');
      sendResponse({ message: 'Pong from Offscreen!' });
      return true;

    default:
      console.log('Offscreen: Unknown message type:', message.type);
  }
});
