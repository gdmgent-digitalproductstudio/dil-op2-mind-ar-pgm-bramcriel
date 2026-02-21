document.addEventListener("DOMContentLoaded", () => {
  const FORGE_DURATION_MS = 3000;
  let activeTargetIndex = null;
  let isForging = false;

  const targets = document.querySelectorAll("[mindar-image-target]");
  const targetsByIndex = new Map();
  const forgedStateByTargetIndex = {};
  const forgeButton = document.getElementById("forge-button");
  const downloadMarkersButton = document.getElementById(
    "download-markers-button",
  );
  const forgeButtonTitle = document.getElementById("forge-button-title");
  const forgeButtonSubtitle = document.getElementById("forge-button-subtitle");
  const forgeStatus = document.getElementById("forge-status");
  const forgeStatusText = document.getElementById("forge-status-text");
  const forgeProgressFill = document.getElementById("forge-progress-fill");
  let messageTimeoutId = null;
  const markerFiles = [
    "markers/target-0.jpg",
    "markers/target-1.jpg",
    "markers/target-2.jpg",
    "markers/target-3.jpg",
  ];

  const triggerFileDownload = (filePath, downloadName) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = downloadName || filePath.split("/").pop() || "marker.jpg";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const showForgeStatus = (text, progressPercent) => {
    if (!forgeStatus || !forgeStatusText || !forgeProgressFill || !forgeButton)
      return;
    forgeButton.style.display = "none";
    forgeButton.hidden = true;
    forgeStatus.style.display = "flex";
    forgeStatus.hidden = false;
    forgeStatus.setAttribute("aria-hidden", "false");
    forgeStatusText.textContent = text;
    forgeProgressFill.style.width = `${progressPercent}%`;
  };

  const hideForgeStatus = () => {
    if (!forgeStatus || !forgeProgressFill || !forgeButton) return;
    forgeStatus.style.display = "none";
    forgeStatus.hidden = true;
    forgeStatus.setAttribute("aria-hidden", "true");
    forgeProgressFill.style.width = "0%";
    forgeButton.style.display = "flex";
    forgeButton.hidden = false;
  };

  const flashForgeMessage = (message, durationMs = 1200) => {
    if (!forgeButtonSubtitle) return;
    if (messageTimeoutId) clearTimeout(messageTimeoutId);
    forgeButtonSubtitle.textContent = message;
    messageTimeoutId = setTimeout(() => {
      messageTimeoutId = null;
      updateForgeButtonText();
    }, durationMs);
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

  const startShakeAnimation = (ringEntity) => {
    if (!ringEntity) return;
    const position = toPositionObject(ringEntity.getAttribute("position"));
    const shakeTo = `${position.x + 0.045} ${position.y} ${position.z}`;
    ringEntity.setAttribute(
      "animation__forgeShake",
      `property: position; from: ${position.x} ${position.y} ${position.z}; to: ${shakeTo}; dir: alternate; loop: true; dur: 70; easing: easeInOutSine`,
    );
  };

  const stopShakeAnimation = (ringEntity) => {
    if (!ringEntity) return;
    ringEntity.removeAttribute("animation__forgeShake");
  };

  const updateForgeButtonText = () => {
    if (!forgeButtonTitle || !forgeButtonSubtitle) return;

    if (activeTargetIndex === null) {
      forgeButtonTitle.textContent = "Forge";
      forgeButtonSubtitle.textContent = "Corrupt ring";
      return;
    }

    const activeTarget = targetsByIndex.get(activeTargetIndex);
    const forgedRing = activeTarget?.querySelector(".ring-forged");
    if (!forgedRing) {
      forgeButtonTitle.textContent = "Forge";
      forgeButtonSubtitle.textContent = "Marker cannot be forged";
      return;
    }

    const isTargetForged = Boolean(forgedStateByTargetIndex[activeTargetIndex]);
    forgeButtonTitle.textContent = isTargetForged ? "Unforge" : "Forge";
    forgeButtonSubtitle.textContent = isTargetForged
      ? "Restore ring"
      : "Corrupt ring";
  };

  const applyRingModels = () => {
    targets.forEach((target) => {
      const targetIndex = Number(target.dataset.targetIndex);
      const baseRing = target.querySelector(".ring-base");
      const forgedRing = target.querySelector(".ring-forged");
      const isTargetForged = Boolean(forgedStateByTargetIndex[targetIndex]);

      if (baseRing) {
        baseRing.setAttribute("visible", !isTargetForged || !forgedRing);
      }
      if (forgedRing) {
        forgedRing.setAttribute("visible", isTargetForged);
      }
    });
  };

  targets.forEach((target, index) => {
    const targetIndex = Number(target.dataset.targetIndex);
    targetsByIndex.set(targetIndex, target);
    forgedStateByTargetIndex[targetIndex] = false;

    target.addEventListener("targetFound", () => {
      activeTargetIndex = targetIndex;
      updateForgeButtonText();
    });

    target.addEventListener("targetLost", () => {
      if (activeTargetIndex === targetIndex) {
        activeTargetIndex = null;
        updateForgeButtonText();
      }
    });
  });

  if (forgeButton) {
    forgeButton.addEventListener("click", async () => {
      if (isForging) return;

      if (activeTargetIndex === null) {
        flashForgeMessage("Find a marker first");
        return;
      }

      const activeTarget = targetsByIndex.get(activeTargetIndex);
      if (!activeTarget) return;

      const baseRing = activeTarget.querySelector(".ring-base");
      const forgedRing = activeTarget.querySelector(".ring-forged");
      if (!forgedRing) {
        flashForgeMessage("Marker cannot be forged");
        return;
      }

      const visibleRing = forgedStateByTargetIndex[activeTargetIndex]
        ? forgedRing
        : baseRing;
      const isCurrentlyForged = Boolean(
        forgedStateByTargetIndex[activeTargetIndex],
      );
      const actionLabel = isCurrentlyForged ? "Unforging..." : "Forging...";

      isForging = true;
      forgeButton.disabled = true;
      showForgeStatus(actionLabel, 0);
      startShakeAnimation(visibleRing);

      const startedAt = Date.now();
      const progressTimer = setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const progress = Math.min((elapsed / FORGE_DURATION_MS) * 100, 100);
        showForgeStatus(actionLabel, progress);
      }, 50);

      await new Promise((resolve) => setTimeout(resolve, FORGE_DURATION_MS));

      clearInterval(progressTimer);
      stopShakeAnimation(visibleRing);
      forgedStateByTargetIndex[activeTargetIndex] =
        !forgedStateByTargetIndex[activeTargetIndex];
      applyRingModels();
      updateForgeButtonText();
      showForgeStatus(isCurrentlyForged ? "Unforged" : "Forged", 100);

      setTimeout(() => {
        hideForgeStatus();
      }, 500);

      isForging = false;
      forgeButton.disabled = false;
    });
  }

  if (downloadMarkersButton) {
    downloadMarkersButton.addEventListener("click", async () => {
      if (!window.JSZip) return;

      const originalText = downloadMarkersButton.textContent;
      downloadMarkersButton.disabled = true;
      downloadMarkersButton.textContent = "Preparing zip...";

      try {
        const zip = new window.JSZip();
        const folder = zip.folder("markers");
        if (!folder) throw new Error("Could not create zip folder.");

        const fileBlobs = await Promise.all(
          markerFiles.map(async (filePath) => {
            const response = await fetch(filePath);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${filePath}`);
            }
            return {
              fileName: filePath.split("/").pop() || "marker.jpg",
              blob: await response.blob(),
            };
          }),
        );

        fileBlobs.forEach(({ fileName, blob }) => {
          folder.file(fileName, blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(zipBlob);
        triggerFileDownload(zipUrl, "markers.zip");
        URL.revokeObjectURL(zipUrl);
      } catch (error) {
        console.error("Failed to prepare markers zip:", error);
      } finally {
        downloadMarkersButton.disabled = false;
        downloadMarkersButton.textContent = originalText || "Download markers";
      }
    });
  }

  applyRingModels();
  updateForgeButtonText();
  hideForgeStatus();
});
