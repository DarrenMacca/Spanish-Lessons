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

    /* ============================
       A1 — Beginner Vocabulary
       (Core + Everyday Packs)
    ============================ */

    A1: [

        // Core greetings & basics
        { en: "hello", es: "hola" },
        { en: "goodbye", es: "adiós" },
        { en: "please", es: "por favor" },
        { en: "thank you", es: "gracias" },
        { en: "yes", es: "sí" },
        { en: "no", es: "no" },
        { en: "sorry", es: "lo siento" },
        { en: "excuse me", es: "perdón" },

        // People & pronouns
        { en: "I", es: "yo" },
        { en: "you", es: "tú" },
        { en: "he", es: "él" },
        { en: "she", es: "ella" },
        { en: "we", es: "nosotros" },
        { en: "they", es: "ellos" },

        // Common nouns
        { en: "water", es: "agua" },
        { en: "food", es: "comida" },
        { en: "coffee", es: "café" },
        { en: "tea", es: "té" },
        { en: "milk", es: "leche" },
        { en: "bread", es: "pan" },
        { en: "bathroom", es: "baño" },
        { en: "hotel", es: "hotel" },
        { en: "room", es: "habitación" },
        { en: "key", es: "llave" },
        { en: "table", es: "mesa" },
        { en: "chair", es: "silla" },

        // Café pack
        { en: "menu", es: "menú" },
        { en: "bill", es: "cuenta" },
        { en: "waiter", es: "camarero" },
        { en: "I want", es: "quiero" },
        { en: "I would like", es: "me gustaría" },

        // Travel basics
        { en: "bus", es: "autobús" },
        { en: "train", es: "tren" },
        { en: "ticket", es: "boleto" },
        { en: "station", es: "estación" },
        { en: "airport", es: "aeropuerto" },

        // Shopping basics
        { en: "how much?", es: "¿cuánto cuesta?" },
        { en: "cheap", es: "barato" },
        { en: "expensive", es: "caro" },
        { en: "open", es: "abierto" },
        { en: "closed", es: "cerrado" },

        // Emergency basics
        { en: "help", es: "ayuda" },
        { en: "doctor", es: "doctor" },
        { en: "police", es: "policía" },
        { en: "I am lost", es: "estoy perdido" }
    ],

    /* ============================
       A2 — Elementary Vocabulary
       (Core + Everyday Packs)
    ============================ */

    A2: [

        // Core communication
        { en: "I need", es: "necesito" },
        { en: "I am looking for", es: "busco" },
        { en: "I don't understand", es: "no entiendo" },
        { en: "can you help me?", es: "¿puede ayudarme?" },

        // Food & restaurant
        { en: "breakfast", es: "desayuno" },
        { en: "lunch", es: "almuerzo" },
        { en: "dinner", es: "cena" },
        { en: "reservation", es: "reserva" },
        { en: "table for two", es: "mesa para dos" },
        { en: "allergic to", es: "alérgico a" },

        // Travel & navigation
        { en: "city center", es: "centro de la ciudad" },
        { en: "pharmacy", es: "farmacia" },
        { en: "supermarket", es: "supermercado" },
        { en: "turn left", es: "gire a la izquierda" },
        { en: "turn right", es: "gire a la derecha" },
        { en: "straight ahead", es: "todo recto" },

        // Shopping
        { en: "receipt", es: "recibo" },
        { en: "card", es: "tarjeta" },
        { en: "cash", es: "efectivo" },
        { en: "discount", es: "descuento" },
        { en: "size", es: "talla" },

        // Emergencies
        { en: "I feel sick", es: "me siento enfermo" },
        { en: "I need a doctor", es: "necesito un doctor" },
        { en: "I lost my passport", es: "perdí mi pasaporte" },

        // Communication phrases
        { en: "I think that", es: "creo que" },
        { en: "I prefer", es: "prefiero" },
        { en: "I am going to", es: "voy a" },
        { en: "I want to go", es: "quiero ir" }
    ],

    /* ============================
       B1 — Intermediate Vocabulary
       (Core + Real‑World Packs)
    ============================ */

    B1: [

        // Daily life
        { en: "I have been learning Spanish", es: "he estado aprendiendo español" },
        { en: "in my free time", es: "en mi tiempo libre" },
        { en: "I enjoy traveling", es: "disfruto viajar" },
        { en: "I work as a developer", es: "trabajo como desarrollador" },
        { en: "I would like to improve", es: "me gustaría mejorar" },

        // Communication
        { en: "in my opinion", es: "en mi opinión" },
        { en: "I agree", es: "estoy de acuerdo" },
        { en: "I disagree", es: "no estoy de acuerdo" },
        { en: "it depends", es: "depende" },

        // Real situations
        { en: "real situations", es: "situaciones reales" },
        { en: "daily conversations", es: "conversaciones diarias" },
        { en: "future plans", es: "planes futuros" },
        { en: "past experiences", es: "experiencias pasadas" },

        // Work & study
        { en: "meeting", es: "reunión" },
        { en: "project", es: "proyecto" },
        { en: "deadline", es: "fecha límite" },
        { en: "task", es: "tarea" },

        // Travel & emergencies
        { en: "insurance", es: "seguro" },
        { en: "accident", es: "accidente" },
        { en: "lost luggage", es: "equipaje perdido" },

        // Storytelling
        { en: "I went", es: "fui" },
        { en: "I saw", es: "vi" },
        { en: "I did", es: "hice" },
        { en: "I met", es: "conocí" },
        { en: "I learned", es: "aprendí" }
    ]
};

    // B2, C1, C2 can be added here later


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
   TAB SWITCHING (with smooth transitions)
