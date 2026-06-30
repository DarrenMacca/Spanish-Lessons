/* ============================
   GLOBAL STATE
============================ */

let currentLevel = "A1";
let quizScore = 0;
let buildScore = 0;
let convCount = 0;

/* ============================
   DATA PACKS (FUTURE-READY)
============================ */

const LEVEL_WORDS = {
    A1: [
        { en: "hello", es: "hola" },
        { en: "goodbye", es: "adiós" },
        { en: "please", es: "por favor" },
        { en: "thank you", es: "gracias" },
        { en: "yes", es: "sí" },
        { en: "no", es: "no" },
        { en: "water", es: "agua" },
        { en: "food", es: "comida" },
        { en: "bathroom", es: "baño" },
        { en: "hotel", es: "hotel" }
    ],
    A2: [
        { en: "I would like", es: "me gustaría" },
        { en: "reservation", es: "reserva" },
        { en: "breakfast", es: "desayuno" },
        { en: "lunch", es: "almuerzo" },
        { en: "dinner", es: "cena" },
        { en: "train station", es: "estación de tren" },
        { en: "city center", es: "centro de la ciudad" },
        { en: "pharmacy", es: "farmacia" },
        { en: "supermarket", es: "supermercado" },
        { en: "I need help", es: "necesito ayuda" }
    ],
    B1: [
        { en: "I have been learning Spanish", es: "he estado aprendiendo español" },
        { en: "in my free time", es: "en mi tiempo libre" },
        { en: "I enjoy traveling", es: "disfruto viajar" },
        { en: "I work as a developer", es: "trabajo como desarrollador" },
        { en: "I would like to improve", es: "me gustaría mejorar" },
        { en: "communication skills", es: "habilidades de comunicación" },
        { en: "real situations", es: "situaciones reales" },
        { en: "daily conversations", es: "conversaciones diarias" },
        { en: "future plans", es: "planes futuros" },
        { en: "past experiences", es: "experiencias pasadas" }
    ]
    // B2, C1, C2 can be added here later
};

const GRAMMAR_PACK = {
    A1: [
        { title: "Ser vs Estar (basic)", text: "Use 'ser' for identity and permanent traits, 'estar' for states and locations." },
        { title: "Gender & Number", text: "Most nouns ending in -o are masculine, -a are feminine. Adjectives agree in gender and number." }
    ],
    A2: [
        { title: "Past Tense (pretérito)", text: "Use pretérito for completed actions in the past." },
        { title: "Future with 'ir a'", text: "Use 'ir a + infinitive' to talk about near future: 'voy a estudiar'." }
    ],
    B1: [
        { title: "Present Perfect", text: "Use 'he + participio' to talk about experiences." },
        { title: "Subjunctive (intro)", text: "Use subjunctive after doubt, desire, or emotion." }
    ]
    // Future grammar levels can be added here
};

const SCENARIOS_PACK = {
    A1: [
        "Ordering a coffee in a café.",
        "Asking for the bathroom in a restaurant.",
        "Checking into a hotel and asking for Wi‑Fi."
    ],
    A2: [
        "Making a restaurant reservation.",
        "Explaining a problem at the pharmacy.",
        "Asking for directions to the city center."
    ],
    B1: [
        "Talking about your job and routine.",
        "Explaining weekend plans.",
        "Describing a past trip."
    ]
    // Future scenarios can be added here
};

/* ============================
   TAB SWITCHING
============================ */

function showTab(tabId, event) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
    });

    const target = document.getElementById(tabId);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (event && event.target) event.target.classList.add("active");
}

/* ============================
   LEVEL SWITCHING
============================ */

function changeLevel(level) {
    currentLevel = level;
    const status = document.getElementById("level-status");
    if (status) status.textContent = `Current Level: ${level}`;
    renderAllTabs();
}

/* ============================
   LISTEN ENGINE
============================ */

