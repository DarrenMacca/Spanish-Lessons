/* ============================
   GLOBAL STATE
============================ */

let currentLevel = "A1";
let quizScore = 0;
let buildScore = 0;
let buildStreak = 0;
let convCount = 0;
let selectedVoice = "female";

let autoPlayActive = false;
let autoPlayPaused = false;
let autoPlayIndex = 0;

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
        { en: "sorry", es: "lo siento" },
        { en: "excuse me", es: "perdón" },
        { en: "and", es: "y" },
        { en: "but", es: "pero" },
        { en: "or", es: "o" },
        { en: "because", es: "porque" },
        { en: "with", es: "con" },
        { en: "without", es: "sin" },
        { en: "also", es: "también" },
        { en: "very", es: "muy" },
        { en: "a little", es: "un poco" },
        { en: "more", es: "más" },
        { en: "I", es: "yo" },
        { en: "you", es: "tú" },
        { en: "he", es: "él" },
        { en: "she", es: "ella" },
        { en: "we", es: "nosotros" },
        { en: "they", es: "ellos" },
        { en: "water", es: "agua" },
        { en: "food", es: "comida" },
        { en: "coffee", es: "café" },
        { en: "tea", es: "té" },
        { en: "milk", es: "leche" },
        { en: "bread", es: "pan" },
        { en: "beer", es: "cerveza" },
        { en: "steak", es: "bistec" },
        { en: "potato chips", es: "papas fritas" },
        { en: "egg", es: "huevo" },
        { en: "fruit", es: "fruta" },
        { en: "apple", es: "manzana" },
        { en: "orange", es: "naranja" },
        { en: "banana", es: "plátano" },
        { en: "chicken", es: "pollo" },
        { en: "fish", es: "pescado" },
        { en: "soup", es: "sopa" },
        { en: "salad", es: "ensalada" },
        { en: "rice", es: "arroz" },
        { en: "beans", es: "frijoles" },
        { en: "cheese", es: "queso" },
        { en: "butter", es: "mantequilla" },
        { en: "sugar", es: "azúcar" },
        { en: "salt", es: "sal" },
        { en: "bathroom", es: "baño" },
        { en: "hotel", es: "hotel" },
        { en: "room", es: "habitación" },
        { en: "key", es: "llave" },
        { en: "table", es: "mesa" },
        { en: "chair", es: "silla" },
        { en: "menu", es: "menú" },
        { en: "bill", es: "cuenta" },
        { en: "waiter", es: "camarero" },
        { en: "I want", es: "quiero" },
        { en: "I would like", es: "me gustaría" },
        { en: "bus", es: "autobús" },
        { en: "train", es: "tren" },
        { en: "ticket", es: "boleto" },
        { en: "station", es: "estación" },
        { en: "airport", es: "aeropuerto" },
        { en: "how much?", es: "¿cuánto cuesta?" },
        { en: "cheap", es: "barato" },
        { en: "expensive", es: "caro" },
        { en: "open", es: "abierto" },
        { en: "closed", es: "cerrado" },
        { en: "help", es: "ayuda" },
        { en: "doctor", es: "doctor" },
        { en: "police", es: "policía" },
        { en: "I am lost", es: "estoy perdido" }
    ],

    A2: [
        { en: "I need", es: "necesito" },
        { en: "I am looking for", es: "busco" },
        { en: "I don't understand", es: "no entiendo" },
        { en: "can you help me?", es: "¿puede ayudarme?" },
        { en: "breakfast", es: "desayuno" },
        { en: "lunch", es: "almuerzo" },
        { en: "dinner", es: "cena" },
        { en: "reservation", es: "reserva" },
        { en: "table for two", es: "mesa para dos" },
        { en: "allergic to", es: "alérgico a" },
        { en: "city center", es: "centro de la ciudad" },
        { en: "pharmacy", es: "farmacia" },
        { en: "supermarket", es: "supermercado" },
        { en: "turn left", es: "gire a la izquierda" },
        { en: "turn right", es: "gire a la derecha" },
        { en: "straight ahead", es: "todo recto" },
        { en: "receipt", es: "recibo" },
        { en: "card", es: "tarjeta" },
        { en: "cash", es: "efectivo" },
        { en: "discount", es: "descuento" },
        { en: "size", es: "talla" },
        { en: "I feel sick", es: "me siento enfermo" },
        { en: "I need a doctor", es: "necesito un doctor" },
        { en: "I lost my passport", es: "perdí mi pasaporte" },
        { en: "I think that", es: "creo que" },
        { en: "I prefer", es: "prefiero" },
        { en: "I am going to", es: "voy a" },
        { en: "I want to go", es: "quiero ir" }
    ],

    B1: [
        { en: "I have been learning Spanish", es: "he estado aprendiendo español" },
        { en: "in my free time", es: "en mi tiempo libre" },
        { en: "I enjoy traveling", es: "disfruto viajar" },
        { en: "I work as a developer", es: "trabajo como desarrollador" },
        { en: "I would like to improve", es: "me gustaría mejorar" },
        { en: "in my opinion", es: "en mi opinión" },
        { en: "I agree", es: "estoy de acuerdo" },
        { en: "I disagree", es: "no estoy de acuerdo" },
        { en: "it depends", es: "depende" },
        { en: "real situations", es: "situaciones reales" },
        { en: "daily conversations", es: "conversaciones diarias" },
        { en: "future plans", es: "planes futuros" },
        { en: "past experiences", es: "experiencias pasadas" },
        { en: "meeting", es: "reunión" },
        { en: "project", es: "proyecto" },
        { en: "deadline", es: "fecha límite" },
        { en: "task", es: "tarea" },
        { en: "insurance", es: "seguro" },
        { en: "accident", es: "accidente" },
        { en: "lost luggage", es: "equipaje perdido" },
        { en: "I went", es: "fui" },
        { en: "I saw", es: "vi" },
        { en: "I did", es: "hice" },
        { en: "I met", es: "conocí" },
        { en: "I learned", es: "aprendí" }
    ]
};

