/* ============================================================
   GLOBAL STATE
============================================================ */

const Global = {
    level: "A1",
    audioRate: 1,
    name: "",
    resetAll() {
        localStorage.clear();
        location.reload();
    }
};

/* ============================================================
   CEFR WORDBANK MERGING (Conversation + Engines)
============================================================ */

function getConversationWordbank(level) {
    if (level === "A1") return [...A1];
    if (level === "A2") return [...A1, ...A2];
    if (level === "B1") return [...A1, ...A2, ...B1];
    if (level === "B2") return [...A1, ...A2, ...B1, ...B2];
    return [...A1];
}

function getAllWordbanksUpTo(level) {
    return getConversationWordbank(level);
}

/* ============================================================
   ROUTER — TAB SWITCHING
============================================================ */

const Router = {
    current: "dashboard",

    show(tabName) {
        const pages = document.querySelectorAll(".tab-page");
        pages.forEach(p => p.classList.add("hidden"));

        const target = document.getElementById(`tab-${tabName}`);
        if (target) target.classList.remove("hidden");

        const buttons = document.querySelectorAll(".tab-btn");
        buttons.forEach(btn => btn.classList.remove("active"));

        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) activeBtn.classList.add("active");

        this.current = tabName;

        // ⭐ REQUIRED: engine refresh logic
        switch (tabName) {
            case "listen":
                ListenEngine.refresh();
                break;

            case "flashcards":
    FlashcardEngine.refresh();
    break;



            case "quiz":
                QuizEngine.refresh();
                break;

            case "build":
                BuildEngine.refresh();
                break;

            case "sentence":
                SentenceEngine.refresh();
                break;

            case "conversation":
                ConversationEngine.refresh();
                break;

            case "review":
                ReviewEngine.refresh();
                break;
        }
    }
};


/* ============================================================
   INITIAL BOOT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* Load saved name */
    const savedName = localStorage.getItem("studentName");
    if (savedName) {
        Global.name = savedName;
        const nameField = document.getElementById("student-name");
        if (nameField) nameField.value = savedName;
    }

    /* Load saved level */
    const savedLevel = localStorage.getItem("skillLevel");
    if (savedLevel) {
        Global.level = savedLevel;
        highlightLevelButton(savedLevel);
    }

    /* Load saved audio rate */
    const savedRate = localStorage.getItem("audioRate");
    if (savedRate) {
        Global.audioRate = parseFloat(savedRate);
        const rateSlider = document.getElementById("rate");
        if (rateSlider) rateSlider.value = savedRate;
    }

    /* Activate dashboard by default */
    Router.show("dashboard");

    /* Initialize engines that require startup */
    ListenEngine.init();
    FlashcardEngine.init();
    QuizEngine.init();
    BuildEngine.init();
    SentenceEngine.init();
    ConversationEngine.init();
    ReviewEngine.init();
    AchievementsEngine.init();
});

/* ============================================================
   SKILL LEVEL BUTTONS
============================================================ */

function highlightLevelButton(level) {
    document.querySelectorAll(".level-buttons .pill").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.level === level) btn.classList.add("active");
    });
}

document.querySelectorAll(".level-buttons .pill").forEach(btn => {
    btn.addEventListener("click", () => {
        const level = btn.dataset.level;
        Global.level = level;
        localStorage.setItem("skillLevel", level);
        highlightLevelButton(level);

        // Re‑initialise engines that depend on CEFR level
        ConversationEngine.init();
        QuizEngine.init();
        BuildEngine.init();
        SentenceEngine.init();
    });
});

/* ============================================================
   AUDIO SPEED
============================================================ */

const rateSlider = document.getElementById("rate");
if (rateSlider) {
    rateSlider.addEventListener("input", () => {
        Global.audioRate = parseFloat(rateSlider.value);
        localStorage.setItem("audioRate", Global.audioRate);
    });
}

/* ============================================================
   SAVE NAME
============================================================ */

const saveNameBtn = document.getElementById("save-name-btn");
if (saveNameBtn) {
    saveNameBtn.addEventListener("click", () => {
        const nameField = document.getElementById("student-name");
        const status = document.getElementById("name-status");

        if (!nameField.value.trim()) {
            status.textContent = "Please enter a name.";
            return;
        }

        Global.name = nameField.value.trim();
        localStorage.setItem("studentName", Global.name);
        status.textContent = "Saved!";
    });
}

/* ============================================================
   RESET BUTTON
============================================================ */

const resetBtn = document.getElementById("resetBtn");
if (resetBtn) {
    resetBtn.addEventListener("click", () => {
        Global.resetAll();
    });
}

/* ============================================================
   SEARCH BOX
============================================================ */

const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const word = document.getElementById("searchInput").value.trim();
        const result = SearchEngine.lookup(word);
        document.getElementById("searchResult").textContent =
            result || "Not found.";
    });
}

/* ============================================================
   REVIEW TILE → REVIEW TAB
============================================================ */

const reviewTile = document.getElementById("review-tile");
if (reviewTile) {
    reviewTile.addEventListener("click", () => {
        Router.show("review");
        ReviewEngine.init();
    });
}

/* ============================================================
   FREE PRACTICE TAB
============================================================ */

const practiceBtn = document.getElementById("practiceBtn");
if (practiceBtn) {
    practiceBtn.addEventListener("click", () => {
        const text = document.getElementById("practiceInput").value.trim();
        const feedback = FreePracticeEngine.evaluate(text);
        document.getElementById("practiceResult").textContent = feedback;
    });
}

/* ============================================================
   LISTEN TAB
============================================================ */

const listenPlay = document.getElementById("listenPlay");
const listenNext = document.getElementById("listenNext");
const listenPrev = document.getElementById("listenPrev");
const listenAuto = document.getElementById("listenAuto");

if (listenPlay) {
    listenPlay.addEventListener("click", () => {
        ListenEngine.play(Global.audioRate);
    });
}

if (listenNext) {
    listenNext.addEventListener("click", () => {
        ListenEngine.next();
    });
}

if (listenPrev) {
    listenPrev.addEventListener("click", () => {
        ListenEngine.prev();
    });
}

if (listenAuto) {
    listenAuto.addEventListener("click", () => {
        ListenEngine.toggleAuto(Global.audioRate);
    });
}

/* ============================================================
   FLASHCARDS TAB
============================================================ */

function wireFlashcardEvents() {
    const cards = document.querySelectorAll(".fc-inner");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("fc-flipped");
        });
    });
}

document.addEventListener("flashcardsRendered", () => {
    wireFlashcardEvents();
});

/* ============================================================
   QUIZ TAB
============================================================ */

document.addEventListener("quizRendered", () => {
    const options = document.querySelectorAll("#quizOptions .pill");
    options.forEach(opt => {
        opt.addEventListener("click", () => {
            const chosen = opt.dataset.answer;
            const feedback = QuizEngine.check(chosen);
            document.getElementById("quizFeedback").textContent = feedback;
        });
    });
});

/* ============================================================
   BUILD TAB
============================================================ */

document.addEventListener("buildRendered", () => {
    const wordButtons = document.querySelectorAll("#buildGrid .pill");
    wordButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            BuildEngine.addWord(btn.dataset.word);
        });
    });
});

const buildCheckBtn = document.getElementById("buildCheckBtn");
if (buildCheckBtn) {
    buildCheckBtn.addEventListener("click", () => {
        const result = BuildEngine.check();
        document.getElementById("buildOutput").textContent = result;
    });
}

const buildNewBtn = document.getElementById("buildNewBtn");
if (buildNewBtn) {
    buildNewBtn.addEventListener("click", () => {
        BuildEngine.init();
    });
}

/* ============================================================
   SENTENCE TAB
============================================================ */

document.addEventListener("sentenceRendered", () => {
    // SentenceEngine already writes directly to #sentence-content
    // No additional UI wiring needed here
});

/* ============================================================
   CONVERSATION TAB
============================================================ */

document.addEventListener("conversationRendered", () => {
    // Word pills already rendered by ConversationEngine
    const pills = document.querySelectorAll("#conversationFeed .pill");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            ConversationEngine.addWord(pill.dataset.word);
        });
    });
});

const conversationSend = document.getElementById("conversationSend");
if (conversationSend) {
    conversationSend.addEventListener("click", () => {
        const input = document.getElementById("conversationInput").value.trim();
        const reply = ConversationEngine.evaluate(input);
        ConversationEngine.appendReply(reply);
        document.getElementById("conversationInput").value = "";
    });
}

/* ============================================================
   REVIEW TAB
============================================================ */

document.addEventListener("reviewRendered", () => {
    // ReviewEngine writes directly to #reviewCard
});

const reviewMastered = document.getElementById("reviewMastered");
if (reviewMastered) {
    reviewMastered.addEventListener("click", () => {
        ReviewEngine.markMastered();
        ReviewEngine.init(); // load next card
    });
}

/* ============================================================
   ACHIEVEMENTS TAB
============================================================ */
function renderAchievementsTab() {
    // placeholder so init doesn't crash
}

const AchievementsEngine = {
    init() {
        // renderAchievementsTab();   // ❌ REMOVE
        renderGrammarTab();          // ✔ safe
        document.dispatchEvent(new Event("achievementsRendered"));
    },

    refresh() {
        // renderAchievementsTab();   // ❌ REMOVE
        renderGrammarTab();          // ✔ safe
        document.dispatchEvent(new Event("achievementsRendered"));
    }
};


/* ============================================================
   TAB BUTTONS → ROUTER
============================================================ */

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        Router.show(tab);

        // Re-render engines when their tab is opened
        if (tab === "listen") ListenEngine.init();
        if (tab === "flashcards") FlashcardEngine.init();
        if (tab === "quiz") QuizEngine.init();
        if (tab === "build") BuildEngine.init();
        if (tab === "sentence") SentenceEngine.init();
        if (tab === "conversation") ConversationEngine.init();
        if (tab === "practice") FreePracticeEngine.init();
        if (tab === "review") ReviewEngine.init();
        if (tab === "achievements") AchievementsEngine.init();
    });
});

/* ============================================================
   CEFR SENTENCE BANKS (for Build tab)
   ============================================================ */

