/* ============================================================
   CEFR TRAINER — FULL APP.JS
   Uses A1_WORDS, A2_WORDS, B1_WORDS, B2_WORDS (loaded globally)
   ============================================================ */

const CEFR_LEVELS = {
    A1: A1_WORDS,
    A2: A2_WORDS,
    B1: B1_WORDS,
    B2: B2_WORDS
};

const STORAGE_KEY = "cefr_trainer_state_v1";

let appState = {
    currentLevel: "A1",
    currentTab: "listen",
    speechRate: 1.0,
    studentName: "",
    levelStats: {
        A1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        A2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        B1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        B2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 }
    },
    badges: []
};

/* ============================================================
   STATE LOAD / SAVE
   ============================================================ */
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) appState = Object.assign(appState, JSON.parse(raw));
    } catch (e) {
        console.error(e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error(e);
    }
}

/* ============================================================
   SPEECH SYNTHESIS
   ============================================================ */
function speakSpanish(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
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

    renderCurrentTab();
    updateBadges();
}

/* ============================================================
   TAB SWITCHING
   ============================================================ */
function setTab(tab) {
    appState.currentTab = tab;
    saveState();

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    document.querySelectorAll(".dash-link").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    ["listen", "flash", "quiz", "build", "conversation", "grammar"].forEach(id => {
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.classList.toggle("hidden", id !== tab);
    });

    renderCurrentTab();
}

/* ============================================================
   RENDER DISPATCHER
   ============================================================ */
function renderCurrentTab() {
    switch (appState.currentTab) {
        case "listen": renderListenTab(); break;
        case "flash": renderFlashTab(); break;
        case "quiz": renderQuizTab(); break;
        case "build": renderBuildTab(); break;
        case "conversation": renderConversationTab(); break;
        case "grammar": renderGrammarTab(); break;
    }
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
   FLASHCARDS TAB
   ============================================================ */
let flashIndex = 0;

function renderFlashTab() {
    const container = document.getElementById("flash");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (flashIndex >= words.length) flashIndex = 0;
    const current = words[flashIndex];

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Flashcards — Level ${appState.currentLevel}</h2>
            <p>Tap the card to flip.</p>
        </div>

        <div class="glass-panel" style="max-width:500px;margin:16px auto;">
            <div class="flip-wrapper">
                <div id="flash-card" class="flip-card">
                    <div class="flip-face flip-front">${current.english}</div>
                    <div class="flip-face flip-back">${current.spanish}</div>
                </div>
            </div>

            <div style="display:flex;justify-content:space-between;margin-top:12px;">
                <button class="secondary-btn" id="flash-prev">Prev</button>
                <button class="secondary-btn" id="flash-next">Next</button>
                <button class="primary-btn" id="flash-play">Play</button>
            </div>
        </div>
    `;

    const card = document.getElementById("flash-card");
    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
        appState.levelStats[appState.currentLevel].flashSeen++;
        saveState();
        updateBadges();
    });

    document.getElementById("flash-prev").onclick = () => {
        flashIndex = (flashIndex - 1 + words.length) % words.length;
        renderFlashTab();
    };

    document.getElementById("flash-next").onclick = () => {
        flashIndex = (flashIndex + 1) % words.length;
        renderFlashTab();
    };

    document.getElementById("flash-play").onclick = () => {
        speakSpanish(current.spanish);
    };
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
    };
}

/* ============================================================
   BUILD TAB — Sentence Builder
   ============================================================ */
function renderBuildTab() {
    const container = document.getElementById("build");
    const words = CEFR_LEVELS[appState.currentLevel];

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const w1 = shuffled[0];
    const w2 = shuffled[1];
    const correctTokens = [w1.spanish, "y", w2.spanish];
    const scrambled = [...correctTokens].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="glass-panel build-card">
            <h2>Build — Level ${appState.currentLevel}</h2>
            <p>Construct the Spanish sentence:</p>
            <p><strong>${w1.english} and ${w2.english}</strong></p>

            <div id="build-target" style="min-height:40px;border:1px dashed rgba(148,163,184,0.6);padding:8px;margin-top:8px;">
                <span style="opacity:0.6;">Your sentence will appear here...</span>
            </div>

            <div id="build-bank" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
                ${scrambled.map(tok => `<button class="secondary-btn" data-token="${tok}">${tok}</button>`).join("")}
            </div>

            <button class="primary-btn" id="build-check" style="margin-top:12px;">Check</button>
            <div id="build-result" style="margin-top:10px;font-weight:bold;"></div>
        </div>
    `;

    const selected = [];
    const targetBox = document.getElementById("build-target");
    const resultDom = document.getElementById("build-result");

    document.querySelectorAll("#build-bank button").forEach(btn => {
        btn.onclick = () => {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            selected.push(btn.dataset.token);
            targetBox.innerHTML = selected.map(t => `<span>${t}</span>`).join(" ");
        };
    });

    document.getElementById("build-check").onclick = () => {
        const userSentence = selected.join(" ").trim().toLowerCase();
        const correctSentence = correctTokens.join(" ").trim().toLowerCase();

        if (userSentence === correctSentence) {
            resultDom.textContent = "✅ Correct!";
            appState.levelStats[appState.currentLevel].buildCompleted++;
        } else {
            resultDom.textContent = `❌ Correct answer: "${correctSentence}"`;
        }

        saveState();
        updateBadges();
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
   STUDENT NAME
   ============================================================ */
function initNameBox() {
    const input = document.getElementById("student-name");
    const btn = document.getElementById("save-name-btn");
    const status = document.getElementById("name-status");

    input.value = appState.studentName;

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
   SPEECH RATE
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
   NAVIGATION
   ============================================================ */
function initNavigation() { }

/* ============================================================
   STARTUP
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    initNavigation();
    initRateControl();
    initNameBox();

    setLevel(appState.currentLevel);
    updateBadges();
   
// Show the default tab
    activateTab('listen');
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Hide all tabs
        document.querySelectorAll('#listen, #flash, #quiz, #build, #conversation, #grammar')
            .forEach(tab => tab.classList.add('hidden'));

        // Show selected tab
        document.getElementById(tabName).classList.remove('hidden');

        // Update active button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

/* ============================================================
   TAB SYSTEM — CLEAN VERSION
   ============================================================ */

function activateTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('#listen, #flash, #quiz, #build, #conversation, #grammar')
        .forEach(tab => tab.classList.add('hidden'));

    // Show selected tab
    document.getElementById(tabName).classList.remove('hidden');

    // Update active button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
}

// Attach listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        activateTab(btn.dataset.tab);
    });
});



