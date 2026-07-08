/* ============================================================
   SABINA VOICE (es-MX)
============================================================ */

let sabinaVoice = null;

function loadSabinaVoice() {
    const voices = speechSynthesis.getVoices();

    sabinaVoice =
        voices.find(v => v.lang === "es-MX") ||      // Microsoft Sabina (Chrome/Edge)
        voices.find(v => v.lang === "es-US") ||      // fallback Spanish US
        voices.find(v => v.lang === "es-419") ||     // fallback Latin America
        voices.find(v => v.lang.startsWith("es")) || // any Spanish voice
        voices[0];                                   // absolute fallback
}

speechSynthesis.onvoiceschanged = loadSabinaVoice;



/* ============================================================
   GLOBAL SPEAK FUNCTION (uses Sabina)
============================================================ */

function speakSpanish(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    utter.rate = parseFloat(document.getElementById("audio-speed").value);

    if (sabinaVoice) {
        utter.voice = sabinaVoice;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}



/* ============================================================
   CEFR WORD BANK (A1 → B2)
============================================================ */

const A1_WORDS = [
    { spanish: "hola", english: "hello", audio: "hola.mp3", category: "daily-life" },
    { spanish: "adiós", english: "goodbye", audio: "adios.mp3", category: "daily-life" },
    { spanish: "por favor", english: "please", audio: "por-favor.mp3", category: "daily-life" },
    { spanish: "gracias", english: "thank you", audio: "gracias.mp3", category: "daily-life" },
    { spanish: "sí", english: "yes", audio: "si.mp3", category: "daily-life" },
    { spanish: "no", english: "no", audio: "no.mp3", category: "daily-life" },
    { spanish: "hoy", english: "today", audio: "hoy.mp3", category: "daily-life" },
    { spanish: "mañana", english: "tomorrow", audio: "manana.mp3", category: "daily-life" },
    { spanish: "ayer", english: "yesterday", audio: "ayer.mp3", category: "daily-life" },

    { spanish: "madre", english: "mother", audio: "madre.mp3", category: "family" },
    { spanish: "padre", english: "father", audio: "padre.mp3", category: "family" },
    { spanish: "hermano", english: "brother", audio: "hermano.mp3", category: "family" },
    { spanish: "hermana", english: "sister", audio: "hermana.mp3", category: "family" },
    { spanish: "familia", english: "family", audio: "familia.mp3", category: "family" },

    { spanish: "agua", english: "water", audio: "agua.mp3", category: "food-drink" },
    { spanish: "pan", english: "bread", audio: "pan.mp3", category: "food-drink" },
    { spanish: "manzana", english: "apple", audio: "manzana.mp3", category: "food-drink" },
    { spanish: "café", english: "coffee", audio: "cafe.mp3", category: "food-drink" },
    { spanish: "té", english: "tea", audio: "te.mp3", category: "food-drink" },
    { spanish: "cerveza", english: "beer", audio: "cerveza.mp3", category: "food-drink" },
    { spanish: "vino", english: "wine", audio: "vino.mp3", category: "food-drink" },
    { spanish: "huevo", english: "egg", audio: "huevo.mp3", category: "food-drink" },
    { spanish: "pollo", english: "chicken", audio: "pollo.mp3", category: "food-drink" },
    { spanish: "pescado", english: "fish", audio: "pescado.mp3", category: "food-drink" },

    { spanish: "y", english: "and", audio: "y.mp3", category: "connector" },
    { spanish: "o", english: "or", audio: "o.mp3", category: "connector" },
    { spanish: "pero", english: "but", audio: "pero.mp3", category: "connector" },
    { spanish: "porque", english: "because", audio: "porque.mp3", category: "connector" },

    { spanish: "uno", english: "one", audio: "uno.mp3", category: "number" },
    { spanish: "dos", english: "two", audio: "dos.mp3", category: "number" },
    { spanish: "tres", english: "three", audio: "tres.mp3", category: "number" },
    { spanish: "cuatro", english: "four", audio: "cuatro.mp3", category: "number" },
    { spanish: "cinco", english: "five", audio: "cinco.mp3", category: "number" },

    { spanish: "ser", english: "to be", audio: "ser.mp3", category: "verb" },
    { spanish: "estar", english: "to be (state)", audio: "estar.mp3", category: "verb" },
    { spanish: "tener", english: "to have", audio: "tener.mp3", category: "verb" },
    { spanish: "hacer", english: "to do/make", audio: "hacer.mp3", category: "verb" },
    { spanish: "ir", english: "to go", audio: "ir.mp3", category: "verb" },

    { spanish: "grande", english: "big", audio: "grande.mp3", category: "adjective" },
    { spanish: "pequeño", english: "small", audio: "pequeno.mp3", category: "adjective" },
    { spanish: "bueno", english: "good", audio: "bueno.mp3", category: "adjective" },
    { spanish: "malo", english: "bad", audio: "malo.mp3", category: "adjective" },
    { spanish: "fácil", english: "easy", audio: "facil.mp3", category: "adjective" },
    { spanish: "difícil", english: "difficult", audio: "dificil.mp3", category: "adjective" },

    { spanish: "calle", english: "street", audio: "calle.mp3", category: "travel" },
    { spanish: "ciudad", english: "city", audio: "ciudad.mp3", category: "travel" },
    { spanish: "hotel", english: "hotel", audio: "hotel.mp3", category: "travel" },
    { spanish: "taxi", english: "taxi", audio: "taxi.mp3", category: "travel" },
    { spanish: "autobús", english: "bus", audio: "autobus.mp3", category: "travel" }
];

const A2_WORDS = [
    { spanish: "viajar", english: "to travel", audio: "viajar.mp3", category: "travel" },
    { spanish: "comprar", english: "to buy", audio: "comprar.mp3", category: "verb" },
    { spanish: "buscar", english: "to look for", audio: "buscar.mp3", category: "verb" },
    { spanish: "necesitar", english: "to need", audio: "necesitar.mp3", category: "verb" },
    { spanish: "preferir", english: "to prefer", audio: "preferir.mp3", category: "verb" },

    { spanish: "siempre", english: "always", audio: "siempre.mp3", category: "daily-life" },
    { spanish: "nunca", english: "never", audio: "nunca.mp3", category: "daily-life" },
    { spanish: "a veces", english: "sometimes", audio: "a-veces.mp3", category: "daily-life" },

    { spanish: "carne", english: "meat", audio: "carne.mp3", category: "food-drink" },
    { spanish: "verdura", english: "vegetable", audio: "verdura.mp3", category: "food-drink" },
    { spanish: "fruta", english: "fruit", audio: "fruta.mp3", category: "food-drink" },
    { spanish: "menú", english: "menu", audio: "menu.mp3", category: "food-drink" },
    { spanish: "cuenta", english: "bill", audio: "cuenta.mp3", category: "food-drink" },

    { spanish: "aunque", english: "although", audio: "aunque.mp3", category: "connector" },
    { spanish: "entonces", english: "then", audio: "entonces.mp3", category: "connector" },
    { spanish: "después", english: "after", audio: "despues.mp3", category: "connector" },

    { spanish: "rápido", english: "fast", audio: "rapido.mp3", category: "adjective" },
    { spanish: "lento", english: "slow", audio: "lento.mp3", category: "adjective" },
    { spanish: "caro", english: "expensive", audio: "caro.mp3", category: "adjective" },
    { spanish: "barato", english: "cheap", audio: "barato.mp3", category: "adjective" },

    { spanish: "estación", english: "station", audio: "estacion.mp3", category: "travel" },
    { spanish: "billete", english: "ticket", audio: "billete.mp3", category: "travel" },
    { spanish: "mapa", english: "map", audio: "mapa.mp3", category: "travel" },
    { spanish: "dirección", english: "direction", audio: "direccion.mp3", category: "travel" },

    { spanish: "trabajo", english: "job", audio: "trabajo.mp3", category: "work" },
    { spanish: "oficina", english: "office", audio: "oficina.mp3", category: "work" },
    { spanish: "jefe", english: "boss", audio: "jefe.mp3", category: "work" },
    { spanish: "dinero", english: "money", audio: "dinero.mp3", category: "work" },

    { spanish: "hijo", english: "son", audio: "hijo.mp3", category: "family" },
    { spanish: "hija", english: "daughter", audio: "hija.mp3", category: "family" },

    { spanish: "temprano", english: "early", audio: "temprano.mp3", category: "daily-life" },
    { spanish: "tarde", english: "late", audio: "tarde.mp3", category: "daily-life" }
];

const B1_WORDS = [
    { spanish: "gestionar", english: "to manage", audio: "gestionar.mp3", category: "work" },
    { spanish: "organizar", english: "to organize", audio: "organizar.mp3", category: "work" },
    { spanish: "proyecto", english: "project", audio: "proyecto.mp3", category: "work" },
    { spanish: "reunión", english: "meeting", audio: "reunion.mp3", category: "work" },

    { spanish: "mejorar", english: "to improve", audio: "mejorar.mp3", category: "verb" },
    { spanish: "aprender", english: "to learn", audio: "aprender.mp3", category: "verb" },
    { spanish: "recordar", english: "to remember", audio: "recordar.mp3", category: "verb" },

    { spanish: "importante", english: "important", audio: "importante.mp3", category: "adjective" },
    { spanish: "necesario", english: "necessary", audio: "necesario.mp3", category: "adjective" },
    { spanish: "posible", english: "possible", audio: "posible.mp3", category: "adjective" },

    { spanish: "aeropuerto", english: "airport", audio: "aeropuerto.mp3", category: "travel" },
    { spanish: "equipaje", english: "luggage", audio: "equipaje.mp3", category: "travel" },
    { spanish: "reserva", english: "reservation", audio: "reserva.mp3", category: "travel" },

    { spanish: "vegetariano", english: "vegetarian", audio: "vegetariano.mp3", category: "food-drink" },
    { spanish: "alergia", english: "allergy", audio: "alergia.mp3", category: "food-drink" },

    { spanish: "sin embargo", english: "however", audio: "sin-embargo.mp3", category: "connector" },
    { spanish: "por lo tanto", english: "therefore", audio: "por-lo-tanto.mp3", category: "connector" },

    { spanish: "experiencia", english: "experience", audio: "experiencia.mp3", category: "daily-life" },
    { spanish: "situación", english: "situation", audio: "situacion.mp3", category: "daily-life" }
];

const B2_WORDS = [
    { spanish: "desarrollar", english: "to develop", audio: "desarrollar.mp3", category: "verb" },
    { spanish: "analizar", english: "to analyze", audio: "analizar.mp3", category: "verb" },
    { spanish: "evaluar", english: "to evaluate", audio: "evaluar.mp3", category: "verb" },

    { spanish: "responsabilidad", english: "responsibility", audio: "responsabilidad.mp3", category: "work" },
    { spanish: "productividad", english: "productivity", audio: "productividad.mp3", category: "work" },

    { spanish: "además", english: "in addition", audio: "ademas.mp3", category: "connector" },
    { spanish: "por consiguiente", english: "consequently", audio: "por-consiguiente.mp3", category: "connector" },

    { spanish: "eficiente", english: "efficient", audio: "eficiente.mp3", category: "adjective" },
    { spanish: "complejo", english: "complex", audio: "complejo.mp3", category: "adjective" },

    { spanish: "destino", english: "destination", audio: "destino.mp3", category: "travel" },
    { spanish: "itinerario", english: "itinerary", audio: "itinerario.mp3", category: "travel" }
];

const CEFR_WORDS = [
    ...A1_WORDS.map(w => ({ ...w, level: "A1" })),
    ...A2_WORDS.map(w => ({ ...w, level: "A2" })),
    ...B1_WORDS.map(w => ({ ...w, level: "B1" })),
    ...B2_WORDS.map(w => ({ ...w, level: "B2" }))
];

/* ============================================================
   AUDIO SYSTEM
============================================================ */

let AUDIO_RATE = 1.0;
let currentAudio = null;

function playFileAudio(filename) {
    stopFileAudio();
    currentAudio = new Audio(`audio/${filename}`);
    currentAudio.play();
}

function pauseFileAudio() {
    if (currentAudio) currentAudio.pause();
}

function resumeFileAudio() {
    if (currentAudio) currentAudio.play();
}

function stopFileAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function speakSpanish(text) {
    if (!text || typeof speechSynthesis === "undefined") return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    if (sabinaVoice) utter.voice = sabinaVoice;
    utter.rate = AUDIO_RATE;
    speechSynthesis.speak(utter);
}

/* ============================================================
   PROGRESSION + DAILY + SRS
============================================================ */

const WORD_PROGRESS = CEFR_WORDS.map((w, index) => ({
    id: index,
    spanish: w.spanish,
    english: w.english,
    audio: w.audio,
    category: w.category,
    level: w.level,
    mastery: 0
}));

// Simple SRS data aligned with WORD_PROGRESS
let SRS_DATA = WORD_PROGRESS.map(w => ({
    id: w.id,
    interval: 1, // days
    nextReview: Date.now()
}));

const PROGRESS_KEY = "cefr_progress_v2";
const DAILY_KEY = "cefr_daily_v2";
const SRS_KEY = "cefr_srs_v2";

let dailyData = {
    lastActive: Date.now(),
    streak: 0,
    xpToday: 0,
    goal: 50
};

function loadProgress() {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return;
    try {
        const saved = JSON.parse(raw);
        WORD_PROGRESS.forEach((w, i) => {
            if (saved[i]) w.mastery = saved[i].mastery || 0;
        });
    } catch {}
}

function saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(WORD_PROGRESS));
}

