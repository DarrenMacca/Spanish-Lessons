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
   TAB SYSTEM — UNIFIED VERSION (UPDATED FOR NEW UI)
   ============================================================ */

function groupByCategory(words) {
    const groups = {};
    words.forEach(w => {
        if (!groups[w.category]) groups[w.category] = [];
        groups[w.category].push(w);
    });
    return groups;
}


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

    // Load tab content
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
            // Dashboard has static content
            break;
    }
}

/* ============================================================
   TAB NAVIGATION (STABLE VERSION)
   ============================================================ */

function initTabNavigation() {
    const buttons = document.querySelectorAll(".tab-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            activateTab(tab);

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}

function activateTab(tabName) {
    const tabs = document.querySelectorAll("#dashboard, #listen, #flash, #quiz, #build, #sentence, #conversation, #grammar");

    tabs.forEach(tab => tab.classList.add("hidden"));

    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.classList.remove("hidden");

    // Render dynamic tabs
    if (tabName === "listen") renderListenTab();
    if (tabName === "flash") renderFlashcardsTab();
    if (tabName === "quiz") renderQuizTab();
    if (tabName === "build") renderBuildTab();
    if (tabName === "sentence") renderSentenceTab();
    if (tabName === "conversation") renderConversationTab();
    if (tabName === "grammar") renderGrammarTab();
}



function groupByCategory(words) {
    const groups = {};
    words.forEach(w => {
        if (!groups[w.category]) groups[w.category] = [];
        groups[w.category].push(w);
    });
    return groups;
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

    /* ============================================================
       CATEGORY SECTIONS
       ============================================================ */
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

    /* ============================================================
       CATEGORY COLLAPSE
       ============================================================ */
    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ============================================================
       FLASHCARD FLIP + AUDIO
       ============================================================ */
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
   QUIZ TAB — FULL LOGIC
   ============================================================ */

function renderQuizTab() {
    const container = document.getElementById("quiz");
    const words = CEFR_LEVELS[appState.currentLevel];
    const categories = groupByCategory(words);

    // Pick a random category
    const catNames = Object.keys(categories);
    const chosenCat = catNames[Math.floor(Math.random() * catNames.length)];
    const catWords = categories[chosenCat];

    // Pick a random word
    const w = catWords[Math.floor(Math.random() * catWords.length)];

    // Build distractors
    const distractors = [...catWords]
        .filter(x => x.spanish !== w.spanish)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    const options = [...distractors.map(d => d.spanish), w.spanish]
        .sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div id="quiz-builder">
            <div id="qb-meta">Category: ${chosenCat}</div>
            <div id="qb-question">Translate: <strong>${w.english}</strong></div>
            <div id="qb-grid" class="sb-grid">
                ${options.map(o => `<button class="secondary-btn qb-opt" data-opt="${o}">${o}</button>`).join("")}
            </div>
            <div id="qb-answer"></div>
            <div id="qb-feedback"></div>
            <div class="sb-controls">
                <button id="qb-submit">Check</button>
                <button id="qb-next">Next</button>
                <button id="qb-harder">Harder</button>
            </div>
        </div>
    `;

    let selected = null;

    document.querySelectorAll(".qb-opt").forEach(btn => {
        btn.onclick = () => {
            selected = btn.dataset.opt;
            document.getElementById("qb-answer").textContent = selected;
        };
    });

    document.getElementById("qb-submit").onclick = () => {
        const fb = document.getElementById("qb-feedback");
        if (!selected) {
            fb.textContent = "Choose an answer first.";
            return;
        }

        if (selected === w.spanish) {
            fb.textContent = "Correct! 🎉";
            appState.levelStats[appState.currentLevel].quizScore =
                (appState.levelStats[appState.currentLevel].quizScore || 0) + 10;
        } else {
            fb.textContent = `Incorrect. Correct answer: ${w.spanish}`;
        }

        saveState();
        updateProgressMeters();
    };

    document.getElementById("qb-next").onclick = renderQuizTab;
    document.getElementById("qb-harder").onclick = () => {
        appState.currentLevel = "B1";
        renderQuizTab();
    };
}


/* ============================================================
   BUILD TAB — FULL LOGIC
   ============================================================ */

function renderBuildTab() {
    const container = document.getElementById("build");
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
   SENTENCE TAB — FULL SMART BUILDER LOGIC
   ============================================================ */

function renderSentenceTab() {
    const container = document.getElementById("sentence");
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
    const container = document.getElementById("conversation");
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
    const container = document.getElementById("grammar");
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
/* ------------------------------------------------------------
   PROGRESS METER CONTROLLER
------------------------------------------------------------ */

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

    // ⭐ Pulse animations (this is the missing part)
    pulseTile("quiz-tile");
    pulseTile("build-tile");
    pulseTile("sentence-tile");
    pulseTile("xp-tile");
    pulseTile("streak-tile");
    pulseTile("score-tile");
    pulseTile("review-tile");
}


// Run once when dashboard loads

function renderSentenceTab() {
    const panel = document.getElementById("sentence");
    if (!panel) return;

    const level = appState.currentLevel;
    const bank = wordbanks[level]?.sentences;
    if (!bank || bank.length === 0) {
        panel.innerHTML = `
            <div class="glass-panel quiz-card">
                <h2>Sentence Practice — Level ${level}</h2>
                <p>No sentences available for this level.</p>
            </div>
        `;
        return;
    }

    // Pick a random sentence
    const item = bank[Math.floor(Math.random() * bank.length)];
    const english = item.en;
    const spanish = item.es;

    // Scramble Spanish words
    const words = spanish.split(" ");
    const scrambled = [...words].sort(() => Math.random() - 0.5);

    // Build UI
    panel.innerHTML = `
        <div class="glass-panel quiz-card">

            <h2>Sentence Practice — Level ${level}</h2>
            <p class="sentence-english"><strong>${english}</strong></p>

            <div id="sentence-output" class="sentence-output"></div>

            <div id="sentence-options" class="sentence-options"></div>

            <div class="sentence-controls">
                <button id="undo-btn" class="primary-btn">Undo</button>
                <button id="reset-btn" class="primary-btn">Reset</button>
                <button id="check-btn" class="primary-btn">Check</button>
            </div>

            <div id="sentence-feedback" class="sentence-feedback"></div>

        </div>
    `;

    const output = document.getElementById("sentence-output");
    const options = document.getElementById("sentence-options");
    const feedback = document.getElementById("sentence-feedback");

    let built = [];

    // Render scrambled word tiles
    scrambled.forEach(word => {
        const btn = document.createElement("button");
        btn.className = "word-btn";
        btn.textContent = word;

        btn.addEventListener("click", () => {
            built.push(word);
            renderOutput();
        });

        options.appendChild(btn);
    });

    function renderOutput() {
        output.textContent = built.join(" ");
    }

    // Undo last word
    document.getElementById("undo-btn").addEventListener("click", () => {
        built.pop();
        renderOutput();
    });

    // Reset sentence
    document.getElementById("reset-btn").addEventListener("click", () => {
        built = [];
        renderOutput();
    });

    // Check answer
    document.getElementById("check-btn").addEventListener("click", () => {
        const attempt = built.join(" ");
        if (attempt === spanish) {
            feedback.textContent = "Correct! 🎉";
            feedback.style.color = "limegreen";

            // Update progress
            appState.levelStats[level].sentenceCompleted++;
            updateProgressMeters();

        } else {
            feedback.textContent = "Not quite — try again.";
            feedback.style.color = "orange";
        }
    });
}


function pulseTile(id) {
    const tile = document.getElementById(id);
    if (!tile) return;

    tile.classList.remove("pulse");   // reset animation
    void tile.offsetWidth;            // force reflow
    tile.classList.add("pulse");      // trigger animation
}


/* ============================================================
   STARTUP
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadState();

    initTabNavigation();

    activateTab("dashboard");   // Dashboard must be visible first

    initRateControl();          // Now #rate exists
    initNameBox();              // Now #student-name exists

    updateBadges();
    updateProgressMeters();     // Now safe
});


