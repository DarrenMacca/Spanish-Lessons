/* =========================
   GLOBAL APP STATE
   ========================= */

const AppState = {
    userName: "",
    currentLevel: "A1",
    speechRate: 1.0,
    activeTab: "dashboard"
};

/* =========================
   CEFR PROGRESSION ENGINE
   ========================= */

const CEFRProgressionEngine = (() => {

    const STORAGE_KEY = "cefr_progress";

    const LEVELS = ["A1", "A2", "B1"];
    const XP_THRESHOLDS = { A1: 0, A2: 300, B1: 700 };
    const MASTER_REQUIREMENTS = { A1: 0.70, A2: 0.75 };
    const XP_REWARDS = {
        listen: 5,
        flashcards: 10,
        quiz: 20,
        builder: 25,
        conversation: 15
    };

    let state = {
        currentLevel: "A1",
        xp: 0,
        streakDays: 1,
        quizScores: [],
        builderScores: [],
        conversationCount: 0,
        lastActiveDate: null
    };

    function load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const saved = JSON.parse(raw);
                state = { ...state, ...saved };
            } catch (e) {
                console.warn("CEFR engine: invalid stored state, resetting.");
            }
        }
        AppState.currentLevel = state.currentLevel;
        updateDashboardUI();
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function addXP(source) {
        const amount = XP_REWARDS[source] || 0;
        state.xp += amount;
        save();
        evaluateLevelUp();
        updateDashboardUI();
    }

    function recordQuizResult(level, scorePercent) {
        state.quizScores.push({ level, score: scorePercent });
        addXP("quiz");
    }

    function recordBuilderResult(level, scorePercent) {
        state.builderScores.push({ level, score: scorePercent });
        addXP("builder");
    }

    function recordConversationPromptCompleted() {
        state.conversationCount += 1;
        addXP("conversation");
    }

    function updateStreak(todayStr) {
        const today = todayStr || new Date().toISOString().slice(0, 10);

        if (!state.lastActiveDate) {
            state.streakDays = 1;
        } else if (isNextDay(state.lastActiveDate, today)) {
            state.streakDays += 1;
        } else if (state.lastActiveDate !== today) {
            state.streakDays = 1;
        }

        state.lastActiveDate = today;
        save();
        updateDashboardUI();
    }

    function evaluateLevelUp() {
        const current = state.currentLevel;
        const nextLevel = getNextLevel(current);
        if (!nextLevel) return;

        const xpEnough = state.xp >= XP_THRESHOLDS[nextLevel];
        const masteryEnough = getMasteryForLevel(current) >= (MASTER_REQUIREMENTS[current] || 1);

        if (xpEnough && masteryEnough) {
            state.currentLevel = nextLevel;
            AppState.currentLevel = nextLevel;
            save();
            if (window.showAchievement) {
                window.showAchievement(`Level up! You are now ${nextLevel}.`);
            }
            updateDashboardUI();
        }
    }

    function getNextLevel(level) {
        const idx = LEVELS.indexOf(level);
        if (idx === -1 || idx === LEVELS.length - 1) return null;
        return LEVELS[idx + 1];
    }

    function getMasteryForLevel(level) {
        const quizzes = state.quizScores.filter(q => q.level === level);
        const builders = state.builderScores.filter(b => b.level === level);
        const allScores = [...quizzes, ...builders].map(x => x.score);

        if (!allScores.length) return 0;

        const avg = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
        return avg / 100;
    }

    function updateDashboardUI() {
        const levelEl = document.getElementById("levelDisplay");
        if (levelEl) levelEl.textContent = state.currentLevel;

        const xpEl = document.getElementById("xpDisplay");
        if (xpEl) xpEl.textContent = `${state.xp} XP`;

        const cefrFill = document.getElementById("cefrFill");
        if (cefrFill) {
            const next = getNextLevel(state.currentLevel) || state.currentLevel;
            const threshold = XP_THRESHOLDS[next] || 1;
            const pct = Math.min(100, (state.xp / threshold) * 100);
            cefrFill.style.width = `${pct}%`;
        }

        const quizMasteryEl = document.getElementById("quizMasteryDisplay");
        if (quizMasteryEl) {
            const mastery = getMasteryForLevel(state.currentLevel);
            quizMasteryEl.textContent = `${Math.round(mastery * 100)}%`;
        }

        const builderScoreEl = document.getElementById("builderScoreDisplay");
        if (builderScoreEl) {
            builderScoreEl.textContent =
                state.builderScores.length
                    ? state.builderScores[state.builderScores.length - 1].score + "%"
                    : "0%";
        }

        const convEl = document.getElementById("conversationCountDisplay");
        if (convEl) convEl.textContent = `${state.conversationCount}`;

        const streakEl = document.getElementById("streakDisplay");
        if (streakEl) streakEl.textContent = `${state.streakDays} Day${state.streakDays === 1 ? "" : "s"}`;
    }

    function isNextDay(prev, current) {
        const p = new Date(prev);
        const c = new Date(current);
        const diff = (c - p) / (1000 * 60 * 60 * 24);
        return diff >= 1 && diff < 2;
    }

    return {
        load,
        addXP,
        recordQuizResult,
        recordBuilderResult,
        recordConversationPromptCompleted,
        updateStreak,
        getMasteryForLevel,
        getState: () => ({ ...state })
    };
})();

