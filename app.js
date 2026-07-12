/* ============================================================
   CEFR TRAINER — CLEAN APP.JS (PART 1)
   ============================================================ */

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
   TAB SYSTEM — SINGLE, CLEAN VERSION
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
        case "listen":        renderListenTab();        break;
        case "flash":         renderFlashTab();         break;
        case "quiz":          renderQuizTab();          break;
        case "build":         renderBuildTab();         break;
        case "sentence":      renderSentenceTab();      break;
        case "conversation":  renderConversationTab();  break;
        case "grammar":       renderGrammarTab();       break;
        case "dashboard":
            break;
    }
}

function initTabNavigation() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            activateTab(btn.dataset.tab);
        });
    });
}

/* ============================================================
   LISTEN TAB
   ============================================================ */

function groupByCategory(words) {
    const groups = {};
    words.forEach(w => {
        if (!groups[w.category]) groups[w.category] = [];
        groups[w.category].push(w);
    });
    return groups;
}

function renderListenTab() {
    const container = document.getElementById("listen");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Listen — Level ${appState.currentLevel}</h2>
            <p>Tap a category, then click a word pill to hear it.</p>
        </div>
    `;

    Object.keys(grouped).forEach(cat => {
        html += `
        <div class="glass-panel">
            <div class="listen-category-header" data-cat="${cat}">
                <span class="listen-category-title">${cat.toUpperCase()}</span>
                <span class="listen-arrow">▶</span>
            </div>
            <div class="listen-category-content" data-cat="${cat}">
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                    ${grouped[cat].map(w => `
                        <button class="word-pill" data-spanish="${w.spanish}">
                            ${w.english} <span style="opacity:0.7;">(${w.spanish})</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.listen-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    container.querySelectorAll(".word-pill").forEach(btn => {
        btn.addEventListener("click", () => {
            speakSpanish(btn.dataset.spanish);
            appState.levelStats[appState.currentLevel].listens++;
            saveState();
            updateBadges();
           

        });
    });
}

/* ============================================================
   FLASHCARDS v2 — CEFR + Audio + Difficulty + SRS
   ============================================================ */

const FLASHCARD_STATE = {
    level: appState.currentLevel,
    cards: [],
    known: new Set(),
    difficultyMap: {}, // word → difficulty score
};

// ------------------------------------------------------------
// 1. Build flashcard list from CEFR level
// ------------------------------------------------------------
function buildFlashcardsForLevel(level) {
    const words = CEFR_LEVELS[level];
    return words.map(w => ({
        english: w.english,
        spanish: w.spanish,
        audio: w.audio || null,
        difficulty: FLASHCARD_STATE.difficultyMap[w.spanish] || 0,
    }));
}

// ------------------------------------------------------------
// 2. Shuffle utility
// ------------------------------------------------------------
function fcShuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

// ------------------------------------------------------------
// 3. Play audio (if available)
function playFlashcardAudio(url) {
    if (!url) return;
    const audio = new Audio(url);
    audio.play();
}

// ------------------------------------------------------------
// 4. Difficulty tracking
// ------------------------------------------------------------
function updateFlashcardDifficulty(spanishWord, correct) {
    const current = FLASHCARD_STATE.difficultyMap[spanishWord] || 0;
    const newScore = correct ? Math.max(0, current - 1) : current + 1;
    FLASHCARD_STATE.difficultyMap[spanishWord] = newScore;
}

// ------------------------------------------------------------
// 5. Render Flashcards Tab
// ------------------------------------------------------------
function renderFlashcardsTab() {
    const container = document.getElementById("flashcards");

    FLASHCARD_STATE.level = appState.currentLevel;
    FLASHCARD_STATE.cards = fcShuffle(buildFlashcardsForLevel(FLASHCARD_STATE.level));

    container.innerHTML = `
        <div class="glass-panel">
            <h2>Flashcards — Level ${FLASHCARD_STATE.level}</h2>
            <p>Tap a card to flip. Tap 🔊 to hear pronunciation.</p>

            <div id="fc-grid" class="fc-grid"></div>
        </div>
    `;

    const grid = document.getElementById("fc-grid");

    FLASHCARD_STATE.cards.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.className = "fc-card";

        cardEl.innerHTML = `
            <div class="fc-inner">
                <div class="fc-front">
                    <span>${card.english}</span>
                </div>
                <div class="fc-back">
                    <span>${card.spanish}</span>
                    ${card.audio ? `<button class="fc-audio">🔊</button>` : ""}
                </div>
            </div>
        `;

        // Flip on tap
        cardEl.addEventListener("click", () => {
            cardEl.classList.toggle("fc-flipped");
        });

        // Audio button
        const audioBtn = cardEl.querySelector(".fc-audio");
        if (audioBtn) {
            audioBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                playFlashcardAudio(card.audio);
            });
        }

        grid.appendChild(cardEl);
    });
}


/* ============================================================
   QUIZ TAB
   ============================================================ */

function renderQuizTab() {
    const container = document.getElementById("quiz");
    const words = CEFR_LEVELS[appState.currentLevel];

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, Math.min(5, shuffled.length)).map((w, idx) => {
        const distractors = words.filter(o => o !== w).sort(() => Math.random() - 0.5).slice(0, 2);
        const options = [...distractors, w].sort(() => Math.random() - 0.5);
        return { id: idx, english: w.english, correct: w.spanish, options: options.map(o => o.spanish) };
    });

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Quiz — Level ${appState.currentLevel}</h2>
            <p>Select the correct Spanish translation.</p>
        </div>

        <form id="quiz-form" class="glass-panel quiz-card">
    `;

    questions.forEach(q => {
        html += `
            <div style="margin-bottom:16px;">
                <p><strong>${q.english}</strong></p>
                ${q.options.map(opt => `
                    <label style="display:block;margin:4px 0;">
                        <input type="radio" name="q-${q.id}" value="${opt}"> ${opt}
                    </label>
                `).join("")}
            </div>
        `;
    });

    html += `
            <button class="primary-btn" type="submit">Evaluate</button>
            <div id="quiz-result" style="margin-top:12px;font-weight:bold;"></div>
        </form>
    `;

    container.innerHTML = html;

    document.getElementById("quiz-form").onsubmit = e => {
        e.preventDefault();
        let correctCount = 0;

        questions.forEach(q => {
            const chosen = document.querySelector(`input[name="q-${q.id}"]:checked`);
            if (chosen && chosen.value === q.correct) correctCount++;
        });

        const percent = Math.round((correctCount / questions.length) * 100);
        document.getElementById("quiz-result").textContent =
            `Score: ${percent}% (${correctCount}/${questions.length})`;

        appState.levelStats[appState.currentLevel].quizScore = percent;
        saveState();
        updateBadges();
       updateProgressMeters();

    };
}

/* ============================================================
   BUILD TAB — Smart Sentence Builder v2
   ============================================================ */

function renderBuildTab() {
    const container = document.getElementById("build");

    // Pick two CEFR words for the prompt
    const words = CEFR_LEVELS[appState.currentLevel];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const w1 = shuffled[0];
    const w2 = shuffled[1];

    // Correct Spanish sentence
    const correctSentence = `${w1.spanish} y ${w2.spanish}`;
    const correctTokens = correctSentence.split(" ");

    // Distractors (simple but effective)
    const distractors = [
        "el", "la", "los", "las",
        "un", "una",
        "quiero", "quieres",
        "nuevo", "nueva"
    ];

    // Build grid tokens
    const gridTokens = [...correctTokens, ...distractors]
        .sort(() => Math.random() - 0.5)
        .slice(0, correctTokens.length + 3); // limit distractors

    container.innerHTML = `
        <div class="glass-panel build-card">
            <h2>Build — Level ${appState.currentLevel}</h2>
            <p>Construct the Spanish sentence:</p>
            <p><strong>${w1.english} and ${w2.english}</strong></p>

            <div id="build-target" style="min-height:40px;border:1px dashed rgba(148,163,184,0.6);padding:8px;margin-top:8px;">
                <span style="opacity:0.6;">Your sentence will appear here...</span>
            </div>

            <div id="build-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
                ${gridTokens.map(tok => `<button class="secondary-btn" data-token="${tok}">${tok}</button>`).join("")}
            </div>

            <button class="primary-btn" id="build-check" style="margin-top:12px;">Check</button>
            <button class="secondary-btn" id="build-next" style="margin-top:12px;">Next Sentence</button>

            <div id="build-result" style="margin-top:10px;font-weight:bold;"></div>
        </div>
    `;

    const selected = [];
    const targetBox = document.getElementById("build-target");
    const resultDom = document.getElementById("build-result");

    // Token selection
    document.querySelectorAll("#build-bank button").forEach(btn => {
        btn.onclick = () => {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            selected.push(btn.dataset.token);
            targetBox.innerHTML = selected.map(t => `<span>${t}</span>`).join(" ");
        };
    });

    // Grammar-aware validation
    document.getElementById("build-check").onclick = () => {
        const userSentence = selected.join(" ").trim().toLowerCase();
        const correct = correctSentence.trim().toLowerCase();

        let score = 100;
        let errors = [];

        // Word order check
        const userTokens = selected;
        correctTokens.forEach((tok, idx) => {
            if (userTokens[idx] !== tok) {
                score -= 20;
                errors.push(`Word order issue near "${tok}"`);
            }
        });

        // Article check
        const articles = ["el","la","los","las","un","una"];
        const correctArticles = correctTokens.filter(t => articles.includes(t));
        const userArticles = userTokens.filter(t => articles.includes(t));
        if (correctArticles.join(" ") !== userArticles.join(" ")) {
            score -= 20;
            errors.push("Incorrect article usage");
        }

        // Length check
        if (userTokens.length !== correctTokens.length) {
            score -= 20;
            errors.push("Incorrect number of words");
        }

        // Final result
        if (score >= 90) {
            resultDom.textContent = `✅ Excellent! Score: ${score}%`;
            appState.levelStats[appState.currentLevel].buildCompleted++;
        } else {
            resultDom.innerHTML = `
                ❌ Score: ${score}%<br>
                Correct answer: "${correctSentence}"<br>
                ${errors.map(e => `<div style="color:#f88;">${e}</div>`).join("")}
            `;
        }

        saveState();
        updateBadges();
        updateProgressMeters();
    };

    // Next sentence button
    document.getElementById("build-next").onclick = () => {
        renderBuildTab();
    };
}



/* ============================================================
   CONVERSATION TAB
   ============================================================ */

function renderConversationTab() {
    const container = document.getElementById("conversation");
    const words = CEFR_LEVELS[appState.currentLevel];

    const connectors = words.filter(w => w.category === "connector").slice(0, 6);
    const core = words.filter(w => w.category === "core").slice(0, 6);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Conversation — Level ${appState.currentLevel}</h2>
            <p>Mix connectors and core phrases to practice speaking.</p>
        </div>

        <div class="glass-panel quiz-card">
            <h3>Connectors</h3>
            <ul>${connectors.map(c => `<li>${c.english} → <strong>${c.spanish}</strong></li>`).join("")}</ul>

            <h3 style="margin-top:12px;">Core Phrases</h3>
            <ul>${core.map(c => `<li>${c.english} → <strong>${c.spanish}</strong></li>`).join("")}</ul>

            <p style="margin-top:12px;opacity:0.8;">Try building 3–5 sentences aloud.</p>
        </div>
    `;
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



