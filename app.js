// ============================
// GLOBAL STATE
// ============================

let currentLevel = "A1";
let quizScore = 0;
let buildScore = 0;
let convCount = 0;

// ============================
// DATA PACKS (A1 / A2 / B1)
// ============================

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
        { title: "Past Tense (pretérito)", text: "Use pretérito for completed actions in the past: 'ayer', 'el año pasado', etc." },
        { title: "Future with 'ir a'", text: "Use 'ir a + infinitive' to talk about near future: 'voy a estudiar'." }
    ],
    B1: [
        { title: "Present Perfect", text: "Use 'he + participio' to talk about experiences: 'he viajado', 'he comido'." },
        { title: "Subjunctive (intro)", text: "Use subjunctive after expressions of doubt, desire, or emotion: 'quiero que', 'es posible que'." }
    ]
};

const SCENARIOS_PACK = {
    A1: [
        "Ordering a coffee in a café.",
        "Asking for the bathroom in a restaurant.",
        "Checking into a hotel and asking for the Wi‑Fi password."
    ],
    A2: [
        "Making a restaurant reservation for two people at 8pm.",
        "Explaining a simple problem at the pharmacy.",
        "Asking for directions to the city center."
    ],
    B1: [
        "Talking about your job and daily routine.",
        "Explaining your plans for the weekend.",
        "Describing a past trip and what you enjoyed."
    ]
};

// ============================
// TAB SWITCHING
// ============================

function showTab(tabId, event) {
    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(c => c.classList.add("hidden"));

    const target = document.getElementById(tabId);
    if (target) target.classList.remove("hidden");

    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(b => b.classList.remove("active"));
    if (event && event.target) event.target.classList.add("active");
}

// ============================
// LEVEL HANDLING
// ============================

function changeLevel(level) {
    currentLevel = level;
    const status = document.getElementById("level-status");
    if (status) status.textContent = `Current Level: ${level}`;
    renderAllTabs();
}

// ============================
// LISTEN ENGINE
// ============================

function renderListenTab() {
    const container = document.getElementById("listen");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];
    container.innerHTML = `
        <h3>Listen & Repeat (${currentLevel})</h3>
        <p>Select a word or phrase and press play.</p>
        <div id="listen-list"></div>
        <button class="primary-btn" id="listen-play">Play Selected</button>
    `;

    const list = container.querySelector("#listen-list");
    words.forEach((w, idx) => {
        const btn = document.createElement("button");
        btn.className = "word-pill";
        btn.textContent = `${w.es} (${w.en})`;
        btn.dataset.index = idx;
        btn.onclick = () => {
            container.dataset.selectedIndex = idx;
        };
        list.appendChild(btn);
    });

    const playBtn = container.querySelector("#listen-play");
    playBtn.onclick = () => {
        const idx = parseInt(container.dataset.selectedIndex || "0", 10);
        const item = words[idx];
        if (!item) return;
        const rateSlider = document.getElementById("rate");
        const rate = rateSlider ? parseFloat(rateSlider.value) : 1;
        const utter = new SpeechSynthesisUtterance(item.es);
        utter.lang = "es-ES";
        utter.rate = rate;
        window.speechSynthesis.speak(utter);
    };
}

// ============================
// FLASHCARDS ENGINE
// ============================

function renderFlashcardsTab() {
    const container = document.getElementById("flash");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];
    container.innerHTML = `
        <h3>Flashcards (${currentLevel})</h3>
        <p>Tap to flip between English and Spanish.</p>
        <div id="flash-card" class="tab-content-inner"></div>
        <div style="margin-top:10px;">
            <button class="secondary-btn" id="flash-prev">Prev</button>
            <button class="primary-btn" id="flash-next">Next</button>
        </div>
    `;

    let index = 0;
    let showingEs = true;

    const card = container.querySelector("#flash-card");

    function updateCard() {
        const item = words[index];
        if (!item) {
            card.textContent = "No cards available.";
            return;
        }
        card.textContent = showingEs ? item.es : item.en;
    }

    card.classList.add("word-pill");
    card.style.display = "inline-block";
    card.onclick = () => {
        showingEs = !showingEs;
        updateCard();
    };

    const prevBtn = container.querySelector("#flash-prev");
    const nextBtn = container.querySelector("#flash-next");

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

// ============================
// QUIZ ENGINE
// ============================