/* =========================
   TAB NAVIGATION
   ========================= */

function initTabs() {
    const tabLinks = document.querySelectorAll(".top-nav a");
    const tabContents = document.querySelectorAll(".tab-content");

    tabLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = link.dataset.tab;
            if (!target) return;

            AppState.activeTab = target;

            tabLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            tabContents.forEach(sec => {
                sec.style.display = sec.id === target ? "block" : "none";
            });

            refreshActiveTab();
        });
    });
}

/* =========================
   ACHIEVEMENT POPUP
   ========================= */

function showAchievement(message) {
    console.log("ACHIEVEMENT:", message);
}
window.showAchievement = showAchievement;

/* =========================
   USER NAME SAVING
   ========================= */

function initNameSaving() {
    const input = document.getElementById("userNameInput");
    const btn = document.getElementById("saveNameBtn");

    if (!input || !btn) return;

    const saved = localStorage.getItem("cefr_user_name");
    if (saved) {
        AppState.userName = saved;
        input.value = saved;
    }

    btn.addEventListener("click", () => {
        const name = input.value.trim();
        if (!name) return;

        AppState.userName = name;
        localStorage.setItem("cefr_user_name", name);

        showAchievement(`Name saved: ${name}`);
    });
}

/* =========================
   SPEECH RATE CONTROL
   ========================= */

function initSpeechRate() {
    const slider = document.getElementById("speechRateSlider");
    if (!slider) return;

    const saved = localStorage.getItem("cefr_speech_rate");
    if (saved) {
        AppState.speechRate = parseFloat(saved);
        slider.value = saved;
    }

    slider.addEventListener("input", () => {
        const rate = parseFloat(slider.value);
        AppState.speechRate = rate;
        localStorage.setItem("cefr_speech_rate", rate);
    });
}

/* =========================
   LEVEL PILLS
   ========================= */

function initLevelPills() {
    const pills = document.querySelectorAll(".level-select button");

    pills.forEach(pill => {
        if (pill.dataset.level === AppState.currentLevel) {
            pill.classList.add("active-level");
        }

        pill.addEventListener("click", () => {
            const level = pill.dataset.level;
            if (!level) return;

            AppState.currentLevel = level;

            const state = CEFRProgressionEngine.getState();
            state.currentLevel = level;
            localStorage.setItem("cefr_progress", JSON.stringify(state));

            pills.forEach(p => p.classList.remove("active-level"));
            pill.classList.add("active-level");

            showAchievement(`Switched to ${level} content`);
            renderDashboard();
            refreshActiveTab();
        });
    });
}

/* =========================
   DAILY STREAK
   ========================= */

function updateDailyStreak() {
    CEFRProgressionEngine.updateStreak();
}

/* =========================
   PART 2 INITIALIZER
   ========================= */

function initPart2() {
    initNameSaving();
    initSpeechRate();
    initLevelPills();
    updateDailyStreak();
}

/* =========================
   DASHBOARD (SAFE STUB)
   ========================= */

function renderDashboard() {
    // Implement your real dashboard rendering here.
    // Safe stub to avoid runtime errors.
}

/* =========================
   A1 WORD BANK + CONNECTORS
   ========================= */