function loadDaily() {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return;
    try { dailyData = { ...dailyData, ...JSON.parse(raw) }; } catch {}
}

function saveDaily() {
    localStorage.setItem(DAILY_KEY, JSON.stringify(dailyData));
}

function loadSRS() {
    const raw = localStorage.getItem(SRS_KEY);
    if (!raw) return;
    try {
        const saved = JSON.parse(raw);
        SRS_DATA.forEach((s, i) => {
            if (saved[i]) {
                s.interval = saved[i].interval;
                s.nextReview = saved[i].nextReview;
            }
        });
    } catch {}
}

function saveSRS() {
    localStorage.setItem(SRS_KEY, JSON.stringify(SRS_DATA));
}

/* ============================================================
   BADGES SYSTEM
============================================================ */

let badges = {
    conversationBeginner: false,
    conversationSpeaker: false
};

const BADGES_KEY = "cefr_badges_v1";

function loadBadges() {
    const raw = localStorage.getItem(BADGES_KEY);
    if (!raw) return;
    try {
        badges = { ...badges, ...JSON.parse(raw) };
    } catch {}
}

function saveBadges() {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

function renderBadges() {
    const container = document.getElementById("badges-content");
    if (!container) return;

    container.innerHTML = `
        <div class="badge-list">
            <div class="badge-item ${badges.conversationBeginner ? "unlocked" : ""}">
                Conversational Beginner
            </div>
            <div class="badge-item ${badges.conversationSpeaker ? "unlocked" : ""}">
                Conversational Speaker
            </div>
        </div>
    `;
}

/* ============================================================
   BADGE CELEBRATION
============================================================ */

function launchCelebration() {
    console.log("🎉 Celebration triggered!");
}

// Conversation stats for badge logic
let conversationStats = {
    correct: 0,
    attempts: 0
};

function checkConversationBadges() {

    if (conversationStats.correct >= 10 && !badges.conversationBeginner) {
        badges.conversationBeginner = true;
        saveBadges();
        renderBadges();
        launchCelebration();
        speakSpanish("Nuevo logro desbloqueado");
    }

    if (conversationStats.correct >= 50 && !badges.conversationSpeaker) {
        badges.conversationSpeaker = true;
        saveBadges();
        renderBadges();
        launchCelebration();
        speakSpanish("Nuevo logro desbloqueado");
    }
}

/* ============================================================
   CERTIFICATE SYSTEM
============================================================ */

let certificates = {
    a1: false,
    a2: false,
    b1: false,
    quiz: false,
    builder: false,
    conversation: false,
    smart: false,
    daily: false
};

const CERT_KEY = "cefr_certificates_v1";

function loadCertificates() {
    const raw = localStorage.getItem(CERT_KEY);
    if (!raw) return;
    try {
        certificates = { ...certificates, ...JSON.parse(raw) };
    } catch {}
}

function saveCertificates() {
    localStorage.setItem(CERT_KEY, JSON.stringify(certificates));
}

/* Persistent certificate IDs */
const CERT_IDS_KEY = "cefr_cert_ids_v1";
let certificateIDs = {};

function loadCertificateIDs() {
    const raw = localStorage.getItem(CERT_IDS_KEY);
    if (raw) {
        try { certificateIDs = JSON.parse(raw); } catch {}
    }
}

function saveCertificateIDs() {
    localStorage.setItem(CERT_IDS_KEY, JSON.stringify(certificateIDs));
}

function generateCertificateID(key) {
    if (!certificateIDs[key]) {
        certificateIDs[key] = `${key.toUpperCase()}-${Date.now().toString(36)}`;
        saveCertificateIDs();
    }
    return certificateIDs[key];
}

/* ============================================================
   XP SYSTEM + ACHIEVEMENTS + LEVELS
============================================================ */

loadProgress();
loadDaily();
loadSRS();
loadBadges();
loadCertificates();
loadCertificateIDs();

const xpRewards = {
    quizCorrect: 20,
    buildCorrect: 40,
    convCorrect: 60,
    smartCorrect: 80,
    dailyComplete: 100,
    levelUnlock: 400,
    certificateUnlock: 600,
    conversationCorrect: 20,
    conversationSession: 50
};

function addXP(amount = 2) {
    const now = Date.now();
    const last = dailyData.lastActive;
    const oneDay = 86400000;
    const sameDay = Math.floor(now / oneDay) === Math.floor(last / oneDay);

    if (!sameDay) {
        if (dailyData.xpToday >= dailyData.goal) {
            dailyData.streak++;
        } else {
            dailyData.streak = 0;
        }
        dailyData.xpToday = 0;
    }

    dailyData.xpToday += amount;
    dailyData.lastActive = now;
    saveDaily();
}

function bumpMastery(wordId, amount = 5) {
    const w = WORD_PROGRESS.find(x => x.id === wordId);
    if (!w) return;
    w.mastery = Math.min(100, w.mastery + amount);
    saveProgress();
    const s = SRS_DATA.find(x => x.id === wordId);
    if (s) {
        s.interval = Math.min(s.interval * 2, 30);
        s.nextReview = Date.now() + s.interval * 86400000;
        saveSRS();
    }
}

function getDueWords() {
    const now = Date.now();
    return WORD_PROGRESS.filter(w => {
        const s = SRS_DATA.find(x => x.id === w.id);
        return s && s.nextReview <= now;
    });
}

/* LEVEL STATS + CURRENT LEVEL */

function getLevelStats() {
    const levels = ["A1","A2","B1","B2"];
    const stats = {};
    levels.forEach(l => {
        const words = WORD_PROGRESS.filter(w => w.level === l);
        const total = words.length;
        const mastered = words.filter(w => w.mastery >= 70).length;
        const avg = total === 0 ? 0 :
            Math.round(words.reduce((s, w) => s + w.mastery, 0) / total);
        stats[l] = { total, mastered, avg };
    });
    return stats;
}

let levelOverride = null;

function getCurrentCEFRLevel() {
    if (levelOverride) return levelOverride;
    const stats = getLevelStats();
    if (stats.B2.mastered >= Math.round(stats.B2.total * 0.4)) return "B2";
    if (stats.B1.mastered >= Math.round(stats.B1.total * 0.4)) return "B1";
    if (stats.A2.mastered >= Math.round(stats.A2.total * 0.4)) return "A2";
    return "A1";
}



/* ACHIEVEMENTS — 90% SCORING SYSTEM */

const ACHIEVEMENTS = [
    { id: "a1_master", label: "A1 Master", condition: s => s.A1.avg >= 90 },
    { id: "a2_master", label: "A2 Master", condition: s => s.A2.avg >= 90 },
    { id: "b1_master", label: "B1 Master", condition: s => s.B1.avg >= 90 },
    { id: "b2_master", label: "B2 Master", condition: s => s.B2.avg >= 90 },

    // Overall CEFR mastery achievement
    { id: "full_progress", label: "200‑Word Explorer", condition: s => {
        const totalAvg = Math.round(
            (s.A1.avg + s.A2.avg + s.B1.avg + s.B2.avg) / 4
        );
        return totalAvg >= 90;
    }}
];

const ACH_KEY = "cefr_achievements_v2";
let unlockedAchievements = [];

function loadAchievements() {
    const raw = localStorage.getItem(ACH_KEY);
    if (!raw) return;
    try { unlockedAchievements = JSON.parse(raw); } catch {}
}
function saveAchievements() {
    localStorage.setItem(ACH_KEY, JSON.stringify(unlockedAchievements));
}
loadAchievements();

function evaluateAchievements() {
    const stats = getLevelStats();

    ACHIEVEMENTS.forEach(a => {
        if (!unlockedAchievements.includes(a.id) && a.condition(stats)) {
            unlockedAchievements.push(a.id);
            saveAchievements();
        }
    });
}

/* ============================================================
   DASHBOARD TAB
============================================================ */

function updateAudioSpeedUI() {
    const speedValue = document.querySelector(".audio-speed-value");
    if (speedValue) speedValue.textContent = `${AUDIO_RATE.toFixed(1)}x`;
}

function saveLearnerName() {
    const input = document.getElementById("cert-name-input");
    if (!input) return;
    localStorage.setItem("cefr_learner_name", input.value.trim());
}

function loadLearnerName() {
    const saved = localStorage.getItem("cefr_learner_name");
    return saved || "";
}

/* -----------------------------------------------------------
   HERO RENDER FUNCTION
----------------------------------------------------------- */
function renderHero() {
    return `
        <div class="glass-card hero-card neon-glow">
            <img src="images/hero-dashboard.png" class="dashboard-hero-img">
        </div>
    `;
}

/* -----------------------------------------------------------
   EXPERIENCE TILE RENDERER
----------------------------------------------------------- */
function renderExperienceTiles(current, due) {
    return `
        <div class="glass-card tile-card neon-glow">
            <img src="images/icon-level.png" class="dash-icon">
            <div class="dash-label">Current Level</div>
            <div class="dash-value">${current}</div>
        </div>

        <div class="glass-card tile-card neon-glow">
            <img src="images/icon-review.png" class="dash-icon">
            <div class="dash-label">Due Words</div>
            <div class="dash-value">${due}</div>
        </div>

        <div class="glass-card tile-card neon-glow">
            <img src="images/streak-flame.png" class="dash-icon">
            <div class="dash-label">Streak</div>
            <div class="dash-value">${dailyData.streak} days</div>
        </div>

        <div class="glass-card tile-card neon-glow">
            <div class="dash-label">XP Today</div>
            <div class="xp-bar-wrapper">
                <div class="xp-bar neon-glow" style="width:${Math.min((dailyData.xpToday / dailyData.goal) * 100, 100)}%"></div>
            </div>
            <div class="xp-text">${dailyData.xpToday} / ${dailyData.goal}</div>
        </div>
    `;
}

/* -----------------------------------------------------------
   CONTROLS RENDERER
----------------------------------------------------------- */
function renderControls(current, learnerName) {
    return `
        <div class="control-block">
            <label>Level of difficulty:</label>
            <select id="level-select">
                <option value="">Auto (${current})</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
            </select>
        </div>

        <div class="control-block">
            <label>Audio speed:</label>
            <input type="range" id="audio-speed" min="0.6" max="1.4" step="0.1" value="${AUDIO_RATE}">
            <span class="audio-speed-value">${AUDIO_RATE.toFixed(1)}x</span>
        </div>

        <div class="control-block">
            <label>Your name (for certificate):</label>
            <input type="text" id="cert-name-input" value="${learnerName}" placeholder="Your name">
        </div>
    `;
}

/* -----------------------------------------------------------
   BADGE TILE RENDERER
----------------------------------------------------------- */
function renderBadgeTiles() {
    return `
        <div class="glass-card tile-card neon-glow">
            <div class="dash-label">Badges</div>
            <div class="badge-grid">
                ${ACHIEVEMENTS.map(a => `
                    <div class="badge-item ${unlockedAchievements.includes(a.id) ? "badge-on" : "badge-off"}">
                        ${a.label}
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

/* -----------------------------------------------------------
   PROMOTED BADGES RENDERER
----------------------------------------------------------- */
function renderPromotedBadgeTiles() {
    if (!unlockedAchievements.length) {
        return `<div class="glass-card tile-card">No badges collected yet.</div>`;
    }

    return unlockedAchievements.map(id => {
        const badge = ACHIEVEMENTS.find(a => a.id === id);
        return `
            <div class="glass-card tile-card neon-glow">
                <div class="dash-label">${badge.label}</div>
            </div>
        `;
    }).join("");
}

/* -----------------------------------------------------------
   CERTIFICATE TILE RENDERER
----------------------------------------------------------- */
function renderCertificateTiles(stats, currentLevel) {
    const levels = ["A1", "A2", "B1", "B2"];

    return `
        <div class="certificate-grid">
            ${levels.map(level => {
                const unlocked = stats.certificates?.[level]?.unlocked || false;
                const avg = stats.certificates?.[level]?.average || 0;

                return `
                    <div class="certificate-item">
                        <div class="dash-label">Certificate: ${level}</div>
                        <div class="dash-value">${unlocked ? "Unlocked" : "Locked"}</div>

                        <div class="cert-progress">
                            <p>Avg: ${avg}%</p>
                            <div class="cert-bar-wrapper">
                                <div class="cert-bar" style="width:${avg}%; background:${avg > 0 ? "#00c6ff" : "rgba(255,255,255,0.35)"}"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

/* -----------------------------------------------------------
   SUMMARY TILE RENDERER
----------------------------------------------------------- */
function renderSummaryTile(stats, current, due) {
    return `
        <div class="glass-card tile-card neon-glow">
            <div class="dash-label">Current CEFR Level: ${current}</div>
            <p>A1: ${stats.A1.mastered}/${stats.A1.total} mastered (avg ${stats.A1.avg}%)</p>
            <p>A2: ${stats.A2.mastered}/${stats.A2.total} mastered (avg ${stats.A2.avg}%)</p>
            <p>B1: ${stats.B1.mastered}/${stats.B1.total} mastered (avg ${stats.B1.avg}%)</p>
            <p>B2: ${stats.B2.mastered}/${stats.B2.total} mastered (avg ${stats.B2.avg}%)</p>
            <p>Due for review: ${due}</p>
        </div>
    `;
}

/* -----------------------------------------------------------
   MAIN DASHBOARD RENDERER
----------------------------------------------------------- */
function renderDashboardTab() {
    const hero = document.querySelector(".dashboard-hero");
    const row = document.querySelector(".dashboard-row");
    const controls = document.querySelector(".dashboard-controls");
    const badges = document.querySelector(".dashboard-badges");
    const promoted = document.querySelector(".dashboard-promoted-badges");
    const certs = document.querySelector(".dashboard-certificates-preview");
    const summary = document.getElementById("progress-summary");

    if (!hero || !row || !controls || !badges || !promoted || !certs || !summary) return;

    const stats = getLevelStats();
    const current = getCurrentCEFRLevel();
    const due = getDueWords().length;
    const learnerName = loadLearnerName();

    evaluateAchievements();

    hero.innerHTML = renderHero();
    row.innerHTML = renderExperienceTiles(current, due);
    controls.innerHTML = renderControls(current, learnerName);
    badges.innerHTML = renderBadgeTiles();
    promoted.innerHTML = renderPromotedBadgeTiles();
    certs.innerHTML = renderCertificateTiles(stats, current);
    summary.innerHTML = renderSummaryTile(stats, current, due);

    document.getElementById("level-select").onchange = e => {
        levelOverride = e.target.value || null;
        renderDashboardTab();
    };

    document.getElementById("audio-speed").oninput = e => {
        AUDIO_RATE = parseFloat(e.target.value);
        updateAudioSpeedUI();
    };

    document.getElementById("cert-name-input").oninput = () => saveLearnerName();
}

/* ============================================================
   LISTEN TAB — FIXED + ANIMATED
============================================================ */

const LISTEN_CATEGORIES = [
    { id: "daily-life", name: "Daily Life" },
    { id: "family", name: "Family" },
    { id: "food-drink", name: "Food & Drink" },
    { id: "connector", name: "Connectors" },
    { id: "number", name: "Numbers" },
    { id: "verb", name: "Verbs" },
    { id: "adjective", name: "Adjectives" },
    { id: "travel", name: "Travel" },
    { id: "work", name: "Work" }
];

function renderListenTab() {
    const container = document.getElementById("listen-categories");
    if (!container) return;
    container.innerHTML = "";

    LISTEN_CATEGORIES.forEach(cat => {
        const section = document.createElement("div");
        section.className = "listen-section glass-card";

        section.innerHTML = `
            <div class="listen-header" onclick="toggleListenCategory('${cat.id}')">
                <h3>${cat.name}</h3>
                <span class="listen-arrow">▼</span>
            </div>
            <div id="listen-${cat.id}" class="listen-content"></div>
        `;

        container.appendChild(section);
    });
}

function loadListenCategory(catId) {
    const content = document.getElementById(`listen-${catId}`);
    if (!content) return;

    const currentLevel = getCurrentCEFRLevel();

    const words = CEFR_WORDS.filter(w =>
        w.category === catId && w.level === currentLevel
    );

    if (!words.length) {
        content.innerHTML = "<p>No words found for this level.</p>";
        return;
    }

    const grid = document.createElement("div");
    grid.className = "listen-word-grid";

    words.forEach(w => {
        const tile = document.createElement("div");
        tile.className = "listen-word";
        tile.textContent = `${w.spanish} (${w.english})`;
        tile.onclick = () => playFileAudio(w.audio);
        grid.appendChild(tile);
    });

    content.innerHTML = "";
    content.appendChild(grid);
}

let currentOpenCategory = null;

function toggleListenCategory(catId) {
    const newSection = document.getElementById(`listen-${catId}`);

    if (currentOpenCategory === catId) {
        newSection.classList.remove("open");
        currentOpenCategory = null;
        return;
    }

    if (currentOpenCategory) {
        const oldSection = document.getElementById(`listen-${currentOpenCategory}`);
        if (oldSection) oldSection.classList.remove("open");
    }

    newSection.classList.add("open");
    loadListenCategory(catId);
    currentOpenCategory = catId;
}

/* ============================================================
   BUILD TAB — FIXED + GRID + XP
============================================================ */

const BUILD_SENTENCES = [
    {
        level: "A1",
        english: "I would like water, please.",
        spanishWords: ["me","gustaría","agua","por","favor"]
    },
    {
        level: "A2",
        english: "I prefer chicken for dinner.",
        spanishWords: ["prefiero","pollo","para","la","cena"]
    },
    {
        level: "B1",
        english: "We need to organize the meeting.",
        spanishWords: ["necesitamos","organizar","la","reunión"]
    },
    {
        level: "B2",
        english: "They want to analyze the situation.",
        spanishWords: ["quieren","analizar","la","situación"]
    }
];

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

function renderBuildTab() {
    const container = document.getElementById("build-content");
    if (!container) return;
    container.innerHTML = "";

    const currentLevel = getCurrentCEFRLevel();
    const pool = BUILD_SENTENCES.filter(s => s.level === currentLevel) || BUILD_SENTENCES;
    const sentence = pool[Math.floor(Math.random() * pool.length)];

    const card = document.createElement("div");
    card.className = "glass-card build-card";
    card.innerHTML = `
        <h2>Duplicate this sentence in Spanish</h2>
        <p class="build-english">${sentence.english}</p>
        <div id="build-selected" class="build-selected"></div>
        <div id="build-words" class="build-word-grid"></div>
        <div class="build-input-row">
            <input type="text" id="build-input" placeholder="Type the Spanish sentence">
            <button class="pill-btn" id="build-check">Check</button>
        </div>
    `;
    container.appendChild(card);

    const wordsArea = document.getElementById("build-words");
    const selectedArea = document.getElementById("build-selected");
    const input = document.getElementById("build-input");
    const checkBtn = document.getElementById("build-check");

    const shuffled = shuffle(sentence.spanishWords);
    shuffled.forEach(w => {
        const btn = document.createElement("button");
        btn.className = "pill-btn";
        btn.textContent = w;
        btn.onclick = () => {
            selectedArea.textContent = (selectedArea.textContent + " " + w).trim();
        };
        wordsArea.appendChild(btn);
    });

    checkBtn.onclick = () => {
        const typed = input.value.trim().toLowerCase();
        const selected = selectedArea.textContent.trim().toLowerCase();
        const target = sentence.spanishWords.join(" ").toLowerCase();

        const ok = typed === target || selected === target;
        alert(ok ? "Correct! 🎉" : `Not quite. Target: "${target}"`);
        if (ok) {
            addXP(10);
        }
        renderBuildTab();
    };
}

/* ============================================================
   SENTENCE TAB — FIXED + XP
============================================================ */

const SENTENCE_ITEMS = [
    {
        level: "A1",
        english: "I would like to pay with card.",
        options: [
            "Me gustaría pagar con tarjeta.",
            "Quiero agua, por favor.",
            "Tengo una alergia alimentaria."
        ],
        correct: 0
    },
    {
        level: "A2",
        english: "Do you have vegetarian options?",
        options: [
            "¿Tiene opciones vegetarianas?",
            "¿Puedo ver el menú?",
            "¿Puede traer la cuenta?"
        ],
        correct: 0
    },
    {
        level: "B1",
        english: "We need to manage the project.",
        options: [
            "Necesitamos gestionar el proyecto.",
            "Prefiero pollo.",
            "No como pescado."
        ],
        correct: 0
    },
    {
        level: "B2",
        english: "It is important to evaluate productivity.",
        options: [
            "Es importante evaluar la productividad.",
            "Quisiera una mesa para dos.",
            "¿Este plato es picante?"
        ],
        correct: 0
    }
];

function renderSentenceTab() {
    const container = document.getElementById("sentence-content");
    if (!container) return;
    container.innerHTML = "";

    const currentLevel = getCurrentCEFRLevel();
    const pool = SENTENCE_ITEMS.filter(s => s.level === currentLevel) || SENTENCE_ITEMS;
    const item = pool[Math.floor(Math.random() * pool.length)];

    const card = document.createElement("div");
    card.className = "glass-card sentence-card";
    card.innerHTML = `
        <h2>Choose the correct Spanish sentence</h2>
        <p class="sentence-english">${item.english}</p>
        <div class="sentence-options">
            ${item.options.map((opt, idx) =>
                `<button class="pill-btn sentence-option" data-idx="${idx}">${opt}</button>`
            ).join("")}
        </div>
    `;
    container.appendChild(card);

    const buttons = container.querySelectorAll(".sentence-option");
    buttons.forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx, 10);
            const correct = idx === item.correct;
            alert(correct ? "Correct! 🎉" : "Try again.");
            if (correct) {
                speakSpanish(item.options[item.correct]);
                addXP(8);
            }
            renderSentenceTab();
        };
    });
}