const CEFR_SENTENCES = {
    A1: [
        { english: "I would like water, please.", spanish: "me gustaría agua por favor" },
        { english: "Where is the bathroom?", spanish: "dónde está el baño" },
        { english: "I need help.", spanish: "necesito ayuda" },
        { english: "I live in a small house.", spanish: "vivo en una casa pequeña" },
        { english: "She works in a school.", spanish: "ella trabaja en una escuela" },
        { english: "We want a table for two.", spanish: "queremos una mesa para dos" },
        { english: "The store opens at nine.", spanish: "la tienda abre a las nueve" },
        { english: "I like cold water.", spanish: "me gusta el agua fría" },
        { english: "He has a big car.", spanish: "él tiene un coche grande" },
        { english: "My friend is very nice.", spanish: "mi amigo es muy amable" },
        { english: "I am tired today.", spanish: "estoy cansado hoy" },
        { english: "The food is delicious.", spanish: "la comida es deliciosa" },
        { english: "I want a coffee.", spanish: "quiero un café" },
        { english: "She is my sister.", spanish: "ella es mi hermana" },
        { english: "We are at home.", spanish: "estamos en casa" },
        { english: "The bus is late.", spanish: "el autobús está retrasado" },
        { english: "I have two brothers.", spanish: "tengo dos hermanos" },
        { english: "He needs a doctor.", spanish: "él necesita un médico" },
        { english: "The weather is good.", spanish: "el clima es bueno" },
        { english: "I am learning Spanish.", spanish: "estoy aprendiendo español" },
        { english: "She likes music.", spanish: "a ella le gusta la música" },
        { english: "We are hungry.", spanish: "tenemos hambre" },
        { english: "The hotel is near.", spanish: "el hotel está cerca" },
        { english: "I want to go home.", spanish: "quiero ir a casa" },
        { english: "He is very tall.", spanish: "él es muy alto" },
        { english: "The room is clean.", spanish: "la habitación está limpia" },
        { english: "I need more time.", spanish: "necesito más tiempo" },
        { english: "She has a red bag.", spanish: "ella tiene una bolsa roja" },
        { english: "We like this place.", spanish: "nos gusta este lugar" },
        { english: "The train arrives soon.", spanish: "el tren llega pronto" },
        { english: "I want that book.", spanish: "quiero ese libro" },
        { english: "He is at work.", spanish: "él está en el trabajo" },
        { english: "The coffee is hot.", spanish: "el café está caliente" },
        { english: "I am very happy.", spanish: "estoy muy feliz" },
        { english: "She needs a pen.", spanish: "ella necesita un bolígrafo" },
        { english: "We are ready.", spanish: "estamos listos" },
        { english: "The car is new.", spanish: "el coche es nuevo" },
        { english: "I want to rest.", spanish: "quiero descansar" },
        { english: "He likes sports.", spanish: "a él le gustan los deportes" }
    ],

    A2: [
        { english: "I prefer chicken for dinner.", spanish: "prefiero pollo para la cena" },
        { english: "Can you open the window?", spanish: "puedes abrir la ventana" },
        { english: "We are going to visit my parents.", spanish: "vamos a visitar a mis padres" },
        { english: "She bought fruit at the market.", spanish: "ella compró fruta en el mercado" },
        { english: "I need to finish my homework.", spanish: "necesito terminar mi tarea" },
        { english: "They want to watch a movie tonight.", spanish: "ellos quieren ver una película esta noche" },
        { english: "The bus arrives in ten minutes.", spanish: "el autobús llega en diez minutos" },
        { english: "I usually wake up early.", spanish: "normalmente me despierto temprano" },
        { english: "He is learning Spanish slowly.", spanish: "él está aprendiendo español lentamente" },
        { english: "We have a meeting tomorrow.", spanish: "tenemos una reunión mañana" },
        { english: "I cleaned the kitchen yesterday.", spanish: "limpié la cocina ayer" },
        { english: "She wants to buy new shoes.", spanish: "ella quiere comprar zapatos nuevos" },
        { english: "We are planning a trip.", spanish: "estamos planeando un viaje" },
        { english: "He called me last night.", spanish: "él me llamó anoche" },
        { english: "I will study later.", spanish: "estudiaré más tarde" },
        { english: "They need more information.", spanish: "ellos necesitan más información" },
        { english: "She is cooking dinner now.", spanish: "ella está cocinando la cena ahora" },
        { english: "We arrived early.", spanish: "llegamos temprano" },
        { english: "I want to try something new.", spanish: "quiero probar algo nuevo" },
        { english: "He forgot his keys.", spanish: "él olvidó sus llaves" },
        { english: "I am waiting for my friend.", spanish: "estoy esperando a mi amigo" },
        { english: "She likes to read at night.", spanish: "a ella le gusta leer por la noche" },
        { english: "We need to buy milk.", spanish: "necesitamos comprar leche" },
        { english: "He is driving to work.", spanish: "él está conduciendo al trabajo" },
        { english: "I wrote a message.", spanish: "escribí un mensaje" },
        { english: "They are watching TV.", spanish: "ellos están viendo televisión" },
        { english: "She visited her grandmother.", spanish: "ella visitó a su abuela" },
        { english: "We will eat later.", spanish: "comeremos más tarde" },
        { english: "I want to learn more.", spanish: "quiero aprender más" },
        { english: "He is fixing the car.", spanish: "él está arreglando el coche" },
        { english: "I bought a new phone.", spanish: "compré un teléfono nuevo" },
        { english: "She is talking to her friend.", spanish: "ella está hablando con su amiga" },
        { english: "We need to leave soon.", spanish: "necesitamos irnos pronto" },
        { english: "He likes to travel.", spanish: "a él le gusta viajar" },
        { english: "I am reading a book.", spanish: "estoy leyendo un libro" },
        { english: "They will arrive tomorrow.", spanish: "ellos llegarán mañana" },
        { english: "She is listening to music.", spanish: "ella está escuchando música" },
        { english: "We are eating breakfast.", spanish: "estamos desayunando" },
        { english: "I want to go outside.", spanish: "quiero salir afuera" }
    ],

    B1: [
        { english: "We need to organize the meeting.", spanish: "necesitamos organizar la reunión" },
        { english: "I want to improve my Spanish.", spanish: "quiero mejorar mi español" },
        { english: "She hopes to find a better job.", spanish: "ella espera encontrar un mejor trabajo" },
        { english: "They decided to cancel the trip.", spanish: "ellos decidieron cancelar el viaje" },
        { english: "I think this restaurant is excellent.", spanish: "creo que este restaurante es excelente" },
        { english: "We should talk about the problem.", spanish: "debemos hablar sobre el problema" },
        { english: "He forgot to bring the documents.", spanish: "él olvidó traer los documentos" },
        { english: "I will call you when I arrive.", spanish: "te llamaré cuando llegue" },
        { english: "She wants to travel more this year.", spanish: "ella quiere viajar más este año" },
        { english: "We need to finish the project soon.", spanish: "necesitamos terminar el proyecto pronto" },
        { english: "He explained the situation clearly.", spanish: "él explicó la situación claramente" },
        { english: "I believe we can solve this.", spanish: "creo que podemos resolver esto" },
        { english: "She asked me to help her.", spanish: "ella me pidió que la ayudara" },
        { english: "They plan to move next month.", spanish: "ellos planean mudarse el próximo mes" },
        { english: "We must follow the instructions.", spanish: "debemos seguir las instrucciones" },
        { english: "He wants to change his schedule.", spanish: "él quiere cambiar su horario" },
        { english: "I will study after dinner.", spanish: "estudiaré después de la cena" },
        { english: "She needs to finish her report.", spanish: "ella necesita terminar su informe" },
        { english: "We talked about our goals.", spanish: "hablamos sobre nuestras metas" },
        { english: "He hopes to visit soon.", spanish: "él espera visitar pronto" },
        { english: "I think we should leave now.", spanish: "creo que deberíamos irnos ahora" },
        { english: "She wants to learn new skills.", spanish: "ella quiere aprender nuevas habilidades" },
        { english: "They need to clean the house.", spanish: "ellos necesitan limpiar la casa" },
        { english: "We will continue tomorrow.", spanish: "continuaremos mañana" },
        { english: "He asked for more time.", spanish: "él pidió más tiempo" },
        { english: "I want to understand this better.", spanish: "quiero entender esto mejor" },
        { english: "She explained the rules.", spanish: "ella explicó las reglas" },
        { english: "We need to prepare everything.", spanish: "necesitamos preparar todo" },
        { english: "He wants to join the team.", spanish: "él quiere unirse al equipo" },
        { english: "I will help you later.", spanish: "te ayudaré más tarde" },
        { english: "She hopes to finish early.", spanish: "ella espera terminar temprano" },
        { english: "They want to change the plan.", spanish: "ellos quieren cambiar el plan" },
        { english: "We talked for an hour.", spanish: "hablamos durante una hora" },
        { english: "He needs to buy new clothes.", spanish: "él necesita comprar ropa nueva" },
        { english: "I think this is important.", spanish: "creo que esto es importante" },
        { english: "She wants to visit her family.", spanish: "ella quiere visitar a su familia" },
        { english: "We need to check the details.", spanish: "necesitamos revisar los detalles" },
        { english: "He hopes to get the job.", spanish: "él espera conseguir el trabajo" },
        { english: "I will call you later.", spanish: "te llamaré más tarde" }
    ],

    B2: [
        { english: "They want to analyze the situation.", spanish: "quieren analizar la situación" },
        { english: "We must consider all possibilities.", spanish: "debemos considerar todas las posibilidades" },
        { english: "He suggested improving the communication process.", spanish: "él sugirió mejorar el proceso de comunicación" },
        { english: "Although it was difficult, she completed the task.", spanish: "aunque fue difícil, ella completó la tarea" },
        { english: "We need to evaluate the risks carefully.", spanish: "necesitamos evaluar los riesgos cuidadosamente" },
        { english: "They argued that the plan was not realistic.", spanish: "ellos argumentaron que el plan no era realista" },
        { english: "I believe the results will be positive.", spanish: "creo que los resultados serán positivos" },
        { english: "She wants to expand her professional experience.", spanish: "ella quiere ampliar su experiencia profesional" },
        { english: "We will continue even if there are challenges.", spanish: "continuaremos incluso si hay desafíos" },
        { english: "He explained the concept in a clear way.", spanish: "él explicó el concepto de una manera clara" },
        { english: "Despite the problems, they finished the project.", spanish: "a pesar de los problemas, terminaron el proyecto" },
        { english: "We need to adapt to the new situation.", spanish: "necesitamos adaptarnos a la nueva situación" },
        { english: "She believes the idea is innovative.", spanish: "ella cree que la idea es innovadora" },
        { english: "They want to reduce unnecessary expenses.", spanish: "ellos quieren reducir gastos innecesarios" },
        { english: "He insisted on reviewing the data again.", spanish: "él insistió en revisar los datos otra vez" },
        { english: "We must improve our communication skills.", spanish: "debemos mejorar nuestras habilidades de comunicación" },
        { english: "She explained the problem in detail.", spanish: "ella explicó el problema en detalle" },
        { english: "They hope to achieve better results.", spanish: "ellos esperan lograr mejores resultados" },
        { english: "He wants to explore new opportunities.", spanish: "él quiere explorar nuevas oportunidades" },
        { english: "We need to clarify the instructions.", spanish: "necesitamos aclarar las instrucciones" },
        { english: "Although it seems easy, it is complicated.", spanish: "aunque parece fácil, es complicado" },
        { english: "She argued that the change was necessary.", spanish: "ella argumentó que el cambio era necesario" },
        { english: "They want to strengthen the team.", spanish: "ellos quieren fortalecer el equipo" },
        { english: "He believes the project will succeed.", spanish: "él cree que el proyecto tendrá éxito" },
        { english: "We must analyze the results carefully.", spanish: "debemos analizar los resultados cuidadosamente" },
        { english: "She wants to improve her performance.", spanish: "ella quiere mejorar su rendimiento" },
        { english: "They discussed the issue for hours.", spanish: "ellos discutieron el tema durante horas" },
        { english: "He suggested a different approach.", spanish: "él sugirió un enfoque diferente" },
        { english: "We need to update the system.", spanish: "necesitamos actualizar el sistema" },
        { english: "She believes the plan is effective.", spanish: "ella cree que el plan es efectivo" },
        { english: "They want to increase productivity.", spanish: "ellos quieren aumentar la productividad" },
        { english: "He explained the strategy clearly.", spanish: "él explicó la estrategia claramente" },
        { english: "We must prepare for possible changes.", spanish: "debemos prepararnos para posibles cambios" },
        { english: "She argued that the idea was risky.", spanish: "ella argumentó que la idea era arriesgada" },
        { english: "They hope to expand the business.", spanish: "ellos esperan expandir el negocio" },
        { english: "He wants to improve the workflow.", spanish: "él quiere mejorar el flujo de trabajo" },
        { english: "We need to coordinate our efforts.", spanish: "necesitamos coordinar nuestros esfuerzos" },
        { english: "She believes the team is capable.", spanish: "ella cree que el equipo es capaz" },
        { english: "They want to optimize the process.", spanish: "ellos quieren optimizar el proceso" }
    ]
};

/* ============================================================
   CEFR LEVELS — A1 → B2 Vocabulary (Spanish → English)
   ============================================================ */