const A1_WORD_BANK = {
    foodDrink: [
        { es: "manzana", en: "apple" },
        { es: "naranja", en: "orange" },
        { es: "plátano", en: "banana" },
        { es: "fruta", en: "fruit" },
        { es: "verdura", en: "vegetable" },
        { es: "sopa", en: "soup" },
        { es: "ensalada", en: "salad" },
        { es: "arroz", en: "rice" },
        { es: "frijoles", en: "beans" },
        { es: "queso", en: "cheese" },
        { es: "mantequilla", en: "butter" },
        { es: "azúcar", en: "sugar" },
        { es: "sal", en: "salt" },
        { es: "huevo", en: "egg" },
        { es: "bistec", en: "steak" },
        { es: "pollo", en: "chicken" },
        { es: "pescado", en: "fish" },
        { es: "papas fritas", en: "potato chips" },
        { es: "cerveza", en: "beer" },
        { es: "agua", en: "water" },
        { es: "café", en: "coffee" },
        { es: "té", en: "tea" },
        { es: "vino", en: "wine" },
        { es: "jugo", en: "juice" },
        { es: "pan", en: "bread" },
        { es: "sándwich", en: "sandwich" },
        { es: "hamburguesa", en: "hamburger" },
        { es: "desayuno", en: "breakfast" },
        { es: "almuerzo", en: "lunch" },
        { es: "cena", en: "dinner" }
    ],

    greetings: [
        { es: "hola", en: "hello" },
        { es: "adiós", en: "goodbye" },
        { es: "buenos días", en: "good morning" },
        { es: "buenas tardes", en: "good afternoon" },
        { es: "buenas noches", en: "good night" },
        { es: "por favor", en: "please" },
        { es: "gracias", en: "thank you" },
        { es: "lo siento", en: "sorry" },
        { es: "sí", en: "yes" },
        { es: "no", en: "no" },
        { es: "¿cómo estás?", en: "how are you?" },
        { es: "bien", en: "good" },
        { es: "mal", en: "bad" },
        { es: "más o menos", en: "so-so" },
        { es: "¿qué tal?", en: "how’s it going?" },
        { es: "¿cómo te llamas?", en: "what’s your name?" },
        { es: "me llamo...", en: "my name is..." },
        { es: "mucho gusto", en: "nice to meet you" },
        { es: "hasta luego", en: "see you later" },
        { es: "hasta mañana", en: "see you tomorrow" }
    ],

    travel: [
        { es: "aeropuerto", en: "airport" },
        { es: "estación", en: "station" },
        { es: "hotel", en: "hotel" },
        { es: "restaurante", en: "restaurant" },
        { es: "baño", en: "bathroom" },
        { es: "calle", en: "street" },
        { es: "mapa", en: "map" },
        { es: "taxi", en: "taxi" },
        { es: "autobús", en: "bus" },
        { es: "tren", en: "train" },
        { es: "coche", en: "car" },
        { es: "izquierda", en: "left" },
        { es: "derecha", en: "right" },
        { es: "recto", en: "straight" },
        { es: "cerca", en: "near" },
        { es: "lejos", en: "far" },
        { es: "aquí", en: "here" },
        { es: "allí", en: "there" },
        { es: "entrada", en: "entrance" },
        { es: "salida", en: "exit" }
    ],

    family: [
        { es: "madre", en: "mother" },
        { es: "padre", en: "father" },
        { es: "hermano", en: "brother" },
        { es: "hermana", en: "sister" },
        { es: "hijo", en: "son" },
        { es: "hija", en: "daughter" },
        { es: "amigo", en: "friend (m)" },
        { es: "amiga", en: "friend (f)" },
        { es: "persona", en: "person" },
        { es: "gente", en: "people" },
        { es: "hombre", en: "man" },
        { es: "mujer", en: "woman" },
        { es: "niño", en: "boy" },
        { es: "niña", en: "girl" },
        { es: "familia", en: "family" },
        { es: "pareja", en: "partner" },
        { es: "bebé", en: "baby" },
        { es: "abuelo", en: "grandfather" },
        { es: "abuela", en: "grandmother" },
        { es: "vecino", en: "neighbor" }
    ],

    home: [
        { es: "casa", en: "house" },
        { es: "apartamento", en: "apartment" },
        { es:: "habitación", en: "room" },
        { es: "cama", en: "bed" },
        { es: "mesa", en: "table" },
        { es: "silla", en: "chair" },
        { es: "puerta", en: "door" },
        { es: "ventana", en: "window" },
        { es: "cocina", en: "kitchen" },
        { es: "baño", en: "bathroom" },
        { es: "ducha", en: "shower" },
        { es: "lámpara", en: "lamp" },
        { es: "teléfono", en: "phone" },
        { es: "computadora", en: "computer" },
        { es: "libro", en: "book" },
        { es: "papel", en: "paper" },
        { es: "lápiz", en: "pencil" },
        { es: "mochila", en: "backpack" },
        { es: "llave", en: "key" },
        { es: "reloj", en: "clock" }
    ],

    learning: [
        { es: "escuela", en: "school" },
        { es: "clase", en: "class" },
        { es: "profesor", en: "teacher" },
        { es: "estudiante", en: "student" },
        { es: "tarea", en: "homework" },
        { es: "pregunta", en: "question" },
        { es: "respuesta", en: "answer" },
        { es: "palabra", en: "word" },
        { es: "frase", en: "sentence" },
        { es: "libro", en: "book" },
        { es: "cuaderno", en: "notebook" },
        { es: "examen", en: "exam" },
        { es: "práctica", en: "practice" },
        { es: "aprender", en: "to learn" },
        { es: "estudiar", en: "to study" },
        { es: "repetir", en: "to repeat" },
        { es: "escuchar", en: "to listen" },
        { es: "hablar", en: "to speak" },
        { es: "leer", en: "to read" },
        { es: "escribir", en: "to write" }
    ],

    connectors: [
        { es: "y", en: "and" },
        { es: "o", en: "or" },
        { es: "pero", en: "but" },
        { es: "porque", en: "because" },
        { es: "también", en: "also / too" },
        { es: "entonces", en: "then / so" },
        { es: "luego", en: "later / then" },
        { es: "después", en: "after" },
        { es: "antes", en: "before" },
        { es: "con", en: "with" },
        { es: "sin", en: "without" },
        { es: "sobre", en: "about / on" },
        { es: "para", en: "for / in order to" },
        { es: "de", en: "of / from" },
        { es: "a", en: "to" },
        { es: "pero no", en: "but not" },
        { es: "y luego", en: "and then" }
    ]
};

/* =========================
   A2 WORD BANK
   ========================= */

