/* ============================================================
   TRANSLATION ENGINE — CEFR Phrases + Word Dictionary
   ============================================================ */

function translateToEnglish(spanishText) {
    const normalized = spanishText.toLowerCase().trim();

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

    if (CEFR_PHRASES[normalized]) {
        return CEFR_PHRASES[normalized];
    }

    /* ============================================================
   WORD-BY-WORD DICTIONARY — CEFR A1 → B2 (Categorized)
   ============================================================ */

const WORD_DICT = {

    /* ============================================================
       A1 — Beginner Vocabulary
       ============================================================ */

    // Core greetings & basics
    "hola": "hello",
    "adiós": "goodbye",
    "por": "for",
    "favor": "favor",
    "gracias": "thank you",
    "sí": "yes",
    "no": "no",
    "lo": "it",
    "siento": "sorry",
    "perdón": "excuse me",

    // Pronouns
    "yo": "I",
    "tú": "you",
    "él": "he",
    "ella": "she",
    "nosotros": "we",
    "ellos": "they",

    // Connectors
    "y": "and",
    "o": "or",
    "pero": "but",
    "porque": "because",
    "con": "with",
    "sin": "without",
    "también": "also",
    "muy": "very",
    "más": "more",
    "poco": "little",
    "entonces": "then",
    "un": "a",

    // Food & drink
    "agua": "water",
    "comida": "food",
    "café": "coffee",
    "té": "tea",
    "leche": "milk",
    "pan": "bread",
    "cerveza": "beer",
    "bistec": "steak",
    "papas": "potatoes",
    "fritas": "fried",
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
    "mantequilla": "butter",
    "azúcar": "sugar",
    "sal": "salt",

    // Places & objects
    "baño": "bathroom",
    "hotel": "hotel",
    "habitación": "room",
    "llave": "key",
    "mesa": "table",
    "silla": "chair",

    // Restaurant
    "menú": "menu",
    "cuenta": "bill",
    "camarero": "waiter",
    "quiero": "I want",
    "gustaría": "would like",

    // Transport
    "autobús": "bus",
    "tren": "train",
    "boleto": "ticket",
    "estación": "station",
    "aeropuerto": "airport",

    // Shopping
    "cuánto": "how much",
    "cuesta": "costs",
    "barato": "cheap",
    "caro": "expensive",
    "abierto": "open",
    "cerrado": "closed",

    // Emergency
    "ayuda": "help",
    "doctor": "doctor",
    "policía": "police",
    "estoy": "I am",
    "perdido": "lost",

    // A1 Verbs & actions
    "cómo": "how",
    "estás": "are you",
    "hoy": "today",
    "dónde": "where",
    "vives": "you live",
    "vivo": "I live",
    "vive": "he/she lives",
    "vivimos": "we live",
    "viven": "they live",
    "trabajas": "you work",
    "trabajo": "I work",
    "trabaja": "he/she works",
    "estudias": "you study",
    "llamas": "you are called",
    "de": "from",
    "eres": "you are",
    "tienes": "you have",
    "hermanos": "brothers",
    "hermanas": "sisters",
    "hora": "time",
    "levantas": "you get up",
    "te": "you",
    "gusta": "like",
    "gustan": "like (plural)",
    "música": "music",
    "televisión": "television",
    "lees": "you read",
    "leo": "I read",
    "libros": "books",
    "solo": "only",
    "nunca": "never",
    "mañana": "tomorrow",
    "rápido": "fast",
    "lento": "slow",
    "ciudad": "city",
    "parada": "stop",


    /* ============================================================
       A2 — Elementary Vocabulary
       ============================================================ */

    // Daily life & routines
    "me": "me",
    "necesito": "I need",
    "qué": "what",
    "ayer": "yesterday",
    "pasado": "last",
    "semana": "week",
    "fin": "end",
    "próximo": "next",
    "todavía": "still",
    "ya": "already",
    "antes": "before",

    // Meals
    "desayuno": "breakfast",
    "almuerzo": "lunch",
    "cena": "dinner",

    // Shopping & places
    "centro": "center",
    "farmacia": "pharmacy",
    "supermercado": "supermarket",
    "tienda": "store",

    // Travel
    "avión": "plane",
    "visitar": "to visit",

    // Actions & verbs
    "hiciste": "you did",
    "fuiste": "you went",
    "haciendo": "doing",
    "sueles": "you usually",
    "comer": "to eat",
    "como": "I eat",
    "comes": "you eat",
    "terminaste": "you finished",
    "compraste": "you bought",
    "viajas": "you travel",
    "menudo": "often",
    "celebraste": "you celebrated",
    "recientemente": "recently",
    "ves": "you watch",
    "ver": "to watch",
    "usas": "you use",
    "transporte": "transport",

    // Family
    "familia": "family",

    // Missing A2 phrases
    "a menudo": "often",
    "pasado mañana": "day after tomorrow",


    /* ============================================================
       B1 — Intermediate Vocabulary
       ============================================================ */

    // Experiences & learning
    "he": "I have",
    "estado": "been",
    "aprendiendo": "learning",
    "español": "Spanish",
    "experiencias": "experiences",
    "pasadas": "past",

    // Opinions & descriptions
    "interesante": "interesting",
    "último": "last",

    // Life & routines
    "tiempo": "time",
    "libre": "free",
    "diarias": "daily",

    // Communication
    "comunicación": "communication",
    "conversaciones": "conversations",

    // Work & skills
    "desarrollador": "developer",
    "mejorar": "to improve",
    "habilidades": "skills",

    // Social
    "redes": "networks",
    "sociales": "social",

    // Missing B1 connectors
    "mientras": "while",
    "sin embargo": "however",


    /* ============================================================
       B2 — Upper‑Intermediate Vocabulary
       ============================================================ */

    // Abstract concepts
    "opinión": "opinion",
    "tecnología": "technology",
    "educación": "education",
    "cultura": "culture",
    "sociedad": "society",
    "importantes": "important",

    // Life & change
    "vida": "life",
    "cambiado": "changed",
    "años": "years",
    "cambios": "changes",
    "saludable": "healthy",

    // Challenges & goals
    "desafíos": "challenges",
    "enfrentas": "you face",
    "motivación": "motivation",
    "lograr": "to achieve",
    "esperas": "you expect",

    // Advanced connectors
    "además": "in addition",
    "por lo tanto": "therefore",
    "a pesar de": "despite",

    // Other
    "remoto": "remote",
    "futuro": "future",
    "vivir": "to live",
    "largo": "long",
    "plazo": "term",


    /* ============================================================
       Disruptors / Connectors (All Levels)
       ============================================================ */

    "siempre": "always",
    "aunque": "although",
    "cuando": "when",
    "donde": "where"
};



    /* ============================================================
       FALLBACK — Word-by-word translation
       ============================================================ */
    return normalized
        .split(/\s+/)
        .map(w => WORD_DICT[w] || `[${w}]`)
        .join(" ");
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
   CEFR SENTENCE BANKS — A1 → B2 (Expanded)
   ============================================================ */

const CEFR_SENTENCES = {

    /* ============================================================
       A1 — Beginner (40 Sentences)
       ============================================================ */
    A1: [

        // Greetings & Basics
        { english: "Hello, how are you?", spanish: "hola cómo estás" },
        { english: "Goodbye, see you tomorrow.", spanish: "adiós hasta mañana" },
        { english: "Excuse me, where is the bathroom?", spanish: "perdón dónde está el baño" },
        { english: "Sorry, I am late.", spanish: "lo siento estoy tarde" },
        { english: "Yes, I am okay.", spanish: "sí estoy bien" },

        // Personal Info
        { english: "I live in the city.", spanish: "vivo en la ciudad" },
        { english: "She lives in a hotel.", spanish: "ella vive en un hotel" },
        { english: "We are brothers.", spanish: "nosotros somos hermanos" },
        { english: "He is my friend.", spanish: "él es mi amigo" },
        { english: "You are my sister.", spanish: "tú eres mi hermana" },

        // Food & Drink
        { english: "I want water.", spanish: "quiero agua" },
        { english: "I like soup.", spanish: "me gusta la sopa" },
        { english: "He eats bread.", spanish: "él come pan" },
        { english: "We drink coffee.", spanish: "nosotros bebemos café" },
        { english: "She likes fruit.", spanish: "ella gusta fruta" },

        // Daily Life
        { english: "You work in a store.", spanish: "tú trabajas en una tienda" },
        { english: "I read books.", spanish: "yo leo libros" },
        { english: "We watch television.", spanish: "nosotros vemos televisión" },
        { english: "He studies every day.", spanish: "él estudia cada día" },
        { english: "She gets up early.", spanish: "ella se levanta temprano" },

        // Travel & Places
        { english: "Where is the bus stop?", spanish: "dónde está la parada de autobús" },
        { english: "The airport is open.", spanish: "el aeropuerto está abierto" },
        { english: "The hotel is closed.", spanish: "el hotel está cerrado" },
        { english: "The room has a table.", spanish: "la habitación tiene una mesa" },
        { english: "The key is on the chair.", spanish: "la llave está en la silla" },

        // Shopping
        { english: "How much does the menu cost?", spanish: "cuánto cuesta el menú" },
        { english: "The store is closed.", spanish: "la tienda está cerrada" },
        { english: "The supermarket is open.", spanish: "el supermercado está abierto" },
        { english: "I want cheap fruit.", spanish: "quiero fruta barata" },
        { english: "The bill is expensive.", spanish: "la cuenta es cara" },

        // Restaurant
        { english: "I would like chicken.", spanish: "me gustaría pollo" },
        { english: "The waiter has the bill.", spanish: "el camarero tiene la cuenta" },
        { english: "I want a table.", spanish: "quiero una mesa" },
        { english: "She wants soup.", spanish: "ella quiere sopa" },
        { english: "We want bread.", spanish: "nosotros queremos pan" },

        // Emergency
        { english: "I need help.", spanish: "necesito ayuda" },
        { english: "Call the police.", spanish: "llama a la policía" },
        { english: "I am lost.", spanish: "estoy perdido" },
        { english: "I need a doctor.", spanish: "necesito un doctor" },
        { english: "He is not okay.", spanish: "él no está bien" }
    ],

    /* ============================================================
       A2 — Elementary (40 Sentences)
       ============================================================ */
    A2: [

        // Daily Life & Routines
        { english: "I usually eat early.", spanish: "yo suelo comer temprano" },
        { english: "What did you do yesterday?", spanish: "qué hiciste ayer" },
        { english: "We finished the breakfast.", spanish: "nosotros terminamos el desayuno" },
        { english: "She woke up late.", spanish: "ella se levantó tarde" },
        { english: "He works every morning.", spanish: "él trabaja cada mañana" },

        // Shopping & Places
        { english: "She bought fruit at the supermarket.", spanish: "ella compró fruta en el supermercado" },
        { english: "The pharmacy is in the center.", spanish: "la farmacia está en el centro" },
        { english: "I need something cheap.", spanish: "necesito algo barato" },
        { english: "The store opens tomorrow.", spanish: "la tienda abre mañana" },
        { english: "He bought bread and cheese.", spanish: "él compró pan y queso" },

        // Travel
        { english: "We travel often.", spanish: "nosotros viajamos a menudo" },
        { english: "Did you go to the airport?", spanish: "fuiste al aeropuerto" },
        { english: "The plane arrives early.", spanish: "el avión llega temprano" },
        { english: "She visits her family often.", spanish: "ella visita su familia a menudo" },
        { english: "We went last week.", spanish: "nosotros fuimos la semana pasada" },

        // Food & Meals
        { english: "I eat rice with chicken.", spanish: "yo como arroz con pollo" },
        { english: "He likes dinner with family.", spanish: "él gusta la cena con familia" },
        { english: "She finished the lunch.", spanish: "ella terminó el almuerzo" },
        { english: "We bought fruit recently.", spanish: "nosotros compramos fruta recientemente" },
        { english: "He eats soup often.", spanish: "él come sopa a menudo" },

        // Actions & Verbs
        { english: "She is doing homework.", spanish: "ella está haciendo tarea" },
        { english: "You use the transport.", spanish: "tú usas el transporte" },
        { english: "He watches movies often.", spanish: "él ve películas a menudo" },
        { english: "We celebrated last week.", spanish: "nosotros celebramos la semana pasada" },
        { english: "I visited yesterday.", spanish: "yo visité ayer" },

        // Family
        { english: "My family lives near the station.", spanish: "mi familia vive cerca de la estación" },
        { english: "We visited our family.", spanish: "nosotros visitamos nuestra familia" },
        { english: "She bought dinner for her family.", spanish: "ella compró cena para su familia" },
        { english: "He celebrated with his family.", spanish: "él celebró con su familia" },
        { english: "They live far from the center.", spanish: "ellos viven lejos del centro" },

        // Extra A2
        { english: "I need a reservation.", spanish: "necesito una reserva" },
        { english: "She bought cheese and bread.", spanish: "ella compró queso y pan" },
        { english: "We use transport every day.", spanish: "nosotros usamos transporte cada día" },
        { english: "He finished the work early.", spanish: "él terminó el trabajo temprano" },
        { english: "I will visit tomorrow.", spanish: "yo voy a visitar mañana" }
    ],

    /* ============================================================
       B1 — Intermediate (40 Sentences)
       ============================================================ */
    B1: [

        // Opinions
        { english: "I think the city is interesting.", spanish: "creo que la ciudad es interesante" },
        { english: "She enjoys traveling with friends.", spanish: "ella disfruta viajar con amigos" },
        { english: "He believes the idea is good.", spanish: "él cree que la idea es buena" },
        { english: "We think the plan is important.", spanish: "nosotros creemos que el plan es importante" },
        { english: "I like the communication here.", spanish: "me gusta la comunicación aquí" },

        // Experiences
        { english: "I have been learning Spanish.", spanish: "he estado aprendiendo español" },
        { english: "What did you learn recently?", spanish: "qué aprendiste recientemente" },
        { english: "She remembers past experiences.", spanish: "ella recuerda experiencias pasadas" },
        { english: "We talked about our past.", spanish: "nosotros hablamos sobre nuestro pasado" },
        { english: "He learned something new.", spanish: "él aprendió algo nuevo" },

        // Daily Life & Habits
        { english: "We have daily conversations.", spanish: "nosotros tenemos conversaciones diarias" },
        { english: "He wants to improve his skills.", spanish: "él quiere mejorar sus habilidades" },
        { english: "She studies every afternoon.", spanish: "ella estudia cada tarde" },
        { english: "I enjoy free time on weekends.", spanish: "yo disfruto tiempo libre los fines de semana" },
        { english: "They work while they study.", spanish: "ellos trabajan mientras estudian" },

        // Work & Study
        { english: "She is a developer.", spanish: "ella es desarrollador" },
        { english: "I need time to study.", spanish: "necesito tiempo para estudiar" },
        { english: "He works in the center.", spanish: "él trabaja en el centro" },
        { english: "We plan future projects.", spanish: "nosotros planeamos proyectos futuros" },
        { english: "She improves her communication.", spanish: "ella mejora su comunicación" },

        // Social & Communication
        { english: "I use social networks often.", spanish: "yo uso redes sociales a menudo" },
        { english: "Communication is important.", spanish: "la comunicación es importante" },
        { english: "He talks with his friends daily.", spanish: "él habla con sus amigos diariamente" },
        { english: "We share ideas online.", spanish: "nosotros compartimos ideas en línea" },
        { english: "She reads news every morning.", spanish: "ella lee noticias cada mañana" },

        // Travel & Life
        { english: "We plan future trips.", spanish: "nosotros planeamos viajes futuros" },
        { english: "He remembers past experiences.", spanish: "él recuerda experiencias pasadas" },
        { english: "She enjoys traveling alone.", spanish: "ella disfruta viajar sola" },
        { english: "I want to travel more.", spanish: "yo quiero viajar más" },
        { english: "They visit new places often.", spanish: "ellos visitan lugares nuevos a menudo" },

        // Extra B1
        { english: "We talk about daily problems.", spanish: "nosotros hablamos sobre problemas diarios" },
        { english: "He reads books every day.", spanish: "él lee libros cada día" },
        { english: "She studies while she works.", spanish: "ella estudia mientras trabaja" },
        { english: "I enjoy learning languages.", spanish: "yo disfruto aprender idiomas" },
        { english: "They plan important changes.", spanish: "ellos planean cambios importantes" }
    ],

    /* ============================================================
       B2 — Upper Intermediate (40 Sentences)
       ============================================================ */
    B2: [

        // Abstract Ideas
        { english: "What is your opinion about technology?", spanish: "cuál es tu opinión sobre la tecnología" },
        { english: "Society is changing quickly.", spanish: "la sociedad está cambiando rápido" },
        { english: "Education is important for the future.", spanish: "la educación es importante para el futuro" },
        { english: "Culture changes over time.", spanish: "la cultura cambia con el tiempo" },
        { english: "Technology affects daily life.", spanish: "la tecnología afecta la vida diaria" },

        // Challenges & Goals
        { english: "What challenges do you face?", spanish: "qué desafíos enfrentas" },
        { english: "She hopes to achieve her goals.", spanish: "ella espera lograr sus metas" },
        { english: "He works hard to achieve success.", spanish: "él trabaja duro para lograr éxito" },
        { english: "We face important challenges.", spanish: "nosotros enfrentamos desafíos importantes" },
        { english: "They expect positive results.", spanish: "ellos esperan resultados positivos" },

        // Life & Change
        { english: "My life has changed in recent years.", spanish: "mi vida ha cambiado en los últimos años" },
        { english: "He wants a healthy lifestyle.", spanish: "él quiere un estilo de vida saludable" },
        { english: "We analyze cultural changes.", spanish: "nosotros analizamos cambios culturales" },
        { english: "She studies for a long-term goal.", spanish: "ella estudia para un objetivo a largo plazo" },
        { english: "They see the future as positive.", spanish: "ellos ven el futuro como positivo" },

        // Reasoning & Explanation
        { english: "We continue despite the problems.", spanish: "nosotros continuamos a pesar de los problemas" },
        { english: "He explained the concept clearly.", spanish: "él explicó el concepto claramente" },
        { english: "She works a lot; therefore, she is tired.", spanish: "ella trabaja mucho por lo tanto está cansada" },
        { english: "I like the idea; however, it is difficult.", spanish: "me gusta la idea sin embargo es difícil" },
        { english: "They study because it is important.", spanish: "ellos estudian porque es importante" },

        // Advanced Connectors
        { english: "He works hard; however, he needs rest.", spanish: "él trabaja duro sin embargo necesita descanso" },
        { english: "We continue; therefore, we improve.", spanish: "nosotros continuamos por lo tanto mejoramos" },
        { english: "She studies a lot; in addition, she works.", spanish: "ella estudia mucho además trabaja" },
        { english: "He learns despite the difficulty.", spanish: "él aprende a pesar de la dificultad" },
        { english: "They continue despite the problems.", spanish: "ellos continúan a pesar de los problemas" },

        // Extra B2
        { english: "I handle stressful situations well.", spanish: "yo manejo situaciones estresantes bien" },
        { english: "She analyzes important information.", spanish: "ella analiza información importante" },
        { english: "We discuss cultural ideas.", spanish: "nosotros discutimos ideas culturales" },
        { english: "He studies for future opportunities.", spanish: "él estudia para oportunidades futuras" },
        { english: "They work on long-term projects.", spanish: "ellos trabajan en proyectos a largo plazo" }
    ]
};

/* ============================================================
   CEFR CONVERSATION BANKS — A1 → B2 (Expanded)
   ============================================================ */

const CEFR_CONVERSATIONS = {

    /* ============================================================
       A1 — Beginner (40 Prompts)
       ============================================================ */
    A1: [
        "¿Cómo estás?",
        "¿Dónde vives?",
        "¿Qué te gusta comer?",
        "¿Trabajas o estudias?",
        "¿Qué hora es?",
        "¿Dónde está el baño?",
        "¿Quieres agua o café?",
        "¿Te gusta la sopa?",
        "¿Lees libros?",
        "¿Miras televisión?",
        "¿Dónde está la parada de autobús?",
        "¿Está abierto el supermercado?",
        "¿Cuánto cuesta el menú?",
        "¿Quieres pan o arroz?",
        "¿Te gusta la fruta?",
        "¿Dónde está tu habitación?",
        "¿Tienes hermanos?",
        "¿Te gusta la música?",
        "¿Quieres una mesa?",
        "¿Dónde está el camarero?",
        "¿Quieres pollo o pescado?",
        "¿Estás perdido?",
        "¿Necesitas ayuda?",
        "¿Dónde está la policía?",
        "¿Quieres ir al hotel?",
        "¿Te gusta la ciudad?",
        "¿Comes rápido o lento?",
        "¿Quieres una llave?",
        "¿Dónde está la silla?",
        "¿Quieres ensalada?",
        "¿Te gusta el té?",
        "¿Quieres leche?",
        "¿Dónde está el aeropuerto?",
        "¿Quieres un boleto?",
        "¿Está cerrado el restaurante?",
        "¿Quieres hablar mañana?",
        "¿Te levantas temprano?",
        "¿Quieres caminar?",
        "¿Dónde está tu familia?"
    ],

    /* ============================================================
       A2 — Elementary (40 Prompts)
       ============================================================ */
    A2: [
        "¿Qué hiciste ayer?",
        "¿Fuiste al supermercado?",
        "¿Viajas a menudo?",
        "¿Qué compraste la semana pasada?",
        "¿Qué estás haciendo hoy?",
        "¿Sueles comer temprano?",
        "¿Necesitas una reserva?",
        "¿Dónde está la farmacia?",
        "¿Compraste fruta?",
        "¿Te gusta el desayuno?",
        "¿Vas al centro?",
        "¿Usas el transporte?",
        "¿Celebraste el fin de semana?",
        "¿Visitas a tu familia?",
        "¿Comes arroz o pollo?",
        "¿Ves películas a menudo?",
        "¿Terminaste el trabajo?",
        "¿Compraste pan y queso?",
        "¿Fuiste al aeropuerto?",
        "¿El avión llega temprano?",
        "¿Qué hiciste recientemente?",
        "¿Comes cena con tu familia?",
        "¿A menudo visitas el centro?",
        "¿Compraste algo barato?",
        "¿Está abierta la tienda?",
        "¿Qué vas a hacer mañana?",
        "¿Viajaste la semana pasada?",
        "¿Comes en casa o fuera?",
        "¿Usas redes sociales?",
        "¿Qué celebraste?",
        "¿Compraste almuerzo?",
        "¿Qué vas a visitar mañana?",
        "¿Te gusta el almuerzo?",
        "¿Comes sopa a menudo?",
        "¿Qué compraste hoy?",
        "¿Vives cerca de la estación?",
        "¿Qué haces por la mañana?",
        "¿Qué haces por la tarde?",
        "¿Qué haces por la noche?",
        "¿Qué haces los fines de semana?"
    ],

    /* ============================================================
       B1 — Intermediate (40 Prompts)
       ============================================================ */
    B1: [
        "¿Qué piensas de tu ciudad?",
        "¿Qué aprendiste recientemente?",
        "¿Cómo mantienes una vida saludable?",
        "¿Qué experiencias pasadas recuerdas?",
        "¿Cuáles son tus metas?",
        "¿Disfrutas viajar?",
        "¿Qué planes futuros tienes?",
        "¿Qué habilidades quieres mejorar?",
        "¿Qué comunicación es importante para ti?",
        "¿Qué haces en tu tiempo libre?",
        "¿Qué proyectos futuros tienes?",
        "¿Qué problemas diarios tienes?",
        "¿Qué libros lees?",
        "¿Qué conversaciones tienes cada día?",
        "¿Qué redes sociales usas?",
        "¿Qué te parece interesante?",
        "¿Qué aprendiste el último mes?",
        "¿Qué haces mientras trabajas?",
        "¿Qué haces mientras estudias?",
        "¿Qué te gusta aprender?",
        "¿Qué lugares visitas a menudo?",
        "¿Qué recuerdas de tu pasado?",
        "¿Qué te gusta de tu trabajo?",
        "¿Qué te gusta de tu familia?",
        "¿Qué te gusta de tu vida diaria?",
        "¿Qué haces los fines de semana?",
        "¿Qué haces por la mañana?",
        "¿Qué haces por la tarde?",
        "¿Qué haces por la noche?",
        "¿Qué te gusta ver?",
        "¿Qué te gusta comer?",
        "¿Qué te gusta estudiar?",
        "¿Qué te gusta comprar?",
        "¿Qué te gusta visitar?",
        "¿Qué te gusta hacer con amigos?",
        "¿Qué te gusta hacer solo?",
        "¿Qué te gusta hacer en vacaciones?",
        "¿Qué te gusta hacer en casa?",
        "¿Qué te gusta hacer fuera de casa?",
        "¿Qué te gusta hacer en la ciudad?"
    ],

    /* ============================================================
       B2 — Upper Intermediate (40 Prompts)
       ============================================================ */
    B2: [
        "¿Cómo manejas situaciones estresantes?",
        "¿Cuál es tu opinión sobre la tecnología?",
        "¿Cómo ha cambiado tu vida en los últimos años?",
        "¿Qué desafíos enfrentas actualmente?",
        "¿Qué piensas del futuro?",
        "¿Qué cambios culturales ves?",
        "¿Qué estilo de vida quieres?",
        "¿Qué motivación tienes para estudiar?",
        "¿Qué metas a largo plazo tienes?",
        "¿Qué ideas importantes tienes?",
        "¿Qué piensas de la educación?",
        "¿Qué piensas de la sociedad?",
        "¿Qué piensas de la cultura?",
        "¿Qué piensas de la tecnología?",
        "¿Qué piensas del trabajo remoto?",
        "¿Qué piensas de los cambios recientes?",
        "¿Qué piensas de la vida saludable?",
        "¿Qué piensas de los proyectos largos?",
        "¿Qué piensas de los desafíos personales?",
        "¿Qué piensas de los desafíos profesionales?",
        "¿Qué piensas de los desafíos sociales?",
        "¿Qué piensas de los desafíos culturales?",
        "¿Qué piensas de los desafíos tecnológicos?",
        "¿Qué piensas de los desafíos educativos?",
        "¿Qué piensas de los desafíos familiares?",
        "¿Qué piensas de los desafíos económicos?",
        "¿Qué piensas de los desafíos globales?",
        "¿Qué piensas de los desafíos futuros?",
        "¿Qué piensas de los cambios futuros?",
        "¿Qué piensas de los cambios personales?",
        "¿Qué piensas de los cambios profesionales?",
        "¿Qué piensas de los cambios sociales?",
        "¿Qué piensas de los cambios culturales?",
        "¿Qué piensas de los cambios tecnológicos?",
        "¿Qué piensas de los cambios educativos?",
        "¿Qué piensas de los cambios familiares?",
        "¿Qué piensas de los cambios económicos?",
        "¿Qué piensas de los cambios globales?",
        "¿Qué piensas de los cambios a largo plazo?"
    ]
};

/* ============================================================
   CEFR LISTENING BANKS — A1 → B2 (Expanded)
   ============================================================ */

const CEFR_LISTENING = {

    /* ============================================================
       A1 — Beginner (40 Listening Items)
       ============================================================ */
    A1: [
        { spanish: "hola cómo estás", english: "hello, how are you", audio: "hola-como-estas.mp3", question: "How is the speaker greeting?" },
        { spanish: "adiós hasta mañana", english: "goodbye, see you tomorrow", audio: "adios-hasta-manana.mp3", question: "When will they see each other?" },
        { spanish: "dónde está el baño", english: "where is the bathroom", audio: "donde-esta-el-bano.mp3", question: "What place is the speaker looking for?" },
        { spanish: "lo siento estoy perdido", english: "sorry, I am lost", audio: "lo-siento-estoy-perdido.mp3", question: "What problem does the speaker have?" },
        { spanish: "sí estoy bien", english: "yes, I am okay", audio: "si-estoy-bien.mp3", question: "How does the speaker feel?" },

        { spanish: "vivo en la ciudad", english: "I live in the city", audio: "vivo-en-la-ciudad.mp3", question: "Where does the speaker live?" },
        { spanish: "ella vive en un hotel", english: "she lives in a hotel", audio: "ella-vive-en-un-hotel.mp3", question: "Where does she live?" },
        { spanish: "nosotros somos hermanos", english: "we are brothers", audio: "nosotros-somos-hermanos.mp3", question: "What is their relationship?" },
        { spanish: "él es mi amigo", english: "he is my friend", audio: "el-es-mi-amigo.mp3", question: "Who is he?" },
        { spanish: "tú eres mi hermana", english: "you are my sister", audio: "tu-eres-mi-hermana.mp3", question: "Who is the listener?" },

        { spanish: "quiero agua", english: "I want water", audio: "quiero-agua.mp3", question: "What does the speaker want?" },
        { spanish: "me gusta la sopa", english: "I like soup", audio: "me-gusta-la-sopa.mp3", question: "What food does the speaker like?" },
        { spanish: "él come pan", english: "he eats bread", audio: "el-come-pan.mp3", question: "What does he eat?" },
        { spanish: "nosotros bebemos café", english: "we drink coffee", audio: "nosotros-bebemos-cafe.mp3", question: "What do they drink?" },
        { spanish: "ella gusta fruta", english: "she likes fruit", audio: "ella-gusta-fruta.mp3", question: "What does she like?" },

        { spanish: "tú trabajas en una tienda", english: "you work in a store", audio: "tu-trabajas-en-una-tienda.mp3", question: "Where does the listener work?" },
        { spanish: "yo leo libros", english: "I read books", audio: "yo-leo-libros.mp3", question: "What does the speaker read?" },
        { spanish: "nosotros vemos televisión", english: "we watch television", audio: "nosotros-vemos-television.mp3", question: "What do they watch?" },
        { spanish: "él estudia cada día", english: "he studies every day", audio: "el-estudia-cada-dia.mp3", question: "How often does he study?" },
        { spanish: "ella se levanta temprano", english: "she gets up early", audio: "ella-se-levanta-temprano.mp3", question: "When does she get up?" },

        { spanish: "dónde está la parada de autobús", english: "where is the bus stop", audio: "donde-esta-la-parada-de-autobus.mp3", question: "What place is the speaker looking for?" },
        { spanish: "el aeropuerto está abierto", english: "the airport is open", audio: "el-aeropuerto-esta-abierto.mp3", question: "Is the airport open or closed?" },
        { spanish: "el hotel está cerrado", english: "the hotel is closed", audio: "el-hotel-esta-cerrado.mp3", question: "Is the hotel open?" },
        { spanish: "la habitación tiene una mesa", english: "the room has a table", audio: "la-habitacion-tiene-una-mesa.mp3", question: "What does the room have?" },
        { spanish: "la llave está en la silla", english: "the key is on the chair", audio: "la-llave-esta-en-la-silla.mp3", question: "Where is the key?" },

        { spanish: "cuánto cuesta el menú", english: "how much does the menu cost", audio: "cuanto-cuesta-el-menu.mp3", question: "What is the speaker asking about?" },
        { spanish: "la tienda está cerrada", english: "the store is closed", audio: "la-tienda-esta-cerrada.mp3", question: "Is the store open?" },
        { spanish: "el supermercado está abierto", english: "the supermarket is open", audio: "el-supermercado-esta-abierto.mp3", question: "Is the supermarket open?" },
        { spanish: "quiero fruta barata", english: "I want cheap fruit", audio: "quiero-fruta-barata.mp3", question: "What does the speaker want?" },
        { spanish: "la cuenta es cara", english: "the bill is expensive", audio: "la-cuenta-es-cara.mp3", question: "Is the bill cheap or expensive?" },

        { spanish: "me gustaría pollo", english: "I would like chicken", audio: "me-gustaria-pollo.mp3", question: "What food does the speaker want?" },
        { spanish: "el camarero tiene la cuenta", english: "the waiter has the bill", audio: "el-camarero-tiene-la-cuenta.mp3", question: "Who has the bill?" },
        { spanish: "quiero una mesa", english: "I want a table", audio: "quiero-una-mesa.mp3", question: "What does the speaker want?" },
        { spanish: "ella quiere sopa", english: "she wants soup", audio: "ella-quiere-sopa.mp3", question: "What does she want?" },
        { spanish: "nosotros queremos pan", english: "we want bread", audio: "nosotros-queremos-pan.mp3", question: "What do they want?" },

        { spanish: "necesito ayuda", english: "I need help", audio: "necesito-ayuda.mp3", question: "What does the speaker need?" },
        { spanish: "llama a la policía", english: "call the police", audio: "llama-a-la-policia.mp3", question: "Who should be called?" },
        { spanish: "estoy perdido", english: "I am lost", audio: "estoy-perdido.mp3", question: "What is the speaker’s problem?" },
        { spanish: "necesito un doctor", english: "I need a doctor", audio: "necesito-un-doctor.mp3", question: "Who does the speaker need?" },
        { spanish: "él no está bien", english: "he is not okay", audio: "el-no-esta-bien.mp3", question: "How does he feel?" }
    ],

    /* ============================================================
       A2 — Elementary (40 Listening Items)
       ============================================================ */
    A2: [
        { spanish: "qué hiciste ayer", english: "what did you do yesterday", audio: "que-hiciste-ayer.mp3", question: "When did the action happen?" },
        { spanish: "fuiste al supermercado", english: "did you go to the supermarket", audio: "fuiste-al-supermercado.mp3", question: "Where might the listener have gone?" },
        { spanish: "viajamos a menudo", english: "we travel often", audio: "viajamos-a-menudo.mp3", question: "How often do they travel?" },
        { spanish: "qué compraste la semana pasada", english: "what did you buy last week", audio: "que-compraste-la-semana-pasada.mp3", question: "When did the listener buy something?" },
        { spanish: "qué estás haciendo hoy", english: "what are you doing today", audio: "que-estas-haciendo-hoy.mp3", question: "When is the action happening?" },

        { spanish: "suelo comer temprano", english: "I usually eat early", audio: "suelo-comer-temprano.mp3", question: "When does the speaker usually eat?" },
        { spanish: "necesito una reserva", english: "I need a reservation", audio: "necesito-una-reserva.mp3", question: "What does the speaker need?" },
        { spanish: "la farmacia está en el centro", english: "the pharmacy is in the center", audio: "la-farmacia-esta-en-el-centro.mp3", question: "Where is the pharmacy?" },
        { spanish: "compré fruta en el supermercado", english: "I bought fruit at the supermarket", audio: "compre-fruta-en-el-supermercado.mp3", question: "What did the speaker buy?" },
        { spanish: "te gusta el desayuno", english: "you like breakfast", audio: "te-gusta-el-desayuno.mp3", question: "What meal is being discussed?" },

        { spanish: "usas el transporte", english: "you use transport", audio: "usas-el-transporte.mp3", question: "What does the listener use?" },
        { spanish: "celebramos el fin de semana", english: "we celebrated the weekend", audio: "celebramos-el-fin-de-semana.mp3", question: "When did they celebrate?" },
        { spanish: "visitas a tu familia", english: "you visit your family", audio: "visitas-a-tu-familia.mp3", question: "Who does the listener visit?" },
        { spanish: "comes arroz con pollo", english: "you eat rice with chicken", audio: "comes-arroz-con-pollo.mp3", question: "What does the listener eat?" },
        { spanish: "ves películas a menudo", english: "you watch movies often", audio: "ves-peliculas-a-menudo.mp3", question: "How often does the listener watch movies?" },

        { spanish: "terminaste el trabajo", english: "you finished the work", audio: "terminaste-el-trabajo.mp3", question: "What did the listener finish?" },
        { spanish: "compraste pan y queso", english: "you bought bread and cheese", audio: "compraste-pan-y-queso.mp3", question: "What did the listener buy?" },
        { spanish: "fuiste al aeropuerto", english: "you went to the airport", audio: "fuiste-al-aeropuerto.mp3", question: "Where did the listener go?" },
        { spanish: "el avión llega temprano", english: "the plane arrives early", audio: "el-avion-llega-temprano.mp3", question: "When does the plane arrive?" },
        { spanish: "qué hiciste recientemente", english: "what did you do recently", audio: "que-hiciste-recientemente.mp3", question: "When did the action happen?" },

        { spanish: "comes cena con tu familia", english: "you eat dinner with your family", audio: "comes-cena-con-tu-familia.mp3", question: "Who does the listener eat with?" },
        { spanish: "visitas el centro a menudo", english: "you visit the center often", audio: "visitas-el-centro-a-menudo.mp3", question: "How often does the listener visit the center?" },
        { spanish: "compraste algo barato", english: "you bought something cheap", audio: "compraste-algo-barato.mp3", question: "What kind of item did the listener buy?" },
        { spanish: "la tienda abre mañana", english: "the store opens tomorrow", audio: "la-tienda-abre-manana.mp3", question: "When does the store open?" },
        { spanish: "qué vas a hacer mañana", english: "what are you going to do tomorrow", audio: "que-vas-a-hacer-manana.mp3", question: "When will the action happen?" },

        { spanish: "viajaste la semana pasada", english: "you traveled last week", audio: "viajaste-la-semana-pasada.mp3", question: "When did the listener travel?" },
        { spanish: "comes en casa o fuera", english: "do you eat at home or outside", audio: "comes-en-casa-o-fuera.mp3", question: "Where might the listener eat?" },
        { spanish: "usas redes sociales", english: "you use social networks", audio: "usas-redes-sociales.mp3", question: "What does the listener use?" },
        { spanish: "celebraste con tu familia", english: "you celebrated with your family", audio: "celebraste-con-tu-familia.mp3", question: "Who did the listener celebrate with?" },
        { spanish: "compraste almuerzo", english: "you bought lunch", audio: "compraste-almuerzo.mp3", question: "What meal did the listener buy?" },

        { spanish: "vas a visitar mañana", english: "you will visit tomorrow", audio: "vas-a-visitar-manana.mp3", question: "When will the visit happen?" },
        { spanish: "te gusta el almuerzo", english: "you like lunch", audio: "te-gusta-el-almuerzo.mp3", question: "What meal is being discussed?" },
        { spanish: "comes sopa a menudo", english: "you eat soup often", audio: "comes-sopa-a-menudo.mp3", question: "How often does the listener eat soup?" },
        { spanish: "qué compraste hoy", english: "what did you buy today", audio: "que-compraste-hoy.mp3", question: "When did the listener buy something?" },
        { spanish: "vives cerca de la estación", english: "you live near the station", audio: "vives-cerca-de-la-estacion.mp3", question: "Where does the listener live?" }
    ],

    /* ============================================================
       B1 — Intermediate (40 Listening Items)
       ============================================================ */
    B1: [
        { spanish: "creo que la ciudad es interesante", english: "I think the city is interesting", audio: "creo-que-la-ciudad-es-interesante.mp3", question: "What does the speaker think about the city?" },
        { spanish: "ella disfruta viajar con amigos", english: "she enjoys traveling with friends", audio: "ella-disfruta-viajar-con-amigos.mp3", question: "Who does she travel with?" },
        { spanish: "él cree que la idea es buena", english: "he believes the idea is good", audio: "el-cree-que-la-idea-es-buena.mp3", question: "What does he think about the idea?" },
        { spanish: "nosotros creemos que el plan es importante", english: "we think the plan is important", audio: "nosotros-creemos-que-el-plan-es-importante.mp3", question: "What do they think about the plan?" },
        { spanish: "me gusta la comunicación aquí", english: "I like the communication here", audio: "me-gusta-la-comunicacion-aqui.mp3", question: "What does the speaker like?" },

        { spanish: "he estado aprendiendo español", english: "I have been learning Spanish", audio: "he-estado-aprendiendo-espanol.mp3", question: "What language is the speaker learning?" },
        { spanish: "qué aprendiste recientemente", english: "what did you learn recently", audio: "que-aprendiste-recientemente.mp3", question: "When did the listener learn something?" },
        { spanish: "ella recuerda experiencias pasadas", english: "she remembers past experiences", audio: "ella-recuerda-experiencias-pasadas.mp3", question: "What does she remember?" },
        { spanish: "nosotros hablamos sobre nuestro pasado", english: "we talked about our past", audio: "nosotros-hablamos-sobre-nuestro-pasado.mp3", question: "What did they talk about?" },
        { spanish: "él aprendió algo nuevo", english: "he learned something new", audio: "el-aprendio-algo-nuevo.mp3", question: "What did he learn?" },

        { spanish: "tenemos conversaciones diarias", english: "we have daily conversations", audio: "tenemos-conversaciones-diarias.mp3", question: "How often do they have conversations?" },
        { spanish: "él quiere mejorar sus habilidades", english: "he wants to improve his skills", audio: "el-quiere-mejorar-sus-habilidades.mp3", question: "What does he want to improve?" },
        { spanish: "ella estudia cada tarde", english: "she studies every afternoon", audio: "ella-estudia-cada-tarde.mp3", question: "When does she study?" },
        { spanish: "disfruto tiempo libre los fines de semana", english: "I enjoy free time on weekends", audio: "disfruto-tiempo-libre-los-fines-de-semana.mp3", question: "When does the speaker enjoy free time?" },
        { spanish: "ellos trabajan mientras estudian", english: "they work while they study", audio: "ellos-trabajan-mientras-estudian.mp3", question: "What do they do while studying?" },

/* ============================================================
   B2 — Upper Intermediate (40 Listening Items)
   ============================================================ */

B2: [
    { spanish: "cuál es tu opinión sobre la tecnología", english: "what is your opinion about technology", audio: "cual-es-tu-opinion-sobre-la-tecnologia.mp3", question: "What topic is the speaker asking about?" },
    { spanish: "la sociedad está cambiando rápido", english: "society is changing quickly", audio: "la-sociedad-esta-cambiando-rapido.mp3", question: "What is changing quickly?" },
    { spanish: "la educación es importante para el futuro", english: "education is important for the future", audio: "la-educacion-es-importante-para-el-futuro.mp3", question: "What is important for the future?" },
    { spanish: "la cultura cambia con el tiempo", english: "culture changes over time", audio: "la-cultura-cambia-con-el-tiempo.mp3", question: "What changes over time?" },
    { spanish: "la tecnología afecta la vida diaria", english: "technology affects daily life", audio: "la-tecnologia-afecta-la-vida-diaria.mp3", question: "What does technology affect?" },

    { spanish: "qué desafíos enfrentas", english: "what challenges do you face", audio: "que-desafios-enfrentas.mp3", question: "What is the speaker asking about?" },
    { spanish: "ella espera lograr sus metas", english: "she hopes to achieve her goals", audio: "ella-espera-lograr-sus-metas.mp3", question: "What does she hope to achieve?" },
    { spanish: "él trabaja duro para lograr éxito", english: "he works hard to achieve success", audio: "el-trabaja-duro-para-lograr-exito.mp3", question: "Why does he work hard?" },
    { spanish: "nosotros enfrentamos desafíos importantes", english: "we face important challenges", audio: "nosotros-enfrentamos-desafios-importantes.mp3", question: "What do they face?" },
    { spanish: "ellos esperan resultados positivos", english: "they expect positive results", audio: "ellos-esperan-resultados-positivos.mp3", question: "What kind of results do they expect?" },

    { spanish: "mi vida ha cambiado en los últimos años", english: "my life has changed in recent years", audio: "mi-vida-ha-cambiado-en-los-ultimos-anos.mp3", question: "What has changed?" },
    { spanish: "él quiere un estilo de vida saludable", english: "he wants a healthy lifestyle", audio: "el-quiere-un-estilo-de-vida-saludable.mp3", question: "What kind of lifestyle does he want?" },
    { spanish: "nosotros analizamos cambios culturales", english: "we analyze cultural changes", audio: "nosotros-analizamos-cambios-culturales.mp3", question: "What do they analyze?" },
    { spanish: "ella estudia para un objetivo a largo plazo", english: "she studies for a long-term goal", audio: "ella-estudia-para-un-objetivo-a-largo-plazo.mp3", question: "What kind of goal does she have?" },
    { spanish: "ellos ven el futuro como positivo", english: "they see the future as positive", audio: "ellos-ven-el-futuro-como-positivo.mp3", question: "How do they see the future?" },

    { spanish: "nosotros continuamos a pesar de los problemas", english: "we continue despite the problems", audio: "nosotros-continuamos-a-pesar-de-los-problemas.mp3", question: "What do they continue despite?" },
    { spanish: "él explicó el concepto claramente", english: "he explained the concept clearly", audio: "el-explico-el-concepto-claramente.mp3", question: "What did he explain?" },
    { spanish: "ella trabaja mucho por lo tanto está cansada", english: "she works a lot therefore she is tired", audio: "ella-trabaja-mucho-por-lo-tanto-esta-cansada.mp3", question: "Why is she tired?" },
    { spanish: "me gusta la idea sin embargo es difícil", english: "I like the idea however it is difficult", audio: "me-gusta-la-idea-sin-embargo-es-dificil.mp3", question: "What does the speaker think about the idea?" },
    { spanish: "ellos estudian porque es importante", english: "they study because it is important", audio: "ellos-estudian-porque-es-importante.mp3", question: "Why do they study?" },

    { spanish: "él trabaja duro sin embargo necesita descanso", english: "he works hard however he needs rest", audio: "el-trabaja-duro-sin-embargo-necesita-descanso.mp3", question: "What does he need?" },
    { spanish: "nosotros continuamos por lo tanto mejoramos", english: "we continue therefore we improve", audio: "nosotros-continuamos-por-lo-tanto-mejoramos.mp3", question: "What happens because they continue?" },
    { spanish: "ella estudia mucho además trabaja", english: "she studies a lot in addition she works", audio: "ella-estudia-mucho-ademas-trabaja.mp3", question: "What does she do besides studying?" },
    { spanish: "él aprende a pesar de la dificultad", english: "he learns despite the difficulty", audio: "el-aprende-a-pesar-de-la-dificultad.mp3", question: "What does he learn despite?" },
    { spanish: "ellos continúan a pesar de los problemas", english: "they continue despite the problems", audio: "ellos-continuan-a-pesar-de-los-problemas.mp3", question: "What do they continue despite?" },

    { spanish: "yo manejo situaciones estresantes bien", english: "I handle stressful situations well", audio: "yo-manejo-situaciones-estresantes-bien.mp3", question: "What kind of situations does the speaker handle well?" },
    { spanish: "ella analiza información importante", english: "she analyzes important information", audio: "ella-analiza-informacion-importante.mp3", question: "What does she analyze?" },
    { spanish: "nosotros discutimos ideas culturales", english: "we discuss cultural ideas", audio: "nosotros-discutimos-ideas-culturales.mp3", question: "What kind of ideas do they discuss?" },
    { spanish: "él estudia para oportunidades futuras", english: "he studies for future opportunities", audio: "el-estudia-para-oportunidades-futuras.mp3", question: "What kind of opportunities does he study for?" },
    { spanish: "ellos trabajan en proyectos a largo plazo", english: "they work on long-term projects", audio: "ellos-trabajan-en-proyectos-a-largo-plazo.mp3", question: "What kind of projects do they work on?" },

    { spanish: "la cultura es importante para la sociedad", english: "culture is important for society", audio: "la-cultura-es-importante-para-la-sociedad.mp3", question: "What is important for society?" },
    { spanish: "la tecnología cambia cada año", english: "technology changes every year", audio: "la-tecnologia-cambia-cada-ano.mp3", question: "How often does technology change?" },
    { spanish: "la educación crea oportunidades", english: "education creates opportunities", audio: "la-educacion-crea-oportunidades.mp3", question: "What does education create?" },
    { spanish: "la motivación ayuda a lograr metas", english: "motivation helps achieve goals", audio: "la-motivacion-ayuda-a-lograr-metas.mp3", question: "What does motivation help with?" },
    { spanish: "la sociedad enfrenta desafíos nuevos", english: "society faces new challenges", audio: "la-sociedad-enfrenta-desafios-nuevos.mp3", question: "What does society face?" }
];


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

const CEFR_LEVELS = {
    A1: {
        name: "Beginner",
        description: "Basic everyday expressions, simple questions, personal details.",
        grammar: [
            "Present tense (regular verbs)",
            "Basic ser/estar",
            "Simple questions (qué, dónde, cómo)",
            "Articles (el, la, un, una)",
            "Basic pronouns (yo, tú, él, ella)"
        ]
    },
    A2: {
        name: "Elementary",
        description: "Routine tasks, simple past, frequency, shopping, travel.",
        grammar: [
            "Past-time markers (ayer, pasado)",
            "Common past verbs",
            "Frequency words (a menudo, nunca)",
            "Future with ir + a",
            "Reflexive basics"
        ]
    },
    B1: {
        name: "Intermediate",
        description: "Opinions, experiences, multi‑clause sentences.",
        grammar: [
            "Porque, aunque, cuando",
            "Present perfect (he comido)",
            "Longer sentences with que",
            "Describing experiences"
        ]
    },
    B2: {
        name: "Upper Intermediate",
        description: "Abstract ideas, contrast connectors, complex structures.",
        grammar: [
            "Aunque, sin embargo",
            "Subjunctive triggers (quiero que…)",
            "Purpose (para, para que)",
            "Multi‑clause reasoning"
        ]
    }
};


const STORAGE_KEY = "cefr_trainer_state_v2";

let appState = {
    currentLevel: "A1",
    currentTab: "dashboard",
    speechRate: 1.0,
    studentName: "",
    badges: [],
    levelStats: {
        A1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 },
        A2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 },
        B1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 },
        B2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0, conversationCompleted: 0 }
    }
};

