/* ============================================================
   NORMALIZATION UTIL — lowercase + trim + remove accents
   ============================================================ */
function normalize(text) {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // strip accents
}

/* ============================================================
   CEFR PHRASES — Global (A1 → B2)
   ============================================================ */
const CEFR_PHRASES = {
    // A1
    "como estas": "how are you",
    "donde vives": "where do you live",
    "que hora es": "what time is it",
    "te gusta el cafe": "you like coffee",
    "me gusta la musica": "I like music",
    "vivo en la ciudad": "I live in the city",
    "trabajo en un hotel": "I work in a hotel",
    "quiero comer": "I want to eat",
    "quiero beber": "I want to drink",
    "donde esta el bano": "where is the bathroom",

    // A2
    "que hiciste ayer": "what did you do yesterday",
    "fuiste al supermercado": "did you go to the supermarket",
    "viajas a menudo": "you travel often",
    "que compraste": "what did you buy",
    "que estas haciendo": "what are you doing",
    "sueles comer temprano": "you usually eat early",
    "necesito ayuda": "I need help",
    "quiero hacer una reserva": "I want to make a reservation",
    "donde esta la estacion": "where is the station",

    // B1
    "he estado aprendiendo espanol": "I have been learning Spanish",
    "disfruto viajar": "I enjoy traveling",
    "quiero mejorar mis habilidades": "I want to improve my skills",
    "que piensas de la ciudad": "what do you think of the city",
    "como mantienes una vida saludable": "how do you maintain a healthy life",
    "que aprendiste recientemente": "what did you learn recently",
    "cuales son tus metas": "what are your goals",
    "que experiencias pasadas tienes": "what past experiences do you have",

    // B2
    "como manejas situaciones estresantes": "how do you handle stressful situations",
    "cual es tu opinion sobre la tecnologia": "what is your opinion on technology",
    "como ha cambiado tu vida": "how has your life changed",
    "que desafios enfrentas": "what challenges do you face",
    "que esperas lograr": "what do you hope to achieve",
    "que piensas del futuro": "what do you think about the future",
    "como ves la sociedad actual": "how do you see modern society",
    "cual es tu perspectiva": "what is your perspective"
};

/* ============================================================
   WORD DICTIONARY — Global (A1 → B2)
   ============================================================ */
const WORD_DICT = {
    /* A1 */
    "hola": "hello",
    "adios": "goodbye",
    "por": "for",
    "favor": "favor",
    "gracias": "thank you",
    "si": "yes",
    "no": "no",
    "lo": "it",
    "siento": "sorry",
    "perdon": "excuse me",

    "yo": "I",
    "tu": "you",
    "el": "he",
    "ella": "she",
    "nosotros": "we",
    "ellos": "they",

    "y": "and",
    "o": "or",
    "pero": "but",
    "porque": "because",
    "con": "with",
    "sin": "without",
    "tambien": "also",
    "muy": "very",
    "mas": "more",
    "poco": "little",
    "entonces": "then",
    "un": "a",

    "agua": "water",
    "comida": "food",
    "cafe": "coffee",
    "te": "tea",
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
    "platano": "banana",
    "pollo": "chicken",
    "pescado": "fish",
    "sopa": "soup",
    "ensalada": "salad",
    "arroz": "rice",
    "frijoles": "beans",
    "queso": "cheese",
    "mantequilla": "butter",
    "azucar": "sugar",
    "sal": "salt",

    "bano": "bathroom",
    "hotel": "hotel",
    "habitacion": "room",
    "llave": "key",
    "mesa": "table",
    "silla": "chair",

    "menu": "menu",
    "cuenta": "bill",
    "camarero": "waiter",
    "quiero": "I want",
    "gustaria": "would like",

    "autobus": "bus",
    "tren": "train",
    "boleto": "ticket",
    "estacion": "station",
    "aeropuerto": "airport",

    "cuanto": "how much",
    "cuesta": "costs",
    "barato": "cheap",
    "caro": "expensive",
    "abierto": "open",
    "cerrado": "closed",

    "ayuda": "help",
    "doctor": "doctor",
    "policia": "police",
    "estoy": "I am",
    "perdido": "lost",

    "como": "how",
    "estas": "are you",
    "hoy": "today",
    "donde": "where",
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
    "gusta": "like",
    "gustan": "like (plural)",
    "musica": "music",
    "television": "television",
    "lees": "you read",
    "leo": "I read",
    "libros": "books",
    "solo": "only",
    "nunca": "never",
    "manana": "tomorrow",
    "rapido": "fast",
    "lento": "slow",
    "ciudad": "city",
    "parada": "stop",

    /* A2 */
    "me": "me",
    "necesito": "I need",
    "que": "what",
    "ayer": "yesterday",
    "pasado": "last",
    "semana": "week",
    "fin": "end",
    "proximo": "next",
    "todavia": "still",
    "ya": "already",
    "antes": "before",

    "desayuno": "breakfast",
    "almuerzo": "lunch",
    "cena": "dinner",

    "centro": "center",
    "farmacia": "pharmacy",
    "supermercado": "supermarket",
    "tienda": "store",

    "avion": "plane",
    "visitar": "to visit",

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

    "familia": "family",
    "a menudo": "often",
    "pasado manana": "day after tomorrow",

    /* B1 */
    "he": "I have",
    "estado": "been",
    "aprendiendo": "learning",
    "espanol": "Spanish",
    "experiencias": "experiences",
    "pasadas": "past",

    "interesante": "interesting",
    "ultimo": "last",

    "tiempo": "time",
    "libre": "free",
    "diarias": "daily",

    "comunicacion": "communication",
    "conversaciones": "conversations",

    "desarrollador": "developer",
    "mejorar": "to improve",
    "habilidades": "skills",

    "redes": "networks",
    "sociales": "social",

    "mientras": "while",
    "sin embargo": "however",

    /* B2 */
    "opinion": "opinion",
    "tecnologia": "technology",
    "educacion": "education",
    "cultura": "culture",
    "sociedad": "society",
    "importantes": "important",

    "vida": "life",
    "cambiado": "changed",
    "anos": "years",
    "cambios": "changes",
    "saludable": "healthy",

    "desafios": "challenges",
    "enfrentas": "you face",
    "motivacion": "motivation",
    "lograr": "to achieve",
    "esperas": "you expect",

    "ademas": "in addition",
    "por lo tanto": "therefore",
    "a pesar de": "despite",

    "remoto": "remote",
    "futuro": "future",
    "vivir": "to live",
    "largo": "long",
    "plazo": "term",

    /* Disruptors */
    "siempre": "always",
    "aunque": "although",
    "cuando": "when",
    "donde": "where"
};

/* ============================================================
   TRANSLATION ENGINE — CEFR Phrases + Word Dictionary
   ============================================================ */