const A2_WORD_BANK = {
    dailyLife: [
        { es: "despertarse", en: "to wake up" },
        { es: "levantarse", en: "to get up" },
        { es: "vestirse", en: "to get dressed" },
        { es: "ducharse", en: "to shower" },
        { es: "cepillarse los dientes", en: "to brush teeth" },
        { es: "hacer la cama", en: "to make the bed" },
        { es: "preparar la comida", en: "to prepare food" },
        { es: "limpiar", en: "to clean" },
        { es: "lavar la ropa", en: "to wash clothes" },
        { es: "ir de compras", en: "to go shopping" },
        { es: "pagar", en: "to pay" },
        { es: "cambiar dinero", en: "to exchange money" },
        { es: "hacer ejercicio", en: "to exercise" },
        { es: "descansar", en: "to rest" },
        { es: "acostarse", en: "to go to bed" }
    ],

    travel: [
        { es: "reservar", en: "to book" },
        { es: "billete", en: "ticket" },
        { es: "equipaje", en: "luggage" },
        { es: "maleta", en: "suitcase" },
        { es: "pasaporte", en: "passport" },
        { es: "aduana", en: "customs" },
        { es: "facturar", en: "to check in" },
        { es: "llegada", en: "arrival" },
        { es: "salida", en: "departure" },
        { es: "retraso", en: "delay" },
        { es: "ventanilla", en: "window seat" },
        { es: "pasillo", en: "aisle" },
        { es: "alojamiento", en: "accommodation" },
        { es: "alquilar", en: "to rent" },
        { es: "guía turístico", en: "tour guide" }
    ],

    foodDrink: [
        { es: "carne", en: "meat" },
        { es: "mariscos", en: "seafood" },
        { es: "postre", en: "dessert" },
        { es: "pastel", en: "cake" },
        { es: "galleta", en: "cookie" },
        { es: "aceite", en: "oil" },
        { es: "vinagre", en: "vinegar" },
        { es: "pimienta", en: "pepper" },
        { es: "menú", en: "menu" },
        { es: "cuenta", en: "bill" },
        { es: "propina", en: "tip" },
        { es: "camarero", en: "waiter" },
        { es: "camarera", en: "waitress" },
        { es: "reservación", en: "reservation" },
        { es: "sabor", en: "flavor" }
    ],

    shopping: [
        { es: "precio", en: "price" },
        { es: "rebaja", en: "discount" },
        { es: "oferta", en: "sale" },
        { es: "talla", en: "size" },
        { es: "probador", en: "changing room" },
        { es: "dependiente", en: "shop assistant" },
        { es: "marca", en: "brand" },
        { es: "calidad", en: "quality" },
        { es: "efectivo", en: "cash" },
        { es: "tarjeta", en: "card" },
        { es: "recibo", en: "receipt" },
        { es: "devolver", en: "to return (an item)" },
        { es: "comprar", en: "to buy" },
        { es: "vender", en: "to sell" },
        { es: "costar", en: "to cost" }
    ],

    workSchool: [
        { es: "entrevista", en: "interview" },
        { es: "empleo", en: "job" },
        { es: "jefe", en: "boss" },
        { es: "compañero", en: "coworker" },
        { es: "horario", en: "schedule" },
        { es: "reunión", en: "meeting" },
        { es: "proyecto", en: "project" },
        { es: "presentación", en: "presentation" },
        { es: "examen", en: "exam" },
        { es: "nota", en: "grade" },
        { es: "aprobar", en: "to pass" },
        { es: "suspender", en: "to fail" },
        { es: "investigar", en: "to research" },
        { es: "asignatura", en: "subject" },
        { es: "universidad", en: "university" }
    ],

    health: [
        { es: "cita médica", en: "doctor’s appointment" },
        { es: "síntoma", en: "symptom" },
        { es: "tos", en: "cough" },
        { es: "fiebre", en: "fever" },
        { es: "dolor", en: "pain" },
        { es: "medicina", en: "medicine" },
        { es: "receta", en: "prescription" },
        { es: "farmacia", en: "pharmacy" },
        { es: "curarse", en: "to recover" },
        { es: "herida", en: "injury" },
        { es: "vendaje", en: "bandage" },
        { es: "emergencia", en: "emergency" },
        { es: "hospital", en: "hospital" },
        { es: "enfermero", en: "nurse" },
        { es: "saludable", en: "healthy" }
    ],

    connectors: [
        { es: "aunque", en: "although" },
        { es: "sin embargo", en: "however" },
        { es: "por eso", en: "that’s why" },
        { es: "además", en: "in addition" },
        { es: "por lo tanto", en: "therefore" },
        { es: "mientras", en: "while" },
        { es: "cuando", en: "when" },
        { es: "antes de", en: "before" },
        { es: "después de", en: "after" },
        { es: "durante", en: "during" },
        { es: "a veces", en: "sometimes" },
        { es: "normalmente", en: "normally" },
        { es: "generalmente", en: "generally" },
        { es: "casi siempre", en: "almost always" },
        { es: "casi nunca", en: "almost never" }
    ]
};

/* =========================
   B1 WORD BANK
   ========================= */

