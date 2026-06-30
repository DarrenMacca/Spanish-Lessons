/* ============================
   GLOBAL STATE
============================ */

let currentLevel = "A1";
let quizScore = 0;
let buildScore = 0;
let convCount = 0;

/* Voice preference */
let selectedVoice = "female";

/* Load voice selector + ensure voices load */
document.addEventListener("DOMContentLoaded", () => {
    const voiceSelect = document.getElementById("voice-select");
    if (voiceSelect) {
        voiceSelect.value = selectedVoice;
        voiceSelect.onchange = () => {
            selectedVoice = voiceSelect.value;
        };
    }

    speechSynthesis.onvoiceschanged = () => {};
});

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
   LISTEN ENGINE
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

function playSingleWord(index) {
    const words = LEVEL_WORDS[currentLevel];
    const item = words[index];
    const rate = parseFloat(document.getElementById("rate").value);

    const utter = new SpeechSynthesisUtterance(item.es);
    utter.lang = "es-MX";
    utter.rate = rate;

    const voices = speechSynthesis.getVoices();
    const latAmVoices = voices.filter(v =>
        v.lang === "es-MX" || v.lang === "es-US" || v.lang === "es-419"
    );

    if (latAmVoices.length > 0) {
        if (selectedVoice === "female") {
            utter.voice = latAmVoices.find(v => v.name.toLowerCase().includes("female")) || latAmVoices[0];
        } else {
            utter.voice = latAmVoices.find(v => v.name.toLowerCase().includes("male")) || latAmVoices[0];
        }
    }

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

    const voices = speechSynthesis.getVoices();
    const latAmVoices = voices.filter(v =>
        v.lang === "es-MX" || v.lang === "es-US" || v.lang === "es-419"
    );

    if (latAmVoices.length > 0) {
        if (selectedVoice === "female") {
            utter.voice = latAmVoices.find(v => v.name.toLowerCase().includes("female")) || latAmVoices[0];
        } else {
            utter.voice = latAmVoices.find(v => v.name.toLowerCase().includes("male")) || latAmVoices[0];
        }
    }

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
   FLASHCARDS — ENGLISH FIRST + AUDIO
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

            if (card.classList.contains("flipped")) {
                speakSpanish(item.es);
            }
        };

        grid.appendChild(wrapper);
    });
}

function speakSpanish(text) {
    const rate = parseFloat(document.getElementById("rate").value);

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    utter.rate = rate;

    const voices = speechSynthesis.getVoices();
    const latAmVoices = voices.filter(v =>
        v.lang === "es-MX" || v.lang === "es-US" || v.lang === "es-419"
    );

    if (latAmVoices.length > 0) {
        if (selectedVoice === "female") {
            utter.voice = latAmVoices.find(v => v.name.toLowerCase().includes("female")) || latAmVoices[0];
        } else {
            utter.voice = latAmVoices.find(v => v.name.toLowerCase().includes("male")) || latAmVoices[0];
        }
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
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
