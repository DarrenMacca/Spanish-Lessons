/* ============================
   GLOBAL STATE
============================ */

let currentLevel = "A1";
let quizScore = 0;
let buildScore = 0;
let convCount = 0;

/* ============================
   DATA PACKS
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
};

/* ============================
   TAB SWITCHING
============================ */

function showTab(tabId, event) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
    });

    document.getElementById(tabId).classList.remove("hidden");

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (event) event.target.classList.add("active");
}

/* ============================
   LEVEL SWITCHING
============================ */

function changeLevel(level) {
    currentLevel = level;
    document.getElementById("level-status").textContent = `Current Level: ${level}`;
    renderAllTabs();
}

/* ============================
   LISTEN ENGINE
============================ */

function renderListenTab() {
    const container = document.getElementById("listen");
    const words = LEVEL_WORDS[currentLevel];

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

    document.getElementById("listen-play").onclick = () => {
        const idx = container.dataset.selectedIndex || 0;
        const item = words[idx];
        const rate = parseFloat(document.getElementById("rate").value);
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
    const words = LEVEL_WORDS[currentLevel];

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

    function updateCard() {
        const item = words[index];
        card.textContent = showingEs ? item.es : item.en;
    }

    card.onclick = () => {
        showingEs = !showingEs;
        updateCard();
    };

    document.getElementById("flash-prev").onclick = () => {
        index = (index - 1 + words.length) % words.length;
        showingEs = true;
        updateCard();
    };

    document.getElementById("flash-next").onclick = () => {
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
    const words = LEVEL_WORDS[currentLevel];

    container.innerHTML = `
        <h3>Quiz (${currentLevel})</h3>
        <div id="quiz-question"></div>
        <input id="quiz-answer" class="input-field" placeholder="English translation">
        <button class="primary-btn" id="quiz-submit">Submit</button>
        <div id="quiz-feedback"></div>
        <div id="quiz-score-display"></div>
    `;

    let index = 0;
    let correct = 0;
    let total = 0;

    const qEl = document.getElementById("quiz-question");
    const aEl = document.getElementById("quiz-answer");
    const fEl = document.getElementById("quiz-feedback");
    const sEl = document.getElementById("quiz-score-display");

    function loadQ() {
        qEl.textContent = `Spanish: ${words[index].es}`;
        aEl.value = "";
        fEl.textContent = "";
    }

    function updateScore() {
        quizScore = total === 0 ? 0 : Math.round((correct / total) * 100);
        sEl.textContent = `Score: ${quizScore}% (${correct}/${total})`;
    }

    document.getElementById("quiz-submit").onclick = () => {
        const item = words[index];
        const ans = aEl.value.trim().toLowerCase();
        total++;

        if (ans === item.en.toLowerCase()) {
            correct++;
            fEl.textContent = "Correct!";
        } else {
            fEl.textContent = `Incorrect. Answer: ${item.en}`;
        }

        updateScore();
        index = (index + 1) % words.length;
        loadQ();
    };

    loadQ();
    updateScore();
}

/* ============================
   SENTENCE BUILDER
============================ */

function renderBuildTab() {
    const container = document.getElementById("build");
    const words = LEVEL_WORDS[currentLevel];

    container.innerHTML = `
        <h3>Sentence Builder (${currentLevel})</h3>
        <div id="build-words"></div>
        <textarea id="build-output" class="input-field" rows="3"></textarea>
        <button class="primary-btn" id="build-check">Check</button>
        <div id="build-feedback"></div>
    `;

    const wEl = document.getElementById("build-words");
    const oEl = document.getElementById("build-output");
    const fEl = document.getElementById("build-feedback");

    words.forEach(w => {
        const pill = document.createElement("span");
        pill.className = "word-pill";
        pill.textContent = w.es;
        pill.onclick = () => oEl.value += (oEl.value ? " " : "") + w.es;
        wEl.appendChild(pill);
    });

    document.getElementById("build-check").onclick = () => {
        const text = oEl.value.trim();
        if (!text) {
            fEl.textContent = "Write a sentence first.";
            return;
        }
        buildScore = Math.min(100, text.split(" ").length * 10);
        fEl.textContent = `Estimated strength: ${buildScore}%`;
    };
}

/* ============================
   CONVERSATION
============================ */

function renderConversationTab() {
    const container = document.getElementById("conv");

    container.innerHTML = `
        <h3>Conversation (${currentLevel})</h3>
        <textarea id="conv-input" class="input-field" rows="4"></textarea>
        <button class="primary-btn" id="conv-save">Save</button>
        <div id="conv-feedback"></div>
    `;

    const input = document.getElementById("conv-input");
    const feedback = document.getElementById("conv-feedback");

    document.getElementById("conv-save").onclick = () => {
        if (!input.value.trim()) {
            feedback.textContent = "Write something first.";
            return;
        }
        convCount++;
        feedback.textContent = `Saved. Total: ${convCount}`;
    };
}

/* ============================
   SMART CONVERSATION
============================ */

function renderSmartTab() {
    const container = document.getElementById("smart");

    const prompts = {
        A1: [
            "Pretend you are a barista in Spain. Speak only in simple Spanish.",
            "You are a hotel receptionist. Help me check in."
        ],
        A2: [
            "You are a waiter. Help me make a reservation.",
            "You are a local guide. Help me ask for directions."
        ],
        B1: [
            "You are a colleague. Talk with me about work.",
            "You are a friend. Discuss past trips and future plans."
        ]
    }[currentLevel];

    container.innerHTML = `
        <h3>Smart Conversation (${currentLevel})</h3>
        <div id="smart-prompts"></div>
    `;

    const list = document.getElementById("smart-prompts");
    prompts.forEach(p => {
        const div = document.createElement("div");
        div.className = "tab-content";
        div.textContent = p;
        list.appendChild(div);
    });
}

/* ============================
   DAILY PRACTICE
============================ */

function renderDailyTab() {
    const container = document.getElementById("daily");

    const tasks = {
        A1: [
            "Say hello and goodbye in Spanish 5 times.",
            "Label 5 objects at home.",
            "Listen to a Spanish song and catch 3 words."
        ],
        A2: [
            "Write a short paragraph about your day.",
            "Order something in Spanish.",
            "Describe your room using 5 adjectives."
        ],
        B1: [
            "Write a story about a past trip.",
            "Record yourself talking about your job.",
            "Explain your weekend plans."
        ]
    }[currentLevel];

    container.innerHTML = `
        <h3>Daily Practice (${currentLevel})</h3>
        <ul id="daily-list"></ul>
    `;

    const list = document.getElementById("daily-list");
    tasks.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        list.appendChild(li);
    });
}