const B1_WORD_BANK = {
    emotions: [
        { es: "orgulloso", en: "proud" },
        { es: "avergonzado", en: "embarrassed" },
        { es: "preocupado", en: "worried" },
        { es: "ansioso", en: "anxious" },
        { es: "emocionado", en: "excited" },
        { es: "decepcionado", en: "disappointed" },
        { es: "frustrado", en: "frustrated" },
        { es: "aliviado", en: "relieved" },
        { es: "confundido", en: "confused" },
        { es: "satisfecho", en: "satisfied" }
    ],

    workCareer: [
        { es: "ascenso", en: "promotion" },
        { es: "currículum", en: "résumé" },
        { es: "experiencia laboral", en: "work experience" },
        { es: "habilidad", en: "skill" },
        { es: "contrato", en: "contract" },
        { es: "empresa", en: "company" },
        { es: "empleador", en: "employer" },
        { es: "empleado", en: "employee" },
        { es: "gestionar", en: "to manage" },
        { es: "liderar", en: "to lead" }
    ],

    societyCulture: [
        { es: "costumbre", en: "custom" },
        { es: "tradición", en: "tradition" },
        { es: "comunidad", en: "community" },
        { es: "voluntario", en: "volunteer" },
        { es: "evento", en: "event" },
        { es: "festival", en: "festival" },
        { es: "medio ambiente", en: "environment" },
        { es: "contaminación", en: "pollution" },
        { es: "reciclaje", en: "recycling" },
        { es: "sostenible", en: "sustainable" }
    ],

    advancedDailyLife: [
        { es: "mudarse", en: "to move (house)" },
        { es: "arreglar", en: "to fix" },
        { es: "organizar", en: "to organize" },
        { es: "ahorrar", en: "to save money" },
        { es: "gastar", en: "to spend" },
        { es: "prestar", en: "to lend" },
        { es: "pedir prestado", en: "to borrow" },
        { es: "planificar", en: "to plan" },
        { es: "lograr", en: "to achieve" },
        { es: "intentar", en: "to try" }
    ],

    travelAdvanced: [
        { es: "itinerario", en: "itinerary" },
        { es: "destino", en: "destination" },
        { es: "alojarse", en: "to stay (lodging)" },
        { es: "explorar", en: "to explore" },
        { es: "aventura", en: "adventure" },
        { es: "paisaje", en: "landscape" },
        { es: "turismo", en: "tourism" },
        { es: "viajero", en: "traveler" },
        { es: "crucero", en: "cruise" },
        { es: "excursión", en: "excursion" }
    ],

    communication: [
        { es: "explicar", en: "to explain" },
        { es: "describir", en: "to describe" },
        { es: "opinar", en: "to give an opinion" },
        { es: "sugerir", en: "to suggest" },
        { es: "recomendar", en: "to recommend" },
        { es: "convencer", en: "to convince" },
        { es: "discutir", en: "to discuss" },
        { es: "aclarar", en: "to clarify" },
        { es: "preguntar", en: "to ask" },
        { es: "responder", en: "to respond" }
    ],

    connectors: [
        { es: "por otro lado", en: "on the other hand" },
        { es: "a pesar de", en: "despite" },
        { es: "en cambio", en: "instead / on the contrary" },
        { es: "por consiguiente", en: "consequently" },
        { es: "de hecho", en: "in fact" },
        { es: "en resumen", en: "in summary" },
        { es: "por ejemplo", en: "for example" },
        { es: "en particular", en: "in particular" },
        { es: "además de", en: "in addition to" },
        { es: "por supuesto", en: "of course" }
    ]
};

/* =========================
   B1 BUILDER VOCAB
   ========================= */

const B1_BUILDER_VOCAB = [
    { es: "creer", en: "to believe" },
    { es: "pensar", en: "to think" },
    { es: "opinar", en: "to give an opinion" },
    { es: "considerar", en: "to consider" },
    { es: "suponer", en: "to suppose" },
    { es: "imaginar", en: "to imagine" },

    { es: "explicar", en: "to explain" },
    { es: "describir", en: "to describe" },
    { es: "convencer", en: "to convince" },
    { es: "aclarar", en: "to clarify" },
    { es: "preguntar", en: "to ask" },
    { es: "responder", en: "to respond" },

    { es: "opinión", en: "opinion" },
    { es: "experiencia", en: "experience" },
    { es: "problema", en: "problem" },
    { es: "solución", en: "solution" },
    { es: "meta", en: "goal" },
    { es: "razón", en: "reason" },
    { es: "resultado", en: "result" },

    { es: "importante", en: "important" },
    { es: "necesario", en: "necessary" },
    { es: "posible", en: "possible" },
    { es: "difícil", en: "difficult" },
    { es: "fácil", en: "easy" },
    { es: "interesante", en: "interesting" },

    { es: "sin embargo", en: "however" },
    { es: "a pesar de", en: "despite" },
    { es: "por consiguiente", en: "consequently" },
    { es: "en cambio", en: "instead" },
    { es: "de hecho", en: "in fact" },
    { es: "por ejemplo", en: "for example" },

    { es: "lograr", en: "to achieve" },
    { es: "intentar", en: "to try" },
    { es: "mejorar", en: "to improve" },
    { es: "cambiar", en: "to change" },
    { es: "organizar", en: "to organize" },
    { es: "planificar", en: "to plan" }
];

/* Flatten all items for Flashcards + Quiz */
const A1_ALL_ITEMS = Object.values(A1_WORD_BANK).flat();
const A2_ALL_ITEMS = Object.values(A2_WORD_BANK).flat();
const B1_ALL_ITEMS = Object.values(B1_WORD_BANK).flat();

/* =========================
   SIMPLE SPANISH AUDIO HELPER
   ========================= */

function speakSpanish(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-ES";
    utter.rate = AppState.speechRate || 1.0;
    window.speechSynthesis.speak(utter);
}

/* =========================
   LISTEN TAB ENGINE
   ========================= */

