(() => {
  "use strict";

  if (window.__CUE_PAGE_BRIDGE__) return;
  window.__CUE_PAGE_BRIDGE__ = true;

  const CHANNEL = "cue-page-bridge-v1";
  let lastFingerprint = "";

  function publishIqiyiState() {
    if (!/(^|\.)iqiyi\.com$/i.test(location.hostname)) return;
    const player = window.QiyiPlayerProphetData;
    const dashData = player?.dashData?.data;
    if (!player && !dashData) return;

    const payload = {
      provider: "iqiyi",
      tvid: String(player?.tvid || dashData?.tvid || player?.videoInfo?.tvId || ""),
      title: player?.videoInfo?.title || "",
      openStl: Boolean(player?.openStl),
      prefix: dashData?.dstl || "",
      tracks: Array.isArray(dashData?.program?.stl) ? dashData.program.stl : []
    };
    const fingerprint = JSON.stringify(payload);
    if (fingerprint === lastFingerprint) return;
    lastFingerprint = fingerprint;
    window.postMessage({
      channel: CHANNEL,
      type: "IQIYI_PLAYER_STATE",
      payload
    }, "*");
  }

  window.addEventListener("message", (event) => {
    if (
      event.source !== window ||
      event.data?.channel !== CHANNEL ||
      event.data?.type !== "CUE_REQUEST_STATE"
    ) return;
    lastFingerprint = "";
    publishIqiyiState();
  });

  publishIqiyiState();
  setInterval(publishIqiyiState, 1500);
})();
