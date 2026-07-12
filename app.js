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
    A1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 },
    A2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 },
    B1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 },
    B2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 }
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
   SABINA VOICE (Spanish TTS for explanations)
   ============================================================ */
function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";        // Sabina Spanish voice
    u.rate = appState.speechRate;
    u.pitch = 1.0;

    window.speechSynthesis.speak(u);
}

/* ============================================================
   SPEECH SYNTHESIS — Spanish word pronunciation
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
   QUIZ AUDIO — Sabina (correct + incorrect)
   ============================================================ */
function speakQuiz(correctAnswer) {
    const message = `La respuesta correcta es: ${correctAnswer}`;
    speak(message); // Sabina voice
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

    // Pill selection
    grid.querySelectorAll(".qb-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".qb-opt").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            quizState.selected = btn.dataset.spanish;
            answerBox.textContent = quizState.selected;
        });
    });

    // Check button
    submitBtn.addEventListener("click", () => {
    if (!quizState.selected) {
        feedback.textContent = "Choose an answer first.";
        return;
    }

    const correct = quizState.currentWord.spanish;

    // ⭐ Ensure quizScore is not null before incrementing
    if (appState.levelStats[appState.currentLevel].quizScore === null) {
        appState.levelStats[appState.currentLevel].quizScore = 0;
    }

    if (quizState.selected === correct) {
        feedback.textContent = "Correct! 🎉";
        appState.levelStats[appState.currentLevel].quizScore++;
        updateBadges();
        updateProgressMeters();
    } else {
        feedback.textContent = `Incorrect — correct answer: ${correct}`;
    }

    // Sabina audio
    setTimeout(() => speakQuiz(correct), 300);

    saveState();
});


    // Next button
    nextBtn.addEventListener("click", () => {
        renderQuizTab();
    });

    // Harder mode toggle
    harderBtn.addEventListener("click", () => {
        quizState.harderMode = !quizState.harderMode;
        harderBtn.classList.toggle("active");
        renderQuizTab();
    });
}


/* ============================================================
   BUILD TAB — RENDER + EVENTS (FINAL MASTER VERSION)
   ============================================================ */