const CEFR_LEVELS = {
A1: [
    // Daily Life
    { spanish: "vivir", english: "to live", category: "Daily Life" },
    { spanish: "trabajar", english: "to work", category: "Daily Life" },
    { spanish: "estudiar", english: "to study", category: "Daily Life" },
    { spanish: "leer", english: "to read", category: "Daily Life" },
    { spanish: "libros", english: "books", category: "Daily Life" },
    { spanish: "hora", english: "hour", category: "Daily Life" },
    { spanish: "levantarse", english: "to get up", category: "Daily Life" },
    { spanish: "música", english: "music", category: "Daily Life" },
    { spanish: "televisión", english: "television", category: "Daily Life" },
    { spanish: "limpiar", english: "to clean", category: "Daily Life" },
    { spanish: "cocinar", english: "to cook", category: "Daily Life" },
    { spanish: "abrir", english: "to open", category: "Daily Life" },
    { spanish: "terminar", english: "to finish", category: "Daily Life" },
    { spanish: "escribir", english: "to write", category: "Daily Life" },
    { spanish: "aprender", english: "to learn", category: "Daily Life" },
    { spanish: "ir", english: "to go", category: "Daily Life" },
    { spanish: "hacer", english: "to do", category: "Daily Life" },
    { spanish: "ver", english: "to see", category: "Daily Life" },
    { spanish: "escuchar", english: "to listen", category: "Daily Life" },
    { spanish: "salir", english: "to go out", category: "Daily Life" },
    { spanish: "descansar", english: "to rest", category: "Daily Life" },
    { spanish: "caliente", english: "hot", category: "Daily Life" },
    { spanish: "frío", english: "cold", category: "Daily Life" },
    { spanish: "feliz", english: "happy", category: "Daily Life" },
    { spanish: "nuevo", english: "new", category: "Daily Life" },
    { english: "hello", spanish: "hola", category: "daily-life" },
    { english: "goodbye", spanish: "adiós", category: "daily-life" },
    { english: "thank you", spanish: "gracias", category: "daily-life" },
    { english: "sorry / I feel", spanish: "siento", category: "daily-life" },
    { english: "you are", spanish: "estás", category: "daily-life" },
    { english: "ready", spanish: "listos", category: "daily-life" },
    { english: "awake", spanish: "despierto", category: "daily-life" },
    { english: "time", spanish: "tiempo", category: "daily-life" },
    { english: "problems", spanish: "problemas", category: "daily-life" },
    { english: "change", spanish: "cambio", category: "daily-life" },

    // Family
    { spanish: "familia", english: "family", category: "Family" },
    { spanish: "madre", english: "mother", category: "Family" },
    { spanish: "padre", english: "father", category: "Family" },
    { spanish: "hijo", english: "son", category: "Family" },
    { spanish: "hija", english: "daughter", category: "Family" },
    { spanish: "amigo", english: "friend", category: "Family" },
    { spanish: "amiga", english: "friend (female)", category: "Family" },
    { spanish: "hermana", english: "sister", category: "Family" },
    { spanish: "hermanos", english: "brothers", category: "Family" },
    { spanish: "hermanas", english: "sisters", category: "Family" },
    { spanish: "abuela", english: "grandmother", category: "Family" },
    { spanish: "hambre", english: "hunger", category: "Family" },
    { spanish: "tenemos", english: "we have", category: "Family" },
    { spanish: "tienen", english: "they have", category: "Family" },

    // Food & Drink
    { spanish: "agua", english: "water", category: "Food & Drink" },
    { spanish: "comida", english: "food", category: "Food & Drink" },
    { spanish: "café", english: "coffee", category: "Food & Drink" },
    { spanish: "té", english: "tea", category: "Food & Drink" },
    { spanish: "leche", english: "milk", category: "Food & Drink" },
    { spanish: "pan", english: "bread", category: "Food & Drink" },
    { spanish: "cerveza", english: "beer", category: "Food & Drink" },
    { spanish: "huevo", english: "egg", category: "Food & Drink" },
    { spanish: "fruta", english: "fruit", category: "Food & Drink" },
    { spanish: "manzana", english: "apple", category: "Food & Drink" },
    { spanish: "naranja", english: "orange", category: "Food & Drink" },
    { spanish: "plátano", english: "banana", category: "Food & Drink" },
    { spanish: "pollo", english: "chicken", category: "Food & Drink" },
    { spanish: "pescado", english: "fish", category: "Food & Drink" },
    { spanish: "sopa", english: "soup", category: "Food & Drink" },
    { spanish: "ensalada", english: "salad", category: "Food & Drink" },
    { spanish: "arroz", english: "rice", category: "Food & Drink" },
    { spanish: "frijoles", english: "beans", category: "Food & Drink" },
    { spanish: "queso", english: "cheese", category: "Food & Drink" },
    { spanish: "sal", english: "salt", category: "Food & Drink" },

    // Travel
    { spanish: "autobús", english: "bus", category: "Travel" },
    { spanish: "tren", english: "train", category: "Travel" },
    { spanish: "boleto", english: "ticket", category: "Travel" },
    { spanish: "estación", english: "station", category: "Travel" },
    { spanish: "aeropuerto", english: "airport", category: "Travel" },
    { spanish: "casa", english: "house", category: "Travel" },
    { spanish: "escuela", english: "school", category: "Travel" },
    { spanish: "hotel", english: "hotel", category: "Travel" },
    { spanish: "baño", english: "bathroom", category: "Travel" },
    { spanish: "lugar", english: "place", category: "Travel" },

    // Connectors
    { spanish: "y", english: "and", category: "Connectors" },
    { spanish: "o", english: "or", category: "Connectors" },
    { spanish: "con", english: "with", category: "Connectors" },
    { spanish: "sin", english: "without", category: "Connectors" },
    { spanish: "más", english: "more", category: "Connectors" },
    { spanish: "poco", english: "little", category: "Connectors" },
    { spanish: "solo", english: "only", category: "Connectors" },
    { spanish: "muy", english: "very", category: "Connectors" },
    { spanish: "cerca", english: "near", category: "Connectors" },
    { spanish: "para", english: "for", category: "Connectors" },
    { spanish: "a", english: "to", category: "Connectors" },
    { spanish: "en", english: "in", category: "Connectors" },
    { spanish: "ella", english: "she", category: "Connectors" },
    { spanish: "el", english: "he", category: "Connectors" },
    { spanish: "rapido", english: "fast", category: "Connectors" },
    { english: "what", spanish: "qué", category: "connectors" },
    { english: "who", spanish: "quién", category: "connectors" },
    { english: "when", spanish: "cuándo", category: "connectors" },
    { english: "how", spanish: "cómo", category: "connectors" },
    { english: "which", spanish: "cuál", category: "connectors" },
    { english: "where", spanish: "dónde", category: "connectors" },
    { english: "no / not", spanish: "no", category: "connectors" },
    { english: "there is / there are", spanish: "hay", category: "connectors" },
    { english: "other / another", spanish: "otra", category: "connectors" },
    { english: "despite", spanish: "pesar", category: "connectors" },
    { english: "favor (por favor)", spanish: "favor", category: "connectors" },
    { english: "they", spanish: "ellos", category: "connectors" },
    { english: "his / her / their", spanish: "su", category: "connectors" },
   // VERBS
    { english: "is", spanish: "es", category: "connectors" },
    { english: "likes", spanish: "gusta", category: "connectors" },
    { english: "they like", spanish: "gustan", category: "connectors" },
    { english: "would like", spanish: "gustaría", category: "connectors" },
    { english: "learning", spanish: "aprendiendo", category: "connectors" },
    { english: "fixing", spanish: "arreglando", category: "connectors" },

    // ADJECTIVES
    { english: "good", spanish: "bueno", category: "connectors" },
    { english: "difficult", spanish: "difícil", category: "connectors" },
    { english: "clear", spanish: "clara", category: "connectors" },
    { english: "easy", spanish: "fácil", category: "connectors" },
    { english: "bad", spanish: "malo", category: "connectors" },
    { english: "small", spanish: "pequeño", category: "connectors" },
   

    // Numbers
    { english: "one", spanish: "uno", category: "Numbers" },
    { english: "two", spanish: "dos", category: "Numbers" },
    { english: "three", spanish: "tres", category: "Numbers" },
    { english: "four", spanish: "cuatro", category: "Numbers" },
    { english: "five", spanish: "cinco", category: "Numbers" },
    { english: "six", spanish: "seis", category: "Numbers" },
    { english: "seven", spanish: "siete", category: "Numbers" },
    { english: "eight", spanish: "ocho", category: "Numbers" },
    { english: "nine", spanish: "nueve", category: "Numbers" },
    { english: "ten", spanish: "diez", category: "Numbers" }

],

A2: [
    // Daily Life
    { spanish: "desayuno", english: "breakfast", category: "Daily Life" },
    { spanish: "almuerzo", english: "lunch", category: "DailyLife" },
    { spanish: "cena", english: "dinner", category: "Daily Life" },
    { spanish: "temprano", english: "early", category: "Daily Life" },
    { spanish: "tarde", english: "late", category: "Daily Life" },
    { spanish: "anoche", english: "last night", category: "Daily Life" },
    { spanish: "ahora", english: "now", category: "Daily Life" },
    { spanish: "minutos", english: "minutes", category: "Daily Life" },
    { spanish: "tarea", english: "homework", category: "Daily Life" },
    { spanish: "mensaje", english: "message", category: "Daily Life" },
    { spanish: "información", english: "information", category: "Daily Life" },
    { spanish: "película", english: "movie", category: "Daily Life" },
    { spanish: "ventana", english: "window", category: "Daily Life" },
    { spanish: "cocina", english: "kitchen", category: "Daily Life" },
    { spanish: "zapatos", english: "shoes", category: "Daily Life" },
    { spanish: "viaje", english: "trip", category: "Daily Life" },
    { spanish: "probar", english: "to try", category: "Daily Life" },
    { spanish: "olvidar", english: "to forget", category: "Daily Life" },
    { spanish: "esperar", english: "to wait", category: "Daily Life" },
    { spanish: "conducir", english: "to drive", category: "Daily Life" },
    { spanish: "arreglar", english: "to fix", category: "Daily Life" },
    { spanish: "irse", english: "to leave", category: "Daily Life" },
    { spanish: "llegar", english: "to arrive", category: "Daily Life" },

    // Family
    { spanish: "padres", english: "parents", category: "Family" },
    { spanish: "abuela", english: "grandmother", category: "Family" },
    { spanish: "amiga", english: "friend (female)", category: "Family" },

    // Food & Drink
    { spanish: "desayuno", english: "breakfast", category: "Food & Drink" },
    { spanish: "almuerzo", english: "lunch", category: "Food & Drink" },
    { spanish: "cena", english: "dinner", category: "Food & Drink" },

    // Travel
    { spanish: "avión", english: "plane", category: "Travel" },
    { spanish: "visitar", english: "to visit", category: "Travel" },
    { spanish: "transporte", english: "transport", category: "Travel" },

    // Connectors
    { spanish: "a menudo", english: "often", category: "Connectors" },
    { spanish: "antes", english: "before", category: "Connectors" },
    { spanish: "ya", english: "already", category: "Connectors" },
    { spanish: "todavía", english: "still", category: "Connectors" },
    { spanish: "normalmente", english: "normally", category: "Connectors" },
    { english: "argued", spanish: "argumentó", category: "Connectors" },

    { english: "eleven", spanish: "once", category: "Numbers" },
    { english: "twelve", spanish: "doce", category: "Numbers" },
    { english: "thirteen", spanish: "trece", category: "Numbers" },
    { english: "fourteen", spanish: "catorce", category: "Numbers" },
    { english: "fifteen", spanish: "quince", category: "Numbers" },
    { english: "sixteen", spanish: "dieciséis", category: "Numbers" },
    { english: "seventeen", spanish: "diecisiete", category: "Numbers" },
    { english: "eighteen", spanish: "dieciocho", category: "Numbers" },
    { english: "nineteen", spanish: "diecinueve", category: "Numbers" },
    { english: "twenty", spanish: "veinte", category: "Numbers" }

],

B1: [
    // Daily Life — auxiliary verbs
    { spanish: "he", english: "I have (auxiliary)", category: "Daily Life" },
    { spanish: "has", english: "you have (auxiliary)", category: "Daily Life" },
    { spanish: "ha", english: "he/she has (auxiliary)", category: "Daily Life" },
    { spanish: "hemos", english: "we have (auxiliary)", category: "Daily Life" },
    { spanish: "habéis", english: "you (plural) have (auxiliary)", category: "Daily Life" },
    { spanish: "han", english: "they have (auxiliary)", category: "Daily Life" },

    // Daily Life — participles
    { spanish: "estado", english: "been", category: "Daily Life" },
    { spanish: "aprendido", english: "learned", category: "Daily Life" },
    { spanish: "trabajando", english: "working", category: "Daily Life" },
    { spanish: "estudiando", english: "studying", category: "Daily Life" },
    { spanish: "leyendo", english: "reading", category: "Daily Life" },
    { spanish: "viviendo", english: "living", category: "Daily Life" },
    { spanish: "diarias", english: "daily", category: "Daily Life" },

    // Daily Life — verbs & nouns
    { spanish: "comunicación", english: "communication", category: "Daily Life" },
    { spanish: "conversaciones", english: "conversations", category: "Daily Life" },
    { spanish: "mejorar", english: "to improve", category: "Daily Life" },
    { spanish: "habilidades", english: "skills", category: "Daily Life" },
    { spanish: "revisar", english: "to review", category: "Daily Life" },
    { spanish: "continuar", english: "to continue", category: "Daily Life" },
    { spanish: "cambiar", english: "to change", category: "Daily Life" },
    { spanish: "seguir", english: "to follow", category: "Daily Life" },
    { spanish: "preparar", english: "to prepare", category: "Daily Life" },
    { spanish: "conseguir", english: "to get", category: "Daily Life" },
    { spanish: "entender", english: "to understand", category: "Daily Life" },

    // Family
    { spanish: "experiencias", english: "experiences", category: "Family" },
    { spanish: "pasadas", english: "past", category: "Family" },

    // Food & Drink
    { spanish: "restaurante", english: "restaurant", category: "Food & Drink" },
    { spanish: "menú", english: "menu", category: "Food & Drink" },
    { spanish: "cuenta", english: "bill", category: "Food & Drink" },

    // Travel
    { spanish: "encontrar", english: "to find", category: "Travel" },
    { spanish: "cancelar", english: "to cancel", category: "Travel" },
    { spanish: "traer", english: "to bring", category: "Travel" },
    { spanish: "planear", english: "to plan", category: "Travel" },
    { spanish: "mudarse", english: "to move (house)", category: "Travel" },
    { spanish: "unirse", english: "to join", category: "Travel" },

    // Connectors
    { spanish: "mientras", english: "while", category: "Connectors" },
    { spanish: "sin embargo", english: "however", category: "Connectors" },
    { spanish: "sobre", english: "about", category: "Connectors" },
    { spanish: "cuando", english: "when", category: "Connectors" },
    { spanish: "después", english: "after", category: "Connectors" },
    { spanish: "durante", english: "during", category: "Connectors" },

    // Numbers
    { spanish: "mes", english: "month", category: "Numbers" },
    { spanish: "años", english: "years", category: "Numbers" }
],

B2: [
    // Daily Life — abstract nouns & professional vocabulary
    { spanish: "proceso", english: "process", category: "Daily Life" },
    { spanish: "tarea", english: "task", category: "Daily Life" },
    { spanish: "resultados", english: "results", category: "Daily Life" },
    { spanish: "rendimiento", english: "performance", category: "Daily Life" },
    { spanish: "estrategia", english: "strategy", category: "Daily Life" },
    { spanish: "sistema", english: "system", category: "Daily Life" },
    { spanish: "enfoque", english: "approach", category: "Daily Life" },
    { spanish: "concepto", english: "concept", category: "Daily Life" },
    { spanish: "riesgo", english: "risk", category: "Daily Life" },
    { spanish: "posibilidad", english: "possibility", category: "Daily Life" },
    { spanish: "situación", english: "situation", category: "Daily Life" },

    // Daily Life — advanced verbs
    { spanish: "optimizar", english: "to optimize", category: "Daily Life" },
    { spanish: "coordinar", english: "to coordinate", category: "Daily Life" },
    { spanish: "aumentar", english: "to increase", category: "Daily Life" },
    { spanish: "actualizar", english: "to update", category: "Daily Life" },
    { spanish: "analizar", english: "to analyze", category: "Daily Life" },
    { spanish: "evaluar", english: "to evaluate", category: "Daily Life" },
    { spanish: "discutir", english: "to discuss", category: "Daily Life" },
    { spanish: "aclarar", english: "to clarify", category: "Daily Life" },
    { spanish: "fortalecer", english: "to strengthen", category: "Daily Life" },
    { spanish: "adaptarse", english: "to adapt", category: "Daily Life" },
    { spanish: "lograr", english: "to achieve", category: "Daily Life" },

    // Daily Life — B2 adjectives
    { spanish: "complicado", english: "complicated", category: "Daily Life" },
    { spanish: "necesario", english: "necessary", category: "Daily Life" },
    { spanish: "posible", english: "possible", category: "Daily Life" },
    { spanish: "efectivo", english: "effective", category: "Daily Life" },
    { spanish: "realista", english: "realistic", category: "Daily Life" },
    { spanish: "innovadora", english: "innovative", category: "Daily Life" },
    { spanish: "profesional", english: "professional", category: "Daily Life" },
    { spanish: "positivo", english: "positive", category: "Daily Life" },

    // Daily Life — participles used in B2 sentences
    { spanish: "analizado", english: "analyzed", category: "Daily Life" },
    { spanish: "evaluado", english: "evaluated", category: "Daily Life" },
    { spanish: "argumentado", english: "argued", category: "Daily Life" },
    { spanish: "ampliado", english: "expanded", category: "Daily Life" },
    { spanish: "adaptado", english: "adapted", category: "Daily Life" },
    { spanish: "reducido", english: "reduced", category: "Daily Life" },
    { spanish: "insistido", english: "insisted", category: "Daily Life" },
    { spanish: "explorado", english: "explored", category: "Daily Life" },
    { spanish: "aclarado", english: "clarified", category: "Daily Life" },
    { spanish: "fortalecido", english: "strengthened", category: "Daily Life" },
    { spanish: "discutido", english: "discussed", category: "Daily Life" },
    { spanish: "actualizado", english: "updated", category: "Daily Life" },
    { spanish: "optimizado", english: "optimized", category: "Daily Life" },

    // Family — abstract B2 concepts
    { spanish: "sociedad", english: "society", category: "Family" },
    { spanish: "cultura", english: "culture", category: "Family" },
    { spanish: "motivación", english: "motivation", category: "Family" },
    { spanish: "desafíos", english: "challenges", category: "Family" },
    { spanish: "expectativas", english: "expectations", category: "Family" },

    // Travel — B2 abstract travel concepts
    { spanish: "remoto", english: "remote", category: "Travel" },
    { spanish: "futuro", english: "future", category: "Travel" },
    { spanish: "largo plazo", english: "long term", category: "Travel" },

    // Connectors — B2 logical connectors
    { spanish: "además", english: "in addition", category: "Connectors" },
    { spanish: "por lo tanto", english: "therefore", category: "Connectors" },
    { spanish: "a pesar de", english: "despite", category: "Connectors" },
    { spanish: "aunque", english: "although", category: "Connectors" },
    { spanish: "incluso", english: "even", category: "Connectors" },
    { spanish: "otra vez", english: "again", category: "Connectors" },
    { spanish: "cuidadosamente", english: "carefully", category: "Connectors" },

    // Numbers — B2 has no new number vocabulary
]      // ✔ closes B2 array
};     // ✔ closes CEFR_LEVELS object


