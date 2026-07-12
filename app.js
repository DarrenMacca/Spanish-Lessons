/* ============================================================
   CEFR TRAINER — CLEAN APP.JS (FINAL VERSION)
   ============================================================ */

/* ------------------------------------------------------------
   CATEGORY GROUPING
------------------------------------------------------------ */
function groupByCategory(words) {
    const out = {};
    words.forEach(w => {
        if (!out[w.category]) out[w.category] = [];
        out[w.category].push(w);
    });
    return out;
}

/* ------------------------------------------------------------
   CEFR LEVEL BANKS
------------------------------------------------------------ */
const CEFR_LEVELS = {
    A1: A1_WORDS,
    A2: A2_WORDS,
    B1: B1_WORDS,
    B2: B2_WORDS
};

/* ------------------------------------------------------------
   APP STATE
------------------------------------------------------------ */
const STORAGE_KEY = "cefr_trainer_state_v2";

let appState = {
    currentLevel: "A1",
    speechRate: 1.0,
    studentName: "",
    badges: [],
    levelStats: {
        A1: { listens: 0, flashSeen: 0, quiz: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 },
        A2: { listens: 0, flashSeen: 0, quiz: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 },
        B1: { listens: 0, flashSeen: 0, quiz: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 },
        B2: { listens: 0, flashSeen: 0, quiz: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 }
    }
};

/* ------------------------------------------------------------
   CATEGORY AUTO‑ASSIGNER
------------------------------------------------------------ */
function autoAssignCategory(word) {
    const w = word.spanish.toLowerCase();

    if (w.endsWith("ar") || w.endsWith("er") || w.endsWith("ir")) return "verbs";
    if (w.endsWith("o") || w.endsWith("a") || w.endsWith("os") || w.endsWith("as")) return "adjectives";
    if (!isNaN(parseInt(w))) return "numbers";

    if (["manzana","pan","agua","carne","café","té","huevo","cerveza","vino","arroz","pollo","pescado","ensalada","verdura","fruta"].includes(w))
        return "food-drink";

    if (["aeropuerto","hotel","taxi","tren","avión","billete","mapa","ciudad","país","viaje","turista"].includes(w))
        return "travel";

    if (["mañana","tarde","noche","casa","trabajo","escuela","día","semana","mes"].includes(w))
        return "daily-life";

    if (["madre","padre","hermano","hermana","abuelo","abuela","tío","tía","primo","prima","familia"].includes(w))
        return "family";

    if (["dinero","precio","tienda","comprar","vender","mercado","producto"].includes(w))
        return "shopping";

    if (["ayuda","policía","hospital","ambulancia","fuego","emergencia"].includes(w))
        return "emergency";

    if (["trabajo","oficina","jefe","empleado","empresa","reunión"].includes(w))
        return "work";

    if (["casa","escuela","parque","calle","puerta","mesa","silla","coche","habitacion","baño"].includes(w))
        return "places-objects";

    if (["y","pero","porque","aunque","cuando","si","o","entonces","luego","después","antes"].includes(w))
        return "connectors";

    if (["el","la","los","las","un","una","unos","unas","yo","tú","él","ella","nosotros","vosotros","ellos"].includes(w))
        return "grammar";

    return "daily-life";
}

/* ------------------------------------------------------------
   APPLY CATEGORIES
------------------------------------------------------------ */
Object.keys(CEFR_LEVELS).forEach(level => {
    CEFR_LEVELS[level] = CEFR_LEVELS[level].map(w => ({
        ...w,
        category: w.category || autoAssignCategory(w)
    }));
});

/* ------------------------------------------------------------
   STATE LOAD / SAVE
------------------------------------------------------------ */
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) Object.assign(appState, JSON.parse(raw));
    } catch (e) {
        console.error("State load error:", e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("State save error:", e);
    }
}

/* ------------------------------------------------------------
   SPEECH SYNTHESIS
------------------------------------------------------------ */
function speakSpanish(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = appState.speechRate;

    speechSynthesis.speak(u);
}

/* ------------------------------------------------------------
   LEVEL SELECTOR
------------------------------------------------------------ */
function setLevel(level) {
    if (!CEFR_LEVELS[level]) return;

    appState.currentLevel = level;
    saveState();

    document.querySelectorAll(".level-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.level === level);
    });

    activateTab(currentTab);
}