/* ============================================================
   CONVERSATION TAB — FIXED + BADGES + XP
============================================================ */

const CONVERSATIONS = [
    {
        level: "A1",
        english: "Waiter: What would you like to drink?\nYou: I would like water, please.",
        spanishPrompt: "Camarero: ¿Qué le gustaría beber?\nTú: Me gustaría agua, por favor."
    },
    {
        level: "A2",
        english: "Receptionist: Do you have a reservation?\nYou: Yes, I have a reservation in my name.",
        spanishPrompt: "Recepcionista: ¿Tiene una reserva?\nTú: Sí, tengo una reserva a mi nombre."
    },
    {
        level: "B1",
        english: "Manager: Can you organize the meeting for tomorrow?\nYou: Yes, I will organize it.",
        spanishPrompt: "Jefe: ¿Puedes organizar la reunión para mañana?\nTú: Sí, la voy a organizar."
    },
    {
        level: "B2",
        english: "Colleague: We need to analyze the situation.\nYou: I agree, let's evaluate all the options.",
        spanishPrompt: "Compañero: Necesitamos analizar la situación.\nTú: Estoy de acuerdo, evaluemos todas las opciones."
    }
];

function speakIncorrect(correctAnswer) {
    const message = `Incorrecto. La respuesta correcta es: ${correctAnswer}`;
    speakSpanish(message);
}

