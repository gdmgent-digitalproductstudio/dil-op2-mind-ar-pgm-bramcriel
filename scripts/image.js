document.addEventListener("DOMContentLoaded", () => {
  console.log("Image Tracking Loaded");

  // Future expansion: corruption system variable
  let corruptionLevel = 0;

  const targets = document.querySelectorAll("[mindar-image-target]");

  targets.forEach((target, index) => {
    target.addEventListener("targetFound", () => {
      console.log("Target found:", index);
    });

    target.addEventListener("targetLost", () => {
      console.log("Target lost:", index);
    });
  });
});