/* ============================================================
   LISTEN VOCAB — A1 → B2 (Category → Word List)
   ============================================================ */
const LISTEN_VOCAB = {
    A1: {
        "Daily Life": [
            "vivir","trabajar","estudiar","leer","libros","hora",
            "levantarse","música","televisión","limpiar","cocinar",
            "abrir","terminar","escribir","aprender","ir","hacer",
            "ver","escuchar","salir","descansar","caliente","frío",
            "feliz","nuevo", "hola",
    "adiós",
    "gracias",
    "siento",
    "estás",
    "listos",
    "despierto",
    "tiempo",
    "problemas",
    "cambio"
        ],
        "Family": [
            "familia","madre","padre","hijo","hija","amigo","amiga",
            "hermana","hermanos","hermanas","abuela","hambre",
            "tenemos","tienen"
        ],
        "Food & Drink": [
            "agua","comida","café","té","leche","pan","cerveza",
            "huevo","fruta","manzana","naranja","plátano","pollo",
            "pescado","sopa","ensalada","arroz","frijoles","queso","sal"
        ],
        "Travel": [
            "autobús","tren","boleto","estación","aeropuerto",
            "casa","escuela","hotel","baño","lugar"
        ],
        "Connectors": [
            "y","o","con","sin","más","poco","solo","muy",
            "cerca","para","a","en",  "qué",
    "quién",
    "cuándo",
    "cómo",
    "cuál",
    "dónde",
    "no",
    "hay",
    "otra",
    "pesar",
    "favor",  "es",
    "gusta",
    "gustan",
    "gustaría",
    "aprendiendo",
    "arreglando",  "bueno",
    "difícil",
    "clara",
    "fácil",
    "malo",
    "pequeño", "ellos",
    "su"
        ],
        
       "Numbers": [
    "uno",   "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho",
    "nueve", "diez"
]

    },

    A2: {
        "Daily Life": [
            "desayuno","almuerzo","cena","temprano","tarde","anoche",
            "ahora","minutos","tarea","mensaje","información",
            "película","ventana","cocina","zapatos","viaje","probar",
            "olvidar","esperar","conducir","arreglar","irse","llegar"
        ],
        "Family": [
            "padres","abuela","amiga"
        ],
        "Food & Drink": [
            "desayuno","almuerzo","cena"
        ],
        "Travel": [
            "avión","visitar","transporte"
        ],
        "Connectors": [
            "a menudo","antes","ya","todavía","normalmente", "argumentó"
        ],
        "Numbers": [
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
    "veinte"
]

    },

    B1: {
        "Daily Life": [
            "he","has","ha","hemos","habéis","han",
            "estado","aprendido","trabajando","estudiando",
            "leyendo","viviendo","diarias",
            "comunicación","conversaciones","mejorar",
            "habilidades","revisar","continuar","cambiar",
            "seguir","preparar","conseguir","entender"
        ],
        "Family": [
            "experiencias","pasadas"
        ],
        "Food & Drink": [
            "restaurante","menú","cuenta"
        ],
        "Travel": [
            "encontrar","cancelar","traer","planear",
            "mudarse","unirse"
        ],
        "Connectors": [
            "mientras","sin embargo","sobre","cuando",
            "después","durante"
        ],
        "Numbers": [
            "mes","años"
        ]
    },

    B2: {
        "Daily Life": [
            "proceso","tarea","resultados","rendimiento",
            "estrategia","sistema","enfoque","concepto",
            "riesgo","posibilidad","situación",
            "optimizar","coordinar","aumentar","actualizar",
            "analizar","evaluar","discutir","aclarar",
            "fortalecer","adaptarse","lograr",
            "complicado","necesario","posible","efectivo",
            "realista","innovadora","profesional","positivo",
            "analizado","evaluado","argumentado","ampliado",
            "adaptado","reducido","insistido","explorado",
            "aclarado","fortalecido","discutido","actualizado",
            "optimizado"
        ],
        "Family": [
            "sociedad","cultura","motivación",
            "desafíos","expectativas"
        ],
        "Food & Drink": [],
        "Travel": [
            "remoto","futuro","largo plazo"
        ],
        "Connectors": [
            "además","por lo tanto","a pesar de",
            "aunque","incluso","otra vez","cuidadosamente"
        ],
        "Numbers": []
    }
};

/* ============================================================
   WORD-BY-WORD DICTIONARY — CEFR A1 → B2 (Categorized)
   ============================================================ */

const WORD_DICT = {

    /* ============================
       A1 — Connectors
       ============================ */


"y": "and",
"o": "or",
"con": "with",
"sin": "without",
"más": "more",
"poco": "little",
"solo": "only / alone",
"muy": "very",
"cerca": "near",
"para": "for",
"a": "to",
"en": "in",
"por": "for/by",
"de": "of/from",
"al": "to the",
"del": "of the",
"pero": "but",
"porque": "because",
"también": "also",
"entonces": "then",
"qué": "what",
"quién": "who",
"cuándo": "when",
"cómo": "how",
"cuál": "which",
"dónde": "where",
"no": "no / not",
"hay": "there is / there are",
"otra": "other / another",
"pesar": "despite",
"favor": "favor (por favor)",

    /* ============================
       A1 — Numbers
       ============================ */

"uno": "one",
"dos": "two",
"diez": "ten",
"nueve": "nine",


 /* ============================
       A1 — Articles
   ============================ */

"el": "the",
"la": "the",
"los": "the",
"las": "the",
"un": "a",
"una": "a",


/* ============================
       A1 — Pronouns
   ============================ */

"me": "me",
"te": "you",
"le": "to him/her",
"nos": "us",
"les": "to them",
"lo": "it (masc.)",
"la": "it (fem.)",
"los": "them (masc.)",
"las": "them (fem.)",
"que": "that/which",
"él": "he",
"mi": "my",
"mis": "my (plural)",
"sus": "his/her/their",
"tú": "you (informal)",
"yo": "I",


/* ============================
       A1 — Daily Life
   ============================ */

"vivir": "to live",
"trabajar": "to work",
"estudiar": "to study",
"leer": "to read",
"libros": "books",
"hora": "hour",
"levantarse": "to get up",
"música": "music",
"televisión": "television",
"limpiar": "to clean",
"cocinar": "to cook",
"abrir": "to open",
"terminar": "to finish",
"escribir": "to write",
"aprender": "to learn",
"ir": "to go",
"hacer": "to do",
"ver": "to see",
"escuchar": "to listen",
"salir": "to go out",
"descansar": "to rest",
"caliente": "hot",
"frío": "cold",
"feliz": "happy",
"nuevo": "new",
"nueva": "new (fem.)",
"nuevos": "new (plural)",
"nuevas": "new (fem. plural)",
"necesito": "I need",
"necesita": "he/she needs",
"necesitan": "they need",
"quiero": "I want",
"quiere": "he/she wants",
"queremos": "we want",
"quieren": "they want",
"vivo": "I live",
"trabaja": "he/she works",
"estoy": "I am",
"está": "he/she is",
"están": "they are",
"somos": "we are",
"soy": "I am",
"eres": "you are",
"son": "they are",
"tengo": "I have",
"tiene": "he/she has",
"estamos": "we are",
"ayuda": "help",
"cansado": "tired",
"alto": "tall",
"hola": "hello",
"adiós": "goodbye",
"gracias": "thank you",
"siento": "sorry / I feel",
"estás": "you are",
"listos": "ready",
"despierto": "awake",
"tiempo": "time",
"problemas": "problems",
"cambio": "change",
"es": "is",
"gusta": "likes",
"gustan": "they like",
"gustaría": "would like",
"aprendiendo": "learning",
"arreglando": "fixing",
"bueno": "good",
"difícil": "difficult",
"clara": "clear",
"fácil": "easy",
"malo": "bad",
"pequeño": "small",
"ellos": "they",
"su": "his / her / their",


/* ============================
       A1 — Family
   ============================ */

"familia": "family",
"madre": "mother",
"padre": "father",
"hijo": "son",
"hija": "daughter",
"amigo": "friend",
"amiga": "friend (female)",
"hermana": "sister",
"hermanos": "brothers",
"hermanas": "sisters",
"abuela": "grandmother",
"hambre": "hunger",
"tenemos": "we have",
"tienen": "they have",
"ellas": "they (fem.)",
"nosotros": "we",
"ustedes": "you all",


/* ============================
       A1 — Food
   ============================ */

"agua": "water",
"comida": "food",
"café": "coffee",
"té": "tea",
"leche": "milk",
"pan": "bread",
"cerveza": "beer",
"huevo": "egg",
"fruta": "fruit",
"manzana": "apple",
"naranja": "orange",
"plátano": "banana",
"pollo": "chicken",
"pescado": "fish",
"sopa": "soup",
"ensalada": "salad",
"arroz": "rice",
"frijoles": "beans",
"queso": "cheese",
"sal": "salt",

/* ============================
       A1 — Travel
   ============================ */

"autobús": "bus",
"tren": "train",
"boleto": "ticket",
"estación": "station",
"aeropuerto": "airport",
"casa": "house",
"escuela": "school",
"hotel": "hotel",
"baño": "bathroom",
"lugar": "place",
"llega": "arrives",
"llegamos": "we arrived",


/* ============================
       A1 — Extra from CEFR_SENTENCES
   ============================ */

"tienda": "store",
"abre": "opens",
"pequeña": "small (fem.)",
"fría": "cold (fem.)",
"grande": "big",
"amable": "kind",
"deliciosa": "delicious (fem.)",
"limpia": "clean (fem.)",
"roja": "red (fem.)",
"retrasado": "delayed",
"coche": "car",
"bolsa": "bag",
"clima": "weather",
"habitación": "room",
"médico": "doctor",
"deportes": "sports",
"hoy": "today",
"mesa": "table",
"libro": "book",
"bolígrafo": "pen",
"calle": "street",
"ciudad": "city",
"noche": "night",
"algo": "something",
"vez": "time / occurrence",



/* ============================
       A2 — Daily Life
   ============================ */

"desayuno": "breakfast",
"almuerzo": "lunch",
"cena": "dinner",
"temprano": "early",
"tarde": "late",
"anoche": "last night",
"ahora": "now",
"minutos": "minutes",
"tarea": "homework",
"mensaje": "message",
"información": "information",
"película": "movie",
"ventana": "window",
"cocina": "kitchen",
"zapatos": "shoes",
"viaje": "trip",
"probar": "to try",
"olvidar": "to forget",
"esperar": "to wait",
"conducir": "to drive",
"arreglar": "to fix",
"irse": "to leave",
"llegar": "to arrive",
"llegamos": "we arrived",
"llegarán": "they will arrive",
"comeremos": "we will eat",
"irnos": "to leave",
"escuchando": "listening",
"planeando": "planning",
"cocinando": "cooking",
"conduciendo": "driving",
"necesitamos": "we need",
"necesitan": "they need",
"compré": "I bought",
"limpié": "I cleaned",
"escribí": "I wrote",

 
/* ============================
       A2 — Extra from Sentences
   ============================ */

"mercado": "market",
"reunión": "meeting",
"llaves": "keys",
"teléfono": "phone",
"afuera": "outside",
"noche": "night",
"algo": "something",
"vez": "time / occurrence",
"sus": "their",
"mis": "my (plural)",
"esta": "this (fem.)",
"ese": "that",
"este": "this",
"próximo": "next",
"horario": "schedule",

/* ============================
       A2 — Verbs from Sentences
   ============================ */

"compró": "bought",
"comprar": "to buy",
"visitó": "visited",
"estudiaré": "I will study",
"olvidó": "forgot",
"esperando": "waiting",
"viendo": "watching",
"hablando": "talking",
"desayunando": "eating breakfast",
"quiere": "he/she wants",
"quieren": "they want",
"prefiero": "I prefer",
"puedes": "you can",
"vamos": "we go / let's go",
"planeando": "planning",
"llamó": "he/she called",
"trabaja": "he/she works",
"está": "he/she is",
"están": "they are",
"creo": "I believe",
"debemos": "we must",
"podemos": "we can",
"hablamos": "we speak",


/* ============================
       A2 — Connectors
   ============================ */

"a menudo": "often",
"antes": "before",
"ya": "already",
"todavía": "still",
"normalmente": "normally",
"pero": "but",
"porque": "because",
"también": "also",
"entonces": "then",
"si": "if",
"argumentó": "argued",


/* ============================
       A2 — Multi-word Phrases
   ============================ */

"por favor": "please",
"más tarde": "later",
"esta noche": "tonight",
"a las nueve": "at nine",
"otra vez": "again",
"en detalle": "in detail",



/* ============================
       B1 — Verbs
   ============================ */

"organizar": "to organize",
"mejorar": "to improve",
"espera": "hopes",
"encontrar": "to find",
"decidieron": "decided",
"cancelar": "to cancel",
"hablar": "to talk",
"traer": "to bring",
"llamaré": "I will call",
"llegue": "I arrive (subj.)",
"viajar": "to travel",
"terminar": "to finish",
"explicó": "explained",
"resolver": "to solve",
"pidió": "asked",
"ayudara": "help (subj.)",
"planean": "they plan",
"mudarse": "to move",
"seguir": "to follow",
"deberíamos": "we should",
"continuaremos": "we will continue",
"conseguir": "to get",
"ayudaré": "I will help",
"creo": "I believe",
"debemos": "we must",
"podemos": "we can",
"hablamos": "we speak",
"parece": "it seems",
"cree": "he/she believes",
"esperan": "they wait",
"discutieron": "they discussed",
"completó": "completed",
"fue": "was",
"era": "was",


/* ============================
       B1 — Nouns
   ============================ */

"español": "Spanish",
"trabajo": "job",
"problema": "problem",
"documentos": "documents",
"año": "year",
"proyecto": "project",
"situación": "situation",
"reglas": "rules",
"informe": "report",
"metas": "goals",
"plan": "plan",
"ropa": "clothes",
"detalles": "details",
"problemas": "problems",
"detalle": "detail",
"horas": "hours",
"esfuerzos": "efforts",
"éxito": "success",
"noche": "night",
"vez": "time / occurrence",


/* ============================
       B1 — Adverbs
   ============================ */

"claramente": "clearly",
"pronto": "soon",
"mañana": "tomorrow",
"ahora": "now",
"lentamente": "slowly",
"ayer": "yesterday",
"rápido": "fast",
"lento": "slow",
"siempre": "always",
"nunca": "never",


/* ============================
       B1 — Determiners
   ============================ */

"nuestras": "our (fem. plural)",
"todo": "everything",
"todas": "all (fem.)",
"este": "this",
"ese": "that",
"esto": "this (neutral)",


/* ============================
       B1 — Extra B1 Words
   ============================ */

"mejor": "better",
"excelente": "excellent",
"importante": "important",
"diferente": "different",
"posibles": "possible",
"nuestros": "our",
"próximo": "next",
"horario": "schedule",



/* ============================
       B2 — Verbs
   ============================ */

"analizar": "to analyze",
"considerar": "to consider",
"sugirió": "suggested",
"completar": "to complete",
"evaluar": "to evaluate",
"argumentaron": "argued",
"ampliar": "to expand",
"continuar": "to continue",
"terminaron": "they finished",
"adaptarnos": "to adapt",
"reducir": "to reduce",
"insistió": "insisted",
"lograr": "to achieve",
"explorar": "to explore",
"aclarar": "to clarify",
"fortalecer": "to strengthen",
"actualizar": "to update",
"aumentar": "to increase",
"preparar": "to prepare",
"expandir": "to expand",
"coordinar": "to coordinate",
"optimizar": "to optimize",
"tendrá": "he/she will have",
"serán": "they will be",
"prepararnos": "to prepare ourselves",


/* ============================
       B2 — Nouns
   ============================ */

"posibilidades": "possibilities",
"comunicación": "communication",
"proceso": "process",
"tarea": "task",
"riesgos": "risks",
"problemas": "problems",
"experiencia": "experience",
"desafíos": "challenges",
"concepto": "concept",
"manera": "way",
"instrucciones": "instructions",
"idea": "idea",
"gastos": "expenses",
"datos": "data",
"habilidades": "skills",
"rendimiento": "performance",
"tema": "topic",
"enfoque": "approach",
"sistema": "system",
"cambios": "changes",
"negocio": "business",
"flujo": "flow",
"equipo": "team",
"oportunidades": "opportunities",
"productividad": "productivity",
"estrategia": "strategy",
"esfuerzos": "efforts",
"horas": "hours",
"detalle": "detail",
"mejores": "better / best",
"posibles": "possible",
"próximo": "next",
"horario": "schedule",
"éxito": "success",


/* ============================
       B2 — Adjectives
   ============================ */

"difícil": "difficult",
"realista": "realistic",
"profesional": "professional",
"innovadora": "innovative",
"innecesarios": "unnecessary",
"posible": "possible",
"arriesgada": "risky",
"capaz": "capable",
"efectivo": "effective",
"positivo": "positive",
"complicado": "complicated",
"importante": "important",
"diferente": "different",
"mejor": "better",
"excelente": "excellent",
"todas": "all (fem.)",
"nuestros": "our",
"positivos": "positive",


/* ============================
       B2 — Adverbs / Connectors
   ============================ */

"cuidadosamente": "carefully",
"incluso": "even",
"otra vez": "again",
"en detalle": "in detail",
"lentamente": "slowly",
"ayer": "yesterday",
"rápido": "fast",
"lento": "slow",
"siempre": "always",
"nunca": "never",
"porque": "because",
"pero": "but",
"también": "also",
"entonces": "then"
}