function renderConversationTab() {
    const container = document.getElementById("conversation-content");
    if (!container) return;
    container.innerHTML = "";

    const currentLevel = getCurrentCEFRLevel();
    const pool = CONVERSATIONS.filter(c => c.level === currentLevel) || CONVERSATIONS;
    const convo = pool[Math.floor(Math.random() * pool.length)];

    const card = document.createElement("div");
    card.className = "glass-card conversation-card";
    card.innerHTML = `
        <h2>Conversation Practice</h2>
        <pre class="conversation-english">${convo.english}</pre>
        <button class="pill-btn" id="conversation-play">Play Spanish audio</button>
        <div class="conversation-answer">
            <label>Your answer in Spanish:</label>
            <textarea id="conversation-input" rows="3" placeholder="Type your Spanish response"></textarea>
            <button class="pill-btn" id="conversation-check">Submit</button>
        </div>
    `;
    container.appendChild(card);

    const playBtn = document.getElementById("conversation-play");
    const input = document.getElementById("conversation-input");
    const checkBtn = document.getElementById("conversation-check");

    playBtn.onclick = () => {
        speakSpanish(convo.spanishPrompt);
    };

    checkBtn.onclick = () => {
        const learnerAnswer = input.value.trim();
        if (!learnerAnswer) {
            alert("Try writing a response in Spanish.");
            return;
        }

        const correctAnswer = convo.spanishPrompt.split("\n")[1].replace("Tú: ", "").trim();

        conversationStats.attempts++;

        if (learnerAnswer.toLowerCase() !== correctAnswer.toLowerCase()) {
            alert("Incorrect. Listen to Sabina for the correct answer.");
            setTimeout(() => {
                speakIncorrect(correctAnswer);
            }, 600);
            return;
        }

        conversationStats.correct++;
        checkConversationBadges();

        addXP(10);
        alert("Nice! Keep practicing your Spanish responses.");
        renderConversationTab();
    };
}