============================ */

function showTab(tabId, event) {
    // Hide all tabs
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
        tab.classList.remove("active-tab");
    });

    // Show selected tab with smooth transition
    const target = document.getElementById(tabId);
    if (target) {
        target.classList.remove("hidden");
        target.classList.add("active-tab");
    }

    // Update tab button active state
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    if (event && event.target) event.target.classList.add("active");

    // Lazy load content
    renderTab(tabId);
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
   LISTEN ENGINE (FULL VERSION)
   Lazy‑Loading Compatible
============================ */

let autoPlayActive = false;
let autoPlayPaused = false;
let autoPlayIndex = 0;

function renderListenTab() {
    const container = document.getElementById("listen");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Listen & Repeat (${currentLevel})</h3>
        <p>Tap a word to play it, or use Auto‑Play.</p>

        <div id="listen-list"></div>

        <div style="margin-top:15px;">
            <button class="primary-btn" onclick="autoPlayListen()">▶️ Play All (Auto‑Play)</button>
            <button class="secondary-btn" onclick="stopAutoPlay()">⏹️ Stop</button>
            <button class="secondary-btn" onclick="pauseAutoPlay()">⏸️ Pause</button>
            <button class="primary-btn" onclick="resumeAutoPlay()">▶️ Resume</button>
        </div>
    `;

    const list = document.getElementById("listen-list");

    words.forEach((w, idx) => {
        const pill = document.createElement("button");
        pill.className = "word-pill";
        pill.textContent = `${w.es} (${w.en})`;
        pill.onclick = () => playSingleWord(idx);
        list.appendChild(pill);
    });
}

/* ============================
   SINGLE WORD PLAYBACK
============================ */

function playSingleWord(index) {
    const words = LEVEL_WORDS[currentLevel];
    const item = words[index];
    const rate = parseFloat(document.getElementById("rate").value);

    const utter = new SpeechSynthesisUtterance(item.es);
    utter.lang = "es-ES";
    utter.rate = rate;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

/* ============================
   AUTO‑PLAY SYSTEM
============================ */

function autoPlayListen() {
    const words = LEVEL_WORDS[currentLevel];
    if (!words.length) return;

    autoPlayActive = true;
    autoPlayPaused = false;
    autoPlayIndex = 0;

    playNextWord(words);
}

function playNextWord(words) {
    if (!autoPlayActive || autoPlayPaused) return;

    if (autoPlayIndex >= words.length) {
        autoPlayActive = false;
        return;
    }

    const item = words[autoPlayIndex];
    const rate = parseFloat(document.getElementById("rate").value);

    const utter = new SpeechSynthesisUtterance(item.es);
    utter.lang = "es-ES";
    utter.rate = rate;

    utter.onend = () => {
        if (autoPlayPaused) return;
        autoPlayIndex++;
        setTimeout(() => playNextWord(words), 600);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

/* ============================
   STOP / PAUSE / RESUME
============================ */

function stopAutoPlay() {
    autoPlayActive = false;
    autoPlayPaused = false;
    speechSynthesis.cancel();
}

function pauseAutoPlay() {
    if (!autoPlayActive) return;
    autoPlayPaused = true;
    speechSynthesis.pause();
}

function resumeAutoPlay() {
    if (!autoPlayActive) return;
    autoPlayPaused = false;
    speechSynthesis.resume();
}

/* ============================
   FLASHCARDS — FINAL VERSION
   Animated Flip + Grid View
============================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Flashcards (${currentLevel})</h3>
        <p>Tap any card to flip between Spanish ↔ English.</p>

        <div id="flash-grid"
             style="display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:20px; margin-top:20px;">
        </div>
    `;

    const grid = document.getElementById("flash-grid");

    words.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "flip-wrapper";

        const card = document.createElement("div");
        card.className = "flip-card";

        const front = document.createElement("div");
        front.className = "flip-face flip-front word-pill";
        front.textContent = item.es;

        const back = document.createElement("div");
        back.className = "flip-face flip-back word-pill";
        back.textContent = item.en;

        card.appendChild(front);
        card.appendChild(back);
        wrapper.appendChild(card);

        wrapper.onclick = () => {
            card.classList.toggle("flipped");
        };

        grid.appendChild(wrapper);
    });
}