function renderListenTab() {
    const container = document.getElementById("listenList");
    if (!container) return;
    container.innerHTML = "";

    const bank =
        AppState.currentLevel === "A1" ? A1_WORD_BANK :
        AppState.currentLevel === "A2" ? A2_WORD_BANK :
        AppState.currentLevel === "B1" ? B1_WORD_BANK :
        A1_WORD_BANK;

    const categories = Object.keys(bank).map(key => ({
        key,
        label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^\w/, c => c.toUpperCase())
            .replace("Food Drink", "Food & Drink")
            .replace("Daily Life", "Daily Life")
            .replace("Advanced Daily Life", "Advanced Daily Life")
            .replace("Work Career", "Work & Career")
            .replace("Society Culture", "Society & Culture")
            .replace("Travel Advanced", "Advanced Travel")
            .replace("Communication", "Communication")
            .replace("Connectors", "Connectors")
    }));

    categories.forEach(cat => {
        const section = document.createElement("section");

        const title = document.createElement("h3");
        title.textContent = cat.label;
        section.appendChild(title);

        const list = document.createElement("div");

        (bank[cat.key] || []).forEach(item => {
            const row = document.createElement("div");
            row.className = "listen-row";

            const text = document.createElement("div");
            text.textContent = `${item.es} — ${item.en}`;

            const btn = document.createElement("button");
            btn.className = "listen-play-btn";
            btn.textContent = "▶";
            btn.addEventListener("click", () => {
                speakSpanish(item.es);
                CEFRProgressionEngine.addXP("listen");
            });

            row.appendChild(text);
            row.appendChild(btn);
            list.appendChild(row);
        });

        section.appendChild(list);
        container.appendChild(section);
    });
}

/* =========================
   FLASHCARDS TAB ENGINE
   ========================= */

function renderFlashcardsTab() {
    const grid = document.getElementById("flashcardsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const source =
        AppState.currentLevel === "A1" ? A1_ALL_ITEMS :
        AppState.currentLevel === "A2" ? A2_ALL_ITEMS :
        AppState.currentLevel === "B1" ? B1_ALL_ITEMS :
        [];

    source.forEach(item => {
        const card = document.createElement("div");
        card.className = "flashcard";

        const front = document.createElement("div");
        front.className = "flashcard-front";
        front.textContent = item.en;

        const back = document.createElement("div");
        back.className = "flashcard-back";
        back.textContent = item.es;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener("click", () => {
            const alreadyFlipped = card.classList.contains("flipped");

            document.querySelectorAll(".flashcard.flipped").forEach(c => {
                if (c !== card) c.classList.remove("flipped");
            });

            if (!alreadyFlipped) {
                card.classList.add("flipped");
                speakSpanish(item.es);
                CEFRProgressionEngine.addXP("flashcards");
            } else {
                card.classList.remove("flipped");
            }
        });

        grid.appendChild(card);
    });
}

/* =========================
   QUIZ TAB ENGINE
   ========================= */

let currentQuizQuestion = null;

function renderQuizTab() {
    const qEl = document.getElementById("quizQuestion");
    const optEl = document.getElementById("quizOptions");
    if (!qEl || !optEl) return;

    optEl.innerHTML = "";

    const pool =
        AppState.currentLevel === "A1" ? A1_ALL_ITEMS :
        AppState.currentLevel === "A2" ? A2_ALL_ITEMS :
        AppState.currentLevel === "B1" ? B1_ALL_ITEMS :
        [];

    const mode = ["type", "select", "audio"][Math.floor(Math.random() * 3)];
    const item = pool[Math.floor(Math.random() * pool.length)];

    currentQuizQuestion = { mode, item };

    if (mode === "type") {
        qEl.textContent = `Type the Spanish for: "${item.en}"`;

        const input = document.createElement("input");
        input.type = "text";
        input.className = "quiz-option";
        input.placeholder = "Type Spanish here...";

        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.textContent = "Check";

        btn.addEventListener("click", () => {
            const answer = input.value.trim().toLowerCase();
            const correct = item.es.toLowerCase();
            const score = answer === correct ? 100 : 0;

            CEFRProgressionEngine.recordQuizResult(AppState.currentLevel, score);

            if (answer === correct) {
                showAchievement("Correct!");
                renderQuizTab();
            } else {
                showAchievement(`Incorrect. Correct answer: ${item.es}`);
            }
        });

        optEl.appendChild(input);
        optEl.appendChild(btn);
        return;
    }

    if (mode === "audio") {
        qEl.textContent = "Listen and choose the correct Spanish word:";
        speakSpanish(item.es);
    } else {
        qEl.textContent = `Choose the Spanish for: "${item.en}"`;
    }

    const options = buildQuizOptions(item, pool);

    options.forEach(optItem => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.textContent = optItem.es;

        btn.addEventListener("click", () => {
            const correct = optItem.es === item.es;
            const score = correct ? 100 : 0;

            CEFRProgressionEngine.recordQuizResult(AppState.currentLevel, score);

            if (correct) {
                showAchievement("Correct!");
                renderQuizTab();
            } else {
                showAchievement(`Incorrect. Correct answer: ${item.es}`);
            }
        });

        optEl.appendChild(btn);
    });
}

