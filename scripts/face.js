document.addEventListener("DOMContentLoaded", () => {
  const METER_MAX = 100;
  const CORRUPTION_PER_SECOND = 10;
  const RESIST_REDUCTION_PER_CLICK = 4;
  const movementMeterFill = document.getElementById("movement-meter-fill");
  const movementMeterText = document.getElementById("movement-meter-text");
  const resistButton = document.getElementById("resist-button");
  const ringEmpty = document.getElementById("ring-empty");
  const ringBase = document.getElementById("ring-base");
  const ringRed = document.getElementById("ring-red");

  let movementMeter = 0;

  const updateRingModelForMeter = () => {
    const showRed = movementMeter >= METER_MAX;
    const showBase = movementMeter > 30 && movementMeter < METER_MAX;
    const showEmpty = movementMeter <= 30;

    if (ringEmpty) ringEmpty.setAttribute("visible", showEmpty);
    if (ringBase) ringBase.setAttribute("visible", showBase);
    if (ringRed) ringRed.setAttribute("visible", showRed);
  };

  const updateMeterUI = () => {
    const roundedValue = Math.round(movementMeter);
    if (movementMeterFill) {
      movementMeterFill.style.width = `${roundedValue}%`;
    }
    if (movementMeterText) {
      movementMeterText.textContent = `Corruption meter: ${roundedValue}%`;
    }
  };

  const resistRing = () => {
    movementMeter = Math.max(0, movementMeter - RESIST_REDUCTION_PER_CLICK);
    updateRingModelForMeter();
    updateMeterUI();
  };

  if (resistButton) {
    resistButton.addEventListener("click", resistRing);
  }

  window.setInterval(() => {
    if (movementMeter >= METER_MAX) return;

    movementMeter = Math.min(METER_MAX, movementMeter + CORRUPTION_PER_SECOND);
    updateRingModelForMeter();
    updateMeterUI();
  }, 1000);

  updateMeterUI();
  updateRingModelForMeter();
});
