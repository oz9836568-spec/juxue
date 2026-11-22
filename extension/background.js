"use strict";

const ALLOWED_ORIGINS = new Set([
  "https://api.dictionaryapi.dev",
  "https://api.mymemory.translated.net"
]);

function isAllowedJsonTarget(target) {
  return ALLOWED_ORIGINS.has(target.origin)
    || target.hostname === "api.bilibili.com"
    || target.hostname.endsWith(".hdslb.com")
    || /(^|\.)iqiyi\.com$/i.test(target.hostname);
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ["content.js"]
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ["page-bridge.js"],
      world: "MAIN"
    });
    await chrome.tabs.sendMessage(tab.id, { type: "CUE_OPEN" });
  } catch (error) {
    console.warn("Cue cannot run on this page", error);
    await chrome.tabs.create({
      url: chrome.runtime.getURL("HELP.html?reason=unsupported")
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "CUE_OPEN_HELP") {
    chrome.tabs.create({ url: chrome.runtime.getURL("HELP.html") });
    sendResponse({ ok: true });
    return false;
  }

  if (message?.type === "CUE_FETCH_TEXT" && typeof message.url === "string" && sender.tab?.url) {
    let target;
    let senderOrigin;
    try {
      target = new URL(message.url);
      senderOrigin = new URL(sender.tab.url).origin;
    } catch {
      sendResponse({ ok: false, error: "Invalid URL" });
      return false;
    }

    const sameIqiyiFamily = /(^|\.)iqiyi\.com$/i.test(new URL(senderOrigin).hostname)
      && /(^|\.)iqiyi\.com$/i.test(target.hostname);
    if (target.origin !== senderOrigin && !sameIqiyiFamily) {
      sendResponse({ ok: false, error: "Only same-origin subtitle files can be proxied" });
      return false;
    }

    fetch(target, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "text/vtt, application/x-subrip, text/plain, */*" },
      signal: AbortSignal.timeout(10000)
    })
      .then(async (response) => {
        const text = await response.text();
        sendResponse({
          ok: response.ok && text.length <= 5 * 1024 * 1024,
          status: response.status,
          text
        });
      })
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type !== "CUE_FETCH_JSON" || typeof message.url !== "string") {
    return false;
  }

  let target;
  try {
    target = new URL(message.url);
  } catch {
    sendResponse({ ok: false, error: "Invalid URL" });
    return false;
  }

  if (!isAllowedJsonTarget(target)) {
    sendResponse({ ok: false, error: "Origin not allowed" });
    return false;
  }

  fetch(target, {
    method: "GET",
    credentials: /bilibili\.com$|hdslb\.com$|iqiyi\.com$/.test(target.hostname) ? "include" : "omit",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(9000)
  })
    .then(async (response) => {
      const data = await response.json().catch(() => null);
      sendResponse({
        ok: response.ok,
        status: response.status,
        data
      });
    })
    .catch((error) => {
      sendResponse({ ok: false, error: error.message });
    });

  return true;
});