function buildQuizOptions(correctItem, pool) {
    const filtered = pool.filter(x => x.es !== correctItem.es);
    const distractors = [];

    while (distractors.length < 3 && filtered.length) {
        const idx = Math.floor(Math.random() * filtered.length);
        distractors.push(filtered.splice(idx, 1)[0]);
    }

    const options = [correctItem, ...distractors];

    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    return options;
}

/* =========================
   BUILDER TAB ENGINE
   ========================= */

let builderSentence = [];

function renderBuilderTab() {
    const grid = document.getElementById("builderGrid");
    const output = document.getElementById("builderOutput");
    const result = document.getElementById("builderResult");
    const checkBtn = document.getElementById("builderCheckBtn");
    const newBtn = document.getElementById("builderNewBtn");

    if (!grid || !output || !result || !checkBtn || !newBtn) return;

    grid.innerHTML = "";
    output.textContent = "";
    result.textContent = "";
    builderSentence = [];

    const pool =
        AppState.currentLevel === "A1"
            ? [...A1_WORD_BANK.foodDrink, ...A1_WORD_BANK.connectors]
            : AppState.currentLevel === "A2"
            ? [...A2_WORD_BANK.dailyLife, ...A2_WORD_BANK.connectors]
            : [...B1_BUILDER_VOCAB];

    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 10);

    shuffled.forEach(item => {
        const btn = document.createElement("button");
        btn.className = "builder-word-btn";
        btn.textContent = item.es;

        btn.addEventListener("click", () => {
            builderSentence.push(item.es);
            output.textContent = builderSentence.join(" ");
        });

        grid.appendChild(btn);
    });

    checkBtn.onclick = () => {
        if (!builderSentence.length) return;

        const sentence = builderSentence.join(" ");
        const score = Math.min(100, 40 + builderSentence.length * 10);

        result.textContent = `Sentence: "${sentence}" — Score: ${score}%`;

        CEFRProgressionEngine.recordBuilderResult(AppState.currentLevel, score);

        if (score >= 90) {
            showAchievement("Great sentence! 🎉");
        }
    };

    newBtn.onclick = () => {
        renderBuilderTab();
    };
}

/* =========================
   CONVERSATION TAB ENGINE
   ========================= */

const A1_PROMPTS = [
    "Pide comida y bebida en un café.",
    "Presenta a tu familia a otra persona.",
    "Describe tu casa o apartamento.",
    "Habla sobre tu rutina diaria.",
    "Cuenta qué te gusta comer y beber."
];

const A2_PROMPTS = [
    "¿Qué haces normalmente por la mañana?",
    "¿Qué sueles hacer después de trabajar?",
    "Describe tu rutina de lunes a viernes.",
    "¿Qué haces cuando llegas a casa?",
    "¿Qué prefieres hacer por la tarde?",
    "Explica cómo haces la compra cada semana.",
    "Describe tu plato favorito y cómo se prepara.",
    "¿Qué sueles comprar cuando vas al supermercado?",
    "¿Prefieres comer en casa o en un restaurante? ¿Por qué?",
    "Cuenta una experiencia comprando ropa.",
    "Describe un viaje reciente que hiciste.",
    "¿Qué lugares te gusta visitar los fines de semana?",
    "Explica cómo reservas un hotel o un billete.",
    "¿Prefieres viajar solo o con amigos?",
    "Habla sobre un lugar turístico que te gustaría conocer.",
    "Describe a un amigo y explica por qué es importante para ti.",
    "¿Qué haces normalmente con tu familia los fines de semana?",
    "Cuenta una celebración especial que recuerdes.",
    "¿Qué actividades te gusta hacer con otras personas?",
    "Describe una conversación interesante que tuviste recientemente.",
    "¿Qué tipo de música te gusta y por qué?",
    "Explica qué película o serie te gusta más.",
    "¿Qué deporte prefieres practicar?",
    "Habla sobre algo que te gustaría aprender este año.",
    "¿Qué cosas te parecen importantes en la vida diaria?",
    "Describe una visita reciente al médico.",
    "¿Qué haces para mantenerte saludable?",
    "Explica qué haces cuando estás enfermo.",
    "¿Qué hábitos saludables tienes?",
    "Habla sobre una actividad que te ayuda a relajarte."
];

const B1_PROMPTS = [
    "Describe una experiencia que cambió tu forma de pensar.",
    "Habla sobre un problema que resolviste recientemente.",
    "Cuenta una situación difícil y cómo la manejaste.",
    "Explica un hábito que intentas mejorar.",
    "Describe un día que fue especialmente productivo para ti.",
    "Describe un viaje largo que hiciste y qué aprendiste.",
    "Habla sobre una cultura diferente que te interesa.",
    "Explica una situación inesperada que ocurrió durante un viaje.",
    "Cuenta cómo organizas un viaje importante.",
    "Describe un lugar que te sorprendió y por qué.",
    "Habla sobre una amistad importante y cómo empezó.",
    "Describe un conflicto que resolviste con alguien.",
    "Explica qué cualidades valoras en una persona.",
    "Cuenta una experiencia social que te hizo sentir orgulloso.",
    "Describe una conversación profunda que tuviste recientemente.",
    "Explica una opinión que antes no tenías y ahora sí.",
    "Habla sobre un tema que te parece importante en la sociedad.",
    "Describe algo que te gustaría cambiar en tu vida diaria.",
    "Explica por qué te gusta o no te gusta un tipo de música o arte.",
    "Cuenta qué opinas sobre el uso de tecnología en la vida diaria.",
    "Describe una meta personal que estás intentando alcanzar.",
    "Habla sobre un proyecto que completaste y cómo fue el proceso.",
    "Explica qué habilidades te gustaría mejorar este año.",
    "Cuenta una experiencia laboral que te enseñó algo importante.",
    "Describe un reto académico que superaste.",
    "Explica cómo manejas el estrés en tu vida diaria.",
    "Describe un cambio saludable que hiciste recientemente.",
    "Habla sobre una actividad que mejora tu bienestar mental.",
    "Cuenta una experiencia en la que ayudaste a alguien.",
    "Explica qué significa para ti tener una vida equilibrada."
];