/* ============================================================
   AUTO‑EXPAND DICTIONARY FROM CEFR LEVELS
   ============================================================ */

function autoExpandDictionary() {
    const allWords = Object.values(CEFR_LEVELS).flat();

    allWords.forEach(item => {
        const key = item.spanish.toLowerCase().trim();
        const value = item.english.trim();
        WORD_DICT[key] = value;   // real translation
    });
}

autoExpandDictionary();

  
/* ============================================================
   MULTI-WORD PHRASES (CEFR-aligned)
   ============================================================ */
const CEFR_PHRASES = {
    // A1
    "cómo estás": "how are you",
    "dónde vives": "where do you live",
    "qué hora es": "what time is it",
    "te gusta el café": "you like coffee",
    "me gusta la música": "I like music",
    "vivo en la ciudad": "I live in the city",
    "trabajo en un hotel": "I work in a hotel",
    "quiero comer": "I want to eat",
    "quiero beber": "I want to drink",
    "dónde está el baño": "where is the bathroom",
    "ella corre rápido": "she runs fast",
    "ella es rápida": "she is fast",
    "ella va rápido": "she goes fast",

    // A2
    "qué hiciste ayer": "what did you do yesterday",
    "fuiste al supermercado": "did you go to the supermarket",
    "viajas a menudo": "you travel often",
    "qué compraste": "what did you buy",
    "qué estás haciendo": "what are you doing",
    "sueles comer temprano": "you usually eat early",
    "necesito ayuda": "I need help",
    "quiero hacer una reserva": "I want to make a reservation",
    "dónde está la estación": "where is the station",

    // B1
    "he estado aprendiendo español": "I have been learning Spanish",
    "disfruto viajar": "I enjoy traveling",
    "quiero mejorar mis habilidades": "I want to improve my skills",
    "qué piensas de la ciudad": "what do you think of the city",
    "cómo mantienes una vida saludable": "how do you maintain a healthy life",
    "qué aprendiste recientemente": "what did you learn recently",
    "cuáles son tus metas": "what are your goals",
    "qué experiencias pasadas tienes": "what past experiences do you have",

    // B2
    "cómo manejas situaciones estresantes": "how do you handle stressful situations",
    "cuál es tu opinión sobre la tecnología": "what is your opinion on technology",
    "cómo ha cambiado tu vida": "how has your life changed",
    "qué desafíos enfrentas": "what challenges do you face",
    "qué esperas lograr": "what do you hope to achieve",
    "qué piensas del futuro": "what do you think about the future",
    "cómo ves la sociedad actual": "how do you see modern society",
    "cuál es tu perspectiva": "what is your perspective"
};

/* ============================================================
   TRANSLATION ENGINE — CEFR Phrases + Word Dictionary
   ============================================================ */
function translateToEnglish(spanishText) {
    const normalized = spanishText.toLowerCase().trim();

    // 1. Phrase detection
    if (CEFR_PHRASES[normalized]) {
        return CEFR_PHRASES[normalized];
    }

    // 2. Word-by-word fallback
    return normalized
        .split(/\s+/)
        .map(w => WORD_DICT[w] || `[${w}]`)
        .join(" ");
}

/* ============================================================
   CLEAN MISSING WORD VALIDATOR — NO AUTO-TRANSLATION
   ============================================================ */

function validateMissingWords() {
    const missing = new Set();

    function scan(sentence) {
        sentence.toLowerCase()
            .split(/\s+/)
            .forEach(tok => {
                if (!WORD_DICT[tok]) missing.add(tok);
            });
    }

    // 1. CEFR sentences
    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scan(item.spanish));
    });

    // 2. Build disruptors
    [
        "rápido","lento","siempre","nunca","ayer","mañana",
        "porque","pero","muy","también","solo","entonces"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 3. Grammar helpers
    [
        "yo","tú","él","ella","ellos","ellas","nosotros","ustedes",
        "soy","eres","es","somos","son",
        "estoy","estás","está","estamos","están"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 4. Conversation fillers
    [
        "hola","adiós","gracias","por","favor","lo","siento",
        "qué","quién","dónde","cuándo","cómo","cuál",
        "porque","pero","también","entonces"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 5. Quiz distractors
    [
        "bueno","malo","grande","pequeño","fácil","difícil",
        "coche","calle","ciudad"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    console.group("=== CLEAN MISSING WORD REPORT ===");

    if (missing.size === 0) {
        console.log("✔ No missing words! Dictionary is complete.");
    } else {
        console.log("❌ Missing words (" + missing.size + "):");
        missing.forEach(w => console.log(" - " + w));
    }

    console.groupEnd();
}

/* ============================================================
   SUPER VALIDATOR — AUTO-TRANSLATE + AUTO-CATEGORIZE + AUTO-FIX
   ============================================================ */

function validateAndEnhanceDictionary() {

    const missing = new Set();
    const added = [];

    // === CATEGORY DETECTORS ===
    const isArticle = w => ["el","la","los","las","un","una"].includes(w);
    const isPronoun = w => ["me","te","le","nos","les","lo","la","los","las"].includes(w);
    const isPreposition = w => ["a","de","por","para","con","sin","al","del","en"].includes(w);
    const isConnector = w => ["y","o","pero","porque","también","entonces"].includes(w);
    const isAdverb = w => ["hoy","ayer","mañana","ahora","pronto","temprano","tarde","claramente"].includes(w);
    const isMultiWord = w => w.includes(" ");

    // === SMART TRANSLATION RULES ===
    function inferTranslation(word) {
        if (isArticle(word)) return "the";
        if (isPronoun(word)) return "it / him / her / them";
        if (isPreposition(word)) return "to / from / for / by / with";
        if (isConnector(word)) return "and / or / but / because / also / then";
        if (isAdverb(word)) return "time-related adverb";

        if (isMultiWord(word)) return "multi-word phrase";

        if (word.endsWith("ar")) return "to " + word.slice(0, -2);
        if (word.endsWith("er")) return "to " + word.slice(0, -2);
        if (word.endsWith("ir")) return "to " + word.slice(0, -2);

        if (word.endsWith("ó")) return word + " (past tense)";
        if (word.endsWith("aron")) return word + " (they past tense)";
        if (word.endsWith("ieron")) return word + " (they past tense)";
        if (word.endsWith("aba")) return word + " (imperfect)";
        if (word.endsWith("ía")) return word + " (imperfect)";

        if (word.match(/(o|a|os|as)$/)) return word + " (adjective)";

        return word + " (unclassified)";
    }

    // === TOKEN SCANNER ===
    function scanSentence(sentence) {
        sentence.toLowerCase()
            .split(/\s+/)
            .forEach(tok => {
                if (!WORD_DICT[tok]) missing.add(tok);
            });
    }

    // === 1. Scan CEFR sentences ===
    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scanSentence(item.spanish));
    });

    // === 2. Scan disruptors ===
    const BUILD_DISRUPTORS = [
        "rápido","lento","siempre","nunca","ayer","mañana",
        "porque","pero","muy","también","solo","entonces"
    ];
    BUILD_DISRUPTORS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 3. Scan grammar helpers ===
    const SENTENCE_GRAMMAR = [
        "yo","tú","él","ella","ellos","ellas","nosotros","ustedes",
        "soy","eres","es","somos","son",
        "estoy","estás","está","estamos","están"
    ];
    SENTENCE_GRAMMAR.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 4. Scan conversation fillers ===
    const CONVERSATION_FILLERS = [
        "hola","adiós","gracias","por","favor","lo","siento",
        "qué","quién","dónde","cuándo","cómo","cuál",
        "porque","pero","también","entonces"
    ];
    CONVERSATION_FILLERS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 5. Scan quiz distractors ===
    const QUIZ_DISTRACTORS = [
        "bueno","malo","grande","pequeño","fácil","difícil",
        "coche","calle","ciudad"
    ];
    QUIZ_DISTRACTORS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 6. Auto-add missing words with inferred translations ===
    missing.forEach(w => {
        if (!WORD_DICT[w]) {
            WORD_DICT[w] = inferTranslation(w);
            added.push({ word: w, translation: WORD_DICT[w] });
        }
    });

    // === 7. Diagnostic report ===
    console.group("=== SUPER VALIDATOR REPORT ===");

    console.log("Missing words found:", missing.size);
    console.log("Auto-added:", added.length);

    if (added.length > 0) {
        console.log("=== Added Entries ===");
        added.forEach(entry => {
            console.log(`+ ${entry.word} → ${entry.translation}`);
        });
    }

    console.log("New dictionary size:", Object.keys(WORD_DICT).length);

    console.groupEnd();
}


/* ============================================================
   GRAMMAR ERROR EXPLAINER
   ============================================================ */
function explainGrammarError(user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    // Missing pronoun "te"
    if (c.includes("te gusta") && !u.includes("te") && u.includes("gusta")) {
        return "You forgot the pronoun “te”. Spanish requires “Te gusta…” to mean “You like…”.";
    }

    // Missing article
    if ((c.includes("el ") || c.includes("la ")) &&
        !u.includes("el ") && !u.includes("la ")) {
        return "You missed the article (el/la). Spanish usually needs an article before nouns.";
    }

    // Wrong adverb vs frequency
    if (c.includes("a menudo") && u.includes("lento")) {
        return "You used “lento” (slow) instead of a frequency word like “a menudo” (often).";
    }

    // Wrong verb form
    if (c.split(" ")[0] !== u.split(" ")[0]) {
        return "Your verb form doesn’t match the target sentence. Check the conjugation.";
    }

    return "Your sentence is understandable, but the grammar or word choice doesn’t match the target answer.";
}

function getCEFRGrammarHint(level, user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    /* ============================
       A1 HINTS
       ============================ */
    if (level === "A1") {
        if (!u.includes("el") && !u.includes("la") && (c.includes("el") || c.includes("la"))) {
            return "A1 hint: Remember to include articles (el/la) before nouns.";
        }
        if (!u.includes("te") && c.includes("te gusta")) {
            return "A1 hint: Use “te gusta” to say “you like”.";
        }
        return "A1 hint: Focus on simple present tense and basic sentence structure.";
    }

    /* ============================
       A2 HINTS
       ============================ */
    if (level === "A2") {
        if (u.includes("lento") && c.includes("a menudo")) {
            return "A2 hint: Use frequency words like “a menudo” instead of speed words like “lento”.";
        }
        if (!u.includes("ayer") && c.includes("ayer")) {
            return "A2 hint: Practice past-time markers like “ayer”.";
        }
        return "A2 hint: Practice common past tense verbs and daily routine vocabulary.";
    }

    /* ============================
       B1 HINTS
       ============================ */
    if (level === "B1") {
        if (!u.includes("porque") && c.includes("porque")) {
            return "B1 hint: Use connectors like “porque” to explain reasons.";
        }
        if (!u.includes("que") && c.includes("que")) {
            return "B1 hint: Multi‑clause sentences often require “que”.";
        }
        return "B1 hint: Try adding connectors (porque, aunque, cuando) to build longer sentences.";
    }

    /* ============================
       B2 HINTS
       ============================ */
    if (level === "B2") {
        if (!u.includes("aunque") && c.includes("aunque")) {
            return "B2 hint: Use contrast connectors like “aunque” for complex ideas.";
        }
        if (!u.includes("para") && c.includes("para")) {
            return "B2 hint: Use “para” to express purpose or intention.";
        }
        return "B2 hint: Aim for abstract vocabulary and multi‑clause structures.";
    }

    return "";
}