/* ============================================================
   FLASHCARDS TAB — FIXED + FLIP ANIMATION + AUDIO
============================================================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flashcards-content");
    if (!container) return;
    container.innerHTML = "";

    const currentLevel = getCurrentCEFRLevel();

    LISTEN_CATEGORIES.forEach(cat => {
        const section = document.createElement("div");
        section.className = "flashcard-section";

        section.innerHTML = `
            <div class="flashcard-header">
                <span>${cat.name}</span>
            </div>
            <div id="flashcards-${cat.id}" class="flashcard-grid"></div>
        `;

        container.appendChild(section);

        loadFlashcardCategory(cat.id, currentLevel);
    });
}

function loadFlashcardCategory(catId, level) {
    const grid = document.getElementById(`flashcards-${catId}`);
    if (!grid) return;

    const words = CEFR_WORDS.filter(w => w.category === catId && w.level === level);

    if (!words.length) {
        grid.innerHTML = `<p class="no-flashcards">No flashcards for this level.</p>`;
        return;
    }

    words.forEach(w => {
        const card = document.createElement("div");
        card.className = "flashcard";

        const inner = document.createElement("div");
        inner.className = "flashcard-inner";

        // FRONT = English
        inner.innerHTML = `
            <div class="flashcard-text">${w.english}</div>
        `;

        card.appendChild(inner);

        card.onclick = () => {
            const flipped = card.classList.toggle("flipped");

            if (flipped) {
                // BACK = Spanish + audio
                inner.innerHTML = `<div class="flashcard-text">${w.spanish}</div>`;
                speakSpanish(w.spanish);
            } else {
                // FRONT = English (no audio)
                inner.innerHTML = `<div class="flashcard-text">${w.english}</div>`;
            }
        };

        grid.appendChild(card);
    });
}

/* ============================================================
   CERTIFICATES TAB — FINAL VERSION
============================================================ */

