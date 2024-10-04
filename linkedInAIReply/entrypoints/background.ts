export default defineBackground(() => {
  console.log('Background script loaded!', { id: chrome.runtime.id });

  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background script received message:', message);

    if (message.action === 'openModal') {
      // Open the popup and wait for a response
      chrome.action.openPopup(() => {
        console.log('Popup opened, sending message to React app (popup)...');

        // Send a message to the React app (popup)
        chrome.runtime.sendMessage({ action: 'triggerModal' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to React app:', chrome.runtime.lastError);
          } else {
            console.log('Message sent to React app successfully:', response);
          }
        });

        // Make sure the message port stays open for async operations
        sendResponse({ status: 'Message received in background script' });
      });
    }

    // Return true to keep the message port open for async responses
    return true;
  });
});