function renderListenTab() {
    const container = document.getElementById("listen");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Listen & Repeat (${currentLevel})</h3>
        <p>Select a word and press play.</p>
        <div id="listen-list"></div>
        <button class="primary-btn" id="listen-play">Play Selected</button>
    `;

    const list = container.querySelector("#listen-list");
    words.forEach((w, idx) => {
        const btn = document.createElement("button");
        btn.className = "word-pill";
        btn.textContent = `${w.es} (${w.en})`;
        btn.dataset.index = idx;
        btn.onclick = () => container.dataset.selectedIndex = idx;
        list.appendChild(btn);
    });

    const playBtn = document.getElementById("listen-play");
    if (!playBtn) return;

    playBtn.onclick = () => {
        const idx = parseInt(container.dataset.selectedIndex || "0", 10);
        const item = words[idx];
        if (!item) return;
        const rateEl = document.getElementById("rate");
        const rate = rateEl ? parseFloat(rateEl.value) : 1;
        const utter = new SpeechSynthesisUtterance(item.es);
        utter.lang = "es-ES";
        utter.rate = rate;
        speechSynthesis.speak(utter);
    };
}

/* ============================
   FLASHCARDS ENGINE
============================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Flashcards (${currentLevel})</h3>
        <div id="flash-card" class="word-pill"></div>
        <div style="margin-top:10px;">
            <button class="secondary-btn" id="flash-prev">Prev</button>
            <button class="primary-btn" id="flash-next">Next</button>
        </div>
    `;

    let index = 0;
    let showingEs = true;

    const card = document.getElementById("flash-card");
    const prevBtn = document.getElementById("flash-prev");
    const nextBtn = document.getElementById("flash-next");

    function updateCard() {
        const item = words[index];
        if (!item) {
            card.textContent = "No cards available.";
            return;
        }
        card.textContent = showingEs ? item.es : item.en;
    }

    card.onclick = () => {
        showingEs = !showingEs;
        updateCard();
    };

    prevBtn.onclick = () => {
        index = (index - 1 + words.length) % words.length;
        showingEs = true;
        updateCard();
    };

    nextBtn.onclick = () => {
        index = (index + 1) % words.length;
        showingEs = true;
        updateCard();
    };

    updateCard();
}

/* ============================
   QUIZ ENGINE
============================ */

function renderQuizTab() {
    const container = document.getElementById("quiz");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Quiz (${currentLevel})</h3>
        <div id="quiz-question"></div>
        <input id="quiz-answer" class="input-field" placeholder="English translation">
        <button class="primary-btn" id="quiz-submit">Submit</button>
        <div id="quiz-feedback" style="margin-top:8px;"></div>
        <div id="quiz-score-display" style="margin-top:8px;"></div>
    `;

    let index = 0;
    let correct = 0;
    let total = 0;

    const qEl = document.getElementById("quiz-question");
    const aEl = document.getElementById("quiz-answer");
    const fEl = document.getElementById("quiz-feedback");
    const sEl = document.getElementById("quiz-score-display");
    const submitBtn = document.getElementById("quiz-submit");

    function loadQuestion() {
        if (words.length === 0) {
            qEl.textContent = "No quiz items available.";
            return;
        }
        const item = words[index];
        qEl.textContent = `Spanish: ${item.es}`;
        aEl.value = "";
        fEl.textContent = "";
    }

    function updateScore() {
        quizScore = total === 0 ? 0 : Math.round((correct / total) * 100);
        sEl.textContent = `Score: ${quizScore}% (${correct}/${total})`;
    }

    submitBtn.onclick = () => {
        const item = words[index];
        if (!item) return;

        const ans = aEl.value.trim().toLowerCase();
        total++;

        if (ans === item.en.toLowerCase()) {
            correct++;
            fEl.textContent = "✅ Correct!";
        } else {
            fEl.textContent = `❌ Incorrect. Correct answer: ${item.en}`;
        }

        updateScore();
        index = (index + 1) % words.length;
        loadQuestion();
    };

    loadQuestion();
    updateScore();
}

/* ============================
   SENTENCE BUILDER
============================ */

function renderBuildTab() {
    const container = document.getElementById("build");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Sentence Builder (${currentLevel})</h3>
        <p>Tap words to add them to your sentence.</p>
        <div id="build-words"></div>
        <textarea id="build-output" class="input-field" rows="3" placeholder="Type or build your sentence..."></textarea>
        <button class="primary-btn" id="build-check">Check Sentence</button>
        <div id="build-feedback" style="margin-top:8px;"></div>
    `;

    const wEl = document.getElementById("build-words");
    const oEl = document.getElementById("build-output");
    const fEl = document.getElementById("build-feedback");
    const checkBtn = document.getElementById("build-check");

    words.forEach(w => {
        const pill = document.createElement("span");
        pill.className = "word-pill";
        pill.textContent = w.es;
        pill.onclick = () => {
            oEl.value = (oEl.value + " " + w.es).trim();
        };
        wEl.appendChild(pill);
    });

    checkBtn.onclick = () => {
        const text = oEl.value.trim();
        if (!text) {
            fEl.textContent = "Write or build a sentence first.";
            return;
        }
        buildScore = Math.min(100, text.split(" ").length * 10);
        fEl.textContent = `Nice! Estimated strength: ${buildScore}%`;
    };
}

/* ============================
   CONVERSATION
============================ */