function renderQuizTab() {
    const container = document.getElementById("quiz");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];
    container.innerHTML = `
        <h3>Quiz (${currentLevel})</h3>
        <p>Translate the Spanish word into English.</p>
        <div id="quiz-question"></div>
        <input id="quiz-answer" class="input-field" placeholder="Type the English translation">
        <button class="primary-btn" id="quiz-submit">Submit</button>
        <div id="quiz-feedback" style="margin-top:8px;"></div>
        <div id="quiz-score-display" style="margin-top:8px;"></div>
    `;

    let currentIndex = 0;
    let correctCount = 0;
    let totalCount = 0;

    const questionEl = container.querySelector("#quiz-question");
    const answerEl = container.querySelector("#quiz-answer");
    const feedbackEl = container.querySelector("#quiz-feedback");
    const scoreEl = container.querySelector("#quiz-score-display");
    const submitBtn = container.querySelector("#quiz-submit");

    function loadQuestion() {
        if (words.length === 0) {
            questionEl.textContent = "No quiz items available.";
            return;
        }
        const item = words[currentIndex];
        questionEl.textContent = `Spanish: ${item.es}`;
        answerEl.value = "";
        feedbackEl.textContent = "";
    }

    function updateScore() {
        if (totalCount === 0) {
            scoreEl.textContent = "Score: 0%";
            quizScore = 0;
            return;
        }
        quizScore = Math.round((correctCount / totalCount) * 100);
        scoreEl.textContent = `Score: ${quizScore}% (${correctCount}/${totalCount})`;
    }

    submitBtn.onclick = () => {
        const item = words[currentIndex];
        if (!item) return;
        const userAns = answerEl.value.trim().toLowerCase();
        const correctAns = item.en.toLowerCase();
        totalCount++;

        if (userAns === correctAns) {
            correctCount++;
            feedbackEl.textContent = "✅ Correct!";
        } else {
            feedbackEl.textContent = `❌ Incorrect. Correct answer: ${item.en}`;
        }

        updateScore();
        currentIndex = (currentIndex + 1) % words.length;
        loadQuestion();
    };

    loadQuestion();
    updateScore();
}

// ============================
// SENTENCE BUILDER ENGINE
// ============================

function renderBuildTab() {
    const container = document.getElementById("build");
    if (!container) return;

    container.innerHTML = `
        <h3>Sentence Builder (${currentLevel})</h3>
        <p>Build a simple sentence using the words below.</p>
        <div id="build-words"></div>
        <textarea id="build-output" class="input-field" rows="3" placeholder="Type your sentence here..."></textarea>
        <button class="primary-btn" id="build-check">Check Sentence</button>
        <div id="build-feedback" style="margin-top:8px;"></div>
    `;

    const words = LEVEL_WORDS[currentLevel] || [];
    const wordsEl = container.querySelector("#build-words");
    const outputEl = container.querySelector("#build-output");
    const feedbackEl = container.querySelector("#build-feedback");
    const checkBtn = container.querySelector("#build-check");

    words.forEach(w => {
        const pill = document.createElement("span");
        pill.className = "word-pill";
        pill.textContent = w.es;
        pill.onclick = () => {
            outputEl.value = (outputEl.value + " " + w.es).trim();
        };
        wordsEl.appendChild(pill);
    });

    checkBtn.onclick = () => {
        const text = outputEl.value.trim();
        if (!text) {
            feedbackEl.textContent = "Write or build a sentence first.";
            return;
        }
        buildScore = Math.min(100, text.split(" ").length * 10);
        feedbackEl.textContent = `Nice! Estimated strength: ${buildScore}% (based on length and use of words).`;
    };
}

// ============================
// CONVERSATION ENGINE
// ============================