/* ============================
   LISTEN CATEGORIES
============================ */

const LISTEN_CATEGORIES = {
    "Greetings & Basics": ["hola", "adiós", "por favor", "gracias", "sí", "no", "lo siento", "perdón"],
    "Connectors": ["y", "pero", "o", "porque", "también", "muy", "un poco", "más"],
    "People & Pronouns": ["yo", "tú", "él", "ella", "nosotros", "ellos"],
    "Food & Drink": [
        "agua", "comida", "café", "té", "leche", "pan",
        "cerveza", "bistec", "papas fritas", "huevo",
        "fruta", "manzana", "naranja", "plátano",
        "pollo", "pescado", "sopa", "ensalada",
        "arroz", "frijoles", "queso", "mantequilla",
        "azúcar", "sal"
    ],
    "Café & Restaurant": ["menú", "cuenta", "camarero", "quiero", "me gustaría"],
    "Places & Objects": ["baño", "hotel", "habitación", "llave", "mesa", "silla"],
    "Travel": ["autobús", "tren", "boleto", "estación", "aeropuerto"],
    "Shopping": ["¿cuánto cuesta?", "barato", "caro", "abierto", "cerrado"],
    "Emergency": ["ayuda", "doctor", "policía", "estoy perdido"]
};

/* ============================
   GRAMMAR PACK
============================ */

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

/* ============================
   SCENARIOS PACK
============================ */

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
   CONVERSATION PROMPTS
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

/* ============================
   STUDENT NAME STORAGE
============================ */

function saveStudentName() {
    const input = document.getElementById("student-name");
    if (!input) return;

    const name = input.value.trim();
    if (!name) return;

    try {
        localStorage.setItem("studentName", name);
    } catch (e) {
        console.warn("Unable to save student name:", e);
    }

    const status = document.getElementById("name-status");
    if (status) {
        status.textContent = `Name saved: ${name} — this will appear on your certificates and messages.`;
    }
}

function loadStudentName() {
    const input = document.getElementById("student-name");
    if (!input) return;

    let stored = null;
    try {
        stored = localStorage.getItem("studentName");
    } catch (e) {
        console.warn("Unable to load student name:", e);
    }

    if (stored) input.value = stored;
}

/* ============================
   UNIVERSAL AUDIO ENGINE
============================ */

function getLatAmVoice() {
    const voices = speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;

    // Female LATAM (Sabina)
    const femalePatterns = ["sabina", "mexico", "latam"];

    // Male Spanish (Diego)
    const malePatterns = ["diego", "spanish", "español"];

    const patterns = selectedVoice === "female_latam"
        ? femalePatterns
        : malePatterns;

    const match = voices.find(v =>
        patterns.some(p => v.name.toLowerCase().includes(p))
    );

    if (match) return match;

    // Fallback: any Spanish voice
    const fallback = voices.find(v => v.lang.startsWith("es"));
    return fallback || voices[0];
}




function speakSpanish(text) {
    if (typeof speechSynthesis === "undefined" || typeof SpeechSynthesisUtterance === "undefined") {
        console.warn("Speech synthesis not supported in this browser.");
        return;
    }

    const rateControl = document.getElementById("rate");
    const rate = rateControl ? parseFloat(rateControl.value) || 1.0 : 1.0;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    utter.rate = rate;

    const voice = getLatAmVoice();
    if (voice) utter.voice = voice;

    try {
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
    } catch (e) {
        console.warn("Error during speech synthesis:", e);
    }
}

/* ============================
   LISTEN TAB AUDIO HELPERS
============================ */