/* ============================================================
   CEFR TRAINER — CLEAN APP.JS (PART 1)
   ============================================================ */

function groupByCategory(words) {
    const out = {};
    words.forEach(w => {
        if (!out[w.category]) out[w.category] = [];
        out[w.category].push(w);
    });
    return out;
}
 
    
const STORAGE_KEY = "cefr_trainer_state_v2";

let appState = {
    currentLevel: "A1",
    speechRate: 1.0,
    studentName: "",
    badges: [],
    levelStats: {
        A1: { listens: 0, flashSeen: 0, quizScore: null, quizCompleted: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 },
        A2: { listens: 0, flashSeen: 0, quizScore: null, quizCompleted: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 },
        B1: { listens: 0, flashSeen: 0, quizScore: null, quizCompleted: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 },
        B2: { listens: 0, flashSeen: 0, quizScore: null, quizCompleted: 0, buildCompleted: 0, sentenceCompleted: 0, conversationCompleted: 0 }
    }
};

/* ============================================================
   CATEGORY AUTO‑ASSIGNER — PLACE HERE
   ============================================================ */

function autoAssignCategory(word) {
    const w = word.spanish.toLowerCase();

    // Verbs (infinitives)
    if (w.endsWith("ar") || w.endsWith("er") || w.endsWith("ir"))
        return "verbs";

    // Adjectives
    if (w.endsWith("o") || w.endsWith("a") || w.endsWith("os") || w.endsWith("as"))
        return "adjectives";

    // Numbers
    if (!isNaN(parseInt(w)))
        return "numbers";

    // Food & drink
    if (["manzana","pan","agua","carne","café","té","huevo","cerveza","vino","arroz","pollo","pescado","ensalada","verdura","fruta"].includes(w))
        return "food-drink";

    // Travel
    if (["aeropuerto","hotel","taxi","tren","avión","billete","mapa","ciudad","país","viaje","turista"].includes(w))
        return "travel";

    // Daily life
    if (["mañana","tarde","noche","casa","trabajo","escuela","día","semana","mes"].includes(w))
        return "daily-life";

    // Family
    if (["madre","padre","hermano","hermana","abuelo","abuela","tío","tía","primo","prima","familia"].includes(w))
        return "family";

    // Shopping
    if (["dinero","precio","tienda","comprar","vender","mercado","producto"].includes(w))
        return "shopping";

    // Emergency
    if (["ayuda","policía","hospital","ambulancia","fuego","emergencia"].includes(w))
        return "emergency";

    // Work
    if (["trabajo","oficina","jefe","empleado","empresa","reunión"].includes(w))
        return "work";

    // Places / objects
    if (["casa","escuela","parque","calle","puerta","mesa","silla","coche","habitacion","baño"].includes(w))
        return "places-objects";

    // Connectors
    if (["y","pero","porque","aunque","cuando","si","o","entonces","luego","después","antes"].includes(w))
        return "connectors";

    // Grammar words
    if (["el","la","los","las","un","una","unos","unas","yo","tú","él","ella","nosotros","vosotros","ellos"].includes(w))
        return "grammar";

    return "daily-life";
}

/* ============================================================
   APPLY CATEGORIES TO ALL CEFR LEVELS — PLACE HERE
   ============================================================ */

Object.keys(CEFR_LEVELS).forEach(level => {
    CEFR_LEVELS[level] = CEFR_LEVELS[level].map(w => ({
        ...w,
        category: w.category || autoAssignCategory(w)
    }));
});

/* ============================================================
   STATE LOAD / SAVE
   ============================================================ */
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) Object.assign(appState, JSON.parse(raw));
    } catch (e) {
        console.error("State load error:", e);
    }
}


function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("State save error:", e);
    }
}

/* ============================================================
   SABINA VOICE (Spanish TTS for explanations)
   ============================================================ */
function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";        // Sabina Spanish voice
    u.rate = appState.speechRate;
    u.pitch = 1.0;

    window.speechSynthesis.speak(u);
}

/* ============================================================
   SPEECH SYNTHESIS — Spanish word pronunciation
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
   QUIZ AUDIO — Sabina (correct + incorrect)
   ============================================================ */
function speakQuiz(correctAnswer) {
    const message = `La respuesta correcta es: ${correctAnswer}`;
    speak(message); // Sabina voice
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

    activateTab(currentTab);
}

/* ============================================================
   TAB SYSTEM — FINAL CLEAN VERSION
   ============================================================ */

const TABS = [
    "dashboard",
    "listen",
    "flash",
    "quiz",
    "build",
    "sentence",
    "conversation",
    "grammar"
];

let currentTab = "dashboard";

/* ============================================================
   ACTIVATE TAB
   ============================================================ */
function activateTab(tabName) {
    if (!TABS.includes(tabName)) return;
    currentTab = tabName;

    // Hide all tabs
    TABS.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.classList.add("hidden");
    });

    // Show active tab
    const activePanel = document.getElementById(tabName);
    if (activePanel) activePanel.classList.remove("hidden");

    // Update nav button highlight
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Load dynamic content
    switch (tabName) {
        case "listen":
            renderListenTab();
            break;

        case "flash":
            renderFlashcardsTab();
            break;

        case "quiz":
            renderQuizTab();
            break;

        case "build":
            renderBuildTab();
            break;

        case "sentence":
            renderSentenceTab();
            break;

        case "conversation":
            renderConversationTab();
            break;

        case "grammar":
            renderGrammarTab();
            break;

        case "dashboard":
            // static
            break;
    }
}

/* ============================================================
   TAB NAVIGATION WIRING
   ============================================================ */
function initTabNavigation() {
    const buttons = document.querySelectorAll(".tab-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            activateTab(tab);
        });
    });
}

// Initialize navigation + default tab
initTabNavigation();
activateTab("dashboard");

/* ============================================================
   ENGINE PACK — MATCHED TO YOUR HTML
============================================================ */

/* ---------------------------
   LISTEN ENGINE
--------------------------- */
const ListenEngine = {
    init() {
        renderListenTab();
    },

    play(rate) {
        Global.audioRate = rate;
        listenAutoPlay.active = true;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        playNextListenWord();
    },

    next() {
        listenAutoPlay.index++;
        playNextListenWord();
    },

    prev() {
        listenAutoPlay.index = Math.max(0, listenAutoPlay.index - 1);
        playNextListenWord();
    },

    toggleAuto(rate) {
        Global.audioRate = rate;
        listenAutoPlay.active = !listenAutoPlay.active;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;

        if (listenAutoPlay.active) {
            playNextListenWord();
        } else {
            speechSynthesis.cancel();
        }
    }
};


/* ---------------------------
   FLASHCARD ENGINE
--------------------------- */
const FlashcardEngine = {
    init() {
        renderFlashcardsTab();
    },
    refresh() {
        renderFlashcardsTab();
    }
};



/* ---------------------------
   QUIZ ENGINE
--------------------------- */
const QuizEngine = {
    init() {
        renderQuizTab();
        document.dispatchEvent(new Event("quizRendered"));
    },

    check(answer) {
        return quizCheckAnswer(answer);
    },

    refresh() {
        renderQuizTab();
        document.dispatchEvent(new Event("quizRendered"));
    }
};


/* ---------------------------
   BUILD ENGINE
--------------------------- */
const BuildEngine = {
    init() {
        renderBuildTab();
        document.dispatchEvent(new Event("buildRendered"));
    },

    addWord(word) {
        buildAddWord(word);
    },

    check() {
        return buildCheckSentence();
    },

    refresh() {
        renderBuildTab();
        document.dispatchEvent(new Event("buildRendered"));
    }
};


/* ---------------------------
   SENTENCE ENGINE
--------------------------- */
const SentenceEngine = {
    init() {
        renderSentenceTab();
        document.dispatchEvent(new Event("sentenceRendered"));
    },

    refresh() {
        renderSentenceTab();
        document.dispatchEvent(new Event("sentenceRendered"));
    }
};


/* ---------------------------
   CONVERSATION ENGINE
--------------------------- */
const ConversationEngine = {
    init() {
        renderConversationTab();
        document.dispatchEvent(new Event("conversationRendered"));
    },

    addWord(word) {
        conversationAddWord(word);
    },

    evaluate(input) {
        return conversationEvaluate(input);
    },

    appendReply(reply) {
        conversationAppendReply(reply);
    },

    refresh() {
        renderConversationTab();
        document.dispatchEvent(new Event("conversationRendered"));
    }
};


/* ---------------------------
   REVIEW ENGINE
--------------------------- */
const ReviewEngine = {
    init() {
        // renderReviewTab();   // ❌ REMOVE — function does not exist
        document.dispatchEvent(new Event("reviewRendered"));
    },

    markMastered() {
        // reviewMarkMastered(); // ❌ REMOVE unless you define it
    },

    refresh() {
        // renderReviewTab();   // ❌ REMOVE
        document.dispatchEvent(new Event("reviewRendered"));
    }
};



/* ---------------------------
   ACHIEVEMENTS ENGINE
--------------------------- */

function renderListenTab() {
    const container = document.getElementById("listenList");   // ✔ correct ID
    if (!container) return;

    // your existing Listen renderer code stays exactly the same
}

function renderFlashcardsTab() {
    const container = document.getElementById("flash-content");   // ✔ correct ID
    if (!container) return;

    // your existing Flashcards renderer code stays exactly the same
}


/* ============================================================
   LISTEN TAB — CATEGORY + AUDIO PLAYER + CLEAN UI
   ============================================================ */

let listenAutoPlay = {
    active: false,
    paused: false,
    index: 0,
    list: []
};

function renderListenTab() {
    const container = document.getElementById("listenList");
    if (!container) return;

    // Pull the correct CEFR level vocabulary (already categorized)
    const levelData = LISTEN_VOCAB[appState.currentLevel];

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Listen — Level ${appState.currentLevel}</h2>
            <p>Tap a category, then click a word pill to hear it.</p>

            <div class="listen-player-controls" style="
                display:flex;
                gap:6px;
                flex-wrap:wrap;
                margin-top:6px;
                justify-content:flex-start;
            ">
                <button class="pill" id="listen-playall">Play All</button>
                <button class="pill" id="listen-pause">Pause</button>
                <button class="pill" id="listen-resume">Resume</button>
                <button class="pill" id="listen-stop">Stop</button>
            </div>
        </div>
    `;

    /* ============================================================
       CATEGORY LIST (already grouped in LISTEN_VOCAB)
       ============================================================ */
    Object.keys(levelData).forEach(categoryName => {
        const words = levelData[categoryName];

       html += `
<div class="glass-panel">
    <div class="listen-category-header" data-cat="${categoryName}">
       <span class="listen-category-title">${categoryName}</span>
       <span class="listen-arrow">▶</span>
    </div>


            <div class="listen-category-content" data-cat="${categoryName}">
                <div class="listen-grid" style="
                    display:grid;
                    grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));
                    gap:6px;
                    margin-top:8px;
                ">
                    ${words.map(spanish => {
                         const entry = CEFR_LEVELS[appState.currentLevel].find(w => w.spanish === spanish);
                         const english = entry ? entry.english : "";
                         return `
                           <button class="pill listen-pill" data-spanish="${spanish}">
                             <div class="listen-pill-en">${english}</div>
                             <div class="listen-pill-es">${spanish}</div>
                           </button>
                       `;
                   }).join("")}

                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    /* ============================================================
       CATEGORY COLLAPSE
       ============================================================ */
    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(
                `.listen-category-content[data-cat="${cat}"]`
            );
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ============================================================
       SINGLE WORD PLAYBACK
       ============================================================ */
    container.querySelectorAll(".pill[data-spanish]").forEach(btn => {
        btn.addEventListener("click", () => {
            speakSpanish(btn.dataset.spanish);
            appState.levelStats[appState.currentLevel].listens++;
            saveState();
            updateBadges();
            updateProgressMeters();
        });
    });

    /* ============================================================
       AUTO PLAY — PLAY ALL WORDS
       ============================================================ */

    // Flatten all categories into one list
    listenAutoPlay.list = Object.values(levelData).flat();

    document.getElementById("listen-playall").onclick = () => {
        listenAutoPlay.active = true;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        playNextListenWord();
    };

    document.getElementById("listen-pause").onclick = () => {
        listenAutoPlay.paused = true;
        if (speechSynthesis.pause) speechSynthesis.pause();
    };

    document.getElementById("listen-resume").onclick = () => {
        listenAutoPlay.paused = false;
        if (speechSynthesis.resume) speechSynthesis.resume();
        playNextListenWord();
    };

    document.getElementById("listen-stop").onclick = () => {
        listenAutoPlay.active = false;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        if (speechSynthesis.cancel) speechSynthesis.cancel();
    };
}



/* ============================================================
   AUTO PLAY ENGINE
   ============================================================ */