/* ============================================================
   TAB HEADER UPDATER
   ============================================================ */

function updateTabHeader(tabName) {
    const level = appState.currentLevel;
    const header = document.getElementById(`${tabName}-level-header`);
    if (header) header.textContent = `Level ${level}`;
}

/* ============================================================
   SPA TAB REGISTRY
   ============================================================ */

const TAB_RENDERERS = {
    listen: renderListen,
    flash: renderFlashcards,
    quiz: renderQuiz,
    build: renderBuild,
    sentence: renderSentence,
    conversation: renderConversation,
    grammar: renderGrammar
};

/* ============================================================
   SPA TAB CONTROLLER
   ============================================================ */

function activateTab(tabName) {
    appState.currentTab = tabName;

    document.querySelectorAll("#dashboard, #listen, #flash, #quiz, #build, #sentence, #conversation, #grammar")
        .forEach(el => el.style.display = "none");

    const tabEl = document.getElementById(tabName);
    tabEl.style.display = "block";

    updateTabHeader(tabName);

    const renderer = TAB_RENDERERS[tabName];
    if (renderer) renderer();
}

/* ============================================================
   CATEGORY AUTO‑ASSIGNER
   ============================================================ */

function autoAssignCategory(word) {
    const w = word.spanish.toLowerCase();

    if (w.endsWith("ar") || w.endsWith("er") || w.endsWith("ir")) return "verbs";
    if (w.endsWith("o") || w.endsWith("a") || w.endsWith("os") || w.endsWith("as")) return "adjectives";
    if (!isNaN(parseInt(w))) return "numbers";

    if (["manzana","pan","agua","carne","café","té","huevo","cerveza","vino","arroz","pollo","pescado","ensalada","verdura","fruta"].includes(w))
        return "food-drink";

    if (["aeropuerto","hotel","taxi","tren","avión","billete","mapa","ciudad","país","viaje","turista"].includes(w))
        return "travel";

    if (["mañana","tarde","noche","casa","trabajo","escuela","día","semana","mes"].includes(w))
        return "daily-life";

    if (["madre","padre","hermano","hermana","abuelo","abuela","tío","tía","primo","prima","familia"].includes(w))
        return "family";

    if (["dinero","precio","tienda","comprar","vender","mercado","producto"].includes(w))
        return "shopping";

    if (["ayuda","policía","hospital","ambulancia","fuego","emergencia"].includes(w))
        return "emergency";

    if (["trabajo","oficina","jefe","empleado","empresa","reunión"].includes(w))
        return "work";

    if (["casa","escuela","parque","calle","puerta","mesa","silla","coche","habitacion","baño"].includes(w))
        return "places-objects";

    if (["y","pero","porque","aunque","cuando","si","o","entonces","luego","después","antes"].includes(w))
        return "connectors";

    if (["el","la","los","las","un","una","unos","unas","yo","tú","él","ella","nosotros","vosotros","ellos"].includes(w))
        return "grammar";

    return "daily-life";
}