/* ============================
   BLENDED QUIZ ENGINE
   Multiple Choice + Type Answer
   Lazy‑Loading Compatible
============================ */

function renderQuizTab() {
    const container = document.getElementById("quiz");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Quiz (${currentLevel})</h3>
        <p>Mixed practice: sometimes multiple choice, sometimes type the answer.</p>

        <div id="quiz-area"></div>
        <div id="quiz-feedback" style="margin-top:10px;"></div>
        <div id="quiz-score-display" style="margin-top:10px;"></div>
    `;

    let correct = 0;
    let total = 0;

    const area = document.getElementById("quiz-area");
    const feedback = document.getElementById("quiz-feedback");
    const scoreDisplay = document.getElementById("quiz-score-display");

    function updateScore() {
        quizScore = total === 0 ? 0 : Math.round((correct / total) * 100);
        scoreDisplay.textContent = `Score: ${quizScore}% (${correct}/${total})`;
    }

    function nextQuestion() {
        const item = words[Math.floor(Math.random() * words.length)];
        const mode = Math.random() < 0.5 ? "mc" : "type";

        if (mode === "mc") {
            renderMultipleChoice(item);
        } else {
            renderTypeAnswer(item);
        }
    }

    function renderMultipleChoice(item) {
        const options = generateOptions(item);

        area.innerHTML = `
            <div class="quiz-block">
                <strong>Spanish:</strong> ${item.es}
                <p>Select the correct English translation:</p>
                <div id="mc-options"></div>
            </div>
        `;

        const optContainer = document.getElementById("mc-options");

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "secondary-btn";
            btn.style.margin = "5px";
            btn.textContent = opt;
            btn.onclick = () => {
                total++;
                if (opt === item.en) {
                    correct++;
                    feedback.textContent = "✅ Correct!";
                } else {
                    feedback.textContent = `❌ Incorrect. Correct answer: ${item.en}`;
                }
                updateScore();
                setTimeout(nextQuestion, 600);
            };
            optContainer.appendChild(btn);
        });
    }

    function generateOptions(correctItem) {
        const words = LEVEL_WORDS[currentLevel];
        const options = [correctItem.en];

        while (options.length < 4) {
            const random = words[Math.floor(Math.random() * words.length)].en;
            if (!options.includes(random)) options.push(random);
        }

        return shuffle(options);
    }

    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    function renderTypeAnswer(item) {
        area.innerHTML = `
            <div class="quiz-block">
                <strong>Spanish:</strong> ${item.es}
                <p>Type the English translation:</p>
                <input id="quiz-input" class="input-field" placeholder="English answer">
                <button class="primary-btn" id="quiz-submit">Submit</button>
            </div>
        `;

        const input = document.getElementById("quiz-input");
        const submit = document.getElementById("quiz-submit");

        submit.onclick = () => {
            const ans = input.value.trim().toLowerCase();
            total++;

            if (ans === item.en.toLowerCase()) {
                correct++;
                feedback.textContent = "✅ Correct!";
            } else {
                feedback.textContent = `❌ Incorrect. Correct answer: ${item.en}`;
            }

            updateScore();
            setTimeout(nextQuestion, 600);
        };
    }

    nextQuestion();
    updateScore();
}

/* ============================
   SENTENCE BUILDER (CEFR‑Scaled)
   Everyday Conversations
   Lazy‑Loading Compatible
============================ */

const SENTENCE_TARGETS = {
    A1: [
        {
            prompt: "Introduce yourself politely.",
            keywords: ["soy", "me llamo"],
            feedback: "Great for basic introductions."
        },
        {
            prompt: "Ask for something in a shop or café.",
            keywords: ["quiero", "por favor"],
            feedback: "Useful for everyday requests."
        },
        {
            prompt: "Say where something is.",
            keywords: ["está", "aquí", "allí"],
            feedback: "Good location practice."
        }
    ],

    A2: [
        {
            prompt: "Explain what you need in a store or pharmacy.",
            keywords: ["necesito", "para"],
            feedback: "Great for real‑world errands."
        },
        {
            prompt: "Talk about your plans for today.",
            keywords: ["voy a", "mañana", "hoy"],
            feedback: "Strong future‑tense practice."
        },
        {
            prompt: "Describe your room or home.",
            keywords: ["hay", "tengo", "en mi"],
            feedback: "Useful descriptive practice."
        }
    ],

    B1: [
        {
            prompt: "Describe a past experience.",
            keywords: ["fui", "hice", "vi"],
            feedback: "Good past‑tense storytelling."
        },
        {
            prompt: "Talk about your job or studies.",
            keywords: ["trabajo", "estudio", "porque"],
            feedback: "Useful for everyday conversations."
        },
        {
            prompt: "Explain your future goals.",
            keywords: ["quiero", "me gustaría", "plan"],
            feedback: "Strong future‑planning practice."
        }
    ]
};

function renderBuildTab() {
    const container = document.getElementById("build");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];
    const targets = SENTENCE_TARGETS[currentLevel] || [];

    const target = targets[Math.floor(Math.random() * targets.length)];

    container.innerHTML = `
        <h3>Sentence Builder (${currentLevel})</h3>
        <p>Build a natural Spanish sentence for everyday conversation.</p>

        <div style="
            padding:12px;
            border-radius:10px;
            border:1px solid #cbd5e1;
            margin-bottom:12px;
        ">
            <strong>Target:</strong>
            <span id="build-target" style="color:#475569;">${target.prompt}</span>
        </div>

        <textarea id="build-output" class="input-field" rows="3"
            placeholder="Build your Spanish sentence here..."></textarea>

        <div id="build-words" style="margin-top:12px;"></div>

        <button class="primary-btn" id="build-check" style="margin-top:12px;">Check Sentence</button>

        <div id="build-feedback" style="margin-top:12px; font-size:14px; color:#475569;"></div>
    `;

    const wordBank = document.getElementById("build-words");
    const output = document.getElementById("build-output");
    const feedback = document.getElementById("build-feedback");

    words.forEach(w => {
        const pill = document.createElement("span");
        pill.className = "word-pill";
        pill.textContent = w.es;
        pill.onclick = () => {
            output.value = (output.value + " " + w.es).trim();
        };
        wordBank.appendChild(pill);
    });

    document.getElementById("build-check").onclick = () => {
        const text = output.value.trim();
        if (!text) {
            feedback.textContent = "Write or build a sentence first.";
            return;
        }

        let score = Math.min(100, text.split(" ").length * 10);

        let keywordHits = 0;
        target.keywords.forEach(k => {
            if (text.toLowerCase().includes(k.toLowerCase())) keywordHits++;
        });

        score += keywordHits * 10;
        score = Math.min(score, 100);

        buildScore = score;

        feedback.textContent = `Estimated strength: ${score}% — ${target.feedback}`;
    };
}

/* ============================
   CONVERSATION BUILDER (CEFR‑Scaled)
   Everyday Dialogue Practice
   Lazy‑Loading Compatible
============================ */

const CONVERSATION_PROMPTS = {
    A1: [
        {
            prompt: "Hola, ¿cómo estás?",
            keywords: ["bien", "mal", "más o menos"],
            feedback: "Great basic greeting reply."
        },
        {
            prompt: "¿De dónde eres?",
            keywords: ["soy de", "vengo de"],
            feedback: "Good introduction practice."
        },
        {
            prompt: "¿Quieres comer algo?",
            keywords: ["sí", "no", "quiero"],
            feedback: "Useful everyday decision making."
        }
    ],
    A2: [
        {
            prompt: "¿Qué planes tienes para hoy?",
            keywords: ["voy a", "quiero", "planeo"],
            feedback: "Strong future‑tense practice."
        },
        {
            prompt: "¿Puedes ayudarme con esta tarea?",
            keywords: ["claro", "puedo", "cómo"],
            feedback: "Useful for real‑world interactions."
        },
        {
            prompt: "¿Cómo es tu casa?",
            keywords: ["hay", "tengo", "es"],
            feedback: "Good descriptive practice."
        }
    ],
    B1: [
        {
            prompt: "Cuéntame sobre tu trabajo o estudios.",
            keywords: ["trabajo", "estudio", "porque"],
            feedback: "Great everyday conversation topic."
        },
        {
            prompt: "¿Qué hiciste el fin de semana?",
            keywords: ["fui", "hice", "vi"],
            feedback: "Strong past‑tense storytelling."
        },
        {
            prompt: "¿Qué metas tienes para el futuro?",
            keywords: ["quiero", "me gustaría", "plan"],
            feedback: "Excellent future‑planning practice."
        }
    ]
};

function renderConversationTab() {
    const container = document.getElementById("conv");
    if (!container) return;

    const prompts = CONVERSATION_PROMPTS[currentLevel] || [];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    container.innerHTML = `
        <h3>Conversation Builder (${currentLevel})</h3>
        <p>Write a natural Spanish reply to the prompt.</p>

        <div style="
            padding:12px;
            border-radius:10px;
            border:1px solid #cbd5e1;
            margin-bottom:12px;
        ">
            <strong>Prompt:</strong>
            <span id="conv-prompt" style="color:#475569;">${prompt.prompt}</span>
        </div>

        <textarea id="conv-input" class="input-field" rows="4"
            placeholder="Write your Spanish reply..."></textarea>

        <button class="primary-btn" id="conv-check" style="margin-top:12px;">Check Reply</button>

        <div id="conv-feedback" style="margin-top:12px; font-size:14px; color:#475569;"></div>
    `;

    const input = document.getElementById("conv-input");
    const feedback = document.getElementById("conv-feedback");

    document.getElementById("conv-check").onclick = () => {
        const text = input.value.trim();
        if (!text) {
            feedback.textContent = "Write your reply first.";
            return;
        }

        let score = Math.min(100, text.split(" ").length * 8);

        let keywordHits = 0;
        prompt.keywords.forEach(k => {
            if (text.toLowerCase().includes(k.toLowerCase())) keywordHits++;
        });

        score += keywordHits * 10;
        score = Math.min(score, 100);

        convCount++;

        feedback.textContent = `Reply strength: ${score}% — ${prompt.feedback}`;
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
        block.className = "tab-content smart-block";
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
        block.className = "tab-content grammar-block";
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
   RENDER ALL TABS (for level changes)
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
   RENDER SINGLE TAB (lazy)
============================ */

function renderTab(tabId) {
    switch (tabId) {
        case "listen": renderListenTab(); break;
        case "flash": renderFlashcardsTab(); break;
        case "quiz": renderQuizTab(); break;
        case "build": renderBuildTab(); break;
        case "conv": renderConversationTab(); break;
        case "smart": renderSmartTab(); break;
        case "daily": renderDailyTab(); break;
        case "badges": renderBadgesTab(); break;
        case "grammar": renderGrammarTab(); break;
        case "scenario": renderScenarioTab(); break;
        case "certificates": /* certificates tab has static buttons */ break;
    }
}

/* ============================
   INIT
============================ */

document.addEventListener("DOMContentLoaded", () => {
    updateDashboard();

    const levelSelect = document.getElementById("level-select");
    if (levelSelect) currentLevel = levelSelect.value;

    const firstTabBtn = document.querySelector(".tab-btn");
    showTab("listen", { target: firstTabBtn });
});