function renderCertificatesTab() {
    const container = document.getElementById("certificates-content");
    if (!container) return;
    container.innerHTML = "";

    const nameInput = document.getElementById("cert-name-input");
    const name = nameInput ? nameInput.value.trim() || "Learner" : "Learner";

    const certList = [
        { key: "a1", label: "A1 Certificate" },
        { key: "a2", label: "A2 Certificate" },
        { key: "b1", label: "B1 Certificate" },
        { key: "quiz", label: "Quiz Mastery" },
        { key: "builder", label: "Sentence Builder Mastery" },
        { key: "conversation", label: "Conversation Mastery" },
        { key: "smart", label: "Smart Conversation Mastery" },
        { key: "daily", label: "Daily Streak Award" }
    ];

    /* ============================================================
       1. CERTIFICATE PREVIEW ELEMENTS
    ============================================================ */
    certList.forEach(cert => {
        const preview = document.createElement("div");
        preview.className = "certificate-preview";
        preview.id = `cert-${cert.key}`;

        const certID = generateCertificateID(cert.key);

        preview.innerHTML = `
            <h3>${cert.label}</h3>
            <p>This certifies that <strong>${name}</strong> has unlocked <strong>${cert.label}</strong>.</p>
            <div class="cert-id">Certificate ID: ${certID}</div>
        `;

        const qrBox = document.createElement("div");
        qrBox.className = "cert-qr";
        qrBox.appendChild(generateQR(`https://yourapp.com/cert/${certID}`));
        preview.appendChild(qrBox);

        const downloadBtn = document.createElement("button");
        downloadBtn.className = "cert-download-btn";
        downloadBtn.textContent = "Download Certificate";
        downloadBtn.onclick = () => downloadCertificate(cert.key);
        preview.appendChild(downloadBtn);

        if (certificates[cert.key]) {
            preview.classList.add("certificate-unlocked");
        }

        container.appendChild(preview);
    });

    /* ============================================================
       2. CERTIFICATE GALLERY
    ============================================================ */
    const gallery = document.createElement("div");
    gallery.className = "cert-gallery";

    certList.forEach(cert => {
        const item = document.createElement("div");
        item.className = "cert-gallery-item";
        if (!certificates[cert.key]) item.classList.add("locked");

        item.innerHTML = `
            <h4>${cert.label}</h4>
            <p>${certificates[cert.key] ? "Unlocked" : "Locked"}</p>
        `;

        gallery.appendChild(item);
    });

    container.appendChild(gallery);

    /* ============================================================
       3. REFRESH BUTTON
    ============================================================ */
    const btnRow = document.createElement("div");
    btnRow.className = "cert-btn-row";

    btnRow.innerHTML = `
        <button class="cert-btn" id="cert-refresh">Refresh Certificates</button>
    `;
    container.appendChild(btnRow);

    document.getElementById("cert-refresh").onclick = () => renderCertificatesTab();
}