/* ============================================================
   APPLY CATEGORIES TO ALL CEFR LEVELS
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
    u.lang = "es-ES";        
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
    speak(message);
}

/* ============================================================
   LEVEL SELECTOR — BULLETPROOF VERSION
   ============================================================ */
function setLevel(level) {
    if (!CEFR_LEVELS[level]) return;

    appState.currentLevel = level;
    saveState();

    // Reset tab-specific states
    sentenceState.answer = [];
    sentenceState.currentSentence = null;

    buildState.answer = [];
    buildState.tokens = [];

    quizState.currentWord = null;
    quizState.options = [];
    quizState.selected = null;

    convoState.answer = [];
    convoState.tokens = [];
    convoState.currentPrompt = null;

    // Update button highlight
    document.querySelectorAll(".level-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.level === level);
    });

    // Re-render the currently active tab
    activateTab(appState.currentTab);
}

/* ============================================================
   LEVEL BUTTON WIRING — REQUIRED FOR LEVEL SWITCHING
   ============================================================ */
function initLevelButtons() {
    document.querySelectorAll(".level-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const level = btn.dataset.level;
            setLevel(level);
        });
    });
}

// Call once during app startup
initLevelButtons();

/* ============================================================
   TAB SWITCHING — PLACE showTab HERE
============================================================ */
function showTab(tabId) {

    // Hide all tab content
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
    });

    // Show selected tab
    document.getElementById(tabId).classList.remove("hidden");

    // Remove highlight from ALL tab buttons
    document.querySelectorAll(".tab-btn, .dash-link").forEach(btn => {
        btn.classList.remove("active");
    });

    // Highlight the active tab button
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