function renderConversationTab() {
    const container = document.getElementById("conv");
    if (!container) return;

    container.innerHTML = `
        <h3>Conversation Builder (${currentLevel})</h3>
        <p>Write a short dialogue using the vocabulary.</p>
        <textarea id="conv-input" class="input-field" rows="4" placeholder="Write a short conversation in Spanish..."></textarea>
        <button class="primary-btn" id="conv-save">Save Conversation</button>
        <div id="conv-feedback" style="margin-top:8px;"></div>
    `;

    const inputEl = container.querySelector("#conv-input");
    const feedbackEl = container.querySelector("#conv-feedback");
    const saveBtn = container.querySelector("#conv-save");

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

// ============================
// SMART CONVERSATION PROMPTS
// ============================

function renderSmartTab() {
    const container = document.getElementById("smart");
    if (!container) return;

    container.innerHTML = `
        <h3>Smart Conversation (${currentLevel})</h3>
        <p>Use these prompts with an AI chat to practice real dialogue.</p>
        <div id="smart-prompts"></div>
    `;

    const promptsEl = container.querySelector("#smart-prompts");

    const prompts = {
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
    }[currentLevel] || [];

    prompts.forEach(p => {
        const block = document.createElement("div");
        block.className = "tab-content";
        block.style.marginTop = "8px";
        block.textContent = p;
        promptsEl.appendChild(block);
    });
}

// ============================
// DAILY PRACTICE ENGINE
// ============================

function renderDailyTab() {
    const container = document.getElementById("daily");
    if (!container) return;

    container.innerHTML = `
        <h3>Daily Practice (${currentLevel})</h3>
        <p>Simple daily tasks to keep Spanish active.</p>
        <ul id="daily-list"></ul>
    `;

    const listEl = container.querySelector("#daily-list");

    const tasks = {
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
    }[currentLevel] || [];

    tasks.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        listEl.appendChild(li);
    });
}

// ============================
// BADGES TAB (SIMPLE)
// ============================

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

// ============================
// GRAMMAR MODE
// ============================

function renderGrammarTab() {
    const container = document.getElementById("grammar");
    if (!container) return;

    container.innerHTML = `
        <h3>Grammar Mode (${currentLevel})</h3>
        <p>Key grammar points for this level.</p>
        <div id="grammar-list"></div>
    `;

    const listEl = container.querySelector("#grammar-list");
    const items = GRAMMAR_PACK[currentLevel] || [];

    items.forEach(g => {
        const block = document.createElement("div");
        block.className = "tab-content";
        block.style.marginTop = "8px";
        block.innerHTML = `<strong>${g.title}</strong><br>${g.text}`;
        listEl.appendChild(block);
    });
}

// ============================
// SCENARIOS MODE
// ============================

function renderScenarioTab() {
    const container = document.getElementById("scenario");
    if (!container) return;

    container.innerHTML = `
        <h3>Real‑World Scenarios (${currentLevel})</h3>
        <p>Practice these situations in Spanish.</p>
        <ul id="scenario-list"></ul>
    `;

    const listEl = container.querySelector("#scenario-list");
    const items = SCENARIOS_PACK[currentLevel] || [];

    items.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        listEl.appendChild(li);
    });
}

// ============================
// CERTIFICATE SYSTEM
// ============================

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

// ============================
// DASHBOARD ENGINE
// ============================

function updateDashboard() {
    const quizStatusEl = document.getElementById("quiz-status");
    const buildStatusEl = document.getElementById("build-status");
    const convStatusEl = document.getElementById("conv-status");
    const finalEl = document.getElementById("final-verdict");

    // QUIZ
    if (quizStatusEl) {
        if (quizScore === 0) quizStatusEl.textContent = "Not started";
        else if (quizScore < 60) quizStatusEl.textContent = `${quizScore}% — Needs improvement`;
        else quizStatusEl.textContent = `${quizScore}% — Good progress`;
    }

    // BUILDER
    if (buildStatusEl) {
        if (buildScore === 0) buildStatusEl.textContent = "Not started";
        else if (buildScore < 60) buildStatusEl.textContent = `${buildScore}% — Keep practicing`;
        else buildStatusEl.textContent = `${buildScore}% — Strong sentences`;
    }

    // CONVERSATION
    if (convStatusEl) {
        if (convCount === 0) convStatusEl.textContent = "No conversations yet";
        else convStatusEl.textContent = `${convCount} conversations completed`;
    }

    // FINAL VERDICT
    if (finalEl) {
        if (quizScore >= 70 && buildScore >= 70 && convCount >= 5) {
            finalEl.textContent = "A1 Completed — Ready for A2";
            triggerCelebration();
        } else {
            finalEl.textContent = "Course Status: In progress";
        }
    }
}

// ============================
// CELEBRATION SYSTEM
// ============================

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

// ============================
// NAVIGATION
// ============================

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

// ============================
// RENDER ALL TABS
// ============================

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

// ============================
// INIT
// ============================

document.addEventListener("DOMContentLoaded", () => {
    renderAllTabs();
    updateDashboard();
    const levelSelect = document.getElementById("level-select");
    if (levelSelect) currentLevel = levelSelect.value || "A1";
    const status = document.getElementById("level-status");
    if (status) status.textContent = `Current Level: ${currentLevel}`;
});
