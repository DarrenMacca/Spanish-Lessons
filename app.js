/* ============================================================
   CEFR TRAINER — CLEAN APP.JS (PART 1)
   ============================================================ */
function groupByCategory(words) {
    const out = {};
    words.forEach(w => {
        if (!out[w.category]) out[w.category] = [];
        out[w.category].push(w);
    });
    return out;
}


const CEFR_LEVELS = {
    A1: A1_WORDS,
    A2: A2_WORDS,
    B1: B1_WORDS,
    B2: B2_WORDS
};

const STORAGE_KEY = "cefr_trainer_state_v2";

let appState = {
    currentLevel: "A1",
    speechRate: 1.0,
    studentName: "",
    badges: [],
    levelStats: {
        A1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        A2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        B1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        B2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 }
    }
};

/* ============================================================
   CATEGORY AUTO‑ASSIGNER — PLACE HERE
   ============================================================ */

function autoAssignCategory(word) {
    const w = word.spanish.toLowerCase();

    // Verbs (infinitives)
    if (w.endsWith("ar") || w.endsWith("er") || w.endsWith("ir"))
        return "verbs";

    // Adjectives
    if (w.endsWith("o") || w.endsWith("a") || w.endsWith("os") || w.endsWith("as"))
        return "adjectives";

    // Numbers
    if (!isNaN(parseInt(w)))
        return "numbers";

    // Food & drink
    if (["manzana","pan","agua","carne","café","té","huevo","cerveza","vino","arroz","pollo","pescado","ensalada","verdura","fruta"].includes(w))
        return "food-drink";

    // Travel
    if (["aeropuerto","hotel","taxi","tren","avión","billete","mapa","ciudad","país","viaje","turista"].includes(w))
        return "travel";

    // Daily life
    if (["mañana","tarde","noche","casa","trabajo","escuela","día","semana","mes"].includes(w))
        return "daily-life";

    // Family
    if (["madre","padre","hermano","hermana","abuelo","abuela","tío","tía","primo","prima","familia"].includes(w))
        return "family";

    // Shopping
    if (["dinero","precio","tienda","comprar","vender","mercado","producto"].includes(w))
        return "shopping";

    // Emergency
    if (["ayuda","policía","hospital","ambulancia","fuego","emergencia"].includes(w))
        return "emergency";

    // Work
    if (["trabajo","oficina","jefe","empleado","empresa","reunión"].includes(w))
        return "work";

    // Places / objects
    if (["casa","escuela","parque","calle","puerta","mesa","silla","coche","habitacion","baño"].includes(w))
        return "places-objects";

    // Connectors
    if (["y","pero","porque","aunque","cuando","si","o","entonces","luego","después","antes"].includes(w))
        return "connectors";

    // Grammar words
    if (["el","la","los","las","un","una","unos","unas","yo","tú","él","ella","nosotros","vosotros","ellos"].includes(w))
        return "grammar";

    return "daily-life";
}

/* ============================================================
   APPLY CATEGORIES TO ALL CEFR LEVELS — PLACE HERE
   ============================================================ */

Object.keys(CEFR_LEVELS).forEach(level => {
    CEFR_LEVELS[level] = CEFR_LEVELS[level].map(w => ({
        ...w,
        category: w.category || autoAssignCategory(w)
    }));
});

/* ============================================================
   STATE LOAD / SAVE
   ============================================================ */
