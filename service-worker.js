// Service Worker - VibeCoding Extension
console.log('SW Loaded');

// Offscreen document path
const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// Check if offscreen document already exists
async function hasOffscreenDocument() {
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
      return true;
    }
  }
  return false;
}

// Create offscreen document for AI processing
async function setupOffscreenDocument() {
  if (await hasOffscreenDocument()) {
    console.log('Offscreen document already exists');
    return;
  }

  try {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.WORKERS],
      justification: 'Run Whisper AI model for speech-to-text transcription'
    });
    console.log('Offscreen document created');
  } catch (error) {
    console.error('Error creating offscreen document:', error);
  }
}

// Initialize offscreen document on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed - setting up offscreen document');
  setupOffscreenDocument();
});

// Also setup on startup (in case SW was killed)
chrome.runtime.onStartup.addListener(() => {
  console.log('Extension started - setting up offscreen document');
  setupOffscreenDocument();
});

// Message handler - Routes messages between Popup and Offscreen
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('SW received message:', message.type, 'from:', sender.url || 'extension');

  // Handle messages based on type
  switch (message.type) {
    case 'PING':
      handlePing(sendResponse);
      return true; // Keep channel open for async response

    case 'OFFSCREEN_PONG':
      // Response from offscreen (handled via the forwarding promise)
      console.log('SW received PONG from Offscreen');
      break;

    default:
      console.log('Unknown message type:', message.type);
  }
});

// Forward PING to offscreen and get response
async function handlePing(sendResponse) {
  try {
    // Ensure offscreen document exists
    await setupOffscreenDocument();

    // Forward to offscreen
    console.log('SW forwarding PING to Offscreen');
    const response = await chrome.runtime.sendMessage({ type: 'PING_OFFSCREEN' });
    console.log('SW got response from Offscreen:', response);

    sendResponse({ message: 'Pong! (via SW → Offscreen → SW)' });
  } catch (error) {
    console.error('Error in handlePing:', error);
    sendResponse({ message: `Error: ${error.message}` });
  }
}