function playSingleWord(index) {
    const words = LEVEL_WORDS[currentLevel] || [];
    const item = words[index];
    if (!item) return;
    speakSpanish(item.es);
}

function autoPlayListen() {
    const words = LEVEL_WORDS[currentLevel] || [];
    if (!words.length) return;

    autoPlayActive = true;
    autoPlayPaused = false;
    autoPlayIndex = 0;

    speechSynthesis.cancel();

    function playNext() {
        if (!autoPlayActive || autoPlayPaused) return;
        if (autoPlayIndex >= words.length) {
            autoPlayActive = false;
            return;
        }

                const item = words[autoPlayIndex];
        autoPlayIndex++;

        if (!item) {
            playNext();
            return;
        }

        const rateControl = document.getElementById("rate");
        const rate = rateControl ? parseFloat(rateControl.value) || 1.0 : 1.0;

        const utter = new SpeechSynthesisUtterance(item.es);
        utter.lang = "es-MX";
        utter.rate = rate;

        const voice = getLatAmVoice();
        if (voice) utter.voice = voice;

        utter.onend = () => {
            if (autoPlayActive && !autoPlayPaused) {
                setTimeout(playNext, 400);
            }
        };

        speechSynthesis.speak(utter);
    }

    playNext();
}

function stopAutoPlay() {
    autoPlayActive = false;
    autoPlayPaused = false;
    autoPlayIndex = 0;
    speechSynthesis.cancel();
}

function pauseAutoPlay() {
    autoPlayPaused = true;
    speechSynthesis.pause();
}

function resumeAutoPlay() {
    if (!autoPlayActive) return;
    autoPlayPaused = false;
    speechSynthesis.resume();
}

/* ============================
   LISTEN TAB RENDERING
============================ */

