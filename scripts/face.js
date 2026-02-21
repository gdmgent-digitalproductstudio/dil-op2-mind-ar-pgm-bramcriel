document.addEventListener("DOMContentLoaded", () => {
  const METER_MAX = 100;
  const EYE_GLOW_START_PERCENT = 10;
  const LASER_START_PERCENT = 99;
  const CORRUPTION_PER_SECOND = 5;
  const RESIST_REDUCTION_PER_CLICK = 4;
  const movementMeterFill = document.getElementById("movement-meter-fill");
  const movementMeterText = document.getElementById("movement-meter-text");
  const resistButton = document.getElementById("resist-button");
  const ringEmpty = document.getElementById("ring-empty");
  const ringBase = document.getElementById("ring-base");
  const ringRed = document.getElementById("ring-red");
  const eyeAuraEntities = [
    document.getElementById("eye-aura-left"),
    document.getElementById("eye-aura-right"),
  ].filter(Boolean);
  const eyeGlowLayers = eyeAuraEntities.flatMap((eyeAura) =>
    Array.from(eyeAura.querySelectorAll(".eye-glow-layer")).map((layer) => ({
      element: layer,
      maxOpacity: Number(layer.dataset.maxOpacity) || 0.5,
      isCore: layer.classList.contains("eye-glow-core"),
    })),
  );
  const eyeLaserBeams = eyeAuraEntities.flatMap((eyeAura) =>
    Array.from(eyeAura.querySelectorAll(".eye-laser")),
  );

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

  const updateEyeGlowForMeter = () => {
    const rawProgress =
      (movementMeter - EYE_GLOW_START_PERCENT) /
      (METER_MAX - EYE_GLOW_START_PERCENT);
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    // Ease-in makes early glow subtle and ramps up near higher corruption.
    const glowIntensity = Math.pow(clampedProgress, 1.35);
    const shouldShowGlow = glowIntensity > 0;

    eyeAuraEntities.forEach((eyeAura) =>
      eyeAura.setAttribute("visible", shouldShowGlow),
    );

    eyeGlowLayers.forEach(({ element, maxOpacity, isCore }) => {
      const targetOpacity = Number((maxOpacity * glowIntensity).toFixed(3));
      element.setAttribute("material", "opacity", targetOpacity);

      if (!isCore) return;
      if (!shouldShowGlow) {
        element.removeAttribute("animation__pulse");
        return;
      }

      const pulseHigh = Math.max(targetOpacity, 0.02);
      const pulseLow = Math.max(
        Number((targetOpacity * 0.65).toFixed(3)),
        0.01,
      );
      element.setAttribute(
        "animation__pulse",
        `property: material.opacity; from: ${pulseHigh}; to: ${pulseLow}; dir: alternate; dur: 500; loop: true`,
      );
    });
  };

  const updateEyeLasersForMeter = () => {
    const showLasers = movementMeter >= LASER_START_PERCENT;
    eyeLaserBeams.forEach((laserBeam) =>
      laserBeam.setAttribute("visible", showLasers),
    );
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
    updateEyeGlowForMeter();
    updateEyeLasersForMeter();
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
    updateEyeGlowForMeter();
    updateEyeLasersForMeter();
    updateMeterUI();
  }, 1000);

  updateMeterUI();
  updateRingModelForMeter();
  updateShakeForMeter();
  updateEyeGlowForMeter();
  updateEyeLasersForMeter();
});