function renderConversationTab() {
    const promptEl = document.getElementById("conversationPrompt");
    const responseEl = document.getElementById("conversationResponse");
    const sendBtn = document.getElementById("conversationSendBtn");
    const newBtn = document.getElementById("conversationNewBtn");
    const resultEl = document.getElementById("conversationResult");

    if (!promptEl || !responseEl || !sendBtn || !newBtn || !resultEl) return;

    const prompts =
        AppState.currentLevel === "A1" ? A1_PROMPTS :
        AppState.currentLevel === "A2" ? A2_PROMPTS :
        AppState.currentLevel === "B1" ? B1_PROMPTS :
        A1_PROMPTS;

    function newPrompt() {
        const p = prompts[Math.floor(Math.random() * prompts.length)];
        promptEl.textContent = p;
        responseEl.value = "";
        resultEl.textContent = "";
    }

    sendBtn.onclick = () => {
        const text = responseEl.value.trim();
        if (!text) return;

        CEFRProgressionEngine.recordConversationPromptCompleted();
        resultEl.textContent = "Buen intento. Sigue practicando y revisa tus frases.";
        showAchievement("Conversation attempt recorded!");
    };

    newBtn.onclick = () => {
        newPrompt();
    };

    newPrompt();
}

/* =========================
   CERTIFICATES TAB ENGINE
   ========================= */

function renderCertificatesTab() {
    const area = document.getElementById("certificatesArea");
    const preview = document.getElementById("certificatePreview");

    if (!area || !preview) return;

    area.innerHTML = "";
    preview.innerHTML = "";

    const state = CEFRProgressionEngine.getState();
    const certs = [];

    if (state.currentLevel === "A1" && CEFRProgressionEngine.getMasteryForLevel("A1") >= 0.7) {
        certs.push("A1 Certificate of Completion");
    }

    if (state.currentLevel === "A2" && CEFRProgressionEngine.getMasteryForLevel("A2") >= 0.75) {
        certs.push("A2 Certificate of Completion");
    }

    if (state.currentLevel === "B1" && CEFRProgressionEngine.getMasteryForLevel("B1") >= 0.8) {
        certs.push("B1 Certificate of Completion");
    }

    if (!certs.length) {
        area.textContent = "No certificates unlocked yet.";
        preview.textContent = "";
        return;
    }

    certs.forEach(name => {
        const card = document.createElement("div");
        card.className = "certificate-card";
        card.textContent = name;

        const btn = document.createElement("button");
        btn.className = "certificate-download-btn";
        btn.textContent = "Preview";

        btn.addEventListener("click", () => {
            preview.innerHTML = "";
            const pCard = document.createElement("div");
            pCard.className = "certificate-preview-card";
            pCard.textContent = `Preview: ${name}`;
            preview.appendChild(pCard);
        });

        card.appendChild(btn);
        area.appendChild(card);
    });
}

/* =========================
   BADGES TAB ENGINE
   ========================= */

function renderBadgesTab() {
    const list = document.getElementById("badgesList");
    if (!list) return;

    list.innerHTML = "";

    const state = CEFRProgressionEngine.getState();
    const badges = [];

    if (state.quizScores.length >= 5) badges.push("Quiz Explorer");
    if (state.builderScores.length >= 5) badges.push("Sentence Builder");
    if (state.conversationCount >= 5) badges.push("Conversation Starter");
    if (state.streakDays >= 7) badges.push("7-Day Streak");

    if (!badges.length) {
        const li = document.createElement("li");
        li.textContent = "No badges unlocked yet.";
        list.appendChild(li);
        return;
    }

    badges.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        list.appendChild(li);
    });
}

/* =========================
   REFRESH ACTIVE TAB
   ========================= */

function refreshActiveTab() {
    switch (AppState.activeTab) {
        case "dashboard":
            renderDashboard();
            break;
        case "listen":
            renderListenTab();
            break;
        case "flashcards":
            renderFlashcardsTab();
            break;
        case "quiz":
            renderQuizTab();
            break;
        case "builder":
            renderBuilderTab();
            break;
        case "conversation":
            renderConversationTab();
            break;
        case "certificates":
            renderCertificatesTab();
            break;
        case "badges":
            renderBadgesTab();
            break;
    }
}

/* =========================
   BOOTSTRAPPING
   ========================= */

window.addEventListener("DOMContentLoaded", () => {
    CEFRProgressionEngine.load();
    initTabs();
    initPart2();
    AppState.activeTab = "dashboard";
    refreshActiveTab();
});