function translateToEnglish(spanishText) {
    const normalized = normalize(
        spanishText.replace(/[.,!?]/g, "") // strip punctuation
    );

    // Phrase match
    if (CEFR_PHRASES[normalized]) {
        return CEFR_PHRASES[normalized];
    }

    // Word-by-word fallback
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
   CEFR SENTENCE BANKS — A1 → B2 (Corrected + Normalized)
   ============================================================ */

const CEFR_SENTENCES = {

    /* ============================================================
       A1 — Beginner (40 Sentences)
       ============================================================ */
    A1: [

        // Greetings & Basics
        { english: "Hello, how are you?", spanish: "hola como estas" },
        { english: "Goodbye, see you tomorrow.", spanish: "adios hasta manana" },
        { english: "Excuse me, where is the bathroom?", spanish: "perdon donde esta el bano" },
        { english: "Sorry, I am late.", spanish: "lo siento estoy tarde" },
        { english: "Yes, I am okay.", spanish: "si estoy bien" },

        // Personal Info
        { english: "I live in the city.", spanish: "vivo en la ciudad" },
        { english: "She lives in a hotel.", spanish: "ella vive en un hotel" },
        { english: "We are brothers.", spanish: "nosotros somos hermanos" },
        { english: "He is my friend.", spanish: "el es mi amigo" },
        { english: "You are my sister.", spanish: "tu eres mi hermana" },

        // Food & Drink
        { english: "I want water.", spanish: "quiero agua" },
        { english: "I like soup.", spanish: "me gusta la sopa" },
        { english: "He eats bread.", spanish: "el come pan" },
        { english: "We drink coffee.", spanish: "nosotros bebemos cafe" },
        { english: "She likes fruit.", spanish: "a ella le gusta la fruta" },

        // Daily Life
        { english: "You work in a store.", spanish: "tu trabajas en una tienda" },
        { english: "I read books.", spanish: "yo leo libros" },
        { english: "We watch television.", spanish: "nosotros vemos television" },
        { english: "He studies every day.", spanish: "el estudia cada dia" },
        { english: "She gets up early.", spanish: "ella se levanta temprano" },

        // Travel & Places
        { english: "Where is the bus stop?", spanish: "donde esta la parada de autobus" },
        { english: "The airport is open.", spanish: "el aeropuerto esta abierto" },
        { english: "The hotel is closed.", spanish: "el hotel esta cerrado" },
        { english: "The room has a table.", spanish: "la habitacion tiene una mesa" },
        { english: "The key is on the chair.", spanish: "la llave esta en la silla" },

        // Shopping
        { english: "How much does the menu cost?", spanish: "cuanto cuesta el menu" },
        { english: "The store is closed.", spanish: "la tienda esta cerrada" },
        { english: "The supermarket is open.", spanish: "el supermercado esta abierto" },
        { english: "I want cheap fruit.", spanish: "quiero fruta barata" },
        { english: "The bill is expensive.", spanish: "la cuenta es cara" },

        // Restaurant
        { english: "I would like chicken.", spanish: "me gustaria pollo" },
        { english: "The waiter has the bill.", spanish: "el camarero tiene la cuenta" },
        { english: "I want a table.", spanish: "quiero una mesa" },
        { english: "She wants soup.", spanish: "ella quiere sopa" },
        { english: "We want bread.", spanish: "nosotros queremos pan" },

        // Emergency
        { english: "I need help.", spanish: "necesito ayuda" },
        { english: "Call the police.", spanish: "llama a la policia" },
        { english: "I am lost.", spanish: "estoy perdido" },
        { english: "I need a doctor.", spanish: "necesito un doctor" },
        { english: "He is not okay.", spanish: "el no esta bien" }
    ],

    /* ============================================================
       A2 — Elementary (40 Sentences)
       ============================================================ */
    A2: [

        // Daily Life & Routines
        { english: "I usually eat early.", spanish: "yo suelo comer temprano" },
        { english: "What did you do yesterday?", spanish: "que hiciste ayer" },
        { english: "We finished the breakfast.", spanish: "nosotros terminamos el desayuno" },
        { english: "She woke up late.", spanish: "ella se levanto tarde" },
        { english: "He works every morning.", spanish: "el trabaja cada manana" },

        // Shopping & Places
        { english: "She bought fruit at the supermarket.", spanish: "ella compro fruta en el supermercado" },
        { english: "The pharmacy is in the center.", spanish: "la farmacia esta en el centro" },
        { english: "I need something cheap.", spanish: "necesito algo barato" },
        { english: "The store opens tomorrow.", spanish: "la tienda abre manana" },
        { english: "He bought bread and cheese.", spanish: "el compro pan y queso" },

        // Travel
        { english: "We travel often.", spanish: "nosotros viajamos a menudo" },
        { english: "Did you go to the airport?", spanish: "fuiste al aeropuerto" },
        { english: "The plane arrives early.", spanish: "el avion llega temprano" },
        { english: "She visits her family often.", spanish: "ella visita a su familia a menudo" },
        { english: "We went last week.", spanish: "nosotros fuimos la semana pasada" },

        // Food & Meals
        { english: "I eat rice with chicken.", spanish: "yo como arroz con pollo" },
        { english: "He likes dinner with family.", spanish: "a el le gusta la cena con familia" },
        { english: "She finished the lunch.", spanish: "ella termino el almuerzo" },
        { english: "We bought fruit recently.", spanish: "nosotros compramos fruta recientemente" },
        { english: "He eats soup often.", spanish: "el come sopa a menudo" },

        // Actions & Verbs
        { english: "She is doing homework.", spanish: "ella hace tarea" },
        { english: "You use the transport.", spanish: "tu usas el transporte" },
        { english: "He watches movies often.", spanish: "el ve peliculas a menudo" },
        { english: "We celebrated last week.", spanish: "nosotros celebramos la semana pasada" },
        { english: "I visited yesterday.", spanish: "yo visite ayer" },

        // Family
        { english: "My family lives near the station.", spanish: "mi familia vive cerca de la estacion" },
        { english: "We visited our family.", spanish: "nosotros visitamos nuestra familia" },
        { english: "She bought dinner for her family.", spanish: "ella compro cena para su familia" },
        { english: "He celebrated with his family.", spanish: "el celebro con su familia" },
        { english: "They live far from the center.", spanish: "ellos viven lejos del centro" },

        // Extra A2
        { english: "I need a reservation.", spanish: "necesito una reserva" },
        { english: "She bought cheese and bread.", spanish: "ella compro queso y pan" },
        { english: "We use transport every day.", spanish: "nosotros usamos transporte cada dia" },
        { english: "He finished the work early.", spanish: "el termino el trabajo temprano" },
        { english: "I will visit tomorrow.", spanish: "yo voy a visitar manana" }
    ],

    /* ============================================================
       B1 — Intermediate (40 Sentences)
       ============================================================ */
    B1: [

        // Opinions
        { english: "I think the city is interesting.", spanish: "creo que la ciudad es interesante" },
        { english: "She enjoys traveling with friends.", spanish: "ella disfruta viajar con amigos" },
        { english: "He believes the idea is good.", spanish: "el cree que la idea es buena" },
        { english: "We think the plan is important.", spanish: "nosotros creemos que el plan es importante" },
        { english: "I like the communication here.", spanish: "me gusta la comunicacion aqui" },

        // Experiences
        { english: "I have been learning Spanish.", spanish: "he estado aprendiendo espanol" },
        { english: "What did you learn recently?", spanish: "que aprendiste recientemente" },
        { english: "She remembers past experiences.", spanish: "ella recuerda experiencias pasadas" },
        { english: "We talked about our past.", spanish: "nosotros hablamos sobre nuestro pasado" },
        { english: "He learned something new.", spanish: "el aprendio algo nuevo" },

        // Daily Life & Habits
        { english: "We have daily conversations.", spanish: "nosotros tenemos conversaciones diarias" },
        { english: "He wants to improve his skills.", spanish: "el quiere mejorar sus habilidades" },
        { english: "She studies every afternoon.", spanish: "ella estudia cada tarde" },
        { english: "I enjoy free time on weekends.", spanish: "yo disfruto tiempo libre los fines de semana" },
        { english: "They work while they study.", spanish: "ellos trabajan mientras estudian" },

        // Work & Study
        { english: "She is a developer.", spanish: "ella es desarrollador" },
        { english: "I need time to study.", spanish: "necesito tiempo para estudiar" },
        { english: "He works in the center.", spanish: "el trabaja en el centro" },
        { english: "We plan future projects.", spanish: "nosotros planeamos proyectos futuros" },
        { english: "She improves her communication.", spanish: "ella mejora su comunicacion" },

        // Social & Communication
        { english: "I use social networks often.", spanish: "yo uso redes sociales a menudo" },
        { english: "Communication is important.", spanish: "la comunicacion es importante" },
        { english: "He talks with his friends daily.", spanish: "el habla con sus amigos diariamente" },
        { english: "We share ideas online.", spanish: "nosotros compartimos ideas en linea" },
        { english: "She reads news every morning.", spanish: "ella lee noticias cada manana" },

        // Travel & Life
        { english: "We plan future trips.", spanish: "nosotros planeamos viajes futuros" },
        { english: "He remembers past experiences.", spanish: "el recuerda experiencias pasadas" },
        { english: "She enjoys traveling alone.", spanish: "ella disfruta viajar sola" },
        { english: "I want to travel more.", spanish: "yo quiero viajar mas" },
        { english: "They visit new places often.", spanish: "ellos visitan lugares nuevos a menudo" },

        // Extra B1
        { english: "We talk about daily problems.", spanish: "nosotros hablamos sobre problemas diarios" },
        { english: "He reads books every day.", spanish: "el lee libros cada dia" },
        { english: "She studies while she works.", spanish: "ella estudia mientras trabaja" },
        { english: "I enjoy learning languages.", spanish: "yo disfruto aprender idiomas" },
        { english: "They plan important changes.", spanish: "ellos planean cambios importantes" }
    ],

    /* ============================================================
       B2 — Upper Intermediate (40 Sentences)
       ============================================================ */
    B2: [

        // Abstract Ideas
        { english: "What is your opinion about technology?", spanish: "cual es tu opinion sobre la tecnologia" },
        { english: "Society is changing quickly.", spanish: "la sociedad esta cambiando rapido" },
        { english: "Education is important for the future.", spanish: "la educacion es importante para el futuro" },
        { english: "Culture changes over time.", spanish: "la cultura cambia con el tiempo" },
        { english: "Technology affects daily life.", spanish: "la tecnologia afecta la vida diaria" },

        // Challenges & Goals
        { english: "What challenges do you face?", spanish: "que desafios enfrentas" },
        { english: "She hopes to achieve her goals.", spanish: "ella espera lograr sus metas" },
        { english: "He works hard to achieve success.", spanish: "el trabaja duro para lograr exito" },
        { english: "We face important challenges.", spanish: "nosotros enfrentamos desafios importantes" },
        { english: "They expect positive results.", spanish: "ellos esperan resultados positivos" },

        // Life & Change
        { english: "My life has changed in recent years.", spanish: "mi vida ha cambiado en los ultimos anos" },
        { english: "He wants a healthy lifestyle.", spanish: "el quiere un estilo de vida saludable" },
        { english: "We analyze cultural changes.", spanish: "nosotros analizamos cambios culturales" },
        { english: "She studies for a long-term goal.", spanish: "ella estudia para un objetivo a largo plazo" },
        { english: "They see the future as positive.", spanish: "ellos ven el futuro como positivo" },

        // Reasoning & Explanation
        { english: "We continue despite the problems.", spanish: "nosotros continuamos a pesar de los problemas" },
        { english: "He explained the concept clearly.", spanish: "el explico el concepto claramente" },
        { english: "She works a lot; therefore, she is tired.", spanish: "ella trabaja mucho por lo tanto esta cansada" },
        { english: "I like the idea; however, it is difficult.", spanish: "me gusta la idea sin embargo es dificil" },
        { english: "They study because it is important.", spanish: "ellos estudian porque es importante" },

        // Advanced Connectors
        { english: "He works hard; however, he needs rest.", spanish: "el trabaja duro sin embargo necesita descanso" },
        { english: "We continue; therefore, we improve.", spanish: "nosotros continuamos por lo tanto mejoramos" },
        { english: "She studies a lot; in addition, she works.", spanish: "ella estudia mucho ademas trabaja" },
        { english: "He learns despite the difficulty.", spanish: "el aprende a pesar de la dificultad" },
        { english: "They continue despite the problems.", spanish: "ellos continuan a pesar de los problemas" },

        // Extra B2
        { english: "I handle stressful situations well.", spanish: "yo manejo situaciones estresantes bien" },
        { english: "She analyzes important information.", spanish: "ella analiza informacion importante" },
        { english: "We discuss cultural ideas.", spanish: "nosotros discutimos ideas culturales" },
        { english: "He studies for future opportunities.", spanish: "el estudia para oportunidades futuras" },
        { english: "They work on long-term projects.", spanish: "ellos trabajan en proyectos a largo plazo" }
    ]
};
/* ============================================================
   CEFR CONVERSATION BANKS — A1 → B2 (Professional Rewrite)
   ============================================================ */

const CEFR_CONVERSATIONS = {

    /* ============================================================
       A1 — Beginner (40 Prompts)
       ============================================================ */
    A1: [
        "Como estas",
        "Donde vives",
        "Que te gusta comer",
        "Trabajas o estudias",
        "Que hora es",
        "Donde esta el bano",
        "Quieres agua o cafe",
        "Te gusta la sopa",
        "Lees libros",
        "Miras television",
        "Donde esta la parada de autobus",
        "Esta abierto el supermercado",
        "Cuanto cuesta el menu",
        "Quieres pan o arroz",
        "Te gusta la fruta",
        "Donde esta tu habitacion",
        "Tienes hermanos",
        "Te gusta la musica",
        "Quieres una mesa",
        "Donde esta el camarero",
        "Quieres pollo o pescado",
        "Estas perdido",
        "Necesitas ayuda",
        "Donde esta la policia",
        "Quieres ir al hotel",
        "Te gusta la ciudad",
        "Comes rapido o lento",
        "Quieres una llave",
        "Donde esta la silla",
        "Quieres ensalada",
        "Te gusta el te",
        "Quieres leche",
        "Donde esta el aeropuerto",
        "Quieres un boleto",
        "Esta cerrado el restaurante",
        "Quieres hablar manana",
        "Te levantas temprano",
        "Quieres caminar",
        "Donde esta tu familia"
    ],

    /* ============================================================
       A2 — Elementary (40 Prompts)
       ============================================================ */
    A2: [
        "Que hiciste ayer",
        "Fuiste al supermercado",
        "Viajas a menudo",
        "Que compraste la semana pasada",
        "Que haces hoy",
        "Sueles comer temprano",
        "Necesitas una reserva",
        "Donde esta la farmacia",
        "Compraste fruta",
        "Te gusta el desayuno",
        "Vas al centro",
        "Usas el transporte",
        "Celebraste el fin de semana",
        "Visitas a tu familia",
        "Comes arroz o pollo",
        "Ves peliculas a menudo",
        "Terminaste el trabajo",
        "Compraste pan y queso",
        "Fuiste al aeropuerto",
        "El avion llega temprano",
        "Que hiciste recientemente",
        "Comes cena con tu familia",
        "Visitas el centro a menudo",
        "Compraste algo barato",
        "Esta abierta la tienda",
        "Que vas a hacer manana",
        "Viajaste la semana pasada",
        "Comes en casa o fuera",
        "Usas redes sociales",
        "Que celebraste",
        "Compraste almuerzo",
        "Que vas a visitar manana",
        "Te gusta el almuerzo",
        "Comes sopa a menudo",
        "Que compraste hoy",
        "Vives cerca de la estacion",
        "Que haces por la manana",
        "Que haces por la tarde",
        "Que haces por la noche",
        "Que haces los fines de semana"
    ],

    /* ============================================================
       B1 — Intermediate (40 Prompts)
       ============================================================ */
    B1: [
        "Que piensas de tu ciudad",
        "Que aprendiste recientemente",
        "Como mantienes una vida saludable",
        "Que experiencias pasadas recuerdas",
        "Cuales son tus metas",
        "Disfrutas viajar",
        "Que planes futuros tienes",
        "Que habilidades quieres mejorar",
        "Que comunicacion es importante para ti",
        "Que haces en tu tiempo libre",
        "Que proyectos futuros tienes",
        "Que problemas diarios tienes",
        "Que libros lees",
        "Que conversaciones tienes cada dia",
        "Que redes sociales usas",
        "Que te parece interesante",
        "Que aprendiste el ultimo mes",
        "Que haces mientras trabajas",
        "Que haces mientras estudias",
        "Que te gusta aprender",
        "Que lugares visitas a menudo",
        "Que recuerdas de tu pasado",
        "Que te gusta de tu trabajo",
        "Que te gusta de tu familia",
        "Que te gusta de tu vida diaria",
        "Que haces los fines de semana",
        "Que haces por la manana",
        "Que haces por la tarde",
        "Que haces por la noche",
        "Que te gusta ver",
        "Que te gusta comer",
        "Que te gusta estudiar",
        "Que te gusta comprar",
        "Que te gusta visitar",
        "Que te gusta hacer con amigos",
        "Que te gusta hacer solo",
        "Que te gusta hacer en vacaciones",
        "Que te gusta hacer en casa",
        "Que te gusta hacer fuera de casa",
        "Que te gusta hacer en la ciudad"
    ],

    /* ============================================================
       B2 — Upper Intermediate (40 Prompts)
       ============================================================ */
    B2: [
        "Como manejas situaciones estresantes",
        "Cual es tu opinion sobre la tecnologia",
        "Como ha cambiado tu vida en los ultimos anos",
        "Que desafios enfrentas actualmente",
        "Que piensas del futuro",
        "Que cambios culturales ves",
        "Que estilo de vida quieres",
        "Que motivacion tienes para estudiar",
        "Que metas a largo plazo tienes",
        "Que ideas importantes tienes",
        "Que piensas de la educacion",
        "Que piensas de la sociedad",
        "Que piensas de la cultura",
        "Que piensas de la tecnologia",
        "Que piensas del trabajo remoto",
        "Que piensas de los cambios recientes",
        "Que piensas de la vida saludable",
        "Que piensas de los proyectos largos",
        "Que piensas de los desafios personales",
        "Que piensas de los desafios profesionales",
        "Que piensas de los desafios sociales",
        "Que piensas de los desafios culturales",
        "Que piensas de los desafios tecnologicos",
        "Que piensas de los desafios educativos",
        "Que piensas de los desafios familiares",
        "Que piensas de los desafios economicos",
        "Que piensas de los desafios globales",
        "Que piensas de los desafios futuros",
        "Que piensas de los cambios futuros",
        "Que piensas de los cambios personales",
        "Que piensas de los cambios profesionales",
        "Que piensas de los cambios sociales",
        "Que piensas de los cambios culturales",
        "Que piensas de los cambios tecnologicos",
        "Que piensas de los cambios educativos",
        "Que piensas de los cambios familiares",
        "Que piensas de los cambios economicos",
        "Que piensas de los cambios globales",
        "Que piensas de los cambios a largo plazo"
    ]
};


/* ============================================================
   CEFR TOPIC-BASED LISTENING PACKS — FOOD ONLY (A1 → B2)
   ============================================================ */

const CEFR_LISTENING_TOPICS = {
 food: {
  A1: [
    { spanish: "yo como pan", english: "I eat bread", audio: "yo-como-pan.mp3", question: "What does the speaker eat?" },
    { spanish: "ella come arroz", english: "she eats rice", audio: "ella-come-arroz.mp3", question: "What does she eat?" },
    { spanish: "el come pollo", english: "he eats chicken", audio: "el-come-pollo.mp3", question: "What does he eat?" },
    { spanish: "yo bebo agua", english: "I drink water", audio: "yo-bebo-agua.mp3", question: "What does the speaker drink?" },
    { spanish: "ella bebe cafe", english: "she drinks coffee", audio: "ella-bebe-cafe.mp3", question: "What does she drink?" },
    { spanish: "el bebe te", english: "he drinks tea", audio: "el-bebe-te.mp3", question: "What does he drink?" },
    { spanish: "yo como sopa", english: "I eat soup", audio: "yo-como-sopa.mp3", question: "What does the speaker eat?" },
    { spanish: "ella come ensalada", english: "she eats salad", audio: "ella-come-ensalada.mp3", question: "What does she eat?" },
    { spanish: "el come pan con mantequilla", english: "he eats bread with butter", audio: "el-come-pan-con-mantequilla.mp3", question: "What does he eat?" },
    { spanish: "yo bebo jugo", english: "I drink juice", audio: "yo-bebo-jugo.mp3", question: "What does the speaker drink?" }
    { spanish: "ella come comida", english: "she eats food", audio: "ella-come-comida.mp3", question: "What does she eat?" },
    { spanish: "el come desayuno", english: "he eats breakfast", audio: "el-come-desayuno.mp3", question: "What does he eat?" },
    { spanish: "yo como almuerzo", english: "I eat lunch", audio: "yo-como-almuerzo.mp3", question: "What does the speaker eat?" },
    { spanish: "ella come cena", english: "she eats dinner", audio: "ella-come-cena.mp3", question: "What does she eat?" },
    { spanish: "el bebe agua fria", english: "he drinks cold water", audio: "el-bebe-agua-fria.mp3", question: "What does he drink?" },
    { spanish: "yo como arroz con pollo", english: "I eat rice with chicken", audio: "yo-como-arroz-con-pollo.mp3", question: "What does the speaker eat?" },
    { spanish: "ella bebe te caliente", english: "she drinks hot tea", audio: "ella-bebe-te-caliente.mp3", question: "What does she drink?" },
    { spanish: "el come pan con queso", english: "he eats bread with cheese", audio: "el-come-pan-con-queso.mp3", question: "What does he eat?" },
    { spanish: "yo como comida simple", english: "I eat simple food", audio: "yo-como-comida-simple.mp3", question: "What does the speaker eat?" },
    { spanish: "ella bebe cafe cada dia", english: "she drinks coffee every day", audio: "ella-bebe-cafe-cada-dia.mp3", question: "What does she drink?" }
  ],


    /* ============================================================
       A2 — Elementary
       ============================================================ */
     A2: [
    { spanish: "yo comi arroz ayer", english: "I ate rice yesterday", audio: "yo-comi-arroz-ayer.mp3", question: "What did the speaker eat?" },
    { spanish: "ella bebio cafe por la manana", english: "she drank coffee in the morning", audio: "ella-bebio-cafe-por-la-manana.mp3", question: "When did she drink coffee?" },
    { spanish: "el comio pollo la semana pasada", english: "he ate chicken last week", audio: "el-comio-pollo-la-semana-pasada.mp3", question: "When did he eat chicken?" },
    { spanish: "yo bebi agua porque tenia sed", english: "I drank water because I was thirsty", audio: "yo-bebi-agua-porque-tenia-sed.mp3", question: "Why did the speaker drink water?" },
    { spanish: "ella comio sopa porque tenia hambre", english: "she ate soup because she was hungry", audio: "ella-comio-sopa-porque-tenia-hambre.mp3", question: "Why did she eat soup?" },
    { spanish: "el bebio jugo en el centro", english: "he drank juice in the center", audio: "el-bebio-jugo-en-el-centro.mp3", question: "Where did he drink juice?" },
    { spanish: "yo comi ensalada para el almuerzo", english: "I ate salad for lunch", audio: "yo-comi-ensalada-para-el-almuerzo.mp3", question: "What did the speaker eat for lunch?" },
    { spanish: "ella bebio agua fria ayer", english: "she drank cold water yesterday", audio: "ella-bebio-agua-fria-ayer.mp3", question: "When did she drink cold water?" },
    { spanish: "el comio pan con mantequilla por la tarde", english: "he ate bread with butter in the afternoon", audio: "el-comio-pan-con-mantequilla-por-la-tarde.mp3", question: "When did he eat bread with butter?" },
    { spanish: "yo bebi te sin azucar", english: "I drank tea without sugar", audio: "yo-bebi-te-sin-azucar.mp3", question: "How did the speaker drink the tea?" }
    { spanish: "ella comio arroz con pollo en casa", english: "she ate rice with chicken at home", audio: "ella-comio-arroz-con-pollo-en-casa.mp3", question: "Where did she eat rice with chicken?" },
    { spanish: "el bebio cafe en el trabajo", english: "he drank coffee at work", audio: "el-bebio-cafe-en-el-trabajo.mp3", question: "Where did he drink coffee?" },
    { spanish: "yo comi comida simple ayer", english: "I ate simple food yesterday", audio: "yo-comi-comida-simple-ayer.mp3", question: "What did the speaker eat?" },
    { spanish: "ella bebio jugo porque tenia calor", english: "she drank juice because she was hot", audio: "ella-bebio-jugo-porque-tenia-calor.mp3", question: "Why did she drink juice?" },
    { spanish: "el comio desayuno en el hotel", english: "he ate breakfast in the hotel", audio: "el-comio-desayuno-en-el-hotel.mp3", question: "Where did he eat breakfast?" },
    { spanish: "yo bebi agua en la tienda", english: "I drank water in the store", audio: "yo-bebi-agua-en-la-tienda.mp3", question: "Where did the speaker drink water?" },
    { spanish: "ella comio cena con su familia", english: "she ate dinner with her family", audio: "ella-comio-cena-con-su-familia.mp3", question: "Who did she eat dinner with?" },
    { spanish: "el bebio te caliente en la ciudad", english: "he drank hot tea in the city", audio: "el-bebio-te-caliente-en-la-ciudad.mp3", question: "Where did he drink hot tea?" },
    { spanish: "yo comi pan con queso ayer", english: "I ate bread with cheese yesterday", audio: "yo-comi-pan-con-queso-ayer.mp3", question: "What did the speaker eat?" },
    { spanish: "ella bebio agua cada dia", english: "she drank water every day", audio: "ella-bebio-agua-cada-dia.mp3", question: "How often did she drink water?" }
  ],


    /* ============================================================
       B1 — Intermediate
       ============================================================ */
      B1: [
    { spanish: "yo disfruto comer arroz con pollo", english: "I enjoy eating rice with chicken", audio: "yo-disfruto-comer-arroz-con-pollo.mp3", question: "What does the speaker enjoy eating?" },
    { spanish: "ella prefiere beber agua porque no quiere azucar", english: "she prefers to drink water because she does not want sugar", audio: "ella-prefiere-beber-agua-porque-no-quiere-azucar.mp3", question: "Why does she prefer water?" },
    { spanish: "el disfruta comer comida caliente", english: "he enjoys eating hot food", audio: "el-disfruta-comer-comida-caliente.mp3", question: "What does he enjoy eating?" },
    { spanish: "yo prefiero beber cafe por la manana", english: "I prefer to drink coffee in the morning", audio: "yo-prefiero-beber-cafe-por-la-manana.mp3", question: "When does the speaker prefer coffee?" },
    { spanish: "ella disfruta comer ensalada porque es saludable", english: "she enjoys eating salad because it is healthy", audio: "ella-disfruta-comer-ensalada-porque-es-saludable.mp3", question: "Why does she enjoy salad?" },
    { spanish: "el prefiere beber te cuando hace frio", english: "he prefers to drink tea when it is cold", audio: "el-prefiere-beber-te-cuando-hace-frio.mp3", question: "When does he prefer tea?" },
    { spanish: "yo disfruto comer comida simple en restaurantes nuevos", english: "I enjoy eating simple food in new restaurants", audio: "yo-disfruto-comer-comida-simple-en-restaurantes-nuevos.mp3", question: "Where does the speaker enjoy simple food?" },
    { spanish: "ella prefiere beber jugo porque esta cansada", english: "she prefers to drink juice because she is tired", audio: "ella-prefiere-beber-jugo-porque-esta-cansada.mp3", question: "Why does she prefer juice?" },
    { spanish: "el disfruta comer pan con mantequilla en casa", english: "he enjoys eating bread with butter at home", audio: "el-disfruta-comer-pan-con-mantequilla-en-casa.mp3", question: "Where does he enjoy bread with butter?" },
    { spanish: "yo prefiero beber agua fria para sentirme mejor", english: "I prefer to drink cold water to feel better", audio: "yo-prefiero-beber-agua-fria-para-sentirme-mejor.mp3", question: "Why does the speaker prefer cold water?" }
    { spanish: "ella disfruta comer arroz porque es su comida favorita", english: "she enjoys eating rice because it is her favorite food", audio: "ella-disfruta-comer-arroz-porque-es-su-comida-favorita.mp3", question: "Why does she enjoy rice?" },
    { spanish: "el prefiere beber cafe sin embargo quiere algo simple", english: "he prefers to drink coffee however he wants something simple", audio: "el-prefiere-beber-cafe-sin-embargo-quiere-algo-simple.mp3", question: "What does he want?" },
    { spanish: "yo disfruto comer sopa cuando hace frio", english: "I enjoy eating soup when it is cold", audio: "yo-disfruto-comer-sopa-cuando-hace-frio.mp3", question: "When does the speaker enjoy soup?" },
    { spanish: "ella prefiere beber agua para estar bien", english: "she prefers to drink water to feel well", audio: "ella-prefiere-beber-agua-para-estar-bien.mp3", question: "Why does she prefer water?" },
    { spanish: "el disfruta comer comida ligera para trabajar mejor", english: "he enjoys eating light food to work better", audio: "el-disfruta-comer-comida-ligera-para-trabajar-mejor.mp3", question: "Why does he enjoy light food?" },
    { spanish: "yo prefiero beber te sin embargo quiero buen sabor", english: "I prefer to drink tea however I want good flavor", audio: "yo-prefiero-beber-te-sin-embargo-quiero-buen-sabor.mp3", question: "What does the speaker want?" },
    { spanish: "ella disfruta comer comida simple para estar bien", english: "she enjoys eating simple food to feel well", audio: "ella-disfruta-comer-comida-simple-para-estar-bien.mp3", question: "Why does she enjoy simple food?" },
    { spanish: "el prefiere beber jugo para tener energia", english: "he prefers to drink juice to have energy", audio: "el-prefiere-beber-jugo-para-tener-energia.mp3", question: "Why does he prefer juice?" },
    { spanish: "yo disfruto comer pan con queso porque es facil", english: "I enjoy eating bread with cheese because it is easy", audio: "yo-disfruto-comer-pan-con-queso-porque-es-facil.mp3", question: "Why does the speaker enjoy bread with cheese?" },
    { spanish: "ella prefiere beber cafe para empezar el dia", english: "she prefers to drink coffee to start the day", audio: "ella-prefiere-beber-cafe-para-empezar-el-dia.mp3", question: "Why does she prefer coffee?" }
  ],


    /* ============================================================
       B2 — Upper Intermediate
       ============================================================ */
      B2: [
    { spanish: "yo como comida ligera para trabajar mejor en la tarde", english: "I eat light food to work better in the afternoon", audio: "yo-como-comida-ligera-para-trabajar-mejor-en-la-tarde.mp3", question: "Why does the speaker eat light food?" },
    { spanish: "ella prefiere beber agua por lo tanto no quiere bebidas dulces", english: "she prefers to drink water therefore she does not want sweet drinks", audio: "ella-prefiere-beber-agua-por-lo-tanto-no-quiere-bebidas-dulces.mp3", question: "What does she not want?" },
    { spanish: "el come sopa caliente a pesar de que hace calor", english: "he eats hot soup even though it is hot", audio: "el-come-sopa-caliente-a-pesar-de-que-hace-calor.mp3", question: "What does he eat?" },
    { spanish: "yo bebo cafe para tener energia en el trabajo", english: "I drink coffee to have energy at work", audio: "yo-bebo-cafe-para-tener-energia-en-el-trabajo.mp3", question: "Why does the speaker drink coffee?" },
    { spanish: "ella come ensalada sin embargo tambien quiere pan", english: "she eats salad however she also wants bread", audio: "ella-come-ensalada-sin-embargo-tambien-quiere-pan.mp3", question: "What else does she want?" },
    { spanish: "el bebe jugo para estar bien durante el dia", english: "he drinks juice to feel well during the day", audio: "el-bebe-jugo-para-estar-bien-durante-el-dia.mp3", question: "Why does he drink juice?" },
    { spanish: "yo como arroz con pollo para tener energia en el viaje", english: "I eat rice with chicken to have energy on the trip", audio: "yo-como-arroz-con-pollo-para-tener-energia-en-el-viaje.mp3", question: "Why does the speaker eat rice with chicken?" },
    { spanish: "ella bebe te para sentirme mejor despues del trabajo", english: "she drinks tea to feel better after work", audio: "ella-bebe-te-para-sentirme-mejor-despues-del-trabajo.mp3", question: "Why does she drink tea?" },
    { spanish: "el come comida simple sin embargo quiere buen sabor", english: "he eats simple food however he wants good flavor", audio: "el-come-comida-simple-sin-embargo-quiere-buen-sabor.mp3", question: "What does he want?" },
    { spanish: "yo bebo agua para estar bien en el dia", english: "I drink water to feel well during the day", audio: "yo-bebo-agua-para-estar-bien-en-el-dia.mp3", question: "Why does the speaker drink water?" }
       { spanish: "ella come comida saludable para tener energia", 
      english: "she eats healthy food to have energy", 
      audio: "ella-come-comida-saludable-para-tener-energia.mp3", 
      question: "Why does she eat healthy food?" },

    { spanish: "el bebe cafe sin embargo quiere algo simple", 
      english: "he drinks coffee however he wants something simple", 
      audio: "el-bebe-cafe-sin-embargo-quiere-algo-simple.mp3", 
      question: "What does he want?" },

    { spanish: "yo como comida simple para estar bien en el trabajo", 
      english: "I eat simple food to feel well at work", 
      audio: "yo-como-comida-simple-para-estar-bien-en-el-trabajo.mp3", 
      question: "Why does the speaker eat simple food?" },

    { spanish: "ella bebe agua para estar mejor despues del trabajo", 
      english: "she drinks water to feel better after work", 
      audio: "ella-bebe-agua-para-estar-mejor-despues-del-trabajo.mp3", 
      question: "Why does she drink water?" },

    { spanish: "el come comida ligera a pesar de estar cansado", 
      english: "he eats light food despite being tired", 
      audio: "el-come-comida-ligera-a-pesar-de-estar-cansado.mp3", 
      question: "Why does he eat light food?" },

    { spanish: "yo bebo jugo para tener energia en el dia", 
      english: "I drink juice to have energy during the day", 
      audio: "yo-bebo-jugo-para-tener-energia-en-el-dia.mp3", 
      question: "Why does the speaker drink juice?" },

    { spanish: "ella come comida simple sin embargo quiere buen servicio", 
      english: "she eats simple food however she wants good service", 
      audio: "ella-come-comida-simple-sin-embargo-quiere-buen-servicio.mp3", 
      question: "What does she want?" },

    { spanish: "el bebe agua por lo tanto no quiere otras bebidas", 
      english: "he drinks water therefore he does not want other drinks", 
      audio: "el-bebe-agua-por-lo-tanto-no-quiere-otras-bebidas.mp3", 
      question: "What does he not want?" },

    { spanish: "yo como comida ligera para estar bien durante el dia", 
      english: "I eat light food to feel well during the day", 
      audio: "yo-como-comida-ligera-para-estar-bien-durante-el-dia.mp3", 
      question: "Why does the speaker eat light food?" },

    { spanish: "ella bebe te sin embargo quiere buen sabor", 
      english: "she drinks tea however she wants good flavor", 
      audio: "ella-bebe-te-sin-embargo-quiere-buen-sabor.mp3", 
      question: "What does she want?" }
  ]
}

   /* ============================================================
   TRAVEL — CEFR Listening Packs (A1 → B2)
   ============================================================ */

const CEFR_LISTENING_TOPICS = {

  travel: {

    /* ============================================================
       A1 — Beginner (20 items)
       ============================================================ */
    A1: [
      { spanish: "donde esta la parada de autobus", english: "where is the bus stop", audio: "donde-esta-la-parada-de-autobus.mp3", question: "What place is the speaker looking for?" },
      { spanish: "el aeropuerto esta abierto", english: "the airport is open", audio: "el-aeropuerto-esta-abierto.mp3", question: "Is the airport open?" },
      { spanish: "quiero un boleto", english: "I want a ticket", audio: "quiero-un-boleto.mp3", question: "What does the speaker want?" },
      { spanish: "donde esta el hotel", english: "where is the hotel", audio: "donde-esta-el-hotel.mp3", question: "What place is the speaker looking for?" },
      { spanish: "ella vive cerca de la estacion", english: "she lives near the station", audio: "ella-vive-cerca-de-la-estacion.mp3", question: "Where does she live?" },
      { spanish: "quiero ir al aeropuerto", english: "I want to go to the airport", audio: "quiero-ir-al-aeropuerto.mp3", question: "Where does the speaker want to go?" },
      { spanish: "el autobus llega temprano", english: "the bus arrives early", audio: "el-autobus-llega-temprano.mp3", question: "When does the bus arrive?" },
      { spanish: "la estacion esta cerrada", english: "the station is closed", audio: "la-estacion-esta-cerrada.mp3", question: "Is the station open?" },
      { spanish: "quiero viajar hoy", english: "I want to travel today", audio: "quiero-viajar-hoy.mp3", question: "When does the speaker want to travel?" },
      { spanish: "ella quiere ir al centro", english: "she wants to go to the center", audio: "ella-quiere-ir-al-centro.mp3", question: "Where does she want to go?" },
      { spanish: "donde esta la parada de tren", english: "where is the train stop", audio: "donde-esta-la-parada-de-tren.mp3", question: "What place is the speaker looking for?" },
      { spanish: "el hotel esta cerca del aeropuerto", english: "the hotel is near the airport", audio: "el-hotel-esta-cerca-del-aeropuerto.mp3", question: "Where is the hotel?" },
      { spanish: "quiero un boleto barato", english: "I want a cheap ticket", audio: "quiero-un-boleto-barato.mp3", question: "What kind of ticket does the speaker want?" },
      { spanish: "ella vive lejos del centro", english: "she lives far from the center", audio: "ella-vive-lejos-del-centro.mp3", question: "Where does she live?" },
      { spanish: "el tren llega tarde", english: "the train arrives late", audio: "el-tren-llega-tarde.mp3", question: "When does the train arrive?" },
      { spanish: "la estacion esta abierta", english: "the station is open", audio: "la-estacion-esta-abierta.mp3", question: "Is the station open?" },
      { spanish: "quiero ir a la ciudad", english: "I want to go to the city", audio: "quiero-ir-a-la-ciudad.mp3", question: "Where does the speaker want to go?" },
      { spanish: "ella quiere viajar manana", english: "she wants to travel tomorrow", audio: "ella-quiere-viajar-manana.mp3", question: "When does she want to travel?" },
      { spanish: "nosotros viajamos en autobus", english: "we travel by bus", audio: "nosotros-viajamos-en-autobus.mp3", question: "How do they travel?" },
      { spanish: "yo quiero ir a la estacion", english: "I want to go to the station", audio: "yo-quiero-ir-a-la-estacion.mp3", question: "Where does the speaker want to go?" }
    ],

    /* ============================================================
       A2 — Elementary (20 items)
       ============================================================ */
    A2: [
      { spanish: "fuiste al aeropuerto", english: "did you go to the airport", audio: "fuiste-al-aeropuerto.mp3", question: "Where might the listener have gone?" },
      { spanish: "viajamos a menudo", english: "we travel often", audio: "viajamos-a-menudo.mp3", question: "How often do they travel?" },
      { spanish: "el avion llega temprano", english: "the plane arrives early", audio: "el-avion-llega-temprano.mp3", question: "When does the plane arrive?" },
      { spanish: "visitas el centro a menudo", english: "you visit the center often", audio: "visitas-el-centro-a-menudo.mp3", question: "How often does the listener visit the center?" },
      { spanish: "viajaste la semana pasada", english: "you traveled last week", audio: "viajaste-la-semana-pasada.mp3", question: "When did the listener travel?" },
      { spanish: "vas a visitar manana", english: "you will visit tomorrow", audio: "vas-a-visitar-manana.mp3", question: "When will the visit happen?" },
      { spanish: "ella visita a su familia", english: "she visits her family", audio: "ella-visita-a-su-familia.mp3", question: "Who does she visit?" },
      { spanish: "yo visite ayer", english: "I visited yesterday", audio: "yo-visite-ayer.mp3", question: "When did the speaker visit?" },
      { spanish: "el usa transporte cada dia", english: "he uses transport every day", audio: "el-usa-transporte-cada-dia.mp3", question: "What does he use?" },
      { spanish: "ella compro un boleto barato", english: "she bought a cheap ticket", audio: "ella-compro-un-boleto-barato.mp3", question: "What did she buy?" },
      { spanish: "nosotros viajamos en tren", english: "we travel by train", audio: "nosotros-viajamos-en-tren.mp3", question: "How do they travel?" },
      { spanish: "fuiste al centro ayer", english: "you went to the center yesterday", audio: "fuiste-al-centro-ayer.mp3", question: "When did the listener go to the center?" },
      { spanish: "viajamos juntos la semana pasada", english: "we traveled together last week", audio: "viajamos-juntos-la-semana-pasada.mp3", question: "When did they travel together?" },
      { spanish: "ella usa transporte publico", english: "she uses public transport", audio: "ella-usa-transporte-publico.mp3", question: "What does she use?" },
      { spanish: "yo compre un boleto ayer", english: "I bought a ticket yesterday", audio: "yo-compre-un-boleto-ayer.mp3", question: "What did the speaker buy?" },
      { spanish: "el viaja a menudo por trabajo", english: "he travels often for work", audio: "el-viaja-a-menudo-por-trabajo.mp3", question: "Why does he travel often?" },
      { spanish: "ella visito la ciudad el fin de semana", english: "she visited the city on the weekend", audio: "ella-visito-la-ciudad-el-fin-de-semana.mp3", question: "When did she visit the city?" },
      { spanish: "nosotros usamos transporte para ir al centro", english: "we use transport to go to the center", audio: "nosotros-usamos-transporte-para-ir-al-centro.mp3", question: "Why do they use transport?" },
      { spanish: "yo viaje en avion ayer", english: "I traveled by plane yesterday", audio: "yo-viaje-en-avion-ayer.mp3", question: "How did the speaker travel?" },
      { spanish: "el compro boletos para su familia", english: "he bought tickets for his family", audio: "el-compro-boletos-para-su-familia.mp3", question: "Who did he buy tickets for?" }
    ],

    /* ============================================================
       B1 — Intermediate (20 items)
       ============================================================ */
    B1: [
      { spanish: "disfruto viajar con amigos", english: "I enjoy traveling with friends", audio: "disfruto-viajar-con-amigos.mp3", question: "Who does the speaker travel with?" },
      { spanish: "planeamos viajes futuros", english: "we plan future trips", audio: "planeamos-viajes-futuros.mp3", question: "What do they plan?" },
      { spanish: "ella viaja sola a menudo", english: "she travels alone often", audio: "ella-viaja-sola-a-menudo.mp3", question: "How does she travel?" },
      { spanish: "el recuerda viajes pasados", english: "he remembers past trips", audio: "el-recuerda-viajes-pasados.mp3", question: "What does he remember?" },
      { spanish: "yo quiero viajar mas", english: "I want to travel more", audio: "yo-quiero-viajar-mas.mp3", question: "What does the speaker want?" },
      { spanish: "ella visita lugares nuevos", english: "she visits new places", audio: "ella-visita-lugares-nuevos.mp3", question: "What does she visit?" },
      { spanish: "ellos viajan juntos los fines de semana", english: "they travel together on weekends", audio: "ellos-viajan-juntos-los-fines-de-semana.mp3", question: "When do they travel together?" },
      { spanish: "yo uso transporte para viajar", english: "I use transport to travel", audio: "yo-uso-transporte-para-viajar.mp3", question: "What does the speaker use to travel?" },
      { spanish: "ella disfruta viajar por la ciudad", english: "she enjoys traveling through the city", audio: "ella-disfruta-viajar-por-la-ciudad.mp3", question: "Where does she enjoy traveling?" },
      { spanish: "nosotros hablamos sobre viajes futuros", english: "we talk about future trips", audio: "nosotros-hablamos-sobre-viajes-futuros.mp3", question: "What do they talk about?" },
      { spanish: "el viaja por trabajo cada mes", english: "he travels for work every month", audio: "el-viaja-por-trabajo-cada-mes.mp3", question: "Why does he travel?" },
      { spanish: "ella planea un viaje con su familia", english: "she plans a trip with her family", audio: "ella-planea-un-viaje-con-su-familia.mp3", question: "Who does she plan a trip with?" },
      { spanish: "yo recuerdo un viaje interesante", english: "I remember an interesting trip", audio: "yo-recuerdo-un-viaje-interesante.mp3", question: "What does the speaker remember?" },
      { spanish: "ellos visitan ciudades nuevas cada ano", english: "they visit new cities every year", audio: "ellos-visitan-ciudades-nuevas-cada-ano.mp3", question: "What do they visit?" },
      { spanish: "nosotros usamos transporte publico en la ciudad", english: "we use public transport in the city", audio: "nosotros-usamos-transporte-publico-en-la-ciudad.mp3", question: "What do they use?" },
      { spanish: "ella disfruta viajar en tren", english: "she enjoys traveling by train", audio: "ella-disfruta-viajar-en-tren.mp3", question: "How does she enjoy traveling?" },
      { spanish: "yo hablo sobre viajes con mis amigos", english: "I talk about trips with my friends", audio: "yo-hablo-sobre-viajes-con-mis-amigos.mp3", question: "Who does the speaker talk with?" },
      { spanish: "el planea visitar el centro manana", english: "he plans to visit the center tomorrow", audio: "el-planea-visitar-el-centro-manana.mp3", question: "When will he visit the center?" },
      { spanish: "ella viaja a menudo para ver a su familia", english: "she travels often to see her family", audio: "ella-viaja-a-menudo-para-ver-a-su-familia.mp3", question: "Why does she travel often?" },
      { spanish: "nosotros organizamos viajes largos cada ano", english: "we organize long trips every year", audio: "nosotros-organizamos-viajes-largos-cada-ano.mp3", question: "What do they organize?" }
    ],

    /* ============================================================
       B2 — Upper Intermediate (20 items)
       ============================================================ */
   B2: [
  { spanish: "la tecnologia cambia como viajamos", english: "technology changes how we travel", audio: "la-tecnologia-cambia-como-viajamos.mp3", question: "What does technology change?" },

  { spanish: "la cultura afecta nuestras decisiones de viaje", english: "culture affects our travel decisions", audio: "la-cultura-afecta-nuestras-decisiones-de-viaje.mp3", question: "What affects travel decisions?" },

  { spanish: "viajar crea oportunidades importantes", english: "travel creates important opportunities", audio: "viajar-crea-oportunidades-importantes.mp3", question: "What does travel create?" },

  { spanish: "analizamos cambios en la forma de viajar", english: "we analyze changes in the way we travel", audio: "analizamos-cambios-en-la-forma-de-viajar.mp3", question: "What do they analyze?" },

  { spanish: "ella viaja a pesar de los desafios", english: "she travels despite the challenges", audio: "ella-viaja-a-pesar-de-los-desafios.mp3", question: "What does she travel despite?" },

  { spanish: "el trabaja remoto por lo tanto viaja mas", english: "he works remotely therefore he travels more", audio: "el-trabaja-remoto-por-lo-tanto-viaja-mas.mp3", question: "Why does he travel more?" },

  { spanish: "ellos viajan juntos sin embargo tienen horarios diferentes", english: "they travel together however they have different schedules", audio: "ellos-viajan-juntos-sin-embargo-tienen-horarios-diferentes.mp3", question: "What do they do together?" },

  { spanish: "ella estudia viajes culturales para oportunidades futuras", english: "she studies cultural travel for future opportunities", audio: "ella-estudia-viajes-culturales-para-oportunidades-futuras.mp3", question: "Why does she study cultural travel?" },

  { spanish: "yo analizo destinos para proyectos largos", english: "I analyze destinations for long-term projects", audio: "yo-analizo-destinos-para-proyectos-largos.mp3", question: "What does the speaker analyze?" },

  { spanish: "la sociedad enfrenta nuevos desafios de viaje", english: "society faces new travel challenges", audio: "la-sociedad-enfrenta-nuevos-desafios-de-viaje.mp3", question: "What does society face?" },

  { spanish: "la tecnologia cambia la experiencia de viaje", english: "technology changes the travel experience", audio: "la-tecnologia-cambia-la-experiencia-de-viaje.mp3", question: "What does technology change?" },

  { spanish: "la educacion influye en como viajamos", english: "education influences how we travel", audio: "la-educacion-influye-en-como-viajamos.mp3", question: "What influences how we travel?" },

  { spanish: "analizamos el impacto cultural del turismo", english: "we analyze the cultural impact of tourism", audio: "analizamos-el-impacto-cultural-del-turismo.mp3", question: "What do they analyze?" },

  { spanish: "ella viaja para proyectos a largo plazo", english: "she travels for long-term projects", audio: "ella-viaja-para-proyectos-a-largo-plazo.mp3", question: "Why does she travel?" },

  { spanish: "el estudia rutas de viaje eficientes", english: "he studies efficient travel routes", audio: "el-estudia-rutas-de-viaje-eficientes.mp3", question: "What does he study?" },

  { spanish: "nosotros discutimos desafios de transporte", english: "we discuss transport challenges", audio: "nosotros-discutimos-desafios-de-transporte.mp3", question: "What do they discuss?" },

  { spanish: "ella analiza como la cultura afecta el viaje", english: "she analyzes how culture affects travel", audio: "ella-analiza-como-la-cultura-afecta-el-viaje.mp3", question: "What does she analyze?" },

  { spanish: "yo manejo decisiones de viaje en proyectos largos", english: "I handle travel decisions in long-term projects", audio: "yo-manejo-decisiones-de-viaje-en-proyectos-largos.mp3", question: "What kind of decisions does the speaker handle?" },

  { spanish: "ellos cambian sus planes de viaje por nuevos desafios", english: "they change their travel plans because of new challenges", audio: "ellos-cambian-sus-planes-de-viaje-por-nuevos-desafios.mp3", question: "Why do they change their travel plans?" },

  { spanish: "la sociedad analiza el futuro del transporte", english: "society analyzes the future of transport", audio: "la-sociedad-analiza-el-futuro-del-transporte.mp3", question: "What does society analyze?" }
    ]
    },

   /* ============================================================
   WORK — CEFR Listening Packs (A1 → B2)
   ============================================================ */

const CEFR_LISTENING_TOPICS = {

  work: {

    /* ============================================================
       A1 — Beginner (20 items)
       ============================================================ */
    A1: [
      { spanish: "tu trabajas en una tienda", english: "you work in a store", audio: "tu-trabajas-en-una-tienda.mp3", question: "Where does the listener work?" },
      { spanish: "yo trabajo en la ciudad", english: "I work in the city", audio: "yo-trabajo-en-la-ciudad.mp3", question: "Where does the speaker work?" },
      { spanish: "el trabaja en un hotel", english: "he works in a hotel", audio: "el-trabaja-en-un-hotel.mp3", question: "Where does he work?" },
      { spanish: "ella trabaja en una farmacia", english: "she works in a pharmacy", audio: "ella-trabaja-en-una-farmacia.mp3", question: "Where does she work?" },
      { spanish: "nosotros trabajamos juntos", english: "we work together", audio: "nosotros-trabajamos-juntos.mp3", question: "How do they work?" },
      { spanish: "yo estudio y trabajo", english: "I study and work", audio: "yo-estudio-y-trabajo.mp3", question: "What does the speaker do?" },
      { spanish: "el trabaja en el centro", english: "he works in the center", audio: "el-trabaja-en-el-centro.mp3", question: "Where does he work?" },
      { spanish: "ella trabaja en una tienda de comida", english: "she works in a food store", audio: "ella-trabaja-en-una-tienda-de-comida.mp3", question: "Where does she work?" },
      { spanish: "yo trabajo por la manana", english: "I work in the morning", audio: "yo-trabajo-por-la-manana.mp3", question: "When does the speaker work?" },
      { spanish: "nosotros trabajamos en un supermercado", english: "we work in a supermarket", audio: "nosotros-trabajamos-en-un-supermercado.mp3", question: "Where do they work?" },
      { spanish: "el trabaja en una estacion", english: "he works in a station", audio: "el-trabaja-en-una-estacion.mp3", question: "Where does he work?" },
      { spanish: "ella trabaja cerca del centro", english: "she works near the center", audio: "ella-trabaja-cerca-del-centro.mp3", question: "Where does she work?" },
      { spanish: "yo trabajo en un hotel pequeno", english: "I work in a small hotel", audio: "yo-trabajo-en-un-hotel-pequeno.mp3", question: "Where does the speaker work?" },
      { spanish: "nosotros trabajamos en la ciudad", english: "we work in the city", audio: "nosotros-trabajamos-en-la-ciudad.mp3", question: "Where do they work?" },
      { spanish: "el trabaja en una tienda barata", english: "he works in a cheap store", audio: "el-trabaja-en-una-tienda-barata.mp3", question: "Where does he work?" },
      { spanish: "ella trabaja en un restaurante", english: "she works in a restaurant", audio: "ella-trabaja-en-un-restaurante.mp3", question: "Where does she work?" },
      { spanish: "yo trabajo con mi amigo", english: "I work with my friend", audio: "yo-trabajo-con-mi-amigo.mp3", question: "Who does the speaker work with?" },
      { spanish: "nosotros trabajamos en una farmacia", english: "we work in a pharmacy", audio: "nosotros-trabajamos-en-una-farmacia.mp3", question: "Where do they work?" },
      { spanish: "el trabaja en una tienda de ropa", english: "he works in a clothing store", audio: "el-trabaja-en-una-tienda-de-ropa.mp3", question: "Where does he work?" },
      { spanish: "ella trabaja en una oficina", english: "she works in an office", audio: "ella-trabaja-en-una-oficina.mp3", question: "Where does she work?" }
    ],

    /* ============================================================
       A2 — Elementary (20 items)
       ============================================================ */
    A2: [
      { spanish: "el trabaja cada manana", english: "he works every morning", audio: "el-trabaja-cada-manana.mp3", question: "When does he work?" },
      { spanish: "yo termine el trabajo temprano", english: "I finished work early", audio: "yo-termine-el-trabajo-temprano.mp3", question: "When did the speaker finish work?" },
      { spanish: "ella trabaja en el centro de la ciudad", english: "she works in the city center", audio: "ella-trabaja-en-el-centro-de-la-ciudad.mp3", question: "Where does she work?" },
      { spanish: "nosotros usamos transporte para ir al trabajo", english: "we use transport to go to work", audio: "nosotros-usamos-transporte-para-ir-al-trabajo.mp3", question: "Why do they use transport?" },
      { spanish: "yo compre almuerzo para el trabajo", english: "I bought lunch for work", audio: "yo-compre-almuerzo-para-el-trabajo.mp3", question: "What did the speaker buy?" },
      { spanish: "el trabaja en un supermercado grande", english: "he works in a big supermarket", audio: "el-trabaja-en-un-supermercado-grande.mp3", question: "Where does he work?" },
      { spanish: "ella termino el trabajo ayer", english: "she finished work yesterday", audio: "ella-termino-el-trabajo-ayer.mp3", question: "When did she finish work?" },
      { spanish: "yo trabajo a menudo por la tarde", english: "I often work in the afternoon", audio: "yo-trabajo-a-menudo-por-la-tarde.mp3", question: "When does the speaker often work?" },
      { spanish: "nosotros trabajamos juntos la semana pasada", english: "we worked together last week", audio: "nosotros-trabajamos-juntos-la-semana-pasada.mp3", question: "When did they work together?" },
      { spanish: "el usa transporte para ir al trabajo", english: "he uses transport to go to work", audio: "el-usa-transporte-para-ir-al-trabajo.mp3", question: "Why does he use transport?" },
      { spanish: "ella compro comida para el trabajo", english: "she bought food for work", audio: "ella-compro-comida-para-el-trabajo.mp3", question: "What did she buy?" },
      { spanish: "yo trabaje en la ciudad ayer", english: "I worked in the city yesterday", audio: "yo-trabaje-en-la-ciudad-ayer.mp3", question: "Where did the speaker work?" },
      { spanish: "nosotros terminamos el trabajo tarde", english: "we finished work late", audio: "nosotros-terminamos-el-trabajo-tarde.mp3", question: "When did they finish work?" },
      { spanish: "el trabaja en una oficina pequena", english: "he works in a small office", audio: "el-trabaja-en-una-oficina-pequena.mp3", question: "Where does he work?" },
      { spanish: "ella trabaja con su familia", english: "she works with her family", audio: "ella-trabaja-con-su-familia.mp3", question: "Who does she work with?" },
      { spanish: "yo uso transporte para ir al centro de trabajo", english: "I use transport to go to the work center", audio: "yo-uso-transporte-para-ir-al-centro-de-trabajo.mp3", question: "Why does the speaker use transport?" },
      { spanish: "nosotros trabajamos en proyectos pequenos", english: "we work on small projects", audio: "nosotros-trabajamos-en-proyectos-pequenos.mp3", question: "What do they work on?" },
      { spanish: "el termino el trabajo la semana pasada", english: "he finished work last week", audio: "el-termino-el-trabajo-la-semana-pasada.mp3", question: "When did he finish work?" },
      { spanish: "ella trabaja en el centro cada dia", english: "she works in the center every day", audio: "ella-trabaja-en-el-centro-cada-dia.mp3", question: "How often does she work in the center?" },
      { spanish: "yo compre boletos para ir al trabajo", english: "I bought tickets to go to work", audio: "yo-compre-boletos-para-ir-al-trabajo.mp3", question: "What did the speaker buy?" }
    ],

    /* ============================================================
       B1 — Intermediate (20 items)
       ============================================================ */
    B1: [
      { spanish: "ella es desarrollador y trabaja en proyectos largos", english: "she is a developer and works on long projects", audio: "ella-es-desarrollador-y-trabaja-en-proyectos-largos.mp3", question: "What is her job?" },
      { spanish: "el quiere mejorar sus habilidades en el trabajo", english: "he wants to improve his skills at work", audio: "el-quiere-mejorar-sus-habilidades-en-el-trabajo.mp3", question: "What does he want to improve?" },
      { spanish: "nosotros hablamos sobre problemas diarios en el trabajo", english: "we talk about daily problems at work", audio: "nosotros-hablamos-sobre-problemas-diarios-en-el-trabajo.mp3", question: "What do they talk about?" },
      { spanish: "yo disfruto trabajar con mi equipo", english: "I enjoy working with my team", audio: "yo-disfruto-trabajar-con-mi-equipo.mp3", question: "Who does the speaker enjoy working with?" },
      { spanish: "ella estudia para mejorar su comunicacion en el trabajo", english: "she studies to improve her communication at work", audio: "ella-estudia-para-mejorar-su-comunicacion-en-el-trabajo.mp3", question: "Why does she study?" },
      { spanish: "el usa redes sociales para su trabajo", english: "he uses social networks for his work", audio: "el-usa-redes-sociales-para-su-trabajo.mp3", question: "What does he use for work?" },
      { spanish: "nosotros tenemos reuniones diarias", english: "we have daily meetings", audio: "nosotros-tenemos-reuniones-diarias.mp3", question: "How often do they have meetings?" },
      { spanish: "yo leo correos cada manana", english: "I read emails every morning", audio: "yo-leo-correos-cada-manana.mp3", question: "What does the speaker read?" },
      { spanish: "ella trabaja mientras estudia", english: "she works while she studies", audio: "ella-trabaja-mientras-estudia.mp3", question: "What does she do while studying?" },
      { spanish: "el disfruta su tiempo libre despues del trabajo", english: "he enjoys his free time after work", audio: "el-disfruta-su-tiempo-libre-despues-del-trabajo.mp3", question: "When does he enjoy free time?" },
      { spanish: "nosotros planeamos proyectos futuros en el trabajo", english: "we plan future projects at work", audio: "nosotros-planeamos-proyectos-futuros-en-el-trabajo.mp3", question: "What do they plan?" },
      { spanish: "yo hablo con mi jefe sobre nuevas ideas", english: "I talk with my boss about new ideas", audio: "yo-hablo-con-mi-jefe-sobre-nuevas-ideas.mp3", question: "Who does the speaker talk with?" },
      { spanish: "ella usa tecnologia para mejorar su trabajo", english: "she uses technology to improve her work", audio: "ella-usa-tecnologia-para-mejorar-su-trabajo.mp3", question: "What does she use to improve her work?" },
      { spanish: "el estudia para tener mejores oportunidades de trabajo", english: "he studies to have better work opportunities", audio: "el-estudia-para-tener-mejores-oportunidades-de-trabajo.mp3", question: "Why does he study?" },
      { spanish: "nosotros analizamos problemas en el equipo", english: "we analyze problems in the team", audio: "nosotros-analizamos-problemas-en-el-equipo.mp3", question: "What do they analyze?" },
      { spanish: "yo escribo informes cada semana", english: "I write reports every week", audio: "yo-escribo-informes-cada-semana.mp3", question: "What does the speaker write?" },
      { spanish: "ella organiza reuniones importantes", english: "she organizes important meetings", audio: "ella-organiza-reuniones-importantes.mp3", question: "What does she organize?" },
      { spanish: "el trabaja en proyectos internacionales", english: "he works on international projects", audio: "el-trabaja-en-proyectos-internacionales.mp3", question: "What kind of projects does he work on?" },
      { spanish: "nosotros hablamos sobre cambios en el trabajo", english: "we talk about changes at work", audio: "nosotros-hablamos-sobre-cambios-en-el-trabajo.mp3", question: "What do they talk about?" },
      { spanish: "yo disfruto aprender cosas nuevas en el trabajo", english: "I enjoy learning new things at work", audio: "yo-disfruto-aprender-cosas-nuevas-en-el-trabajo.mp3", question: "What does the speaker enjoy learning?" }
    ],

    /* ============================================================
       B2 — Upper Intermediate (20 items)
       ============================================================ */
   B2: [
  { spanish: "la tecnologia cambia la forma de trabajar", english: "technology changes the way we work", audio: "la-tecnologia-cambia-la-forma-de-trabajar.mp3", question: "What does technology change?" },

  { spanish: "la educacion es importante para el desarrollo profesional", english: "education is important for professional development", audio: "la-educacion-es-importante-para-el-desarrollo-profesional.mp3", question: "What is education important for?" },

  { spanish: "analizamos desafios en el lugar de trabajo", english: "we analyze challenges in the workplace", audio: "analizamos-desafios-en-el-lugar-de-trabajo.mp3", question: "What do they analyze?" },

  { spanish: "ella maneja proyectos a largo plazo", english: "she handles long-term projects", audio: "ella-maneja-proyectos-a-largo-plazo.mp3", question: "What kind of projects does she handle?" },

  { spanish: "yo estudio nuevas habilidades para mejorar mi trabajo", english: "I study new skills to improve my work", audio: "yo-estudio-nuevas-habilidades-para-mejorar-mi-trabajo.mp3", question: "Why does the speaker study new skills?" },

  { spanish: "ellos enfrentan desafios importantes en su empresa", english: "they face important challenges in their company", audio: "ellos-enfrentan-desafios-importantes-en-su-empresa.mp3", question: "What do they face?" },

  { spanish: "ella trabaja remoto sin embargo colabora con su equipo", english: "she works remotely however she collaborates with her team", audio: "ella-trabaja-remoto-sin-embargo-colabora-con-su-equipo.mp3", question: "How does she work?" },

  { spanish: "el organiza reuniones por lo tanto mejora la comunicacion", english: "he organizes meetings therefore he improves communication", audio: "el-organiza-reuniones-por-lo-tanto-mejora-la-comunicacion.mp3", question: "What does he improve?" },

  { spanish: "nosotros discutimos cambios culturales en el trabajo", english: "we discuss cultural changes at work", audio: "nosotros-discutimos-cambios-culturales-en-el-trabajo.mp3", question: "What do they discuss?" },

  { spanish: "ella analiza como la sociedad afecta el trabajo", english: "she analyzes how society affects work", audio: "ella-analiza-como-la-sociedad-afecta-el-trabajo.mp3", question: "What does she analyze?" },

  { spanish: "la motivacion ayuda a lograr metas profesionales", english: "motivation helps achieve professional goals", audio: "la-motivacion-ayuda-a-lograr-metas-profesionales.mp3", question: "What does motivation help achieve?" },

  { spanish: "la cultura de la empresa cambia con el tiempo", english: "company culture changes over time", audio: "la-cultura-de-la-empresa-cambia-con-el-tiempo.mp3", question: "What changes over time?" },

  { spanish: "analizamos el impacto de la tecnologia en el trabajo", english: "we analyze the impact of technology at work", audio: "analizamos-el-impacto-de-la-tecnologia-en-el-trabajo.mp3", question: "What do they analyze?" },

  { spanish: "ella estudia comunicacion para proyectos internacionales", english: "she studies communication for international projects", audio: "ella-estudia-comunicacion-para-proyectos-internacionales.mp3", question: "Why does she study communication?" },

  { spanish: "el maneja decisiones importantes en la empresa", english: "he handles important decisions in the company", audio: "el-maneja-decisiones-importantes-en-la-empresa.mp3", question: "What does he handle?" },

  { spanish: "nosotros discutimos el futuro del trabajo remoto", english: "we discuss the future of remote work", audio: "nosotros-discutimos-el-futuro-del-trabajo-remoto.mp3", question: "What do they discuss?" },

  { spanish: "ella analiza como la educacion afecta el trabajo", english: "she analyzes how education affects work", audio: "ella-analiza-como-la-educacion-afecta-el-trabajo.mp3", question: "What does she analyze?" },

  { spanish: "yo manejo proyectos largos a pesar de los desafios", english: "I handle long projects despite the challenges", audio: "yo-manejo-proyectos-largos-a-pesar-de-los-desafios.mp3", question: "What does the speaker handle?" },

  { spanish: "ellos cambian su forma de trabajar por nuevos desafios", english: "they change their way of working because of new challenges", audio: "ellos-cambian-su-forma-de-trabajar-por-nuevos-desafios.mp3", question: "Why do they change their way of working?" },

  { spanish: "la sociedad analiza el futuro del trabajo", english: "society analyzes the future of work", audio: "la-sociedad-analiza-el-futuro-del-trabajo.mp3", question: "What does society analyze?" }
]

    },

    /* ============================================================
   FAMILY — CEFR Listening Packs (A1 → B2)
   ============================================================ */

const CEFR_LISTENING_TOPICS = {

  family: {

    /* ============================================================
       A1 — Beginner (20 items)
       ============================================================ */
    A1: [
      { spanish: "tengo hermanos y hermanas", english: "I have brothers and sisters", audio: "tengo-hermanos-y-hermanas.mp3", question: "Who does the speaker have?" },
      { spanish: "ella es mi hermana", english: "she is my sister", audio: "ella-es-mi-hermana.mp3", question: "Who is she?" },
      { spanish: "el es mi hermano", english: "he is my brother", audio: "el-es-mi-hermano.mp3", question: "Who is he?" },
      { spanish: "nosotros somos familia", english: "we are family", audio: "nosotros-somos-familia.mp3", question: "What is their relationship?" },
      { spanish: "yo vivo con mi familia", english: "I live with my family", audio: "yo-vivo-con-mi-familia.mp3", question: "Who does the speaker live with?" },
      { spanish: "ella vive con sus padres", english: "she lives with her parents", audio: "ella-vive-con-sus-padres.mp3", question: "Who does she live with?" },
      { spanish: "el vive con su hermano", english: "he lives with his brother", audio: "el-vive-con-su-hermano.mp3", question: "Who does he live with?" },
      { spanish: "nosotros comemos juntos en familia", english: "we eat together as a family", audio: "nosotros-comemos-juntos-en-familia.mp3", question: "When do they eat together?" },
      { spanish: "yo hablo con mi familia cada dia", english: "I talk with my family every day", audio: "yo-hablo-con-mi-familia-cada-dia.mp3", question: "Who does the speaker talk with?" },
      { spanish: "ella visita a su familia", english: "she visits her family", audio: "ella-visita-a-su-familia.mp3", question: "Who does she visit?" },
      { spanish: "el tiene una familia grande", english: "he has a big family", audio: "el-tiene-una-familia-grande.mp3", question: "What kind of family does he have?" },
      { spanish: "yo tengo una familia pequena", english: "I have a small family", audio: "yo-tengo-una-familia-pequena.mp3", question: "What kind of family does the speaker have?" },
      { spanish: "nosotros vivimos juntos", english: "we live together", audio: "nosotros-vivimos-juntos.mp3", question: "How do they live?" },
      { spanish: "ella come con su familia", english: "she eats with her family", audio: "ella-come-con-su-familia.mp3", question: "Who does she eat with?" },
      { spanish: "el habla con su hermana", english: "he talks with his sister", audio: "el-habla-con-su-hermana.mp3", question: "Who does he talk with?" },
      { spanish: "yo juego con mi hermano", english: "I play with my brother", audio: "yo-juego-con-mi-hermano.mp3", question: "Who does the speaker play with?" },
      { spanish: "nosotros visitamos a nuestros padres", english: "we visit our parents", audio: "nosotros-visitamos-a-nuestros-padres.mp3", question: "Who do they visit?" },
      { spanish: "ella vive cerca de su familia", english: "she lives near her family", audio: "ella-vive-cerca-de-su-familia.mp3", question: "Where does she live?" },
      { spanish: "el come con su familia cada noche", english: "he eats with his family every night", audio: "el-come-con-su-familia-cada-noche.mp3", question: "When does he eat with his family?" },
      { spanish: "yo hablo con mi madre", english: "I talk with my mother", audio: "yo-hablo-con-mi-madre.mp3", question: "Who does the speaker talk with?" }
    ],

    /* ============================================================
       A2 — Elementary (20 items)
       ============================================================ */
    A2: [
      { spanish: "celebramos con nuestra familia el fin de semana", english: "we celebrated with our family on the weekend", audio: "celebramos-con-nuestra-familia-el-fin-de-semana.mp3", question: "Who did they celebrate with?" },
      { spanish: "ella visito a su familia ayer", english: "she visited her family yesterday", audio: "ella-visito-a-su-familia-ayer.mp3", question: "When did she visit her family?" },
      { spanish: "yo comi con mi familia la semana pasada", english: "I ate with my family last week", audio: "yo-comi-con-mi-familia-la-semana-pasada.mp3", question: "When did the speaker eat with family?" },
      { spanish: "el viajo para ver a su familia", english: "he traveled to see his family", audio: "el-viajo-para-ver-a-su-familia.mp3", question: "Why did he travel?" },
      { spanish: "nosotros visitamos a nuestra familia a menudo", english: "we visit our family often", audio: "nosotros-visitamos-a-nuestra-familia-a-menudo.mp3", question: "How often do they visit family?" },
      { spanish: "ella compro comida para su familia", english: "she bought food for her family", audio: "ella-compro-comida-para-su-familia.mp3", question: "What did she buy?" },
      { spanish: "yo hable con mi padre ayer", english: "I talked with my father yesterday", audio: "yo-hable-con-mi-padre-ayer.mp3", question: "Who did the speaker talk with?" },
      { spanish: "el comio con su familia en el centro", english: "he ate with his family in the center", audio: "el-comio-con-su-familia-en-el-centro.mp3", question: "Where did he eat with his family?" },
      { spanish: "nosotros celebramos el cumpleanos en familia", english: "we celebrated the birthday with family", audio: "nosotros-celebramos-el-cumpleanos-en-familia.mp3", question: "What did they celebrate?" },
      { spanish: "ella visito a sus padres la semana pasada", english: "she visited her parents last week", audio: "ella-visito-a-sus-padres-la-semana-pasada.mp3", question: "When did she visit her parents?" },
      { spanish: "yo comi cena con mi familia ayer", english: "I ate dinner with my family yesterday", audio: "yo-comi-cena-con-mi-familia-ayer.mp3", question: "When did the speaker eat dinner with family?" },
      { spanish: "el hablo con su madre por la tarde", english: "he talked with his mother in the afternoon", audio: "el-hablo-con-su-madre-por-la-tarde.mp3", question: "When did he talk with his mother?" },
      { spanish: "nosotros visitamos a nuestra familia en la ciudad", english: "we visited our family in the city", audio: "nosotros-visitamos-a-nuestra-familia-en-la-ciudad.mp3", question: "Where did they visit family?" },
      { spanish: "ella compro regalos para su familia", english: "she bought gifts for her family", audio: "ella-compro-regalos-para-su-familia.mp3", question: "What did she buy?" },
      { spanish: "yo hable con mi hermano la semana pasada", english: "I talked with my brother last week", audio: "yo-hable-con-mi-hermano-la-semana-pasada.mp3", question: "Who did the speaker talk with?" },
      { spanish: "el comio almuerzo con su familia", english: "he ate lunch with his family", audio: "el-comio-almuerzo-con-su-familia.mp3", question: "What meal did he eat with family?" },
      { spanish: "nosotros celebramos juntos en familia", english: "we celebrated together as a family", audio: "nosotros-celebramos-juntos-en-familia.mp3", question: "How did they celebrate?" },
      { spanish: "ella visito a su familia en el centro", english: "she visited her family in the center", audio: "ella-visito-a-su-familia-en-el-centro.mp3", question: "Where did she visit her family?" },
      { spanish: "yo comi con mi familia en casa", english: "I ate with my family at home", audio: "yo-comi-con-mi-familia-en-casa.mp3", question: "Where did the speaker eat with family?" },
      { spanish: "el hablo con su padre por la noche", english: "he talked with his father at night", audio: "el-hablo-con-su-padre-por-la-noche.mp3", question: "When did he talk with his father?" }
    ],

    /* ============================================================
       B1 — Intermediate (20 items)
       ============================================================ */
    B1: [
      { spanish: "disfruto pasar tiempo con mi familia", english: "I enjoy spending time with my family", audio: "disfruto-pasar-tiempo-con-mi-familia.mp3", question: "Who does the speaker enjoy spending time with?" },
      { spanish: "ella habla con su familia sobre problemas diarios", english: "she talks with her family about daily problems", audio: "ella-habla-con-su-familia-sobre-problemas-diarios.mp3", question: "What does she talk about?" },
      { spanish: "el recuerda experiencias pasadas con su familia", english: "he remembers past experiences with his family", audio: "el-recuerda-experiencias-pasadas-con-su-familia.mp3", question: "What does he remember?" },
      { spanish: "nosotros tenemos conversaciones diarias en familia", english: "we have daily conversations as a family", audio: "nosotros-tenemos-conversaciones-diarias-en-familia.mp3", question: "How often do they have conversations?" },
      { spanish: "yo hablo con mis padres sobre el futuro", english: "I talk with my parents about the future", audio: "yo-hablo-con-mis-padres-sobre-el-futuro.mp3", question: "Who does the speaker talk with?" },
      { spanish: "ella disfruta viajar con su familia", english: "she enjoys traveling with her family", audio: "ella-disfruta-viajar-con-su-familia.mp3", question: "Who does she enjoy traveling with?" },
      { spanish: "el come con su familia los fines de semana", english: "he eats with his family on weekends", audio: "el-come-con-su-familia-los-fines-de-semana.mp3", question: "When does he eat with his family?" },
      { spanish: "nosotros hablamos sobre planes futuros en familia", english: "we talk about future plans as a family", audio: "nosotros-hablamos-sobre-planes-futuros-en-familia.mp3", question: "What do they talk about?" },
      { spanish: "yo recuerdo viajes con mi familia", english: "I remember trips with my family", audio: "yo-recuerdo-viajes-con-mi-familia.mp3", question: "What does the speaker remember?" },
      { spanish: "ella estudia para ayudar a su familia", english: "she studies to help her family", audio: "ella-estudia-para-ayudar-a-su-familia.mp3", question: "Why does she study?" },
      { spanish: "el habla con su hermano sobre problemas", english: "he talks with his brother about problems", audio: "el-habla-con-su-hermano-sobre-problemas.mp3", question: "Who does he talk with?" },
      { spanish: "nosotros visitamos a nuestra familia cada ano", english: "we visit our family every year", audio: "nosotros-visitamos-a-nuestra-familia-cada-ano.mp3", question: "How often do they visit family?" },
      { spanish: "yo disfruto comer con mi familia en casa", english: "I enjoy eating with my family at home", audio: "yo-disfruto-comer-con-mi-familia-en-casa.mp3", question: "Where does the speaker enjoy eating with family?" },
      { spanish: "ella habla con su madre sobre su trabajo", english: "she talks with her mother about her work", audio: "ella-habla-con-su-madre-sobre-su-trabajo.mp3", question: "What does she talk about?" },
      { spanish: "el recuerda celebraciones en familia", english: "he remembers family celebrations", audio: "el-recuerda-celebraciones-en-familia.mp3", question: "What does he remember?" },
      { spanish: "nosotros hablamos sobre cambios en la familia", english: "we talk about changes in the family", audio: "nosotros-hablamos-sobre-cambios-en-la-familia.mp3", question: "What do they talk about?" },
      { spanish: "yo estudio para tener un futuro mejor para mi familia", english: "I study to have a better future for my family", audio: "yo-estudio-para-tener-un-futuro-mejor-para-mi-familia.mp3", question: "Why does the speaker study?" },
      { spanish: "ella disfruta pasar tiempo libre con su familia", english: "she enjoys spending free time with her family", audio: "ella-disfruta-pasar-tiempo-libre-con-su-familia.mp3", question: "What does she enjoy doing?" },
      { spanish: "el habla con su familia sobre decisiones importantes", english: "he talks with his family about important decisions", audio: "el-habla-con-su-familia-sobre-decisiones-importantes.mp3", question: "What does he talk about?" },
      { spanish: "nosotros organizamos reuniones familiares cada mes", english: "we organize family meetings every month", audio: "nosotros-organizamos-reuniones-familiares-cada-mes.mp3", question: "What do they organize?" }
    ],

    /* ============================================================
   B2 — Upper Intermediate (20 items)
   ============================================================ */
B2: [
  { spanish: "la familia es importante para la sociedad", english: "family is important for society", audio: "la-familia-es-importante-para-la-sociedad.mp3", question: "What is important for society?" },

  { spanish: "analizamos cambios en la estructura familiar", english: "we analyze changes in the family structure", audio: "analizamos-cambios-en-la-estructura-familiar.mp3", question: "What do they analyze?" },

  { spanish: "ella maneja decisiones familiares importantes", english: "she handles important family decisions", audio: "ella-maneja-decisiones-familiares-importantes.mp3", question: "What does she handle?" },

  { spanish: "yo estudio como la cultura afecta la familia", english: "I study how culture affects the family", audio: "yo-estudio-como-la-cultura-afecta-la-familia.mp3", question: "What does the speaker study?" },

  { spanish: "ellos enfrentan desafios familiares a pesar de los problemas", english: "they face family challenges despite the problems", audio: "ellos-enfrentan-desafios-familiares-a-pesar-de-los-problemas.mp3", question: "What do they face?" },

  { spanish: "ella analiza el impacto de la educacion en la familia", english: "she analyzes the impact of education on the family", audio: "ella-analiza-el-impacto-de-la-educacion-en-la-familia.mp3", question: "What does she analyze?" },

  { spanish: "el trabaja mucho por lo tanto ayuda a su familia", english: "he works a lot therefore he helps his family", audio: "el-trabaja-mucho-por-lo-tanto-ayuda-a-su-familia.mp3", question: "Why does he help his family?" },

  { spanish: "nosotros discutimos decisiones familiares importantes", english: "we discuss important family decisions", audio: "nosotros-discutimos-decisiones-familiares-importantes.mp3", question: "What do they discuss?" },

  { spanish: "ella estudia cambios culturales en la familia", english: "she studies cultural changes in the family", audio: "ella-estudia-cambios-culturales-en-la-familia.mp3", question: "What does she study?" },

  { spanish: "yo manejo proyectos largos para apoyar a mi familia", english: "I handle long projects to support my family", audio: "yo-manejo-proyectos-largos-para-apoyar-a-mi-familia.mp3", question: "Why does the speaker handle long projects?" },

  { spanish: "la sociedad analiza el papel de la familia en el futuro", english: "society analyzes the role of the family in the future", audio: "la-sociedad-analiza-el-papel-de-la-familia-en-el-futuro.mp3", question: "What does society analyze?" },

  { spanish: "la cultura familiar cambia con el tiempo", english: "family culture changes over time", audio: "la-cultura-familiar-cambia-con-el-tiempo.mp3", question: "What changes over time?" },

  { spanish: "analizamos como la tecnologia afecta la familia", english: "we analyze how technology affects the family", audio: "analizamos-como-la-tecnologia-afecta-la-familia.mp3", question: "What do they analyze?" },

  { spanish: "ella maneja conflictos familiares a pesar de los desafios", english: "she handles family conflicts despite the challenges", audio: "ella-maneja-conflictos-familiares-a-pesar-de-los-desafios.mp3", question: "What does she handle?" },

  { spanish: "el estudia educacion para apoyar a su familia", english: "he studies education to support his family", audio: "el-estudia-educacion-para-apoyar-a-su-familia.mp3", question: "Why does he study education?" },

  { spanish: "nosotros discutimos el futuro de nuestra familia", english: "we discuss the future of our family", audio: "nosotros-discutimos-el-futuro-de-nuestra-familia.mp3", question: "What do they discuss?" },

  { spanish: "ella analiza decisiones familiares a largo plazo", english: "she analyzes long-term family decisions", audio: "ella-analiza-decisiones-familiares-a-largo-plazo.mp3", question: "What does she analyze?" },

  { spanish: "yo estudio como la sociedad afecta la familia", english: "I study how society affects the family", audio: "yo-estudio-como-la-sociedad-afecta-la-familia.mp3", question: "What does the speaker study?" },

  { spanish: "ellos cambian su vida para apoyar a la familia", english: "they change their life to support the family", audio: "ellos-cambian-su-vida-para-apoyar-a-la-familia.mp3", question: "Why do they change their life?" },

  { spanish: "la familia enfrenta desafios importantes en la sociedad moderna", english: "the family faces important challenges in modern society", audio: "la-familia-enfrenta-desafios-importantes-en-la-sociedad-moderna.mp3", question: "What does the family face?" }
]

ordering: {

    /* ============================================================
       A1 — Beginner (20 items)
       ============================================================ */
    A1: [
        { spanish: "quiero agua por favor", english: "I want water please", audio: "quiero-agua-por-favor.mp3", question: "What does the speaker want?" },
        { spanish: "quiero cafe", english: "I want coffee", audio: "quiero-cafe.mp3", question: "What does the speaker want?" },
        { spanish: "quiero te", english: "I want tea", audio: "quiero-te.mp3", question: "What does the speaker want?" },
        { spanish: "quiero sopa", english: "I want soup", audio: "quiero-sopa.mp3", question: "What does the speaker want?" },
        { spanish: "quiero jugo", english: "I want juice", audio: "quiero-jugo.mp3", question: "What does the speaker want?" },
        { spanish: "quiero arroz con pollo", english: "I want rice with chicken", audio: "quiero-arroz-con-pollo.mp3", question: "What does the speaker want?" },
        { spanish: "quiero pan con mantequilla", english: "I want bread with butter", audio: "quiero-pan-con-mantequilla.mp3", question: "What does the speaker want?" },
        { spanish: "quiero una botella de agua", english: "I want a bottle of water", audio: "quiero-una-botella-de-agua.mp3", question: "What does the speaker want?" },
        { spanish: "quiero una ensalada", english: "I want a salad", audio: "quiero-una-ensalada.mp3", question: "What does the speaker want?" },
        { spanish: "quiero un cafe pequeno", english: "I want a small coffee", audio: "quiero-un-cafe-pequeno.mp3", question: "What does the speaker want?" },
        { spanish: "quiero comida", english: "I want food", audio: "quiero-comida.mp3", question: "What does the speaker want?" },
        { spanish: "quiero un desayuno simple", english: "I want a simple breakfast", audio: "quiero-un-desayuno-simple.mp3", question: "What does the speaker want?" },
        { spanish: "quiero un almuerzo rapido", english: "I want a quick lunch", audio: "quiero-un-almuerzo-rapido.mp3", question: "What does the speaker want?" },
        { spanish: "quiero un cafe para llevar", english: "I want a coffee to go", audio: "quiero-un-cafe-para-llevar.mp3", question: "What does the speaker want?" },
        { spanish: "quiero agua fria", english: "I want cold water", audio: "quiero-agua-fria.mp3", question: "What does the speaker want?" },
        { spanish: "quiero te caliente", english: "I want hot tea", audio: "quiero-te-caliente.mp3", question: "What does the speaker want?" },
        { spanish: "quiero pan", english: "I want bread", audio: "quiero-pan.mp3", question: "What does the speaker want?" },
        { spanish: "quiero pollo", english: "I want chicken", audio: "quiero-pollo.mp3", question: "What does the speaker want?" },
        { spanish: "quiero arroz", english: "I want rice", audio: "quiero-arroz.mp3", question: "What does the speaker want?" },
        { spanish: "quiero comida para hoy", english: "I want food for today", audio: "quiero-comida-para-hoy.mp3", question: "What does the speaker want?" }
    ],

    /* ============================================================
       A2 — Elementary (20 items)
       ============================================================ */
    A2: [
        { spanish: "quiero un cafe grande por favor", english: "I want a large coffee please", audio: "quiero-un-cafe-grande-por-favor.mp3", question: "What size coffee does the speaker want?" },
        { spanish: "quiero una sopa porque tengo hambre", english: "I want soup because I am hungry", audio: "quiero-una-sopa-porque-tengo-hambre.mp3", question: "Why does the speaker want soup?" },
        { spanish: "quiero arroz con pollo para el almuerzo", english: "I want rice with chicken for lunch", audio: "quiero-arroz-con-pollo-para-el-almuerzo.mp3", question: "What meal is the speaker ordering for?" },
        { spanish: "quiero un te sin azucar", english: "I want tea without sugar", audio: "quiero-un-te-sin-azucar.mp3", question: "How does the speaker want the tea?" },
        { spanish: "quiero una ensalada con pan", english: "I want a salad with bread", audio: "quiero-una-ensalada-con-pan.mp3", question: "What does the speaker want with the salad?" },
        { spanish: "quiero agua fria por favor", english: "I want cold water please", audio: "quiero-agua-fria-por-favor.mp3", question: "What kind of water does the speaker want?" },
        { spanish: "quiero un jugo porque tengo sed", english: "I want juice because I am thirsty", audio: "quiero-un-jugo-porque-tengo-sed.mp3", question: "Why does the speaker want juice?" },
        { spanish: "quiero un cafe para llevar", english: "I want a coffee to go", audio: "quiero-un-cafe-para-llevar.mp3", question: "How does the speaker want the coffee?" },
        { spanish: "quiero pan con queso para la manana", english: "I want bread with cheese for the morning", audio: "quiero-pan-con-queso-para-la-manana.mp3", question: "What does the speaker want for the morning?" },
        { spanish: "quiero una comida simple hoy", english: "I want a simple meal today", audio: "quiero-una-comida-simple-hoy.mp3", question: "What kind of meal does the speaker want?" },
        { spanish: "yo compre comida para el almuerzo", english: "I bought food for lunch", audio: "yo-compre-comida-para-el-almuerzo.mp3", question: "What did the speaker buy?" },
        { spanish: "ella pidio agua en el restaurante", english: "she ordered water in the restaurant", audio: "ella-pidio-agua-en-el-restaurante.mp3", question: "What did she order?" },
        { spanish: "nosotros pedimos sopa ayer", english: "we ordered soup yesterday", audio: "nosotros-pedimos-sopa-ayer.mp3", question: "What did they order?" },
        { spanish: "el pidio un cafe en el hotel", english: "he ordered a coffee in the hotel", audio: "el-pidio-un-cafe-en-el-hotel.mp3", question: "Where did he order coffee?" },
        { spanish: "yo pedi comida en el aeropuerto", english: "I ordered food at the airport", audio: "yo-pedi-comida-en-el-aeropuerto.mp3", question: "Where did the speaker order food?" },
        { spanish: "ella pidio una ensalada en el centro", english: "she ordered a salad in the city center", audio: "ella-pidio-una-ensalada-en-el-centro.mp3", question: "Where did she order the salad?" },
        { spanish: "nosotros pedimos bebidas para la cena", english: "we ordered drinks for dinner", audio: "nosotros-pedimos-bebidas-para-la-cena.mp3", question: "What did they order?" },
        { spanish: "el pidio arroz con pollo ayer", english: "he ordered rice with chicken yesterday", audio: "el-pidio-arroz-con-pollo-ayer.mp3", question: "When did he order rice with chicken?" },
        { spanish: "yo pedi un jugo en la tienda", english: "I ordered a juice in the store", audio: "yo-pedi-un-jugo-en-la-tienda.mp3", question: "Where did the speaker order juice?" },
        { spanish: "ella pidio comida para llevar", english: "she ordered food to go", audio: "ella-pidio-comida-para-llevar.mp3", question: "How did she want the food?" }
    ],

    /* ============================================================
       B1 — Intermediate (20 items)
       ============================================================ */
    B1: [
        { spanish: "prefiero un cafe porque necesito energia", english: "I prefer coffee because I need energy", audio: "prefiero-un-cafe-porque-necesito-energia.mp3", question: "Why does the speaker prefer coffee?" },
        { spanish: "quiero una sopa simple porque no tengo mucho tiempo", english: "I want simple soup because I don't have much time", audio: "quiero-una-sopa-simple-porque-no-tengo-mucho-tiempo.mp3", question: "Why does the speaker want simple soup?" },
        { spanish: "me gusta pedir arroz con pollo cuando viajo", english: "I like to order rice with chicken when I travel", audio: "me-gusta-pedir-arroz-con-pollo-cuando-viajo.mp3", question: "When does the speaker like to order rice with chicken?" },
        { spanish: "quiero un te caliente porque hace frio", english: "I want hot tea because it is cold", audio: "quiero-un-te-caliente-porque-hace-frio.mp3", question: "Why does the speaker want hot tea?" },
        { spanish: "prefiero agua porque no quiero azucar", english: "I prefer water because I don't want sugar", audio: "prefiero-agua-porque-no-quiero-azucar.mp3", question: "Why does the speaker prefer water?" },
        { spanish: "quiero una ensalada porque quiero comer saludable", english: "I want a salad because I want to eat healthy", audio: "quiero-una-ensalada-porque-quiero-comer-saludable.mp3", question: "Why does the speaker want a salad?" },
        { spanish: "me gusta pedir comida simple en restaurantes nuevos", english: "I like to order simple food in new restaurants", audio: "me-gusta-pedir-comida-simple-en-restaurantes-nuevos.mp3", question: "Where does the speaker like to order simple food?" },
        { spanish: "quiero un cafe sin embargo no quiero algo muy dulce", english: "I want coffee however I don't want something very sweet", audio: "quiero-un-cafe-sin-embargo-no-quiero-algo-muy-dulce.mp3", question: "What does the speaker not want?" },
        { spanish: "quiero un jugo porque estoy cansado", english: "I want juice because I am tired", audio: "quiero-un-jugo-porque-estoy-cansado.mp3", question: "Why does the speaker want juice?" },
        { spanish: "prefiero comida caliente para sentirme mejor", english: "I prefer hot food to feel better", audio: "prefiero-comida-caliente-para-sentirme-mejor.mp3", question: "Why does the speaker prefer hot food?" },
        { spanish: "ella pide comida saludable cada dia", english: "she orders healthy food every day", audio: "ella-pide-comida-saludable-cada-dia.mp3", question: "How often does she order healthy food?" },
        { spanish: "yo pido cafe en el trabajo cada manana", english: "I order coffee at work every morning", audio: "yo-pido-cafe-en-el-trabajo-cada-manana.mp3", question: "Where does the speaker order coffee?" },
        { spanish: "nosotros pedimos comida simple cuando estamos ocupados", english: "we order simple food when we are busy", audio: "nosotros-pedimos-comida-simple-cuando-estamos-ocupados.mp3", question: "When do they order simple food?" },
        { spanish: "ella pide agua porque no quiere cafe", english: "she orders water because she doesn't want coffee", audio: "ella-pide-agua-porque-no-quiere-cafe.mp3", question: "Why does she order water?" },
        { spanish: "yo pido comida para llevar cuando tengo prisa", english: "I order food to go when I am in a hurry", audio: "yo-pido-comida-para-llevar-cuando-tengo-prisa.mp3", question: "When does the speaker order food to go?" },
        { spanish: "el pide sopa porque quiere algo caliente", english: "he orders soup because he wants something hot", audio: "el-pide-sopa-porque-quiere-algo-caliente.mp3", question: "Why does he order soup?" },
        { spanish: "nosotros pedimos bebidas para compartir", english: "we order drinks to share", audio: "nosotros-pedimos-bebidas-para-compartir.mp3", question: "Why do they order drinks?" },
        { spanish: "ella pide comida en el hotel cuando viaja", english: "she orders food in the hotel when she travels", audio: "ella-pide-comida-en-el-hotel-cuando-viaja.mp3", question: "Where does she order food?" },
        { spanish: "yo pido arroz con pollo porque es mi comida favorita", english: "I order rice with chicken because it is my favorite food", audio: "yo-pido-arroz-con-pollo-porque-es-mi-comida-favorita.mp3", question: "Why does the speaker order rice with chicken?" },
        { spanish: "ellos piden comida simple para estar bien", english: "they order simple food to feel well", audio: "ellos-piden-comida-simple-para-estar-bien.mp3", question: "Why do they order simple food?" }
    ],

    /* ============================================================
       B2 — Upper Intermediate (20 items)
       ============================================================ */
    B2: [
        { spanish: "quiero un cafe para empezar bien el dia", english: "I want coffee to start the day well", audio: "quiero-un-cafe-para-empezar-bien-el-dia.mp3", question: "Why does the speaker want coffee?" },
        { spanish: "prefiero comida simple sin embargo quiero probar algo nuevo", english: "I prefer simple food however I want to try something new", audio: "prefiero-comida-simple-sin-embargo-quiero-probar-algo-nuevo.mp3", question: "What does the speaker want to try?" },
        { spanish: "quiero una sopa caliente a pesar de que hace calor", english: "I want hot soup even though it is hot", audio: "quiero-una-sopa-caliente-a-pesar-de-que-hace-calor.mp3", question: "What does the speaker want?" },
        { spanish: "quiero un te para sentirme mejor despues del trabajo", english: "I want tea to feel better after work", audio: "quiero-un-te-para-sentirme-mejor-despues-del-trabajo.mp3", question: "Why does the speaker want tea?" },
        { spanish: "prefiero agua por lo tanto no quiero bebidas dulces", english: "I prefer water therefore I don't want sweet drinks", audio: "prefiero-agua-por-lo-tanto-no-quiero-bebidas-dulces.mp3", question: "What does the speaker not want?" },
        { spanish: "quiero arroz con pollo para tener energia en el viaje", english: "I want rice with chicken to have energy on the trip", audio: "quiero-arroz-con-pollo-para-tener-energia-en-el-viaje.mp3", question: "Why does the speaker want rice with chicken?" },
        { spanish: "quiero una ensalada sin embargo tambien quiero pan", english: "I want a salad however I also want bread", audio: "quiero-una-ensalada-sin-embargo-tambien-quiero-pan.mp3", question: "What else does the speaker want?" },
        { spanish: "quiero un cafe para trabajar mejor en la tarde", english: "I want coffee to work better in the afternoon", audio: "quiero-un-cafe-para-trabajar-mejor-en-la-tarde.mp3", question: "Why does the speaker want coffee?" },
        { spanish: "prefiero comida ligera a pesar de tener hambre", english: "I prefer light food despite being hungry", audio: "prefiero-comida-ligera-a-pesar-de-tener-hambre.mp3", question: "What does the speaker prefer?" },
        { spanish: "quiero un jugo para estar bien durante el dia", english: "I want juice to feel well during the day", audio: "quiero-un-jugo-para-estar-bien-durante-el-dia.mp3", question: "Why does the speaker want juice?" },
        { spanish: "ella pide comida saludable para tener energia", english: "she orders healthy food to have energy", audio: "ella-pide-comida-saludable-para-tener-energia.mp3", question: "Why does she order healthy food?" },
       { spanish: "yo pido cafe sin embargo quiero algo simple", english: "I order coffee however I want something simple", audio: "yo-pido-cafe-sin-embargo-quiero-algo-simple.mp3", question: "What does the speaker want?" },

  { spanish: "nosotros pedimos comida para estar mejor en el viaje", english: "we order food to feel better on the trip", audio: "nosotros-pedimos-comida-para-estar-mejor-en-el-viaje.mp3", question: "Why do they order food?" },

  { spanish: "ella pide una ensalada para comer ligero", english: "she orders a salad to eat light", audio: "ella-pide-una-ensalada-para-comer-ligero.mp3", question: "Why does she order a salad?" },

  { spanish: "yo pido comida simple sin embargo quiero buen sabor", english: "I order simple food however I want good flavor", audio: "yo-pido-comida-simple-sin-embargo-quiero-buen-sabor.mp3", question: "What does the speaker want?" },

  { spanish: "ellos piden bebidas para tener energia en el dia", english: "they order drinks to have energy during the day", audio: "ellos-piden-bebidas-para-tener-energia-en-el-dia.mp3", question: "Why do they order drinks?" },

  { spanish: "ella pide comida ligera a pesar de estar cansada", english: "she orders light food despite being tired", audio: "ella-pide-comida-ligera-a-pesar-de-estar-cansada.mp3", question: "Why does she order light food?" },

  { spanish: "yo pido arroz con pollo para estar bien en el trabajo", english: "I order rice with chicken to feel well at work", audio: "yo-pido-arroz-con-pollo-para-estar-bien-en-el-trabajo.mp3", question: "Why does the speaker order rice with chicken?" },

  { spanish: "nosotros pedimos comida simple sin embargo queremos buen servicio", english: "we order simple food however we want good service", audio: "nosotros-pedimos-comida-simple-sin-embargo-queremos-buen-servicio.mp3", question: "What do they want?" },

  { spanish: "ella pide bebidas para estar mejor despues del trabajo", english: "she orders drinks to feel better after work", audio: "ella-pide-bebidas-para-estar-mejor-despues-del-trabajo.mp3", question: "Why does she order drinks?" }
]
function loadListening(topic, level) {
    const bank = CEFR_LISTENING_TOPICS[topic][level];
    return bank[Math.floor(Math.random() * bank.length)];
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
   LISTEN TAB — TOPIC-BASED SPA RENDERER
   ============================================================ */

function renderListen() {
    updateTabHeader("listen");

    const container = document.getElementById("listen-content");

    const topic = appState.listenTopic;      // "food", "travel", "work", "family"
    const level = appState.currentLevel;     // "A1", "A2", "B1", "B2"

    const item = loadListening(topic, level);

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Listen — ${topic.toUpperCase()} (${level})</h2>
            <p>Tap play to hear the sentence. Use autoplay to cycle through all items.</p>

            <div class="listen-player-controls" style="
                display:flex;
                gap:6px;
                flex-wrap:wrap;
                margin-top:6px;
                justify-content:flex-start;
            ">
                <button class="pill" id="listen-play">Play</button>
                <button class="pill" id="listen-playall">Play All</button>
                <button class="pill" id="listen-pause">Pause</button>
                <button class="pill" id="listen-resume">Resume</button>
                <button class="pill" id="listen-stop">Stop</button>
            </div>
        </div>

        <div class="glass-panel" style="margin-top:12px;">
            <h3>Sentence</h3>
            <p style="font-size:1.2rem;">${item.spanish}</p>
            <p style="opacity:0.7;">${item.english}</p>
        </div>

        <div class="glass-panel" style="margin-top:12px;">
            <h3>Question</h3>
            <p>${item.question}</p>
        </div>

        <div class="glass-panel" style="margin-top:12px;">
            <h3>Topic</h3>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="pill listen-topic" data-topic="food">Food</button>
                <button class="pill listen-topic" data-topic="travel">Travel</button>
                <button class="pill listen-topic" data-topic="work">Work</button>
                <button class="pill listen-topic" data-topic="family">Family</button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    /* ============================================================
       TOPIC SWITCHER
       ============================================================ */
    container.querySelectorAll(".listen-topic").forEach(btn => {
        btn.addEventListener("click", () => {
            appState.listenTopic = btn.dataset.topic;
            renderListen();
        });
    });

    /* ============================================================
       SINGLE PLAYBACK
       ============================================================ */
    document.getElementById("listen-play").onclick = () => {
        playAudio(item.audio);
    };

    /* ============================================================
       AUTO PLAY — PLAY ALL ITEMS IN TOPIC + LEVEL
       ============================================================ */
    listenAutoPlay.list = CEFR_LISTENING_TOPICS[topic][level].map(i => i.audio);

    document.getElementById("listen-playall").onclick = () => {
        listenAutoPlay.active = true;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        playNextListenAudio();
    };

    document.getElementById("listen-pause").onclick = () => {
        listenAutoPlay.paused = true;
        if (speechSynthesis.pause) speechSynthesis.pause();
    };

    document.getElementById("listen-resume").onclick = () => {
        listenAutoPlay.paused = false;
        if (speechSynthesis.resume) speechSynthesis.resume();
        playNextListenAudio();
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
function playNextListenAudio() {
    if (!listenAutoPlay.active || listenAutoPlay.paused) return;

    const list = listenAutoPlay.list;
    if (listenAutoPlay.index >= list.length) {
        listenAutoPlay.active = false;
        return;
    }

    const audioFile = list[listenAutoPlay.index];
    const utter = new SpeechSynthesisUtterance(audioFile.replace(".mp3", ""));
    utter.lang = "es-ES";
    utter.rate = appState.speechRate;

    utter.onend = () => {
        if (!listenAutoPlay.paused) {
            listenAutoPlay.index++;
            setTimeout(playNextListenAudio, 500);
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



