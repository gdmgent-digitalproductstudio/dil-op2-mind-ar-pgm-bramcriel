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
  let shakingRing = null;
  let shakeDurationMs = null;

  const updateRingModelForMeter = () => {
    const showRed = movementMeter >= METER_MAX;
    const showBase = movementMeter > 30 && movementMeter < METER_MAX;
    const showEmpty = movementMeter <= 30;

    if (ringEmpty) ringEmpty.setAttribute("visible", showEmpty);
    if (ringBase) ringBase.setAttribute("visible", showBase);
    if (ringRed) ringRed.setAttribute("visible", showRed);
  };

  const toPositionObject = (positionAttribute) => {
    if (typeof positionAttribute === "object" && positionAttribute !== null) {
      return positionAttribute;
    }

    if (typeof positionAttribute === "string") {
      const [x, y, z] = positionAttribute.split(" ").map(Number);
      return { x: x || 0, y: y || 0, z: z || 0 };
    }

    return { x: 0, y: 0, z: 0 };
  };

  const startShakeAnimation = (ringEntity, durationMs) => {
    if (!ringEntity) return;
    const position = toPositionObject(ringEntity.getAttribute("position"));
    const shakeTo = `${position.x + 0.045} ${position.y} ${position.z}`;
    ringEntity.setAttribute(
      "animation__forgeShake",
      `property: position; from: ${position.x} ${position.y} ${position.z}; to: ${shakeTo}; dir: alternate; loop: true; dur: ${durationMs}; easing: easeInOutSine`,
    );
  };

  const stopShakeAnimation = (ringEntity) => {
    if (!ringEntity) return;
    ringEntity.removeAttribute("animation__forgeShake");
  };

  const getVisibleRing = () => {
    if (ringRed?.getAttribute("visible")) return ringRed;
    if (ringBase?.getAttribute("visible")) return ringBase;
    if (ringEmpty?.getAttribute("visible")) return ringEmpty;
    return null;
  };

  const updateShakeForMeter = () => {
    const isFullyCorrupted = movementMeter >= METER_MAX;
    const shouldShake = movementMeter >= 65 && !isFullyCorrupted;
    const targetShakeDuration = movementMeter >= 80 ? 40 : 70;
    const visibleRing = getVisibleRing();

    if (!shouldShake) {
      if (shakingRing) {
        stopShakeAnimation(shakingRing);
        shakingRing = null;
        shakeDurationMs = null;
      }
      return;
    }

    if (!visibleRing) return;
    if (shakingRing && shakingRing !== visibleRing) {
      stopShakeAnimation(shakingRing);
      shakingRing = null;
      shakeDurationMs = null;
    }
    if (!shakingRing || shakeDurationMs !== targetShakeDuration) {
      if (shakingRing) stopShakeAnimation(shakingRing);
      startShakeAnimation(visibleRing, targetShakeDuration);
      shakingRing = visibleRing;
      shakeDurationMs = targetShakeDuration;
    }
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
    updateShakeForMeter();
    updateMeterUI();
  };

  if (resistButton) {
    resistButton.addEventListener("click", resistRing);
  }

  window.setInterval(() => {
    if (movementMeter >= METER_MAX) return;

    movementMeter = Math.min(METER_MAX, movementMeter + CORRUPTION_PER_SECOND);
    updateRingModelForMeter();
    updateShakeForMeter();
    updateMeterUI();
  }, 1000);

  updateMeterUI();
  updateRingModelForMeter();
  updateShakeForMeter();
});