/* ============================================================
   MODERN CELEBRATION — CONFETTI + POPUP
============================================================ */

function launchCertificateConfetti() {
    document.querySelectorAll(".confetti-container").forEach(c => c.remove());

    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
        piece.style.animationDelay = (Math.random() * 1) + "s";
        confettiContainer.appendChild(piece);
    }

    setTimeout(() => confettiContainer.remove(), 3000);
}

function unlockCertificate(key) {
    if (!certificates[key]) {
        certificates[key] = true;
        saveCertificates();
        renderCertificatesTab();

        const certEl = document.getElementById(`cert-${key}`);
        if (certEl) certEl.classList.add("certificate-unlocked");

        const popup = document.createElement("div");
        popup.className = "celebration-popup";
        popup.textContent = "🎉 Certificado desbloqueado";
        document.body.appendChild(popup);

        setTimeout(() => popup.classList.add("show"), 50);
        setTimeout(() => popup.classList.remove("show"), 2500);
        setTimeout(() => popup.remove(), 3000);

        launchCertificateConfetti();
        speakSpanish("Certificado desbloqueado");
    }
}

/* ============================================================
   CERTIFICATE ID + QR CODE
============================================================ */

function generateCertificateID(key) {
    if (!certificateIDs[key]) {
        certificateIDs[key] = `${key.toUpperCase()}-${Date.now().toString(36)}`;
        saveCertificateIDs();
    }
    return certificateIDs[key];
}