function renderListenTab() {
    const container = document.getElementById("listen");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Listen & Repeat (${currentLevel})</h3>

        <div style="margin-bottom:15px; display:flex; flex-wrap:wrap; gap:10px;">
            <button class="primary-btn" onclick="autoPlayListen()">▶️ Play All</button>
            <button class="secondary-btn" onclick="stopAutoPlay()">⏹️ Stop</button>
            <button class="secondary-btn" onclick="pauseAutoPlay()">⏸️ Pause</button>
            <button class="primary-btn" onclick="resumeAutoPlay()">▶️ Resume</button>
        </div>

        <input id="listen-search" class="input-field" placeholder="Search words...">

        <div id="listen-categories"></div>
    `;

    const searchInput = document.getElementById("listen-search");
    const catContainer = document.getElementById("listen-categories");

    if (!catContainer || !searchInput) return;

    const categoryIcons = {
        "Greetings & Basics": "👋",
        "Connectors": "🔗",
        "People & Pronouns": "🧑",
        "Food & Drink": "🍎",
        "Café & Restaurant": "☕",
        "Places & Objects": "🏨",
        "Travel": "🚌",
        "Shopping": "🛒",
        "Emergency": "⚠️"
    };

    function renderCategories(filterText = "") {
        try { speechSynthesis.cancel(); } catch(e) {}

        catContainer.innerHTML = "";

        Object.entries(LISTEN_CATEGORIES).forEach(([categoryName, esList]) => {
            let catWords = words.filter(w => esList.includes(w.es));
            if (!catWords.length) return;

            if (filterText) {
                const lower = filterText.toLowerCase();
                catWords = catWords.filter(w =>
                    w.es.toLowerCase().includes(lower) ||
                    w.en.toLowerCase().includes(lower)
                );
                if (!catWords.length) return;
            }

            const wrapper = document.createElement("div");
            wrapper.className = "listen-category-wrapper";
            wrapper.style.marginTop = "15px";

            const header = document.createElement("div");
            header.className = "listen-category-header";
            header.style.cursor = "pointer";
            header.style.padding = "10px";
            header.style.border = "1px solid rgba(255,255,255,0.2)";
            header.style.borderRadius = "8px";
            header.style.color = "#a5f3fc";
            header.style.fontWeight = "600";
            header.style.display = "flex";
            header.style.justifyContent = "space-between";
            header.style.alignItems = "center";

            header.innerHTML = `
                <span>${categoryIcons[categoryName]} ${categoryName}</span>
                <span class="listen-arrow">▼</span>
            `;

            const content = document.createElement("div");
            content.className = "listen-category-content";

            const grid = document.createElement("div");
            grid.className = "listen-grid";
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(160px, 1fr))";
            grid.style.gap = "12px";

            catWords.forEach(w => {
                const pill = document.createElement("button");
                pill.className = "word-pill";
                pill.style.width = "100%";
                pill.textContent = `${w.es} (${w.en})`;
                pill.onclick = () => {
                    const idx = words.indexOf(w);
                    if (idx >= 0) playSingleWord(idx);
                };
                grid.appendChild(pill);
            });

            content.appendChild(grid);

            header.onclick = () => {
                const arrow = header.querySelector(".listen-arrow");
                const isOpen = content.classList.contains("open");

                const allContents = document.querySelectorAll(".listen-category-content");
                const allArrows = document.querySelectorAll(".listen-arrow");

                allContents.forEach(c => c.classList.remove("open"));
                allArrows.forEach(a => a.style.transform = "rotate(0deg)");

                if (!isOpen) {
                    content.classList.add("open");
                    arrow.style.transform = "rotate(180deg)";
                }
            };

            wrapper.appendChild(header);
            wrapper.appendChild(content);
            catContainer.appendChild(wrapper);
        });
    }

    renderCategories();

    searchInput.oninput = () => {
        const text = searchInput.value.trim();
        renderCategories(text);
    };
}

/* ============================
   FLASHCARDS
============================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

    container.innerHTML = `
        <h3>Flashcards (${currentLevel})</h3>
        <p>Tap a card to flip and hear the Spanish pronunciation.</p>

        <div id="flash-grid"
             style="display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:20px; margin-top:20px;">
        </div>
    `;

    const grid = document.getElementById("flash-grid");
    if (!grid) return;

    words.forEach(item => {
        const wrapper = document.createElement("div");
        wrapper.className = "flip-wrapper";

        const card = document.createElement("div");
        card.className = "flip-card";

        const front = document.createElement("div");
        front.className = "flip-face flip-front word-pill";
        front.textContent = item.en;

        const back = document.createElement("div");
        back.className = "flip-face flip-back word-pill";
        back.textContent = item.es;

        card.appendChild(front);
        card.appendChild(back);
        wrapper.appendChild(card);

        wrapper.onclick = () => {
            card.classList.toggle("flipped");

            if (card.classList.contains("flipped")) {
                speakSpanish(item.es);
            }
        };

        grid.appendChild(wrapper);
    });
}

/* ============================
   QUIZ ENGINE
============================ */

function renderQuizTab() {
    const container = document.getElementById("quiz");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];
    if (!words.length) {
        container.innerHTML = "<p>No words available for this level.</p>";
        return;
    }

    let incorrectList = [];
    const TOTAL_QUESTIONS = 10;
    let correct = 0;
    let total = 0;

    container.innerHTML = `
        <h3>Quiz (${currentLevel})</h3>
        <p>Mixed practice: multiple choice + type the answer.</p>

        <div id="quiz-progress-wrapper" style="margin:10px 0;">
            <div id="quiz-progress-bar" style="
                height: 12px;
                width: 0%;
                background: #0ea5e9;
                border-radius: 8px;
                transition: width 0.3s ease;
            "></div>
        </div>

        <div id="quiz-area"></div>
        <div id="quiz-feedback" style="margin-top:10px;"></div>
        <div id="quiz-score-display" style="margin-top:10px;"></div>

        <button id="review-btn" class="secondary-btn hidden" style="margin-top:15px;">
            Review Incorrect Answers
        </button>

        <div id="review-area" style="margin-top:15px;"></div>
    `;

    const area = document.getElementById("quiz-area");
    const feedback = document.getElementById("quiz-feedback");
    const scoreDisplay = document.getElementById("quiz-score-display");
    const progressBar = document.getElementById("quiz-progress-bar");
    const reviewBtn = document.getElementById("review-btn");
    const reviewArea = document.getElementById("review-area");

    function updateProgress() {
        if (!progressBar) return;
        const pct = (total / TOTAL_QUESTIONS) * 100;
        progressBar.style.width = pct + "%";
    }

    function updateScore() {
        if (!scoreDisplay) return;
        quizScore = total === 0 ? 0 : Math.round((correct / total) * 100);
        scoreDisplay.textContent = `Score: ${quizScore}% (${correct}/${total})`;
        updateDashboard();
    }

    function nextQuestion() {
        if (!area) return;

        if (total >= TOTAL_QUESTIONS) {
            finishQuiz();
            return;
        }

        const item = words[Math.floor(Math.random() * words.length)];
        const mode = Math.random() < 0.5 ? "mc" : "type";

        if (mode === "mc") {
            renderMultipleChoice(item);
        } else {
            renderTypeAnswer(item);
        }
    }

    function finishQuiz() {
        if (!area || !feedback || !reviewBtn) return;
        area.innerHTML = `<h4>Quiz Complete!</h4>`;
        feedback.textContent = "";

        if (incorrectList.length > 0) {
            reviewBtn.classList.remove("hidden");
        }
    }

    function renderMultipleChoice(item) {
        if (!area || !feedback) return;

        const options = generateOptions(item);

        area.innerHTML = `
            <div class="quiz-block">
                <strong>Spanish:</strong> ${item.es}
                <p>Select the correct English translation:</p>
                <div id="mc-options"></div>
            </div>
        `;

        const optContainer = document.getElementById("mc-options");
        if (!optContainer) return;

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "secondary-btn";
            btn.style.margin = "5px";
            btn.textContent = opt;

            btn.onclick = () => {
                total++;
                updateProgress();

                if (opt === item.en) {
                    correct++;
                    feedback.textContent = "✅ Correct!";
                } else {
                    feedback.textContent = `❌ Incorrect. Correct answer: ${item.en}`;
                    incorrectList.push({ es: item.es, correct: item.en });
                }

                updateScore();
                setTimeout(nextQuestion, 600);
            };

            optContainer.appendChild(btn);
        });
    }

    function generateOptions(correctItem) {
        const options = [correctItem.en];

        while (options.length < 4 && LEVEL_WORDS[currentLevel] && LEVEL_WORDS[currentLevel].length) {
            const random = LEVEL_WORDS[currentLevel][Math.floor(Math.random() * LEVEL_WORDS[currentLevel].length)].en;
            if (!options.includes(random)) options.push(random);
        }

        return options.sort(() => Math.random() - 0.5);
    }

    function renderTypeAnswer(item) {
        if (!area || !feedback) return;

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
        if (!input || !submit) return;

        function processAnswer() {
            const ans = input.value.trim().toLowerCase();
            total++;
            updateProgress();

            if (ans === item.en.toLowerCase()) {
                correct++;
                feedback.textContent = "✅ Correct!";
            } else {
                feedback.textContent = `❌ Incorrect. Correct answer: ${item.en}`;
                incorrectList.push({ es: item.es, correct: item.en });
            }

            updateScore();
            setTimeout(nextQuestion, 600);
        }

        submit.onclick = processAnswer;

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                processAnswer();
            }
        });
    }

    if (reviewBtn && reviewArea) {
        reviewBtn.onclick = () => {
            reviewArea.innerHTML = `
                <h4>Review Incorrect Answers</h4>
                <p>Tap a word to hear the Spanish pronunciation.</p>
            `;

            incorrectList.forEach(item => {
                const block = document.createElement("div");
                block.className = "word-pill";
                block.style.marginTop = "8px";
                block.textContent = `${item.es} → ${item.correct}`;
                block.onclick = () => speakSpanish(item.es);
                reviewArea.appendChild(block);
            });
        };
    }

    nextQuestion();
    updateScore();
    updateProgress();
}

/* ============================
   SENTENCE BUILDER
============================ */

function renderBuildTab() {
    const container = document.getElementById("build");
    if (!container) return;

    const levelWords = LEVEL_WORDS[currentLevel] || [];

    const promptPairs = [
        { en: "I want water", es: ["quiero", "agua"] },
        { en: "I want milk", es: ["quiero", "leche"] },
        { en: "I want coffee", es: ["quiero", "café"] },
        { en: "I want tea", es: ["quiero", "té"] },
        { en: "I want beer", es: ["quiero", "cerveza"] },
        { en: "I want food", es: ["quiero", "comida"] },
        { en: "I want bread", es: ["quiero", "pan"] },
        { en: "I want an egg", es: ["quiero", "un", "huevo"] },
        { en: "I want potato chips", es: ["quiero", "papas", "fritas"] },
        { en: "I want steak", es: ["quiero", "bistec"] },
        { en: "I want fruit", es: ["quiero", "fruta"] },
        { en: "I want an apple", es: ["quiero", "una", "manzana"] },
        { en: "I want an orange", es: ["quiero", "una", "naranja"] },
        { en: "I want a banana", es: ["quiero", "un", "plátano"] },
        { en: "I want chicken", es: ["quiero", "pollo"] },
        { en: "I want fish", es: ["quiero", "pescado"] },
        { en: "I want soup", es: ["quiero", "sopa"] },
        { en: "I want salad", es: ["quiero", "ensalada"] },
        { en: "I want rice", es: ["quiero", "arroz"] },
        { en: "I want beans", es: ["quiero", "frijoles"] },
        { en: "I want beer and potato chips", es: ["quiero", "cerveza", "y", "papas", "fritas"] },
        { en: "I want steak and water", es: ["quiero", "bistec", "y", "agua"] },
        { en: "I want eggs and coffee", es: ["quiero", "huevos", "y", "café"] },
        { en: "I want rice and beans", es: ["quiero", "arroz", "y", "frijoles"] },
        { en: "I want bread and cheese", es: ["quiero", "pan", "y", "queso"] },
        { en: "I want fruit and water", es: ["quiero", "fruta", "y", "agua"] },
        { en: "I want the menu", es: ["quiero", "el", "menú"] },
        { en: "I want the bill please", es: ["quiero", "la", "cuenta", "por favor"] },
        { en: "Where is the bathroom?", es: ["dónde", "está", "el", "baño"] },
        { en: "I need help", es: ["necesito", "ayuda"] },
        { en: "I am lost", es: ["estoy", "perdido"] },
        { en: "Where is the train station?", es: ["dónde", "está", "la", "estación", "de", "tren"] },
        { en: "Where is the hotel?", es: ["dónde", "está", "el", "hotel"] },
        { en: "Where is my room?", es: ["dónde", "está", "mi", "habitación"] },
        { en: "I want a ticket", es: ["quiero", "un", "boleto"] },
        { en: "I want coffee and milk", es: ["quiero", "café", "y", "leche"] },
        { en: "I want water and bread", es: ["quiero", "agua", "y", "pan"] },
        { en: "Where is the airport?", es: ["dónde", "está", "el", "aeropuerto"] },
        { en: "I need a doctor", es: ["necesito", "un", "doctor"] }
    ];

    function generateSpanishSentence(pair, levelWords) {
        const base = [...pair.es];

        const connectors = ["y", "pero", "también", "con", "sin"];
        const availableConnectors = levelWords
            .map(w => w.es)
            .filter(w => connectors.includes(w));

        if (availableConnectors.length > 0 && Math.random() < 0.25) {
            const extra = availableConnectors[Math.floor(Math.random() * availableConnectors.length)];
            base.push(extra);
        }

        return base;
    }

    const pair = promptPairs[Math.floor(Math.random() * promptPairs.length)];
    const englishPrompt = pair.en;

    const spanishWordsNeeded = generateSpanishSentence(pair, levelWords);
    const spanishSentence = spanishWordsNeeded.join(" ");

    const shuffledWords = createWordGridWithDistractors(spanishWordsNeeded, levelWords);

    container.innerHTML = `
        <h3>Sentence Builder (${currentLevel})</h3>
        <p>Read the English prompt, listen to the Spanish sentence, then rebuild it using the word grid.</p>

        <div style="margin-bottom:8px; color:#e2e8f0; font-size:14px;">
            Streak: <span id="build-streak-value">${buildStreak}</span> 🔥
        </div>

        <div style="
            padding:14px;
            border-radius:10px;
            border:1px solid #cbd5e1;
            margin-bottom:12px;
            background:rgba(255,255,255,0.08);
        ">
            <strong style="color:white;">English Prompt:</strong>
            <span style="color:white; font-size:18px; font-weight:600;">
                ${englishPrompt}
            </span>
        </div>

        <button class="primary-btn" id="hear-target-btn" style="margin-bottom:10px;">
            ▶️ Hear Spanish Sentence
        </button>

        <button class="secondary-btn" id="hint-btn" style="margin-bottom:10px;">
            💡 Show Hint
        </button>

        <button class="secondary-btn" id="undo-btn" style="margin-bottom:10px;">
            ↩ Undo Last Word
        </button>

        <button class="secondary-btn" id="reset-btn" style="margin-bottom:15px;">
            🔄 Reset Answer
        </button>

        <textarea id="build-output" class="input-field" rows="3"
            placeholder="Rebuild the Spanish sentence here..."></textarea>

        <div id="build-words" style="
            margin-top:15px;
            display:grid;
            grid-template-columns:repeat(auto-fill, minmax(110px, 1fr));
            gap:10px;
        "></div>

        <button class="primary-btn" id="build-check" style="margin-top:12px;">Check Sentence</button>
        <button class="primary-btn" id="build-next" style="margin-top:12px;">Next Sentence ➜</button>

        <div id="build-feedback" style="margin-top:12px; font-size:14px; color:#e2e8f0;"></div>

        <div id="build-celebration" style="margin-top:10px;"></div>
    `;

    const wordGrid = document.getElementById("build-words");
    const output = document.getElementById("build-output");
    const feedback = document.getElementById("build-feedback");
    const hearBtn = document.getElementById("hear-target-btn");
    const hintBtn = document.getElementById("hint-btn");
    const resetBtn = document.getElementById("reset-btn");
    const undoBtn = document.getElementById("undo-btn");
    const checkBtn = document.getElementById("build-check");
    const nextBtn = document.getElementById("build-next");
    const streakValue = document.getElementById("build-streak-value");
    const celebrationBox = document.getElementById("build-celebration");

    if (!wordGrid || !output || !feedback || !hearBtn || !hintBtn || !resetBtn || !undoBtn || !checkBtn || !nextBtn || !streakValue || !celebrationBox) return;

    hearBtn.onclick = () => {
        speakSpanish(spanishSentence);
    };

    hintBtn.onclick = () => {
        const hintBox = document.createElement("div");
        hintBox.style.marginTop = "10px";
        hintBox.style.padding = "10px";
        hintBox.style.border = "1px solid rgba(255,255,255,0.2)";
        hintBox.style.borderRadius = "8px";
        hintBox.style.color = "#e2e8f0";

        const firstWord = spanishWordsNeeded[0];
        const lastWord = spanishWordsNeeded[spanishWordsNeeded.length - 1];

        hintBox.innerHTML = `
            <strong>Hints:</strong><br>
            • Starts with: <span style="color:#a5f3fc;">${firstWord}</span><br>
            • Ends with: <span style="color:#a5f3fc;">${lastWord}</span><br>
            • Word count: <span style="color:#a5f3fc;">${spanishWordsNeeded.length}</span>
        `;

        hintBtn.after(hintBox);
        hintBtn.disabled = true;
    };

    resetBtn.onclick = () => {
        output.value = "";
        feedback.textContent = "";
        celebrationBox.innerHTML = "";
    };

    undoBtn.onclick = () => {
        const current = output.value.trim();
        if (!current) return;
        const parts = current.split(/\s+/);
        parts.pop();
        output.value = parts.join(" ");
    };

    shuffledWords.forEach(w => {
        const pill = document.createElement("button");
        pill.className = "word-pill build-pill";
        pill.textContent = w;

        pill.onclick = () => {
            output.value = (output.value + " " + w).trim();
        };

        wordGrid.appendChild(pill);
    });

    checkBtn.onclick = () => {
        const learnerSentence = output.value.trim();
        celebrationBox.innerHTML = "";

        if (!learnerSentence) {
            feedback.textContent = "Write or build the Spanish sentence first.";
            return;
        }

        const targetTokens = spanishSentence.split(/\s+/);
        const learnerTokens = learnerSentence.split(/\s+/);

        const analysis = analyzeSentence(targetTokens, learnerTokens);
        buildScore = analysis.score;

        feedback.innerHTML = buildFeedbackMessage(analysis, spanishSentence);

        if (buildScore >= 90) {
            buildStreak += 1;
            streakValue.textContent = buildStreak.toString();
            showMiniCelebration(celebrationBox, buildScore);
        } else {
            buildStreak = 0;
            streakValue.textContent = "0";
        }

        updateDashboard();
    };

    nextBtn.onclick = () => {
        output.value = "";
        feedback.textContent = "";
        celebrationBox.innerHTML = "";
        hintBtn.disabled = false;
        renderBuildTab();
    };
}

function createWordGridWithDistractors(targetWords, levelWords) {
    const base = [...targetWords];

    const allSpanish = levelWords.map(w => w.es);
    const candidates = allSpanish.filter(w => !base.includes(w));

    const distractors = [];
    const maxDistractors = Math.min(3, candidates.length);
    while (distractors.length < maxDistractors) {
        const w = candidates[Math.floor(Math.random() * candidates.length)];
        if (!distractors.includes(w)) distractors.push(w);
    }

    const combined = base.concat(distractors);
    return combined.sort(() => Math.random() - 0.5);
}

function analyzeSentence(targetTokens, learnerTokens) {
    const targetSet = new Set(targetTokens);
    const learnerSet = new Set(learnerTokens);

    let correctCount = 0;
    let missing = [];
    let extra = [];
    let wrongOrder = false;

    learnerTokens.forEach(tok => {
        if (targetSet.has(tok)) {
            correctCount++;
        } else {
            extra.push(tok);
        }
    });

    targetTokens.forEach(tok => {
        if (!learnerSet.has(tok)) {
            missing.push(tok);
        }
    });

    const trimmedLearner = learnerTokens.filter(t => targetSet.has(t));
    const orderMatches = trimmedLearner.join(" ") === targetTokens.join(" ");
    wrongOrder = !orderMatches && correctCount > 0;

    const totalTarget = targetTokens.length;
    let baseScore = (correctCount / totalTarget) * 100;

    if (wrongOrder) {
        baseScore = Math.max(baseScore - 20, 0);
    }

    baseScore = Math.round(baseScore);

    return {
        score: baseScore,
        correctCount,
        totalTarget,
        missing,
        extra,
        wrongOrder
    };
}

function buildFeedbackMessage(analysis, spanishSentence) {
    const { score, correctCount, totalTarget, missing, extra, wrongOrder } = analysis;

    let msg = `Score: ${score}% — ${correctCount}/${totalTarget} key words correct.<br>`;

    if (score === 100) {
        msg += "✅ Perfect — you matched the Spanish sentence exactly!";
    } else if (score >= 80) {
        msg += "👍 Very good — just a small mistake.";
    } else if (score >= 50) {
        msg += "⚠️ Not bad — but there are several issues.";
    } else {
        msg += "❌ Needs work — let's review the sentence.";
    }

    if (missing.length > 0) {
        msg += `<br>• Missing words: <span style="color:#fca5a5;">${missing.join(", ")}</span>`;
    }

    if (extra.length > 0) {
        msg += `<br>• Extra words: <span style="color:#fca5a5;">${extra.join(", ")}</span>`;
    }

    if (wrongOrder) {
        msg += `<br>• Word order: <span style="color:#facc15;">Some words are in the wrong order.</span>`;
    }

    msg += `<br><br>Target sentence: "<span style="color:#a5f3fc;">${spanishSentence}</span>"`;

    return msg;
}