function renderBuildTab() {
    const container = document.getElementById("build-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel build-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    // Pick random word
    buildState.currentWord = words[Math.floor(Math.random() * words.length)];
    const spanish = buildState.currentWord.spanish;

    // Tokenise Spanish sentence
    buildState.tokens = spanish.split(" ").sort(() => Math.random() - 0.5);
    buildState.answer = [];

    container.innerHTML = `
        <div class="glass-panel build-card">
            <h2>Build — Level ${appState.currentLevel}</h2>
            <p>Rebuild the Spanish sentence from the scrambled words.</p>

            <div id="build-meta"><strong>English:</strong> ${buildState.currentWord.english}</div>

            <div id="build-grid" class="sb-grid">
                ${buildState.tokens.map(t => `
                    <button class="word-pill build-opt" data-token="${t}">${t}</button>
                `).join("")}
            </div>

            <div id="build-answer" class="build-answer"></div>

            <input id="build-type" class="build-type" placeholder="Or type the sentence…" />

            <div id="build-feedback"></div>

            <div class="sb-controls">
                <button id="build-undo">Undo</button>
                <button id="build-reset">Reset</button>
                <button id="build-check">Check</button>
                <button id="build-next">Next</button>
            </div>
        </div>
    `;

    setupBuildEvents();
}

function setupBuildEvents() {
    const grid = document.getElementById("build-grid");
    const answerBox = document.getElementById("build-answer");
    const typeBox = document.getElementById("build-type");
    const feedback = document.getElementById("build-feedback");

    const undoBtn = document.getElementById("build-undo");
    const resetBtn = document.getElementById("build-reset");
    const checkBtn = document.getElementById("build-check");
    const nextBtn = document.getElementById("build-next");

    buildState.answer = [];

    // Word-pill selection
    grid.querySelectorAll(".build-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            buildState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            answerBox.textContent = buildState.answer.join(" ");
        });
    });

    // Typing mode
    typeBox.addEventListener("input", () => {
        buildState.answer = typeBox.value.trim().split(" ");
        answerBox.textContent = buildState.answer.join(" ");
    });

    // Undo last word
    undoBtn.addEventListener("click", () => {
        buildState.answer.pop();
        answerBox.textContent = buildState.answer.join(" ");

        // Re-enable last used pill
        grid.querySelectorAll(".build-opt").forEach(btn => {
            if (!buildState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    // Reset
    resetBtn.addEventListener("click", () => {
        buildState.answer = [];
        answerBox.textContent = "";
        typeBox.value = "";
        grid.querySelectorAll(".build-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    // Check
    checkBtn.addEventListener("click", () => {
        const correct = buildState.currentWord.spanish;
        const user = buildState.answer.join(" ").trim();

        if (user === correct) {
            feedback.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].buildCompleted++;
            updateBadges();
            updateProgressMeters();
            setTimeout(() => speakQuiz(correct), 300);
        } else {
            feedback.textContent = `Incorrect — correct answer: ${correct}`;
            setTimeout(() => speakQuiz(correct), 300);
        }

        saveState();
    });

    // Next
    nextBtn.addEventListener("click", () => {
        renderBuildTab();
    });
}


/* ============================================================
   SENTENCE TAB — RENDER + EVENTS (FINAL MASTER VERSION)
   ============================================================ */

function renderSentenceTab() {
    const container = document.getElementById("sentence-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    const grouped = groupByCategory(words);
    const categories = Object.keys(grouped);

    container.innerHTML = `
        <div class="glass-panel sentence-card">
            <h2>Sentence Builder — Level ${appState.currentLevel}</h2>
            <p>Select a category to build a Spanish sentence.</p>

            <div id="sent-cats">
                ${categories.map(cat => `
                    <button class="word-pill sent-cat" data-cat="${cat}">${cat}</button>
                `).join("")}
            </div>

            <div id="sent-work"></div>
        </div>
    `;

    setupSentenceCategoryEvents(grouped);
}

function setupSentenceCategoryEvents(grouped) {
    const work = document.getElementById("sent-work");

    document.querySelectorAll(".sent-cat").forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.dataset.cat;
            const list = grouped[cat];

            // Pick random sentence
            sentenceState.currentSentence = list[Math.floor(Math.random() * list.length)];
            const spanish = sentenceState.currentSentence.spanish;

            sentenceState.tokens = spanish.split(" ").sort(() => Math.random() - 0.5);
            sentenceState.answer = [];

            work.innerHTML = `
                <div><strong>English:</strong> ${sentenceState.currentSentence.english}</div>

                <div id="sent-grid" class="sb-grid">
                    ${sentenceState.tokens.map(t => `
                        <button class="word-pill sent-opt" data-token="${t}">${t}</button>
                    `).join("")}
                </div>

                <div id="sent-answer"></div>

                <input id="sent-type" class="sent-type" placeholder="Or type the sentence…" />

                <div id="sent-feedback"></div>

                <div class="sb-controls">
                    <button id="sent-undo">Undo</button>
                    <button id="sent-reset">Reset</button>
                    <button id="sent-check">Check</button>
                    <button id="sent-next">Next</button>
                </div>
            `;

            setupSentenceEvents();
        });
    });
}

function setupSentenceEvents() {
    const grid = document.getElementById("sent-grid");
    const answerBox = document.getElementById("sent-answer");
    const typeBox = document.getElementById("sent-type");
    const feedback = document.getElementById("sent-feedback");

    const undoBtn = document.getElementById("sent-undo");
    const resetBtn = document.getElementById("sent-reset");
    const checkBtn = document.getElementById("sent-check");
    const nextBtn = document.getElementById("sent-next");

    sentenceState.answer = [];

    // Word-pill selection
    grid.querySelectorAll(".sent-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            sentenceState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            answerBox.textContent = sentenceState.answer.join(" ");
        });
    });

    // Typing mode
    typeBox.addEventListener("input", () => {
        sentenceState.answer = typeBox.value.trim().split(" ");
        answerBox.textContent = sentenceState.answer.join(" ");
    });

    // Undo
    undoBtn.addEventListener("click", () => {
        sentenceState.answer.pop();
        answerBox.textContent = sentenceState.answer.join(" ");

        grid.querySelectorAll(".sent-opt").forEach(btn => {
            if (!sentenceState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    // Reset
    resetBtn.addEventListener("click", () => {
        sentenceState.answer = [];
        answerBox.textContent = "";
        typeBox.value = "";
        grid.querySelectorAll(".sent-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    // Check
    checkBtn.addEventListener("click", () => {
        const correct = sentenceState.currentSentence.spanish;
        const user = sentenceState.answer.join(" ").trim();

        if (user === correct) {
            feedback.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].sentenceCompleted++;
            updateBadges();
            updateProgressMeters();
            setTimeout(() => speakQuiz(correct), 300);
        } else {
            feedback.textContent = `Incorrect — correct answer: ${correct}`;
            setTimeout(() => speakQuiz(correct), 300);
        }

        saveState();
    });

    // Next
    nextBtn.addEventListener("click", () => {
        renderSentenceTab();
    });
}

/* ============================================================
   CONVERSATION TAB — RENDER + EVENTS (EVERYDAY DIALOGUE)
   ============================================================ */

const CONVO_PROMPTS = [
    { english: "How are you today?", spanishTarget: "¿Cómo estás hoy?" },
    { english: "Where do you live?", spanishTarget: "¿Dónde vives?" },
    { english: "What do you like to do on weekends?", spanishTarget: "¿Qué te gusta hacer los fines de semana?" },
    { english: "Do you work or study?", spanishTarget: "¿Trabajas o estudias?" },
    { english: "What is your favorite food?", spanishTarget: "¿Cuál es tu comida favorita?" },
    { english: "What time do you usually get up?", spanishTarget: "¿A qué hora sueles levantarte?" }
];

function renderConversationTab() {
    const container = document.getElementById("conversation-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel convo-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    // Pick random prompt
    convoState.currentPrompt = CONVO_PROMPTS[Math.floor(Math.random() * CONVO_PROMPTS.length)];
    const target = convoState.currentPrompt.spanishTarget;

    // Build wordbank from level words + disruptors
    const coreTokens = target.replace(/[¿?]/g, "").split(" ");
    const levelTokens = words.map(w => w.spanish.split(" ")).flat();
    const disruptors = ["rápido", "lento", "siempre", "nunca", "ayer", "mañana", "porque", "pero"];

    let bank = [...coreTokens];

    // Add some level words
    while (bank.length < coreTokens.length + 4) {
        const t = levelTokens[Math.floor(Math.random() * levelTokens.length)];
        if (t && !bank.includes(t)) bank.push(t);
    }

    // Add disruptors
    disruptors.forEach(d => {
        if (!bank.includes(d)) bank.push(d);
    });

    // Shuffle bank
    bank = bank.sort(() => Math.random() - 0.5);

    convoState.tokens = bank;
    convoState.answer = [];

    container.innerHTML = `
        <div class="glass-panel convo-card">
            <h2>Conversation — Level ${appState.currentLevel}</h2>
            <p>Respond in Spanish by selecting the correct words from the wordbank.</p>

            <div id="convo-prompt"><strong>Prompt (English):</strong> ${convoState.currentPrompt.english}</div>

            <div id="convo-grid" class="sb-grid">
                ${convoState.tokens.map(t => `
                    <button class="word-pill convo-opt" data-token="${t}">${t}</button>
                `).join("")}
            </div>

            <div id="convo-answer"></div>

            <input id="convo-type" class="convo-type" placeholder="Or type your response in Spanish…" />

            <div id="convo-feedback"></div>

            <div class="sb-controls">
                <button id="convo-undo">Undo</button>
                <button id="convo-reset">Reset</button>
                <button id="convo-check">Check</button>
                <button id="convo-next">Next</button>
            </div>
        </div>
    `;

    setupConversationEvents();
}



function setupConversationEvents() {
    const grid = document.getElementById("convo-grid");
    const answerBox = document.getElementById("convo-answer");
    const typeBox = document.getElementById("convo-type");
    const feedback = document.getElementById("convo-feedback");

    const undoBtn = document.getElementById("convo-undo");
    const resetBtn = document.getElementById("convo-reset");
    const checkBtn = document.getElementById("convo-check");
    const nextBtn = document.getElementById("convo-next");

    convoState.answer = [];

    // Word-pill selection
    grid.querySelectorAll(".convo-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            convoState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            answerBox.textContent = convoState.answer.join(" ");
        });
    });

    // Typing mode
    typeBox.addEventListener("input", () => {
        convoState.answer = typeBox.value.trim().split(" ");
        answerBox.textContent = convoState.answer.join(" ");
    });

    // Undo
    undoBtn.addEventListener("click", () => {
        convoState.answer.pop();
        answerBox.textContent = convoState.answer.join(" ");

        grid.querySelectorAll(".convo-opt").forEach(btn => {
            if (!convoState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    // Reset
    resetBtn.addEventListener("click", () => {
        convoState.answer = [];
        answerBox.textContent = "";
        typeBox.value = "";
        grid.querySelectorAll(".convo-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    // Check
    checkBtn.addEventListener("click", () => {
        const correct = convoState.currentPrompt.spanishTarget.replace(/[¿?]/g, "").trim();
        const user = convoState.answer.join(" ").trim();

        if (user === correct) {
            feedback.textContent = "Nice! That’s a natural response. 🎉";
            // Use quizScore as a general conversation score for now
            if (appState.levelStats[appState.currentLevel].quizScore === null) {
                appState.levelStats[appState.currentLevel].quizScore = 0;
            }
            appState.levelStats[appState.currentLevel].quizScore++;
            updateBadges();
            updateProgressMeters();
            setTimeout(() => speakQuiz(correct), 300);
        } else {
            feedback.textContent = `Not quite. A natural response would be: ${convoState.currentPrompt.spanishTarget}`;
            setTimeout(() => speakQuiz(correct), 300);
        }

        saveState();
    });

    // Next
    nextBtn.addEventListener("click", () => {
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

    // ⭐ NEW BADGES — paste here
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