/* ============================
   BADGES
============================ */

function renderBadgesTab() {
    const container = document.getElementById("badges");

    container.innerHTML = `
        <h3>Badges & Milestones</h3>
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
    const items = GRAMMAR_PACK[currentLevel];

    container.innerHTML = `
        <h3>Grammar (${currentLevel})</h3>
        <div id="grammar-list"></div>
    `;

    const list = document.getElementById("grammar-list");
    items.forEach(g => {
        const div = document.createElement("div");
        div.className = "tab-content";
        div.innerHTML = `<strong>${g.title}</strong><br>${g.text}`;
        list.appendChild(div);
    });
}

/* ============================
   SCENARIOS
============================ */

function renderScenarioTab() {
    const container = document.getElementById("scenario");
    const items = SCENARIOS_PACK[currentLevel];

    container.innerHTML = `
        <h3>Scenarios (${currentLevel})</h3>
        <ul id="scenario-list"></ul>
    `;

    const list = document.getElementById("scenario-list");
    items.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        list.appendChild(li);
    });
}

/* ============================
   CERTIFICATES
============================ */

function openCertificate(level) {
    const overlay = document.getElementById("certificate-overlay");
    const preview = document.getElementById("certificate-preview-area");

    overlay.style.display = "flex";

    const title = {
        A1: "A1 Beginner Spanish",
        A2: "A2 Elementary Spanish",
        B1: "B1 Intermediate Spanish"
    }[level];

    preview.innerHTML = `
        <div class="certificate-container">
            <div class="certificate-title">Spanish CEFR Mastery Portal</div>
            <div class="certificate-subtitle">${title}</div>
            <div class="certificate-statement">
                This certifies completion of level ${level}.
            </div>
            <div class="certificate-seal">${level}</div>
            <div class="certificate-meta">
                Issued: ${new Date().toLocaleDateString()}
            </div>
        </div>
    `;
}

function closeCertificate() {
    document.getElementById("certificate-overlay").style.display = "none";
}

/* ============================
   DASHBOARD ENGINE
============================ */

function updateDashboard() {
    document.getElementById("quiz-status").textContent =
        quizScore === 0 ? "Not started" :
        quizScore < 60 ? `${quizScore}% — Needs improvement` :
        `${quizScore}% — Good progress`;

    document.getElementById("build-status").textContent =
        buildScore === 0 ? "Not started" :
        buildScore < 60 ? `${buildScore}% — Keep practicing` :
        `${buildScore}% — Strong sentences`;

    document.getElementById("conv-status").textContent =
        convCount === 0 ? "No conversations yet" :
        `${convCount} conversations completed`;

    const final = document.getElementById("final-verdict");

    if (quizScore >= 70 && buildScore >= 70 && convCount >= 5) {
        final.textContent = "A1 Completed — Ready for A2";
        triggerCelebration();
    } else {
        final.textContent = "Course Status: In progress";
    }
}

/* ============================
   CELEBRATION
============================ */

function triggerCelebration() {
    const banner = document.getElementById("celebration-banner");
    banner.style.display = "block";
    setTimeout(() => banner.style.display = "none", 3000);

    for (let i = 0; i < 40; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random()
