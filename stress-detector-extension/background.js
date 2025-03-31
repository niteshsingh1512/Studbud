chrome.runtime.onStartup.addListener(() => {
    console.log("Extension started on browser open");
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"]
      }).catch((err) => console.error("Script injection failed:", err));
    }
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "behaviorData") {
      fetch("http://localhost:3000/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.data)
      })
        .then((res) => res.json())
        .then((data) => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true; // Keep channel open for async response
    }
  });