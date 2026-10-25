(() => {
  "use strict";

  const STORAGE_KEY = "juxue.mvp.v1";
  const SOURCE = "The Long Way Home · S02 E04";
  const DURATION = 96;
  const CUE_LENGTH = 8;

  const LEVELS = {
    beginner: { label: "初级", max: 2, detail: "A2 · 基础会话", panel: "初级学习模式" },
    intermediate: { label: "中级", max: 3, detail: "B1 · 自然表达", panel: "中级学习模式" },
    advanced: { label: "高级", max: 4, detail: "C1+ · 语用细节", panel: "高级学习模式" }
  };

  const GOALS = {
    listening: "影视听力",
    speaking: "口语表达",
    exam: "考试备考",
    interest: "兴趣积累"
  };

  const DENSITY_LIMIT = { low: 1, medium: 2, high: 4 };

  const CUES = [
    {
      start: 0,
      text: "You still hang around that old bookshop on Saturdays?",
      translation: "你周末还会去那家旧书店闲逛吗？",
      focus: ["hang around", "bookshop"]
    },
    {
      start: 8,
      text: "I do. It's the only place where I can actually hear myself think.",
      translation: "会去。那是唯一一个我真的能静下心来想事情的地方。",
      focus: ["hear myself think", "actually"]
    },
    {
      start: 16,
      text: "Look, I know the deadline has been rough. But you need to pull yourself together.",
      translation: "我知道这个截止日期让你很难熬，但你得振作起来。",
      focus: ["deadline", "rough", "pull yourself together"]
    },
    {
      start: 24,
      text: "Easy for you to say. You've already landed the job.",
      translation: "你说得倒轻松。你都已经拿到那份工作了。",
      focus: ["easy for you to say", "landed the job"]
    },
    {
      start: 32,
      text: "I took a rain check on the offer. It wasn't the right fit.",
      translation: "我暂时婉拒了那份邀约。它并不适合我。",
      focus: ["took a rain check", "the right fit"]
    },
    {
      start: 40,
      text: "Wait—you turned them down? That was a brave call.",
      translation: "等等——你拒绝了他们？那是个很勇敢的决定。",
      focus: ["turned them down", "brave call"]
    },
    {
      start: 48,
      text: "Maybe. But I'd rather start over than settle for something safe.",
      translation: "也许吧。但我宁愿重新开始，也不想退而求其次。",
      focus: ["start over", "settle for"]
    },
    {
      start: 56,
      text: "Then let's start with one small thing. What do you want to do next?",
      translation: "那就从一件小事开始吧。你接下来想做什么？",
      focus: ["start with"]
    },
    {
      start: 64,
      text: "I want to tell stories that make people feel a little less alone.",
      translation: "我想讲一些能让人觉得没那么孤独的故事。",
      focus: ["feel a little less alone"]
    },
    {
      start: 72,
      text: "That sounds like a beginning, not an ending.",
      translation: "那听起来像是一个开始，而不是结束。",
      focus: ["sounds like"]
    },
    {
      start: 80,
      text: "Right. Same time next Saturday?",
      translation: "好。下周六，还是这个时间？",
      focus: ["same time"]
    },
    {
      start: 88,
      text: "Same time. And this round's on me.",
      translation: "还是这个时间。这轮我请。",
      focus: ["this round's on me"]
    }
  ];

  const LEXICON = {
    "hang around": {
      match: "hang around",
      display: "hang around",
      type: "expression",
      kind: "短语",
      level: 2,
      priority: 3,
      difficulty: "B1 · 实用表达",
      phonetic: "/hæŋ əˈraʊnd/",
      contextual: "在这里指经常去某个地方，没有明确目的，只是在那里消磨时间。",
      general: "闲逛；和某人厮混；在附近逗留",
      usage: "口语 · 朋友闲聊 · 中性",
      tags: ["朋友", "日常", "口语"]
    },
    bookshop: {
      match: "bookshop",
      display: "bookshop",
      type: "word",
      kind: "名词",
      level: 1,
      priority: 1,
      difficulty: "A2 · 关键名词",
      phonetic: "/ˈbʊkʃɒp/",
      contextual: "旧书店。上下文中的 old bookshop 是她习惯独自思考的地方。",
      general: "书店",
      usage: "日常词汇 · 英式用法中更常见",
      tags: ["地点", "日常"]
    },
    "hear myself think": {
      match: "hear myself think",
      display: "hear myself think",
      type: "expression",
      kind: "习语",
      level: 3,
      priority: 3,
      difficulty: "B2 · 地道表达",
      phonetic: "/hɪr maɪˈself θɪŋk/",
      contextual: "字面是“听见自己思考”，实际表示终于能够安静下来、理清思绪。",
      general: "能静下心来思考；脑子清静片刻",
      usage: "口语 · 需要安静时 · 略带自嘲",
      tags: ["情绪", "安静", "习语"]
    },
    actually: {
      match: "actually",
      display: "actually",
      type: "word",
      kind: "副词",
      level: 2,
      priority: 2,
      difficulty: "B1 · 语气词",
      phonetic: "/ˈæktʃuəli/",
      contextual: "这里不是“事实上”的正式转折，而是在强调“真的、确实”能静下心来。",
      general: "实际上；确实；（口语）其实",
      usage: "口语 · 强调真实感受",
      tags: ["副词", "语气", "口语"]
    },
    deadline: {
      match: "deadline",
      display: "deadline",
      type: "word",
      kind: "名词",
      level: 2,
      priority: 2,
      difficulty: "B1 · 高频词",
      phonetic: "/ˈdedlaɪn/",
      contextual: "这里指工作交付的最后期限，是让她压力很大的直接原因。",
      general: "截止日期；最后期限",
      usage: "学习与职场 · 高频",
      tags: ["工作", "压力", "高频词"]
    },
    rough: {
      match: "rough",
      display: "rough",
      type: "word",
      kind: "形容词",
      level: 3,
      priority: 2,
      difficulty: "B2 · 语境形容词",
      phonetic: "/rʌf/",
      contextual: "这里的 rough 不是“粗糙”，而是说一段时间“很难熬、很不顺”。",
      general: "粗糙的；艰难的；粗略的",
      usage: "口语 · 描述一段艰难时期",
      tags: ["情绪", "压力", "多义词"]
    },
    "pull yourself together": {
      match: "pull yourself together",
      display: "pull yourself together",
      type: "expression",
      kind: "习语",
      level: 2,
      priority: 3,
      difficulty: "B1–B2 · 高频习语",
      phonetic: "/pʊl jɔːrˈself təˈɡeðər/",
      contextual: "在朋友因压力而失控时，劝对方冷静下来、重新振作。语气直接，但这里带着关心。",
      general: "振作起来；控制住情绪",
      usage: "口语 · 安慰或督促 · 直接",
      tags: ["安慰", "情绪", "朋友"]
    },
    "easy for you to say": {
      match: "Easy for you to say",
      display: "easy for you to say",
      type: "expression",
      kind: "口语句式",
      level: 2,
      priority: 3,
      difficulty: "B1 · 高频口语句式",
      phonetic: "/ˈiːzi fər ju tə seɪ/",
      contextual: "表面说“你说起来容易”，实际是在反驳：你处境不同，所以当然说得轻松。",
      general: "你说得倒轻松；站着说话不腰疼",
      usage: "口语 · 轻微反驳 · 略带不满",
      tags: ["口语", "反驳", "固定句式"]
    },
    "landed the job": {
      match: "landed the job",
      display: "land a job",
      type: "expression",
      kind: "固定搭配",
      level: 2,
      priority: 2,
      difficulty: "B1 · 高频搭配",
      phonetic: "/lænd ə dʒɑːb/",
      contextual: "land 在这里不是“落地”，而是成功获得一份工作。",
      general: "成功获得工作；拿下职位",
      usage: "求职 · 职场 · 高频",
      tags: ["职场", "求职", "搭配"]
    },
    "took a rain check": {
      match: "took a rain check",
      display: "take a rain check",
      type: "expression",
      kind: "习语",
      level: 3,
      priority: 3,
      difficulty: "C1 · 文化习语",
      phonetic: "/teɪk ə reɪn tʃek/",
      contextual: "这个表达原本指活动因雨改期，现在常指婉拒当下邀约、以后再接受。在这里是她婉拒了工作邀约。",
      general: "改天再说；暂时婉拒邀约",
      usage: "口语 · 礼貌拒绝 · 非正式",
      tags: ["拒绝", "文化", "习语"]
    },
    "the right fit": {
      match: "the right fit",
      display: "the right fit",
      type: "expression",
      kind: "固定搭配",
      level: 2,
      priority: 2,
      difficulty: "B2 · 职场搭配",
      phonetic: "/ðə raɪt fɪt/",
      contextual: "fit 在这里指人与岗位、环境是否合适，而不是衣服的尺码。",
      general: "合适的选择；匹配的人或事物",
      usage: "职场 · 选择与匹配",
      tags: ["职场", "选择", "搭配"]
    },
    "turned them down": {
      match: "turned them down",
      display: "turn down",
      type: "expression",
      kind: "短语动词",
      level: 2,
      priority: 2,
      difficulty: "B1 · 高频短语动词",
      phonetic: "/tɜːrn daʊn/",
      contextual: "turn down 指拒绝邀约、工作或请求。them 是代词，因此放在 turn 和 down 之间。",
      general: "拒绝；调低（音量等）",
      usage: "日常与职场 · 高频短语动词",
      tags: ["拒绝", "短语动词", "高频"]
    },
    "brave call": {
      match: "brave call",
      display: "a brave call",
      type: "expression",
      kind: "固定搭配",
      level: 3,
      priority: 2,
      difficulty: "B2 · 评价表达",
      phonetic: "/ə breɪv kɔːl/",
      contextual: "call 在这里是“决定、判断”。brave call 表示一个需要勇气、可能承担风险的决定。",
      general: "勇敢的决定；大胆的判断",
      usage: "口语 · 评价选择",
      tags: ["决定", "评价", "口语"]
    },
    "start over": {
      match: "start over",
      display: "start over",
      type: "expression",
      kind: "短语动词",
      level: 2,
      priority: 3,
      difficulty: "B1 · 高频短语动词",
      phonetic: "/stɑːrt ˈoʊvər/",
      contextual: "不是重新播放，而是从零开始、重新做一遍。这里指放弃已有选择，重建职业方向。",
      general: "重新开始；从头再来",
      usage: "口语 · 人生选择与计划",
      tags: ["改变", "重新开始", "口语"]
    },
    "settle for": {
      match: "settle for",
      display: "settle for",
      type: "expression",
      kind: "短语动词",
      level: 3,
      priority: 3,
      difficulty: "B2 · 高频短语动词",
      phonetic: "/ˈsetəl fɔːr/",
      contextual: "settle for 含有“虽然不够理想，但还是接受”的意思。她不愿为了安全而退而求其次。",
      general: "勉强接受；退而求其次",
      usage: "口语 · 选择与妥协 · 略带否定",
      tags: ["选择", "妥协", "短语动词"]
    },
    "start with": {
      match: "start with",
      display: "start with",
      type: "expression",
      kind: "固定搭配",
      level: 1,
      priority: 1,
      difficulty: "A2 · 常用搭配",
      phonetic: "/stɑːrt wɪð/",
      contextual: "表示“从……开始”，常用于把大目标拆成可以行动的第一步。",
      general: "以……作为开始；从……着手",
      usage: "日常 · 建议与计划",
      tags: ["建议", "计划", "搭配"]
    },
    "feel a little less alone": {
      match: "feel a little less alone",
      display: "feel a little less alone",
      type: "expression",
      kind: "地道表达",
      level: 3,
      priority: 3,
      difficulty: "C1 · 情绪表达",
      phonetic: "/fiːl ə ˈlɪtəl les əˈloʊn/",
      contextual: "less alone 比 not alone 更细腻：不要求彻底摆脱孤独，只希望有人理解、少一点孤单。",
      general: "感到没那么孤单",
      usage: "情感表达 · 叙事 · 真诚",
      tags: ["情绪", "叙事", "细腻表达"]
    },
    "sounds like": {
      match: "sounds like",
      display: "sound like",
      type: "expression",
      kind: "固定搭配",
      level: 1,
      priority: 1,
      difficulty: "A2 · 常用搭配",
      phonetic: "/saʊnd laɪk/",
      contextual: "根据对方所说作出判断，表示“听起来像是……”。",
      general: "听起来像；似乎是",
      usage: "口语 · 回应对他人描述",
      tags: ["回应", "判断", "口语"]
    },
    "same time": {
      match: "Same time",
      display: "same time",
      type: "expression",
      kind: "口语省略",
      level: 1,
      priority: 1,
      difficulty: "A2 · 口语省略",
      phonetic: "/seɪm taɪm/",
      contextual: "在约会结束时省略整句，表示“还是原来的时间”。",
      general: "还是这个时间；老时间",
      usage: "口语 · 非正式约定",
      tags: ["约定", "省略", "口语"]
    },
    "this round's on me": {
      match: "this round's on me",
      display: "this round's on me",
      type: "expression",
      kind: "地道表达",
      level: 2,
      priority: 3,
      difficulty: "B1 · 生活口语",
      phonetic: "/ðɪs raʊndz ɑːn miː/",
      contextual: "round 指一轮饮品，be on someone 表示由某人买单。语气轻松、友好。",
      general: "这一轮我请客；这杯算我的",
      usage: "口语 · 咖啡馆或酒吧 · 友好",
      tags: ["请客", "朋友", "生活口语"]
    }
  };

  const TYPE_LABELS = {
    all: "全部",
    word: "单词",
    expression: "表达",
    sentence: "整句",
    mastered: "已掌握"
  };

  const DEFAULT_SETTINGS = {
    level: "intermediate",
    goal: "listening",
    density: "medium",
    translation: true,
    phonetics: true,
    sync: true
  };

  const state = {
    onboardingSeen: false,
    settings: { ...DEFAULT_SETTINGS },
    items: [],
    currentTime: 0,
    isPlaying: false,
    isMuted: true,
    captions: true,
    selectedKey: null,
    sessionSaved: 0,
    libraryFilter: "all",
    librarySearch: "",
    librarySource: "all",
    librarySort: "newest",
    reviewQueue: [],
    reviewIndex: 0,
    reviewRevealed: false,
    reviewCompleted: 0,
    currentCueIndex: -1
  };

  const els = {};
  let frameId = 0;
  let lastFrame = 0;
  let toastTimer = 0;
  let audioContext = null;
  let ambientSource = null;
  let ambientGain = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    hydrateState();
    bindEvents();
    fillSettingsControls();
    updateDailyStats();
    renderLibrary();
    renderReview();
    updateLevelLabels();
    showInitialScreen();
    registerServiceWorker();
  }

  function cacheElements() {
    const ids = [
      "onboarding", "onboardingForm", "onboardingStepLabel", "onboardingBack",
      "onboardingNext", "skipOnboarding", "onboardingTranslation", "onboardingPhonetics",
      "onboardingDensity", "appShell", "viewTitle", "playerCard", "playerStage",
      "subtitleWrap", "subtitleEnglish", "subtitleChinese", "timeline", "timelinePlayed",
      "timelineThumb", "playButton", "backButton", "forwardButton", "muteButton",
      "currentTime", "durationTime", "captionToggle", "saveSentenceButton",
      "episodePercentage", "keyboardHelp", "shortcutPopover", "learningPanel",
      "cueInsight", "cuePointCount", "cueAnnotationList", "dictionaryCard",
      "closeDictionary", "dictType", "dictDifficulty", "dictWord", "dictPhonetic",
      "dictAudio", "dictContextMeaning", "dictGeneralMeaning", "dictSentence",
      "dictCueTime", "dictUsage", "dictSave", "dictMastered", "translationSwitch",
      "tipExplanation",
      "panelLevel", "currentLevelLabel", "panelSettings", "focusModeButton",
      "libraryNavCount", "todaySavedCount", "dailyProgress", "sessionSaved",
      "totalSaved", "weeklyAdded", "wordSaved", "expressionSaved", "masteredSaved",
      "libraryGrid", "libraryEmpty", "librarySearch", "sourceFilter", "sortFilter",
      "exportButton", "addExcerptButton", "editDialog", "editForm", "editItemId",
      "editNote", "editTags", "closeEditDialog", "cancelEdit", "excerptDialog",
      "excerptForm", "excerptOriginal", "excerptMeaning", "excerptSource",
      "excerptTags", "closeExcerptDialog", "cancelExcerpt", "reviewProgressBar",
      "reviewProgressText", "flashcard", "reviewType", "reviewSource", "reviewWord",
      "reviewAudio", "reviewContext", "reviewAnswer", "reviewMeaning",
      "reviewExplanation", "reviewActions", "reviewRating", "revealButton",
      "stillLearning", "knowIt", "reviewDone", "settingsLevel", "settingsGoal",
      "settingsDensity", "settingsTranslation", "settingsPhonetics", "settingsSync",
      "saveSettingsButton", "resetDemoButton", "toast", "toastMessage",
      "mobileMenu"
    ];
    ids.forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function hydrateState() {
    const saved = readStorage();
    if (saved) {
      state.onboardingSeen = Boolean(saved.onboardingSeen);
      state.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };
      state.items = Array.isArray(saved.items) ? saved.items : createSeedItems();
      state.sessionSaved = Number(saved.sessionSaved) || 0;
    } else {
      state.items = createSeedItems();
      persist();
    }
  }

  function readStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to read local storage", error);
      return null;
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        onboardingSeen: state.onboardingSeen,
        settings: state.settings,
        items: state.items,
        sessionSaved: state.sessionSaved
      }));
    } catch (error) {
      console.warn("Unable to save local data", error);
    }
  }

  function createSeedItems() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    return [
      {
        id: "seed-pull-together",
        type: "expression",
        kind: "习语",
        original: "pull yourself together",
        display: "pull yourself together",
        phonetic: "/pʊl jɔːrˈself təˈɡeðər/",
        meaning: "振作起来；控制住情绪",
        contextual: "在朋友因压力而失控时，劝对方冷静下来、重新振作。",
        context: "Look, I know the deadline has been rough. But you need to pull yourself together.",
        translation: "我知道这个截止日期让你很难熬，但你得振作起来。",
        source: "The Long Way Home",
        episode: "S02 E04",
        tags: ["安慰", "情绪", "朋友"],
        note: "语气直接但有亲近感，适合熟悉的朋友之间。",
        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        mastered: false,
        reviewCount: 1
      },
      {
        id: "seed-rain-check",
        type: "expression",
        kind: "习语",
        original: "take a rain check",
        display: "take a rain check",
        phonetic: "/teɪk ə reɪn tʃek/",
        meaning: "改天再说；暂时婉拒邀约",
        contextual: "原本指活动因雨改期，现在常指礼貌地暂缓接受邀约。",
        context: "I took a rain check on the offer. It wasn't the right fit.",
        translation: "我暂时婉拒了那份邀约。它并不适合我。",
        source: "The Long Way Home",
        episode: "S02 E04",
        tags: ["拒绝", "文化", "习语"],
        note: "",
        createdAt: new Date(now - day).toISOString(),
        mastered: false,
        reviewCount: 0
      },
      {
        id: "seed-start-over",
        type: "expression",
        kind: "短语动词",
        original: "start over",
        display: "start over",
        phonetic: "/stɑːrt ˈoʊvər/",
        meaning: "重新开始；从头再来",
        contextual: "放弃已有选择，从零开始重新做一遍。",
        context: "I'd rather start over than settle for something safe.",
        translation: "我宁愿重新开始，也不想退而求其次。",
        source: "The Long Way Home",
        episode: "S02 E04",
        tags: ["改变", "重新开始", "口语"],
        note: "",
        createdAt: new Date(now - 1.2 * day).toISOString(),
        mastered: false,
        reviewCount: 0
      },
      {
        id: "seed-deadline",
        type: "word",
        kind: "名词",
        original: "deadline",
        display: "deadline",
        phonetic: "/ˈdedlaɪn/",
        meaning: "截止日期；最后期限",
        contextual: "工作交付的最后期限，是角色压力很大的直接原因。",
        context: "Look, I know the deadline has been rough.",
        translation: "我知道这个截止日期让你很难熬。",
        source: "Modern Love",
        episode: "S01 E02",
        tags: ["工作", "压力", "高频词"],
        note: "",
        createdAt: new Date(now - 3 * day).toISOString(),
        mastered: true,
        reviewCount: 3
      },
      {
        id: "seed-sentence",
        type: "sentence",
        kind: "完整句子",
        original: "I want to tell stories that make people feel a little less alone.",
        display: "I want to tell stories that make people feel a little less alone.",
        phonetic: "",
        meaning: "我想讲一些能让人觉得没那么孤独的故事。",
        contextual: "less alone 比 not alone 更细腻，不要求彻底消除孤独，只希望有人理解。",
        context: "I want to tell stories that make people feel a little less alone.",
        translation: "我想讲一些能让人觉得没那么孤独的故事。",
        source: "The Long Way Home",
        episode: "S02 E04",
        tags: ["情绪", "叙事", "整句"],
        note: "喜欢 less alone 的克制和温柔。",
        createdAt: new Date(now - 4 * day).toISOString(),
        mastered: false,
        reviewCount: 0
      }
    ];
  }

  function showInitialScreen() {
    if (state.onboardingSeen) {
      els.onboarding.classList.add("hidden");
      els.appShell.setAttribute("aria-hidden", "false");
      renderCue(0, true);
      return;
    }
    els.onboarding.classList.remove("hidden");
    els.appShell.setAttribute("aria-hidden", "true");
    populateOnboardingDefaults();
  }

  function populateOnboardingDefaults() {
    const levelInput = els.onboardingForm.querySelector(`input[name="level"][value="${state.settings.level}"]`);
    const goalInput = els.onboardingForm.querySelector(`input[name="goal"][value="${state.settings.goal}"]`);
    if (levelInput) levelInput.checked = true;
    if (goalInput) goalInput.checked = true;
    syncSelectedCards(els.onboardingForm);
    setSegmentValue(els.onboardingDensity, state.settings.density);
    els.onboardingTranslation.checked = state.settings.translation;
    els.onboardingPhonetics.checked = state.settings.phonetics;
  }

  function bindEvents() {
    document.addEventListener("click", handleDelegatedClick);

    els.onboardingForm.addEventListener("change", (event) => {
      if (event.target.matches('input[name="level"], input[name="goal"]')) {
        syncSelectedCards(els.onboardingForm);
      }
    });

    els.onboardingDensity.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-density]");
      if (!button) return;
      setSegmentValue(els.onboardingDensity, button.dataset.density);
    });

    els.onboardingNext.addEventListener("click", nextOnboardingStep);
    els.onboardingBack.addEventListener("click", previousOnboardingStep);
    els.skipOnboarding.addEventListener("click", finishOnboarding);

    els.playButton.addEventListener("click", togglePlayback);
    els.backButton.addEventListener("click", () => seekBy(-5));
    els.forwardButton.addEventListener("click", () => seekBy(5));
    els.muteButton.addEventListener("click", toggleMute);
    els.captionToggle.addEventListener("click", toggleCaptions);
    els.translationSwitch.addEventListener("change", () => {
      state.settings.translation = els.translationSwitch.checked;
      persist();
      updateSubtitleTranslation();
    });
    els.saveSentenceButton.addEventListener("click", saveCurrentSentence);
    els.focusModeButton.addEventListener("click", toggleFocusMode);
    els.panelSettings.addEventListener("click", () => switchView("settings"));
    els.closeDictionary.addEventListener("click", closeDictionary);
    els.dictAudio.addEventListener("click", () => speak(els.dictWord.textContent));
    els.dictSave.addEventListener("click", saveSelectedExpression);
    els.dictMastered.addEventListener("click", masterSelectedExpression);
    els.keyboardHelp.addEventListener("click", () => els.shortcutPopover.classList.toggle("hidden"));
    els.subtitleEnglish.addEventListener("click", handleSubtitleClick);
    els.cueAnnotationList.addEventListener("click", handleCueAnnotationClick);
    els.timeline.addEventListener("pointerdown", startScrub);

    els.librarySearch.addEventListener("input", () => {
      state.librarySearch = els.librarySearch.value;
      renderLibrary();
    });
    document.querySelector(".library-tabs").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      state.libraryFilter = button.dataset.filter;
      document.querySelectorAll(".library-tabs button").forEach((tab) => {
        tab.classList.toggle("active", tab === button);
      });
      renderLibrary();
    });
    els.sourceFilter.addEventListener("change", () => {
      state.librarySource = els.sourceFilter.value;
      renderLibrary();
    });
    els.sortFilter.addEventListener("change", () => {
      state.librarySort = els.sortFilter.value;
      renderLibrary();
    });
    els.libraryGrid.addEventListener("click", handleLibraryAction);
    els.exportButton.addEventListener("click", exportData);
    els.addExcerptButton.addEventListener("click", () => els.excerptDialog.showModal());
    els.closeEditDialog.addEventListener("click", () => els.editDialog.close());
    els.cancelEdit.addEventListener("click", () => els.editDialog.close());
    els.editForm.addEventListener("submit", saveEditedItem);
    els.closeExcerptDialog.addEventListener("click", () => els.excerptDialog.close());
    els.cancelExcerpt.addEventListener("click", () => els.excerptDialog.close());
    els.excerptForm.addEventListener("submit", createManualExcerpt);

    els.revealButton.addEventListener("click", revealReviewAnswer);
    els.knowIt.addEventListener("click", () => rateReview(true));
    els.stillLearning.addEventListener("click", () => rateReview(false));
    els.reviewAudio.addEventListener("click", () => speak(els.reviewWord.textContent));

    els.settingsLevel.addEventListener("click", handleSettingSegment);
    els.settingsGoal.addEventListener("click", handleSettingSegment);
    els.settingsDensity.addEventListener("click", handleSettingSegment);
    els.saveSettingsButton.addEventListener("click", saveSettingsFromControls);
    els.resetDemoButton.addEventListener("click", resetDemo);
    els.mobileMenu.addEventListener("click", () => showToast("底部导航可切换观看、词库和复习"));

    document.addEventListener("keydown", handleKeyboard);
    window.addEventListener("resize", () => {
      els.shortcutPopover.classList.add("hidden");
    });
  }

  function handleDelegatedClick(event) {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton && !viewButton.closest(".main-nav")?.dataset.boundClick) {
      switchView(viewButton.dataset.view);
      return;
    }

    const viewLink = event.target.closest("[data-view-link]");
    if (viewLink) {
      event.preventDefault();
      switchView(viewLink.dataset.viewLink);
    }
  }

  function nextOnboardingStep() {
    const current = document.querySelector(".onboarding-step.active");
    const step = Number(current.dataset.step);
    if (step >= 3) {
      finishOnboarding();
      return;
    }
    setOnboardingStep(step + 1);
  }

  function previousOnboardingStep() {
    const current = document.querySelector(".onboarding-step.active");
    const step = Number(current.dataset.step);
    setOnboardingStep(Math.max(1, step - 1));
  }

  function setOnboardingStep(step) {
    document.querySelectorAll(".onboarding-step").forEach((section) => {
      section.classList.toggle("active", Number(section.dataset.step) === step);
    });
    document.querySelectorAll(".progress-dots span").forEach((dot, index) => {
      dot.classList.toggle("active", index + 1 <= step);
    });
    els.onboardingStepLabel.textContent = `0${step} / 03`;
    els.onboardingBack.classList.toggle("hidden", step === 1);
    els.onboardingNext.innerHTML = step === 3
      ? '开始体验 <svg><use href="#i-chevron"/></svg>'
      : '继续 <svg><use href="#i-chevron"/></svg>';
  }

  function finishOnboarding() {
    const formData = new FormData(els.onboardingForm);
    const selectedDensity = els.onboardingDensity.querySelector(".active");
    state.settings = {
      ...state.settings,
      level: formData.get("level") || state.settings.level,
      goal: formData.get("goal") || state.settings.goal,
      density: selectedDensity?.dataset.density || state.settings.density,
      translation: els.onboardingTranslation.checked,
      phonetics: els.onboardingPhonetics.checked
    };
    state.onboardingSeen = true;
    persist();
    els.onboarding.classList.add("hidden");
    els.appShell.setAttribute("aria-hidden", "false");
    fillSettingsControls();
    updateLevelLabels();
    renderCue(state.currentCueIndex >= 0 ? state.currentCueIndex : 0, true);
    window.setTimeout(() => els.playerCard.focus({ preventScroll: true }), 100);
  }

  function syncSelectedCards(root) {
    root.querySelectorAll(".level-card, .goal-card").forEach((card) => {
      card.classList.toggle("selected", Boolean(card.querySelector("input")?.checked));
    });
  }

  function setSegmentValue(container, value) {
    if (!container) return;
    container.querySelectorAll("button").forEach((button) => {
      const buttonValue = button.dataset.value || button.dataset.density;
      button.classList.toggle("active", buttonValue === value);
    });
  }

  function switchView(viewName) {
    const allowed = ["watch", "library", "review", "settings"];
    if (!allowed.includes(viewName)) return;
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.toggle("active", view.id === `view-${viewName}`);
    });
    document.querySelectorAll(".nav-item[data-view]").forEach((button) => {
      const active = button.dataset.view === viewName;
      button.classList.toggle("active", active);
      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });
    const titles = {
      watch: "在剧情里，学会真正会用的英语。",
      library: "你收藏的，不只是词，是一段段真实的语境。",
      review: "见过一次，就会更靠近记住一点。",
      settings: "同一段剧情，也可以有不同的学习重点。"
    };
    els.viewTitle.textContent = titles[viewName];
    document.querySelector(".main").scrollTo({ top: 0, behavior: "smooth" });
    if (viewName === "library") renderLibrary();
    if (viewName === "review") startReviewSession();
    if (viewName === "settings") fillSettingsControls();
    window.history.replaceState(null, "", `#${viewName}`);
  }

  function currentCueIndex() {
    return Math.min(CUES.length - 1, Math.floor(state.currentTime / CUE_LENGTH));
  }

  function currentCue() {
    return CUES[currentCueIndex()];
  }

  function renderCue(index, force = false, keepDictionary = false) {
    const safeIndex = Math.max(0, Math.min(CUES.length - 1, index));
    if (!force && safeIndex === state.currentCueIndex) return;
    state.currentCueIndex = safeIndex;
    const cue = CUES[safeIndex];
    const visible = getVisibleAnnotations(cue);

    els.subtitleEnglish.innerHTML = renderSentence(cue.text, visible);
    els.subtitleChinese.textContent = cue.translation;
    updateSubtitleTranslation();
    renderCueAnnotationList(cue, visible);
    updateSavedSentenceButton(cue);
    if (!keepDictionary && !els.dictionaryCard.classList.contains("hidden")) {
      closeDictionary();
    }
  }

  function getVisibleAnnotations(cue) {
    const level = LEVELS[state.settings.level] || LEVELS.intermediate;
    const limit = DENSITY_LIMIT[state.settings.density] || 2;
    const entries = cue.focus
      .map((key) => ({ key, entry: LEXICON[key] }))
      .filter(({ entry }) => entry);

    let filtered = entries.filter(({ entry }) => {
      if (!entry) return false;
      if (state.settings.level === "beginner") return entry.level <= 2;
      if (state.settings.level === "intermediate") return entry.level >= 2 && entry.level <= 3;
      return entry.level >= 2;
    });

    if (filtered.length === 0) filtered = entries;
    return filtered
      .sort((a, b) => b.entry.priority - a.entry.priority || a.entry.level - b.entry.level)
      .slice(0, limit);
  }

  function renderSentence(text, annotations) {
    const matches = [];
    annotations.forEach(({ key, entry }) => {
      const matchText = entry.match;
      const lowerText = text.toLowerCase();
      const lowerMatch = matchText.toLowerCase();
      let from = 0;
      let index = lowerText.indexOf(lowerMatch, from);
      while (index !== -1) {
        matches.push({
          start: index,
          end: index + matchText.length,
          key,
          entry
        });
        from = index + matchText.length;
        index = lowerText.indexOf(lowerMatch, from);
      }
    });

    matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
    const accepted = [];
    matches.forEach((match) => {
      if (!accepted.some((item) => match.start < item.end && match.end > item.start)) {
        accepted.push(match);
      }
    });

    let html = "";
    let cursor = 0;
    accepted.forEach((match) => {
      html += escapeHtml(text.slice(cursor, match.start));
      const active = state.selectedKey === match.key ? " active-word" : "";
      html += `<button type="button" class="word-token annotated ${match.entry.type}${active}" data-key="${escapeAttr(match.key)}" aria-label="查看 ${escapeAttr(match.entry.display)} 的语境释义">${escapeHtml(text.slice(match.start, match.end))}</button>`;
      cursor = match.end;
    });
    html += escapeHtml(text.slice(cursor));
    return html;
  }

  function renderCueAnnotationList(cue, visible) {
    els.cuePointCount.textContent = `${visible.length} 个`;
    if (visible.length) {
      els.tipExplanation.textContent = `“${visible[0].entry.display}” 在这里的意思是：${visible[0].entry.contextual}`;
    } else {
      els.tipExplanation.textContent = "这句先留给剧情。调高标注密度，可以看到更多学习线索。";
    }
    if (!visible.length) {
      els.cueAnnotationList.innerHTML = '<div class="annotation-item"><strong>这句先留给剧情</strong><p>当前密度下没有额外学习点。</p></div>';
      return;
    }
    els.cueAnnotationList.innerHTML = visible.map(({ key, entry }) => `
      <button type="button" class="annotation-item" data-key="${escapeAttr(key)}">
        <strong>${escapeHtml(entry.display)}</strong>
        <span>${escapeHtml(entry.difficulty.split(" · ")[0])}</span>
        <p>${escapeHtml(entry.general)}</p>
      </button>
    `).join("");
  }

  function handleSubtitleClick(event) {
    const button = event.target.closest("button[data-key]");
    if (!button) return;
    if (state.isPlaying) pausePlayback();
    openDictionary(button.dataset.key);
  }

  function handleCueAnnotationClick(event) {
    const button = event.target.closest("button[data-key]");
    if (!button) return;
    if (state.isPlaying) pausePlayback();
    openDictionary(button.dataset.key);
  }

  function openDictionary(key) {
    const entry = LEXICON[key];
    const cue = currentCue();
    if (!entry) return;
    state.selectedKey = key;
    renderCue(state.currentCueIndex, true, true);

    const existing = findSavedItem(entry.display);
    els.dictType.textContent = entry.kind;
    els.dictDifficulty.textContent = entry.difficulty;
    els.dictWord.textContent = entry.display;
    els.dictPhonetic.textContent = entry.phonetic;
    els.dictPhonetic.classList.toggle("hidden", !state.settings.phonetics);
    els.dictContextMeaning.textContent = entry.contextual;
    els.dictGeneralMeaning.textContent = entry.general;
    els.dictSentence.textContent = `“${cue.text}”`;
    els.dictCueTime.textContent = formatTime(cue.start).replace(":", ":");
    els.dictUsage.textContent = entry.usage;
    updateDictionarySaveButton(existing);
    updateDictionaryMasteredButton(existing);
    els.cueInsight.classList.add("hidden");
    els.dictionaryCard.classList.remove("hidden");
  }

  function closeDictionary() {
    state.selectedKey = null;
    els.dictionaryCard.classList.add("hidden");
    els.cueInsight.classList.remove("hidden");
    renderCue(state.currentCueIndex, true);
  }

  function saveSelectedExpression() {
    const key = state.selectedKey;
    const entry = LEXICON[key];
    if (!entry) return;
    const saved = saveVocabularyEntry(key, entry, currentCue());
    if (saved) {
      state.sessionSaved += 1;
      persist();
      renderLibrary();
      updateDailyStats();
      updateSectionCounters();
    }
    updateDictionarySaveButton(findSavedItem(entry.display));
    updateSavedSentenceButton(currentCue());
  }

  function masterSelectedExpression() {
    const key = state.selectedKey;
    const entry = LEXICON[key];
    if (!entry) return;
    let existing = findSavedItem(entry.display);
    if (!existing) {
      saveVocabularyEntry(key, entry, currentCue());
      existing = findSavedItem(entry.display);
    }
    existing.mastered = !existing.mastered;
    persist();
    renderLibrary();
    updateDailyStats();
    updateDictionaryMasteredButton(existing);
    updateDictionarySaveButton(existing);
    showToast(existing.mastered ? "已标记为掌握" : "已移回待复习");
  }

  function saveVocabularyEntry(key, entry, cue) {
    if (findSavedItem(entry.display)) {
      showToast("这条表达已经在你词库中");
      return false;
    }
    const item = {
      id: makeId("item"),
      type: entry.type,
      kind: entry.kind,
      original: entry.display,
      display: entry.display,
      phonetic: entry.phonetic,
      meaning: entry.general,
      contextual: entry.contextual,
      context: cue.text,
      translation: cue.translation,
      source: "The Long Way Home",
      episode: "S02 E04",
      tags: [...entry.tags],
      note: "",
      createdAt: new Date().toISOString(),
      mastered: false,
      reviewCount: 0
    };
    state.items.unshift(item);
    persist();
    showToast("已收藏到词库");
    return true;
  }

  function updateDictionarySaveButton(existing) {
    els.dictSave.classList.toggle("secondary", Boolean(existing));
    els.dictSave.classList.toggle("primary", !existing);
    els.dictSave.innerHTML = existing
      ? '<svg><use href="#i-check"/></svg><span>已在词库中</span>'
      : '<svg><use href="#i-plus"/></svg><span>收藏到词库</span>';
  }

  function updateDictionaryMasteredButton(existing) {
    els.dictMastered.classList.toggle("is-mastered", Boolean(existing?.mastered));
    els.dictMastered.innerHTML = existing?.mastered
      ? '<svg><use href="#i-check"/></svg><span>已经掌握</span>'
      : '<svg><use href="#i-check"/></svg><span>标为已掌握</span>';
  }

  function saveCurrentSentence() {
    const cue = currentCue();
    const existing = state.items.find((item) => item.type === "sentence" && normalize(item.original) === normalize(cue.text));
    if (existing) {
      showToast("这句话已经收藏过了");
      updateSavedSentenceButton(cue);
      return;
    }
    state.items.unshift({
      id: makeId("sentence"),
      type: "sentence",
      kind: "完整句子",
      original: cue.text,
      display: cue.text,
      phonetic: "",
      meaning: cue.translation,
      contextual: "保留完整台词，适合结合语气和场景反复体会。",
      context: cue.text,
      translation: cue.translation,
      source: "The Long Way Home",
      episode: "S02 E04",
      tags: ["整句", "剧情"],
      note: "",
      createdAt: new Date().toISOString(),
      mastered: false,
      reviewCount: 0
    });
    state.sessionSaved += 1;
    persist();
    renderLibrary();
    updateDailyStats();
    updateSavedSentenceButton(cue);
    updateSectionCounters();
    showToast("整句和语境已一起收藏");
  }

  function updateSavedSentenceButton(cue) {
    if (!cue) return;
    const saved = state.items.some((item) => item.type === "sentence" && normalize(item.original) === normalize(cue.text));
    els.saveSentenceButton.classList.toggle("saved", saved);
    els.saveSentenceButton.innerHTML = saved
      ? '<svg><use href="#i-check"/></svg><span>已收藏本句</span>'
      : '<svg><use href="#i-bookmark"/></svg><span>收藏本句</span>';
  }

  function findSavedItem(value) {
    const normalized = normalize(value);
    return state.items.find((item) =>
      normalize(item.original) === normalized ||
      normalize(item.display) === normalized
    );
  }

  function togglePlayback() {
    if (state.isPlaying) {
      pausePlayback();
    } else {
      play();
    }
  }

  function play() {
    if (state.currentTime >= DURATION - 0.05) {
      state.currentTime = 0;
      renderCue(0, true);
    }
    state.isPlaying = true;
    lastFrame = performance.now();
    els.playerCard.classList.add("is-playing");
    els.playButton.innerHTML = '<svg><use href="#i-pause"/></svg>';
    els.playButton.setAttribute("aria-label", "暂停");
    startAmbientAudio();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(playbackTick);
  }

  function pausePlayback() {
    state.isPlaying = false;
    els.playerCard.classList.remove("is-playing");
    els.playButton.innerHTML = '<svg><use href="#i-play"/></svg>';
    els.playButton.setAttribute("aria-label", "播放");
    cancelAnimationFrame(frameId);
    if (ambientGain && audioContext) {
      ambientGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.04);
    }
  }

  function playbackTick(timestamp) {
    if (!state.isPlaying) return;
    const delta = Math.min(0.25, (timestamp - lastFrame) / 1000);
    lastFrame = timestamp;
    state.currentTime = Math.min(DURATION, state.currentTime + delta);
    updateTimeline();
    if (state.settings.sync) {
      renderCue(currentCueIndex());
    }
    if (state.currentTime >= DURATION) {
      pausePlayback();
      state.currentTime = DURATION;
      updateTimeline();
      showToast("演示片段播放完成");
      return;
    }
    frameId = requestAnimationFrame(playbackTick);
  }

  function updateTimeline() {
    const percentage = DURATION ? state.currentTime / DURATION : 0;
    els.timelinePlayed.style.width = `${percentage * 100}%`;
    els.timelineThumb.style.left = `${percentage * 100}%`;
    els.currentTime.textContent = formatTime(state.currentTime);
    els.episodePercentage.textContent = `${Math.round(percentage * 100)}%`;
    els.timeline.setAttribute("aria-valuenow", String(Math.round(state.currentTime)));
    if (state.settings.sync) renderCue(currentCueIndex());
  }

  function seekTo(time) {
    state.currentTime = Math.max(0, Math.min(DURATION, time));
    updateTimeline();
    renderCue(currentCueIndex(), true);
  }

  function seekBy(seconds) {
    seekTo(state.currentTime + seconds);
  }

  function startScrub(event) {
    event.preventDefault();
    const wasPlaying = state.isPlaying;
    if (wasPlaying) pausePlayback();
    const update = (pointerEvent) => {
      const rect = els.timeline.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (pointerEvent.clientX - rect.left) / rect.width));
      seekTo(ratio * DURATION);
    };
    update(event);
    const pointerMove = (pointerEvent) => update(pointerEvent);
    const pointerUp = () => {
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
      if (wasPlaying) play();
    };
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
  }

  function toggleCaptions() {
    state.captions = !state.captions;
    els.subtitleWrap.classList.toggle("is-hidden", !state.captions);
    els.captionToggle.setAttribute("aria-pressed", String(state.captions));
    showToast(state.captions ? "字幕已显示" : "字幕已隐藏 · 按 C 恢复");
  }

  function updateSubtitleTranslation() {
    els.subtitleChinese.classList.toggle("hidden", !state.settings.translation);
    els.translationSwitch.checked = state.settings.translation;
  }

  function toggleFocusMode() {
    const layout = document.querySelector(".watch-layout");
    const active = layout.classList.toggle("focus-mode");
    els.focusModeButton.querySelector("span").textContent = active ? "退出专注" : "专注观看";
    closeDictionary();
  }

  function toggleMute() {
    state.isMuted = !state.isMuted;
    els.muteButton.innerHTML = state.isMuted
      ? '<svg><use href="#i-muted"/></svg>'
      : '<svg><use href="#i-volume"/></svg>';
    els.muteButton.setAttribute("aria-label", state.isMuted ? "取消静音" : "静音");
    if (state.isPlaying) {
      if (state.isMuted) {
        if (ambientGain && audioContext) ambientGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.04);
      } else {
        startAmbientAudio();
      }
    }
    showToast(state.isMuted ? "已静音" : "已开启轻柔环境声");
  }

  function startAmbientAudio() {
    if (state.isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContext) {
        audioContext = new AudioCtx();
        const seconds = 2;
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * seconds, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < data.length; i += 1) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 2.8;
        }
        ambientSource = audioContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;
        const filter = audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 720;
        ambientGain = audioContext.createGain();
        ambientGain.gain.value = 0;
        ambientSource.connect(filter).connect(ambientGain).connect(audioContext.destination);
        ambientSource.start();
      }
      audioContext.resume();
      ambientGain.gain.setTargetAtTime(0.035, audioContext.currentTime, 0.08);
    } catch (error) {
      console.warn("Ambient audio unavailable", error);
    }
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      showToast("当前浏览器不支持语音朗读");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[“”"']/g, ""));
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => /^en(-|_)/i.test(voice.lang) && /natural|samantha|google/i.test(voice.name))
      || voices.find((voice) => /^en(-|_)/i.test(voice.lang))
      || null;
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    utterance.pitch = 1;
    const button = document.activeElement?.closest(".audio-button");
    if (button) {
      button.classList.add("is-playing");
      utterance.onend = () => button.classList.remove("is-playing");
      utterance.onerror = () => button.classList.remove("is-playing");
    }
    window.speechSynthesis.speak(utterance);
  }

  function handleKeyboard(event) {
    if (!els.appShell || els.appShell.getAttribute("aria-hidden") === "true") return;
    if (event.target.matches("input, textarea, select, dialog")) return;
    if (event.target.closest("dialog")) return;
    if (!document.getElementById("view-watch").classList.contains("active")) return;
    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      seekBy(-5);
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      seekBy(5);
    } else if (event.key.toLowerCase() === "c") {
      toggleCaptions();
    } else if (event.key === "Escape" && !els.dictionaryCard.classList.contains("hidden")) {
      closeDictionary();
    } else if (event.key.toLowerCase() === "f") {
      toggleFocusMode();
    }
  }

  function renderLibrary() {
    const filtered = getFilteredItems();
    updateLibraryStats();
    els.libraryGrid.innerHTML = filtered.map(renderLibraryCard).join("");
    els.libraryEmpty.classList.toggle("hidden", filtered.length !== 0);
    els.libraryGrid.classList.toggle("hidden", filtered.length === 0);
    els.libraryNavCount.textContent = String(state.items.length);
  }

  function getFilteredItems() {
    let items = [...state.items];
    if (state.libraryFilter === "mastered") {
      items = items.filter((item) => item.mastered);
    } else if (state.libraryFilter !== "all") {
      items = items.filter((item) => item.type === state.libraryFilter);
    }
    if (state.librarySource !== "all") {
      items = items.filter((item) => item.source === state.librarySource);
    }
    if (state.librarySearch.trim()) {
      const query = normalize(state.librarySearch);
      items = items.filter((item) =>
        normalize([item.original, item.meaning, item.contextual, item.note, item.source, ...(item.tags || [])].join(" ")).includes(query)
      );
    }
    if (state.librarySort === "oldest") {
      items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (state.librarySort === "alpha") {
      items.sort((a, b) => a.original.localeCompare(b.original, "en"));
    } else {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return items;
  }

  function renderLibraryCard(item) {
    const isSentence = item.type === "sentence";
    const tags = (item.tags || []).slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    return `
      <article class="vocab-card ${item.mastered ? "mastered" : ""}" data-id="${escapeAttr(item.id)}">
        <div class="vocab-card-top">
          <span class="vocab-card-type ${escapeAttr(item.type)}"><i></i>${escapeHtml(TYPE_LABELS[item.type] || item.kind)}</span>
          <span class="source-label">${escapeHtml(item.source || "个人摘录")}${item.episode ? ` · ${escapeHtml(item.episode)}` : ""}</span>
        </div>
        <h3 class="${isSentence ? "sentence-word" : ""}">${escapeHtml(item.original)}</h3>
        <p class="vocab-card-meaning">${escapeHtml(item.meaning)}</p>
        <p class="vocab-card-context">${escapeHtml(item.context || item.translation || "")}</p>
        ${item.note ? `<p class="vocab-note">${escapeHtml(item.note)}</p>` : ""}
        ${tags ? `<div class="vocab-tags">${tags}</div>` : ""}
        <div class="vocab-card-actions">
          <button class="card-action" data-action="edit" data-id="${escapeAttr(item.id)}" aria-label="添加笔记或标签"><svg><use href="#i-edit"/></svg></button>
          <button class="card-action ${item.mastered ? "is-mastered" : ""}" data-action="master" data-id="${escapeAttr(item.id)}" aria-label="${item.mastered ? "移回待复习" : "标记已掌握"}"><svg><use href="#i-check"/></svg></button>
          ${item.phonetic ? `<button class="card-action" data-action="speak" data-id="${escapeAttr(item.id)}" aria-label="播放发音"><svg><use href="#i-sound"/></svg></button>` : ""}
          <button class="card-action" data-action="delete" data-id="${escapeAttr(item.id)}" aria-label="删除收藏"><svg><use href="#i-trash"/></svg></button>
          <span class="card-date">${formatRelativeDate(item.createdAt)}</span>
        </div>
      </article>
    `;
  }

  function handleLibraryAction(event) {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const item = state.items.find((entry) => entry.id === actionButton.dataset.id);
    if (!item) return;
    const action = actionButton.dataset.action;
    if (action === "edit") {
      openEditDialog(item);
    } else if (action === "master") {
      item.mastered = !item.mastered;
      persist();
      renderLibrary();
      updateDailyStats();
      showToast(item.mastered ? "已标记为掌握" : "已移回待复习");
    } else if (action === "speak") {
      speak(item.original);
    } else if (action === "delete") {
      if (window.confirm(`要从词库删除“${item.original}”吗？`)) {
        state.items = state.items.filter((entry) => entry.id !== item.id);
        persist();
        renderLibrary();
        updateDailyStats();
        updateSavedSentenceButton(currentCue());
        showToast("已从词库删除");
      }
    }
  }

  function openEditDialog(item) {
    els.editItemId.value = item.id;
    els.editNote.value = item.note || "";
    els.editTags.value = (item.tags || []).join(", ");
    els.editDialog.showModal();
  }

  function saveEditedItem(event) {
    event.preventDefault();
    const item = state.items.find((entry) => entry.id === els.editItemId.value);
    if (!item) return;
    item.note = els.editNote.value.trim();
    item.tags = parseTags(els.editTags.value);
    persist();
    renderLibrary();
    els.editDialog.close();
    showToast("笔记和标签已保存");
  }

  function createManualExcerpt(event) {
    event.preventDefault();
    const original = els.excerptOriginal.value.trim();
    const meaning = els.excerptMeaning.value.trim();
    if (!original || !meaning) return;
    state.items.unshift({
      id: makeId("excerpt"),
      type: "sentence",
      kind: "自定义摘录",
      original,
      display: original,
      phonetic: "",
      meaning,
      contextual: "手动摘录，没有影视场景上下文。",
      context: original,
      translation: meaning,
      source: els.excerptSource.value.trim() || "个人摘录",
      episode: "",
      tags: parseTags(els.excerptTags.value),
      note: "",
      createdAt: new Date().toISOString(),
      mastered: false,
      reviewCount: 0
    });
    persist();
    renderLibrary();
    updateDailyStats();
    els.excerptForm.reset();
    els.excerptSource.value = "个人摘录";
    els.excerptDialog.close();
    showToast("摘录已加入词库");
  }

  function updateLibraryStats() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    els.totalSaved.textContent = String(state.items.length);
    els.wordSaved.textContent = String(state.items.filter((item) => item.type === "word").length);
    els.expressionSaved.textContent = String(state.items.filter((item) => item.type === "expression").length);
    els.masteredSaved.textContent = String(state.items.filter((item) => item.mastered).length);
    els.weeklyAdded.textContent = String(state.items.filter((item) => new Date(item.createdAt) >= sevenDaysAgo).length);
  }

  function updateDailyStats() {
    updateLibraryStats();
    const todayCount = getTodaySavedCount();
    els.todaySavedCount.textContent = String(todayCount);
    els.dailyProgress.style.width = `${Math.min(100, (todayCount / 5) * 100)}%`;
    updateSectionCounters();
  }

  function getTodaySavedCount() {
    const today = new Date();
    return state.items.filter((item) => {
      const date = new Date(item.createdAt);
      return date.getFullYear() === today.getFullYear()
        && date.getMonth() === today.getMonth()
        && date.getDate() === today.getDate();
    }).length;
  }

  function updateSectionCounters() {
    els.sessionSaved.textContent = String(state.sessionSaved);
    els.libraryNavCount.textContent = String(state.items.length);
  }

  function startReviewSession() {
    state.reviewQueue = state.items.filter((item) => !item.mastered);
    state.reviewIndex = 0;
    state.reviewRevealed = false;
    state.reviewCompleted = 0;
    renderReview();
  }

  function renderReview() {
    const total = state.reviewQueue.length;
    if (!total || state.reviewIndex >= total) {
      els.flashcard.classList.add("hidden");
      els.reviewDone.classList.remove("hidden");
      els.reviewProgressBar.style.width = total ? "100%" : "0%";
      els.reviewProgressText.textContent = total ? `${total} / ${total}` : "0 / 0";
      return;
    }
    els.flashcard.classList.remove("hidden");
    els.reviewDone.classList.add("hidden");
    els.reviewAnswer.classList.add("hidden");
    els.reviewActions.classList.remove("hidden");
    els.reviewRating.classList.add("hidden");
    const item = state.reviewQueue[state.reviewIndex];
    els.reviewType.textContent = TYPE_LABELS[item.type] || item.kind || "表达";
    els.reviewSource.textContent = `${item.source || "个人摘录"}${item.episode ? ` · ${item.episode}` : ""}`;
    els.reviewWord.textContent = item.original;
    els.reviewContext.textContent = item.context ? `“${item.context}”` : item.translation || "";
    els.reviewMeaning.textContent = item.meaning;
    els.reviewExplanation.textContent = item.contextual || item.note || "结合原句，在心里再过一遍它的使用场景。";
    els.reviewAudio.classList.toggle("hidden", item.type === "sentence");
    const progress = total ? (state.reviewIndex / total) * 100 : 0;
    els.reviewProgressBar.style.width = `${progress}%`;
    els.reviewProgressText.textContent = `${state.reviewIndex} / ${total}`;
    state.reviewRevealed = false;
  }

  function revealReviewAnswer() {
    if (state.reviewRevealed) return;
    state.reviewRevealed = true;
    els.reviewAnswer.classList.remove("hidden");
    els.reviewActions.classList.add("hidden");
    els.reviewRating.classList.remove("hidden");
  }

  function rateReview(knowsIt) {
    const item = state.reviewQueue[state.reviewIndex];
    if (!item) return;
    item.reviewCount = (item.reviewCount || 0) + 1;
    if (knowsIt) item.mastered = true;
    state.reviewIndex += 1;
    state.reviewCompleted += 1;
    persist();
    updateLibraryStats();
    renderReview();
    if (state.reviewIndex >= state.reviewQueue.length) {
      showToast("今日复习完成");
    }
  }

  function handleSettingSegment(event) {
    const button = event.target.closest("button[data-value]");
    if (!button) return;
    const container = button.parentElement;
    container.querySelectorAll("button[data-value]").forEach((candidate) => {
      candidate.classList.toggle("active", candidate === button);
    });
  }

  function fillSettingsControls() {
    setSegmentValue(els.settingsLevel, state.settings.level);
    setSegmentValue(els.settingsGoal, state.settings.goal);
    setSegmentValue(els.settingsDensity, state.settings.density);
    els.settingsTranslation.checked = state.settings.translation;
    els.settingsPhonetics.checked = state.settings.phonetics;
    els.settingsSync.checked = state.settings.sync;
    els.translationSwitch.checked = state.settings.translation;
    updateLevelLabels();
  }

  function saveSettingsFromControls() {
    state.settings = {
      level: els.settingsLevel.querySelector(".active")?.dataset.value || state.settings.level,
      goal: els.settingsGoal.querySelector(".active")?.dataset.value || state.settings.goal,
      density: els.settingsDensity.querySelector(".active")?.dataset.value || state.settings.density,
      translation: els.settingsTranslation.checked,
      phonetics: els.settingsPhonetics.checked,
      sync: els.settingsSync.checked
    };
    persist();
    fillSettingsControls();
    renderCue(state.currentCueIndex, true);
    updateSubtitleTranslation();
    showToast("学习偏好已更新");
  }

  function updateLevelLabels() {
    const level = LEVELS[state.settings.level] || LEVELS.intermediate;
    const goal = GOALS[state.settings.goal] || GOALS.listening;
    els.panelLevel.textContent = level.panel;
    els.currentLevelLabel.textContent = `${level.label} · ${goal}`;
    const meterBars = document.querySelectorAll(".level-meter span");
    const activeCount = state.settings.level === "beginner" ? 2 : state.settings.level === "intermediate" ? 4 : 5;
    meterBars.forEach((bar, index) => bar.classList.toggle("active", index < activeCount));
    const meterText = document.querySelector(".level-meter small");
    if (meterText) meterText.textContent = level.detail;
  }

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "剧学 MVP",
      settings: state.settings,
      vocabulary: state.items
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `juxue-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("词库已导出为 JSON");
  }

  function resetDemo() {
    if (!window.confirm("确定重置所有演示数据吗？你的收藏、笔记和偏好都会被清除。")) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  function showToast(message) {
    els.toastMessage.textContent = message;
    els.toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 2400);
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days <= 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days} 天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function parseTags(value) {
    return [...new Set(String(value || "")
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean))];
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
      navigator.serviceWorker.register("./service-worker.js").catch((error) => {
        console.warn("Service worker registration failed", error);
      });
    }
  }
})();