function renderConversationTab() {
    const container = document.getElementById("conv");
    if (!container) return;

    container.innerHTML = `
        <h3>Conversation (${currentLevel})</h3>
        <p>Write a short dialogue using the vocabulary.</p>
        <textarea id="conv-input" class="input-field" rows="4" placeholder="Write a short conversation in Spanish..."></textarea>
        <button class="primary-btn" id="conv-save">Save Conversation</button>
        <div id="conv-feedback" style="margin-top:8px;"></div>
    `;

    const inputEl = document.getElementById("conv-input");
    const feedbackEl = document.getElementById("conv-feedback");
    const saveBtn = document.getElementById("conv-save");

    saveBtn.onclick = () => {
        const text = inputEl.value.trim();
        if (!text) {
            feedbackEl.textContent = "Write something first.";
            return;
        }
        convCount++;
        feedbackEl.textContent = `Conversation saved. Total conversations: ${convCount}.`;
    };
}

/* ============================
   SMART CONVERSATION
============================ */

function renderSmartTab() {
    const container = document.getElementById("smart");
    if (!container) return;

    const promptsByLevel = {
        A1: [
            "Pretend you are a friendly barista in Spain. Speak only in simple Spanish. Help me order coffee.",
            "You are a hotel receptionist. Help me check in and ask basic questions in Spanish."
        ],
        A2: [
            "You are a restaurant waiter. Help me make a reservation and order food using A2 Spanish.",
            "You are a local guide. Help me ask for directions and talk about the city."
        ],
        B1: [
            "You are a colleague at work. Have a conversation with me about my job and daily routine.",
            "You are a friend. Talk with me about past trips and future plans in B1 Spanish."
        ]
    };

    const prompts = promptsByLevel[currentLevel] || [];

    container.innerHTML = `
        <h3>Smart Conversation (${currentLevel})</h3>
        <p>Use these prompts with an AI chat to practice real dialogue.</p>
        <div id="smart-prompts"></div>
    `;

    const promptsEl = document.getElementById("smart-prompts");
    prompts.forEach(p => {
        const block = document.createElement("div");
        block.className = "tab-content";
        block.style.marginTop = "8px";
        block.textContent = p;
        promptsEl.appendChild(block);
    });
}

/* ============================
   DAILY PRACTICE
============================ */

function renderDailyTab() {
    const container = document.getElementById("daily");
    if (!container) return;

    const tasksByLevel = {
        A1: [
            "Say hello and goodbye in Spanish 5 times today.",
            "Label 5 objects at home with Spanish words.",
            "Listen to one short Spanish song and catch 3 words."
        ],
        A2: [
            "Write a short paragraph about your day in Spanish.",
            "Order something (even imaginary) in Spanish.",
            "Describe your room using at least 5 adjectives."
        ],
        B1: [
            "Write a short story about a past trip.",
            "Record yourself talking about your job for 2 minutes.",
            "Explain your weekend plans in Spanish and listen back."
        ]
    };

    const tasks = tasksByLevel[currentLevel] || [];

    container.innerHTML = `
        <h3>Daily Practice (${currentLevel})</h3>
        <p>Simple daily tasks to keep Spanish active.</p>
        <ul id="daily-list"></ul>
    `;

    const listEl = document.getElementById("daily-list");
    tasks.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        listEl.appendChild(li);
    });
}

/* ============================
   BADGES
============================ */

function renderBadgesTab() {
    const container = document.getElementById("badges");
    if (!container) return;

    container.innerHTML = `
        <h3>Badges & Milestones</h3>
        <p>These unlock as you progress.</p>
        <ul>
            <li>🎖 Quiz Starter: Complete 5 quiz questions.</li>
            <li>🏅 Sentence Builder: Create 3 sentences.</li>
            <li>💬 Conversationalist: Save 5 conversations.</li>
            <li>📜 Certificate Ready: Reach A1 completion criteria.</li>
        </ul>
    `;
}

/* ============================
   GRAMMAR MODE
============================ */

function renderGrammarTab() {
    const container = document.getElementById("grammar");
    if (!container) return;

    const items = GRAMMAR_PACK[currentLevel] || [];

    container.innerHTML = `
        <h3>Grammar Mode (${currentLevel})</h3>
        <p>Key grammar points for this level.</p>
        <div id="grammar-list"></div>
    `;

    const listEl = document.getElementById("grammar-list");
    items.forEach(g => {
        const block = document.createElement("div");
        block.className = "tab-content";
        block.style.marginTop = "8px";
        block.innerHTML = `<strong>${g.title}</strong><br>${g.text}`;
        listEl.appendChild(block);
    });
}

/* ============================
   SCENARIOS MODE
============================ */