function generateQR(url) {
    const img = document.createElement("img");
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}`;
    img.alt = "QR Code";
    img.style.borderRadius = "12px";
    return img;
}

/* ============================================================
   CERTIFICATE DOWNLOAD (html2canvas + jsPDF)
============================================================ */

function downloadCertificate(certKey) {
    const certEl = document.getElementById(`cert-${certKey}`);
    if (!certEl) return;

    html2canvas(certEl).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`${certKey}-certificate.pdf`);
    });
}

/* ============================================================
   PROGRESS SUMMARY (GLOBAL)
============================================================ */

function renderProgressSummary() {
    const el = document.getElementById("progress-summary");
    if (!el) return;

    const stats = getLevelStats();
    const current = getCurrentCEFRLevel();
    const due = getDueWords().length;

    el.innerHTML = `
        <strong>Current CEFR Level:</strong> ${current}<br>
        A1: ${stats.A1.mastered}/${stats.A1.total} mastered (avg ${stats.A1.avg}%)<br>
        A2: ${stats.A2.mastered}/${stats.A2.total} mastered (avg ${stats.A2.avg}%)<br>
        B1: ${stats.B1.mastered}/${stats.B1.total} mastered (avg ${stats.B1.avg}%)<br>
        B2: ${stats.B2.mastered}/${stats.B2.total} mastered (avg ${stats.B2.avg}%)<br>
        <strong>Due for review:</strong> ${due}
    `;
}

/* ============================================================
   TAB ROUTER — FINAL VERSION
============================================================ */

const tabs = {
    listen: document.getElementById("tab-listen"),
    flashcards: document.getElementById("tab-flashcards"),
    build: document.getElementById("tab-build"),
    sentence: document.getElementById("tab-sentence"),
    conversation: document.getElementById("tab-conversation"),
    certificates: document.getElementById("tab-certificates"),
    dashboard: document.getElementById("tab-dashboard")
};

function showTab(name) {
    Object.values(tabs).forEach(t => {
        if (t) {
            t.style.display = "none";
            t.classList.remove("tab-active");
        }
    });

    if (tabs[name]) {
        tabs[name].style.display = "block";
        void tabs[name].offsetWidth; // force reflow
        tabs[name].classList.add("tab-active");
    }

    switch(name) {
        case "listen": renderListenTab(); break;
        case "flashcards": renderFlashcardsTab(); break;
        case "build": renderBuildTab(); break;
        case "sentence": renderSentenceTab(); break;
        case "conversation": renderConversationTab(); break;
        case "certificates": renderCertificatesTab(); break;
        case "dashboard": renderDashboardTab(); break;
    }

    renderProgressSummary();
}

/* ============================================================
   INITIAL TAB LOAD
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    showTab("dashboard");
});