function playNextListenWord() {
    if (!listenAutoPlay.active || listenAutoPlay.paused) return;

    const list = listenAutoPlay.list;
    if (listenAutoPlay.index >= list.length) {
        listenAutoPlay.active = false;
        return;
    }

    const word = list[listenAutoPlay.index];
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "es-ES";
    utter.rate = appState.speechRate;

    utter.onend = () => {
        if (!listenAutoPlay.paused) {
            listenAutoPlay.index++;
            setTimeout(playNextListenWord, 500);
        }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

/* ============================================================
   FLASHCARDS — CATEGORY GROUPED + FLIP + AUDIO (STABLE VERSION)
============================================================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash-content");
    if (!container) {
        console.warn("Flashcards: #flash-content not found.");
        return;
    }

    const level = appState.currentLevel || "A1";
    const words = CEFR_LEVELS[level];
    if (!words) {
        console.warn("Flashcards: no CEFR data for level", level);
        return;
    }

    const grouped = groupByCategory(words);

    let html = `
        <div class="glass-panel">
            <h2>Flashcards — Level ${level}</h2>
            <p>Tap a card to flip. Spanish side plays audio.</p>
        </div>
    `;

    Object.keys(grouped).forEach(cat => {
        html += `
        <div class="glass-panel">
            <div class="flash-category-header" data-cat="${cat}">
                <span class="listen-category-title">${cat.toUpperCase()}</span>
                <span class="listen-arrow">▶</span>
            </div>

            <div class="flash-category-content" data-cat="${cat}">
                <div class="fc-grid">
                    ${grouped[cat].map(item => `
                        <div class="fc-card">
                            <div class="fc-inner">
                                <div class="fc-front pill">${item.english}</div>
                                <div class="fc-back pill">${item.spanish}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // Category collapse
    container.querySelectorAll(".flash-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    // Flip + audio
    const cards = container.querySelectorAll(".fc-card");
    console.log("Flashcards: cards found =", cards.length);

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const inner = card.querySelector(".fc-inner");
            const flipped = inner.classList.toggle("fc-flipped");
            const spanish = inner.querySelector(".fc-back").textContent.trim();

            console.log("Flashcard clicked, flipped =", flipped, "spanish =", spanish);

            if (flipped) {
                speakSpanish(spanish);
            } else {
                speechSynthesis.cancel();
            }
        });
    });
}


/* ============================================================
   QUIZ — ORIGINAL SIMPLE VERSION (RESTORED + FIXED)
============================================================ */

function renderQuizTab() {
    const container = document.getElementById("tab-quiz");
    const level = appState.currentLevel;
    const words = CEFR_LEVELS[level];

    if (!words || !words.length) {
        container.innerHTML = `
            <div class="glass-panel quiz-card">
                <p>No words found for level ${level}.</p>
            </div>
        `;
        return;
    }

    // Pick a random word
    const item = words[Math.floor(Math.random() * words.length)];

    // Build 3 options (1 correct + 2 incorrect)
    const options = [item.spanish];
    while (options.length < 3) {
        const r = words[Math.floor(Math.random() * words.length)].spanish;
        if (!options.includes(r)) options.push(r);
    }

   function getHarderLevel(level) {
    switch (level) {
        case "A1": return "A2";
        case "A2": return "B1";
        case "B1": return "B2";
        default: return "B2";
    }
}

   document.getElementById("quizHarder").onclick = () => {
    appState.currentLevel = getHarderLevel(level);

    const fb = document.getElementById("quizFeedback");
    fb.textContent = `Harder mode: now practicing ${appState.currentLevel}`;
    fb.className = "quiz-feedback";

    renderQuizTab();
};


    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Build HTML (restored original layout)
    container.innerHTML = `
        <h2>Quiz — Level ${level}</h2>
        <p>Select the correct Spanish for the English word.</p>

        <!-- Word pill -->
        <div id="quizPrompt" class="pill quiz-word-pill">${item.english}</div>

        <!-- Option pills -->
        <div id="quizOptions" class="quiz-options">
            ${options.map(opt => `
                <button class="quiz-option pill">${opt}</button>
            `).join("")}
        </div>

        <!-- Selected word display -->
        <div id="quizSelected" class="quiz-selected-word"></div>

        <!-- Controls -->
        <div class="quiz-controls">
            <button id="quizCheck" class="pill-btn">Check</button>
            <button id="quizNext" class="pill-btn">Next</button>
            <button id="quizHarder" class="pill-btn">Harder</button>
        </div>

        <!-- Feedback -->
        <div id="quizFeedback" class="quiz-feedback"></div>
    `;

    /* ---------------------------
       OPTION SELECTION
    --------------------------- */
    let selected = null;

    container.querySelectorAll(".quiz-option").forEach(btn => {
        btn.addEventListener("click", () => {

            // remove highlight from all
            container.querySelectorAll(".quiz-option")
                .forEach(b => b.classList.remove("selected"));

            // highlight selected
            btn.classList.add("selected");

            selected = btn.textContent.trim();

            // show selected word
            document.getElementById("quizSelected").textContent =
                `Selected: ${selected}`;
        });
    });

    /* ---------------------------
       CHECK ANSWER
    --------------------------- */
    document.getElementById("quizCheck").onclick = () => {
        if (!selected) return;

        const correct = item.spanish;
        const fb = document.getElementById("quizFeedback");

        if (selected === correct) {
            fb.textContent = "Correct!";
            fb.className = "quiz-feedback correct";

            // scoring safety
            const stats = appState.levelStats[level];
            if (stats) {
                stats.quizCompleted = (stats.quizCompleted || 0) + 1;
                stats.quizScore     = (stats.quizScore     || 0) + 1;
            }

            updateBadges();
            updateProgressMeters();

        } else {
            fb.textContent = `Incorrect — correct answer: ${correct}`;
            fb.className = "quiz-feedback incorrect";
        }

        saveState();
    };

    /* ---------------------------
       NEXT QUESTION
    --------------------------- */
    document.getElementById("quizNext").onclick = () => {
        renderQuizTab();
    };

    /* ---------------------------
       HARDER LEVEL
    --------------------------- */
    document.getElementById("quizHarder").onclick = () => {
        appState.currentLevel = getHarderLevel(level);
        renderQuizTab();
    };
}


/* ============================================================
   BUILD TAB — English → Spanish Builder (with disruptors + feedback)
   ============================================================ */
function renderBuildTab() {
    const container = document.getElementById("build-content");

    const pool = CEFR_SENTENCES[appState.currentLevel];
    const sentence = pool[Math.floor(Math.random() * pool.length)];

    const english = sentence.english;
    const spanish = sentence.spanish;

    const coreTokens = spanish.split(" ");

    const disruptors = [
        "rápido","lento","siempre","nunca","ayer","mañana",
        "porque","pero","muy","también","solo","entonces"
    ];

    let bank = [...coreTokens];

    while (bank.length < coreTokens.length + 5) {
        const d = disruptors[Math.floor(Math.random() * disruptors.length)];
        if (!bank.includes(d)) bank.push(d);
    }

    bank = bank.sort(() => Math.random() - 0.5);

    buildState.tokens = bank;
    buildState.answer = [];

    container.innerHTML = `
        <div class="glass-panel build-card">
            <h2>Duplicate this sentence in Spanish</h2>
            <p class="build-english"><strong>English:</strong> ${english}</p>

            <div id="build-selected" class="build-selected"></div>

            <div id="build-words" class="sb-grid">
                ${bank.map(w => `<button class="pill build-opt" data-token="${w}">${w}</button>`).join("")}
            </div>

            <input id="build-input" class="input-field" placeholder="Or type the Spanish sentence…">

            <div id="build-feedback"></div>

            <div class="sb-controls">
                <button id="build-undo">Undo</button>
                <button id="build-reset">Reset</button>
                <button id="build-check">Check</button>
                <button id="build-next">Next</button>
            </div>
        </div>
    `;

    setupBuildEvents(sentence);
}

function setupBuildEvents(sentence) {
    const selectedArea = document.getElementById("build-selected");
    const grid = document.getElementById("build-words");
    const input = document.getElementById("build-input");
    const feedback = document.getElementById("build-feedback");

    const undoBtn = document.getElementById("build-undo");
    const resetBtn = document.getElementById("build-reset");
    const checkBtn = document.getElementById("build-check");
    const nextBtn = document.getElementById("build-next");

    buildState.answer = [];

    grid.querySelectorAll(".build-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            buildState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            selectedArea.textContent = buildState.answer.join(" ");
        });
    });

    input.addEventListener("input", () => {
        buildState.answer = input.value.trim().split(" ");
        selectedArea.textContent = buildState.answer.join(" ");
    });

    undoBtn.addEventListener("click", () => {
        buildState.answer.pop();
        selectedArea.textContent = buildState.answer.join(" ");

        grid.querySelectorAll(".build-opt").forEach(btn => {
            if (!buildState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        buildState.answer = [];
        selectedArea.textContent = "";
        input.value = "";
        grid.querySelectorAll(".build-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    checkBtn.addEventListener("click", () => {
    const correct = sentence.spanish.trim();
    const user = buildState.answer.join(" ").trim();

    // NEW: translate learner answer to English
    const learnerEnglish = translateToEnglish(user);

    if (user === correct) {
        feedback.innerHTML = `
            <span style="color:#4ade80;font-weight:600;">Correct! 🎉</span><br><br>
            <strong>Your Translated Response is:</strong><br>${learnerEnglish}
        `;
        appState.levelStats[appState.currentLevel].buildCompleted++;
        updateBadges();
        updateProgressMeters();
        setTimeout(() => speakQuiz(correct), 300);
    } else {
        const correctTokens = correct.split(" ");
        const userTokens = buildState.answer;

        let html = `<strong>Correct Answer:</strong><br>${correct}<br><br>`;
        html += `<strong>Your Answer:</strong><br>${user}<br><br>`;
        html += `<strong>Your Translated Response is:</strong><br>${learnerEnglish}<br><br>`;
        html += `<strong>Word-by-word feedback:</strong><br>`;

        userTokens.forEach((t, i) => {
            if (correctTokens[i] === t) {
                html += `<span style="color:#4ade80;">${t} ✔</span> `;
            } else {
                html += `<span style="color:#f87171;">${t} ✖</span> `;
            }
        });

        feedback.innerHTML = html;
        setTimeout(() => speakQuiz(correct), 300);
    }

    saveState();
});


    nextBtn.addEventListener("click", () => {
        renderBuildTab();
    });
}

/* ============================================================
   SENTENCE TAB — CEFR MULTIPLE‑CHOICE (FINAL MASTER VERSION)
   ============================================================ */

function generateSentenceForLevel(level) {
    const pool = CEFR_SENTENCE_CHOICES[level];
    const item = pool[Math.floor(Math.random() * pool.length)];

    const shuffled = [...item.options]
    .filter(Boolean)
    .sort(() => Math.random() - 0.5);


    return {
        english: item.english,
        correct: item.correct,
        options: shuffled
    };
}

function renderSentenceTab() {
    const container = document.getElementById("sentence-content");
    const level = appState.currentLevel;

    // SAFETY CHECK — prevents crashes if level has no sentences
    if (!CEFR_SENTENCE_CHOICES[level]) {
        container.innerHTML = "<p>No sentences available for this level.</p>";
        return;
    }

    const q = generateSentenceForLevel(level);


    container.innerHTML = `
        <div class="glass-panel sentence-card">
            <h2>Sentence — Level ${level}</h2>
            <p>Select the correct Spanish translation.</p>

            <div class="sentence-english">
                <strong>English:</strong> ${q.english}
            </div>

            <div id="sentence-options" class="sentence-options">
                ${q.options.map(opt => `
                    <button class="pill" data-opt="${opt}">
                        ${opt}
                    </button>
                `).join("")}
            </div>

            <div id="sentence-feedback"></div>

            <div class="sentence-controls">
                <button id="sentence-next" class="pill">Next</button>
            </div>
        </div>
    `;

    setupSentenceEvents(q);
}

function setupSentenceEvents(q) {
    const buttons = document.querySelectorAll(".pill");
    const feedback = document.getElementById("sentence-feedback");
    const nextBtn = document.getElementById("sentence-next");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const chosen = btn.dataset.opt;

            if (chosen === q.correct) {
                feedback.innerHTML = `
                    <span style="color:#4ade80;font-weight:600;">
                        Correct! 🎉
                    </span>
                `;

                appState.levelStats[appState.currentLevel].sentenceCompleted++;
                updateBadges();
                updateProgressMeters();

                speakQuiz(q.correct);

            } else {
                feedback.innerHTML = `
                    <span style="color:#f87171;font-weight:600;">
                        Incorrect.</span><br>
                    Correct answer: <strong>${q.correct}</strong>
                `;

                speakQuiz(q.correct);
            }

            buttons.forEach(b => b.disabled = true);
        });
    });

    nextBtn.addEventListener("click", () => {
        renderSentenceTab();
    });
}



/* ============================================================
   CEFR SENTENCE CHOICES — FULL PACK (A1 → B2)
   ============================================================ */

