"use strict";

const launchButton = document.getElementById("launchButton");
const pageTitle = document.getElementById("pageTitle");
const pageHost = document.getElementById("pageHost");
const statusDot = document.querySelector(".status-dot");
const errorMessage = document.getElementById("errorMessage");

let activeTabId = null;

document.addEventListener("DOMContentLoaded", initialize);
launchButton.addEventListener("click", launchJuxue);
document.getElementById("openHelp").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("HELP.html") });
});

async function initialize() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    showError("没有读取到当前网页。");
    return;
  }
  activeTabId = tab.id;
  pageTitle.textContent = tab.title || "当前网页";
  try {
    const url = new URL(tab.url);
    pageHost.textContent = url.hostname || tab.url;
    statusDot.classList.add("ready");
  } catch {
    pageHost.textContent = "浏览器内部页面";
    launchButton.disabled = true;
    showError("浏览器设置页、扩展商店等内部页面不允许扩展运行，请先打开普通视频网页。");
  }
}

async function launchJuxue() {
  if (!activeTabId) return;
  errorMessage.classList.add("hidden");
  launchButton.disabled = true;
  launchButton.querySelector("span").textContent = "正在连接视频…";

  try {
    await chrome.scripting.executeScript({
      target: { tabId: activeTabId, allFrames: true },
      files: ["content.js"]
    });
    await chrome.scripting.executeScript({
      target: { tabId: activeTabId, allFrames: true },
      files: ["page-bridge.js"],
      world: "MAIN"
    });
    await chrome.tabs.sendMessage(activeTabId, { type: "CUE_OPEN" });
    window.close();
  } catch (error) {
    console.error(error);
    launchButton.disabled = false;
    launchButton.querySelector("span").textContent = "在当前网页开启 Cue";
    showError("无法在这个页面运行。请刷新网页并确认里面有正在播放的普通 HTML5 视频；浏览器内置页面和受 DRM 保护的视频不受支持。");
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}
