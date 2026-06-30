/* ============================
   GLOBAL STATE
============================ */

let currentLevel = "A1";
let quizScore = 0;
let buildScore = 0;
let convCount = 0;

/* Voice preference */
let selectedVoice = "female";

/* ============================
   INIT (voices + DOM)
============================ */

document.addEventListener("DOMContentLoaded", () => {
    const voiceSelect = document.getElementById("voice-select");
    if (voiceSelect) {
        voiceSelect.value = selectedVoice;
        voiceSelect.onchange = () => selectedVoice = voiceSelect.value;
    }

    updateDashboard();

    const levelSelect = document.getElementById("level-select");
    if (levelSelect) currentLevel = levelSelect.value;

    const firstTabBtn = document.querySelector(".tab-btn");
    showTab("listen", { target: firstTabBtn });

    speechSynthesis.onvoiceschanged = () => {};
});

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
   CATEGORY MAP FOR LISTEN TAB
============================ */

const LISTEN_CATEGORIES = {
    "Greetings & Basics": ["hola", "adiós", "por favor", "gracias", "sí", "no", "lo siento", "perdón"],
    "People & Pronouns": ["yo", "tú", "él", "ella", "nosotros", "ellos"],
    "Common Nouns": ["agua", "comida", "café", "té", "leche", "pan", "baño", "hotel", "habitación", "llave", "mesa", "silla"],
    "Café & Restaurant": ["menú", "cuenta", "camarero", "quiero", "me gustaría"],
    "Travel": ["autobús", "tren", "boleto", "estación", "aeropuerto"],
    "Shopping": ["¿cuánto cuesta?", "barato", "caro", "abierto", "cerrado"],
    "Emergency": ["ayuda", "doctor", "policía", "estoy perdido"]
};

/* ============================
   TAB SWITCHING
============================ */

function showTab(tabId, event) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
        tab.classList.remove("active-tab");
    });

    const target = document.getElementById(tabId);
    if (target) {
        target.classList.remove("hidden");
        target.classList.add("active-tab");
    }

    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    if (event && event.target) event.target.classList.add("active");

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
   VOICE SELECTION
============================ */

function getLatAmVoice() {
    const voices = speechSynthesis.getVoices();
    const latAmVoices = voices.filter(v =>
        v.lang === "es-MX" || v.lang === "es-US" || v.lang === "es-419"
    );

    if (!latAmVoices.length) return null;

    if (selectedVoice === "female") {
        return latAmVoices.find(v => v.name.toLowerCase().includes("female")) || latAmVoices[0];
    } else {
        return latAmVoices.find(v => v.name.toLowerCase().includes("male")) || latAmVoices[0];
    }
}

/* ============================
   LISTEN TAB — GROUPED VERSION
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

        <p>Select any word to hear it individually.</p>

        <div id="listen-categories"></div>
    `;

    const catContainer = document.getElementById("listen-categories");

    Object.entries(LISTEN_CATEGORIES).forEach(([categoryName, esList]) => {
        const catWords = words.filter(w => esList.includes(w.es));

        if (catWords.length === 0) return;

        const block = document.createElement("div");
        block.style.marginTop = "20px";

        block.innerHTML = `
            <h4 style="color:#a5f3fc; margin-bottom:10px;">${categoryName}</h4>
            <div class="listen-grid" style="
                display:grid;
                grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));
                gap:12px;
            "></div>
        `;

        const grid = block.querySelector(".listen-grid");

        catWords.forEach(w => {
            const pill = document.createElement("button");
            pill.className = "word-pill";
            pill.style.width = "100%";
            pill.textContent = `${w.es} (${w.en})`;
            pill.onclick = () => playSingleWord(words.indexOf(w));
            grid.appendChild(pill);
        });

        catContainer.appendChild(block);
    });
}

/* ============================
   LISTEN AUDIO FUNCTIONS
============================ */

let autoPlayActive = false;
let autoPlayPaused = false;
let autoPlayIndex = 0;

function playSingleWord(index) {
    const words = LEVEL_WORDS[currentLevel];
    const item = words[index];
    const rate = parseFloat(document.getElementById("rate").value);

    const utter = new SpeechSynthesisUtterance(item.es);
    utter.lang = "es-MX";
    utter.rate = rate;

    const voice = getLatAmVoice();
    if (voice) utter.voice = voice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

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
    utter.lang = "es-MX";
    utter.rate = rate;

    const voice = getLatAmVoice();
    if (voice) utter.voice = voice;

    utter.onend = () => {
        if (autoPlayPaused) return;
        autoPlayIndex++;
        setTimeout(() => playNextWord(words), 600);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

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
            if (card.classList.contains("flipped")) speakSpanish(item.es);
        };

        grid.appendChild(wrapper);
    });
}

function speakSpanish(text) {
    const rate = parseFloat(document.getElementById("rate").value);

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    utter.rate = rate;

    const voice = getLatAmVoice();
    if (voice) utter.voice = voice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

/* ============================
   QUIZ ENGINE — UPGRADED
============================ */

function renderQuizTab() {
    const container = document.getElementById("quiz");
    if (!container) return;

    const words = LEVEL_WORDS[currentLevel] || [];

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

        <div