const CEFR_SENTENCE_CHOICES = {

    /* ============================
       A1 — Beginner
       ============================ */
    A1: [
        {
            english: "I want a coffee.",
            correct: "quiero un café",
            options: ["quiero un café", "necesito agua", "tengo hambre"]
        },
        {
            english: "Where is the bathroom?",
            correct: "dónde está el baño",
            options: ["dónde está el baño", "dónde está la mesa", "dónde está mi amigo"]
        },
        {
            english: "I need help.",
            correct: "necesito ayuda",
            options: ["necesito ayuda", "necesito comida", "necesito descansar"]
        },
        {
            english: "The room is clean.",
            correct: "la habitación está limpia",
            options: ["la habitación está limpia", "la habitación está sucia", "la habitación está lejos"]
        },
        {
            english: "He likes cold water.",
            correct: "a él le gusta el agua fría",
            options: ["a él le gusta el agua fría", "a él le gusta el café caliente", "a él le gusta la comida"]
        },
        {
            english: "We are at home.",
            correct: "estamos en casa",
            options: ["estamos en casa", "estamos en el hotel", "estamos en la tienda"]
        },
        {
            english: "She is my sister.",
            correct: "ella es mi hermana",
            options: ["ella es mi hermana", "ella es mi madre", "ella es mi amiga"]
        },
        {
            english: "The bus is late.",
            correct: "el autobús está retrasado",
            options: ["el autobús está retrasado", "el autobús está aquí", "el autobús está limpio"]
        },
        {
            english: "I am tired today.",
            correct: "estoy cansado hoy",
            options: ["estoy cansado hoy", "estoy feliz hoy", "estoy en casa hoy"]
        },
        {
            english: "The food is delicious.",
            correct: "la comida es deliciosa",
            options: ["la comida es deliciosa", "la comida es fría", "la comida es nueva"]
        },
        {
            english: "I want to go home.",
            correct: "quiero ir a casa",
            options: ["quiero ir a casa", "quiero ir al hotel", "quiero ir a la tienda"]
        },
        {
            english: "He has a big car.",
            correct: "él tiene un coche grande",
            options: ["él tiene un coche grande", "él tiene un coche pequeño", "él tiene una casa grande"]
        },
        {
            english: "My friend is very nice.",
            correct: "mi amigo es muy amable",
            options: ["mi amigo es muy amable", "mi amigo es muy alto", "mi amigo es muy cansado"]
        },
        {
            english: "The hotel is near.",
            correct: "el hotel está cerca",
            options: ["el hotel está cerca", "el hotel está lejos", "el hotel está limpio"]
        },
        {
            english: "I have two brothers.",
            correct: "tengo dos hermanos",
            options: ["tengo dos hermanos", "tengo dos casas", "tengo dos cafés"]
        }
    ],

    /* ============================
       A2 — Elementary
       ============================ */
    A2: [
        {
            english: "We are going to visit my parents.",
            correct: "vamos a visitar a mis padres",
            options: ["vamos a visitar a mis padres", "vamos a comprar comida", "vamos a limpiar la casa"]
        },
        {
            english: "She bought fruit at the market.",
            correct: "ella compró fruta en el mercado",
            options: ["ella compró fruta en el mercado", "ella compró ropa nueva", "ella compró un teléfono"]
        },
        {
            english: "I cleaned the kitchen yesterday.",
            correct: "limpié la cocina ayer",
            options: ["limpié la cocina ayer", "cociné la cena ayer", "compré comida ayer"]
        },
        {
            english: "He called me last night.",
            correct: "él me llamó anoche",
            options: ["él me llamó anoche", "él me visitó anoche", "él me vio anoche"]
        },
        {
            english: "She is cooking dinner now.",
            correct: "ella está cocinando la cena ahora",
            options: ["ella está cocinando la cena ahora", "ella está limpiando ahora", "ella está leyendo ahora"]
        },
        {
            english: "We arrived early.",
            correct: "llegamos temprano",
            options: ["llegamos temprano", "llegamos tarde", "llegamos mañana"]
        },
        {
            english: "I want to try something new.",
            correct: "quiero probar algo nuevo",
            options: ["quiero probar algo nuevo", "quiero comprar algo nuevo", "quiero comer algo nuevo"]
        },
        {
            english: "He forgot his keys.",
            correct: "él olvidó sus llaves",
            options: ["él olvidó sus llaves", "él perdió su teléfono", "él rompió su bolsa"]
        },
        {
            english: "I usually wake up early.",
            correct: "normalmente me despierto temprano",
            options: ["normalmente me despierto temprano", "normalmente me duermo temprano", "normalmente como temprano"]
        },
        {
            english: "She likes to read at night.",
            correct: "a ella le gusta leer por la noche",
            options: ["a ella le gusta leer por la noche", "a ella le gusta caminar por la noche", "a ella le gusta cocinar por la noche"]
        }
    ],

    /* ============================
       B1 — Intermediate
       ============================ */
    B1: [
        {
            english: "We need to organize the meeting.",
            correct: "necesitamos organizar la reunión",
            options: ["necesitamos organizar la reunión", "necesitamos limpiar la oficina", "necesitamos terminar el informe"]
        },
        {
            english: "I think this restaurant is excellent.",
            correct: "creo que este restaurante es excelente",
            options: ["creo que este restaurante es excelente", "creo que este restaurante es nuevo", "creo que este restaurante es pequeño"]
        },
        {
            english: "She asked me to help her.",
            correct: "ella me pidió que la ayudara",
            options: ["ella me pidió que la ayudara", "ella me pidió que la llamara", "ella me pidió que la visitara"]
        },
        {
            english: "They plan to move next month.",
            correct: "ellos planean mudarse el próximo mes",
            options: ["ellos planean mudarse el próximo mes", "ellos planean viajar el próximo mes", "ellos planean trabajar el próximo mes"]
        },
        {
            english: "We must follow the instructions.",
            correct: "debemos seguir las instrucciones",
            options: ["debemos seguir las instrucciones", "debemos cambiar las instrucciones", "debemos leer las instrucciones"]
        },
        {
            english: "He wants to change his schedule.",
            correct: "él quiere cambiar su horario",
            options: ["él quiere cambiar su horario", "él quiere cambiar su casa", "él quiere cambiar su comida"]
        },
        {
            english: "Although it was difficult, she completed the task.",
            correct: "aunque fue difícil, ella completó la tarea",
            options: ["aunque fue difícil, ella completó la tarea", "aunque fue fácil, ella completó la tarea", "aunque fue difícil, ella canceló la tarea"]
        },
        {
            english: "We talked for an hour.",
            correct: "hablamos durante una hora",
            options: ["hablamos durante una hora", "hablamos durante un día", "hablamos durante un minuto"]
        }
    ],

    /* ============================
       B2 — Upper Intermediate
       ============================ */
    B2: [
        {
            english: "We must consider all possibilities.",
            correct: "debemos considerar todas las posibilidades",
            options: ["debemos considerar todas las posibilidades", "debemos cancelar todas las posibilidades", "debemos ignorar todas las posibilidades"]
        },
        {
            english: "They want to analyze the situation.",
            correct: "ellos quieren analizar la situación",
            options: ["ellos quieren analizar la situación", "ellos quieren cambiar la situación", "ellos quieren evitar la situación"]
        },
        {
            english: "We need to evaluate the risks carefully.",
            correct: "necesitamos evaluar los riesgos cuidadosamente",
            options: ["necesitamos evaluar los riesgos cuidadosamente", "necesitamos evitar los riesgos cuidadosamente", "necesitamos reducir los riesgos cuidadosamente"]
        },
        {
            english: "She believes the idea is innovative.",
            correct: "ella cree que la idea es innovadora",
            options: ["ella cree que la idea es innovadora", "ella cree que la idea es complicada", "ella cree que la idea es pequeña"]
        },
        {
            english: "Despite the problems, they finished the project.",
            correct: "a pesar de los problemas, terminaron el proyecto",
            options: ["a pesar de los problemas, terminaron el proyecto", "a pesar de los problemas, cancelaron el proyecto", "a pesar de los problemas, ignoraron el proyecto"]
        },
        {
            english: "They want to optimize the process.",
            correct: "ellos quieren optimizar el proceso",
            options: ["ellos quieren optimizar el proceso", "ellos quieren cancelar el proceso", "ellos quieren dividir el proceso"]
        }
    ]
};



/* ============================================================
   CONVERSATION TAB — RENDER + EVENTS (Stable Version)
============================================================ */

const CONVO_PROMPTS = [
    { english: "How are you today?", spanishTarget: "¿Cómo estás hoy?" },
    { english: "Where do you live?", spanishTarget: "¿Dónde vives?" },
    { english: "What do you like to do on weekends?", spanishTarget: "¿Qué te gusta hacer los fines de semana?" },
    { english: "Do you work or study?", spanishTarget: "¿Trabajas o estudias?" },
    { english: "What is your favorite food?", spanishTarget: "¿Cuál es tu comida favorita?" },
    { english: "What time do you usually get up?", spanishTarget: "¿A qué hora sueles levantarte?" }
];

function renderConversationTab() {
   const container = document.getElementById("conversationFeed");
   const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel convo-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    // Pick random prompt
    convoState.currentPrompt = CONVO_PROMPTS[Math.floor(Math.random() * CONVO_PROMPTS.length)];
    const target = convoState.currentPrompt.spanishTarget;

    // Build wordbank from level words + disruptors
    const coreTokens = target.replace(/[¿?]/g, "").split(" ");
    const levelTokens = words.map(w => w.spanish.split(" ")).flat();
    const disruptors = ["rápido", "lento", "siempre", "nunca", "ayer", "mañana", "porque", "pero"];

    let bank = [...coreTokens];

    // Add some level words
    while (bank.length < coreTokens.length + 4) {
        const t = levelTokens[Math.floor(Math.random() * levelTokens.length)];
        if (t && !bank.includes(t)) bank.push(t);
    }

    // Add disruptors
    disruptors.forEach(d => {
        if (!bank.includes(d)) bank.push(d);
    });

    // Shuffle bank
    bank = bank.sort(() => Math.random() - 0.5);

    convoState.tokens = bank;
    convoState.answer = [];

    container.innerHTML = `
        <div class="glass-panel convo-card">
            <h2>Conversation — Level ${appState.currentLevel}</h2>
            <p>Respond in Spanish by selecting the correct words from the wordbank.</p>

            <div id="convo-prompt"><strong>Prompt (English):</strong> ${convoState.currentPrompt.english}</div>

            <div id="convo-grid" class="sb-grid">
                ${convoState.tokens.map(t => `
                    <button class="pill convo-opt" data-token="${t}">${t}</button>
                `).join("")}
            </div>

            <div id="convo-answer"></div>

            <input id="convo-type" class="convo-type" placeholder="Or type your response in Spanish…" />

            <div id="convo-feedback"></div>

            <div class="sb-controls">
                <button id="convo-undo">Undo</button>
                <button id="convo-reset">Reset</button>
                <button id="convo-check">Check</button>
                <button id="convo-next">Next</button>
            </div>
        </div>
    `;

    // ⭐ Wire events immediately after rendering
    wireConversationEvents();
}

function wireConversationEvents() {
    const grid = document.getElementById("convo-grid");
    const answerBox = document.getElementById("convo-answer");
    const typeBox = document.getElementById("convo-type");
    const feedback = document.getElementById("convo-feedback");

    const undoBtn = document.getElementById("convo-undo");
    const resetBtn = document.getElementById("convo-reset");
    const checkBtn = document.getElementById("convo-check");
    const nextBtn = document.getElementById("convo-next");

    convoState.answer = [];

    /* ============================================================
       WORD PILL SELECTION
    ============================================================ */
    grid.querySelectorAll(".convo-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            convoState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            answerBox.textContent = convoState.answer.join(" ");
        });
    });

    /* ============================================================
       TYPING MODE
    ============================================================ */
    typeBox.addEventListener("input", () => {
        convoState.answer = typeBox.value.trim().split(" ");
        answerBox.textContent = convoState.answer.join(" ");
    });

    /* ============================================================
       UNDO BUTTON
    ============================================================ */
    undoBtn.addEventListener("click", () => {
        convoState.answer.pop();
        answerBox.textContent = convoState.answer.join(" ");

        grid.querySelectorAll(".convo-opt").forEach(btn => {
            if (!convoState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    /* ============================================================
       RESET BUTTON
    ============================================================ */
    resetBtn.addEventListener("click", () => {
        convoState.answer = [];
        answerBox.textContent = "";
        typeBox.value = "";
        grid.querySelectorAll(".convo-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    /* ============================================================
       CHECK ANSWER
    ============================================================ */
    checkBtn.addEventListener("click", () => {
        const correct = convoState.currentPrompt.spanishTarget.replace(/[¿?]/g, "").trim();
        const user = convoState.answer.join(" ").trim();

        if (user === correct) {
            feedback.textContent = "Nice! That’s a natural response. 🎉";

            if (appState.levelStats[appState.currentLevel].conversationCompleted == null) {
                appState.levelStats[appState.currentLevel].conversationCompleted = 0;
            }
            appState.levelStats[appState.currentLevel].conversationCompleted++;

            updateBadges();
            updateProgressMeters();
            setTimeout(() => speakQuiz(correct), 300);

        } else {
            feedback.textContent = `Not quite. A natural response would be: ${convoState.currentPrompt.spanishTarget}`;
            setTimeout(() => speakQuiz(correct), 300);
        }

        saveState();
    });

    /* ============================================================
       NEXT PROMPT
    ============================================================ */
    nextBtn.addEventListener("click", () => {
        renderConversationTab();
    });
}



/* ============================================================
   GRAMMAR TAB
   ============================================================ */

function renderGrammarTab() {
    const container = document.getElementById("achievements-content"); // ✔ Achievements tab
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    container.insertAdjacentHTML("beforeend", `
        <div class="glass-panel quiz-card" style="margin-top:20px;">
            <h2>Grammar — Level ${appState.currentLevel}</h2>
            <p>Breakdown of word types you're training.</p>
        </div>

        <div class="glass-panel quiz-card">
            <ul>
                ${Object.keys(grouped).map(cat => `
                    <li><strong>${cat}</strong>: ${grouped[cat].length} items</li>
                `).join("")}
            </ul>
            <p style="margin-top:10px;opacity:0.8;">
                Notice how connectors, verbs, adjectives and nouns combine.
            </p>
        </div>
    `);
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

    // ⭐ NEW BADGES — paste here
    if (s.sentenceCompleted >= 10) badges.add(`${level} Sentence Pro`);
    if (s.conversationCompleted >= 10) badges.add(`${level} Conversationalist`);
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
   STUDENT NAME BOX
   ============================================================ */

function initNameBox() {
    const input = document.getElementById("student-name");
    const btn = document.getElementById("save-name-btn");
    const status = document.getElementById("name-status");

    input.value = appState.studentName || "";

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
   SPEECH RATE CONTROL
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
   PROGRESS METER CONTROLLER
   ============================================================ */

function animateNumber(id, target) {
    let current = 0;
    const step = target / 40;

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        document.getElementById(id).textContent = Math.round(current) + "%";
    }, 20);
}

function updateProgressMeters() {

    // Bar widths
    document.getElementById("quiz-progress").style.width = "60%";
    document.getElementById("build-progress").style.width = "45%";
    document.getElementById("sentence-progress").style.width = "30%";

    document.getElementById("xp-progress").style.width = "70%";
    document.getElementById("streak-progress").style.width = "40%";
    document.getElementById("score-progress").style.width = "85%";
    document.getElementById("review-progress").style.width = "20%";

    // Animated numbers
    animateNumber("quiz-number", 60);
    animateNumber("build-number", 45);
    animateNumber("sentence-number", 30);

    animateNumber("xp-number", 70);
    animateNumber("streak-number", 40);
    animateNumber("score-number", 85);
    animateNumber("review-number", 20);

    // Pulse animations
    pulseTile("quiz-tile");
    pulseTile("build-tile");
    pulseTile("sentence-tile");
    pulseTile("xp-tile");
    pulseTile("streak-tile");
    pulseTile("score-tile");
    pulseTile("review-tile");
}

/* ============================================================
   TILE PULSE ANIMATION
   ============================================================ */

function pulseTile(id) {
    const tile = document.getElementById(id);
    if (!tile) return;

    tile.classList.remove("pulse");
    void tile.offsetWidth;
    tile.classList.add("pulse");
}

/* ============================================================
   STARTUP
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    loadState();

    initTabNavigation();     // tab buttons now exist
    activateTab("dashboard"); // show dashboard first

    initRateControl();       // slider exists now
    initNameBox();           // name box exists now

    updateBadges();
    updateProgressMeters();
});