function loadState() {
    try {
        raw = localStorage.getItem(STORAGE_KEY);
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

/* ============================================================
   SPEECH SYNTHESIS
   ============================================================ */
function speakSpanish(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = appState.speechRate;

    window.speechSynthesis.speak(u);
}

/* ============================================================
   LEVEL SELECTOR
   ============================================================ */
function setLevel(level) {
    if (!CEFR_LEVELS[level]) return;

    appState.currentLevel = level;
    saveState();

    document.querySelectorAll(".level-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.level === level);
    });

    activateTab(currentTab);
}

/* ============================================================
   TAB SYSTEM — FINAL CLEAN VERSION
   ============================================================ */

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

/* ============================================================
   ACTIVATE TAB
   ============================================================ */
function activateTab(tabName) {
    if (!TABS.includes(tabName)) return;
    currentTab = tabName;

    // Hide all tabs
    TABS.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.classList.add("hidden");
    });

    // Show active tab
    const activePanel = document.getElementById(tabName);
    if (activePanel) activePanel.classList.remove("hidden");

    // Update nav button highlight
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Load dynamic content
    switch (tabName) {
        case "listen":
            renderListenTab();
            break;

        case "flash":
            renderFlashcardsTab();
            break;

        case "quiz":
            renderQuizTab();
            break;

        case "build":
            renderBuildTab();
            break;

        case "sentence":
            renderSentenceTab();
            break;

        case "conversation":
            renderConversationTab();
            break;

        case "grammar":
            renderGrammarTab();
            break;

        case "dashboard":
            // static
            break;
    }
}

/* ============================================================
   TAB NAVIGATION WIRING
   ============================================================ */
function initTabNavigation() {
    const buttons = document.querySelectorAll(".tab-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            activateTab(tab);
        });
    });
}

// Initialize navigation + default tab
initTabNavigation();
activateTab("dashboard");




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
   FLASHCARDS — CATEGORY GROUPED + FLIP + AUDIO (STABLE VERSION)
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
                                <div class="fc-front word-pill">${item.english}</div>
                                <div class="fc-back word-pill">${item.spanish}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

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
   SHARED QUIZ / BUILD / SENTENCE / CONVERSATION STATE
   ============================================================ */

let quizState = {
    currentWord: null,
    options: [],
    harderMode: false,
    selected: null
};

let buildState = {
    currentWord: null,
    tokens: []
};

let sentenceState = {
    currentSentence: null,
    tokens: []
};

let convoState = {
    currentPrompt: null,
    tokens: []
};

function generateQuizOptions(words, correctWord) {
    let opts = [correctWord.spanish];
    const count = quizState.harderMode ? 5 : 3;

    while (opts.length < count) {
        const w = words[Math.floor(Math.random() * words.length)];
        if (!opts.includes(w.spanish)) opts.push(w.spanish);
    }

    return opts.sort(() => Math.random() - 0.5);
}

/* ============================================================
   QUIZ TAB — RENDER + EVENTS
   ============================================================ */