function showMiniCelebration(container, score) {
    container.innerHTML = `
        <div style="
            margin-top:8px;
            padding:10px;
            border-radius:10px;
            background:rgba(34,197,94,0.15);
            border:1px solid rgba(34,197,94,0.6);
            color:#bbf7d0;
            font-size:14px;
        ">
            🎉 Amazing! You scored ${score}% or higher.<br>
            Keep going — your Spanish production is improving fast.
        </div>
    `;
}
/* ============================
   CONVERSATION BUILDER
============================ */

function renderConversationTab() {
    const container = document.getElementById("conv");
    if (!container) return;

    const prompts = CONVERSATION_PROMPTS[currentLevel] || [];
    if (!prompts.length) {
        container.innerHTML = "<p>No conversation prompts for this level.</p>";
        return;
    }

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
    const checkBtn = document.getElementById("conv-check");

    if (!input || !feedback || !checkBtn) return;

    checkBtn.onclick = () => {
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
        updateDashboard();

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
    if (!promptsEl) return;

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
    if (!listEl) return;

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

    let studentName = "Learner";
    try {
        studentName = localStorage.getItem("studentName") || "Learner";
    } catch (e) {
        console.warn("Unable to read student name for badges:", e);
    }

    container.innerHTML = `
        <h3>Badges & Milestones</h3>
        <p>${studentName}, these unlock as you progress.</p>
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
    if (!listEl) return;

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
    if (!listEl) return;

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

    let studentName = "Learner";
    try {
        studentName = localStorage.getItem("studentName") || "Learner";
    } catch (e) {
        console.warn("Unable to read student name for certificate:", e);
    }

    const levelTitle = {
        A1: "A1 Beginner Spanish",
        A2: "A2 Elementary Spanish",
        B1: "B1 Intermediate Spanish"
    }[level] || level;

    preview.innerHTML = `
        <div class="certificate-container">
            <div class="certificate-title">Spanish CEFR Mastery Portal</div>
            <div class="certificate-student">Awarded to: ${studentName}</div>
            <div class="certificate-subtitle">${levelTitle}</div>
            <div class="certificate-statement">
                This certifies that ${studentName} has successfully completed the core path for level ${level}
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

    let studentName = "Learner";
    try {
        studentName = localStorage.getItem("studentName") || "Learner";
    } catch (e) {
        console.warn("Unable to read student name for dashboard:", e);
    }

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
            finalEl.textContent = `${studentName}, A1 Completed — Ready for A2`;
            triggerCelebration();
        } else {
            finalEl.textContent = `${studentName}, your course status: In progress`;
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
   TAB RENDERING
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
        case "certificates": break;
    }
}