function renderScenarioTab() {
    const container = document.getElementById("scenario");
    if (!container) return;

    const items = SCENARIOS_PACK[currentLevel] || [];

    container.innerHTML = `
        <h3>Real‑World Scenarios (${currentLevel})</h3>
        <p>Practice these situations in Spanish.</p>
        <ul id="scenario-list"></ul>
    `;

    const listEl = document.getElementById("scenario-list");
    items.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        listEl.appendChild(li);
    });
}

/* ============================
   CERTIFICATE SYSTEM
============================ */

function openCertificate(level) {
    const overlay = document.getElementById("certificate-overlay");
    const preview = document.getElementById("certificate-preview-area");
    if (!overlay || !preview) return;

    overlay.style.display = "flex";

    const levelTitle = {
        A1: "A1 Beginner Spanish",
        A2: "A2 Elementary Spanish",
        B1: "B1 Intermediate Spanish"
    }[level] || level;

    preview.innerHTML = `
        <div class="certificate-container">
            <div class="certificate-title">Spanish CEFR Mastery Portal</div>
            <div class="certificate-subtitle">${levelTitle}</div>
            <div class="certificate-statement">
                This certifies that the learner has successfully completed the core path for level ${level}
                in the Spanish CEFR Mastery Portal, demonstrating consistent practice and foundational communication skills.
            </div>
            <div class="certificate-seal">
                <span style="color:#1E293B; font-weight:700; font-size:20px;">${level}</span>
            </div>
            <div class="certificate-meta">
                Issued by: Spanish CEFR Mastery Portal<br>
                Date: ${new Date().toLocaleDateString()}
            </div>
        </div>
    `;
}

function closeCertificate() {
    const overlay = document.getElementById("certificate-overlay");
    if (overlay) overlay.style.display = "none";
}

/* ============================
   DASHBOARD ENGINE
============================ */

function updateDashboard() {
    const quizStatusEl = document.getElementById("quiz-status");
    const buildStatusEl = document.getElementById("build-status");
    const convStatusEl = document.getElementById("conv-status");
    const finalEl = document.getElementById("final-verdict");

    if (quizStatusEl) {
        if (quizScore === 0) quizStatusEl.textContent = "Not started";
        else if (quizScore < 60) quizStatusEl.textContent = `${quizScore}% — Needs improvement`;
        else quizStatusEl.textContent = `${quizScore}% — Good progress`;
    }

    if (buildStatusEl) {
        if (buildScore === 0) buildStatusEl.textContent = "Not started";
        else if (buildScore < 60) buildStatusEl.textContent = `${buildScore}% — Keep practicing`;
        else buildStatusEl.textContent = `${buildScore}% — Strong sentences`;
    }

    if (convStatusEl) {
        if (convCount === 0) convStatusEl.textContent = "No conversations yet";
        else convStatusEl.textContent = `${convCount} conversations completed`;
    }

    if (finalEl) {
        if (quizScore >= 70 && buildScore >= 70 && convCount >= 5) {
            finalEl.textContent = "A1 Completed — Ready for A2";
            triggerCelebration();
        } else {
            finalEl.textContent = "Course Status: In progress";
        }
    }
}

/* ============================
   CELEBRATION SYSTEM
============================ */

function triggerCelebration() {
    const banner = document.getElementById("celebration-banner");
    if (!banner) return;

    banner.style.display = "block";
    setTimeout(() => {
        banner.style.display = "none";
    }, 3000);

    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1800);
    }
}

/* ============================
   NAVIGATION
============================ */

function openApp() {
    const dash = document.getElementById("dashboard-view");
    const learn = document.getElementById("learning-view");
    if (dash) dash.classList.add("hidden");
    if (learn) learn.classList.remove("hidden");
}

function goBack() {
    const dash = document.getElementById("dashboard-view");
    const learn = document.getElementById("learning-view");
    if (learn) learn.classList.add("hidden");
    if (dash) dash.classList.remove("hidden");
    updateDashboard();
}

/* ============================
   RENDER ALL TABS
============================ */

function renderAllTabs() {
    renderListenTab();
    renderFlashcardsTab();
    renderQuizTab();
    renderBuildTab();
    renderConversationTab();
    renderSmartTab();
    renderDailyTab();
    renderBadgesTab();
    renderGrammarTab();
    renderScenarioTab();
}

/* ============================
   INIT
============================ */

document.addEventListener("DOMContentLoaded", () => {
    const levelSelect = document.getElementById("level-select");
    if (levelSelect) currentLevel = levelSelect.value || "A1";

    const status = document.getElementById("level-status");
    if (status) status.textContent = `Current Level: ${currentLevel}`;

    renderAllTabs();
    updateDashboard();

    // Ensure only the first tab is visible initially
    showTab("listen", { target: document.querySelector(".tab-btn") });
});