/* ============================================================
   TAB NAVIGATION — SPA VERSION
   ============================================================ */

function initTabNavigation() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            activateTab(tab);   // SPA controller from Part 1
        });
    });
}

// Initialize navigation + default tab
initTabNavigation();
activateTab("dashboard");


/* ============================================================
   LISTEN TAB — SPA RENDERER
   ============================================================ */

let listenAutoPlay = {
    active: false,
    paused: false,
    index: 0,
    list: []
};

function renderListen() {
    updateTabHeader("listen");

    const container = document.getElementById("listen-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Listen</h2>
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
       CATEGORY LIST
       ============================================================ */

    Object.keys(grouped).forEach(cat => {
        html += `
        <div class="glass-panel">
            <div class="listen-category-header" data-cat="${cat}">
                <span class="listen-category-title">${cat.toUpperCase()}</span>
                <span class="listen-arrow">▶</span>
            </div>

            <div class="listen-category-content" data-cat="${cat}">
                <div class="listen-grid" style="
                    display:grid;
                    grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));
                    gap:6px;
                    margin-top:8px;
                ">
                    ${grouped[cat].map(w => `
                        <button class="pill listen-opt" data-spanish="${w.spanish}">
                            ${w.english}
                            <span style="opacity:0.7;">(${w.spanish})</span>
                        </button>
                    `).join("")}
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
            const content = container.querySelector(`.listen-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ============================================================
       SINGLE WORD PLAYBACK
       ============================================================ */
    container.querySelectorAll(".listen-opt").forEach(btn => {
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
    listenAutoPlay.list = words.map(w => w.spanish);

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
   FLASHCARDS — SPA RENDERER (CATEGORY GROUPED + FLIP + AUDIO)
   ============================================================ */

function renderFlashcards() {
    updateTabHeader("flash");

    const container = document.getElementById("flash-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    let html = `
        <div class="glass-panel">
            <h2>Flashcards</h2>
            <p>Guess the correct translation then tap the card to flip it and see if your correct. Spanish side plays audio.</p>
        </div>
    `;

    Object.keys(grouped).forEach(cat => {
        html += `
        <div class="glass-panel">
            <div class="listen-category-header" data-cat="${cat}">
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

    /* ============================================================
       CATEGORY COLLAPSE
       ============================================================ */
    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ============================================================
       FLASHCARD FLIP + AUDIO
       ============================================================ */
    container.querySelectorAll(".fc-card").forEach(card => {
        card.addEventListener("click", () => {
            const inner = card.querySelector(".fc-inner");
            const flipped = inner.classList.toggle("fc-flipped");
            const spanish = inner.querySelector(".fc-back").textContent.trim();

            if (flipped) {
                speakSpanish(spanish);
                appState.levelStats[appState.currentLevel].flashSeen++;
                saveState();
                updateBadges();
                updateProgressMeters();
            } else {
                speechSynthesis.cancel();
            }
        });
    });
}

/* ============================================================
   SHARED QUIZ / BUILD / SENTENCE / CONVERSATION STATE
   ============================================================ */

let quizState = {
    currentWord: null,
    options: [],
    harderMode: false,
    selected: null
};

let buildState = {
    currentWord: null,
    tokens: [],
    answer: []
};

let sentenceState = {
    currentSentence: null,
    tokens: [],
    answer: []
};

let convoState = {
    currentPrompt: null,
    tokens: [],
    answer: []
};

function generateQuizOptions(words, correctWord) {
    let opts = [correctWord.spanish];
    const count = quizState.harderMode ? 5 : 3;

    while (opts.length < count) {
        const w = words[Math.floor(Math.random() * words.length)];
        if (!opts.includes(w.spanish)) opts.push(w.spanish);
    }

    return opts.sort(() => Math.random() - 0.5);
}

/* ============================================================
   QUIZ TAB — SPA RENDERER
   ============================================================ */

function renderQuiz() {
    updateTabHeader("quiz");

    const container = document.getElementById("quiz-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `
            <div class="glass-panel quiz-card">
                <p>No words found for level ${appState.currentLevel}.</p>
            </div>
        `;
        return;
    }

    quizState.currentWord = words[Math.floor(Math.random() * words.length)];
    quizState.options = generateQuizOptions(words, quizState.currentWord);
    quizState.selected = null;

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Quiz</h2>
            <p>Select the correct Spanish for the English word.</p>

            <div id="qb-meta"><strong>English:</strong> ${quizState.currentWord.english}</div>

            <div id="qb-grid" class="sb-grid">
                ${quizState.options.map(opt => `
                    <button class="pill" data-spanish="${opt}">${opt}</button>
                `).join("")}
            </div>

            <div id="qb-answer" class="qb-answer"></div>

            <div class="sb-controls quiz-controls-tight">
                <button id="qb-submit">Check</button>
                <button id="qb-next">Next</button>
                <button id="qb-harder" class="${quizState.harderMode ? "active" : ""}">
                    Harder
                </button>
            </div>

            <div id="qb-feedback" class="qb-feedback"></div>
        </div>
    `;

    setupQuizEvents();
}

/* ============================================================
   QUIZ TAB — EVENTS
   ============================================================ */

function setupQuizEvents() {
    const grid = document.getElementById("qb-grid");
    const submitBtn = document.getElementById("qb-submit");
    const nextBtn = document.getElementById("qb-next");
    const harderBtn = document.getElementById("qb-harder");
    const feedback = document.getElementById("qb-feedback");
    const answerBox = document.getElementById("qb-answer");

    quizState.selected = null;

    /* ============================================================
       OPTION SELECTION
       ============================================================ */
    grid.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            quizState.selected = btn.dataset.spanish;
            answerBox.textContent = quizState.selected;
        });
    });

    /* ============================================================
       CHECK ANSWER
       ============================================================ */
    submitBtn.addEventListener("click", () => {
        if (!quizState.selected) {
            feedback.textContent = "Choose an answer first.";
            return;
        }

        const correct = quizState.currentWord.spanish;

        // Ensure quizScore exists
        if (appState.levelStats[appState.currentLevel].quizScore === null) {
            appState.levelStats[appState.currentLevel].quizScore = 0;
        }

        // Ensure quizCompleted exists
        if (appState.levelStats[appState.currentLevel].quizCompleted === undefined) {
            appState.levelStats[appState.currentLevel].quizCompleted = 0;
        }

        if (quizState.selected === correct) {
            feedback.textContent = "Correct! 🎉";

            appState.levelStats[appState.currentLevel].quizCompleted++;
            appState.levelStats[appState.currentLevel].quizScore++;

            updateBadges();
            updateProgressMeters();
        } else {
            feedback.textContent = `Incorrect — correct answer: ${correct}`;
        }

        // Sabina audio
        setTimeout(() => speakQuiz(correct), 300);

        saveState();
    });

    /* ============================================================
       NEXT QUESTION
       ============================================================ */
    nextBtn.addEventListener("click", () => {
        renderQuiz();
    });

    /* ============================================================
       HARDER MODE
       ============================================================ */
    harderBtn.addEventListener("click", () => {
        quizState.harderMode = !quizState.harderMode;
        harderBtn.classList.toggle("active", quizState.harderMode);
        renderQuiz();
    });
}

/* ============================================================
   BUILD TAB — SPA RENDERER (English → Spanish Builder)
   ============================================================ */

function renderBuild() {
    updateTabHeader("build");

    const level = appState.currentLevel;
    const container = document.getElementById("build-content");

    const pool = CEFR_SENTENCES[level];
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
            <h2>Build</h2>
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

/* ============================================================
   BUILD TAB — EVENTS
   ============================================================ */

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

    /* ============================================================
       WORD PILL SELECTION
       ============================================================ */
    grid.querySelectorAll(".build-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            buildState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            selectedArea.textContent = buildState.answer.join(" ");
        });
    });

    /* ============================================================
       TYPING MODE
       ============================================================ */
    input.addEventListener("input", () => {
        buildState.answer = input.value.trim().split(" ");
        selectedArea.textContent = buildState.answer.join(" ");
    });

    /* ============================================================
       UNDO
       ============================================================ */
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

    /* ============================================================
       RESET
       ============================================================ */
    resetBtn.addEventListener("click", () => {
        buildState.answer = [];
        selectedArea.textContent = "";
        input.value = "";
        grid.querySelectorAll(".build-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    /* ============================================================
       CHECK ANSWER
       ============================================================ */
    checkBtn.addEventListener("click", () => {
        const correct = sentence.spanish.trim();
        const user = buildState.answer.join(" ").trim();

        if (user === correct) {
            feedback.innerHTML = `<span style="color:#4ade80;font-weight:600;">Correct! 🎉</span>`;

            // Ensure fields exist
            if (appState.levelStats[appState.currentLevel].xp === undefined)
                appState.levelStats[appState.currentLevel].xp = 0;

            if (appState.levelStats[appState.currentLevel].streak === undefined)
                appState.levelStats[appState.currentLevel].streak = 0;

            if (appState.levelStats[appState.currentLevel].score === undefined)
                appState.levelStats[appState.currentLevel].score = 0;

            appState.levelStats[appState.currentLevel].buildCompleted++;
            appState.levelStats[appState.currentLevel].xp += 5;
            appState.levelStats[appState.currentLevel].streak++;
            appState.levelStats[appState.currentLevel].score += 2;

            updateBadges();
            updateProgressMeters();
            saveState();

            setTimeout(() => speakQuiz(correct), 300);

        } else {
            const correctTokens = correct.split(" ");
            const userTokens = buildState.answer;

            let html = `<strong>Correct Answer:</strong><br>${correct}<br><br>`;
            html += `<strong>Your Answer:</strong><br>${user}<br><br>`;
            html += `<strong>Word-by-word feedback:</strong><br>`;

            userTokens.forEach((t, i) => {
                if (correctTokens[i] === t) {
                    html += `<span style="color:#4ade80;">${t} ✔</span> `;
                } else {
                    html += `<span style="color:#f87171;">${t} ✖</span> `;
                }
            });

            feedback.innerHTML = html;

            // Reset streak on incorrect
            if (appState.levelStats[appState.currentLevel].streak === undefined)
                appState.levelStats[appState.currentLevel].streak = 0;

            appState.levelStats[appState.currentLevel].streak = 0;

            saveState();
            setTimeout(() => speakQuiz(correct), 300);
        }
    });

    /* ============================================================
       NEXT SENTENCE
       ============================================================ */
    nextBtn.onclick = () => {
        renderBuild();
    };
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

/* ============================================================
   SENTENCE TAB — SPA RENDERER
   ============================================================ */

function renderSentence() {
    updateTabHeader("sentence");

    const container = document.getElementById("sentence-content");
    const level = appState.currentLevel;

    if (!CEFR_SENTENCE_CHOICES[level]) {
        container.innerHTML = "<p>No sentences available for this level.</p>";
        return;
    }

    const q = generateSentenceForLevel(level);
    sentenceState.answer = [];

    container.innerHTML = `
        <div class="glass-panel sentence-card">
            <h2>Sentence</h2>
            <p><strong>English:</strong> ${q.english}</p>

            <div id="sent-options" class="sentence-options">
                ${q.options.map(opt => `
                    <button class="sent-opt pill" data-token="${opt}">
                        ${opt}
                    </button>
                `).join("")}
            </div>

            <div id="sent-answer" class="sentence-answer"></div>
            <div id="sent-feedback"></div>

            <input id="sent-type" class="input-field" placeholder="Or type the Spanish sentence…">

            <div class="sentence-controls">
                <button id="sent-undo" class="pill">Undo</button>
                <button id="sent-reset" class="pill">Reset</button>
                <button id="sent-check" class="pill">Check</button>
                <button id="sent-next" class="pill">Next</button>
            </div>
        </div>
    `;

    setupSentenceEvents(q);
}

/* ============================================================
   SENTENCE TAB — EVENTS
   ============================================================ */

function setupSentenceEvents(q) {

    /* OPTION SELECTION */
    document.querySelectorAll(".sent-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            const token = btn.dataset.token;

            sentenceState.answer.push(token);

            btn.classList.add("used");
            btn.disabled = true;

            document.getElementById("sent-answer").textContent =
                sentenceState.answer.join(" ");
        });
    });

    /* TYPING MODE */
    const typeBox = document.getElementById("sent-type");
    typeBox.addEventListener("input", () => {
        const typed = typeBox.value.trim();
        sentenceState.answer = typed.split(" ");
        document.getElementById("sent-answer").textContent = typed;
    });

    /* UNDO */
    document.getElementById("sent-undo").addEventListener("click", () => {
        sentenceState.answer.pop();

        document.getElementById("sent-answer").textContent =
            sentenceState.answer.join(" ");

        document.querySelectorAll(".sent-opt").forEach(btn => {
            if (!sentenceState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    /* RESET */
    document.getElementById("sent-reset").addEventListener("click", () => {
        sentenceState.answer = [];

        document.getElementById("sent-answer").textContent = "";
        document.getElementById("sent-feedback").textContent = "";
        typeBox.value = "";

        document.querySelectorAll(".sent-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

    /* CHECK */
    document.getElementById("sent-check").addEventListener("click", () => {
        const correct = q.correct.trim();
        const user = sentenceState.answer.join(" ").trim();

        // Ensure fields exist
        const stats = appState.levelStats[appState.currentLevel];
        if (stats.xp === undefined) stats.xp = 0;
        if (stats.streak === undefined) stats.streak = 0;
        if (stats.score === undefined) stats.score = 0;
        if (stats.sentenceCompleted === undefined) stats.sentenceCompleted = 0;

        if (user === correct) {
            document.getElementById("sent-feedback").innerHTML =
                `<span style="color:#4ade80;font-weight:600;">Correct! 🎉</span>`;

            stats.sentenceCompleted++;
            stats.xp += 5;
            stats.streak++;
            stats.score += 2;

            updateBadges();
            updateProgressMeters();
            saveState();

            speakQuiz(correct);

        } else {
            document.getElementById("sent-feedback").innerHTML =
                `Incorrect — correct answer: <strong>${correct}</strong>`;

            stats.streak = 0;
            saveState();
            speakQuiz(correct);
        }
    });

    /* NEXT */
    document.getElementById("sent-next").onclick = () => {
        sentenceState.answer = [];
        document.getElementById("sent-answer").textContent = "";
        document.getElementById("sent-feedback").textContent = "";
        renderSentence();
    };
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
   CEFR CONVERSATION PROMPTS — 50+ per level with topic packs
   ============================================================ */

const CEFR_CONVO_PROMPTS = {

    /* ============================
       A1 — Beginner (Food, Travel, Work, Family, Daily Life)
       ============================ */
    A1: [
        // FOOD
        { english: "Do you like coffee?", spanish: "¿Te gusta el café?" },
        { english: "What do you eat for breakfast?", spanish: "¿Qué comes para el desayuno?" },
        { english: "Do you drink water or juice?", spanish: "¿Bebes agua o jugo?" },
        { english: "Do you like fruit?", spanish: "¿Te gusta la fruta?" },
        { english: "What is your favorite food?", spanish: "¿Cuál es tu comida favorita?" },

        // TRAVEL
        { english: "Where are you from?", spanish: "¿De dónde eres?" },
        { english: "Where do you live?", spanish: "¿Dónde vives?" },
        { english: "Do you travel often?", spanish: "¿Viajas a menudo?" },
        { english: "Where is the bus stop?", spanish: "¿Dónde está la parada de autobús?" },
        { english: "Do you like the city?", spanish: "¿Te gusta la ciudad?" },

        // WORK
        { english: "Do you work or study?", spanish: "¿Trabajas o estudias?" },
        { english: "Where do you work?", spanish: "¿Dónde trabajas?" },
        { english: "Do you like your job?", spanish: "¿Te gusta tu trabajo?" },
        { english: "What time do you start work?", spanish: "¿A qué hora empiezas a trabajar?" },
        { english: "What time do you finish work?", spanish: "¿A qué hora terminas de trabajar?" },

        // FAMILY
        { english: "Do you have brothers or sisters?", spanish: "¿Tienes hermanos o hermanas?" },
        { english: "Do you live with your family?", spanish: "¿Vives con tu familia?" },
        { english: "Is your family big?", spanish: "¿Tu familia es grande?" },
        { english: "Do you have children?", spanish: "¿Tienes hijos?" },
        { english: "Do you visit your parents often?", spanish: "¿Visitas a tus padres a menudo?" },

        // DAILY LIFE
        { english: "How are you today?", spanish: "¿Cómo estás hoy?" },
        { english: "What time do you get up?", spanish: "¿A qué hora te levantas?" },
        { english: "Do you like music?", spanish: "¿Te gusta la música?" },
        { english: "Do you watch TV?", spanish: "¿Ves televisión?" },
        { english: "Do you read books?", spanish: "¿Lees libros?" },

        // EXTRA (to reach 50+)
        { english: "Do you like animals?", spanish: "¿Te gustan los animales?" },
        { english: "Do you have a pet?", spanish: "¿Tienes una mascota?" },
        { english: "Do you like sports?", spanish: "¿Te gustan los deportes?" },
        { english: "Do you walk every day?", spanish: "¿Caminas todos los días?" },
        { english: "Do you cook at home?", spanish: "¿Cocinas en casa?" },
        { english: "Do you like cold weather?", spanish: "¿Te gusta el clima frío?" },
        { english: "Do you like warm weather?", spanish: "¿Te gusta el clima cálido?" },
        { english: "Do you sleep early?", spanish: "¿Duermes temprano?" },
        { english: "Do you study Spanish every day?", spanish: "¿Estudias español todos los días?" },
        { english: "Do you like your house?", spanish: "¿Te gusta tu casa?" }
    ],

    /* ============================
       A2 — Elementary (Food, Travel, Work, Family, Daily Life)
       ============================ */
    A2: [
        // FOOD
        { english: "What did you eat yesterday?", spanish: "¿Qué comiste ayer?" },
        { english: "Where do you usually buy groceries?", spanish: "¿Dónde sueles comprar comida?" },
        { english: "Do you like cooking?", spanish: "¿Te gusta cocinar?" },
        { english: "What do you prefer, tea or coffee?", spanish: "¿Qué prefieres, té o café?" },
        { english: "Do you eat healthy food?", spanish: "¿Comes comida saludable?" },

        // TRAVEL
        { english: "Where did you go last weekend?", spanish: "¿Adónde fuiste el fin de semana pasado?" },
        { english: "Do you like traveling by plane?", spanish: "¿Te gusta viajar en avión?" },
        { english: "Where would you like to travel?", spanish: "¿Adónde te gustaría viajar?" },
        { english: "Did you visit your family last month?", spanish: "¿Visitaste a tu familia el mes pasado?" },
        { english: "Do you like staying in hotels?", spanish: "¿Te gusta quedarte en hoteles?" },

        // WORK
        { english: "What did you do at work today?", spanish: "¿Qué hiciste en el trabajo hoy?" },
        { english: "Do you work full-time or part-time?", spanish: "¿Trabajas a tiempo completo o parcial?" },
        { english: "Do you like your coworkers?", spanish: "¿Te gustan tus compañeros de trabajo?" },
        { english: "What time did you finish work yesterday?", spanish: "¿A qué hora terminaste de trabajar ayer?" },
        { english: "Do you have meetings often?", spanish: "¿Tienes reuniones a menudo?" },

        // FAMILY
        { english: "Did you visit your parents recently?", spanish: "¿Visitaste a tus padres recientemente?" },
        { english: "Do you help your family at home?", spanish: "¿Ayudas a tu familia en casa?" },
        { english: "Do you talk to your siblings often?", spanish: "¿Hablas con tus hermanos a menudo?" },
        { english: "Do you live near your family?", spanish: "¿Vives cerca de tu familia?" },
        { english: "Did you celebrate a birthday recently?", spanish: "¿Celebraste un cumpleaños recientemente?" },

        // DAILY LIFE
        { english: "What are you doing today?", spanish: "¿Qué estás haciendo hoy?" },
        { english: "What time do you usually wake up?", spanish: "¿A qué hora sueles despertarte?" },
        { english: "Do you exercise regularly?", spanish: "¿Haces ejercicio regularmente?" },
        { english: "Do you watch movies at home?", spanish: "¿Ves películas en casa?" },
        { english: "Do you use public transport?", spanish: "¿Usas transporte público?" },

        // EXTRA
        { english: "Do you like learning languages?", spanish: "¿Te gusta aprender idiomas?" },
        { english: "Do you enjoy reading books?", spanish: "¿Disfrutas leer libros?" },
        { english: "Do you listen to music every day?", spanish: "¿Escuchas música todos los días?" },
        { english: "Do you prefer mornings or nights?", spanish: "¿Prefieres las mañanas o las noches?" },
        { english: "Do you like going to the beach?", spanish: "¿Te gusta ir a la playa?" }
    ],

    /* ============================
       B1 — Intermediate (Food, Travel, Work, Family, Opinions)
       ============================ */
    B1: [
        // FOOD
        { english: "Why do you enjoy cooking?", spanish: "¿Por qué disfrutas cocinar?" },
        { english: "What is a traditional dish from your country?", spanish: "¿Cuál es un plato tradicional de tu país?" },
        { english: "Do you prefer eating at home or at restaurants?", spanish: "¿Prefieres comer en casa o en restaurantes?" },
        { english: "What food do you avoid?", spanish: "¿Qué comida evitas?" },
        { english: "What is the healthiest meal you know?", spanish: "¿Cuál es la comida más saludable que conoces?" },

        // TRAVEL
        { english: "What was your best travel experience?", spanish: "¿Cuál fue tu mejor experiencia de viaje?" },
        { english: "What country would you like to visit next?", spanish: "¿Qué país te gustaría visitar después?" },
        { english: "Do you prefer traveling alone or with friends?", spanish: "¿Prefieres viajar solo o con amigos?" },
        { english: "What do you like about traveling?", spanish: "¿Qué te gusta de viajar?" },
        { english: "What was the last place you visited?", spanish: "¿Cuál fue el último lugar que visitaste?" },

        // WORK
        { english: "What challenges do you face at work?", spanish: "¿Qué desafíos enfrentas en el trabajo?" },
        { english: "What skills are important in your job?", spanish: "¿Qué habilidades son importantes en tu trabajo?" },
        { english: "Do you enjoy working in a team?", spanish: "¿Disfrutas trabajar en equipo?" },
        { english: "What motivates you at work?", spanish: "¿Qué te motiva en el trabajo?" },
        { english: "What project are you working on now?", spanish: "¿En qué proyecto estás trabajando ahora?" },

        // FAMILY
        { english: "How do you spend time with your family?", spanish: "¿Cómo pasas tiempo con tu familia?" },
        { english: "What traditions does your family have?", spanish: "¿Qué tradiciones tiene tu familia?" },
        { english: "Do you visit your relatives often?", spanish: "¿Visitas a tus parientes a menudo?" },
        { english: "What do you admire about your parents?", spanish: "¿Qué admiras de tus padres?" },
        { english: "Do you have a close relationship with your siblings?", spanish: "¿Tienes una relación cercana con tus hermanos?" },

        // OPINIONS
        { english: "What do you think about your city?", spanish: "¿Qué piensas de tu ciudad?" },
        { english: "How do you stay healthy?", spanish: "¿Cómo te mantienes saludable?" },
        { english: "What goals do you have this year?", spanish: "¿Qué metas tienes este año?" },
        { english: "What was the most interesting thing you learned recently?", spanish: "¿Qué fue lo más interesante que aprendiste recientemente?" },
        { english: "What do you think about social media?", spanish: "¿Qué piensas de las redes sociales?" }
    ],

    /* ============================
       B2 — Upper Intermediate (Work, Opinions, Future Plans)
       ============================ */
    B2: [
        // WORK
        { english: "How do you handle stressful situations?", spanish: "¿Cómo manejas las situaciones estresantes?" },
        { english: "What challenges do you face at work?", spanish: "¿Qué desafíos enfrentas en el trabajo?" },
        { english: "How has your career changed over time?", spanish: "¿Cómo ha cambiado tu carrera con el tiempo?" },
        { english: "What skills do you want to improve?", spanish: "¿Qué habilidades quieres mejorar?" },
        { english: "What motivates you to improve?", spanish: "¿Qué te motiva a mejorar?" },

        // OPINIONS
        { english: "What is your opinion on technology in education?", spanish: "¿Cuál es tu opinión sobre la tecnología en la educación?" },
        { english: "How has your lifestyle changed in recent years?", spanish: "¿Cómo ha cambiado tu estilo de vida en los últimos años?" },
        { english: "What do you think about climate change?", spanish: "¿Qué piensas sobre el cambio climático?" },
        { english: "What role does culture play in society?", spanish: "¿Qué papel juega la cultura en la sociedad?" },
        { english: "What do you think about remote work?", spanish: "¿Qué piensas del trabajo remoto?" },

        // FUTURE PLANS
        { english: "What are your long-term goals?", spanish: "¿Cuáles son tus metas a largo plazo?" },
        { english: "Where would you like to live in the future?", spanish: "¿Dónde te gustaría vivir en el futuro?" },
        { english: "What skills will be important in the future?", spanish: "¿Qué habilidades serán importantes en el futuro?" },
        { english: "What changes do you expect in your life?", spanish: "¿Qué cambios esperas en tu vida?" },
        { english: "What do you want to achieve next year?", spanish: "¿Qué quieres lograr el próximo año?" }
    ]
};

/* ============================================================
   CONVERSATION TAB — CEFR Everyday Dialogue Trainer
   ============================================================ */
// GLOBAL — Disruptors (max 5)
const disruptors = ["rápido", "lento", "siempre", "nunca", "porque"];

function renderConversation() {
    updateTabHeader("conversation");

    const container = document.getElementById("conversation-content");
    const level = appState.currentLevel;
    const words = CEFR_LEVELS[level];

    if (!words || !words.length) {
        container.innerHTML = `
            <div class="glass-panel convo-card">
                <p>No words found for level ${level}.</p>
            </div>
        `;
        return;
    }

    // Pick CEFR-level prompt
    const prompt = CEFR_CONVO_PROMPTS[level][Math.floor(Math.random() * CEFR_CONVO_PROMPTS[level].length)];
    convoState.currentPrompt = prompt;

    // FIXED: use spanish
    const target = prompt.spanish.replace(/[¿?]/g, "").trim();
    const coreTokens = target.split(" ");

    const levelTokens = words.map(w => w.spanish.split(" ")).flat();

    let bank = [...coreTokens];

    // FIXED: reduce level words from +6 to +4
    while (bank.length < coreTokens.length + 4) {
        const t = levelTokens[Math.floor(Math.random() * levelTokens.length)];
        if (t && !bank.includes(t)) bank.push(t);
    }

    // FIXED: use global disruptors
    disruptors.forEach(d => {
        if (!bank.includes(d)) bank.push(d);
    });

    bank = bank.sort(() => Math.random() - 0.5);

    convoState.tokens = bank;
    convoState.answer = [];

    container.innerHTML = `
        <div class="glass-panel convo-card">
            <h2>Conversation</h2>
            <p>Respond in Spanish using the wordbank or typing.</p>

            <div id="convo-prompt">
                <strong>Prompt (English):</strong> ${prompt.english}
            </div>

            <div id="convo-grid" class="sb-grid">
                ${bank.map(t => `<button class="pill convo-opt" data-token="${t}">${t}</button>`).join("")}
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

    setupConversationEvents();
}


/* ============================================================
   CONVERSATION EVENTS — Word Pills + Typing + Feedback + Streak
   ============================================================ */

function setupConversationEvents() {
    const grid = document.getElementById("convo-grid");
    const answerBox = document.getElementById("convo-answer");
    const typeBox = document.getElementById("convo-type");
    const feedback = document.getElementById("convo-feedback");

    const undoBtn = document.getElementById("convo-undo");
    const resetBtn = document.getElementById("convo-reset");
    const checkBtn = document.getElementById("convo-check");
    const nextBtn = document.getElementById("convo-next");

    convoState.answer = [];

    // Word pill selection
    grid.querySelectorAll(".convo-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            convoState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            answerBox.textContent = convoState.answer.join(" ");
        });
    });

    // Typing mode
    typeBox.addEventListener("input", () => {
        convoState.answer = typeBox.value.trim().split(" ");
        answerBox.textContent = convoState.answer.join(" ");
    });

    // Undo
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

    // Reset
    resetBtn.addEventListener("click", () => {
        convoState.answer = [];
        answerBox.textContent = "";
        typeBox.value = "";
        grid.querySelectorAll(".convo-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

   // Check answer with word-by-word feedback + streak rewards
checkBtn.addEventListener("click", () => {

    // FIXED: correct property name
    const correct = convoState.currentPrompt.spanish.replace(/[¿?]/g, "").trim();
    const user = convoState.answer.join(" ").trim();

    const correctTokens = correct.split(" ");
    const userTokens = convoState.answer;

    const stats = appState.levelStats[appState.currentLevel];
    let html = "";


    /* ============================================================
   CORRECT ANSWER — CEFR FEEDBACK (Improved)
   ============================================================ */
if (user === correct) {

    const translated = translateToEnglish(user);
    const cefrHint = getCEFRGrammarHint(appState.currentLevel, user, correct);

    /* --- Correct Message --- */
    html += `<span style="color:#4ade80;font-weight:600;">Correct! 🎉</span><br>`;
    html += `<strong>Your Answer:</strong> ${user}<br>`;
    html += `<strong>Meaning:</strong> ${translated}<br><br>`;

    /* --- Positive Reinforcement --- */
    html += `<div style="color:#22c55e;font-weight:500;">Great job! Your Spanish sentence matches the target structure and meaning.</div><br>`;

    /* --- CEFR Insight (Optional) --- */
    if (cefrHint) {
        html += `<strong>CEFR Insight (${appState.currentLevel}):</strong><br>`;
        html += `<em>${cefrHint}</em><br><br>`;
    }

    /* --- XP + Streak + Score --- */
    stats.conversationCompleted++;
    registerDailyConversationCompletion();

    stats.xp += 5;
    stats.streak++;
    stats.score += 2;

    /* --- Streak Rewards --- */
    if (stats.streak === 3) html += `<div class="streak-reward">🔥 Great streak! 3 correct answers in a row!</div><br>`;
    if (stats.streak === 5) html += `<div class="streak-reward">⚡ Amazing! 5 correct answers in a row!</div><br>`;
    if (stats.streak === 10) html += `<div class="streak-reward">🌟 Incredible! 10 correct answers in a row!</div><br>`;

} else {

    /* ============================================================
       INCORRECT ANSWER — CEFR FEEDBACK (Improved)
       ============================================================ */
    const translated = translateToEnglish(user);
    const grammarNote = explainGrammarError(user, correct);
    const cefrHint = getCEFRGrammarHint(appState.currentLevel, user, correct);

    html += `<span style="color:#f87171;font-weight:600;">Incorrect</span><br>`;
    html += `<strong>Correct Answer:</strong> ${correct}<br>`;
    html += `<strong>Your Answer:</strong> ${user || "(empty)"}<br><br>`;

    /* --- Translation --- */
    html += `<strong>Meaning of Your Sentence:</strong><br>`;
    html += `${translated}<br><br>`;

    /* --- Grammar Note --- */
    if (grammarNote) {
        html += `<strong>Grammar Note:</strong><br>`;
        html += `<em>${grammarNote}</em><br><br>`;
    }

    /* --- CEFR Hint --- */
    if (cefrHint) {
        html += `<strong>CEFR Hint (${appState.currentLevel}):</strong><br>`;
        html += `<em>${cefrHint}</em><br><br>`;
    }

    stats.streak = 0;
}

/* ============================================================
   WORD-BY-WORD FEEDBACK — Improved
   ============================================================ */
html += `<strong>Word-by-word feedback:</strong><br>`;

userTokens.forEach((t, i) => {
    const isCorrect = correctTokens[i] === t;

    html += isCorrect
        ? `<span style="background:#4ade80;color:#fff;padding:3px 6px;border-radius:6px;margin-right:4px;">${t} ✔</span>`
        : `<span style="background:#f87171;color:#fff;padding:3px 6px;border-radius:6px;margin-right:4px;">${t} ✖</span>`;
});

html += `<br><br>`;


    feedback.innerHTML = html;

    saveState();
    updateBadges();
    updateProgressMeters();

    setTimeout(() => speakQuiz(correct), 300);
});





    /* ============================================================
       NEXT BUTTON — LOAD NEW PROMPT
       ============================================================ */

    nextBtn.addEventListener("click", () => {
        renderConversation();
    });
}


/* ============================================================
   GRAMMAR TAB
   ============================================================ */

function renderGrammar() {
    updateTabHeader("grammar");

    const container = document.getElementById("grammar-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Grammar</h2>
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
    `;
}


/* ============================================================
   BADGES — Updated with Conversation Mastery + Daily Challenge
   ============================================================ */

function updateBadges() {
    const list = document.getElementById("badge-list");
    const badges = new Set(appState.badges);

    Object.keys(appState.levelStats).forEach(level => {
        const s = appState.levelStats[level];

        /* ============================
           LISTENING BADGES
           ============================ */
        if (s.listens >= 20) {
            badges.add(`${level} Listener`);
        }

        /* ============================
           FLASHCARDS BADGES
           ============================ */
        if (s.flashSeen >= 30) {
            badges.add(`${level} Flash Master`);
        }

        /* ============================
           QUIZ BADGES
           ============================ */
        if (s.quizScore !== null && s.quizScore >= 80) {
            badges.add(`${level} Quiz Ace`);
        }

        /* ============================
           BUILD TAB BADGES
           ============================ */
        if (s.buildCompleted >= 10) {
            badges.add(`${level} Builder`);
        }

        /* ============================
           SENTENCE TAB BADGES
           ============================ */
        if (s.sentenceCompleted >= 10) {
            badges.add(`${level} Sentence Pro`);
        }

        /* ============================
           CONVERSATION MASTERY BADGES
           ============================ */

        // Tier 1 — Beginner
        if (s.conversationCompleted >= 10) {
            badges.add(`${level} Conversational Beginner`);
        }

        // Tier 2 — Speaker
        if (s.conversationCompleted >= 25) {
            badges.add(`${level} Conversational Speaker`);
        }

        // Tier 3 — Mastery (requires streak)
        if (s.conversationCompleted >= 50 && s.streak >= 10) {
            badges.add(`${level} Conversational Mastery`);

            if (typeof showConversationMasteryPopup === "function") {
                showConversationMasteryPopup(level);
            }
        }

        /* ============================
           DAILY CHALLENGE BADGES
           ============================ */

        const dc = appState.dailyChallenge;

        // Daily goal badge (e.g., 5 conversations completed today)
        if (dc.completedToday >= dc.goal) {
            badges.add(`${level} Daily Conversationalist`);
        }

        // Weekly streak badge (7 days in a row)
        if (dc.streak >= 7) {
            badges.add(`${level} Weekly Conversationalist`);
        }

        // Monthly streak badge (30 days in a row)
        if (dc.streak >= 30) {
            badges.add(`${level} Monthly Conversationalist`);
        }
    });

    /* ============================
       SAVE + RENDER BADGE LIST
       ============================ */

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

/* ============================================================
   PROGRESS REQUIREMENTS
   ============================================================ */

const QUIZ_REQUIRED = 10;
const BUILD_REQUIRED = 10;
const SENTENCE_REQUIRED = 10;
const CONVERSATION_REQUIRED = 10;

const XP_REQUIRED = 100;
const STREAK_GOAL = 7;
const SCORE_MAX = 100;
const REVIEW_TOTAL = 20;

const LEVEL_UNLOCK_PERCENT = 80;


/* ============================================================
   REAL PROGRESS METERS
   ============================================================ */

function updateProgressMeters() {
    const stats = appState.levelStats[appState.currentLevel];

    if (stats.xp === undefined) stats.xp = 0;
    if (stats.streak === undefined) stats.streak = 0;
    if (stats.score === undefined) stats.score = 0;
    if (stats.reviewDue === undefined) stats.reviewDue = 0;
    if (stats.quizCompleted === undefined) stats.quizCompleted = 0;
    if (stats.buildCompleted === undefined) stats.buildCompleted = 0;
    if (stats.sentenceCompleted === undefined) stats.sentenceCompleted = 0;
    if (stats.conversationCompleted === undefined) stats.conversationCompleted = 0;

    const quizPct = Math.min(100, (stats.quizCompleted / QUIZ_REQUIRED) * 100);
    const buildPct = Math.min(100, (stats.buildCompleted / BUILD_REQUIRED) * 100);
    const sentencePct = Math.min(100, (stats.sentenceCompleted / SENTENCE_REQUIRED) * 100);
    const convoPct = Math.min(100, (stats.conversationCompleted / CONVERSATION_REQUIRED) * 100);

    const xpPct = Math.min(100, (stats.xp / XP_REQUIRED) * 100);
    const streakPct = Math.min(100, (stats.streak / STREAK_GOAL) * 100);
    const scorePct = Math.min(100, (stats.score / SCORE_MAX) * 100);
    const reviewPct = Math.min(100, (stats.reviewDue / REVIEW_TOTAL) * 100);

    setMeter("quiz", quizPct);
    setMeter("build", buildPct);
    setMeter("sentence", sentencePct);
    setMeter("convo", convoPct);

    setMeter("streak", streakPct);
    setMeter("score", scorePct);
    setMeter("review", reviewPct);

    checkLevelUnlock();
}


/* ============================================================
   METER SETTER
   ============================================================ */

function setMeter(name, pct) {
    document.getElementById(`${name}-progress`).style.width = pct + "%";
    animateNumber(`${name}-number`, Math.round(pct));
    pulseTile(`${name}-tile`);
}


/* ============================================================
   LEVEL UNLOCK CHECKER
   ============================================================ */

function checkLevelUnlock() {
    const stats = appState.levelStats[appState.currentLevel];

    const quizPct = (stats.quizCompleted / QUIZ_REQUIRED) * 100;
    const buildPct = (stats.buildCompleted / BUILD_REQUIRED) * 100;
    const sentencePct = (stats.sentenceCompleted / SENTENCE_REQUIRED) * 100;
    const convoPct = (stats.conversationCompleted / CONVERSATION_REQUIRED) * 100;

    const avg = (quizPct + buildPct + sentencePct + convoPct) / 4;

    if (avg >= LEVEL_UNLOCK_PERCENT) {
        unlockNextLevel();
    }
}


/* ============================================================
   LEVEL UNLOCK EXECUTOR
   ============================================================ */

function unlockNextLevel() {
    const levels = ["A1", "A2", "B1", "B2"];
    const idx = levels.indexOf(appState.currentLevel);

    if (idx < levels.length - 1) {
        appState.currentLevel = levels[idx + 1];
        saveState();
        if (typeof showLevelUpPopup === "function") {
            showLevelUpPopup(appState.currentLevel);
        }
    }
}


/* ============================================================
   RESET PROGRESS SYSTEM
   ============================================================ */

function resetProgressForLevel(level) {
    appState.levelStats[level] = {
        quizCompleted: 0,
        buildCompleted: 0,
        sentenceCompleted: 0,
        conversationCompleted: 0,
        xp: 0,
        streak: 0,
        score: 0,
        reviewDue: 0
    };

    saveState();
    updateProgressMeters();
}

/* ============================================================
   RESET PROGRESS BUTTON LISTENER
   ============================================================ */

document.getElementById("reset-progress").addEventListener("click", () => {
    if (confirm("Reset all progress for this level?")) {
        resetProgressForLevel(appState.currentLevel);
    }
});

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

    initTabNavigation();
    activateTab("dashboard");

    initRateControl();
    initNameBox();

    updateBadges();
    updateProgressMeters();
});