function showTab(tabId, event) {
    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(c => c.classList.add("hidden"));

    const target = document.getElementById(tabId);
    if (target) target.classList.remove("hidden");

    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => btn.classList.remove("active"));

    if (event && event.target) {
        event.target.classList.add("active");
    }

    renderTab(tabId);
}

function changeLevel(level) {
    currentLevel = level || "A1";
    const status = document.getElementById("level-status");
    if (status) status.textContent = `Current Level: ${currentLevel}`;
    renderAllTabs();
}

/* ============================
   DOMContentLoaded
============================ */

function previewSelectedVoice() {
    const utter = new SpeechSynthesisUtterance("Hola, esta es una prueba de voz.");
    utter.lang = "es-MX";
    utter.rate = 1.0;

    const voice = getLatAmVoice();
    if (voice) utter.voice = voice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

document.getElementById("voice-preview-btn").onclick = previewSelectedVoice;




document.addEventListener("DOMContentLoaded", () => {
    try {
        const voiceSelect = document.getElementById("voice-select");
if (voiceSelect) {
    voiceSelect.value = selectedVoice;
    voiceSelect.onchange = () => {
        selectedVoice = voiceSelect.value;
        previewSelectedVoice(); // auto-preview on change
    };
}


        loadStudentName();
        updateDashboard();

        const levelSelect = document.getElementById("level-select");
        if (levelSelect) currentLevel = levelSelect.value || "A1";

        renderAllTabs();

        const firstTabBtn = document.querySelector(".tab-btn");
        if (firstTabBtn) showTab("listen", { target: firstTabBtn });

        if (typeof speechSynthesis !== "undefined") {
            speechSynthesis.onvoiceschanged = () => getLatAmVoice();
        }
    } catch (e) {
        console.error("Error in DOMContentLoaded:", e);
    }
});


