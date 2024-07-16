console.log("From content page");

chrome.storage.local.get(["CountShortsYT"]).then((result) => {
  const data = result.key;
  console.log("Value is " + result.key);
});

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, message } = obj;

  if (type === "BLOCK_YT_SHORTS") {
    // content.js

    console.log("YouTube Focus Mode script loaded.");

    // Create a style element
    const style = document.createElement("style");
    style.textContent = `
    #focus-mode-overlay {
        position: fixed;
        top: 0;
        left: 240px;
        width: 90%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        z-index: 10000;
    }
`;
    document.head.appendChild(style);

    // Create a focus mode overlay
    const focusOverlay = document.createElement("div");
    focusOverlay.id = "focus-mode-overlay";
    focusOverlay.innerText = "You are in Focus Mode";

    // Append the overlay to the body
    document.body.appendChild(focusOverlay);

    console.log("Focus mode overlay added.");

    // You can add further actions here, like hiding the short or displaying a message
  }
});