/* ------------------------------------------------------------
   TAB SYSTEM
------------------------------------------------------------ */
const TABS = [
    "dashboard",
    "listen",
    "flash",
    "quiz",
    "build",
    "sentence",
    "conversation",
    "grammar"
];

let currentTab = "dashboard";

function activateTab(tabName) {
    if (!TABS.includes(tabName)) return;
    currentTab = tabName;

    TABS.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.classList.add("hidden");
    });

    const activePanel = document.getElementById(tabName);
    if (activePanel) activePanel.classList.remove("hidden");

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    switch (tabName) {
        case "listen":        renderListenTab(); break;
        case "flash":         renderFlashcardsTab(); break;
        case "quiz":          renderQuizTab(); break;
        case "build":         renderBuildTab(); break;
        case "sentence":      renderSentenceTab(); break;
        case "conversation":  renderConversationTab(); break;
        case "grammar":       renderGrammarTab(); break;
        case "dashboard":     break;
    }
}

function initTabNavigation() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => activateTab(btn.dataset.tab));
    });
}

/* ============================================================
   LISTEN TAB — CATEGORY + AUDIO PLAYER + CLEAN UI
   ============================================================ */

let listenAutoPlay = {
    active: false,
    paused: false,
    index: 0,
    list: []
};

function renderListenTab() {
    const container = document.getElementById("listen-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Listen — Level ${appState.currentLevel}</h2>
            <p>Tap a category, then click a word pill to hear it.</p>

            <div class="listen-player-controls" style="
                display:flex;
                gap:6px;
                flex-wrap:wrap;
                margin-top:6px;
                justify-content:flex-start;
            ">
                <button class="word-pill" id="listen-playall">Play All</button>
                <button class="word-pill" id="listen-pause">Pause</button>
                <button class="word-pill" id="listen-resume">Resume</button>
                <button class="word-pill" id="listen-stop">Stop</button>
            </div>
        </div>
    `;

    /* ============================================================
       CATEGORY LIST
       ============================================================ */
    Object.keys(grouped).forEach(cat => {
        html += `
        <div class="glass-panel">
            <div class="listen-category-header" data-cat="${cat}">
                <span class="listen-category-title">${cat.toUpperCase()}</span>
                <span class="listen-arrow">▶</span>
            </div>

            <div class="listen-category-content" data-cat="${cat}">
                <div class="listen-grid" style="
                    display:grid;
                    grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));
                    gap:6px;
                    margin-top:8px;
                ">
                    ${grouped[cat].map(w => `
                        <button class="word-pill" data-spanish="${w.spanish}">
                            ${w.english}
                            <span style="opacity:0.7;">(${w.spanish})</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    /* ============================================================
       CATEGORY COLLAPSE
       ============================================================ */
    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.listen-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ============================================================
       SINGLE WORD PLAYBACK
       ============================================================ */
    container.querySelectorAll(".word-pill").forEach(btn => {
        btn.addEventListener("click", () => {
            speakSpanish(btn.dataset.spanish);
            appState.levelStats[appState.currentLevel].listens++;
            saveState();
            updateBadges();
            updateProgressMeters();
        });
    });

    /* ============================================================
       AUTO PLAY — PLAY ALL WORDS
       ============================================================ */
    listenAutoPlay.list = words.map(w => w.spanish);

    document.getElementById("listen-playall").onclick = () => {
        listenAutoPlay.active = true;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        playNextListenWord();
    };

    document.getElementById("listen-pause").onclick = () => {
        listenAutoPlay.paused = true;
        if (speechSynthesis.pause) speechSynthesis.pause();
    };

    document.getElementById("listen-resume").onclick = () => {
        listenAutoPlay.paused = false;
        if (speechSynthesis.resume) speechSynthesis.resume();
        playNextListenWord();
    };

    document.getElementById("listen-stop").onclick = () => {
        listenAutoPlay.active = false;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        if (speechSynthesis.cancel) speechSynthesis.cancel();
    };
}

/* ============================================================
   AUTO PLAY ENGINE
   ============================================================ */
function playNextListenWord() {
    if (!listenAutoPlay.active || listenAutoPlay.paused) return;

    const list = listenAutoPlay.list;
    if (listenAutoPlay.index >= list.length) {
        listenAutoPlay.active = false;
        return;
    }

    const word = list[listenAutoPlay.index];
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "es-ES";
    utter.rate = appState.speechRate;

    utter.onend = () => {
        if (!listenAutoPlay.paused) {
            listenAutoPlay.index++;
            setTimeout(playNextListenWord, 500);
        }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

/* ============================================================
   FLASHCARDS — CATEGORY GROUPED + FLIP + AUDIO (A1–B2)
   ============================================================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    let html = `
        <div class="glass-panel">
            <h2>Flashcards — Level ${appState.currentLevel}</h2>
            <p>Tap a card to flip. Spanish side plays audio.</p>
        </div>
    `;

    Object.keys(grouped).forEach(cat => {
        html += `
        <div class="glass-panel">
            <div class="listen-category-header" data-cat="${cat}">
                <span class="listen-category-title">${cat.toUpperCase()}</span>
                <span class="listen-arrow">▶</span>
            </div>

            <div class="flash-category-content" data-cat="${cat}">
                <div class="fc-grid">
                    ${grouped[cat].map(item => `
                        <div class="fc-card">
                            <div class="fc-inner">
                                <div class="fc-front word-pill">
                                    ${item.english}
                                </div>
                                <div class="fc-back word-pill">
                                    ${item.spanish}
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    /* CATEGORY COLLAPSE */
    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* FLASHCARD FLIP + AUDIO */
    container.querySelectorAll(".fc-card").forEach(card => {
        card.addEventListener("click", () => {
            const inner = card.querySelector(".fc-inner");
            const flipped = inner.classList.toggle("fc-flipped");

            const spanish = inner.querySelector(".fc-back").textContent.trim();

            if (flipped) {
                speakSpanish(spanish);
                appState.levelStats[appState.currentLevel].flashSeen++;
                saveState();
                updateBadges();
                updateProgressMeters();
            } else {
                speechSynthesis.cancel();
            }
        });
    });
}

/* ============================================================
   QUIZ TAB — MULTIPLE CHOICE (A1–B2)
   ============================================================ */

const QUIZ_STATE = {
    level: appState.currentLevel,
    question: null,
    options: [],
    correct: null,
    selected: null,
    score: 0,
    total: 0,
};

/* BUILD QUIZ QUESTION */
function buildQuizQuestion(level, harder = false) {
    const words = CEFR_LEVELS[level];

    const pool = harder ? words.slice(Math.floor(words.length * 0.5)) : words;

    const correctItem = pool[Math.floor(Math.random() * pool.length)];

    const wrong = [];
    while (wrong.length < 3) {
        const w = pool[Math.floor(Math.random() * pool.length)];
        if (w.spanish !== correctItem.spanish && !wrong.includes(w)) {
            wrong.push(w);
        }
    }

    const options = [...wrong, correctItem].sort(() => Math.random() - 0.5);

    return {
        english: correctItem.english,
        correct: correctItem.spanish,
        options: options.map(o => o.spanish),
    };
}

/* RENDER QUIZ TAB */
function renderQuizTab() {
    QUIZ_STATE.level = appState.currentLevel;

    const meta = document.getElementById("qb-meta");
    const questionBox = document.getElementById("qb-question");
    const grid = document.getElementById("qb-grid");
    const answerBox = document.getElementById("qb-answer");
    const feedback = document.getElementById("qb-feedback");

    const q = buildQuizQuestion(QUIZ_STATE.level);
    QUIZ_STATE.question = q.english;
    QUIZ_STATE.options = q.options;
    QUIZ_STATE.correct = q.correct;
    QUIZ_STATE.selected = null;

    meta.innerHTML = `<h2>Quiz — Level ${QUIZ_STATE.level}</h2>`;
    questionBox.innerHTML = `<div class="glass-panel"><h3>Translate: <span>${q.english}</span></h3></div>`;
    answerBox.innerHTML = ``;
    feedback.innerHTML = ``;

    grid.innerHTML = "";
    QUIZ_STATE.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "word-pill";
        btn.textContent = opt;

        btn.addEventListener("click", () => {
            QUIZ_STATE.selected = opt;
            answerBox.innerHTML = `<div class="glass-panel">Selected: <strong>${opt}</strong></div>`;
        });

        grid.appendChild(btn);
    });

    /* SUBMIT */
    document.getElementById("qb-submit").onclick = () => {
        if (!QUIZ_STATE.selected) {
            feedback.innerHTML = `<div class="glass-panel">Choose an answer first.</div>`;
            return;
        }

        QUIZ_STATE.total++;

        if (QUIZ_STATE.selected === QUIZ_STATE.correct) {
            QUIZ_STATE.score++;
            feedback.innerHTML = `<div class="glass-panel" style="color:#22c55e;">Correct!</div>`;
        } else {
            feedback.innerHTML = `
                <div class="glass-panel" style="color:#ef4444;">
                    Incorrect — correct answer: <strong>${QUIZ_STATE.correct}</strong>
                </div>`;
        }

        updateQuizProgress();
    };

    /* NEXT QUESTION */
    document.getElementById("qb-next").onclick = () => {
        renderQuizTab();
    };

    /* HARDER MODE */
    document.getElementById("qb-harder").onclick = () => {
        const q2 = buildQuizQuestion(QUIZ_STATE.level, true);
        QUIZ_STATE.question = q2.english;
        QUIZ_STATE.options = q2.options;
        QUIZ_STATE.correct = q2.correct;
        QUIZ_STATE.selected = null;

        questionBox.innerHTML = `<div class="glass-panel"><h3>Translate: <span>${q2.english}</span></h3></div>`;
        answerBox.innerHTML = ``;
        feedback.innerHTML = ``;

        grid.innerHTML = "";
        QUIZ_STATE.options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "word-pill";
            btn.textContent = opt;

            btn.addEventListener("click", () => {
                QUIZ_STATE.selected = opt;
                answerBox.innerHTML = `<div class="glass-panel">Selected: <strong>${opt}</strong></div>`;
            });

            grid.appendChild(btn);
        });
    };
}

/* UPDATE QUIZ PROGRESS TILE */
function updateQuizProgress() {
    const percent = Math.round((QUIZ_STATE.score / QUIZ_STATE.total) * 100);

    document.getElementById("quiz-number").textContent = `${percent}%`;
    document.getElementById("quiz-progress").style.width = `${percent}%`;

    appState.levelStats[appState.currentLevel].quiz = percent;
    saveState();
    updateBadges();
}

/* ============================================================
   BUILD TAB — FULL LOGIC
   ============================================================ */

function renderBuildTab() {
    const container = document.getElementById("build-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const categories = groupByCategory(words);

    const catNames = Object.keys(categories);
    const chosenCat = catNames[Math.floor(Math.random() * catNames.length)];
    const catWords = categories[chosenCat];

    const shuffled = [...catWords].sort(() => Math.random() - 0.5);
    const w1 = shuffled[0];
    const w2 = shuffled[1];

    const correctSentence = `${w1.spanish} y ${w2.spanish}`;
    const correctTokens = correctSentence.split(" ");

    const distractors = [...catWords]
        .filter(x => !correctTokens.includes(x.spanish))
        .slice(0, 3)
        .map(x => x.spanish);

    const gridTokens = [...correctTokens, ...distractors].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div id="build-builder">
            <div id="bb-meta">Category: ${chosenCat}</div>
            <div id="bb-english">${w1.english} and ${w2.english}</div>
            <div id="bb-grid" class="sb-grid">
                ${gridTokens.map(t => `<button class="secondary-btn bb-tok" data-tok="${t}">${t}</button>`).join("")}
            </div>
            <div id="bb-answer"></div>
            <div id="bb-feedback"></div>
            <div class="sb-controls">
                <button id="bb-submit">Check</button>
                <button id="bb-next">Next</button>
                <button id="bb-harder">Harder</button>
            </div>
        </div>
    `;

    const selected = [];

    document.querySelectorAll(".bb-tok").forEach(btn => {
        btn.onclick = () => {
            selected.push(btn.dataset.tok);
            btn.disabled = true;
            btn.style.opacity = "0.5";
            document.getElementById("bb-answer").textContent = selected.join(" ");
        };
    });

    document.getElementById("bb-submit").onclick = () => {
        const user = selected.join(" ");
        const fb = document.getElementById("bb-feedback");

        if (user === correctSentence) {
            fb.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].buildCompleted++;
        } else {
            fb.textContent = `Incorrect. Correct answer: ${correctSentence}`;
        }

        saveState();
        updateProgressMeters();
    };

    document.getElementById("bb-next").onclick = renderBuildTab;
    document.getElementById("bb-harder").onclick = () => {
        appState.currentLevel = "B1";
        renderBuildTab();
    };
}

/* ============================================================
   SENTENCE TAB — FULL SMART BUILDER LOGIC (OPTION A)
   ============================================================ */

function renderSentenceTab() {
    const container = document.getElementById("sentence-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const categories = groupByCategory(words);

    const catNames = Object.keys(categories);
    const chosenCat = catNames[Math.floor(Math.random() * catNames.length)];
    const catWords = categories[chosenCat];

    const shuffled = [...catWords].sort(() => Math.random() - 0.5);
    const w1 = shuffled[0];
    const w2 = shuffled[1];

    const correctSentence = `${w1.spanish} y ${w2.spanish}`;
    const correctTokens = correctSentence.split(" ");

    const distractors = [...catWords]
        .filter(x => !correctTokens.includes(x.spanish))
        .slice(0, 3)
        .map(x => x.spanish);

    const gridTokens = [...correctTokens, ...distractors].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div id="sentence-builder">
            <div id="sb-meta">Category: ${chosenCat}</div>
            <div id="sb-english">${w1.english} and ${w2.english}</div>
            <div id="sb-grid" class="sb-grid">
                ${gridTokens.map(t => `<button class="secondary-btn sb-tok" data-tok="${t}">${t}</button>`).join("")}
            </div>
            <div id="sb-answer"></div>
            <div id="sb-feedback"></div>
            <div class="sb-controls">
                <button id="sb-submit">Check</button>
                <button id="sb-next">Next</button>
                <button id="sb-harder">Harder</button>
            </div>
        </div>
    `;

    const selected = [];

    document.querySelectorAll(".sb-tok").forEach(btn => {
        btn.onclick = () => {
            selected.push(btn.dataset.tok);
            btn.disabled = true;
            btn.style.opacity = "0.5";
            document.getElementById("sb-answer").textContent = selected.join(" ");
        };
    });

    document.getElementById("sb-submit").onclick = () => {
        const user = selected.join(" ");
        const fb = document.getElementById("sb-feedback");

        if (user === correctSentence) {
            fb.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].sentenceCompleted =
                (appState.levelStats[appState.currentLevel].sentenceCompleted || 0) + 1;
        } else {
            fb.textContent = `Incorrect. Correct answer: ${correctSentence}`;
        }

        saveState();
        updateProgressMeters();
    };

    document.getElementById("sb-next").onclick = renderSentenceTab;
    document.getElementById("sb-harder").onclick = () => {
        appState.currentLevel = "B1";
        renderSentenceTab();
    };
}

/* ============================================================
   CONVERSATION TAB — FULL LOGIC
   ============================================================ */

function renderConversationTab() {
    const container = document.getElementById("conversation-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const categories = groupByCategory(words);

    const catNames = Object.keys(categories);
    const chosenCat = catNames[Math.floor(Math.random() * catNames.length)];
    const catWords = categories[chosenCat];

    const shuffled = [...catWords].sort(() => Math.random() - 0.5);
    const w1 = shuffled[0];
    const w2 = shuffled[1];

    const prompt = `Respond using: ${w1.english}, ${w2.english}`;
    const correctSentence = `${w1.spanish} y ${w2.spanish}`;
    const correctTokens = correctSentence.split(" ");

    const distractors = [...catWords]
        .filter(x => !correctTokens.includes(x.spanish))
        .slice(0, 3)
        .map(x => x.spanish);

    const gridTokens = [...correctTokens, ...distractors].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div id="conversation-builder">
            <div id="cb-meta">Category: ${chosenCat}</div>
            <div id="cb-prompt">${prompt}</div>
            <div id="cb-grid" class="sb-grid">
                ${gridTokens.map(t => `<button class="secondary-btn cb-tok" data-tok="${t}">${t}</button>`).join("")}
            </div>
            <div id="cb-answer"></div>
            <div id="cb-feedback"></div>
            <div class="sb-controls">
                <button id="cb-submit">Check</button>
                <button id="cb-next">Next</button>
                <button id="cb-harder">Harder</button>
            </div>
        </div>
    `;

    const selected = [];

    document.querySelectorAll(".cb-tok").forEach(btn => {
        btn.onclick = () => {
            selected.push(btn.dataset.tok);
            btn.disabled = true;
            btn.style.opacity = "0.5";
            document.getElementById("cb-answer").textContent = selected.join(" ");
        };
    });

    document.getElementById("cb-submit").onclick = () => {
        const user = selected.join(" ");
        const fb = document.getElementById("cb-feedback");

        if (user === correctSentence) {
            fb.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].conversationCompleted =
                (appState.levelStats[appState.currentLevel].conversationCompleted || 0) + 1;
        } else {
            fb.textContent = `Incorrect. Correct answer: ${correctSentence}`;
        }

        saveState();
        updateProgressMeters();
    };

    document.getElementById("cb-next").onclick = renderConversationTab;
    document.getElementById("cb-harder").onclick = () => {
        appState.currentLevel = "B1";
        renderConversationTab();
    };
}

/* ============================================================
   GRAMMAR TAB
   ============================================================ */

function renderGrammarTab() {
    const container = document.getElementById("grammar-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Grammar — Level ${appState.currentLevel}</h2>
            <p>Breakdown of word types you're training.</p>
        </div>

        <div class="glass-panel quiz-card">
            <ul>
                ${Object.keys(grouped).map(cat => `
                    <li><strong>${cat}</strong>: ${grouped[cat].length} items</li>
                `).join("")}
            </ul>
            <p style="margin-top:10px;opacity:0.8;">Notice how connectors, verbs, adjectives and nouns combine.</p>
        </div>
    `;
}

/* ============================================================
   BADGES
   ============================================================ */

function updateBadges() {
    const list = document.getElementById("badge-list");
    const badges = new Set(appState.badges);

    Object.keys(appState.levelStats).forEach(level => {
        const s = appState.levelStats[level];
        if (s.listens >= 20) badges.add(`${level} Listener`);
        if (s.flashSeen >= 30) badges.add(`${level} Flash Master`);
        if (s.quiz >= 80) badges.add(`${level} Quiz Ace`);
        if (s.buildCompleted >= 10) badges.add(`${level} Builder`);
        if (s.sentenceCompleted >= 10) badges.add(`${level} Sentence Pro`);
        if (s.conversationCompleted >= 10) badges.add(`${level} Conversationalist`);
    });

    appState.badges = Array.from(badges);
    saveState();

    if (appState.badges.length === 0) {
        list.innerHTML = "<li>No badges yet. Keep training!</li>";
        return;
    }

    list.innerHTML = appState.badges.map(b => `<li>${b}</li>`).join("");
}

/* ============================================================
   STUDENT NAME BOX
   ============================================================ */

function initNameBox() {
    const input = document.getElementById("student-name");
    const btn = document.getElementById("save-name-btn");
    const status = document.getElementById("name-status");

    input.value = appState.studentName || "";

    btn.onclick = () => {
        const name = input.value.trim();
        if (!name) {
            status.textContent = "Please enter a name.";
            return;
        }
        appState.studentName = name;
        saveState();
        status.textContent = `Saved as "${name}".`;
    };
}

/* ============================================================
   SPEECH RATE CONTROL
   ============================================================ */

function initRateControl() {
    const slider = document.getElementById("rate");
    slider.value = appState.speechRate;

    slider.oninput = () => {
        appState.speechRate = parseFloat(slider.value);
        saveState();
    };
}

/* ============================================================
   PROGRESS METER CONTROLLER
   ============================================================ */

function animateNumber(id, target) {
    let current = 0;
    const step = target / 40;

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        document.getElementById(id).textContent = Math.round(current) + "%";
    }, 20);
}

function updateProgressMeters() {

    // New bar widths
    document.getElementById("quiz-progress").style.width = "60%";
    document.getElementById("build-progress").style.width = "45%";
    document.getElementById("sentence-progress").style.width = "30%";

    // Existing bar widths
    document.getElementById("xp-progress").style.width = "70%";
    document.getElementById("streak-progress").style.width = "40%";
    document.getElementById("score-progress").style.width = "85%";
    document.getElementById("review-progress").style.width = "20%";

    // New animated numbers
    animateNumber("quiz-number", 60);
    animateNumber("build-number", 45);
    animateNumber("sentence-number", 30);

    // Existing animated numbers
    animateNumber("xp-number", 70);
    animateNumber("streak-number", 40);
    animateNumber("score-number", 85);
    animateNumber("review-number", 20);

    // Pulse animations
    pulseTile("quiz-tile");
    pulseTile("build-tile");
    pulseTile("sentence-tile");
    pulseTile("xp-tile");
    pulseTile("streak-tile");
    pulseTile("score-tile");
    pulseTile("review-tile");
}

function pulseTile(id) {
    const tile = document.getElementById(id);
    if (!tile) return;

    tile.classList.remove("pulse");
    void tile.offsetWidth;
    tile.classList.add("pulse");
}

/* ============================================================
   STARTUP
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadState();

    initTabNavigation();
    activateTab("dashboard");

    initRateControl();
    initNameBox();

    updateBadges();
    updateProgressMeters();
});

