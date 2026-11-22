(() => {
  "use strict";

  if (window.__CUE_WEB_VIDEO__) {
    window.__CUE_WEB_VIDEO__.open();
    return;
  }

  const SETTINGS_KEY = "juxue.ext.settings.v1";
  const LIBRARY_KEY = "juxue.ext.library.v1";
  const DEFAULT_SETTINGS = {
    level: "intermediate",
    density: "medium",
    showOverlay: true,
    showTranslation: true
  };
  const DENSITY_LIMIT = { low: 1, medium: 3, high: 5 };
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const PHRASES = {
    "hang around": {
      meaning: "闲逛；在附近逗留；消磨时间",
      contextual: "口语中常表示没有明确目的地待在某个地方，或和某人一起消磨时间。",
      phonetic: "/hæŋ əˈraʊnd/"
    },
    "pull yourself together": {
      meaning: "振作起来；控制住情绪",
      contextual: "在对方失落或慌乱时劝其冷静、重新振作，语气可能直接，也可能带着关心。",
      phonetic: "/pʊl jɔːrˈself təˈɡeðər/"
    },
    "take a rain check": {
      meaning: "改天再说；暂时婉拒邀约",
      contextual: "常用来礼貌地推迟或婉拒邀约，不一定表示以后再也不会接受。",
      phonetic: "/teɪk ə reɪn tʃek/"
    },
    "hear myself think": {
      meaning: "能静下心来思考；脑子清静片刻",
      contextual: "字面是听见自己思考，实际多用于表达周围太吵或太忙，终于可以安静理清思绪。",
      phonetic: "/hɪr maɪˈself θɪŋk/"
    },
    "easy for you to say": {
      meaning: "你说得倒轻松",
      contextual: "用于轻微反驳对方：你的处境不同，所以才能轻易这样说。",
      phonetic: "/ˈiːzi fər ju tə seɪ/"
    },
    "look forward to": {
      meaning: "期待；盼望",
      contextual: "to 后面接名词或动名词，例如 look forward to seeing you。",
      phonetic: "/lʊk ˈfɔːrwərd tə/"
    },
    "get away with": {
      meaning: "做了错事却逃脱惩罚",
      contextual: "强调某件不该做的事没有被发现或没有被追究。",
      phonetic: "/ɡet əˈweɪ wɪð/"
    },
    "come up with": {
      meaning: "想出；提出",
      contextual: "通常接想法、计划、解决办法或名字。",
      phonetic: "/kʌm ʌp wɪð/"
    },
    "figure out": {
      meaning: "弄明白；想出办法",
      contextual: "既可以表示理解原因，也可以表示解决一个问题。",
      phonetic: "/ˈfɪɡjər aʊt/"
    },
    "turn down": {
      meaning: "拒绝；调低",
      contextual: "可以拒绝邀约、提议或工作，也可以指调低音量、亮度。",
      phonetic: "/tɜːrn daʊn/"
    },
    "settle for": {
      meaning: "勉强接受；退而求其次",
      contextual: "暗示接受的东西不是最理想的，但已经放弃寻找更好的选择。",
      phonetic: "/ˈsetəl fɔːr/"
    },
    "start over": {
      meaning: "重新开始；从头再来",
      contextual: "不是重新播放，而是放弃当前状态，从零开始做一件事。",
      phonetic: "/stɑːrt ˈoʊvər/"
    },
    "show up": {
      meaning: "出现；到场",
      contextual: "可以指某人在约定地点出现，也可以指某种问题或情绪突然显现。",
      phonetic: "/ʃoʊ ʌp/"
    },
    "make sense": {
      meaning: "有道理；说得通",
      contextual: "常用于理解一件事，或对不合理的情况表示疑问。",
      phonetic: "/meɪk sens/"
    },
    "no way": {
      meaning: "不可能；不会吧",
      contextual: "口语中常用来表达惊讶、拒绝或强烈怀疑。",
      phonetic: "/noʊ weɪ/"
    },
    "you bet": {
      meaning: "当然；没问题",
      contextual: "非正式地表示热情同意或确认。",
      phonetic: "/juː bet/"
    },
    "never mind": {
      meaning: "算了；没关系；别在意",
      contextual: "可表示忘记刚才说的话，也可以安慰对方不必担心。",
      phonetic: "/ˈnevər maɪnd/"
    },
    "by the way": {
      meaning: "顺便说一下",
      contextual: "用于引入与当前话题相关但不完全相连的补充信息。",
      phonetic: "/baɪ ðə weɪ/"
    },
    "after all": {
      meaning: "毕竟；终究",
      contextual: "用于补充一个支持当前结论的理由，或表示结果与预期不同。",
      phonetic: "/ˈæftər ɔːl/"
    },
    "for good": {
      meaning: "永远；一劳永逸地",
      contextual: "for good 不是“为了好事”，而是表示永久地。",
      phonetic: "/fər ɡʊd/"
    },
    "in the long run": {
      meaning: "从长远来看",
      contextual: "比较短期代价与长期结果时使用。",
      phonetic: "/ɪn ðə lɔːŋ rʌn/"
    },
    "be up to": {
      meaning: "正在做；由某人决定；足以胜任",
      contextual: "具体意思取决于结构：be up to something 或 it is up to you。",
      phonetic: "/bi ʌp tuː/"
    },
    "have a point": {
      meaning: "说得有道理",
      contextual: "即使不完全同意对方，也承认其中一部分是合理的。",
      phonetic: "/hæv ə pɔɪnt/"
    },
    "take it easy": {
      meaning: "放轻松；别着急",
      contextual: "可用来安慰别人，也可以在告别时表示“保重”。",
      phonetic: "/teɪk ɪt ˈiːzi/"
    },
    "out of the blue": {
      meaning: "突然地；出乎意料地",
      contextual: "形容某件事毫无预兆地发生。",
      phonetic: "/aʊt əv ðə bluː/"
    },
    "under the weather": {
      meaning: "身体不舒服",
      contextual: "委婉地表示生病或状态不佳。",
      phonetic: "/ˈʌndər ðə ˈweðər/"
    },
    "a piece of cake": {
      meaning: "小菜一碟；非常容易",
      contextual: "口语中形容任务极其简单。",
      phonetic: "/ə piːs əv keɪk/"
    },
    "call it a day": {
      meaning: "今天就到这里",
      contextual: "用来结束工作或活动，通常暗示已经做得足够。",
      phonetic: "/kɔːl ɪt ə deɪ/"
    },
    "hit it off": {
      meaning: "一见如故；很快合得来",
      contextual: "用于形容两个人初次见面就很投缘。",
      phonetic: "/hɪt ɪt ɔːf/"
    },
    "let someone down": {
      meaning: "让某人失望",
      contextual: "someone 可替换为具体代词或人名，例如 let me down。",
      phonetic: "/let ˈsʌmwʌn daʊn/"
    },
    "the last straw": {
      meaning: "压垮骆驼的最后一根稻草",
      contextual: "一系列不顺利之后，终于让人无法再忍受的最后一件事。",
      phonetic: "/ðə læst strɔː/"
    }
  };

  const WORD_GLOSS = {
    deadline: ["截止日期；最后期限", "/ˈdedlaɪn/"],
    bookshop: ["书店", "/ˈbʊkʃɒp/"],
    rough: ["艰难的；粗糙的；粗略的", "/rʌf/"],
    actually: ["实际上；确实；（口语）其实", "/ˈæktʃuəli/"],
    awkward: ["尴尬的；不自然的", "/ˈɔːkwərd/"],
    exhausted: ["筋疲力尽的", "/ɪɡˈzɔːstɪd/"],
    disappointed: ["失望的", "/ˌdɪsəˈpɔɪntɪd/"],
    apologize: ["道歉", "/əˈpɑːlədʒaɪz/"],
    opportunity: ["机会", "/ˌɑːpərˈtuːnəti/"],
    complicated: ["复杂的", "/ˈkɑːmplɪkeɪtɪd/"],
    embarrassed: ["尴尬的；难为情的", "/ɪmˈbærəst/"],
    devastated: ["备受打击的；极度难过的", "/ˈdevəsteɪtɪd/"],
    overwhelmed: ["不堪重负的；不知所措的", "/ˌoʊvərˈwelmd/"],
    relieved: ["宽慰的；松了一口气的", "/rɪˈliːvd/"],
    frustrated: ["沮丧的；受挫的", "/ˈfrʌstreɪtɪd/"],
    curious: ["好奇的", "/ˈkjʊriəs/"],
    genuine: ["真诚的；真正的", "/ˈdʒenjuɪn/"],
    hesitate: ["犹豫", "/ˈhezɪteɪt/"],
    realize: ["意识到；实现", "/ˈriːəlaɪz/"],
    pretend: ["假装", "/prɪˈtend/"],
    deserve: ["值得；应得", "/dɪˈzɜːrv/"],
    accept: ["接受；承认", "/əkˈsept/"],
    except: ["除……之外", "/ɪkˈsept/"],
    eventually: ["最终；终于", "/ɪˈventʃuəli/"],
    obviously: ["显然；明显地", "/ˈɑːbviəsli/"],
    apparently: ["据说；看来", "/əˈpærəntli/"],
    probably: ["很可能；大概", "/ˈprɑːbəbli/"],
    confident: ["自信的；有把握的", "/ˈkɑːnfɪdənt/"],
    nervous: ["紧张的；焦虑的", "/ˈnɜːrvəs/"],
    jealous: ["嫉妒的", "/ˈdʒeləs/"],
    sincere: ["真诚的", "/sɪnˈsɪr/"],
    stubborn: ["固执的", "/ˈstʌbərn/"],
    vulnerable: ["脆弱的；容易受伤的", "/ˈvʌlnərəbl/"]
  };

  const BASIC_WORDS = new Set(`
    a about above after again against all almost also am an and any are around as at be because been before being below between both but by can
    could did do does doing down during each even ever every few first for from further get got had has have having he her here hers herself him
    himself his how i if in into is it its itself just know let like make many may me might more most much must my myself new no nor not now of off
    on once one only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there
    these they thing think this those through to too under until up very was we were what when where which while who whom why will with would you your
    yours yourself yourselves yes okay ok well really still actually already always never often sometimes today tonight tomorrow yesterday right wrong good
    bad big small long short want need say said tell told look see seen come came go went going gone take took taken give gave given find found ask
    asked work try tried feel felt become became leave left put keep kept mean meant start call called turn play run help talk show hear heard wait
    sure sorry please thanks thank maybe much little lot kind sort thing things people person time day night year week back here there something
    anything nothing everything someone anyone everyone nobody somebody everybody because before after again around away
  `.trim().split(/\s+/));

  const LEVEL_MIN_LENGTH = {
    beginner: 9,
    intermediate: 8,
    advanced: 10
  };

  const state = {
    settings: { ...DEFAULT_SETTINGS },
    library: [],
    cues: [],
    sourceLabel: "",
    sourceType: "none",
    video: null,
    videos: [],
    attachedVideos: new WeakSet(),
    currentCue: null,
    currentCueKey: "",
    activeTerm: "",
    activeLookup: null,
    activeCue: null,
    lookupCache: new Map(),
    activeTab: "study",
    libraryQuery: "",
    panelOpen: true,
    hostInFullscreen: false,
    scanIndex: 0,
    renderedCaptionActive: false,
    renderedCaptionText: "",
    lastRenderedScan: 0,
    lastDetectionIssue: "",
    platformData: {},
    lastUrl: location.href
  };

  const ui = {};
  let refreshTimer = 0;
  let videoScanTimer = 0;
  let toastTimer = 0;
  let translationLoading = false;

  wireRuntimeMessages();
  wirePageBridge();
  init();

  async function init() {
    const [storedSettings, storedLibrary] = await Promise.all([
      storageGet(SETTINGS_KEY, null),
      storageGet(LIBRARY_KEY, null)
    ]);
    state.settings = { ...DEFAULT_SETTINGS, ...(storedSettings || {}) };
    state.library = Array.isArray(storedLibrary) ? storedLibrary : createWelcomeLibrary();
    if (!storedLibrary) await storageSet(LIBRARY_KEY, state.library);

    let initialVideos = collectVideos();
    if (window.top !== window && !initialVideos.length) {
      await delay(1400);
      initialVideos = collectVideos();
      if (!initialVideos.length) return;
    }
    if (window.top === window && !initialVideos.length && document.querySelectorAll("iframe").length) {
      return;
    }

    mountUI();
    bindUI();
    await loadCachedSubtitles();
    await scanForVideo();

    clearInterval(refreshTimer);
    refreshTimer = window.setInterval(() => {
      if (location.href !== state.lastUrl) {
        state.lastUrl = location.href;
        void loadCachedSubtitles();
      }
      if (!state.video || !state.video.isConnected) void scanForVideo();
      refreshPlayback(false);
    }, 220);

    clearInterval(videoScanTimer);
    videoScanTimer = window.setInterval(() => {
      if (!state.video || !state.video.isConnected) void scanForVideo();
    }, 2200);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("resize", positionVideoOverlay);
    window.addEventListener("scroll", positionVideoOverlay, { passive: true });

    window.__CUE_WEB_VIDEO__ = {
      open: openPanel,
      getState: () => ({
        videoFound: Boolean(state.video),
        cues: state.cues.length,
        currentCue: state.currentCue?.text || "",
        library: state.library.length,
        sourceType: state.sourceType,
        sourceLabel: state.sourceLabel
      }),
      importText: (text, name = "test.vtt") => importSubtitleText(text, name),
      detectSubtitles: () => detectWebsiteSubtitles(),
      inspectVisibleCaption: () => extractVisibleCaptionText(),
      seek: (time) => {
        if (state.video) state.video.currentTime = time;
        refreshPlayback(true);
      }
    };
  }

  function createWelcomeLibrary() {
    return [{
      id: makeId("welcome"),
      type: "expression",
      original: "pull yourself together",
      meaning: "振作起来；控制住情绪",
      contextual: "在对方失落或慌乱时劝其冷静、重新振作。",
      phonetic: "/pʊl jɔːrˈself təˈɡeðər/",
      context: "You need to pull yourself together.",
      translation: "你得振作起来。",
      source: "Cue 示例",
      episode: "可删除",
      tags: ["安慰", "习语"],
      createdAt: new Date().toISOString(),
      mastered: false
    }];
  }

  function mountUI() {
    if (ui.host?.isConnected) return;
    ui.host = document.createElement("div");
    ui.host.id = "juxue-extension-root";
    ui.host.setAttribute("data-juxue-root", "true");
    ui.host.style.cssText = "position:fixed;inset:0;z-index:2147483646;pointer-events:none;";
    ui.shadow = ui.host.attachShadow({ mode: "open" });
    ui.shadow.innerHTML = `
      <style>${styles()}</style>
      <div class="jx-shell ${state.panelOpen ? "jx-open" : ""}">
        <button class="jx-fab" id="jx-fab" type="button" aria-label="打开 Cue">
          <span class="jx-fab-mark">C</span>
          <span>cue</span>
        </button>

        <aside class="jx-panel" aria-label="Cue 学习面板">
          <header class="jx-header">
            <div class="jx-brand">
              <span class="jx-logo">C</span>
              <span><strong>cue</strong><small>CATCH THE LINE</small></span>
            </div>
            <div class="jx-header-actions">
              <button id="jx-rescan" class="jx-icon-btn" type="button" title="重新寻找视频" aria-label="重新寻找视频">↻</button>
              <button id="jx-collapse" class="jx-icon-btn" type="button" title="收起面板" aria-label="收起面板">—</button>
            </div>
          </header>

          <nav class="jx-tabs" aria-label="Cue 页面">
            <button class="jx-tab jx-active" data-jx-tab="study" type="button">学习</button>
            <button class="jx-tab" data-jx-tab="library" type="button">词库 <b id="jx-lib-count">0</b></button>
            <button class="jx-tab" data-jx-tab="settings" type="button">设置</button>
          </nav>

          <div class="jx-pane jx-active" data-jx-pane="study">
            <div class="jx-video-status">
              <span class="jx-status-dot" id="jx-video-dot"></span>
              <div><strong id="jx-video-title">正在寻找网页视频…</strong><small id="jx-video-meta">请先播放页面中的视频</small></div>
              <button id="jx-cycle-video" class="jx-mini-btn" type="button">换视频</button>
            </div>

            <section class="jx-source-card">
              <div class="jx-section-heading">
                <span>字幕来源</span><b id="jx-source-state">未加载</b>
              </div>
              <div class="jx-source-actions">
                <button id="jx-detect-track" class="jx-source-btn jx-primary-soft" type="button">
                  <span class="jx-source-symbol">CC</span><span><strong>读取网页字幕</strong><small>优先读取网站字幕轨道</small></span>
                </button>
                <label class="jx-source-btn">
                  <span class="jx-source-symbol">↥</span><span><strong>导入字幕</strong><small>支持 .srt / .vtt</small></span>
                  <input id="jx-file-input" type="file" accept=".srt,.vtt,text/vtt,application/x-subrip" hidden>
                </label>
              </div>
            </section>

            <section class="jx-cue-card">
              <div class="jx-cue-head">
                <span id="jx-cue-time">等待字幕</span>
                <div>
                  <button id="jx-prev-cue" type="button" title="上一句">‹</button>
                  <button id="jx-next-cue" type="button" title="下一句">›</button>
                </div>
              </div>
              <div class="jx-cue-empty" id="jx-cue-empty">
                <strong>还没有可用的字幕</strong>
                <p>先尝试读取网页字幕；无法读取时，请导入自己有权使用的 SRT 或 VTT 文件。</p>
              </div>
              <div id="jx-cue-content" class="jx-hidden">
                <div class="jx-cue-english" id="jx-cue-english"></div>
                <div class="jx-translation-row" id="jx-translation-row">
                  <p id="jx-cue-chinese"></p>
                  <button id="jx-translate-cue" type="button">翻译本句</button>
                </div>
              </div>
            </section>

            <section class="jx-word-card jx-hidden" id="jx-word-card">
              <div class="jx-word-top">
                <span class="jx-type-pill" id="jx-word-type">单词</span>
                <button id="jx-word-close" type="button" aria-label="关闭词汇详情">×</button>
              </div>
              <h2 id="jx-word-title">expression</h2>
              <div class="jx-word-meta">
                <span id="jx-word-phonetic">—</span>
                <button id="jx-word-audio" type="button" class="jx-audio">◖ 听发音</button>
              </div>
              <div class="jx-meaning-box">
                <span>中文释义</span>
                <strong id="jx-word-meaning">点击“联网查词”获取释义</strong>
              </div>
              <div class="jx-definition-box">
                <span>英文释义</span>
                <p id="jx-word-definition">—</p>
              </div>
              <div class="jx-context-box">
                <span>当前语境</span>
                <p id="jx-word-context">—</p>
                <small id="jx-word-contextual">—</small>
              </div>
              <div class="jx-lookup-actions">
                <button id="jx-word-online" type="button">联网查词</button>
                <span>仅点击后发送当前词语与句子</span>
              </div>
              <div class="jx-word-actions">
                <button id="jx-word-save" class="jx-save-btn" type="button">＋ 收藏到词库</button>
                <button id="jx-word-master" type="button">标记掌握</button>
              </div>
            </section>

            <div class="jx-tip">
              <span class="jx-tip-index">Aa</span>
              <div><strong>点击字幕里的任意英文单词</strong><p>Cue 会暂停视频，并把原句一起保留。词语只在点击“联网查词”后才发送到词典服务。</p></div>
            </div>
          </div>

          <div class="jx-pane" data-jx-pane="library">
            <div class="jx-pane-title"><div><span>MY EXPRESSIONS</span><h2>我的词库</h2></div><button id="jx-export" class="jx-mini-action" type="button">导出</button></div>
            <label class="jx-search"><span>⌕</span><input id="jx-library-search" type="search" placeholder="搜索表达、释义或来源"></label>
            <div id="jx-library-list" class="jx-library-list"></div>
          </div>

          <div class="jx-pane" data-jx-pane="settings">
            <div class="jx-pane-title"><div><span>PREFERENCES</span><h2>标注偏好</h2></div></div>
            <section class="jx-setting-block">
              <label>语言水平</label>
              <div class="jx-segments" id="jx-level">
                <button type="button" data-value="beginner">初级</button>
                <button type="button" data-value="intermediate">中级</button>
                <button type="button" data-value="advanced">高级</button>
              </div>
            </section>
            <section class="jx-setting-block">
              <label>标注密度</label>
              <div class="jx-segments" id="jx-density">
                <button type="button" data-value="low">精简</button>
                <button type="button" data-value="medium">适中</button>
                <button type="button" data-value="high">丰富</button>
              </div>
            </section>
            <label class="jx-toggle-row"><span><strong>在视频上显示字幕</strong><small>生成 Cue 的可点击字幕层</small></span><input id="jx-overlay-toggle" type="checkbox"></label>
            <label class="jx-toggle-row"><span><strong>显示已有翻译</strong><small>双语字幕文件会自动识别中文行</small></span><input id="jx-translation-toggle" type="checkbox"></label>
            <div class="jx-diagnostic-actions">
              <button id="jx-diagnose" class="jx-mini-action" type="button">诊断识别问题</button>
              <button id="jx-copy-diagnostic" class="jx-mini-action jx-hidden" type="button">复制结果</button>
            </div>
            <pre id="jx-diagnostic" class="jx-diagnostic jx-hidden"></pre>
            <div class="jx-privacy-note">
              <strong>本地优先</strong>
              <p>字幕和词库默认只保存在当前浏览器。联网查词会将当前词语和句子发送到 Free Dictionary API 与 MyMemory。</p>
            </div>
            <button id="jx-clear-library" class="jx-danger-btn" type="button">清空 Cue 词库</button>
          </div>

          <footer class="jx-footer">
            <span><i></i>浏览器本地存储</span>
            <button id="jx-help" type="button">使用说明</button>
          </footer>
        </aside>

        <div class="jx-video-caption jx-hidden" id="jx-video-caption" aria-live="polite">
          <div class="jx-overlay-english" id="jx-overlay-english"></div>
          <div class="jx-overlay-chinese" id="jx-overlay-chinese"></div>
        </div>

        <div class="jx-toast" id="jx-toast"><span>✓</span><p>已收藏到词库</p></div>
      </div>
    `;
    document.documentElement.appendChild(ui.host);
    cacheUI();
    renderSettings();
    renderLibrary();
  }

  function cacheUI() {
    [
      "jx-fab", "jx-collapse", "jx-rescan", "jx-lib-count", "jx-video-dot",
      "jx-video-title", "jx-video-meta", "jx-cycle-video", "jx-source-state",
      "jx-detect-track", "jx-file-input", "jx-cue-time", "jx-prev-cue", "jx-next-cue",
      "jx-cue-empty", "jx-cue-content", "jx-cue-english", "jx-translation-row",
      "jx-cue-chinese", "jx-translate-cue", "jx-word-card", "jx-word-type",
      "jx-word-close", "jx-word-title", "jx-word-phonetic", "jx-word-audio",
      "jx-word-meaning", "jx-word-definition", "jx-word-context", "jx-word-contextual",
      "jx-word-online", "jx-word-save", "jx-word-master", "jx-library-search",
      "jx-library-list", "jx-export", "jx-level", "jx-density", "jx-overlay-toggle",
      "jx-translation-toggle", "jx-clear-library", "jx-help", "jx-video-caption",
      "jx-overlay-english", "jx-overlay-chinese", "jx-toast", "jx-diagnose",
      "jx-copy-diagnostic", "jx-diagnostic"
    ].forEach((id) => {
      ui[id] = ui.shadow.getElementById(id);
    });
  }

  function bindUI() {
    ui.shadow.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-jx-tab]");
      if (tab) {
        switchTab(tab.dataset.jxTab);
        return;
      }

      const termButton = event.target.closest("[data-jx-term]");
      if (termButton) {
        void openWord(termButton.dataset.jxTerm, state.currentCue);
        return;
      }

      const levelButton = event.target.closest("#jx-level [data-value]");
      if (levelButton) {
        state.settings.level = levelButton.dataset.value;
        void persistSettings();
        renderSettings();
        renderCurrentCue(true);
        return;
      }

      const densityButton = event.target.closest("#jx-density [data-value]");
      if (densityButton) {
        state.settings.density = densityButton.dataset.value;
        void persistSettings();
        renderSettings();
        renderCurrentCue(true);
        return;
      }

      const action = event.target.closest("[data-jx-action]");
      if (action) {
        void handleLibraryAction(action.dataset.jxAction, action.dataset.jxId);
      }
    });

    ui["jx-fab"].addEventListener("click", openPanel);
    ui["jx-collapse"].addEventListener("click", collapsePanel);
    ui["jx-rescan"].addEventListener("click", async () => {
      await scanForVideo();
      showToast(state.video ? "已重新连接网页视频" : "当前页面还没有找到视频");
    });
    ui["jx-cycle-video"].addEventListener("click", cycleVideo);
    ui["jx-detect-track"].addEventListener("click", detectWebsiteSubtitles);
    ui["jx-file-input"].addEventListener("change", importSubtitleFile);
    ui["jx-prev-cue"].addEventListener("click", () => moveCue(-1));
    ui["jx-next-cue"].addEventListener("click", () => moveCue(1));
    ui["jx-translate-cue"].addEventListener("click", translateCurrentCue);
    ui["jx-word-close"].addEventListener("click", closeWordCard);
    ui["jx-word-audio"].addEventListener("click", () => speak(state.activeTerm));
    ui["jx-word-online"].addEventListener("click", lookupOnline);
    ui["jx-word-save"].addEventListener("click", saveActiveWord);
    ui["jx-word-master"].addEventListener("click", masterActiveWord);
    ui["jx-library-search"].addEventListener("input", () => {
      state.libraryQuery = ui["jx-library-search"].value;
      renderLibrary();
    });
    ui["jx-export"].addEventListener("click", exportLibrary);
    ui["jx-overlay-toggle"].addEventListener("change", () => {
      state.settings.showOverlay = ui["jx-overlay-toggle"].checked;
      void persistSettings();
      renderCurrentCue(true);
    });
    ui["jx-translation-toggle"].addEventListener("change", () => {
      state.settings.showTranslation = ui["jx-translation-toggle"].checked;
      void persistSettings();
      renderCurrentCue(true);
    });
    ui["jx-diagnose"].addEventListener("click", showDiagnostics);
    ui["jx-copy-diagnostic"].addEventListener("click", copyDiagnostics);
    ui["jx-clear-library"].addEventListener("click", clearLibrary);
    ui["jx-help"].addEventListener("click", () => {
      if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: "CUE_OPEN_HELP" });
      } else {
        showToast("使用说明：先播放网页视频，再读取或导入字幕");
      }
    });
  }

  function wireRuntimeMessages() {
    if (typeof chrome === "undefined" || !chrome.runtime?.onMessage) return;
    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type === "CUE_OPEN") openPanel();
    });
  }

  function wirePageBridge() {
    window.addEventListener("message", (event) => {
      if (event.source !== window || event.data?.channel !== "cue-page-bridge-v1") return;
      if (event.data.type === "IQIYI_PLAYER_STATE" && event.data.payload) {
        state.platformData.iqiyi = event.data.payload;
      }
    });
    window.postMessage({
      channel: "cue-page-bridge-v1",
      type: "CUE_REQUEST_STATE"
    }, "*");
  }

  function openPanel() {
    state.panelOpen = true;
    if (!ui.shadow) return;
    ui.shadow.querySelector(".jx-shell")?.classList.add("jx-open");
    refreshPlayback(true);
  }

  function collapsePanel() {
    state.panelOpen = false;
    ui.shadow.querySelector(".jx-shell")?.classList.remove("jx-open");
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    ui.shadow.querySelectorAll("[data-jx-tab]").forEach((button) => {
      button.classList.toggle("jx-active", button.dataset.jxTab === tabName);
    });
    ui.shadow.querySelectorAll("[data-jx-pane]").forEach((pane) => {
      pane.classList.toggle("jx-active", pane.dataset.jxPane === tabName);
    });
    if (tabName === "library") renderLibrary();
    if (tabName === "settings") renderSettings();
  }

  async function scanForVideo() {
    const videos = collectVideos();
    state.videos = videos;
    if (!videos.length) {
      state.video = null;
      renderVideoStatus();
      renderCurrentCue(true);
      return;
    }

    let chosen = state.video?.isConnected ? state.video : null;
    if (!chosen || !videos.includes(chosen)) {
      chosen = videos
        .map((video) => ({ video, score: scoreVideo(video) }))
        .sort((a, b) => b.score - a.score)[0].video;
    }
    selectVideo(chosen);
  }

  function collectVideos() {
    const regular = [...document.querySelectorAll("video")];
    const visibleCandidates = regular.filter(isUsableVideo);
    if (visibleCandidates.length) return visibleCandidates;
    const activeCandidates = regular.filter(isActiveMediaElement);
    if (activeCandidates.length) return activeCandidates;

    const deepVideos = [];
    const walk = (root) => {
      const videos = root.querySelectorAll ? [...root.querySelectorAll("video")] : [];
      deepVideos.push(...videos.filter((video) => isUsableVideo(video) || isActiveMediaElement(video)));
      if (!root.querySelectorAll) return;
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot) walk(element.shadowRoot);
      }
    };
    walk(document);
    return [...new Set(deepVideos)];
  }

  function isUsableVideo(video) {
    if (!(video instanceof HTMLVideoElement)) return false;
    const rect = video.getBoundingClientRect();
    return rect.width >= 140 && rect.height >= 80;
  }

  function isActiveMediaElement(video) {
    if (!(video instanceof HTMLVideoElement)) return false;
    return Boolean(
      video.currentSrc ||
      video.videoWidth > 0 ||
      video.readyState >= HTMLMediaElement.HAVE_METADATA ||
      !video.paused ||
      (Number.isFinite(video.duration) && video.duration > 0)
    );
  }

  function scoreVideo(video) {
    const rect = video.getBoundingClientRect();
    const playingBonus = !video.paused && !video.ended ? 100000000 : 0;
    return playingBonus + rect.width * rect.height;
  }

  function selectVideo(video) {
    if (!video) return;
    if (state.video !== video) {
      state.video = video;
      attachVideoEvents(video);
      renderCurrentCue(true);
    }
    renderVideoStatus();
    positionVideoOverlay();
  }

  function attachVideoEvents(video) {
    if (state.attachedVideos.has(video)) return;
    state.attachedVideos.add(video);
    ["play", "pause", "seeking", "seeked", "timeupdate", "loadedmetadata", "durationchange"].forEach((eventName) => {
      video.addEventListener(eventName, () => refreshPlayback(true), { passive: true });
    });
  }

  function cycleVideo() {
    if (!state.videos.length) {
      showToast("当前页面没有找到可用视频");
      return;
    }
    state.scanIndex = (state.scanIndex + 1) % state.videos.length;
    selectVideo(state.videos[state.scanIndex]);
    showToast(`已切换到第 ${state.scanIndex + 1} 个视频`);
  }

  function renderVideoStatus() {
    const found = Boolean(state.video?.isConnected);
    ui["jx-video-dot"].classList.toggle("jx-ready", found);
    if (!found) {
      ui["jx-video-title"].textContent = "未找到网页视频";
      const iframeCount = document.querySelectorAll("iframe").length;
      ui["jx-video-meta"].textContent = iframeCount
        ? `页面里有 ${iframeCount} 个 iframe，视频可能在跨域播放器里`
        : "先开始播放，再点击右上角重新连接";
      return;
    }
    const title = cleanTitle(document.title) || "当前网页视频";
    ui["jx-video-title"].textContent = title;
    const time = formatTime(state.video.currentTime);
    const duration = Number.isFinite(state.video.duration) ? formatTime(state.video.duration) : "--:--";
    const stateText = state.video.paused ? "已暂停" : "播放中";
    const rect = state.video.getBoundingClientRect();
    const displayMode = rect.width < 140 || rect.height < 80 ? "隐藏视频元素" : location.hostname;
    ui["jx-video-meta"].textContent = `${stateText} · ${time} / ${duration} · ${displayMode}`;
  }

  function refreshPlayback(force = false) {
    if (!state.video || !state.video.isConnected) {
      if (force) renderVideoStatus();
      return;
    }
    renderVideoStatus();
    if (state.renderedCaptionActive) captureRenderedCaption();
    const cue = findCueAt(state.video.currentTime);
    const key = cue ? `${cue.start}:${cue.end}:${cue.text}` : "none";
    if (force || key !== state.currentCueKey) {
      state.currentCue = cue;
      state.currentCueKey = key;
      renderCurrentCue(true);
    }
    positionVideoOverlay();
  }

  function findCueAt(time) {
    if (!state.cues.length) return null;
    let low = 0;
    let high = state.cues.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const cue = state.cues[mid];
      if (time < cue.start) high = mid - 1;
      else if (time >= cue.end) low = mid + 1;
      else return cue;
    }
    return null;
  }

  function renderCurrentCue(force = false) {
    const cue = state.currentCue;
    const hasCues = state.cues.length > 0;
    ui["jx-cue-empty"].classList.toggle("jx-hidden", Boolean(cue) || !hasCues && state.sourceType === "loading");
    ui["jx-cue-content"].classList.toggle("jx-hidden", !cue);
    ui["jx-cue-time"].textContent = cue
      ? `${formatTime(cue.start)} – ${formatTime(cue.end)}`
      : hasCues ? "当前时刻没有字幕" : "等待字幕";

    if (!cue) {
      const emptyTitle = ui["jx-cue-empty"].querySelector("strong");
      const emptyText = ui["jx-cue-empty"].querySelector("p");
      if (hasCues) {
        emptyTitle.textContent = "当前时刻没有字幕";
        emptyText.textContent = "继续播放或拖动视频进度，字幕会自动重新同步。";
      } else {
        emptyTitle.textContent = "还没有可用的字幕";
        emptyText.textContent = "先尝试读取网页字幕；无法读取时，请导入自己有权使用的 SRT 或 VTT 文件。";
      }
      ui["jx-cue-english"].innerHTML = "";
      ui["jx-cue-chinese"].textContent = "";
      ui["jx-video-caption"].classList.add("jx-hidden");
      return;
    }

    const analysis = analyzeCue(cue);
    ui["jx-cue-english"].innerHTML = renderCueMarkup(cue.text, analysis);
    const translation = cue.translation || "";
    ui["jx-cue-chinese"].textContent = translation;
    ui["jx-cue-chinese"].classList.toggle("jx-hidden", !translation || !state.settings.showTranslation);
    ui["jx-translate-cue"].classList.toggle("jx-hidden", Boolean(translation) || translationLoading);
    ui["jx-translate-cue"].textContent = translationLoading ? "翻译中…" : "翻译本句";

    ui["jx-overlay-english"].innerHTML = renderCueMarkup(cue.text, analysis, true);
    ui["jx-overlay-chinese"].textContent = translation;
    ui["jx-overlay-chinese"].classList.toggle("jx-hidden", !translation || !state.settings.showTranslation);
    const showOverlay = state.settings.showOverlay && Boolean(state.video);
    ui["jx-video-caption"].classList.toggle("jx-hidden", !showOverlay);
    positionVideoOverlay();
  }

  function analyzeCue(cue) {
    const text = cue.text;
    const lower = text.toLowerCase();
    const matches = [];
    const phraseKeys = Object.keys(PHRASES).sort((a, b) => b.length - a.length);

    phraseKeys.forEach((phrase) => {
      let index = lower.indexOf(phrase);
      while (index !== -1) {
        matches.push({
          start: index,
          end: index + phrase.length,
          term: phrase,
          type: "expression",
          priority: 100
        });
        index = lower.indexOf(phrase, index + phrase.length);
      }
    });

    const phraseRanges = [...matches];
    const candidates = [];
    const wordRegex = /\b[A-Za-z][A-Za-z'-]*\b/g;
    let wordMatch;
    while ((wordMatch = wordRegex.exec(text))) {
      const start = wordMatch.index;
      const end = start + wordMatch[0].length;
      if (phraseRanges.some((range) => start < range.end && end > range.start)) continue;
      const raw = wordMatch[0];
      const lowerWord = raw.toLowerCase().replace(/[’]/g, "'");
      const local = getWordGloss(lowerWord);
      const longEnough = raw.length >= LEVEL_MIN_LENGTH[state.settings.level];
      const uncommon = !BASIC_WORDS.has(lowerWord);
      if (!local && !(longEnough && uncommon)) continue;
      let score = local ? 30 : 5;
      score += Math.min(8, Math.max(0, raw.length - 6));
      if (/(tion|ment|ous|ance|ence|ify|ize|ise)$/i.test(raw)) score += 3;
      candidates.push({
        start,
        end,
        term: lowerWord,
        type: "word",
        priority: score
      });
    }

    const limit = DENSITY_LIMIT[state.settings.density] || 3;
    const phraseCount = Math.min(matches.length, Math.ceil(limit / 2));
    const selectedPhrases = matches.slice(0, phraseCount);
    const selectedWords = candidates
      .sort((a, b) => b.priority - a.priority || a.start - b.start)
      .slice(0, Math.max(0, limit - selectedPhrases.length));

    return [...selectedPhrases, ...selectedWords].sort((a, b) => a.start - b.start);
  }

  function renderCueMarkup(text, annotations, overlay = false) {
    const accepted = [];
    annotations.forEach((item) => {
      if (!accepted.some((existing) => item.start < existing.end && item.end > existing.start)) {
        accepted.push(item);
      }
    });
    accepted.sort((a, b) => a.start - b.start);

    let html = "";
    let cursor = 0;
    accepted.forEach((item) => {
      html += renderClickableWords(text.slice(cursor, item.start), overlay, false);
      html += wordButton(text.slice(item.start, item.end), item.term, item.type, overlay, true);
      cursor = item.end;
    });
    html += renderClickableWords(text.slice(cursor), overlay, false);
    return html;
  }

  function renderClickableWords(segment, overlay, highlighted) {
    const regex = /([A-Za-z][A-Za-z'-]*)/g;
    let html = "";
    let cursor = 0;
    let match;
    while ((match = regex.exec(segment))) {
      html += escapeHtml(segment.slice(cursor, match.index));
      html += wordButton(match[0], match[0].toLowerCase().replace(/[’]/g, "'"), "word", overlay, highlighted);
      cursor = match.index + match[0].length;
    }
    html += escapeHtml(segment.slice(cursor));
    return html;
  }

  function wordButton(label, term, type, overlay, highlighted) {
    const active = normalizeTerm(term) === normalizeTerm(state.activeTerm);
    return `<button type="button" class="jx-word ${highlighted ? "jx-highlight" : ""} ${type === "expression" ? "jx-expression" : ""} ${overlay ? "jx-overlay-word" : ""} ${active ? "jx-word-active" : ""}" data-jx-term="${escapeAttr(term)}">${escapeHtml(label)}</button>`;
  }

  function positionVideoOverlay() {
    if (!ui["jx-video-caption"] || !state.video || !state.video.isConnected) return;
    if (ui["jx-video-caption"].classList.contains("jx-hidden")) return;
    const rect = state.video.getBoundingClientRect();
    const onScreen = rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    if (!onScreen || rect.width < 100 || rect.height < 80) {
      ui["jx-video-caption"].style.visibility = "hidden";
      return;
    }
    ui["jx-video-caption"].style.visibility = "visible";
    ui["jx-video-caption"].style.left = `${Math.max(10, rect.left + rect.width * 0.08)}px`;
    ui["jx-video-caption"].style.width = `${Math.max(160, rect.width * 0.84)}px`;
    ui["jx-video-caption"].style.bottom = `${Math.max(14, innerHeight - rect.bottom + rect.height * 0.12)}px`;
  }

  async function detectWebsiteSubtitles() {
    if (!state.video) {
      showToast("请先播放网页中的视频");
      return;
    }
    setSourceStatus("读取中…", "loading");
    try {
      const trackResult = await readTextTracks();
      if (trackResult?.cues.length) {
        await setCues(trackResult.cues, trackResult.label);
        showToast(`已读取 ${trackResult.cues.length} 条网页字幕`);
        return;
      }

      const platformResult = await readPlatformSubtitles();
      if (platformResult?.cues?.length) {
        await setCues(platformResult.cues, platformResult.label);
        showToast(`已读取网站字幕：${platformResult.cues.length} 条`);
        return;
      }

      const renderedText = extractVisibleCaptionText();
      if (renderedText) {
        activateRenderedCaptions();
        _captureRenderedCue(renderedText);
        refreshPlayback(true);
        showToast("已接入网页当前显示的字幕");
        return;
      }

      const resourceResult = await readSubtitleResources();
      if (resourceResult?.cues.length) {
        await setCues(resourceResult.cues, resourceResult.label);
        showToast(`已读取字幕资源：${resourceResult.cues.length} 条`);
        return;
      }

      throw new Error(platformResult?.issue || "No readable subtitle source");
    } catch (error) {
      console.warn("Juxue: website subtitle detection failed", error);
      const platformIssue = state.lastDetectionIssue || error.message || "";
      const isPlatformIssue = platformIssue && !/No readable subtitle source/i.test(platformIssue);
      setSourceStatus(isPlatformIssue ? "网站无 CC" : "未发现", "error");
      showToast(isPlatformIssue
        ? platformIssue
        : "未发现可读字幕；请先在网站中打开 CC，再重试或导入字幕文件", "warning");
    }
  }

  async function readPlatformSubtitles() {
    state.lastDetectionIssue = "";
    if (/(^|\.)iqiyi\.com$/i.test(location.hostname)) {
      return readIqiyiSubtitles();
    }
    if (!/^(www\.)?bilibili\.com$/i.test(location.hostname)) return null;

    try {
      const bvid = location.pathname.match(/\/video\/(BV[0-9A-Za-z]+)/i)?.[1];
      if (!bvid) {
        state.lastDetectionIssue = "没有在 Bilibili 页面地址中找到 BV 号";
        return { issue: state.lastDetectionIssue };
      }

      const view = await fetchBilibiliJson(`https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`);
      if (view?.code !== 0 || !view?.data) {
        state.lastDetectionIssue = `Bilibili 视频信息读取失败${view?.message ? `：${view.message}` : ""}`;
        return { issue: state.lastDetectionIssue };
      }

      const pageNumber = Math.max(1, Number(new URLSearchParams(location.search).get("p")) || 1);
      const currentPage = view.data.pages?.find((page) => Number(page.page) === pageNumber);
      const cid = currentPage?.cid || view.data.cid;
      if (!cid) {
        state.lastDetectionIssue = "Bilibili 视频信息中没有找到 cid";
        return { issue: state.lastDetectionIssue };
      }

      const playerUrl = `https://api.bilibili.com/x/player/v2?bvid=${encodeURIComponent(bvid)}&cid=${encodeURIComponent(cid)}`;
      const player = await fetchBilibiliJson(playerUrl);
      if (player?.code !== 0 || !player?.data) {
        state.lastDetectionIssue = `Bilibili 播放器接口读取失败${player?.message ? `：${player.message}` : ""}`;
        return { issue: state.lastDetectionIssue };
      }

      const subtitleList = Array.isArray(player.data.subtitle?.subtitles)
        ? player.data.subtitle.subtitles.filter((item) => item?.subtitle_url && !item.is_lock)
        : [];
      if (!subtitleList.length) {
        state.lastDetectionIssue = player.data.need_login_subtitle
          ? "Bilibili 提示需要登录后才能读取该视频字幕"
          : "Bilibili 接口确认：当前视频没有 CC 字幕轨道，需要先由 UP 主添加、使用 ASR，或导入字幕";
        return { issue: state.lastDetectionIssue };
      }

      const ranked = [...subtitleList].sort((a, b) => subtitleLanguageScore(b) - subtitleLanguageScore(a));
      const targetTrack = ranked[0];
      const translationTrack = ranked.find((item) =>
        item !== targetTrack &&
        /^(zh|ai-zh)/i.test(item.lan || "") &&
        item.subtitle_url
      );

      const loadedTracks = [];
      for (const track of ranked) {
        try {
          const trackData = await fetchBilibiliJson(normalizeSubtitleUrl(track.subtitle_url));
          const cues = parseBilibiliSubtitleBody(trackData);
          if (cues.length) loadedTracks.push({ track, cues, hasEnglish: hasEnglishLearningContent(cues) });
        } catch (error) {
          console.warn("Juxue: Bilibili subtitle track failed", error);
        }
      }
      const target = loadedTracks.find((item) => item.hasEnglish);
      if (!target) {
        const languageNames = subtitleList.map((item) => item.lan_doc || item.lan).filter(Boolean).join("、");
        state.lastDetectionIssue = languageNames
          ? `检测到 Bilibili 字幕轨道（${languageNames}），但其中没有英文内容`
          : "Bilibili 字幕轨道存在，但没有可读的英文内容";
        return { issue: state.lastDetectionIssue };
      }

      const translationCandidate = loadedTracks.find((item) =>
        item !== target &&
        (/^zh/i.test(item.track.lan || "") || /中文|汉语/i.test(item.track.lan_doc || "")) &&
        !item.hasEnglish
      );
      if (translationCandidate) {
        attachTimedTranslations(target.cues, translationCandidate.cues);
      } else if (translationTrack) {
        try {
          const translationData = await fetchBilibiliJson(normalizeSubtitleUrl(translationTrack.subtitle_url));
          attachTimedTranslations(target.cues, parseBilibiliSubtitleBody(translationData));
        } catch (error) {
          console.warn("Juxue: Bilibili translation track failed", error);
        }
      }

      return {
        cues: target.cues,
        label: target.track.lan_doc || target.track.lan || "Bilibili CC"
      };
    } catch (error) {
      console.warn("Juxue: Bilibili subtitle adapter failed", error);
      state.lastDetectionIssue = "Bilibili 字幕接口读取失败，请刷新页面、确认已登录后重试";
      return { issue: state.lastDetectionIssue };
    }
  }

  async function readIqiyiSubtitles() {
    window.postMessage({
      channel: "cue-page-bridge-v1",
      type: "CUE_REQUEST_STATE"
    }, "*");
    await delay(350);

    const data = state.platformData.iqiyi;
    if (!data) {
      state.lastDetectionIssue = "爱奇艺播放器数据尚未加载，请等视频开始播放后再点一次“读取网页字幕”";
      return { issue: state.lastDetectionIssue };
    }

    const tracks = Array.isArray(data.tracks) ? data.tracks : [];
    if (!tracks.length) {
      state.lastDetectionIssue = data.openStl
        ? "这个视频没有可读取的文字字幕。可导入 SRT/VTT；画面内嵌字幕需要 OCR/ASR。"
        : "当前爱奇艺视频没有开放字幕数据";
      return { issue: state.lastDetectionIssue };
    }

    const candidates = [];
    tracks.forEach((track, index) => {
      subtitleUrlCandidates(track, data.prefix).forEach((url, urlIndex) => {
        candidates.push({
          url,
          index,
          urlIndex,
          label: String(track.main || track.lid || `字幕 ${index + 1}`),
          languageHint: [track.lid, track.main, track.pre, track.xml].filter(Boolean).join(" ")
        });
      });
    });

    let fallbackCues = null;
    for (const candidate of candidates.slice(0, 18)) {
      try {
        const content = await requestSubtitleText(candidate.url);
        const cues = parseIqiyiSubtitlePayload(content);
        if (!cues.length) continue;
        if (!fallbackCues) fallbackCues = { cues, label: candidate.label };
        if (hasEnglishLearningContent(cues)) {
          return { cues, label: candidate.label || "iQIYI CC" };
        }
      } catch (error) {
        console.warn("Cue: iQIYI subtitle candidate failed", candidate.url, error);
      }
    }

    if (fallbackCues) {
      state.lastDetectionIssue = "已找到爱奇艺字幕，但内容不是英文；请选择英文字幕或使用 ASR";
    } else {
      state.lastDetectionIssue = "爱奇艺播放器声明有字幕，但字幕文件无法读取；可能需要登录会员或使用 ASR";
    }
    return { issue: state.lastDetectionIssue };
  }

  function subtitleUrlCandidates(track, prefix) {
    const urls = [];
    const fields = [track?.xml, track?.pre, track?.main];
    fields.forEach((value) => {
      if (typeof value !== "string" || !value.trim()) return;
      addUrl(value);
    });
    if (typeof track?.xml === "string" && prefix) {
      addUrl(`${String(prefix).replace(/\/+$/, "")}/${track.xml.replace(/^\/+/, "")}`);
    }
    function addUrl(value) {
      let text = value.trim();
      if (!text || !/^(https?:)?\/\/|^\//.test(text)) return;
      if (text.startsWith("//")) text = `https:${text}`;
      try {
        text = new URL(text, prefix || location.href).href;
      } catch {
        return;
      }
      if (!urls.includes(text)) urls.push(text);
    }
    return urls;
  }

  function parseIqiyiSubtitlePayload(content) {
    const text = String(content || "").trim();
    if (!text) return [];

    try {
      const json = JSON.parse(text);
      const list = json.data?.body || json.data?.stl || json.stl || json.body || json.data || [];
      if (Array.isArray(list)) {
        return dedupeCues(list.map((item) => {
          const startValue = Number(item.from ?? item.start ?? item.startTime ?? item.t) || 0;
          const endValue = Number(item.to ?? item.end ?? item.endTime ?? item.et) || 0;
          const duration = Number(item.dur ?? item.duration ?? item.et) || 0;
          const start = startValue > 10000 ? startValue / 1000 : startValue;
          const end = endValue > 10000
            ? endValue / 1000
            : endValue || (duration ? start + (duration > 10000 ? duration / 1000 : duration) : start + 1.2);
          return {
            start,
            end: Math.max(start + 0.2, end),
            text: cleanCueText(item.content || item.text || item.subtitle || ""),
            translation: cleanCueText(item.translation || item.zh || "")
          };
        }).filter((cue) => cue.text && cue.end > cue.start));
      }
    } catch {
      // Not JSON; continue with XML parsing.
    }

    try {
      const documentNode = new DOMParser().parseFromString(text, "text/xml");
      const nodes = [...documentNode.querySelectorAll("s, cue, subtitle, item, st")]
        .filter((node) => (node.textContent || "").trim());
      return dedupeCues(nodes.map((node) => {
        const startRaw = Number(node.getAttribute("t") || node.getAttribute("st") || node.getAttribute("start") || node.getAttribute("from")) || 0;
        const endRaw = Number(node.getAttribute("et") || node.getAttribute("end") || node.getAttribute("to")) || 0;
        const durationRaw = Number(node.getAttribute("dur") || node.getAttribute("duration")) || 0;
        const start = startRaw > 3600 ? startRaw / 1000 : startRaw;
        const end = endRaw
          ? (endRaw > 3600 ? endRaw / 1000 : endRaw)
          : start + (durationRaw ? (durationRaw > 3600 ? durationRaw / 1000 : durationRaw) : 1.2);
        return {
          start,
          end: Math.max(start + 0.2, end),
          text: cleanCueText(node.textContent || ""),
          translation: ""
        };
      }).filter((cue) => cue.text && cue.end > cue.start));
    } catch (error) {
      console.warn("Cue: invalid iQIYI subtitle XML", error);
      return [];
    }
  }

  async function fetchBilibiliJson(url) {
    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: { Accept: "application/json" }
      });
      if (response.ok) return response.json();
    } catch (error) {
      console.warn("Juxue: direct Bilibili request failed", error);
    }
    return requestJson(url);
  }

  function subtitleLanguageScore(track) {
    const language = String(track.lan || "");
    const label = String(track.lan_doc || "");
    if (/^en/i.test(language) || /English|英文/i.test(label)) return 100;
    if (/^ai-en/i.test(language)) return 90;
    if (/^zh/i.test(language) || /中文|汉语/i.test(label)) return 50;
    return 10;
  }

  function normalizeSubtitleUrl(url) {
    const value = String(url || "");
    if (value.startsWith("//")) return `https:${value}`;
    if (value.startsWith("http://")) return value.replace(/^http:/, "https:");
    return value;
  }

  function parseBilibiliSubtitleBody(data) {
    const body = Array.isArray(data?.body)
      ? data.body
      : Array.isArray(data?.subtitle?.body)
        ? data.subtitle.body
        : [];
    return body.map((item) => ({
      start: Math.max(0, Number(item.from) || 0),
      end: Math.max((Number(item.from) || 0) + 0.3, Number(item.to) || 0),
      text: cleanCueText(item.content || ""),
      translation: ""
    })).filter((cue) => cue.text && cue.end > cue.start);
  }

  function attachTimedTranslations(targetCues, translationCues) {
    if (!translationCues.length) return;
    targetCues.forEach((cue) => {
      const midpoint = (cue.start + cue.end) / 2;
      const overlap = translationCues.find((other) => midpoint >= other.start && midpoint < other.end);
      if (overlap) {
        cue.translation = overlap.text;
        return;
      }
      let nearest = null;
      let distance = 1.4;
      translationCues.forEach((other) => {
        const nextDistance = Math.abs(other.start - cue.start);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = other;
        }
      });
      if (nearest) cue.translation = nearest.text;
    });
  }

  async function readTextTracks() {
    const tracks = Array.from(state.video?.textTracks || []);
    if (!tracks.length) return null;
    const results = [];

    for (const track of tracks) {
      const previousMode = track.mode;
      try {
        if (track.mode === "disabled") track.mode = "hidden";
        await delay(520);
        const cues = Array.from(track.cues || []).map((cue) => ({
          start: Number(cue.startTime) || 0,
          end: Math.max((Number(cue.startTime) || 0) + 0.5, Number(cue.endTime) || 0),
          text: cleanCueText(cue.text || ""),
          translation: ""
        })).filter((cue) => cue.text);
        if (cues.length) {
          results.push({
            cues,
            label: track.label || track.language || "网页字幕",
            language: track.language || "",
            order: tracks.indexOf(track)
          });
        }
      } catch (error) {
        console.warn("Juxue: subtitle track is not readable", error);
      } finally {
        try { track.mode = previousMode; } catch { /* no-op */ }
      }
    }

    results.sort((a, b) => {
      const aEnglish = /^en/i.test(a.language) ? 1 : 0;
      const bEnglish = /^en/i.test(b.language) ? 1 : 0;
      return bEnglish - aEnglish || b.cues.length - a.cues.length || a.order - b.order;
    });
    const englishResult = results.find((result) => hasEnglishLearningContent(result.cues));
    if (!englishResult && results.length) {
      state.lastDetectionIssue = "检测到网页字幕轨道，但轨道内容不是英文；请选择英文 CC 或使用 ASR 生成英文字幕";
    }
    return englishResult || null;
  }

  async function readSubtitleResources() {
    const urls = discoverSubtitleUrls();
    const attempts = urls.slice(0, 10).map(async (url) => {
      try {
        const content = await requestSubtitleText(url);
        const cues = parseSubtitle(content);
        if (cues.length) {
          return {
            url,
            cues,
            label: subtitleUrlLabel(url),
            score: scoreSubtitleCues(cues)
          };
        }
      } catch (error) {
        console.warn("Juxue: subtitle resource is not readable", url, error);
      }
      return null;
    });
    const results = (await Promise.all(attempts))
      .filter(Boolean)
      .filter((result) => hasEnglishLearningContent(result.cues));
    if (!results.length && urls.length) {
      state.lastDetectionIssue = "发现字幕资源，但没有可读的英文内容；请选择英文字幕或使用 ASR";
    }
    results.sort((a, b) => b.score - a.score || b.cues.length - a.cues.length);
    return results[0] || null;
  }

  function discoverSubtitleUrls() {
    const urls = [];
    const add = (value, weight = 0) => {
      if (!value) return;
      try {
        const resolved = new URL(value, location.href).href;
        if (!urls.some((item) => item.url === resolved)) urls.push({ url: resolved, weight });
      } catch {
        // Ignore malformed resource URLs.
      }
    };

    state.video?.querySelectorAll("track[src]").forEach((track) => {
      add(track.src || track.getAttribute("src"), 100);
    });

    const entries = performance.getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => /\.(vtt|srt)(?:[?#]|$)/i.test(name) || /(?:caption|subtitle|timedtext|texttrack|webvtt)/i.test(name));

    entries.forEach((url) => {
      add(url, /\.(vtt|srt)(?:[?#]|$)/i.test(url) ? 50 : 10);
    });

    return urls
      .sort((a, b) => b.weight - a.weight)
      .map((item) => item.url);
  }

  async function requestSubtitleText(url) {
    let pageError = null;
    try {
      const response = await fetch(url, {
        credentials: "include",
        headers: { Accept: "text/vtt, application/x-subrip, text/plain, */*" }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      if (text.length > MAX_FILE_SIZE) throw new Error("Subtitle resource is too large");
      return text;
    } catch (error) {
      pageError = error;
    }

    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      const result = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "CUE_FETCH_TEXT", url }, (response) => resolve(response));
      });
      if (result?.ok && typeof result.text === "string") return result.text;
    }
    throw pageError || new Error("Subtitle resource fetch failed");
  }

  function scoreSubtitleCues(cues) {
    const sample = cues.slice(0, 80).map((cue) => cue.text).join(" ");
    const englishLetters = (sample.match(/[A-Za-z]/g) || []).length;
    const chineseChars = (sample.match(/[\u3400-\u9fff]/g) || []).length;
    return englishLetters - chineseChars * 0.6 + Math.min(cues.length, 200) * 0.1;
  }

  function hasEnglishLearningContent(cues) {
    if (!Array.isArray(cues) || !cues.length) return false;
    const sample = cues.slice(0, 100).map((cue) => cue.text).join(" ");
    const englishWords = sample.match(/\b[A-Za-z][A-Za-z'-]*\b/g) || [];
    const chineseChars = (sample.match(/[\u3400-\u9fff]/g) || []).length;
    return englishWords.length >= 2 && englishWords.length * 2 >= chineseChars / 1.5;
  }

  function subtitleUrlLabel(url) {
    try {
      const pathname = new URL(url).pathname;
      return decodeURIComponent(pathname.split("/").pop() || "网页字幕文件");
    } catch {
      return "网页字幕文件";
    }
  }

  function activateRenderedCaptions() {
    state.renderedCaptionActive = true;
    state.renderedCaptionText = "";
    state.cues = [];
    state.sourceLabel = "网页画面字幕";
    state.sourceType = "rendered";
    state.currentCueKey = "";
    setSourceStatus("实时字幕", "ready");
  }

  function captureRenderedCaption() {
    if (!state.renderedCaptionActive) return;
    const now = performance.now();
    if (now - state.lastRenderedScan < 300) return;
    state.lastRenderedScan = now;
    const text = extractVisibleCaptionText();
    if (!text) return;
    _captureRenderedCue(text);
  }

  function _captureRenderedCue(text) {
    if (!state.video) return;
    const now = Math.max(0, Number(state.video.currentTime) || 0);
    const normalized = cleanCueText(text);
    if (!normalized) return;

    if (normalized === state.renderedCaptionText) {
      const last = state.cues[state.cues.length - 1];
      if (last) last.end = Math.max(last.end, now + 1.2);
      return;
    }

    const previous = state.cues[state.cues.length - 1];
    if (previous) previous.end = Math.max(previous.start + 0.3, now);
    state.renderedCaptionText = normalized;
    state.cues.push({
      start: now,
      end: now + 2.4,
      text: normalized,
      translation: "",
      live: true
    });
    if (state.cues.length > 300) state.cues.splice(0, state.cues.length - 300);
    state.currentCueKey = "";
  }

  function extractVisibleCaptionText() {
    if (!state.video) return "";
    const videoRect = state.video.getBoundingClientRect();
    if (!videoRect.width || !videoRect.height) return "";
    const selectors = [
      ".ytp-caption-segment",
      ".player-timedtext-text-container span",
      ".jw-text-track-cue",
      ".vjs-text-track-cue",
      ".shaka-text-container span",
      ".plyr__captions span",
      "[class*='caption'] span",
      "[class*='subtitle'] span",
      "[data-testid*='caption']",
      "[data-testid*='subtitle']"
    ];
    const found = [];
    const seenElements = new Set();

    selectors.forEach((selector) => {
      let elements = [];
      try { elements = [...document.querySelectorAll(selector)]; } catch { elements = []; }
      elements.forEach((element) => {
        if (seenElements.has(element)) return;
        seenElements.add(element);
        if (ui.host?.contains(element)) return;
        const text = cleanCueText(element.textContent || "");
        if (text.length < 2 || text.length > 300 || !/[A-Za-z]/.test(text)) return;
        const rect = element.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        if (rect.right < videoRect.left || rect.left > videoRect.right || rect.bottom < videoRect.top || rect.top > videoRect.bottom) return;
        if (rect.top < videoRect.top + videoRect.height * 0.42) return;
        const style = getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.05) return;
        found.push({ text, rect });
      });
    });

    const unique = [];
    found.sort((a, b) => a.rect.width * a.rect.height - b.rect.width * b.rect.height);
    found.forEach(({ text }) => {
      if (!unique.some((line) => line === text || line.includes(text) || text.includes(line))) {
        unique.push(text);
      }
    });
    return cleanCueText(unique.join(" "));
  }

  async function importSubtitleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      showToast("字幕文件超过 5MB，请检查文件");
      return;
    }
    try {
      const content = await file.text();
      await importSubtitleText(content, file.name);
      showToast(`已导入 ${state.cues.length} 条字幕`);
    } catch (error) {
      console.error("Juxue: subtitle import failed", error);
      showToast(error.message || "字幕文件解析失败");
      setSourceStatus("解析失败", "error");
    }
  }

  async function importSubtitleText(content, fileName = "subtitle.srt") {
    const cues = parseSubtitle(content);
    if (!cues.length) throw new Error("没有找到有效字幕时间轴");
    await setCues(cues, fileName);
    showToast(`已载入 ${cues.length} 条字幕`);
  }

  async function setCues(cues, label) {
    state.renderedCaptionActive = false;
    state.renderedCaptionText = "";
    state.cues = cues
      .filter((cue) => Number.isFinite(cue.start) && Number.isFinite(cue.end) && cue.end > cue.start)
      .sort((a, b) => a.start - b.start);
    state.sourceLabel = label;
    state.sourceType = "ready";
    state.currentCueKey = "";
    setSourceStatus(`${state.cues.length} 条`, "ready");
    renderCurrentCue(true);
    await storageSet(subtitleCacheKey(), {
      cues: state.cues,
      label,
      savedAt: new Date().toISOString()
    });
    if (state.video) refreshPlayback(true);
  }

  function parseSubtitle(rawContent) {
    const content = String(rawContent || "")
      .replace(/^\uFEFF/, "")
      .replace(/\r\n?/g, "\n")
      .trim();
    if (!content) return [];

    const blocks = content.split(/\n{2,}/);
    const cues = [];
    for (const block of blocks) {
      const lines = block.split("\n").map((line) => line.trim());
      if (!lines.length || /^WEBVTT/i.test(lines[0]) || /^NOTE\b/i.test(lines[0])) continue;
      const timingIndex = lines.findIndex((line) => line.includes("-->"));
      if (timingIndex === -1) continue;
      const timing = lines[timingIndex].match(/(\d{1,2}:\d{2}:\d{2}[.,]\d{3}|\d{2}:\d{2}[.,]\d{3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[.,]\d{3}|\d{2}:\d{2}[.,]\d{3})/);
      if (!timing) continue;
      const start = parseTimestamp(timing[1]);
      const end = parseTimestamp(timing[2]);
      const textLines = lines
        .slice(timingIndex + 1)
        .filter((line) => line && !/^(STYLE|REGION)\b/i.test(line))
        .map(cleanCueText)
        .filter(Boolean);
      if (!textLines.length) continue;
      const chineseLines = textLines.filter((line) => /[\u3400-\u9fff]/.test(line));
      const englishLines = textLines.filter((line) => !/[\u3400-\u9fff]/.test(line));
      const text = (englishLines.length ? englishLines : textLines).join(" ");
      const translation = chineseLines.join(" ");
      if (!text) continue;
      cues.push({ start, end, text, translation });
    }
    return dedupeCues(cues);
  }

  function cleanCueText(text) {
    return String(text || "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\{\\[^}]+\}/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseTimestamp(value) {
    const parts = value.replace(",", ".").split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number.NaN;
  }

  function dedupeCues(cues) {
    const seen = new Set();
    return cues.filter((cue) => {
      const key = `${cue.start.toFixed(2)}|${cue.end.toFixed(2)}|${cue.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function subtitleCacheKey() {
    return `juxue.ext.subs:${location.hostname}${location.pathname}`.slice(0, 420);
  }

  async function loadCachedSubtitles() {
    const cache = await storageGet(subtitleCacheKey(), null);
    if (cache?.cues?.length) {
      state.cues = cache.cues;
      state.sourceLabel = cache.label || "上次导入的字幕";
      state.sourceType = "ready";
      setSourceStatus(`${state.cues.length} 条`, "ready");
      renderCurrentCue(true);
    }
  }

  async function translateCurrentCue() {
    const cue = state.currentCue;
    if (!cue || translationLoading) return;
    translationLoading = true;
    renderCurrentCue(true);
    try {
      const translated = await translateText(cue.text);
      if (translated) {
        cue.translation = translated;
        state.settings.showTranslation = true;
        await persistSettings();
        renderCurrentCue(true);
      } else {
        showToast("没有获取到翻译，请稍后再试");
      }
    } catch (error) {
      console.warn("Juxue translation failed", error);
      showToast("翻译服务暂时不可用");
    } finally {
      translationLoading = false;
      renderCurrentCue(true);
    }
  }

  async function translateText(text) {
    const trimmed = String(text || "").trim().slice(0, 480);
    if (!trimmed) return "";
    const cacheKey = `translate:${trimmed}`;
    if (state.lookupCache.has(cacheKey)) return state.lookupCache.get(cacheKey);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|zh-CN`;
    const data = await requestJson(url);
    const translated = decodeHtml(data?.responseData?.translatedText || "");
    if (translated && normalizeTerm(translated) !== normalizeTerm(trimmed)) {
      state.lookupCache.set(cacheKey, translated);
      return translated;
    }
    return "";
  }

  async function openWord(term, cue) {
    if (!term || !cue) return;
    if (state.video && !state.video.paused) state.video.pause();
    if (!state.panelOpen) openPanel();
    state.activeTerm = term;
    state.activeCue = cue;
    const normalized = normalizeTerm(term);
    const localPhrase = PHRASES[normalized];
    const localWord = getWordGloss(normalized);
    state.activeLookup = {
      term,
      type: localPhrase ? "expression" : "word",
      phonetic: localPhrase?.phonetic || localWord?.[1] || "",
      meaning: localPhrase?.meaning || localWord?.[0] || "",
      contextual: localPhrase?.contextual || "",
      definition: "",
      translationLoaded: Boolean(localPhrase || localWord)
    };
    renderWordCard();
    renderCurrentCue(true);
  }

  function renderWordCard() {
    const lookup = state.activeLookup;
    if (!lookup) {
      ui["jx-word-card"].classList.add("jx-hidden");
      return;
    }
    const existing = findLibraryItem(lookup.term);
    ui["jx-word-card"].classList.remove("jx-hidden");
    ui["jx-word-type"].textContent = lookup.type === "expression" ? "实用表达" : "单词";
    ui["jx-word-title"].textContent = lookup.term;
    ui["jx-word-phonetic"].textContent = lookup.phonetic || "音标待查询";
    ui["jx-word-meaning"].textContent = lookup.meaning || "点击“联网查词”获取释义";
    ui["jx-word-definition"].textContent = lookup.definition || "—";
    ui["jx-word-context"].textContent = state.activeCue ? `“${state.activeCue.text}”` : "—";
    ui["jx-word-contextual"].textContent = lookup.contextual || (state.activeCue
      ? "结合原句和人物语气，判断这个词在这一刻的具体含义。"
      : "—");
    ui["jx-word-online"].textContent = lookup.translationLoaded ? "重新联网查询" : "联网查词";
    ui["jx-word-save"].textContent = existing ? "✓ 已在词库中" : "＋ 收藏到词库";
    ui["jx-word-save"].classList.toggle("jx-saved", Boolean(existing));
    ui["jx-word-master"].textContent = existing?.mastered ? "✓ 已掌握" : "标记掌握";
    ui["jx-word-master"].classList.toggle("jx-mastered", Boolean(existing?.mastered));
  }

  function closeWordCard() {
    state.activeLookup = null;
    state.activeTerm = "";
    ui["jx-word-card"].classList.add("jx-hidden");
    renderCurrentCue(true);
  }

  async function lookupOnline() {
    const lookup = state.activeLookup;
    if (!lookup) return;
    ui["jx-word-online"].disabled = true;
    ui["jx-word-online"].textContent = "查询中…";
    try {
      const dictionaryPromise = lookupWordDictionary(lookup.term);
      const translationPromise = translateText(lookup.term);
      const [dictionary, translation] = await Promise.allSettled([dictionaryPromise, translationPromise]);
      if (dictionary.status === "fulfilled" && dictionary.value) {
        lookup.phonetic = dictionary.value.phonetic || lookup.phonetic;
        lookup.definition = dictionary.value.definition || lookup.definition;
      }
      if (translation.status === "fulfilled" && translation.value) {
        lookup.meaning = translation.value;
      }
      lookup.translationLoaded = Boolean(lookup.meaning || lookup.definition);
      if (!lookup.meaning && !lookup.definition) {
        showToast("没有查到结果，短语可能更适合结合语境理解");
      }
      if (state.activeCue && translation.status === "fulfilled" && translation.value) {
        const sentenceTranslation = await translateText(state.activeCue.text).catch(() => "");
        if (sentenceTranslation) state.activeCue.translation = sentenceTranslation;
      }
      renderWordCard();
      renderCurrentCue(true);
    } catch (error) {
      console.warn("Juxue lookup failed", error);
      showToast("联网查词失败，请检查网络");
    } finally {
      ui["jx-word-online"].disabled = false;
      renderWordCard();
    }
  }

  async function lookupWordDictionary(term) {
    if (/\s/.test(term.trim())) return null;
    const cacheKey = `dict:${term.toLowerCase()}`;
    if (state.lookupCache.has(cacheKey)) return state.lookupCache.get(cacheKey);
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`;
    const data = await requestJson(url);
    if (!Array.isArray(data) || !data.length) return null;
    const first = data[0];
    const phonetic = first.phonetic || first.phonetics?.find((item) => item.text)?.text || "";
    const meaning = first.meanings?.find((item) => item.definitions?.length);
    const definition = meaning
      ? `${meaning.partOfSpeech ? `${meaning.partOfSpeech}. ` : ""}${meaning.definitions[0].definition}`
      : "";
    const result = { phonetic, definition };
    state.lookupCache.set(cacheKey, result);
    return result;
  }

  async function requestJson(url) {
    if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      const result = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: "CUE_FETCH_JSON", url }, (response) => resolve(response));
      });
      if (!result?.ok) throw new Error(result?.error || `Request failed: ${result?.status || ""}`);
      return result.data;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  }

  async function saveActiveWord() {
    const lookup = state.activeLookup;
    const cue = state.activeCue;
    if (!lookup || !cue) return;
    if (findLibraryItem(lookup.term)) {
      showToast("这条表达已经在你的词库中");
      return;
    }
    const item = {
      id: makeId("item"),
      type: lookup.type,
      original: lookup.term,
      meaning: lookup.meaning || "待补充释义",
      contextual: lookup.contextual || "",
      definition: lookup.definition || "",
      phonetic: lookup.phonetic || "",
      context: cue.text,
      translation: cue.translation || "",
      source: cleanTitle(document.title) || "网页视频",
      episode: location.hostname,
      tags: [lookup.type === "expression" ? "表达" : "单词", location.hostname.split(".")[0]].filter(Boolean),
      createdAt: new Date().toISOString(),
      mastered: false
    };
    state.library.unshift(item);
    await persistLibrary();
    renderWordCard();
    renderLibrary();
    showToast("已收藏到Cue词库");
  }

  async function masterActiveWord() {
    const lookup = state.activeLookup;
    if (!lookup) return;
    let item = findLibraryItem(lookup.term);
    if (!item) {
      await saveActiveWord();
      item = findLibraryItem(lookup.term);
    }
    if (!item) return;
    item.mastered = !item.mastered;
    await persistLibrary();
    renderWordCard();
    renderLibrary();
    showToast(item.mastered ? "已标记为掌握" : "已移回待复习");
  }

  function normalizeTerm(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/^[^a-z]+|[^a-z']+$/g, "")
      .replace(/\s+/g, " ");
  }

  function getWordGloss(term) {
    const normalized = normalizeTerm(term);
    if (WORD_GLOSS[normalized]) return WORD_GLOSS[normalized];
    const bases = [
      normalized.replace(/ies$/, "y"),
      normalized.replace(/ing$/, ""),
      normalized.replace(/ing$/, "e"),
      normalized.replace(/ed$/, ""),
      normalized.replace(/ed$/, "e"),
      normalized.replace(/s$/, "")
    ];
    for (const base of bases) {
      if (base && WORD_GLOSS[base]) return WORD_GLOSS[base];
    }
    return null;
  }

  function findLibraryItem(term) {
    const normalized = normalizeTerm(term);
    return state.library.find((item) => normalizeTerm(item.original) === normalized);
  }

  function renderLibrary() {
    const query = normalizeTerm(state.libraryQuery);
    const items = state.library.filter((item) => {
      if (!query) return true;
      return normalizeTerm([item.original, item.meaning, item.source, item.context, ...(item.tags || [])].join(" ")).includes(query);
    });
    ui["jx-lib-count"].textContent = String(state.library.length);
    if (!items.length) {
      ui["jx-library-list"].innerHTML = `
        <div class="jx-library-empty">
          <span>Aa</span><strong>${state.library.length ? "没有匹配的内容" : "词库还是空的"}</strong>
          <p>点击视频字幕里的英文，理解后即可收藏。</p>
        </div>`;
      return;
    }
    ui["jx-library-list"].innerHTML = items.map((item) => `
      <article class="jx-library-item ${item.mastered ? "jx-mastered-card" : ""}">
        <div class="jx-lib-top"><span>${escapeHtml(item.type === "expression" ? "表达" : "单词")}</span><small>${escapeHtml(item.source || "")}</small></div>
        <h3>${escapeHtml(item.original)}</h3>
        <p>${escapeHtml(item.meaning || "待补充释义")}</p>
        <blockquote>${escapeHtml(item.context || "")}</blockquote>
        <div class="jx-lib-actions">
          <button type="button" data-jx-action="speak" data-jx-id="${escapeAttr(item.id)}" title="发音">◖</button>
          <button type="button" data-jx-action="master" data-jx-id="${escapeAttr(item.id)}" title="掌握状态">${item.mastered ? "✓" : "○"}</button>
          <button type="button" data-jx-action="delete" data-jx-id="${escapeAttr(item.id)}" title="删除">×</button>
          <span>${escapeHtml(relativeDate(item.createdAt))}</span>
        </div>
      </article>
    `).join("");
  }

  async function handleLibraryAction(action, id) {
    const item = state.library.find((entry) => entry.id === id);
    if (!item) return;
    if (action === "speak") {
      speak(item.original);
    } else if (action === "master") {
      item.mastered = !item.mastered;
      await persistLibrary();
      renderLibrary();
      showToast(item.mastered ? "已标记为掌握" : "已移回待复习");
    } else if (action === "delete") {
      if (!window.confirm(`从词库删除“${item.original}”吗？`)) return;
      state.library = state.library.filter((entry) => entry.id !== id);
      await persistLibrary();
      renderLibrary();
      showToast("已从词库删除");
    }
  }

  function renderSettings() {
    ui["jx-level"].querySelectorAll("[data-value]").forEach((button) => {
      button.classList.toggle("jx-selected", button.dataset.value === state.settings.level);
    });
    ui["jx-density"].querySelectorAll("[data-value]").forEach((button) => {
      button.classList.toggle("jx-selected", button.dataset.value === state.settings.density);
    });
    ui["jx-overlay-toggle"].checked = state.settings.showOverlay;
    ui["jx-translation-toggle"].checked = state.settings.showTranslation;
  }

  function showDiagnostics() {
    const video = state.video;
    const allVideos = [...document.querySelectorAll("video")];
    const iframeCount = document.querySelectorAll("iframe").length;
    const tracks = video ? Array.from(video.textTracks || []) : [];
    const trackLines = tracks.length
      ? tracks.map((track, index) => {
        let cueCount = 0;
        try { cueCount = track.cues?.length || 0; } catch { cueCount = -1; }
        return `  ${index + 1}. mode=${track.mode}, lang=${track.language || "?"}, label=${track.label || "?"}, cues=${cueCount}`;
      })
      : ["  无 TextTrack"];
    const captionPreview = extractVisibleCaptionText();
    const subtitleUrls = discoverSubtitleUrls();
    const iqiyiData = state.platformData.iqiyi;
    const rect = video?.getBoundingClientRect();
    const hiddenVideo = Boolean(video && rect && (rect.width < 140 || rect.height < 80));
    let likelyCause = "可以尝试点击“读取网页字幕”";

    if (!video) {
      likelyCause = iframeCount
        ? "顶层页面没有 video，播放器很可能位于跨域 iframe 中"
        : "当前页面没有可访问的 HTML5 video";
    } else if (hiddenVideo && !video.paused) {
      likelyCause = "找到了正在播放的隐藏 video，视频画面可能由 Canvas 或平台私有播放器渲染";
    } else if (tracks.some((track) => {
      try { return (track.cues?.length || 0) > 0; } catch { return false; }
    })) {
      likelyCause = "存在可读字幕轨道，应能读取网页字幕";
    } else if (captionPreview) {
      likelyCause = "检测到页面已显示的 CC，可以直接使用实时字幕";
    } else if (iqiyiData && !iqiyiData.tracks?.length) {
      likelyCause = "爱奇艺播放器没有返回文本字幕轨道，字幕可能是画面内嵌内容";
    } else if (!tracks.length) {
      likelyCause = "没有 TextTrack，且当前画面没有检测到 CC；请先在网站播放器里打开字幕";
    } else {
      likelyCause = "有字幕轨道但 cues 尚未加载，可能受跨域或播放器接口限制";
    }

    const text = [
      "Cue 网页视频诊断 v0.3.2",
      `页面：${location.hostname}${location.pathname}`,
      `iframe：${iframeCount} 个（跨域 iframe 内容无法在此读取）`,
      `video：页面找到 ${allVideos.length} 个，Cue连接 ${video ? "1 个" : "0 个"}`,
      video ? `播放状态：${video.paused ? "暂停" : "播放中"}, readyState=${video.readyState}, ${formatTime(video.currentTime)} / ${Number.isFinite(video.duration) ? formatTime(video.duration) : "未知"}` : "播放状态：无视频",
      video ? `元素尺寸：${Math.round(rect.width)} × ${Math.round(rect.height)}${hiddenVideo ? "（隐藏或不可见）" : ""}` : "元素尺寸：—",
      video ? `视频源：${safeResourceName(video.currentSrc)}` : "视频源：—",
      video ? `DRM mediaKeys：${video.mediaKeys ? "可能已启用" : "未检测到"}` : "DRM mediaKeys：—",
      "TextTrack：",
      ...trackLines,
      `当前已显示 CC：${captionPreview ? `“${captionPreview.slice(0, 100)}”` : "未检测到"}`,
      `疑似字幕资源：${subtitleUrls.length ? subtitleUrls.slice(0, 5).map(safeResourceName).join(", ") : "未发现"}`,
      iqiyiData
        ? `爱奇艺桥接：openStl=${iqiyiData.openStl}, tracks=${iqiyiData.tracks?.length || 0}, tvid=${iqiyiData.tvid || "?"}`
        : "爱奇艺桥接：未收到播放器状态",
      `字幕状态：${state.sourceType}, ${state.cues.length} 条`,
      `最近识别结果：${state.lastDetectionIssue || "尚无字幕接口错误"}`,
      `最可能原因：${likelyCause}`
    ].join("\n");

    ui["jx-diagnostic"].textContent = text;
    ui["jx-diagnostic"].classList.remove("jx-hidden");
    ui["jx-copy-diagnostic"].classList.remove("jx-hidden");
  }

  async function copyDiagnostics() {
    const text = ui["jx-diagnostic"].textContent || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("诊断信息已复制");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.documentElement.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      showToast("诊断信息已复制");
    }
  }

  function safeResourceName(value) {
    if (!value) return "空";
    try {
      const url = new URL(value, location.href);
      if (url.protocol === "blob:" || url.protocol === "data:") return url.protocol;
      return `${url.hostname}${url.pathname}`.slice(0, 120);
    } catch {
      return String(value).slice(0, 120);
    }
  }

  async function persistSettings() {
    await storageSet(SETTINGS_KEY, state.settings);
  }

  async function persistLibrary() {
    await storageSet(LIBRARY_KEY, state.library);
    renderLibrary();
  }

  async function clearLibrary() {
    if (!window.confirm("确定清空Cue在浏览器里保存的全部收藏吗？此操作不可撤销。")) return;
    state.library = [];
    await persistLibrary();
    renderLibrary();
    showToast("Cue词库已清空");
  }

  function exportLibrary() {
    const blob = new Blob([JSON.stringify({
      app: "Cue网页视频扩展",
      exportedAt: new Date().toISOString(),
      vocabulary: state.library
    }, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `juxue-web-video-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("词库已导出");
  }

  function moveCue(direction) {
    if (!state.video || !state.cues.length) {
      showToast("还没有加载字幕");
      return;
    }
    const currentTime = state.video.currentTime;
    let index = state.cues.findIndex((cue) => currentTime >= cue.start && currentTime < cue.end);
    if (index === -1) index = state.cues.findIndex((cue) => cue.start > currentTime);
    index = Math.max(0, Math.min(state.cues.length - 1, index + direction));
    if (index === -1) index = 0;
    state.video.currentTime = state.cues[index].start + 0.04;
    closeWordCard();
    refreshPlayback(true);
  }

  function setSourceStatus(label, status) {
    ui["jx-source-state"].textContent = label;
    ui["jx-source-state"].dataset.status = status;
  }

  function showToast(message, kind = "success") {
    const toast = ui["jx-toast"];
    if (!toast) return;
    toast.dataset.kind = kind;
    toast.querySelector("span").textContent = kind === "success" ? "✓" : kind === "error" ? "×" : "!";
    toast.querySelector("p").textContent = message;
    toast.classList.add("jx-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("jx-show"), kind === "success" ? 2400 : 4200);
  }

  function speak(text) {
    if (!text || !("speechSynthesis" in window)) {
      showToast("当前浏览器不支持语音朗读");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => /^en/i.test(voice.lang))
      || null;
    speechSynthesis.speak(utterance);
  }

  function handleFullscreenChange() {
    const fullscreenElement = document.fullscreenElement;
    if (fullscreenElement && fullscreenElement !== state.video) {
      try {
        fullscreenElement.appendChild(ui.host);
        state.hostInFullscreen = true;
      } catch {
        state.hostInFullscreen = false;
      }
    } else if (!fullscreenElement && state.hostInFullscreen) {
      document.documentElement.appendChild(ui.host);
      state.hostInFullscreen = false;
    } else if (fullscreenElement === state.video) {
      showToast("这个播放器直接全屏视频，退出全屏后使用Cue");
    }
    positionVideoOverlay();
  }

  async function storageGet(key, fallback) {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        const result = await chrome.storage.local.get(key);
        return result[key] ?? fallback;
      }
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("Juxue storage read failed", error);
      return fallback;
    }
  }

  async function storageSet(key, value) {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        await chrome.storage.local.set({ [key]: value });
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn("Juxue storage write failed", error);
    }
  }

  function cleanTitle(title) {
    return String(title || "")
      .replace(/^\(\d+\+?\)\s*/, "")
      .replace(/\s*[-|·]\s*(YouTube|Bilibili|哔哩哔哩|爱奇艺|腾讯视频|优酷|Netflix).*$/i, "")
      .trim();
  }

  function decodeHtml(value) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = String(value || "");
    return textarea.value;
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function relativeDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days <= 0) return "今天";
    if (days === 1) return "昨天";
    return `${days} 天前`;
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function empty(value) {
    return String(value || "").trim().length === 0;
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

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function styles() {
    return `
      :host { all: initial; }
      *, *::before, *::after { box-sizing: border-box; }
      button, input { font: inherit; }
      button { border: 0; }
      .jx-hidden { display: none !important; }
      .jx-shell {
        --jx-ink: #15231e;
        --jx-ink-soft: #5e6b64;
        --jx-paper: #f4f0e6;
        --jx-paper-light: #fbf8f1;
        --jx-lime: #c9ef72;
        --jx-line: rgba(21,35,30,.13);
        --jx-serif: "Iowan Old Style", "Baskerville", "Songti SC", "STSong", serif;
        --jx-sans: "Aptos", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        pointer-events: none;
        color: var(--jx-ink);
        font-family: var(--jx-sans);
        -webkit-font-smoothing: antialiased;
      }
      .jx-panel {
        position: absolute;
        top: 14px;
        right: 14px;
        bottom: 14px;
        display: flex;
        width: 360px;
        max-width: calc(100vw - 28px);
        flex-direction: column;
        overflow: hidden;
        border: 1px solid rgba(21,35,30,.15);
        border-radius: 23px;
        background:
          radial-gradient(circle at 90% 1%, rgba(201,239,114,.26), transparent 13rem),
          var(--jx-paper-light);
        box-shadow: 0 24px 80px rgba(5,17,12,.28);
        opacity: 0;
        pointer-events: none;
        transform: translateX(18px) scale(.985);
        transition: opacity 180ms ease, transform 220ms ease;
      }
      .jx-open .jx-panel { opacity: 1; pointer-events: auto; transform: translateX(0) scale(1); }
      .jx-fab {
        position: absolute;
        right: 18px;
        bottom: 18px;
        display: flex;
        height: 46px;
        align-items: center;
        gap: 8px;
        padding: 0 14px 0 6px;
        border: 1px solid rgba(255,255,255,.15);
        border-radius: 99px;
        background: #14221d;
        box-shadow: 0 12px 35px rgba(5,17,12,.28);
        color: #fff;
        font: 700 11px var(--jx-sans);
        pointer-events: auto;
        cursor: pointer;
        opacity: 1;
        transition: opacity 160ms ease;
      }
      .jx-open .jx-fab { opacity: 0; pointer-events: none; }
      .jx-fab-mark {
        display: grid;
        width: 34px;
        height: 34px;
        place-items: center;
        border-radius: 50%;
        background: var(--jx-lime);
        color: #15231e;
        font: 600 15px var(--jx-serif);
      }
      .jx-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 17px 18px 13px;
      }
      .jx-brand, .jx-header-actions { display: flex; align-items: center; gap: 9px; }
      .jx-logo {
        display: grid;
        width: 31px;
        height: 31px;
        place-items: center;
        border-radius: 9px;
        background: var(--jx-lime);
        font: 600 14px var(--jx-serif);
      }
      .jx-brand > span:nth-child(2) { display: flex; flex-direction: column; gap: 1px; }
      .jx-brand strong { font: 600 17px var(--jx-serif); letter-spacing: .03em; }
      .jx-brand small { color: #87928b; font: 700 6px var(--jx-sans); letter-spacing: .15em; }
      .jx-icon-btn {
        display: grid;
        width: 28px;
        height: 28px;
        place-items: center;
        border: 1px solid var(--jx-line);
        border-radius: 50%;
        background: rgba(255,255,255,.42);
        color: #647069;
        font: 15px var(--jx-sans);
        cursor: pointer;
      }
      .jx-icon-btn:hover { background: #fff; color: var(--jx-ink); }
      .jx-tabs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
        margin: 0 16px;
        padding: 3px;
        border-radius: 9px;
        background: #e4e1d6;
      }
      .jx-tab {
        height: 30px;
        border-radius: 7px;
        background: transparent;
        color: #6e7972;
        font-size: 9px;
        cursor: pointer;
      }
      .jx-tab.jx-active { background: #fff; color: var(--jx-ink); box-shadow: 0 2px 8px rgba(20,31,26,.08); }
      .jx-tab b { margin-left: 2px; font-size: 7px; font-weight: 700; }
      .jx-pane {
        display: none;
        min-height: 0;
        flex: 1;
        padding: 14px 16px 16px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #c3c5bb transparent;
      }
      .jx-pane.jx-active { display: block; animation: jx-pane-in 160ms ease both; }
      @keyframes jx-pane-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      .jx-video-status {
        display: grid;
        grid-template-columns: 8px 1fr auto;
        align-items: center;
        gap: 9px;
        padding: 10px 11px;
        border: 1px solid var(--jx-line);
        border-radius: 11px;
        background: rgba(255,255,255,.44);
      }
      .jx-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #d1a554; box-shadow: 0 0 0 4px rgba(209,165,84,.1); }
      .jx-status-dot.jx-ready { background: #79a555; box-shadow: 0 0 0 4px rgba(121,165,85,.1); }
      .jx-video-status div { display: flex; min-width: 0; flex-direction: column; gap: 2px; }
      .jx-video-status strong { overflow: hidden; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
      .jx-video-status small { overflow: hidden; color: #7a857e; font-size: 7px; text-overflow: ellipsis; white-space: nowrap; }
      .jx-mini-btn {
        padding: 5px 7px;
        border: 1px solid var(--jx-line);
        border-radius: 6px;
        background: transparent;
        color: #69756e;
        font-size: 7px;
        cursor: pointer;
      }
      .jx-source-card, .jx-cue-card, .jx-word-card {
        margin-top: 10px;
        padding: 12px;
        border: 1px solid var(--jx-line);
        border-radius: 13px;
        background: rgba(255,255,255,.42);
      }
      .jx-section-heading, .jx-cue-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 9px;
        color: #69756e;
        font-size: 8px;
      }
      .jx-section-heading span { font-weight: 700; letter-spacing: .05em; }
      .jx-section-heading b { padding: 3px 6px; border-radius: 99px; background: #e6e3d9; color: #78837c; font-size: 7px; font-weight: 600; }
      .jx-section-heading b[data-status="ready"] { background: rgba(201,239,114,.34); color: #51613e; }
      .jx-section-heading b[data-status="error"] { background: #f4dfd6; color: #8a4f38; }
      .jx-source-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
      .jx-source-btn {
        display: grid;
        grid-template-columns: 26px 1fr;
        align-items: center;
        gap: 7px;
        min-height: 46px;
        padding: 7px;
        border: 1px solid var(--jx-line);
        border-radius: 9px;
        background: #fbf9f3;
        color: var(--jx-ink);
        text-align: left;
        cursor: pointer;
      }
      .jx-source-btn:hover { border-color: rgba(21,35,30,.27); }
      .jx-source-btn.jx-primary-soft { background: rgba(201,239,114,.2); }
      .jx-source-btn > span:nth-child(2) { display: flex; min-width: 0; flex-direction: column; gap: 2px; }
      .jx-source-btn strong { font-size: 8px; white-space: nowrap; }
      .jx-source-btn small { overflow: hidden; color: #7b857f; font-size: 6px; text-overflow: ellipsis; white-space: nowrap; }
      .jx-source-symbol { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 6px; background: #e7e4db; font: 700 8px var(--jx-sans); }
      .jx-primary-soft .jx-source-symbol { background: var(--jx-lime); }
      .jx-cue-head > div { display: flex; gap: 3px; }
      .jx-cue-head button {
        display: grid;
        width: 21px;
        height: 21px;
        place-items: center;
        border: 1px solid var(--jx-line);
        border-radius: 50%;
        background: transparent;
        color: #66736b;
        font-size: 12px;
        cursor: pointer;
      }
      .jx-cue-empty { padding: 13px 8px 7px; text-align: center; }
      .jx-cue-empty strong { display: block; font: 600 14px var(--jx-serif); }
      .jx-cue-empty p { margin: 6px 0 0; color: #7b857f; font-size: 8px; line-height: 1.65; }
      .jx-cue-english {
        color: #1b2a23;
        font: 600 16px/1.52 var(--jx-sans);
        letter-spacing: -.01em;
      }
      .jx-word {
        display: inline;
        margin: 0;
        padding: 0;
        border: 0;
        border-radius: 3px;
        background: transparent;
        color: inherit;
        font: inherit;
        line-height: inherit;
        cursor: pointer;
      }
      .jx-word:hover { background: rgba(21,35,30,.08); }
      .jx-word.jx-highlight { color: #7c6b1d; text-decoration: underline; text-decoration-color: #a7c447; text-decoration-thickness: 1.7px; text-underline-offset: 4px; }
      .jx-word.jx-expression.jx-highlight { color: #9b6238; text-decoration-color: #dc9d64; }
      .jx-word.jx-word-active { border-radius: 4px; background: rgba(201,239,114,.35); }
      .jx-translation-row { display: flex; align-items: flex-start; gap: 7px; margin-top: 8px; }
      .jx-translation-row p { margin: 0; flex: 1; color: #66736b; font-size: 9px; line-height: 1.5; }
      .jx-translation-row button {
        flex: 0 0 auto;
        padding: 2px 0;
        border-bottom: 1px dotted #b3bbb4;
        background: transparent;
        color: #728078;
        font-size: 7px;
        cursor: pointer;
      }
      .jx-word-card { position: relative; background: #fff; box-shadow: 0 12px 35px rgba(20,31,26,.07); animation: jx-card-in 160ms ease both; }
      @keyframes jx-card-in { from { opacity: 0; transform: translateX(5px); } to { opacity: 1; transform: none; } }
      .jx-word-top { display: flex; align-items: center; justify-content: space-between; }
      .jx-type-pill { padding: 3px 7px; border-radius: 99px; background: var(--jx-lime); color: #354329; font-size: 7px; font-weight: 700; }
      .jx-word-top button { width: 24px; height: 24px; border-radius: 50%; background: #eeece4; color: #657069; font-size: 13px; cursor: pointer; }
      .jx-word-card h2 { margin: 11px 0 5px; overflow-wrap: anywhere; font: 500 27px/1.15 var(--jx-serif); letter-spacing: -.035em; }
      .jx-word-meta { display: flex; align-items: center; gap: 8px; color: #737f78; font: 11px var(--jx-serif); }
      .jx-audio { padding: 3px 7px; border: 1px solid var(--jx-line); border-radius: 99px; background: transparent; color: #5f6c65; font: 7px var(--jx-sans); cursor: pointer; }
      .jx-meaning-box { margin-top: 12px; padding: 9px 10px; border-radius: 9px; background: rgba(201,239,114,.18); }
      .jx-meaning-box span, .jx-definition-box span, .jx-context-box span { display: block; margin-bottom: 4px; color: #849088; font-size: 6px; font-weight: 700; letter-spacing: .08em; }
      .jx-meaning-box strong { font-size: 9px; line-height: 1.55; }
      .jx-definition-box { margin-top: 8px; }
      .jx-definition-box p { margin: 0; color: #68746d; font-size: 8px; line-height: 1.55; }
      .jx-context-box { margin-top: 9px; padding-left: 9px; border-left: 2px solid #d49a63; }
      .jx-context-box p { margin: 0; font: italic 9px/1.55 var(--jx-serif); }
      .jx-context-box small { display: block; margin-top: 5px; color: #78827c; font-size: 7px; line-height: 1.5; }
      .jx-lookup-actions { display: flex; align-items: center; gap: 7px; margin-top: 10px; }
      .jx-lookup-actions button { padding: 6px 9px; border-radius: 6px; background: #e8e5dc; color: #445149; font-size: 7px; cursor: pointer; }
      .jx-lookup-actions button:disabled { opacity: .6; cursor: wait; }
      .jx-lookup-actions span { color: #929a95; font-size: 6px; line-height: 1.4; }
      .jx-word-actions { display: grid; grid-template-columns: 1fr auto; gap: 5px; margin-top: 10px; }
      .jx-word-actions button { min-height: 31px; padding: 0 9px; border: 1px solid var(--jx-line); border-radius: 7px; background: transparent; color: #59665f; font-size: 8px; cursor: pointer; }
      .jx-word-actions .jx-save-btn { border-color: var(--jx-ink); background: var(--jx-ink); color: #fff; }
      .jx-word-actions .jx-save-btn.jx-saved { border-color: rgba(119,157,81,.35); background: rgba(201,239,114,.24); color: #455539; }
      .jx-word-actions .jx-mastered { background: rgba(201,239,114,.25); color: #485b38; }
      .jx-tip { display: grid; grid-template-columns: 31px 1fr; gap: 9px; margin-top: 10px; padding: 10px; border-radius: 10px; background: #16241e; color: #fff; }
      .jx-tip-index { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid rgba(255,255,255,.13); border-radius: 8px; color: var(--jx-lime); font: 10px var(--jx-serif); }
      .jx-tip strong { font-size: 8px; }
      .jx-tip p { margin: 4px 0 0; color: rgba(255,255,255,.48); font-size: 7px; line-height: 1.55; }
      .jx-pane-title { display: flex; align-items: flex-end; justify-content: space-between; margin: 3px 0 13px; }
      .jx-pane-title span { color: #87928b; font-size: 6px; font-weight: 700; letter-spacing: .13em; }
      .jx-pane-title h2 { margin: 4px 0 0; font: 500 26px var(--jx-serif); letter-spacing: -.035em; }
      .jx-mini-action { padding: 6px 9px; border: 1px solid var(--jx-line); border-radius: 7px; background: transparent; color: #657169; font-size: 7px; cursor: pointer; }
      .jx-search { display: flex; height: 34px; align-items: center; gap: 7px; padding: 0 9px; border: 1px solid var(--jx-line); border-radius: 8px; background: rgba(255,255,255,.48); }
      .jx-search span { color: #8b958e; font-size: 14px; }
      .jx-search input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--jx-ink); font: 8px var(--jx-sans); }
      .jx-library-list { display: flex; flex-direction: column; gap: 7px; margin-top: 10px; }
      .jx-library-item { padding: 10px; border: 1px solid var(--jx-line); border-radius: 10px; background: rgba(255,255,255,.46); }
      .jx-library-item.jx-mastered-card { opacity: .68; }
      .jx-lib-top { display: flex; align-items: center; justify-content: space-between; gap: 7px; }
      .jx-lib-top span { padding: 2px 5px; border-radius: 99px; background: rgba(201,239,114,.35); color: #50603e; font-size: 6px; }
      .jx-lib-top small { overflow: hidden; color: #8a948d; font-size: 6px; text-overflow: ellipsis; white-space: nowrap; }
      .jx-library-item h3 { margin: 8px 0 4px; font: 500 17px var(--jx-serif); letter-spacing: -.02em; }
      .jx-library-item > p { margin: 0; color: #5f6c64; font-size: 8px; line-height: 1.5; }
      .jx-library-item blockquote { display: -webkit-box; margin: 7px 0 0; overflow: hidden; color: #818b85; font: italic 7px/1.5 var(--jx-serif); -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
      .jx-lib-actions { display: flex; align-items: center; gap: 3px; margin-top: 7px; }
      .jx-lib-actions button { display: grid; width: 21px; height: 21px; place-items: center; border-radius: 50%; background: #eae7dd; color: #626f67; font-size: 8px; cursor: pointer; }
      .jx-lib-actions span { margin-left: auto; color: #929a95; font-size: 6px; }
      .jx-library-empty { padding: 50px 16px; text-align: center; }
      .jx-library-empty > span { display: grid; width: 48px; height: 48px; margin: 0 auto 12px; place-items: center; border-radius: 14px; background: #e5e1d6; font: 14px var(--jx-serif); }
      .jx-library-empty strong { display: block; font: 600 17px var(--jx-serif); }
      .jx-library-empty p { margin: 5px 0 0; color: #7b857f; font-size: 8px; }
      .jx-setting-block { margin-bottom: 14px; }
      .jx-setting-block > label { display: block; margin-bottom: 7px; color: #69756e; font-size: 8px; font-weight: 650; }
      .jx-segments { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 3px; border-radius: 8px; background: #e6e2d8; }
      .jx-segments button { height: 29px; border-radius: 6px; background: transparent; color: #6b7770; font-size: 8px; cursor: pointer; }
      .jx-segments button.jx-selected { background: #fff; color: var(--jx-ink); box-shadow: 0 2px 7px rgba(20,31,26,.08); }
      .jx-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 47px; border-top: 1px solid var(--jx-line); }
      .jx-toggle-row span { display: flex; flex-direction: column; gap: 2px; }
      .jx-toggle-row strong { font-size: 8px; }
      .jx-toggle-row small { color: #818b84; font-size: 6px; }
      .jx-toggle-row input { appearance: none; position: relative; width: 35px; height: 20px; flex: 0 0 35px; border-radius: 99px; background: #cfd0c7; cursor: pointer; }
      .jx-toggle-row input::after { content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: 160ms; }
      .jx-toggle-row input:checked { background: var(--jx-ink); }
      .jx-toggle-row input:checked::after { transform: translateX(15px); }
      .jx-diagnostic-actions { display: flex; gap: 6px; margin-top: 13px; }
      .jx-diagnostic {
        max-height: 180px;
        margin: 8px 0 0;
        padding: 9px;
        overflow: auto;
        border: 1px solid var(--jx-line);
        border-radius: 8px;
        background: #18251f;
        color: rgba(255,255,255,.7);
        font: 7px/1.65 "Cascadia Code", "Consolas", monospace;
        white-space: pre-wrap;
      }
      .jx-privacy-note { margin-top: 13px; padding: 10px; border-radius: 9px; background: rgba(201,239,114,.16); }
      .jx-privacy-note strong { font-size: 8px; }
      .jx-privacy-note p { margin: 4px 0 0; color: #68746d; font-size: 7px; line-height: 1.6; }
      .jx-danger-btn { margin-top: 12px; padding: 7px 0; border: 0; border-bottom: 1px dotted #c0aaa0; background: transparent; color: #955d48; font-size: 7px; cursor: pointer; }
      .jx-footer { display: flex; align-items: center; justify-content: space-between; padding: 9px 16px 11px; border-top: 1px solid var(--jx-line); color: #8a948d; font-size: 6px; }
      .jx-footer span { display: flex; align-items: center; gap: 4px; }
      .jx-footer i { width: 4px; height: 4px; border-radius: 50%; background: #84a969; }
      .jx-footer button { padding: 0; border-bottom: 1px dotted #b6bcb6; background: transparent; color: #6b7770; font-size: 6px; cursor: pointer; }
      .jx-video-caption {
        position: fixed;
        z-index: 2147483645;
        padding: 11px 17px;
        border-radius: 10px;
        background: linear-gradient(180deg, rgba(7,14,12,.55), rgba(7,14,12,.82));
        box-shadow: 0 7px 25px rgba(0,0,0,.16);
        text-align: center;
        pointer-events: none;
        backdrop-filter: blur(2px);
      }
      .jx-overlay-english { color: #fff; font: 600 18px/1.45 var(--jx-sans); text-shadow: 0 1px 7px rgba(0,0,0,.85); }
      .jx-overlay-word { pointer-events: auto; text-shadow: inherit; }
      .jx-overlay-word.jx-highlight { color: var(--jx-lime); }
      .jx-overlay-word.jx-expression.jx-highlight { color: #ffd08e; }
      .jx-overlay-chinese { margin-top: 4px; color: rgba(255,255,255,.77); font: 9px/1.5 var(--jx-sans); text-shadow: 0 1px 6px #000; }
      .jx-toast {
        position: absolute;
        right: 25px;
        bottom: 25px;
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
        padding: 6px 13px 6px 7px;
        border-radius: 99px;
        background: #15231e;
        box-shadow: 0 14px 35px rgba(5,17,12,.26);
        color: #fff;
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px);
        transition: 180ms ease;
      }
      .jx-toast.jx-show { opacity: 1; transform: translateY(0); }
      .jx-toast span { display: grid; width: 27px; height: 27px; place-items: center; border-radius: 50%; background: var(--jx-lime); color: #15231e; font-size: 10px; }
      .jx-toast p { margin: 0; font-size: 8px; }
      @media (max-width: 560px) {
        .jx-panel { top: 8px; right: 8px; bottom: 8px; width: calc(100vw - 16px); max-width: none; border-radius: 18px; }
      }

      /* Bright edition */
      .jx-shell {
        --jx-ink: #132052;
        --jx-ink-soft: #65739c;
        --jx-paper: #eaf7ff;
        --jx-paper-light: #fff;
        --jx-lime: #5ce3e9;
        --jx-line: rgba(31, 64, 144, .12);
        --jx-serif: "Segoe UI Variable Text", "Segoe UI", "MiSans", "HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei UI", sans-serif;
        --jx-sans: "Segoe UI Variable Text", "Segoe UI", "MiSans", "HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei UI", sans-serif;
      }
      .jx-panel {
        width: 360px;
        bottom: auto;
        max-height: calc(100vh - 28px);
        border: 1px solid rgba(32,69,145,.12);
        border-radius: 20px;
        background: #f2f8fb;
        box-shadow: 0 12px 32px rgba(32, 69, 154, .14);
      }
      .jx-header {
        padding: 19px 20px 15px;
      }
      .jx-logo {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #2949f4;
        box-shadow: none;
        color: #fff;
        font: 700 14px var(--jx-sans);
        letter-spacing: -.04em;
      }
      .jx-brand strong {
        color: #132052;
        font: 700 16px var(--jx-sans);
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .jx-brand small {
        color: #7c88aa;
        font-size: 6px;
        letter-spacing: .17em;
      }
      .jx-icon-btn {
        width: 31px;
        height: 31px;
        border: 2px solid #fff;
        background: rgba(255,255,255,.75);
        color: #526394;
        box-shadow: 0 6px 15px rgba(54,86,158,.07);
      }
      .jx-icon-btn:hover {
        background: #fff;
        color: #213ed2;
      }
      .jx-tabs {
        gap: 4px;
        margin: 0 16px;
        padding: 4px;
        border: 1px solid rgba(32,69,145,.1);
        border-radius: 10px;
        background: rgba(255,255,255,.58);
      }
      .jx-tab {
        height: 32px;
        border-radius: 9px;
        color: #6b789f;
        font-size: 9px;
        font-weight: 650;
      }
      .jx-tab.jx-active {
        background: #2949f4;
        color: #fff;
        box-shadow: none;
      }
      .jx-tab b {
        color: #dffcff;
      }
      .jx-pane {
        padding: 14px 16px 17px;
        max-height: calc(100vh - 210px);
      }
      .jx-video-status {
        padding: 12px 13px;
        border: 2px solid #fff;
        border-radius: 16px;
        background: rgba(255,255,255,.72);
        box-shadow: 0 8px 22px rgba(40,79,153,.07);
      }
      .jx-status-dot {
        width: 8px;
        height: 8px;
        background: #ff8baa;
        box-shadow: 0 0 0 4px rgba(255,139,170,.14);
      }
      .jx-status-dot.jx-ready {
        background: #46cf9a;
        box-shadow: 0 0 0 4px rgba(70,207,154,.14);
      }
      .jx-video-status strong {
        color: #1b2b64;
        font-size: 9px;
        font-weight: 750;
      }
      .jx-video-status small {
        color: #7c88a9;
      }
      .jx-mini-btn {
        border: 1px solid rgba(39,67,157,.13);
        background: #fff;
        color: #53628c;
        border-radius: 8px;
      }
      .jx-source-card {
        margin-top: 11px;
        padding: 0;
        border: 0;
        background: transparent;
      }
      .jx-section-heading {
        margin: 0 2px 8px;
        color: #596990;
      }
      .jx-section-heading span {
        font-size: 8px;
        font-weight: 800;
        letter-spacing: .07em;
      }
      .jx-section-heading b {
        padding: 4px 8px;
        background: rgba(255,255,255,.65);
        color: #6c7ba3;
      }
      .jx-section-heading b[data-status="ready"] {
        background: #def9ef;
        color: #277455;
      }
      .jx-section-heading b[data-status="error"] {
        background: #ffe0e8;
        color: #9b3f5c;
      }
      .jx-source-actions {
        gap: 8px;
      }
      .jx-source-btn {
        min-height: 56px;
        padding: 8px 9px;
        border: 1px solid rgba(32,69,145,.1);
        border-radius: 10px;
        background: #ffc5d8;
        box-shadow: none;
      }
      .jx-source-btn:hover {
        border-color: #fff;
        transform: translateY(-1px);
        box-shadow: none;
      }
      .jx-source-btn.jx-primary-soft {
        background: #2949f4;
        color: #fff;
        box-shadow: none;
      }
      .jx-source-btn.jx-primary-soft small {
        color: rgba(255,255,255,.66);
      }
      .jx-source-symbol {
        width: 29px;
        height: 29px;
        border-radius: 9px;
        background: rgba(255,255,255,.52);
        color: #5b3b4d;
      }
      .jx-primary-soft .jx-source-symbol {
        background: #68e5eb;
        color: #193579;
      }
      .jx-cue-card {
        position: relative;
        margin-top: 11px;
        padding: 16px;
        overflow: hidden;
        border: 0;
        border-radius: 14px;
        background: #2949f4;
        color: #fff;
        box-shadow: none;
      }
      .jx-cue-card::after {
        display: none;
      }
      .jx-cue-head {
        position: relative;
        z-index: 1;
        color: rgba(255,255,255,.7);
      }
      .jx-cue-head button {
        border-color: rgba(255,255,255,.24);
        background: rgba(255,255,255,.1);
        color: #fff;
      }
      .jx-cue-empty {
        position: relative;
        z-index: 1;
        color: #fff;
      }
      .jx-cue-empty strong {
        font-family: var(--jx-sans);
        font-weight: 750;
      }
      .jx-cue-empty p {
        color: rgba(255,255,255,.62);
      }
      #jx-cue-content {
        position: relative;
        z-index: 1;
      }
      .jx-cue-english {
        color: #fff;
        font: 600 15px/1.52 var(--jx-sans);
        letter-spacing: 0;
      }
      .jx-word.jx-highlight {
        color: #68f1e9;
        text-decoration-color: #68f1e9;
        text-decoration-thickness: 2px;
      }
      .jx-word.jx-expression.jx-highlight {
        color: #ffd38b;
        text-decoration-color: #ffd38b;
      }
      .jx-word.jx-word-active {
        background: rgba(255,255,255,.2);
      }
      .jx-translation-row p {
        color: rgba(255,255,255,.72);
      }
      .jx-translation-row button {
        border-color: rgba(255,255,255,.36);
        color: #fff;
      }
      .jx-word-card {
        margin-top: 11px;
        padding: 15px;
        border: 1px solid #dfe9f0;
        border-radius: 14px;
        background: #fff;
        box-shadow: none;
      }
      .jx-type-pill {
        padding: 4px 9px;
        background: #ffc5d8;
        color: #72334a;
        font-size: 7px;
      }
      .jx-word-top button {
        background: #eef6ff;
        color: #596897;
      }
      .jx-word-card h2 {
        margin-top: 13px;
        color: #15235a;
        font: 650 22px/1.2 var(--jx-sans);
      }
      .jx-word-meta {
        color: #7886aa;
        font-family: var(--jx-sans);
      }
      .jx-audio {
        border-color: rgba(41,69,158,.15);
        background: #edf5ff;
        color: #3853a4;
      }
      .jx-meaning-box {
        padding: 11px;
        border-radius: 13px;
        background: #e8f6ff;
      }
      .jx-meaning-box span, .jx-definition-box span, .jx-context-box span {
        color: #7e8caf;
      }
      .jx-meaning-box strong {
        color: #1c306f;
      }
      .jx-context-box {
        border-left-color: #ff8eae;
      }
      .jx-context-box p {
        color: #344574;
      }
      .jx-lookup-actions button {
        background: #e8eefe;
        color: #2947b1;
      }
      .jx-word-actions .jx-save-btn {
        border-color: #2947e8;
        background: linear-gradient(105deg, #3154fa, #243bd6);
      }
      .jx-word-actions .jx-save-btn.jx-saved {
        border-color: #9adaca;
        background: #dcfaef;
        color: #286d55;
      }
      .jx-word-actions .jx-mastered {
        background: #ffe2ea;
        color: #8e3b58;
      }
      .jx-tip {
        margin-top: 11px;
        padding: 12px;
        border: 1px solid #d5e8ef;
        border-radius: 10px;
        background: #e8f7f9;
        color: #17366f;
        box-shadow: none;
      }
      .jx-tip-index {
        border: 1px solid rgba(28,63,143,.12);
        background: #fff;
        color: #2a4adf;
      }
      .jx-tip strong {
        color: #18356f;
        font-size: 8px;
      }
      .jx-tip p {
        color: #6580a0;
      }
      .jx-pane-title span {
        color: #7a87ac;
      }
      .jx-pane-title h2 {
        color: #16245c;
        font: 650 21px var(--jx-sans);
      }
      .jx-mini-action {
        border: 2px solid #fff;
        background: rgba(255,255,255,.7);
        color: #53648d;
      }
      .jx-search {
        height: 38px;
        border: 2px solid #fff;
        border-radius: 12px;
        background: rgba(255,255,255,.75);
      }
      .jx-library-item {
        padding: 12px;
        border: 1px solid #dfe9f0;
        border-radius: 10px;
        background: #fff;
        box-shadow: none;
      }
      .jx-library-item:nth-child(2n) {
        background: #fff0f5;
      }
      .jx-lib-top span {
        background: #dff8f3;
        color: #2f725b;
      }
      .jx-library-item h3 {
        color: #17265f;
        font: 650 16px var(--jx-sans);
      }
      .jx-library-item blockquote {
        color: #7d8aac;
        font-family: var(--jx-sans);
      }
      .jx-lib-actions button {
        background: #eaf3ff;
        color: #4967bd;
      }
      .jx-library-empty > span {
        background: #dff9fc;
        color: #2444b3;
      }
      .jx-setting-block > label {
        color: #5e6f9b;
      }
      .jx-segments {
        padding: 4px;
        border: 2px solid #fff;
        border-radius: 12px;
        background: rgba(255,255,255,.55);
      }
      .jx-segments button {
        border-radius: 8px;
        color: #65749e;
      }
      .jx-segments button.jx-selected {
        background: #2d4bf2;
        color: #fff;
        box-shadow: 0 6px 14px rgba(45,75,242,.2);
      }
      .jx-toggle-row {
        border-top-color: rgba(34,68,145,.1);
      }
      .jx-toggle-row input:checked {
        background: #2d4bf2;
      }
      .jx-privacy-note {
        border: 2px solid #fff;
        border-radius: 14px;
        background: #fff0f5;
      }
      .jx-diagnostic {
        border-radius: 12px;
        background: #18275d;
      }
      .jx-danger-btn {
        border-bottom-color: #e5a9bc;
        color: #a14461;
      }
      .jx-footer {
        border-top-color: rgba(29,60,133,.1);
        background: rgba(255,255,255,.34);
        color: #8390b0;
      }
      .jx-footer i {
        background: #42ca91;
      }
      .jx-footer button {
        border-bottom-color: #b4bed4;
        color: #697aa2;
      }
      .jx-fab {
        height: 49px;
        gap: 9px;
        padding: 0 16px 0 7px;
        border: 1px solid rgba(255,255,255,.7);
        border-radius: 12px;
        background: #2949f4;
        box-shadow: 0 8px 22px rgba(33,57,190,.18);
        font-size: 12px;
        letter-spacing: .06em;
      }
      .jx-fab-mark {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: #68e5eb;
        color: #173470;
        font: 800 15px var(--jx-sans);
      }
      .jx-video-caption {
        padding: 10px 14px;
        border: 1px solid rgba(255,255,255,.13);
        border-radius: 10px;
        background: rgba(31, 52, 188, .9);
        box-shadow: 0 5px 18px rgba(15,29,111,.22);
      }
      .jx-overlay-english {
        font-size: 17px;
        font-weight: 600;
      }
      .jx-overlay-word.jx-highlight {
        color: #69f2e8;
      }
      .jx-overlay-word.jx-expression.jx-highlight {
        color: #ffd28a;
      }
      .jx-overlay-chinese {
        color: rgba(255,255,255,.74);
      }
      .jx-toast {
        right: 26px;
        bottom: 27px;
        min-height: 43px;
        background: #1e35c7;
        box-shadow: 0 16px 36px rgba(28,48,176,.3);
      }
      .jx-toast span {
        background: #68e5eb;
        color: #173470;
      }
      .jx-toast[data-kind="warning"] {
        background: #6c4613;
      }
      .jx-toast[data-kind="warning"] span {
        background: #ffd38b;
        color: #51340d;
        font-weight: 800;
      }
      .jx-toast[data-kind="error"] {
        background: #7c2f45;
      }
      .jx-toast[data-kind="error"] span {
        background: #ffc3d7;
        color: #652038;
        font-weight: 800;
      }
      @media (max-width: 560px) {
        .jx-panel {
          top: 8px;
          right: 8px;
          bottom: 8px;
          width: calc(100vw - 16px);
          max-width: none;
          max-height: none;
          border-radius: 24px;
        }
        .jx-pane {
          max-height: none;
        }
      }
    `;
  }
})();
