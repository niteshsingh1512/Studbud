(function () {
    let behaviorData = {
      website: window.location.hostname,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      mouseMovements: [],
      clicks: 0,
      scrollDistance: 0,
      scrollSpeed: 0,
      lastScrollTime: 0,
      lastScrollPos: 0,
      timeSpent: 0, // Total time spent in seconds
      startTime: Date.now() // Track start time
    };
  
    // Mouse movement tracking
    document.addEventListener("mousemove", (e) => {
      behaviorData.mouseMovements.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    });
  
    // Click tracking
    document.addEventListener("click", () => {
      behaviorData.clicks += 1;
    });
  
    // Scroll tracking
    document.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      const currentTime = Date.now();
  
      if (behaviorData.lastScrollTime) {
        const timeDiff = (currentTime - behaviorData.lastScrollTime) / 1000; // seconds
        const distance = Math.abs(currentScroll - behaviorData.lastScrollPos);
        behaviorData.scrollDistance += distance;
        behaviorData.scrollSpeed = distance / timeDiff; // pixels per second
      }
  
      behaviorData.lastScrollPos = currentScroll;
      behaviorData.lastScrollTime = currentTime;
    });
  
    // Send data every 10 seconds with runtime check
    const intervalId = setInterval(() => {
      // Update time spent
      const currentTime = Date.now();
      const elapsedTime = (currentTime - behaviorData.startTime) / 1000; // Convert to seconds
      behaviorData.timeSpent = Math.round(elapsedTime); // Round to nearest second
  
      if (
        behaviorData.mouseMovements.length > 0 ||
        behaviorData.clicks > 0 ||
        behaviorData.scrollDistance > 0 ||
        behaviorData.timeSpent > 0
      ) {
        if (chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage(
            {
              type: "behaviorData",
              data: behaviorData
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Runtime error:", chrome.runtime.lastError.message);
                return;
              }
              if (response && response.success) {
                // Reset data after successful send, but keep startTime for continuous tracking
                behaviorData.mouseMovements = [];
                behaviorData.clicks = 0;
                behaviorData.scrollDistance = 0;
                behaviorData.scrollSpeed = 0;
                behaviorData.startTime = Date.now(); // Reset start time for next interval
              } else {
                console.error("Failed to send data:", response ? response.error : "No response");
              }
            }
          );
        } else {
          console.warn("Chrome runtime unavailable. Stopping interval.");
          clearInterval(intervalId);
        }
      }
    }, 5000);
  
    // Cleanup on page unload and send final data
    window.addEventListener("unload", () => {
      clearInterval(intervalId);
      const finalTime = Math.round((Date.now() - behaviorData.startTime) / 1000);
      behaviorData.timeSpent = finalTime;
  
      if (chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          type: "behaviorData",
          data: behaviorData
        });
      }
      console.log("Page unloading, final time spent:", finalTime, "seconds");
    });
  
    console.log(`Tracking started on ${behaviorData.website}`);
  })();