function renderQuizTab() {
    const container = document.getElementById("quiz-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    quizState.currentWord = words[Math.floor(Math.random() * words.length)];
    quizState.options = generateQuizOptions(words, quizState.currentWord);
    quizState.selected = null;

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Quiz — Level ${appState.currentLevel}</h2>
            <p>Select the correct Spanish for the English word.</p>

            <div id="qb-meta"><strong>English:</strong> ${quizState.currentWord.english}</div>

            <div id="qb-grid" class="sb-grid">
                ${quizState.options.map(opt => `
                    <button class="word-pill qb-opt" data-spanish="${opt}">${opt}</button>
                `).join("")}
            </div>

            <div id="qb-answer"></div>
            <div id="qb-feedback"></div>

            <div class="sb-controls">
                <button id="qb-submit">Check</button>
                <button id="qb-next">Next</button>
                <button id="qb-harder" class="${quizState.harderMode ? "active" : ""}">Harder</button>
            </div>
        </div>
    `;

    setupQuizEvents();
}

function setupQuizEvents() {
    const grid = document.getElementById("qb-grid");
    const submitBtn = document.getElementById("qb-submit");
    const nextBtn = document.getElementById("qb-next");
    const harderBtn = document.getElementById("qb-harder");
    const feedback = document.getElementById("qb-feedback");
    const answerBox = document.getElementById("qb-answer");

    quizState.selected = null;

    grid.querySelectorAll(".qb-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".qb-opt").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            quizState.selected = btn.dataset.spanish;
            answerBox.textContent = quizState.selected;
        });
    });

    submitBtn.addEventListener("click", () => {
        if (!quizState.selected) {
            feedback.textContent = "Choose an answer first.";
            return;
        }

        const correct = quizState.currentWord.spanish;

        if (quizState.selected === correct) {
            feedback.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].quizScore++;
            updateBadges();
            updateProgressMeters();
        } else {
            feedback.textContent = `Incorrect — correct answer: ${correct}`;
        }

        // ⭐ Sabina speaks the correct Spanish answer (with delay)
        setTimeout(() => speakQuizIncorrect(correct), 300);

        saveState();
    });
}



    nextBtn.addEventListener("click", () => renderQuizTab());

    harderBtn.addEventListener("click", () => {
        quizState.harderMode = !quizState.harderMode;
        harderBtn.classList.toggle("active", quizState.harderMode);
        renderQuizTab();
    });
}


/* ============================================================
   BUILD TAB — RENDER + EVENTS
   ============================================================ */

function renderBuildTab() {
    const container = document.getElementById("build-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    buildState.currentWord = words[Math.floor(Math.random() * words.length)];
    buildState.tokens = buildState.currentWord.spanish.split(" ");
    const shuffled = [...buildState.tokens].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Build — Level ${appState.currentLevel}</h2>
            <p>Tap the words in the correct order to build the Spanish phrase.</p>

            <div id="bb-meta">
                <strong>English:</strong> ${buildState.currentWord.english}
            </div>

            <div id="bb-grid" class="sb-grid">
                ${shuffled.map(t => `
                    <button class="bb-token" data-token="${t}">
                        ${t}
                    </button>
                `).join("")}
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

    setupBuildEvents();
}

function setupBuildEvents() {
    const answerBox = document.getElementById("bb-answer");
    const submitBtn = document.getElementById("bb-submit");
    const nextBtn = document.getElementById("bb-next");
    const harderBtn = document.getElementById("bb-harder");
    const feedback = document.getElementById("bb-feedback");

    let answer = [];

    document.querySelectorAll(".bb-token").forEach(btn => {
        btn.addEventListener("click", () => {
            answer.push(btn.dataset.token);
            btn.style.opacity = "0.4";
            btn.style.pointerEvents = "none";
            answerBox.textContent = answer.join(" ");
        });
    });

    submitBtn.addEventListener("click", () => {
        const correct = buildState.tokens.join(" ");
        if (answer.join(" ") === correct) {
            feedback.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].buildCompleted++;
            updateBadges();
            updateProgressMeters();
        } else {
            feedback.textContent = `Incorrect — correct answer: ${correct}`;
        }
        saveState();
    });

    nextBtn.addEventListener("click", () => renderBuildTab());

    // Simple harder mode: reverse tokens
    harderBtn.addEventListener("click", () => {
        buildState.tokens.reverse();
        harderBtn.classList.toggle("active");
        renderBuildTab();
    });
}

/* ============================================================
   SENTENCE TAB — RENDER + EVENTS
   ============================================================ */

function renderSentenceTab() {
    const container = document.getElementById("sentence-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    // For now, reuse word entries as "sentences"
    sentenceState.currentSentence = words[Math.floor(Math.random() * words.length)];
    sentenceState.tokens = sentenceState.currentSentence.spanish.split(" ");
    const shuffled = [...sentenceState.tokens].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Sentence — Level ${appState.currentLevel}</h2>
            <p>Build the full Spanish sentence from the tokens.</p>

            <div id="sb-meta">
                <strong>English:</strong> ${sentenceState.currentSentence.english}
            </div>

            <div id="sb-grid" class="sb-grid">
                ${shuffled.map(t => `
                    <button class="sb-token" data-token="${t}">
                        ${t}
                    </button>
                `).join("")}
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

    setupSentenceEvents();
}

function setupSentenceEvents() {
    const answerBox = document.getElementById("sb-answer");
    const submitBtn = document.getElementById("sb-submit");
    const nextBtn = document.getElementById("sb-next");
    const harderBtn = document.getElementById("sb-harder");
    const feedback = document.getElementById("sb-feedback");

    let answer = [];

    document.querySelectorAll(".sb-token").forEach(btn => {
        btn.addEventListener("click", () => {
            answer.push(btn.dataset.token);
            btn.style.opacity = "0.4";
            btn.style.pointerEvents = "none";
            answerBox.textContent = answer.join(" ");
        });
    });

    submitBtn.addEventListener("click", () => {
        const correct = sentenceState.tokens.join(" ");
        if (answer.join(" ") === correct) {
            feedback.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].sentenceCompleted++;
            updateBadges();
            updateProgressMeters();
        } else {
            feedback.textContent = `Incorrect — correct answer: ${correct}`;
        }
        saveState();
    });

    nextBtn.addEventListener("click", () => renderSentenceTab());

    harderBtn.addEventListener("click", () => {
        sentenceState.tokens.reverse();
        harderBtn.classList.toggle("active");
        renderSentenceTab();
    });
}

/* ============================================================
   CONVERSATION TAB — RENDER + EVENTS
   ============================================================ */

function renderConversationTab() {
    const container = document.getElementById("conversation-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    // Simple prompt: reuse word as "prompt"
    convoState.currentPrompt = words[Math.floor(Math.random() * words.length)];
    convoState.tokens = convoState.currentPrompt.spanish.split(" ");
    const shuffled = [...convoState.tokens].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Conversation — Level ${appState.currentLevel}</h2>
            <p>Build a natural Spanish phrase from the prompt.</p>

            <div id="cb-meta">
                <strong>Prompt (English):</strong> ${convoState.currentPrompt.english}
            </div>

            <div id="cb-grid" class="sb-grid">
                ${shuffled.map(t => `
                    <button class="cb-token" data-token="${t}">
                        ${t}
                    </button>
                `).join("")}
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

    setupConversationEvents();
}

function setupConversationEvents() {
    const answerBox = document.getElementById("cb-answer");
    const submitBtn = document.getElementById("cb-submit");
    const nextBtn = document.getElementById("cb-next");
    const harderBtn = document.getElementById("cb-harder");
    const feedback = document.getElementById("cb-feedback");

    let answer = [];

    document.querySelectorAll(".cb-token").forEach(btn => {
        btn.addEventListener("click", () => {
            answer.push(btn.dataset.token);
            btn.style.opacity = "0.4";
            btn.style.pointerEvents = "none";
            answerBox.textContent = answer.join(" ");
        });
    });

    submitBtn.addEventListener("click", () => {
        const correct = convoState.tokens.join(" ");
        if (answer.join(" ") === correct) {
            feedback.textContent = "Nice! 🎉";
            appState.levelStats[appState.currentLevel].conversationCompleted++;
            updateBadges();
            updateProgressMeters();
        } else {
            feedback.textContent = `Not quite. One natural option: ${correct}`;
        }
        saveState();
    });

    nextBtn.addEventListener("click", () => renderConversationTab());

    harderBtn.addEventListener("click", () => {
        convoState.tokens.reverse();
        harderBtn.classList.toggle("active");
        renderConversationTab();
    });
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
            <p style="margin-top:10px;opacity:0.8;">
                Notice how connectors, verbs, adjectives and nouns combine.
            </p>
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
        if (s.quizScore !== null && s.quizScore >= 80) badges.add(`${level} Quiz Ace`);
        if (s.buildCompleted >= 10) badges.add(`${level} Builder`);
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

    // Bar widths
    document.getElementById("quiz-progress").style.width = "60%";
    document.getElementById("build-progress").style.width = "45%";
    document.getElementById("sentence-progress").style.width = "30%";

    document.getElementById("xp-progress").style.width = "70%";
    document.getElementById("streak-progress").style.width = "40%";
    document.getElementById("score-progress").style.width = "85%";
    document.getElementById("review-progress").style.width = "20%";

    // Animated numbers
    animateNumber("quiz-number", 60);
    animateNumber("build-number", 45);
    animateNumber("sentence-number", 30);

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

/* ============================================================
   TILE PULSE ANIMATION
   ============================================================ */

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

    initTabNavigation();     // tab buttons now exist
    activateTab("dashboard"); // show dashboard first

    initRateControl();       // slider exists now
    initNameBox();           // name box exists now

    updateBadges();
    updateProgressMeters();
});




