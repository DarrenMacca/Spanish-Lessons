/* ============================================================
   CERTIFICATE STATE
   ============================================================ */
let certificates = {
    a1: false,
    a2: false,
    b1: false,
    b2: false,
    mastery: false
};

/* ============================================================
   UNLOCK CERTIFICATE
   ============================================================ */
function unlockCertificate(key) {
    if (!certificates[key]) {
        certificates[key] = true;
        saveCertificates();
        renderCertificates();
    }
}

function runCEFRScoringEngine() {
    const stats = calculateLevelScores();

    if (stats.a1.avg >= PASS_THRESHOLD) unlockCertificate("a1");
    if (stats.a2.avg >= PASS_THRESHOLD) unlockCertificate("a2");
    if (stats.b1.avg >= PASS_THRESHOLD) unlockCertificate("b1");
    if (stats.b2.avg >= PASS_THRESHOLD) unlockCertificate("b2");

    if (
        certificates.a1 &&
        certificates.a2 &&
        certificates.b1 &&
        certificates.b2
    ) {
        unlockCertificate("mastery");
    }
}

/* ============================================================
   CEFR SCORING VARIABLES (GLOBAL)
   ============================================================ */

let quizCorrect = 0;
let quizTotal = 0;

let builderScore = 0;
let builderMax = 0;

let sentenceScore = 0;
let sentenceMax = 0;

let conversationScore = 0;
let conversationMax = 0;

let smartScore = 0;
let smartMax = 0;

/* ============================================================
   CEFR SENTENCE BANKS (for Build tab)
   ============================================================ */

const CEFR_SENTENCES = {
    a1: [
        { english: "I would like water, please.", spanish: "me gustaría agua por favor" },
       { english: "I would like beer, please.", spanish: "me gustaría cerveza por favor" },
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

    a2: [
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

    b1: [
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

    b2: [
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
a1: [
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
    { english: "hello", spanish: "hola", category: "Daily Life" },
    { english: "goodbye", spanish: "adiós", category: "Daily Life" },
    { english: "thank you", spanish: "gracias", category: "Daily Life" },
    { english: "sorry / I feel", spanish: "siento", category: "Daily Life" },
    { english: "you are", spanish: "estás", category: "Daily Life" },
    { english: "ready", spanish: "listos", category: "Daily Life" },
    { english: "awake", spanish: "despierto", category: "Daily Life" },
    { english: "time", spanish: "tiempo", category: "Daily Life" },
    { english: "problems", spanish: "problemas", category: "Daily Life" },
    { english: "change", spanish: "cambio", category: "Daily Life" },

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
    { spanish: "filete", english: "steak", category: "Food & Drink" },
    { spanish: "papas fritas", english: "french fries", category: "Food & Drink" },
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
    { english: "yes", spanish: "si", category: "connectors" },
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

a2: [
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

b1: [
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

b2: [
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
    a1: {
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
            "agua","comida","café","té","leche","pan","cerveza","filete","papas fritas",
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

    a2: {
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

    b1: {
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

    b2: {
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
"si": "yes",
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
"filete": "steak",
"papas fritas": "french fries",
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
const CEFR_PHRASES_a1 = [
  { english: "how are you", spanish: "cómo estás", level: "A1" },
  { english: "where do you live", spanish: "dónde vives", level: "A1" },
  { english: "what time is it", spanish: "qué hora es", level: "A1" },
  { english: "you like coffee", spanish: "te gusta el café", level: "A1" },
  { english: "i like music", spanish: "me gusta la música", level: "A1" },
  { english: "i live in the city", spanish: "vivo en la ciudad", level: "A1" },
  { english: "i work in a hotel", spanish: "trabajo en un hotel", level: "A1" },
  { english: "i want to eat", spanish: "quiero comer", level: "A1" },
  { english: "i want to drink", spanish: "quiero beber", level: "A1" },
  { english: "where is the bathroom", spanish: "dónde está el baño", level: "A1" },
  { english: "she runs fast", spanish: "ella corre rápido", level: "A1" },
  { english: "she is fast", spanish: "ella es rápida", level: "A1" },
  { english: "she goes fast", spanish: "ella va rápido", level: "A1" },
  { english: "i am happy", spanish: "estoy feliz", level: "A1" },
  { english: "i am sad", spanish: "estoy triste", level: "A1" },
  { english: "i am cold", spanish: "tengo frío", level: "A1" },
  { english: "i am hot", spanish: "tengo calor", level: "A1" },
  { english: "i am hungry", spanish: "tengo hambre", level: "A1" },
  { english: "i am thirsty", spanish: "tengo sed", level: "A1" },
  { english: "i am tired", spanish: "estoy cansado", level: "A1" },
  { english: "i am ready", spanish: "estoy listo", level: "A1" },
  { english: "i am busy", spanish: "estoy ocupado", level: "A1" },
  { english: "i am at home", spanish: "estoy en casa", level: "A1" },
  { english: "i am at work", spanish: "estoy en el trabajo", level: "A1" },
  { english: "i am at school", spanish: "estoy en la escuela", level: "A1" },
  { english: "i am in the car", spanish: "estoy en el coche", level: "A1" },
  { english: "i am in the park", spanish: "estoy en el parque", level: "A1" },
  { english: "i am in the store", spanish: "estoy en la tienda", level: "A1" },
  { english: "i need help", spanish: "necesito ayuda", level: "A1" },
  { english: "i need water", spanish: "necesito agua", level: "A1" },
  { english: "i need food", spanish: "necesito comida", level: "A1" },
  { english: "i need sleep", spanish: "necesito dormir", level: "A1" },
  { english: "i need money", spanish: "necesito dinero", level: "A1" },
  { english: "i need time", spanish: "necesito tiempo", level: "A1" },
  { english: "i want water", spanish: "quiero agua", level: "A1" },
  { english: "i want food", spanish: "quiero comida", level: "A1" },
  { english: "i want coffee", spanish: "quiero café", level: "A1" },
  { english: "i want tea", spanish: "quiero té", level: "A1" },
  { english: "i want to go", spanish: "quiero ir", level: "A1" },
  { english: "i want to stay", spanish: "quiero quedarme", level: "A1" },
  { english: "i like this", spanish: "me gusta esto", level: "A1" },
  { english: "i don't like that", spanish: "no me gusta eso", level: "A1" },
  { english: "what is your name", spanish: "cómo te llamas", level: "A1" },
  { english: "my name is john", spanish: "me llamo john", level: "A1" },
  { english: "i am from australia", spanish: "soy de australia", level: "A1" },
  { english: "i speak english", spanish: "hablo inglés", level: "A1" },
  { english: "i speak a little spanish", spanish: "hablo un poco de español", level: "A1" },
  { english: "see you later", spanish: "hasta luego", level: "A1" },
  { english: "good morning", spanish: "buenos días", level: "A1" },
  { english: "good night", spanish: "buenas noches", level: "A1" }
];

const CEFR_PHRASES_a2 = [
  { english: "i would like", spanish: "me gustaría", level: "A2" },
  { english: "i am looking for", spanish: "estoy buscando", level: "A2" },
  { english: "how much does it cost", spanish: "cuánto cuesta", level: "A2" },
  { english: "i am hungry", spanish: "tengo hambre", level: "A2" },
  { english: "i am thirsty", spanish: "tengo sed", level: "A2" },
  { english: "i am tired", spanish: "estoy cansado", level: "A2" },
  { english: "i like this", spanish: "me gusta esto", level: "A2" },
  { english: "i don't like that", spanish: "no me gusta eso", level: "A2" },
  { english: "what do you want to do", spanish: "qué quieres hacer", level: "A2" },
  { english: "i need to go", spanish: "necesito irme", level: "A2" },
  { english: "i will be back soon", spanish: "volveré pronto", level: "A2" },
  { english: "can you help me", spanish: "puedes ayudarme", level: "A2" },
  { english: "i am just looking", spanish: "solo estoy mirando", level: "A2" },
  { english: "what do you think", spanish: "qué piensas", level: "A2" },
  { english: "i am not sure", spanish: "no estoy seguro", level: "A2" },
  { english: "i will call you later", spanish: "te llamaré más tarde", level: "A2" },
  { english: "i am on my way", spanish: "estoy en camino", level: "A2" },
  { english: "i am getting ready", spanish: "me estoy preparando", level: "A2" },
  { english: "i am leaving now", spanish: "me voy ahora", level: "A2" },
  { english: "i am waiting for you", spanish: "te estoy esperando", level: "A2" },
  { english: "i am thinking about it", spanish: "lo estoy pensando", level: "A2" },
  { english: "i am trying", spanish: "estoy intentando", level: "A2" },
  { english: "i am learning", spanish: "estoy aprendiendo", level: "A2" },
  { english: "i am practicing", spanish: "estoy practicando", level: "A2" },
  { english: "i am working", spanish: "estoy trabajando", level: "A2" },
  { english: "i am studying", spanish: "estoy estudiando", level: "A2" },
  { english: "i am cooking", spanish: "estoy cocinando", level: "A2" },
  { english: "i am cleaning", spanish: "estoy limpiando", level: "A2" },
  { english: "i am shopping", spanish: "estoy comprando", level: "A2" },
  { english: "i am driving", spanish: "estoy conduciendo", level: "A2" },
  { english: "i am walking", spanish: "estoy caminando", level: "A2" },
  { english: "i am listening", spanish: "estoy escuchando", level: "A2" },
  { english: "i am watching a movie", spanish: "estoy viendo una película", level: "A2" },
  { english: "i am talking to someone", spanish: "estoy hablando con alguien", level: "A2" },
  { english: "i am getting dressed", spanish: "me estoy vistiendo", level: "A2" },
  { english: "i am taking a break", spanish: "estoy tomando un descanso", level: "A2" },
  { english: "i am going to sleep", spanish: "voy a dormir", level: "A2" },
  { english: "i am going to eat", spanish: "voy a comer", level: "A2" },
  { english: "i am going to work", spanish: "voy a trabajar", level: "A2" },
  { english: "i am going home", spanish: "voy a casa", level: "A2" },
  { english: "i will do it later", spanish: "lo haré más tarde", level: "A2" },
  { english: "i will try", spanish: "lo intentaré", level: "A2" },
  { english: "i will help you", spanish: "te ayudaré", level: "A2" },
  { english: "i will tell you", spanish: "te diré", level: "A2" },
  { english: "i will show you", spanish: "te mostraré", level: "A2" },
  { english: "i will think about it", spanish: "lo pensaré", level: "A2" },
  { english: "i will let you know", spanish: "te avisaré", level: "A2" },
  { english: "i will be there soon", spanish: "estaré allí pronto", level: "A2" },
  { english: "i will wait for you", spanish: "te esperaré", level: "A2" }
];

const CEFR_PHRASES_b1 = [
  { english: "i think that", spanish: "creo que", level: "B1" },
  { english: "in my opinion", spanish: "en mi opinión", level: "B1" },
  { english: "i believe that", spanish: "yo creo que", level: "B1" },
  { english: "it seems that", spanish: "parece que", level: "B1" },
  { english: "i am interested in", spanish: "estoy interesado en", level: "B1" },
  { english: "i am worried about", spanish: "estoy preocupado por", level: "B1" },
  { english: "i am excited about", spanish: "estoy emocionado por", level: "B1" },
  { english: "i am tired of", spanish: "estoy cansado de", level: "B1" },
  { english: "i am used to", spanish: "estoy acostumbrado a", level: "B1" },
  { english: "i am trying to improve", spanish: "estoy tratando de mejorar", level: "B1" },
  { english: "i agree with you", spanish: "estoy de acuerdo contigo", level: "B1" },
  { english: "i disagree", spanish: "no estoy de acuerdo", level: "B1" },
  { english: "i am not sure yet", spanish: "todavía no estoy seguro", level: "B1" },
  { english: "i will think about it", spanish: "lo pensaré", level: "B1" },
  { english: "i have a question", spanish: "tengo una pregunta", level: "B1" },
  { english: "i have no idea", spanish: "no tengo idea", level: "B1" },
  { english: "i didn't expect that", spanish: "no esperaba eso", level: "B1" },
  { english: "i didn't mean to", spanish: "no quise", level: "B1" },
  { english: "i didn't know", spanish: "no sabía", level: "B1" },
  { english: "i didn't hear you", spanish: "no te escuché", level: "B1" },
  { english: "i didn't see anything", spanish: "no vi nada", level: "B1" },
  { english: "i have been there", spanish: "he estado allí", level: "B1" },
  { english: "i have done that", spanish: "he hecho eso", level: "B1" },
  { english: "i have tried that", spanish: "he intentado eso", level: "B1" },
  { english: "i have seen that", spanish: "he visto eso", level: "B1" },
  { english: "i have heard that", spanish: "he oído eso", level: "B1" },
  { english: "what happened", spanish: "qué pasó", level: "B1" },
  { english: "what do you mean", spanish: "qué quieres decir", level: "B1" },
  { english: "what are you talking about", spanish: "de qué estás hablando", level: "B1" },
  { english: "what do you think about that", spanish: "qué piensas sobre eso", level: "B1" },
  { english: "what should i do", spanish: "qué debería hacer", level: "B1" },
  { english: "what would you do", spanish: "qué harías tú", level: "B1" },
  { english: "that sounds good", spanish: "suena bien", level: "B1" },
  { english: "that sounds bad", spanish: "suena mal", level: "B1" },
  { english: "that makes sense", spanish: "eso tiene sentido", level: "B1" },
  { english: "that doesn't make sense", spanish: "eso no tiene sentido", level: "B1" },
  { english: "that is not fair", spanish: "eso no es justo", level: "B1" },
  { english: "that is not true", spanish: "eso no es verdad", level: "B1" },
  { english: "that is true", spanish: "eso es verdad", level: "B1" },
  { english: "i am sure", spanish: "estoy seguro", level: "B1" },
  { english: "i am not sure", spanish: "no estoy seguro", level: "B1" },
  { english: "i am confused", spanish: "estoy confundido", level: "B1" },
  { english: "i am surprised", spanish: "estoy sorprendido", level: "B1" },
  { english: "i am bored", spanish: "estoy aburrido", level: "B1" },
  { english: "i am frustrated", spanish: "estoy frustrado", level: "B1" },
  { english: "i am ready to go", spanish: "estoy listo para irme", level: "B1" },
  { english: "i am thinking about you", spanish: "estoy pensando en ti", level: "B1" },
  { english: "i am planning to go", spanish: "estoy planeando ir", level: "B1" },
  { english: "i am trying to help", spanish: "estoy tratando de ayudar", level: "B1" },
  { english: "i am doing my best", spanish: "estoy haciendo lo mejor que puedo", level: "B1" }
];

const CEFR_PHRASES_b2 = [
  { english: "as far as i know", spanish: "hasta donde sé", level: "B2" },
  { english: "from my perspective", spanish: "desde mi perspectiva", level: "B2" },
  { english: "it seems to me that", spanish: "me parece que", level: "B2" },
  { english: "i am confident that", spanish: "estoy seguro de que", level: "B2" },
  { english: "i would appreciate it if", spanish: "agradecería si", level: "B2" },
  { english: "i am considering", spanish: "estoy considerando", level: "B2" },
  { english: "i didn't realize that", spanish: "no me di cuenta de eso", level: "B2" },
  { english: "it depends on the situation", spanish: "depende de la situación", level: "B2" },
  { english: "i am familiar with that", spanish: "estoy familiarizado con eso", level: "B2" },
  { english: "i am willing to try", spanish: "estoy dispuesto a intentarlo", level: "B2" },
  { english: "i am not convinced", spanish: "no estoy convencido", level: "B2" },
  { english: "i completely understand", spanish: "entiendo completamente", level: "B2" },
  { english: "that makes sense to me", spanish: "eso tiene sentido para mí", level: "B2" },
  { english: "i will take care of it", spanish: "me encargaré de eso", level: "B2" },
  { english: "i appreciate your help", spanish: "agradezco tu ayuda", level: "B2" },
  { english: "i am aware of that", spanish: "soy consciente de eso", level: "B2" },
  { english: "i am not aware of that", spanish: "no soy consciente de eso", level: "B2" },
  { english: "i am trying to figure it out", spanish: "estoy tratando de resolverlo", level: "B2" },
  { english: "i am trying to understand", spanish: "estoy tratando de entender", level: "B2" },
  { english: "i am trying to explain", spanish: "estoy tratando de explicar", level: "B2" },
  { english: "i am trying to decide", spanish: "estoy tratando de decidir", level: "B2" },
  { english: "i am trying to remember", spanish: "estoy tratando de recordar", level: "B2" },
  { english: "i am trying to focus", spanish: "estoy tratando de concentrarme", level: "B2" },
  { english: "i am trying to relax", spanish: "estoy tratando de relajarme", level: "B2" },
  { english: "i am trying to help you", spanish: "estoy tratando de ayudarte", level: "B2" },
  { english: "i am trying to improve myself", spanish: "estoy tratando de mejorarme", level: "B2" },
  { english: "i am trying to solve the problem", spanish: "estoy tratando de resolver el problema", level: "B2" },
  { english: "i am trying to fix it", spanish: "estoy tratando de arreglarlo", level: "B2" },
  { english: "i am trying to avoid that", spanish: "estoy tratando de evitar eso", level: "B2" },
  { english: "i am trying to be patient", spanish: "estoy tratando de ser paciente", level: "B2" },
  { english: "i am trying to be honest", spanish: "estoy tratando de ser honesto", level: "B2" },
  { english: "i am trying to be careful", spanish: "estoy tratando de tener cuidado", level: "B2" },
  { english: "i am trying to be respectful", spanish: "estoy tratando de ser respetuoso", level: "B2" },
  { english: "i am trying to be responsible", spanish: "estoy tratando de ser responsable", level: "B2" },
  { english: "i am trying to be more organized", spanish: "estoy tratando de ser más organizado", level: "B2" },
  { english: "i am trying to be more productive", spanish: "estoy tratando de ser más productivo", level: "B2" },
  { english: "i am trying to be more positive", spanish: "estoy tratando de ser más positivo", level: "B2" },
  { english: "i am trying to be more patient", spanish: "estoy tratando de ser más paciente", level: "B2" },
  { english: "i am trying to be more confident", spanish: "estoy tratando de tener más confianza", level: "B2" },
  { english: "i am trying to be more consistent", spanish: "estoy tratando de ser más constante", level: "B2" },
  { english: "i am trying to be more flexible", spanish: "estoy tratando de ser más flexible", level: "B2" },
  { english: "i am trying to be more creative", spanish: "estoy tratando de ser más creativo", level: "B2" },
  { english: "i am trying to be more patient with myself", spanish: "estoy tratando de ser más paciente conmigo mismo", level: "B2" },
  { english: "i am trying to be more patient with others", spanish: "estoy tratando de ser más paciente con los demás", level: "B2" },
  { english: "i am trying to be more understanding", spanish: "estoy tratando de ser más comprensivo", level: "B2" },
  { english: "i am trying to be more supportive", spanish: "estoy tratando de ser más solidario", level: "B2" },
  { english: "i am trying to be more helpful", spanish: "estoy tratando de ser más útil", level: "B2" },
  { english: "i am trying to be more disciplined", spanish: "estoy tratando de ser más disciplinado", level: "B2" },
  { english: "i am trying to be more patient every day", spanish: "estoy tratando de ser más paciente cada día", level: "B2" }
];


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
    if (level === "a1") {
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
    if (level === "a2") {
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
    if (level === "b1") {
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
    if (level === "b2") {
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
    currentLevel: "a1",
    speechRate: 1.0,
    studentName: "",
    badges: [],
    totalXP: 0,
    globalScore: 0,
    levelStats: {
        a1: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        a2: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        b1: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        b2: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        }
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
        return "Daily Life";

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

    return "Daily Life";
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

function setLearnerName(name) {

    // If this is a different learner, reset everything
    if (appState.learnerName !== name) {
        resetAllProgress();
    }

    appState.learnerName = name;
    saveState();
    renderDashboard();
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("State save error:", e);
    }
}

/* ============================================================
   FULL RESET — ALL LEVELS, ALL SCORES, ALL XP
   ============================================================ */

// Ensure this property exists on your global appState object
appState.lastActiveDate = appState.lastActiveDate || null;

/* ============================================================
   CALENDAR DAY STREAK ENGINE
   ============================================================ */

// Safely ensure this property exists on your global state when app initializes
if (typeof appState !== "undefined" && !appState.hasOwnProperty("lastActiveDate")) {
    appState.lastActiveDate = null;
}

function checkAndAdvanceStreak() {
    const todayStr = new Date().toLocaleDateString('en-CA'); // Formats cleanly as YYYY-MM-DD
    const lastActive = appState.lastActiveDate;
    
    // Fallback: Ensure active level stats object has a numeric streak parameter initialized
    if (typeof appState.levelStats[appState.currentLevel].streak !== "number") {
        appState.levelStats[appState.currentLevel].streak = 0;
    }

    // Case 1: First time playing, or progress was just reset
    if (!lastActive) {
        appState.levelStats[appState.currentLevel].streak = 1;
        appState.lastActiveDate = todayStr;
        saveState();
        return;
    }

    // Case 2: Already played today, do nothing to the count
    if (lastActive === todayStr) {
        return;
    }

    // Calculate the difference in calendar days
    const lastDateObj = new Date(lastActive);
    const todayDateObj = new Date(todayStr);
    const timeDiff = todayDateObj.getTime() - lastDateObj.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
        // Case 3: Played yesterday! Increment the consecutive day count
        appState.levelStats[appState.currentLevel].streak++;
    } else if (dayDiff > 1) {
        // Case 4: Skipped a day or more. Reset streak back to 1
        appState.levelStats[appState.currentLevel].streak = 1;
    }

    // Update the last active date milestone to today
    appState.lastActiveDate = todayStr;
    saveState();
}

/* ============================================================
   FULL RESET — ALL LEVELS, ALL SCORES, ALL XP
   ============================================================ */
function resetAllProgress() {
    Object.keys(appState.levelStats).forEach(level => {
        appState.levelStats[level] = {
            listens: 0,
            flashSeen: 0,
            quizScore: 0,
            quizCompleted: 0, // Zeroes completion fields alongside standard rating stats
            buildCompleted: 0,
            sentenceCompleted: 0,
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        };
    });

    // ⭐ FIXED: Completely zeroes global metrics memory data structures
    appState.totalXP = 0;
    appState.globalScore = 0;
    appState.badges = [];
    appState.currentLevel = "a1";
    appState.lastActiveDate = null; 

    // ⭐ FIXED: Clears your live review list array and local tracking storage
    reviewList = [];
    localStorage.removeItem('reviewList');

    // Save changes to disk memory
    saveState();

    // ⭐ FIXED: Instantly redraws the entire interface so everything clicks down to 0% right away
    updateBadges();
    updateProgressMeters();
    renderReviewList();
    
    // Optional: Take the user back to the clean dashboard overview tab
    activateTab("dashboard");
    
    console.log("🧼 Application data successfully cleared back to baseline!");
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
    "grammar",
    "review" // ⭐ ADDED: Tells the routing loop your review panel exists
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

        // ⭐ INTEGRATION: Populates your mistake cards list whenever this tab is opened
        case "review":
            renderReviewList();
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

function initDashboardResetButtons() {
    const resetAllBtn = document.getElementById("resetAllLevelsBtn");

    if (resetAllBtn) {
        resetAllBtn.addEventListener("click", () => {

            if (!confirm("Reset ALL levels and scores? This cannot be undone.")) return;

            resetAllProgress();
            saveState();
            updateProgressMeters();
            updateBadges();
            renderDashboard();

            alert("All levels reset. You are back to A1!");
        });
    }
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
    const container = document.getElementById("listen-content");
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
            setTimeout(playNextListenWord, 50);
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
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    /* ------------------------------------------------------------
       NORMALIZE CATEGORY KEYS (MERGES DUPLICATES)
       ------------------------------------------------------------ */
    const normalized = {};

    Object.keys(grouped).forEach(cat => {
        const cleanKey = cat.trim().toLowerCase();   // canonical key

        if (!normalized[cleanKey]) normalized[cleanKey] = {
            display: cat.trim(),   // preserve original display name
            items: []
        };

        normalized[cleanKey].items = normalized[cleanKey].items.concat(grouped[cat]);
    });

    /* ------------------------------------------------------------
       HEADER
       ------------------------------------------------------------ */
    let html = `
        <div class="glass-panel">
            <h2>Flashcards — Level ${appState.currentLevel}</h2>
            <p>Translate the word then tap the card to flip it over and see if your correct. Spanish side plays audio.</p>
        </div>
    `;

    /* ------------------------------------------------------------
       RENDER MERGED CATEGORIES
       ------------------------------------------------------------ */
    Object.keys(normalized).forEach(cleanKey => {
        const catDisplay = normalized[cleanKey].display.tolowerCase();
        const items = normalized[cleanKey].items;

        html += `
        <div class="glass-panel">
            <div class="flash-category-header" data-cat="${cleanKey}">
                <span class="listen-category-title">${catDisplay}</span>
                <span class="listen-arrow">▶</span>
            </div>

            <div class="flash-category-content" data-cat="${cleanKey}">
                <div class="fc-grid">
                    ${items.map(item => `
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

    /* ------------------------------------------------------------
       CATEGORY COLLAPSE
       ------------------------------------------------------------ */
    container.querySelectorAll(".flash-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ------------------------------------------------------------
       FLASHCARD FLIP + AUDIO
       ------------------------------------------------------------ */
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
    tokens: []
};

let sentenceState = {
    currentSentence: null,
    tokens: []
};

let convoState = {
    currentPrompt: null,
    tokens: []
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
   QUIZ TAB — RENDER + EVENTS
   ============================================================ */

function renderQuizTab() {
    const container = document.getElementById("quiz-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    quizState.currentWord = words[Math.floor(Math.random() * words.length)];
    quizState.options = generateQuizOptions(words, quizState.currentWord);
    quizState.selected = null;

    container.innerHTML = `
    <div class="glass-panel quiz-card">
        <h2>Quiz — Level ${appState.currentLevel}</h2>
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
            <button id="qb-harder" class="${quizState.harderMode ? "active" : ""}">Harder</button>
        </div>

        <div id="qb-feedback" class="qb-feedback"></div>
    </div>
    `;

    setupQuizEvents();
}

/* ============================================================
   QUIZ EVENTS
   ============================================================ */

function setupQuizEvents() {
    const grid = document.getElementById("qb-grid");
    const submitBtn = document.getElementById("qb-submit");
    const nextBtn = document.getElementById("qb-next");
    const harderBtn = document.getElementById("qb-harder");
    const feedback = document.getElementById("qb-feedback");
    const answerBox = document.getElementById("qb-answer");

    quizState.selected = null;

    // Pill selection
    grid.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            quizState.selected = btn.dataset.spanish;
            answerBox.textContent = quizState.selected;
        });
    });

    // Helper: translate Spanish → English
    function getEnglishForSpanish(spanishWord) {
        const levelWords = CEFR_LEVELS[appState.currentLevel];
        const match = levelWords.find(w => w.spanish === spanishWord);
        return match ? match.english : "[no match]";
    }

    // Check button
    submitBtn.addEventListener("click", () => {
        if (!quizState.selected) {
            feedback.textContent = "Choose an answer first.";
            return;
        }

        const correct = quizState.currentWord.spanish;
        const learnerSpanish = quizState.selected;
        const learnerEnglish = getEnglishForSpanish(learnerSpanish);

        // Ensure quizScore is not null before incrementing
        if (appState.levelStats[appState.currentLevel].quizScore === null) {
            appState.levelStats[appState.currentLevel].quizScore = 0;
        }

        // Correct / Incorrect feedback + NEW "You selected:"
       if (learnerSpanish === correct) {
    feedback.innerHTML = `
        <div class="quiz-correct">Correct! 🎉</div>
        <div class="quiz-selected"><strong>You selected:</strong> ${learnerSpanish} (${learnerEnglish})</div>
    `;

       appState.levelStats[appState.currentLevel].quizScore++;
      appState.levelStats[appState.currentLevel].quizCompleted++;

    /* ⭐ CEFR ENGINE SCORING ⭐ */
      quizCorrect++;
      quizTotal++;
      runCEFRScoringEngine();
      renderCertificates();
   /* ⭐ END ⭐ */


    appState.totalXP = (appState.totalXP || 0) + 10; 
    appState.globalScore = (appState.globalScore || 0) + 5;

    checkAndAdvanceStreak();
    updateBadges();
    updateProgressMeters();


        } else {
            feedback.innerHTML = `
                <div class="quiz-incorrect">Incorrect — correct answer: ${correct}</div>
                <div class="quiz-selected"><strong>You selected:</strong> ${learnerSpanish} (${learnerEnglish})</div>
            `;

            // INTEGRATION: Formats the phrase "English ➔ Spanish" and adds it to your review tracking list
            const mistakeString = `${quizState.currentWord.english} ➔ ${correct}`;
            addIncorrectWord(mistakeString);
        }

        // Sabina audio
        setTimeout(() => speakQuiz(correct), 50);

        saveState();
    });

    // Next button
    nextBtn.addEventListener("click", () => {
        renderQuizTab();
    });

    // Harder mode toggle
    harderBtn.addEventListener("click", () => {
        quizState.harderMode = !quizState.harderMode;
        harderBtn.classList.toggle("active");
        renderQuizTab();
    });
}

/* ============================================================
   KEYBOARD NORMALIZATION UTILITY (MULTI-WORD VERSION)
   ============================================================ */
function cleanStringForKeyboard(text) {
    if (!text) return "";
    return text
        .trim()
        .toLowerCase()
        // 1. Convert explicit character variants first to protect all browser engines
        .replace(/ñ/g, "n")
        .replace(/ü/g, "u")
        // 2. Splits remaining accented characters into base letters + standalone accents
        .normalize("NFD")
        // 3. Erases all those standalone accent marks cleanly
        .replace(/[\u0300-\u036f]/g, "")
        // 4. Erases Spanish punctuation marks like ¿ and ¡
        .replace(/[¿¡!?.–—,;:]/g, "")
        // ⭐ FIXED: Keeps spaces normal so multi-word queries remain split words
        .replace(/\s+/g, " ");
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

        // Translate learner answer to English
        const learnerEnglish = translateToEnglish(user);

        // ⭐ INTEGRATION: Normalize both strings to bypass accent/punctuation keyboard mismatches
        const cleanCorrect = cleanStringForKeyboard(correct);
        const cleanUser = cleanStringForKeyboard(user);

        // Check against the cleaned, keyboard-forgiving values
        if (cleanUser === cleanCorrect) {
            feedback.innerHTML = `
                <span style="color:#4ade80;font-weight:600;">Correct! 🎉</span><br><br>
                <strong>Your Translated Response is:</strong><br>${learnerEnglish}
            `;
            appState.levelStats[appState.currentLevel].buildCompleted++;

            appState.totalXP = (appState.totalXP || 0) + 20; 
            appState.globalScore = (appState.globalScore || 0) + 15;

            checkAndAdvanceStreak();

            updateBadges();
            updateProgressMeters();
            setTimeout(() => speakQuiz(correct), 50);
        } else {
            const correctTokens = correct.split(" ");
            const userTokens = buildState.answer;

            let html = `<strong>Correct Answer:</strong><br>${correct}<br><br>`;
            html += `<strong>Your Answer:</strong><br>${user}<br><br>`;
            html += `<strong>Your Translated Response is:</strong><br>${learnerEnglish}<br><br>`;
            html += `<strong>Word-by-word feedback:</strong><br>`;

            userTokens.forEach((t, i) => {
                // Fuzzy check each single token for individual word correctness indicators
                if (cleanStringForKeyboard(correctTokens[i]) === cleanStringForKeyboard(t)) {
                    html += `<span style="color:#4ade80;">${t} ✔</span> `;
                } else {
                    html += `<span style="color:#f87171;">${t} ✖</span> `;
                }
            });

            feedback.innerHTML = html;
            setTimeout(() => speakQuiz(correct), 50);

            const mistakeSentenceString = `${sentence.english} ➔ ${correct}`;
            addIncorrectWord(mistakeSentenceString);
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
                    <button class="pill" data-opt="${opt.es}">
                        ${opt.es}
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
    // FIX: only select answer pills, not the Next button
    const buttons = document.querySelectorAll("#sentence-options .pill");
    const feedback = document.getElementById("sentence-feedback");
    const nextBtn = document.getElementById("sentence-next");

    // Translate Spanish → English using the current sentence item
    function getEnglishForSpanish(spanishWord) {
        const match = q.options.find(opt => opt.es === spanishWord);
        return match ? match.en : "[no match]";
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const chosen = btn.dataset.opt;
            const chosenEnglish = getEnglishForSpanish(chosen);

            if (chosen === q.correct.es) {
                feedback.innerHTML = `
                    <span style="color:#4ade80;font-weight:600;">
                        Correct! 🎉
                    </span><br>
                    <div class="sentence-selected">
                        <strong>You selected:</strong> ${chosen} (${chosenEnglish})
                    </div>
                `;

                appState.levelStats[appState.currentLevel].sentenceCompleted++;

                // Increments global progress metrics on success
                appState.totalXP = (appState.totalXP || 0) + 15; 
                appState.globalScore = (appState.globalScore || 0) + 10;
                
                // ⭐ UPDATED: Invokes calendar comparison check engine for daily streak increments
                checkAndAdvanceStreak();

                updateBadges();
                updateProgressMeters();
                speakQuiz(q.correct.es);

            } else {
                feedback.innerHTML = `
                    <span style="color:#f87171;font-weight:600;">
                        Incorrect.
                    </span><br>
                    Correct answer: <strong>${q.correct.es}</strong><br>
                    <div class="sentence-selected">
                        <strong>You selected:</strong> ${chosen} (${chosenEnglish})
                    </div>
                `;

                // INTEGRATION: Formats sentence mistake path and updates tracking engine
                const mistakeSentenceString = `${q.english} ➔ ${q.correct.es}`;
                addIncorrectWord(mistakeSentenceString);

                speakQuiz(q.correct.es);
            }

            // Disable only answer buttons
            buttons.forEach(b => b.disabled = true);
            saveState();
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

    a1: [    {
        english: "I’m a bit tired today.",
        correct: { es: "estoy un poco cansado hoy", en: "I’m a bit tired today." },
        options: [
            { es: "estoy un poco cansado hoy", en: "I’m a bit tired today." },
            { es: "estoy muy ocupado hoy", en: "I’m really busy today." },
            { es: "estoy muy contento hoy", en: "I’m really happy today." }
        ]
    },
    {
        english: "The room’s nice and clean.",
        correct: { es: "la habitación está limpia", en: "The room’s nice and clean." },
        options: [
            { es: "la habitación está limpia", en: "The room’s nice and clean." },
            { es: "la habitación está sucia", en: "The room’s dirty." },
            { es: "la habitación está vacía", en: "The room’s empty." }
        ]
    },
    {
        english: "She’s my mum.",
        correct: { es: "ella es mi madre", en: "She’s my mum." },
        options: [
            { es: "ella es mi madre", en: "She’s my mum." },
            { es: "ella es mi hermana", en: "She’s my sister." },
            { es: "ella es mi amiga", en: "She’s my friend." }
        ]
    },
    {
        english: "We’re at home right now.",
        correct: { es: "estamos en casa ahora", en: "We’re at home right now." },
        options: [
            { es: "estamos en casa ahora", en: "We’re at home right now." },
            { es: "estamos en el trabajo ahora", en: "We’re at work right now." },
            { es: "estamos en la tienda ahora", en: "We’re at the shop right now." }
        ]
    },
    {
        english: "He likes his water cold.",
        correct: { es: "a él le gusta el agua fría", en: "He likes his water cold." },
        options: [
            { es: "a él le gusta el agua fría", en: "He likes his water cold." },
            { es: "a él le gusta el agua caliente", en: "He likes his water hot." },
            { es: "a él le gusta el agua dulce", en: "He likes sweet water." }
        ]
    },
    {
        english: "The bus is running late.",
        correct: { es: "el autobús llega tarde", en: "The bus is running late." },
        options: [
            { es: "el autobús llega tarde", en: "The bus is running late." },
            { es: "el autobús llega temprano", en: "The bus is arriving early." },
            { es: "el autobús no funciona", en: "The bus isn’t working." }
        ]
    },
    {
        english: "My mate is really nice.",
        correct: { es: "mi amigo es muy amable", en: "My mate is really nice." },
        options: [
            { es: "mi amigo es muy amable", en: "My mate is really nice." },
            { es: "mi amigo es muy serio", en: "My mate is very serious." },
            { es: "mi amigo es muy ruidoso", en: "My mate is very loud." }
        ]
    },
    {
        english: "The shop is close by.",
        correct: { es: "la tienda está cerca", en: "The shop is close by." },
        options: [
            { es: "la tienda está cerca", en: "The shop is close by." },
            { es: "la tienda está lejos", en: "The shop is far away." },
            { es: "la tienda está cerrada", en: "The shop is closed." }
        ]
    },
    {
        english: "The food tastes really good.",
        correct: { es: "la comida sabe muy bien", en: "The food tastes really good." },
        options: [
            { es: "la comida sabe muy bien", en: "The food tastes really good." },
            { es: "la comida sabe mal", en: "The food tastes bad." },
            { es: "la comida está fría", en: "The food is cold." }
        ]
    },
    {
        english: "I’m learning Spanish.",
        correct: { es: "estoy aprendiendo español", en: "I’m learning Spanish." },
        options: [
            { es: "estoy aprendiendo español", en: "I’m learning Spanish." },
            { es: "estoy aprendiendo inglés", en: "I’m learning English." },
            { es: "estoy aprendiendo francés", en: "I’m learning French." }
        ]
    },
    {
        english: "The weather’s pretty warm today.",
        correct: { es: "el clima está cálido hoy", en: "The weather’s pretty warm today." },
        options: [
            { es: "el clima está cálido hoy", en: "The weather’s pretty warm today." },
            { es: "el clima está frío hoy", en: "The weather’s cold today." },
            { es: "el clima está lluvioso hoy", en: "The weather’s rainy today." }
        ]
    },
    {
        english: "She’s at the park.",
        correct: { es: "ella está en el parque", en: "She’s at the park." },
        options: [
            { es: "ella está en el parque", en: "She’s at the park." },
            { es: "ella está en la escuela", en: "She’s at school." },
            { es: "ella está en casa", en: "She’s at home." }
        ]
    },
    {
        english: "I need a bit of help.",
        correct: { es: "necesito un poco de ayuda", en: "I need a bit of help." },
        options: [
            { es: "necesito un poco de ayuda", en: "I need a bit of help." },
            { es: "necesito un poco de agua", en: "I need a bit of water." },
            { es: "necesito un poco de tiempo", en: "I need a bit of time." }
        ]
    },
    {
        english: "The dog is very friendly.",
        correct: { es: "el perro es muy amigable", en: "The dog is very friendly." },
        options: [
            { es: "el perro es muy amigable", en: "The dog is very friendly." },
            { es: "el perro es muy ruidoso", en: "The dog is very loud." },
            { es: "el perro es muy pequeño", en: "The dog is very small." }
        ]
    },
    {
        english: "We’re having dinner now.",
        correct: { es: "estamos cenando ahora", en: "We’re having dinner now." },
        options: [
            { es: "estamos cenando ahora", en: "We’re having dinner now." },
            { es: "estamos desayunando ahora", en: "We’re having breakfast now." },
            { es: "estamos trabajando ahora", en: "We’re working now." }
        ]
    },
    {
        english: "The car is very new.",
        correct: { es: "el coche es muy nuevo", en: "The car is very new." },
        options: [
            { es: "el coche es muy nuevo", en: "The car is very new." },
            { es: "el coche es muy viejo", en: "The car is very old." },
            { es: "el coche es muy rápido", en: "The car is very fast." }
        ]
    },
    {
        english: "I’m going to the shop.",
        correct: { es: "voy a la tienda", en: "I’m going to the shop." },
        options: [
            { es: "voy a la tienda", en: "I’m going to the shop." },
            { es: "voy a la escuela", en: "I’m going to school." },
            { es: "voy al parque", en: "I’m going to the park." }
        ]
    },
    {
        english: "She’s drinking coffee.",
        correct: { es: "ella está tomando café", en: "She’s drinking coffee." },
        options: [
            { es: "ella está tomando café", en: "She’s drinking coffee." },
            { es: "ella está tomando té", en: "She’s drinking tea." },
            { es: "ella está tomando agua", en: "She’s drinking water." }
        ]
    },
    {
        english: "The house is pretty big.",
        correct: { es: "la casa es bastante grande", en: "The house is pretty big." },
        options: [
            { es: "la casa es bastante grande", en: "The house is pretty big." },
            { es: "la casa es bastante pequeña", en: "The house is pretty small." },
            { es: "la casa es bastante vieja", en: "The house is pretty old." }
        ]
    },
    {
            english: "I’m feeling really good today.",
            correct: { es: "me siento muy bien hoy", en: "I’m feeling really good today." },
            options: [
                { es: "me siento muy bien hoy", en: "I’m feeling really good today." },
                { es: "me siento muy mal hoy", en: "I’m feeling really bad today." },
                { es: "me siento muy cansado hoy", en: "I’m feeling really tired today." }
            ]
        },

        /* ===== A1 PART 2 (joined cleanly) ===== */

        {
            english: "She’s reading a book.",
            correct: { es: "ella está leyendo un libro", en: "She’s reading a book." },
            options: [
                { es: "ella está leyendo un libro", en: "She’s reading a book." },
                { es: "ella está escribiendo un libro", en: "She’s writing a book." },
                { es: "ella está comprando un libro", en: "She’s buying a book." }
            ]
        },
    {
        english: "I’m cooking dinner.",
        correct: { es: "estoy cocinando la cena", en: "I’m cooking dinner." },
        options: [
            { es: "estoy cocinando la cena", en: "I’m cooking dinner." },
            { es: "estoy comiendo la cena", en: "I’m eating dinner." },
            { es: "estoy preparando el desayuno", en: "I’m making breakfast." }
        ]
    },
    {
        english: "The street is very quiet.",
        correct: { es: "la calle está muy tranquila", en: "The street is very quiet." },
        options: [
            { es: "la calle está muy tranquila", en: "The street is very quiet." },
            { es: "la calle está muy ruidosa", en: "The street is very noisy." },
            { es: "la calle está muy ocupada", en: "The street is very busy." }
        ]
    },
    {
        english: "We’re watching a movie.",
        correct: { es: "estamos viendo una película", en: "We’re watching a movie." },
        options: [
            { es: "estamos viendo una película", en: "We’re watching a movie." },
            { es: "estamos haciendo una película", en: "We’re making a movie." },
            { es: "estamos comprando una película", en: "We’re buying a movie." }
        ]
    },
    {
        english: "The water is really cold.",
        correct: { es: "el agua está muy fría", en: "The water is really cold." },
        options: [
            { es: "el agua está muy fría", en: "The water is really cold." },
            { es: "el agua está muy caliente", en: "The water is really hot." },
            { es: "el agua está muy sucia", en: "The water is really dirty." }
        ]
    },
    {
        english: "I’m walking to the park.",
        correct: { es: "estoy caminando al parque", en: "I’m walking to the park." },
        options: [
            { es: "estoy caminando al parque", en: "I’m walking to the park." },
            { es: "estoy caminando a la tienda", en: "I’m walking to the shop." },
            { es: "estoy caminando a casa", en: "I’m walking home." }
        ]
    },
    {
        english: "He’s talking to his mate.",
        correct: { es: "él está hablando con su amigo", en: "He’s talking to his mate." },
        options: [
            { es: "él está hablando con su amigo", en: "He’s talking to his mate." },
            { es: "él está hablando con su madre", en: "He’s talking to his mum." },
            { es: "él está hablando con su jefe", en: "He’s talking to his boss." }
        ]
    },
    {
        english: "The coffee smells great.",
        correct: { es: "el café huele muy bien", en: "The coffee smells great." },
        options: [
            { es: "el café huele muy bien", en: "The coffee smells great." },
            { es: "el café huele mal", en: "The coffee smells bad." },
            { es: "el café está frío", en: "The coffee is cold." }
        ]
    },
    {
        english: "I’m buying some fruit.",
        correct: { es: "estoy comprando fruta", en: "I’m buying some fruit." },
        options: [
            { es: "estoy comprando fruta", en: "I’m buying some fruit." },
            { es: "estoy comprando pan", en: "I’m buying bread." },
            { es: "estoy comprando leche", en: "I’m buying milk." }
        ]
    },
    {
        english: "She’s wearing a red shirt.",
        correct: { es: "ella lleva una camisa roja", en: "She’s wearing a red shirt." },
        options: [
            { es: "ella lleva una camisa roja", en: "She’s wearing a red shirt." },
            { es: "ella lleva una camisa azul", en: "She’s wearing a blue shirt." },
            { es: "ella lleva una camisa blanca", en: "She’s wearing a white shirt." }
        ]
    },
    {
        english: "The kids are playing outside.",
        correct: { es: "los niños están jugando afuera", en: "The kids are playing outside." },
        options: [
            { es: "los niños están jugando afuera", en: "The kids are playing outside." },
            { es: "los niños están durmiendo", en: "The kids are sleeping." },
            { es: "los niños están comiendo", en: "The kids are eating." }
        ]
    },
    {
        english: "I’m cleaning the kitchen.",
        correct: { es: "estoy limpiando la cocina", en: "I’m cleaning the kitchen." },
        options: [
            { es: "estoy limpiando la cocina", en: "I’m cleaning the kitchen." },
            { es: "estoy limpiando el baño", en: "I’m cleaning the bathroom." },
            { es: "estoy limpiando mi habitación", en: "I’m cleaning my room." }
        ]
    },
    {
        english: "The sun is shining.",
        correct: { es: "el sol está brillando", en: "The sun is shining." },
        options: [
            { es: "el sol está brillando", en: "The sun is shining." },
            { es: "el sol está escondido", en: "The sun is hidden." },
            { es: "el sol está bajando", en: "The sun is going down." }
        ]
    },
    {
        english: "We’re waiting for the bus.",
        correct: { es: "estamos esperando el autobús", en: "We’re waiting for the bus." },
        options: [
            { es: "estamos esperando el autobús", en: "We’re waiting for the bus." },
            { es: "estamos esperando el tren", en: "We’re waiting for the train." },
            { es: "estamos esperando a un amigo", en: "We’re waiting for a mate." }
        ]
    },
    {
        english: "I’m writing a message.",
        correct: { es: "estoy escribiendo un mensaje", en: "I’m writing a message." },
        options: [
            { es: "estoy escribiendo un mensaje", en: "I’m writing a message." },
            { es: "estoy leyendo un mensaje", en: "I’m reading a message." },
            { es: "estoy borrando un mensaje", en: "I’m deleting a message." }
        ]
    },
    {
        english: "The shop is open now.",
        correct: { es: "la tienda está abierta ahora", en: "The shop is open now." },
        options: [
            { es: "la tienda está abierta ahora", en: "The shop is open now." },
            { es: "la tienda está cerrada ahora", en: "The shop is closed now." },
            { es: "la tienda está muy ocupada", en: "The shop is really busy." }
        ]
    },
    {
        english: "She’s listening to music.",
        correct: { es: "ella está escuchando música", en: "She’s listening to music." },
        options: [
            { es: "ella está escuchando música", en: "She’s listening to music." },
            { es: "ella está cantando música", en: "She’s singing music." },
            { es: "ella está bailando", en: "She’s dancing." }
        ]
    },
    {
        english: "I’m drinking some juice.",
        correct: { es: "estoy tomando jugo", en: "I’m drinking some juice." },
        options: [
            { es: "estoy tomando jugo", en: "I’m drinking some juice." },
            { es: "estoy tomando agua", en: "I’m drinking water." },
            { es: "estoy tomando café", en: "I’m drinking coffee." }
        ]
    },
    {
        english: "The bag is very heavy.",
        correct: { es: "la bolsa es muy pesada", en: "The bag is very heavy." },
        options: [
            { es: "la bolsa es muy pesada", en: "The bag is very heavy." },
            { es: "la bolsa es muy ligera", en: "The bag is very light." },
            { es: "la bolsa es muy pequeña", en: "The bag is very small." }
        ]
    },
       {
        english: "We’re walking together.",
        correct: { es: "estamos caminando juntos", en: "We’re walking together." },
        options: [
            { es: "estamos caminando juntos", en: "We’re walking together." },
            { es: "estamos corriendo juntos", en: "We’re running together." },
            { es: "estamos hablando juntos", en: "We’re talking together." }
        ]
    }
],   // ← CLEAN END OF A1 ARRAY

/* ============================
   A2 — Elementary
   ============================ */

a2: [
    {
        english: "We’re planning a trip next week.",
        correct: { es: "estamos planeando un viaje la próxima semana", en: "We’re planning a trip next week." },
        options: [
            { es: "estamos planeando un viaje la próxima semana", en: "We’re planning a trip next week." },
            { es: "estamos cancelando un viaje la próxima semana", en: "We’re cancelling a trip next week." },
            { es: "estamos recordando un viaje la próxima semana", en: "We’re remembering a trip next week." }
        ]
    },

    {
        english: "I forgot my keys at home.",
        correct: { es: "olvidé mis llaves en casa", en: "I forgot my keys at home." },
        options: [
            { es: "olvidé mis llaves en casa", en: "I forgot my keys at home." },
            { es: "perdí mis llaves en casa", en: "I lost my keys at home." },
            { es: "dejé mis llaves en el coche", en: "I left my keys in the car." }
        ]
    },
    {
        english: "They’re cooking dinner together.",
        correct: { es: "ellos están cocinando la cena juntos", en: "They’re cooking dinner together." },
        options: [
            { es: "ellos están cocinando la cena juntos", en: "They’re cooking dinner together." },
            { es: "ellos están comiendo la cena juntos", en: "They’re eating dinner together." },
            { es: "ellos están limpiando juntos", en: "They’re cleaning together." }
        ]
    },
    {
        english: "She often arrives late.",
        correct: { es: "ella llega tarde a menudo", en: "She often arrives late." },
        options: [
            { es: "ella llega tarde a menudo", en: "She often arrives late." },
            { es: "ella llega temprano a menudo", en: "She often arrives early." },
            { es: "ella llega cansada a menudo", en: "She often arrives tired." }
        ]
    },
    {
        english: "We’ll visit the market tomorrow.",
        correct: { es: "visitaremos el mercado mañana", en: "We’ll visit the market tomorrow." },
        options: [
            { es: "visitaremos el mercado mañana", en: "We’ll visit the market tomorrow." },
            { es: "visitaremos la tienda mañana", en: "We’ll visit the shop tomorrow." },
            { es: "visitaremos el parque mañana", en: "We’ll visit the park tomorrow." }
        ]
    },
    {
        english: "I’m listening to a new song.",
        correct: { es: "estoy escuchando una canción nueva", en: "I’m listening to a new song." },
        options: [
            { es: "estoy escuchando una canción nueva", en: "I’m listening to a new song." },
            { es: "estoy cantando una canción nueva", en: "I’m singing a new song." },
            { es: "estoy escribiendo una canción nueva", en: "I’m writing a new song." }
        ]
    },
    {
        english: "She bought fresh fruit this morning.",
        correct: { es: "ella compró fruta fresca esta mañana", en: "She bought fresh fruit this morning." },
        options: [
            { es: "ella compró fruta fresca esta mañana", en: "She bought fresh fruit this morning." },
            { es: "ella vendió fruta fresca esta mañana", en: "She sold fresh fruit this morning." },
            { es: "ella cocinó fruta fresca esta mañana", en: "She cooked fresh fruit this morning." }
        ]
    },
    {
        english: "We’re waiting for our food.",
        correct: { es: "estamos esperando nuestra comida", en: "We’re waiting for our food." },
        options: [
            { es: "estamos esperando nuestra comida", en: "We’re waiting for our food." },
            { es: "estamos comiendo nuestra comida", en: "We’re eating our food." },
            { es: "estamos preparando nuestra comida", en: "We’re preparing our food." }
        ]
    },
    {
        english: "He’s driving to work right now.",
        correct: { es: "él está conduciendo al trabajo ahora", en: "He’s driving to work right now." },
        options: [
            { es: "él está conduciendo al trabajo ahora", en: "He’s driving to work right now." },
            { es: "él está caminando al trabajo ahora", en: "He’s walking to work right now." },
            { es: "él está durmiendo ahora", en: "He’s sleeping right now." }
        ]
    },
    {
        english: "I’ll call you later today.",
        correct: { es: "te llamaré más tarde hoy", en: "I’ll call you later today." },
        options: [
            { es: "te llamaré más tarde hoy", en: "I’ll call you later today." },
            { es: "te veré más tarde hoy", en: "I’ll see you later today." },
            { es: "te escribiré más tarde hoy", en: "I’ll message you later today." }
        ]
    },
    {
        english: "She’s cleaning the house right now.",
        correct: { es: "ella está limpiando la casa ahora", en: "She’s cleaning the house right now." },
        options: [
            { es: "ella está limpiando la casa ahora", en: "She’s cleaning the house right now." },
            { es: "ella está cocinando ahora", en: "She’s cooking right now." },
            { es: "ella está descansando ahora", en: "She’s resting right now." }
        ]
    },
    {
        english: "We usually eat dinner at six.",
        correct: { es: "normalmente cenamos a las seis", en: "We usually eat dinner at six." },
        options: [
            { es: "normalmente cenamos a las seis", en: "We usually eat dinner at six." },
            { es: "normalmente desayunamos a las seis", en: "We usually eat breakfast at six." },
            { es: "normalmente salimos a las seis", en: "We usually go out at six." }
        ]
    },
    {
        english: "I’m trying a new recipe today.",
        correct: { es: "estoy probando una receta nueva hoy", en: "I’m trying a new recipe today." },
        options: [
            { es: "estoy probando una receta nueva hoy", en: "I’m trying a new recipe today." },
            { es: "estoy leyendo una receta nueva hoy", en: "I’m reading a new recipe today." },
            { es: "estoy comprando una receta nueva hoy", en: "I’m buying a new recipe today." }
        ]
    },
    {
        english: "She’s writing an email.",
        correct: { es: "ella está escribiendo un correo", en: "She’s writing an email." },
        options: [
            { es: "ella está escribiendo un correo", en: "She’s writing an email." },
            { es: "ella está leyendo un correo", en: "She’s reading an email." },
            { es: "ella está borrando un correo", en: "She’s deleting an email." }
        ]
    },
    {
        english: "We arrived early this morning.",
        correct: { es: "llegamos temprano esta mañana", en: "We arrived early this morning." },
        options: [
            { es: "llegamos temprano esta mañana", en: "We arrived early this morning." },
            { es: "llegamos tarde esta mañana", en: "We arrived late this morning." },
            { es: "llegamos cansados esta mañana", en: "We arrived tired this morning." }
        ]
    },
    {
        english: "He’s watching the news.",
        correct: { es: "él está viendo las noticias", en: "He’s watching the news." },
        options: [
            { es: "él está viendo las noticias", en: "He’s watching the news." },
            { es: "él está leyendo las noticias", en: "He’s reading the news." },
            { es: "él está escuchando las noticias", en: "He’s listening to the news." }
        ]
    },
    {
        english: "I’ll meet you at the café.",
        correct: { es: "te veré en el café", en: "I’ll meet you at the café." },
        options: [
            { es: "te veré en el café", en: "I’ll meet you at the café." },
            { es: "te veré en el parque", en: "I’ll meet you at the park." },
            { es: "te veré en la tienda", en: "I’ll meet you at the shop." }
        ]
    },
    {
        english: "She’s learning new words every day.",
        correct: { es: "ella está aprendiendo palabras nuevas cada día", en: "She’s learning new words every day." },
        options: [
            { es: "ella está aprendiendo palabras nuevas cada día", en: "She’s learning new words every day." },
            { es: "ella está olvidando palabras cada día", en: "She’s forgetting words every day." },
            { es: "ella está enseñando palabras cada día", en: "She’s teaching words every day." }
        ]
    },
    {
        english: "We’re looking for a good restaurant.",
        correct: { es: "estamos buscando un buen restaurante", en: "We’re looking for a good restaurant." },
        options: [
            { es: "estamos buscando un buen restaurante", en: "We’re looking for a good restaurant." },
            { es: "estamos buscando un buen hotel", en: "We’re looking for a good hotel." },
            { es: "estamos buscando un buen parque", en: "We’re looking for a good park." }
        ]
    },
    {
        english: "I’m finishing my work now.",
        correct: { es: "estoy terminando mi trabajo ahora", en: "I’m finishing my work now." },
        options: [
            { es: "estoy terminando mi trabajo ahora", en: "I’m finishing my work now." },
            { es: "estoy empezando mi trabajo ahora", en: "I’m starting my work now." },
            { es: "estoy dejando mi trabajo ahora", en: "I’m leaving my work now." }
        ]
    },
    
    /* ===== A2 PART 2 (joined cleanly) ===== */

    {
        english: "She’s visiting her mum today.",
        correct: { es: "ella está visitando a su madre hoy", en: "She’s visiting her mum today." },
        options: [
            { es: "ella está visitando a su madre hoy", en: "She’s visiting her mum today." },
            { es: "ella está visitando a su amiga hoy", en: "She’s visiting her friend today." },
            { es: "ella está visitando a su hermana hoy", en: "She’s visiting her sister today." }
        ]
    },
    {
        english: "We’re having lunch at the market.",
        correct: { es: "estamos almorzando en el mercado", en: "We’re having lunch at the market." },
        options: [
            { es: "estamos almorzando en el mercado", en: "We’re having lunch at the market." },
            { es: "estamos desayunando en el mercado", en: "We’re having breakfast at the market." },
            { es: "estamos cenando en el mercado", en: "We’re having dinner at the market." }
        ]
    },
    {
        english: "He forgot his phone at work.",
        correct: { es: "él olvidó su teléfono en el trabajo", en: "He forgot his phone at work." },
        options: [
            { es: "él olvidó su teléfono en el trabajo", en: "He forgot his phone at work." },
            { es: "él perdió su teléfono en el trabajo", en: "He lost his phone at work." },
            { es: "él dejó su teléfono en casa", en: "He left his phone at home." }
        ]
    },
    {
        english: "I’m cooking early today.",
        correct: { es: "estoy cocinando temprano hoy", en: "I’m cooking early today." },
        options: [
            { es: "estoy cocinando temprano hoy", en: "I’m cooking early today." },
            { es: "estoy cocinando tarde hoy", en: "I’m cooking late today." },
            { es: "estoy cocinando ahora", en: "I’m cooking right now." }
        ]
    },
    {
        english: "She’s waiting outside.",
        correct: { es: "ella está esperando afuera", en: "She’s waiting outside." },
        options: [
            { es: "ella está esperando afuera", en: "She’s waiting outside." },
            { es: "ella está esperando adentro", en: "She’s waiting inside." },
            { es: "ella está esperando en casa", en: "She’s waiting at home." }
        ]
    },
    {
        english: "We’ll eat together later.",
        correct: { es: "comeremos juntos más tarde", en: "We’ll eat together later." },
        options: [
            { es: "comeremos juntos más tarde", en: "We’ll eat together later." },
            { es: "desayunaremos juntos más tarde", en: "We’ll have breakfast together later." },
            { es: "cenaremos juntos más tarde", en: "We’ll have dinner together later." }
        ]
    },
    {
        english: "I’m learning new phrases now.",
        correct: { es: "estoy aprendiendo frases nuevas ahora", en: "I’m learning new phrases now." },
        options: [
            { es: "estoy aprendiendo frases nuevas ahora", en: "I’m learning new phrases now." },
            { es: "estoy aprendiendo palabras nuevas ahora", en: "I’m learning new words now." },
            { es: "estoy aprendiendo números ahora", en: "I’m learning numbers now." }
        ]
    },
    {
        english: "He’s cleaning the kitchen again.",
        correct: { es: "él está limpiando la cocina otra vez", en: "He’s cleaning the kitchen again." },
        options: [
            { es: "él está limpiando la cocina otra vez", en: "He’s cleaning the kitchen again." },
            { es: "él está limpiando el baño otra vez", en: "He’s cleaning the bathroom again." },
            { es: "él está limpiando su habitación otra vez", en: "He’s cleaning his room again." }
        ]
    },
    {
        english: "We arrived late yesterday.",
        correct: { es: "llegamos tarde ayer", en: "We arrived late yesterday." },
        options: [
            { es: "llegamos tarde ayer", en: "We arrived late yesterday." },
            { es: "llegamos temprano ayer", en: "We arrived early yesterday." },
            { es: "llegamos cansados ayer", en: "We arrived tired yesterday." }
        ]
    },
    {
        english: "She’s buying fresh bread.",
        correct: { es: "ella está comprando pan fresco", en: "She’s buying fresh bread." },
        options: [
            { es: "ella está comprando pan fresco", en: "She’s buying fresh bread." },
            { es: "ella está comprando fruta fresca", en: "She’s buying fresh fruit." },
            { es: "ella está comprando café fresco", en: "She’s buying fresh coffee." }
        ]
    },
    {
        english: "I’ll call my mate later.",
        correct: { es: "llamaré a mi amigo más tarde", en: "I’ll call my mate later." },
        options: [
            { es: "llamaré a mi amigo más tarde", en: "I’ll call my mate later." },
            { es: "veré a mi amigo más tarde", en: "I’ll see my mate later." },
            { es: "visitaré a mi amigo más tarde", en: "I’ll visit my mate later." }
        ]
    },
    {
        english: "We’re visiting the shop now.",
        correct: { es: "estamos visitando la tienda ahora", en: "We’re visiting the shop now." },
        options: [
            { es: "estamos visitando la tienda ahora", en: "We’re visiting the shop now." },
            { es: "estamos visitando el mercado ahora", en: "We’re visiting the market now." },
            { es: "estamos visitando el parque ahora", en: "We’re visiting the park now." }
        ]
    },
    {
        english: "She’s drinking cold water.",
        correct: { es: "ella está tomando agua fría", en: "She’s drinking cold water." },
        options: [
            { es: "ella está tomando agua fría", en: "She’s drinking cold water." },
            { es: "ella está tomando agua caliente", en: "She’s drinking hot water." },
            { es: "ella está tomando jugo frío", en: "She’s drinking cold juice." }
        ]
    },
    {
        english: "I’m finishing my coffee.",
        correct: { es: "estoy terminando mi café", en: "I’m finishing my coffee." },
        options: [
            { es: "estoy terminando mi café", en: "I’m finishing my coffee." },
            { es: "estoy tomando mi café", en: "I’m drinking my coffee." },
            { es: "estoy preparando mi café", en: "I’m preparing my coffee." }
        ]
    },
    {
        english: "We’re eating together now.",
        correct: { es: "estamos comiendo juntos ahora", en: "We’re eating together now." },
        options: [
            { es: "estamos comiendo juntos ahora", en: "We’re eating together now." },
            { es: "estamos cocinando juntos ahora", en: "We’re cooking together now." },
            { es: "estamos limpiando juntos ahora", en: "We’re cleaning together now." }
        ]
    },
    {
        english: "She arrived early today.",
        correct: { es: "ella llegó temprano hoy", en: "She arrived early today." },
        options: [
            { es: "ella llegó temprano hoy", en: "She arrived early today." },
            { es: "ella llegó tarde hoy", en: "She arrived late today." },
            { es: "ella llegó cansada hoy", en: "She arrived tired today." }
        ]
    },
    {
        english: "I’m visiting my mum tomorrow.",
        correct: { es: "voy a visitar a mi madre mañana", en: "I’m visiting my mum tomorrow." },
        options: [
            { es: "voy a visitar a mi madre mañana", en: "I’m visiting my mum tomorrow." },
            { es: "voy a visitar a mi amigo mañana", en: "I’m visiting my mate tomorrow." },
            { es: "voy a visitar a mi hermana mañana", en: "I’m visiting my sister tomorrow." }
        ]
    },
    {
        english: "We’re learning together today.",
        correct: { es: "estamos aprendiendo juntos hoy", en: "We’re learning together today." },
        options: [
            { es: "estamos aprendiendo juntos hoy", en: "We’re learning together today." },
            { es: "estamos leyendo juntos hoy", en: "We’re reading together today." },
            { es: "estamos escribiendo juntos hoy", en: "We’re writing together today." }
        ]
    },
   {
        english: "She’s finishing her work now.",
        correct: { es: "ella está terminando su trabajo ahora", en: "She’s finishing her work now." },
        options: [
            { es: "ella está terminando su trabajo ahora", en: "She’s finishing her work now." },
            { es: "ella está empezando su trabajo ahora", en: "She’s starting her work now." },
            { es: "ella está dejando su trabajo ahora", en: "She’s leaving her work now." }
        ]
    }
],   // ← CLEAN END OF A2 ARRAY

/* ============================
   B1 — Intermediate
   ============================ */

b1: [
    {
        english: "We need to explain the plan clearly.",
        correct: { es: "necesitamos explicar el plan claramente", en: "We need to explain the plan clearly." },
        options: [
            { es: "necesitamos explicar el plan claramente", en: "We need to explain the plan clearly." },
            { es: "necesitamos cambiar el plan claramente", en: "We need to change the plan clearly." },
            { es: "necesitamos olvidar el plan claramente", en: "We need to forget the plan clearly." },
            { es: "necesitamos revisar el plan claramente", en: "We need to review the plan clearly." }
        ]
    },
    {
        english: "She prefers to work in a quiet place.",
        correct: { es: "ella prefiere trabajar en un lugar tranquilo", en: "She prefers to work in a quiet place." },
        options: [
            { es: "ella prefiere trabajar en un lugar tranquilo", en: "She prefers to work in a quiet place." },
            { es: "ella prefiere trabajar en un lugar ruidoso", en: "She prefers to work in a noisy place." },
            { es: "ella prefiere trabajar en un lugar pequeño", en: "She prefers to work in a small place." },
            { es: "ella prefiere trabajar en un lugar frío", en: "She prefers to work in a cold place." }
        ]
    },
    {
        english: "I decided to take the earlier bus.",
        correct: { es: "decidí tomar el autobús más temprano", en: "I decided to take the earlier bus." },
        options: [
            { es: "decidí tomar el autobús más temprano", en: "I decided to take the earlier bus." },
            { es: "decidí tomar el autobús más tarde", en: "I decided to take the later bus." },
            { es: "decidí tomar el autobús equivocado", en: "I decided to take the wrong bus." },
            { es: "decidí tomar el autobús correcto", en: "I decided to take the correct bus." }
        ]
    },
    {
        english: "We’re preparing a simple dinner tonight.",
        correct: { es: "estamos preparando una cena sencilla esta noche", en: "We’re preparing a simple dinner tonight." },
        options: [
            { es: "estamos preparando una cena sencilla esta noche", en: "We’re preparing a simple dinner tonight." },
            { es: "estamos preparando una cena grande esta noche", en: "We’re preparing a big dinner tonight." },
            { es: "estamos preparando una cena fría esta noche", en: "We’re preparing a cold dinner tonight." },
            { es: "estamos preparando una cena nueva esta noche", en: "We’re preparing a new dinner tonight." }
        ]
    },
    {
        english: "He explained the problem very well.",
        correct: { es: "él explicó el problema muy bien", en: "He explained the problem very well." },
        options: [
            { es: "él explicó el problema muy bien", en: "He explained the problem very well." },
            { es: "él olvidó el problema muy bien", en: "He forgot the problem very well." },
            { es: "él cambió el problema muy bien", en: "He changed the problem very well." },
            { es: "él revisó el problema muy bien", en: "He reviewed the problem very well." }
        ]
    },
    {
        english: "I’m trying to improve my Spanish every day.",
        correct: { es: "estoy tratando de mejorar mi español cada día", en: "I’m trying to improve my Spanish every day." },
        options: [
            { es: "estoy tratando de mejorar mi español cada día", en: "I’m trying to improve my Spanish every day." },
            { es: "estoy tratando de olvidar mi español cada día", en: "I’m trying to forget my Spanish every day." },
            { es: "estoy tratando de cambiar mi español cada día", en: "I’m trying to change my Spanish every day." },
            { es: "estoy tratando de enseñar mi español cada día", en: "I’m trying to teach my Spanish every day." }
        ]
    },
    {
        english: "She described the place in great detail.",
        correct: { es: "ella describió el lugar con mucho detalle", en: "She described the place in great detail." },
        options: [
            { es: "ella describió el lugar con mucho detalle", en: "She described the place in great detail." },
            { es: "ella olvidó el lugar con mucho detalle", en: "She forgot the place in great detail." },
            { es: "ella cambió el lugar con mucho detalle", en: "She changed the place in great detail." },
            { es: "ella revisó el lugar con mucho detalle", en: "She reviewed the place in great detail." }
        ]
    },
    {
        english: "We chose the restaurant because it’s quiet.",
        correct: { es: "elegimos el restaurante porque es tranquilo", en: "We chose the restaurant because it’s quiet." },
        options: [
            { es: "elegimos el restaurante porque es tranquilo", en: "We chose the restaurant because it’s quiet." },
            { es: "elegimos el restaurante porque es ruidoso", en: "We chose the restaurant because it’s noisy." },
            { es: "elegimos el restaurante porque es caro", en: "We chose the restaurant because it’s expensive." },
            { es: "elegimos el restaurante porque es pequeño", en: "We chose the restaurant because it’s small." }
        ]
    },
    {
        english: "He suggested a different idea.",
        correct: { es: "él sugirió una idea diferente", en: "He suggested a different idea." },
        options: [
            { es: "él sugirió una idea diferente", en: "He suggested a different idea." },
            { es: "él olvidó una idea diferente", en: "He forgot a different idea." },
            { es: "él rechazó una idea diferente", en: "He rejected a different idea." },
            { es: "él cambió una idea diferente", en: "He changed a different idea." }
        ]
    },
    {
        english: "I can’t imagine living in a cold place.",
        correct: { es: "no puedo imaginar vivir en un lugar frío", en: "I can’t imagine living in a cold place." },
        options: [
            { es: "no puedo imaginar vivir en un lugar frío", en: "I can’t imagine living in a cold place." },
            { es: "no puedo imaginar vivir en un lugar cálido", en: "I can’t imagine living in a warm place." },
            { es: "no puedo imaginar vivir en un lugar caro", en: "I can’t imagine living in an expensive place." },
            { es: "no puedo imaginar vivir en un lugar pequeño", en: "I can’t imagine living in a small place." }
        ]
    },
    {
        english: "We continued walking until we found the café.",
        correct: { es: "continuamos caminando hasta que encontramos el café", en: "We continued walking until we found the café." },
        options: [
            { es: "continuamos caminando hasta que encontramos el café", en: "We continued walking until we found the café." },
            { es: "continuamos caminando hasta que encontramos la tienda", en: "We continued walking until we found the shop." },
            { es: "continuamos caminando hasta que encontramos el parque", en: "We continued walking until we found the park." },
            { es: "continuamos caminando hasta que encontramos la casa", en: "We continued walking until we found the house." }
        ]
    },
    {
        english: "She explained why she arrived late.",
        correct: { es: "ella explicó por qué llegó tarde", en: "She explained why she arrived late." },
        options: [
            { es: "ella explicó por qué llegó tarde", en: "She explained why she arrived late." },
            { es: "ella explicó por qué llegó temprano", en: "She explained why she arrived early." },
            { es: "ella explicó por qué llegó cansada", en: "She explained why she arrived tired." },
            { es: "ella explicó por qué llegó feliz", en: "She explained why she arrived happy." }
        ]
    },
    {
        english: "I prefer to study in the morning.",
        correct: { es: "prefiero estudiar por la mañana", en: "I prefer to study in the morning." },
        options: [
            { es: "prefiero estudiar por la mañana", en: "I prefer to study in the morning." },
            { es: "prefiero estudiar por la tarde", en: "I prefer to study in the afternoon." },
            { es: "prefiero estudiar por la noche", en: "I prefer to study at night." },
            { es: "prefiero estudiar en casa", en: "I prefer to study at home." }
        ]
    },
    {
        english: "We’re trying to choose a good time.",
        correct: { es: "estamos tratando de elegir un buen momento", en: "We’re trying to choose a good time." },
        options: [
            { es: "estamos tratando de elegir un buen momento", en: "We’re trying to choose a good time." },
            { es: "estamos tratando de elegir un mal momento", en: "We’re trying to choose a bad time." },
            { es: "estamos tratando de elegir un momento temprano", en: "We’re trying to choose an early time." },
            { es: "estamos tratando de elegir un momento tarde", en: "We’re trying to choose a late time." }
        ]
    },
    {
        english: "He described the problem again.",
        correct: { es: "él describió el problema otra vez", en: "He described the problem again." },
        options: [
            { es: "él describió el problema otra vez", en: "He described the problem again." },
            { es: "él olvidó el problema otra vez", en: "He forgot the problem again." },
            { es: "él cambió el problema otra vez", en: "He changed the problem again." },
            { es: "él revisó el problema otra vez", en: "He reviewed the problem again." }
        ]
    },
    {
        english: "I’m preparing something simple for lunch.",
        correct: { es: "estoy preparando algo sencillo para el almuerzo", en: "I’m preparing something simple for lunch." },
        options: [
            { es: "estoy preparando algo sencillo para el almuerzo", en: "I’m preparing something simple for lunch." },
            { es: "estoy preparando algo grande para el almuerzo", en: "I’m preparing something big for lunch." },
            { es: "estoy preparando algo frío para el almuerzo", en: "I’m preparing something cold for lunch." },
            { es: "estoy preparando algo nuevo para el almuerzo", en: "I’m preparing something new for lunch." }
        ]
    },
    {
        english: "She continued talking for a long time.",
        correct: { es: "ella continuó hablando por mucho tiempo", en: "She continued talking for a long time." },
        options: [
            { es: "ella continuó hablando por mucho tiempo", en: "She continued talking for a long time." },
            { es: "ella continuó caminando por mucho tiempo", en: "She continued walking for a long time." },
            { es: "ella continuó leyendo por mucho tiempo", en: "She continued reading for a long time." },
            { es: "ella continuó escribiendo por mucho tiempo", en: "She continued writing for a long time." }
        ]
    },
    {
        english: "We chose this place because it’s comfortable.",
        correct: { es: "elegimos este lugar porque es cómodo", en: "We chose this place because it’s comfortable." },
        options: [
            { es: "elegimos este lugar porque es cómodo", en: "We chose this place because it’s comfortable." },
            { es: "elegimos este lugar porque es caro", en: "We chose this place because it’s expensive." },
            { es: "elegimos este lugar porque es frío", en: "We chose this place because it’s cold." },
            { es: "elegimos este lugar porque es pequeño", en: "We chose this place because it’s small." }
        ]
    },
       {
        english: "He suggested meeting a bit earlier.",
        correct: { es: "él sugirió reunirse un poco más temprano", en: "He suggested meeting a bit earlier." },
        options: [
            { es: "él sugirió reunirse un poco más temprano", en: "He suggested meeting a bit earlier." },
            { es: "él sugirió reunirse un poco más tarde", en: "He suggested meeting a bit later." },
            { es: "él sugirió reunirse en casa", en: "He suggested meeting at home." },
            { es: "él sugirió reunirse en el parque", en: "He suggested meeting at the park." }
        ]
    },

    /* ===== B1 PART 2 (joined cleanly) ===== */

    {
        english: "She explained the idea in a simple way.",
        correct: { es: "ella explicó la idea de una manera sencilla", en: "She explained the idea in a simple way." },
        options: [
            { es: "ella explicó la idea de una manera sencilla", en: "She explained the idea in a simple way." },
            { es: "ella explicó la idea de una manera difícil", en: "She explained the idea in a difficult way." },
            { es: "ella explicó la idea de una manera rápida", en: "She explained the idea in a fast way." },
            { es: "ella explicó la idea de una manera lenta", en: "She explained the idea in a slow way." }
        ]
    },

    {
        english: "We’re trying to improve the plan a little.",
        correct: { es: "estamos tratando de mejorar el plan un poco", en: "We’re trying to improve the plan a little." },
        options: [
            { es: "estamos tratando de mejorar el plan un poco", en: "We’re trying to improve the plan a little." },
            { es: "estamos tratando de cambiar el plan un poco", en: "We’re trying to change the plan a little." },
            { es: "estamos tratando de olvidar el plan un poco", en: "We’re trying to forget the plan a little." },
            { es: "estamos tratando de revisar el plan un poco", en: "We’re trying to review the plan a little." }
        ]
    },
    {
        english: "He suggested taking a short break.",
        correct: { es: "él sugirió tomar un descanso corto", en: "He suggested taking a short break." },
        options: [
            { es: "él sugirió tomar un descanso corto", en: "He suggested taking a short break." },
            { es: "él sugirió tomar un descanso largo", en: "He suggested taking a long break." },
            { es: "él sugirió tomar un descanso frío", en: "He suggested taking a cold break." },
            { es: "él sugirió tomar un descanso temprano", en: "He suggested taking an early break." }
        ]
    },
    {
        english: "I can’t imagine choosing another place.",
        correct: { es: "no puedo imaginar elegir otro lugar", en: "I can’t imagine choosing another place." },
        options: [
            { es: "no puedo imaginar elegir otro lugar", en: "I can’t imagine choosing another place." },
            { es: "no puedo imaginar elegir este lugar", en: "I can’t imagine choosing this place." },
            { es: "no puedo imaginar elegir un lugar pequeño", en: "I can’t imagine choosing a small place." },
            { es: "no puedo imaginar elegir un lugar caro", en: "I can’t imagine choosing an expensive place." }
        ]
    },
    {
        english: "She described the restaurant as very comfortable.",
        correct: { es: "ella describió el restaurante como muy cómodo", en: "She described the restaurant as very comfortable." },
        options: [
            { es: "ella describió el restaurante como muy cómodo", en: "She described the restaurant as very comfortable." },
            { es: "ella describió el restaurante como muy caro", en: "She described the restaurant as very expensive." },
            { es: "ella describió el restaurante como muy frío", en: "She described the restaurant as very cold." },
            { es: "ella describió el restaurante como muy pequeño", en: "She described the restaurant as very small." }
        ]
    },
    {
        english: "We continued talking until it got late.",
        correct: { es: "continuamos hablando hasta que se hizo tarde", en: "We continued talking until it got late." },
        options: [
            { es: "continuamos hablando hasta que se hizo tarde", en: "We continued talking until it got late." },
            { es: "continuamos hablando hasta que se hizo temprano", en: "We continued talking until it got early." },
            { es: "continuamos hablando hasta que se hizo frío", en: "We continued talking until it got cold." },
            { es: "continuamos hablando hasta que se hizo cómodo", en: "We continued talking until it got comfortable." }
        ]
    },
    {
        english: "He explained the reason very clearly.",
        correct: { es: "él explicó la razón muy claramente", en: "He explained the reason very clearly." },
        options: [
            { es: "él explicó la razón muy claramente", en: "He explained the reason very clearly." },
            { es: "él explicó la razón muy lentamente", en: "He explained the reason very slowly." },
            { es: "él explicó la razón muy rápidamente", en: "He explained the reason very quickly." },
            { es: "él explicó la razón muy mal", en: "He explained the reason very badly." }
        ]
    },
    {
        english: "I prefer to walk when the weather is warm.",
        correct: { es: "prefiero caminar cuando el clima está cálido", en: "I prefer to walk when the weather is warm." },
        options: [
            { es: "prefiero caminar cuando el clima está cálido", en: "I prefer to walk when the weather is warm." },
            { es: "prefiero caminar cuando el clima está frío", en: "I prefer to walk when the weather is cold." },
            { es: "prefiero caminar cuando el clima está lluvioso", en: "I prefer to walk when the weather is rainy." },
            { es: "prefiero caminar cuando el clima está caro", en: "I prefer to walk when the weather is expensive." }
        ]
    },
    {
        english: "We’re preparing everything for tomorrow.",
        correct: { es: "estamos preparando todo para mañana", en: "We’re preparing everything for tomorrow." },
        options: [
            { es: "estamos preparando todo para mañana", en: "We’re preparing everything for tomorrow." },
            { es: "estamos preparando todo para hoy", en: "We’re preparing everything for today." },
            { es: "estamos preparando todo para la tarde", en: "We’re preparing everything for the afternoon." },
            { es: "estamos preparando todo para la noche", en: "We’re preparing everything for tonight." }
        ]
    },
    {
        english: "She suggested choosing a quieter place.",
        correct: { es: "ella sugirió elegir un lugar más tranquilo", en: "She suggested choosing a quieter place." },
        options: [
            { es: "ella sugirió elegir un lugar más tranquilo", en: "She suggested choosing a quieter place." },
            { es: "ella sugirió elegir un lugar más ruidoso", en: "She suggested choosing a noisier place." },
            { es: "ella sugirió elegir un lugar más caro", en: "She suggested choosing a more expensive place." },
            { es: "ella sugirió elegir un lugar más pequeño", en: "She suggested choosing a smaller place." }
        ]
    },
    {
        english: "I’m trying to describe the problem clearly.",
        correct: { es: "estoy tratando de describir el problema claramente", en: "I’m trying to describe the problem clearly." },
        options: [
            { es: "estoy tratando de describir el problema claramente", en: "I’m trying to describe the problem clearly." },
            { es: "estoy tratando de describir el problema lentamente", en: "I’m trying to describe the problem slowly." },
            { es: "estoy tratando de describir el problema rápidamente", en: "I’m trying to describe the problem quickly." },
            { es: "estoy tratando de describir el problema mal", en: "I’m trying to describe the problem badly." }
        ]
    },
    {
        english: "We continued walking until we reached the shop.",
        correct: { es: "continuamos caminando hasta que llegamos a la tienda", en: "We continued walking until we reached the shop." },
        options: [
            { es: "continuamos caminando hasta que llegamos a la tienda", en: "We continued walking until we reached the shop." },
            { es: "continuamos caminando hasta que llegamos al parque", en: "We continued walking until we reached the park." },
            { es: "continuamos caminando hasta que llegamos al café", en: "We continued walking until we reached the café." },
            { es: "continuamos caminando hasta que llegamos a la casa", en: "We continued walking until we reached the house." }
        ]
    },
    {
        english: "He described the place as warm and comfortable.",
        correct: { es: "él describió el lugar como cálido y cómodo", en: "He described the place as warm and comfortable." },
        options: [
            { es: "él describió el lugar como cálido y cómodo", en: "He described the place as warm and comfortable." },
            { es: "él describió el lugar como frío y cómodo", en: "He described the place as cold and comfortable." },
            { es: "él describió el lugar como cálido y caro", en: "He described the place as warm and expensive." },
            { es: "él describió el lugar como cálido y pequeño", en: "He described the place as warm and small." }
        ]
    },
    {
        english: "I decided to choose the earlier time.",
        correct: { es: "decidí elegir el momento más temprano", en: "I decided to choose the earlier time." },
        options: [
            { es: "decidí elegir el momento más temprano", en: "I decided to choose the earlier time." },
            { es: "decidí elegir el momento más tarde", en: "I decided to choose the later time." },
            { es: "decidí elegir el momento más frío", en: "I decided to choose the colder time." },
            { es: "decidí elegir el momento más caro", en: "I decided to choose the more expensive time." }
        ]
    },
    {
        english: "She explained the plan again.",
        correct: { es: "ella explicó el plan otra vez", en: "She explained the plan again." },
        options: [
            { es: "ella explicó el plan otra vez", en: "She explained the plan again." },
            { es: "ella cambió el plan otra vez", en: "She changed the plan again." },
            { es: "ella olvidó el plan otra vez", en: "She forgot the plan again." },
            { es: "ella revisó el plan otra vez", en: "She reviewed the plan again." }
        ]
    },
    {
        english: "We’re preparing something warm for dinner.",
        correct: { es: "estamos preparando algo cálido para la cena", en: "We’re preparing something warm for dinner." },
        options: [
            { es: "estamos preparando algo cálido para la cena", en: "We’re preparing something warm for dinner." },
            { es: "estamos preparando algo frío para la cena", en: "We’re preparing something cold for dinner." },
            { es: "estamos preparando algo caro para la cena", en: "We’re preparing something expensive for dinner." },
            { es: "estamos preparando algo pequeño para la cena", en: "We’re preparing something small for dinner." }
        ]
    },
    {
        english: "He continued explaining for a long time.",
        correct: { es: "él continuó explicando por mucho tiempo", en: "He continued explaining for a long time." },
        options: [
            { es: "él continuó explicando por mucho tiempo", en: "He continued explaining for a long time." },
            { es: "él continuó leyendo por mucho tiempo", en: "He continued reading for a long time." },
            { es: "él continuó escribiendo por mucho tiempo", en: "He continued writing for a long time." },
            { es: "él continuó caminando por mucho tiempo", en: "He continued walking for a long time." }
        ]
    },
        {
        english: "I prefer to choose a simple option.",
        correct: { es: "prefiero elegir una opción sencilla", en: "I prefer to choose a simple option." },
        options: [
            { es: "prefiero elegir una opción sencilla", en: "I prefer to choose a simple option." },
            { es: "prefiero elegir una opción cara", en: "I prefer to choose an expensive option." },
            { es: "prefiero elegir una opción fría", en: "I prefer to choose a cold option." },
            { es: "prefiero elegir una opción pequeña", en: "I prefer to choose a small option." }
        ]
    }
],   // ← CLEAN END OF B1 ARRAY

/* ============================
   B2 — Upper Intermediate
   ============================ */

b2: [
    {
        english: "We need to consider all the details before deciding.",
        correct: { es: "necesitamos considerar todos los detalles antes de decidir", en: "We need to consider all the details before deciding." },
        options: [
            { es: "necesitamos considerar todos los detalles antes de decidir", en: "We need to consider all the details before deciding." },
            { es: "necesitamos ignorar todos los detalles antes de decidir", en: "We need to ignore all the details before deciding." },
            { es: "necesitamos cambiar todos los detalles antes de decidir", en: "We need to change all the details before deciding." },
            { es: "necesitamos revisar todos los detalles antes de decidir", en: "We need to review all the details before deciding." }
        ]
    },

    {
        english: "She realised the problem was more complex than expected.",
        correct: { es: "ella se dio cuenta de que el problema era más complejo de lo esperado", en: "She realised the problem was more complex than expected." },
        options: [
            { es: "ella se dio cuenta de que el problema era más complejo de lo esperado", en: "She realised the problem was more complex than expected." },
            { es: "ella se dio cuenta de que el problema era más simple de lo esperado", en: "She realised the problem was simpler than expected." },
            { es: "ella se dio cuenta de que el problema era más corto de lo esperado", en: "She realised the problem was shorter than expected." },
            { es: "ella se dio cuenta de que el problema era más caro de lo esperado", en: "She realised the problem was more expensive than expected." }
        ]
    },
    {
        english: "We’re organising everything so the day runs smoothly.",
        correct: { es: "estamos organizando todo para que el día vaya bien", en: "We’re organising everything so the day runs smoothly." },
        options: [
            { es: "estamos organizando todo para que el día vaya bien", en: "We’re organising everything so the day runs smoothly." },
            { es: "estamos organizando todo para que el día vaya mal", en: "We’re organising everything so the day goes badly." },
            { es: "estamos organizando todo para que el día sea corto", en: "We’re organising everything so the day is short." },
            { es: "estamos organizando todo para que el día sea caro", en: "We’re organising everything so the day is expensive." }
        ]
    },
    {
        english: "He managed to finish the task on time.",
        correct: { es: "él logró terminar la tarea a tiempo", en: "He managed to finish the task on time." },
        options: [
            { es: "él logró terminar la tarea a tiempo", en: "He managed to finish the task on time." },
            { es: "él logró terminar la tarea tarde", en: "He managed to finish the task late." },
            { es: "él logró terminar la tarea mal", en: "He managed to finish the task badly." },
            { es: "él logró terminar la tarea temprano", en: "He managed to finish the task early." }
        ]
    },
    {
        english: "I recommend choosing a quieter place for the meeting.",
        correct: { es: "recomiendo elegir un lugar más tranquilo para la reunión", en: "I recommend choosing a quieter place for the meeting." },
        options: [
            { es: "recomiendo elegir un lugar más tranquilo para la reunión", en: "I recommend choosing a quieter place for the meeting." },
            { es: "recomiendo elegir un lugar más ruidoso para la reunión", en: "I recommend choosing a noisier place for the meeting." },
            { es: "recomiendo elegir un lugar más caro para la reunión", en: "I recommend choosing a more expensive place for the meeting." },
            { es: "recomiendo elegir un lugar más pequeño para la reunión", en: "I recommend choosing a smaller place for the meeting." }
        ]
    },
    {
        english: "We discussed several options before making a decision.",
        correct: { es: "discutimos varias opciones antes de tomar una decisión", en: "We discussed several options before making a decision." },
        options: [
            { es: "discutimos varias opciones antes de tomar una decisión", en: "We discussed several options before making a decision." },
            { es: "discutimos varias opciones después de tomar una decisión", en: "We discussed several options after making a decision." },
            { es: "discutimos varias opciones sin tomar una decisión", en: "We discussed several options without making a decision." },
            { es: "discutimos varias opciones para evitar una decisión", en: "We discussed several options to avoid a decision." }
        ]
    },
    {
        english: "She recognised the place from a photo.",
        correct: { es: "ella reconoció el lugar por una foto", en: "She recognised the place from a photo." },
        options: [
            { es: "ella reconoció el lugar por una foto", en: "She recognised the place from a photo." },
            { es: "ella reconoció el lugar por un mensaje", en: "She recognised the place from a message." },
            { es: "ella reconoció el lugar por una llamada", en: "She recognised the place from a call." },
            { es: "ella reconoció el lugar por una historia", en: "She recognised the place from a story." }
        ]
    },
    {
        english: "We analysed the problem and found a simple solution.",
        correct: { es: "analizamos el problema y encontramos una solución sencilla", en: "We analysed the problem and found a simple solution." },
        options: [
            { es: "analizamos el problema y encontramos una solución sencilla", en: "We analysed the problem and found a simple solution." },
            { es: "analizamos el problema y encontramos una solución cara", en: "We analysed the problem and found an expensive solution." },
            { es: "analizamos el problema y encontramos una solución fría", en: "We analysed the problem and found a cold solution." },
            { es: "analizamos el problema y encontramos una solución pequeña", en: "We analysed the problem and found a small solution." }
        ]
    },
    {
        english: "He realised he needed more time to prepare.",
        correct: { es: "él se dio cuenta de que necesitaba más tiempo para prepararse", en: "He realised he needed more time to prepare." },
        options: [
            { es: "él se dio cuenta de que necesitaba más tiempo para prepararse", en: "He realised he needed more time to prepare." },
            { es: "él se dio cuenta de que necesitaba menos tiempo para prepararse", en: "He realised he needed less time to prepare." },
            { es: "él se dio cuenta de que necesitaba tiempo frío para prepararse", en: "He realised he needed cold time to prepare." },
            { es: "él se dio cuenta de que necesitaba tiempo caro para prepararse", en: "He realised he needed expensive time to prepare." }
        ]
    },
    {
        english: "We’re trying to organise the day more efficiently.",
        correct: { es: "estamos tratando de organizar el día de manera más eficiente", en: "We’re trying to organise the day more efficiently." },
        options: [
            { es: "estamos tratando de organizar el día de manera más eficiente", en: "We’re trying to organise the day more efficiently." },
            { es: "estamos tratando de organizar el día de manera más lenta", en: "We’re trying to organise the day more slowly." },
            { es: "estamos tratando de organizar el día de manera más cara", en: "We’re trying to organise the day more expensively." },
            { es: "estamos tratando de organizar el día de manera más fría", en: "We’re trying to organise the day more coldly." }
        ]
    },
    {
        english: "She compared the two options carefully.",
        correct: { es: "ella comparó las dos opciones cuidadosamente", en: "She compared the two options carefully." },
        options: [
            { es: "ella comparó las dos opciones cuidadosamente", en: "She compared the two options carefully." },
            { es: "ella comparó las dos opciones rápidamente", en: "She compared the two options quickly." },
            { es: "ella comparó las dos opciones mal", en: "She compared the two options badly." },
            { es: "ella comparó las dos opciones lentamente", en: "She compared the two options slowly." }
        ]
    },
    {
        english: "We expect the meeting to finish early.",
        correct: { es: "esperamos que la reunión termine temprano", en: "We expect the meeting to finish early." },
        options: [
            { es: "esperamos que la reunión termine temprano", en: "We expect the meeting to finish early." },
            { es: "esperamos que la reunión termine tarde", en: "We expect the meeting to finish late." },
            { es: "esperamos que la reunión termine mal", en: "We expect the meeting to finish badly." },
            { es: "esperamos que la reunión termine frío", en: "We expect the meeting to finish cold." }
        ]
    },
    {
        english: "He managed to organise everything before midday.",
        correct: { es: "él logró organizar todo antes del mediodía", en: "He managed to organise everything before midday." },
        options: [
            { es: "él logró organizar todo antes del mediodía", en: "He managed to organise everything before midday." },
            { es: "él logró organizar todo después del mediodía", en: "He managed to organise everything after midday." },
            { es: "él logró organizar todo en la noche", en: "He managed to organise everything at night." },
            { es: "él logró organizar todo en la mañana", en: "He managed to organise everything in the morning." }
        ]
    },
    {
        english: "I recommend preparing a bit earlier next time.",
        correct: { es: "recomiendo prepararse un poco más temprano la próxima vez", en: "I recommend preparing a bit earlier next time." },
        options: [
            { es: "recomiendo prepararse un poco más temprano la próxima vez", en: "I recommend preparing a bit earlier next time." },
            { es: "recomiendo prepararse un poco más tarde la próxima vez", en: "I recommend preparing a bit later next time." },
            { es: "recomiendo prepararse en casa la próxima vez", en: "I recommend preparing at home next time." },
            { es: "recomiendo prepararse en el parque la próxima vez", en: "I recommend preparing at the park next time." }
        ]
    },
    {
        english: "We discussed the plan and agreed on a few changes.",
        correct: { es: "discutimos el plan y acordamos algunos cambios", en: "We discussed the plan and agreed on a few changes." },
        options: [
            { es: "discutimos el plan y acordamos algunos cambios", en: "We discussed the plan and agreed on a few changes." },
            { es: "discutimos el plan y acordamos ningún cambio", en: "We discussed the plan and agreed on no changes." },
            { es: "discutimos el plan y acordamos muchos cambios", en: "We discussed the plan and agreed on many changes." },
            { es: "discutimos el plan y acordamos cambios fríos", en: "We discussed the plan and agreed on cold changes." }
        ]
    },
    {
        english: "She recognised the problem immediately.",
        correct: { es: "ella reconoció el problema de inmediato", en: "She recognised the problem immediately." },
        options: [
            { es: "ella reconoció el problema de inmediato", en: "She recognised the problem immediately." },
            { es: "ella reconoció el problema lentamente", en: "She recognised the problem slowly." },
            { es: "ella reconoció el problema tarde", en: "She recognised the problem late." },
            { es: "ella reconoció el problema mal", en: "She recognised the problem badly." }
        ]
    },
    {
        english: "We analysed the situation and chose the best option.",
        correct: { es: "analizamos la situación y elegimos la mejor opción", en: "We analysed the situation and chose the best option." },
        options: [
            { es: "analizamos la situación y elegimos la mejor opción", en: "We analysed the situation and chose the best option." },
            { es: "analizamos la situación y elegimos la peor opción", en: "We analysed the situation and chose the worst option." },
            { es: "analizamos la situación y elegimos una opción fría", en: "We analysed the situation and chose a cold option." },
            { es: "analizamos la situación y elegimos una opción cara", en: "We analysed the situation and chose an expensive option." }
        ]
    },
       {
        english: "He realised the meeting would take longer than planned.",
        correct: { es: "él se dio cuenta de que la reunión tomaría más tiempo de lo planeado", en: "He realised the meeting would take longer than planned." },
        options: [
            { es: "él se dio cuenta de que la reunión tomaría más tiempo de lo planeado", en: "He realised the meeting would take longer than planned." },
            { es: "él se dio cuenta de que la reunión tomaría menos tiempo de lo planeado", en: "He realised the meeting would take less time than planned." },
            { es: "él se dio cuenta de que la reunión tomaría tiempo frío", en: "He realised the meeting would take cold time." },
            { es: "él se dio cuenta de que la reunión tomaría tiempo caro", en: "He realised the meeting would take expensive time." }
        ]
    },

    /* ===== B2 PART 2 (joined cleanly) ===== */

    {
        english: "She considered changing the plan after the meeting.",
        correct: { es: "ella consideró cambiar el plan después de la reunión", en: "She considered changing the plan after the meeting." },
        options: [
            { es: "ella consideró cambiar el plan después de la reunión", en: "She considered changing the plan after the meeting." },
            { es: "ella consideró olvidar el plan después de la reunión", en: "She considered forgetting the plan after the meeting." },
            { es: "ella consideró revisar el plan después de la reunión", en: "She considered reviewing the plan after the meeting." },
            { es: "ella consideró terminar el plan después de la reunión", en: "She considered finishing the plan after the meeting." }
        ]
    },

    {
        english: "We realised the situation required more attention.",
        correct: { es: "nos dimos cuenta de que la situación requería más atención", en: "We realised the situation required more attention." },
        options: [
            { es: "nos dimos cuenta de que la situación requería más atención", en: "We realised the situation required more attention." },
            { es: "nos dimos cuenta de que la situación requería menos atención", en: "We realised the situation required less attention." },
            { es: "nos dimos cuenta de que la situación requería atención fría", en: "We realised the situation required cold attention." },
            { es: "nos dimos cuenta de que la situación requería atención cara", en: "We realised the situation required expensive attention." }
        ]
    },
    {
        english: "He managed to explain everything without any confusion.",
        correct: { es: "él logró explicar todo sin ninguna confusión", en: "He managed to explain everything without any confusion." },
        options: [
            { es: "él logró explicar todo sin ninguna confusión", en: "He managed to explain everything without any confusion." },
            { es: "él logró explicar todo con mucha confusión", en: "He managed to explain everything with a lot of confusion." },
            { es: "él logró explicar todo muy tarde", en: "He managed to explain everything very late." },
            { es: "él logró explicar todo muy rápido", en: "He managed to explain everything very quickly." }
        ]
    },
    {
        english: "I recommend discussing the problem before choosing a solution.",
        correct: { es: "recomiendo discutir el problema antes de elegir una solución", en: "I recommend discussing the problem before choosing a solution." },
        options: [
            { es: "recomiendo discutir el problema antes de elegir una solución", en: "I recommend discussing the problem before choosing a solution." },
            { es: "recomiendo discutir el problema después de elegir una solución", en: "I recommend discussing the problem after choosing a solution." },
            { es: "recomiendo discutir el problema sin elegir una solución", en: "I recommend discussing the problem without choosing a solution." },
            { es: "recomiendo discutir el problema para evitar una solución", en: "I recommend discussing the problem to avoid a solution." }
        ]
    },
    {
        english: "We compared several ideas and chose the most practical one.",
        correct: { es: "comparamos varias ideas y elegimos la más práctica", en: "We compared several ideas and chose the most practical one." },
        options: [
            { es: "comparamos varias ideas y elegimos la más práctica", en: "We compared several ideas and chose the most practical one." },
            { es: "comparamos varias ideas y elegimos la más cara", en: "We compared several ideas and chose the most expensive one." },
            { es: "comparamos varias ideas y elegimos la más fría", en: "We compared several ideas and chose the coldest one." },
            { es: "comparamos varias ideas y elegimos la más pequeña", en: "We compared several ideas and chose the smallest one." }
        ]
    },
    {
        english: "She recognised the mistake and corrected it quickly.",
        correct: { es: "ella reconoció el error y lo corrigió rápidamente", en: "She recognised the mistake and corrected it quickly." },
        options: [
            { es: "ella reconoció el error y lo corrigió rápidamente", en: "She recognised the mistake and corrected it quickly." },
            { es: "ella reconoció el error y lo corrigió lentamente", en: "She recognised the mistake and corrected it slowly." },
            { es: "ella reconoció el error y lo corrigió mal", en: "She recognised the mistake and corrected it badly." },
            { es: "ella reconoció el error y lo corrigió tarde", en: "She recognised the mistake and corrected it late." }
        ]
    },
    {
        english: "We analysed the results and noticed a clear pattern.",
        correct: { es: "analizamos los resultados y notamos un patrón claro", en: "We analysed the results and noticed a clear pattern." },
        options: [
            { es: "analizamos los resultados y notamos un patrón claro", en: "We analysed the results and noticed a clear pattern." },
            { es: "analizamos los resultados y notamos un patrón pequeño", en: "We analysed the results and noticed a small pattern." },
            { es: "analizamos los resultados y notamos un patrón caro", en: "We analysed the results and noticed an expensive pattern." },
            { es: "analizamos los resultados y notamos un patrón frío", en: "We analysed the results and noticed a cold pattern." }
        ]
    },
    {
        english: "He considered waiting a bit longer before leaving.",
        correct: { es: "él consideró esperar un poco más antes de irse", en: "He considered waiting a bit longer before leaving." },
        options: [
            { es: "él consideró esperar un poco más antes de irse", en: "He considered waiting a bit longer before leaving." },
            { es: "él consideró esperar un poco menos antes de irse", en: "He considered waiting a bit less before leaving." },
            { es: "él consideró esperar en casa antes de irse", en: "He considered waiting at home before leaving." },
            { es: "él consideró esperar en el parque antes de irse", en: "He considered waiting at the park before leaving." }
        ]
    },
    {
        english: "We expect the project to take a few more days.",
        correct: { es: "esperamos que el proyecto tome unos días más", en: "We expect the project to take a few more days." },
        options: [
            { es: "esperamos que el proyecto tome unos días más", en: "We expect the project to take a few more days." },
            { es: "esperamos que el proyecto tome unos días menos", en: "We expect the project to take a few fewer days." },
            { es: "esperamos que el proyecto tome días fríos", en: "We expect the project to take cold days." },
            { es: "esperamos que el proyecto tome días caros", en: "We expect the project to take expensive days." }
        ]
    },
    {
        english: "She managed to organise everything without any help.",
        correct: { es: "ella logró organizar todo sin ninguna ayuda", en: "She managed to organise everything without any help." },
        options: [
            { es: "ella logró organizar todo sin ninguna ayuda", en: "She managed to organise everything without any help." },
            { es: "ella logró organizar todo con mucha ayuda", en: "She managed to organise everything with a lot of help." },
            { es: "ella logró organizar todo muy tarde", en: "She managed to organise everything very late." },
            { es: "ella logró organizar todo muy rápido", en: "She managed to organise everything very quickly." }
        ]
    },
    {
        english: "I recommend choosing the option that feels most comfortable.",
        correct: { es: "recomiendo elegir la opción que se sienta más cómoda", en: "I recommend choosing the option that feels most comfortable." },
        options: [
            { es: "recomiendo elegir la opción que se sienta más cómoda", en: "I recommend choosing the option that feels most comfortable." },
            { es: "recomiendo elegir la opción que se sienta más cara", en: "I recommend choosing the option that feels more expensive." },
            { es: "recomiendo elegir la opción que se sienta más fría", en: "I recommend choosing the option that feels colder." },
            { es: "recomiendo elegir la opción que se sienta más pequeña", en: "I recommend choosing the option that feels smaller." }
        ]
    },
    {
        english: "We discussed the idea and agreed it was practical.",
        correct: { es: "discutimos la idea y acordamos que era práctica", en: "We discussed the idea and agreed it was practical." },
        options: [
            { es: "discutimos la idea y acordamos que era práctica", en: "We discussed the idea and agreed it was practical." },
            { es: "discutimos la idea y acordamos que era cara", en: "We discussed the idea and agreed it was expensive." },
            { es: "discutimos la idea y acordamos que era fría", en: "We discussed the idea and agreed it was cold." },
            { es: "discutimos la idea y acordamos que era pequeña", en: "We discussed the idea and agreed it was small." }
        ]
    },
    {
        english: "She recognised the voice immediately.",
        correct: { es: "ella reconoció la voz de inmediato", en: "She recognised the voice immediately." },
        options: [
            { es: "ella reconoció la voz de inmediato", en: "She recognised the voice immediately." },
            { es: "ella reconoció la voz lentamente", en: "She recognised the voice slowly." },
            { es: "ella reconoció la voz tarde", en: "She recognised the voice late." },
            { es: "ella reconoció la voz mal", en: "She recognised the voice badly." }
        ]
    },
    {
        english: "We analysed the options and chose the most efficient one.",
        correct: { es: "analizamos las opciones y elegimos la más eficiente", en: "We analysed the options and chose the most efficient one." },
        options: [
            { es: "analizamos las opciones y elegimos la más eficiente", en: "We analysed the options and chose the most efficient one." },
            { es: "analizamos las opciones y elegimos la más cara", en: "We analysed the options and chose the most expensive one." },
            { es: "analizamos las opciones y elegimos la más fría", en: "We analysed the options and chose the coldest one." },
            { es: "analizamos las opciones y elegimos la más pequeña", en: "We analysed the options and chose the smallest one." }
        ]
    },
    {
        english: "He considered preparing everything earlier next time.",
        correct: { es: "él consideró preparar todo más temprano la próxima vez", en: "He considered preparing everything earlier next time." },
        options: [
            { es: "él consideró preparar todo más temprano la próxima vez", en: "He considered preparing everything earlier next time." },
            { es: "él consideró preparar todo más tarde la próxima vez", en: "He considered preparing everything later next time." },
            { es: "él consideró preparar todo en casa la próxima vez", en: "He considered preparing everything at home next time." },
            { es: "él consideró preparar todo en el parque la próxima vez", en: "He considered preparing everything at the park next time." }
        ]
    },
    {
        english: "We expect the day to run smoothly if we organise well.",
        correct: { es: "esperamos que el día vaya bien si organizamos bien", en: "We expect the day to run smoothly if we organise well." },
        options: [
            { es: "esperamos que el día vaya bien si organizamos bien", en: "We expect the day to run smoothly if we organise well." },
            { es: "esperamos que el día vaya mal si organizamos bien", en: "We expect the day to go badly if we organise well." },
            { es: "esperamos que el día vaya frío si organizamos bien", en: "We expect the day to go cold if we organise well." },
            { es: "esperamos que el día vaya caro si organizamos bien", en: "We expect the day to go expensive if we organise well." }
        ]
    },
    {
        english: "She managed to finish everything before the deadline.",
        correct: { es: "ella logró terminar todo antes de la fecha límite", en: "She managed to finish everything before the deadline." },
        options: [
            { es: "ella logró terminar todo antes de la fecha límite", en: "She managed to finish everything before the deadline." },
            { es: "ella logró terminar todo después de la fecha límite", en: "She managed to finish everything after the deadline." },
            { es: "ella logró terminar todo muy tarde", en: "She managed to finish everything very late." },
            { es: "ella logró terminar todo muy rápido", en: "She managed to finish everything very quickly." }
        ]
    },
       {
        english: "I recommend discussing the details more carefully next time.",
        correct: { es: "recomiendo discutir los detalles más cuidadosamente la próxima vez", en: "I recommend discussing the details more carefully next time." },
        options: [
            { es: "recomiendo discutir los detalles más cuidadosamente la próxima vez", en: "I recommend discussing the details more carefully next time." },
            { es: "recomiendo discutir los detalles más rápidamente la próxima vez", en: "I recommend discussing the details more quickly next time." },
            { es: "recomiendo discutir los detalles más tarde la próxima vez", en: "I recommend discussing the details later next time." },
            { es: "recomiendo discutir los detalles en casa la próxima vez", en: "I recommend discussing the details at home next time." }
        ]
    }
]   // ← CLEAN END OF B2 ARRAY
};

/* ============================================================
   REDUCED DISRUPTOR SET — 5 PER LEVEL (FIXED DOUBLE-NESTING)
   ============================================================ */
function getDisruptorResponses(level) {
    const disruptors = DISRUPTOR_WORDS[level] || [];
    return disruptors.slice(0, 3).map(d => {
        if (d && typeof d === 'object' && d.es) {
            return { es: d.es, en: d.en || "Incorrect response" };
        }
        return { es: String(d), en: "Incorrect response" };
    });
}

const DISRUPTORS_a1 = [
    { es: "Bueno, te digo algo.", en: "Well, let me tell you something." },
    { es: "Pues mira.", en: "Well, look." },
    { es: "La verdad es que.", en: "The truth is that..." }
];

const DISRUPTORS_a2 = [
    { es: "A menudo pienso en esto.", en: "I often think about this." },
    { es: "Antes de responder, te cuento.", en: "Before answering, let me tell you something." },
    { es: "Ya sabes cómo es.", en: "You know how it is." }
];

const DISRUPTORS_b1 = [
    { es: "Mientras lo pienso, te digo algo.", en: "While I think about it, let me tell you something." },
    { es: "Sin embargo, hay más que decir.", en: "However, there's more to say." },
    { es: "Sobre esto, tengo una opinion.", en: "About this, I have an opinion." }
];

const DISRUPTORS_b2 = [
    { es: "además", en: "besides" },
    { es: "por lo tanto", en: "therefore" },
    { es: "a pesar de", en: "despite" },
    { es: "aunque", en: "although" },
    { es: "incluso", en: "even" }
];

const DISRUPTOR_WORDS = {
    A1: DISRUPTORS_a1,
    A2: DISRUPTORS_a2,
    B1: DISRUPTORS_b1,
    B2: DISRUPTORS_b2
};

/* ============================================================
   MERGED CEFR PHRASES (A1–B2)
   ============================================================ */

const CEFR_PHRASES = [
    ...(CEFR_PHRASES_a1 || []),
    ...(CEFR_PHRASES_a2 || []),
    ...(CEFR_PHRASES_b1 || []),
    ...(CEFR_PHRASES_b2 || [])
];


/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY & CONVERSATIONAL PHRASE SEARCH
   (Patched with cleanStringForKeyboard normalization)
   ============================================================ */

function globalLookup(word) {
    if (!word) return null;

    const w = word.toLowerCase();
    const cw = cleanStringForKeyboard(w);   // normalized input
    const levelsList = ["a1", "a2", "b1", "b2"];

    /* ============================================================
       1. CEFR Vocabulary
    ============================================================ */
    for (const level of levelsList) {
        const vocab = CEFR_LEVELS?.[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cw
        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Vocabulary", level };
        }
    }

    /* ============================================================
       2. CEFR Sentences
    ============================================================ */
    for (const level of levelsList) {
        const bank = CEFR_SENTENCES?.[level];
        if (!bank) continue;

        const match = bank.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cw
        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Sentences", level };
        }
    }

    /* ============================================================
       3. CEFR Dialogue Choices
    ============================================================ */
    for (const level of levelsList) {
        const bank = CEFR_SENTENCE_CHOICES?.[level];
        if (!bank) continue;

        const match = bank.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cw
        );
        if (match) {
            return { spanish: match.correct?.es, source: "Dialogue Choices", level };
        }
    }

    /* ============================================================
       4. CEFR Phrases (A1–B2 merged)
    ============================================================ */
    if (Array.isArray(CEFR_PHRASES)) {
        const phraseMatch = CEFR_PHRASES.find(p =>
            cleanStringForKeyboard(p?.english || "").toLowerCase() === cw
        );
        if (phraseMatch) {
            return {
                spanish: phraseMatch.spanish,
                source: "CEFR Phrases",
                level: phraseMatch.level || "GLOBAL"
            };
        }
    }

    /* ============================================================
       5. Listening Vocabulary
    ============================================================ */
    if (Array.isArray(LISTEN_VOCAB)) {
        const lvMatch = LISTEN_VOCAB.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cw
        );
        if (lvMatch) {
            return {
                spanish: lvMatch.spanish,
                source: "Listen Vocab",
                level: lvMatch.level || "GLOBAL"
            };
        }
    }

    /* ============================================================
       6. Word Dictionary (custom)
    ============================================================ */
    if (WORD_DICT?.[w]) {
        return { spanish: WORD_DICT[w], source: "Word Dictionary", level: "GLOBAL" };
    }

    /* ============================================================
       7. Conversation Prompts
    ============================================================ */
    if (CEFR_CONVERSATION_PROMPTS) {
        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {
            const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];
            const convoMatch = prompts.find(p =>
                cleanStringForKeyboard(p?.english || "").toLowerCase() === cw
            );
            if (convoMatch) {
                return {
                    spanish: convoMatch.spanish,
                    source: "Conversation Prompt",
                    level: convoMatch.level || levelKey
                };
            }
        }
    }

    /* ============================================================
       8. Conversation Audio Banks
    ============================================================ */
    const convoAudioBanks = [
        CEFR_CONVERSATION_AUDIO_a1,
        CEFR_CONVERSATION_AUDIO_a2,
        CEFR_CONVERSATION_AUDIO_b1,
        CEFR_CONVERSATION_AUDIO_b2
    ];

    for (const bank of convoAudioBanks) {
        if (!Array.isArray(bank)) continue;

        const audioMatch = bank.find(a =>
            cleanStringForKeyboard(a?.english || "").toLowerCase() === cw
        );
        if (audioMatch) {
            return {
                spanish: audioMatch.spanish,
                source: "Conversation Audio",
                level: audioMatch.level || "GLOBAL"
            };
        }
    }

    return null;
}



/* ============================================================
   SMART PHRASE SPLITTING (ENGLISH → SPANISH)
   ============================================================ */

function splitPhraseLookup(query) {
    if (!query) return null;

    // Normalize input words (remove accents, punctuation, spacing)
    const rawWords = query.toLowerCase().split(/\s+/);
    const words = rawWords.map(w => cleanStringForKeyboard(w));

    if (words.length <= 1) return null;

    for (let start = 0; start < words.length; start++) {
        for (let end = words.length; end > start; end--) {

            const subPhrase = words.slice(start, end).join(" ");

            /* Priority: CEFR_PHRASES first (normalized comparison) */
            let subResult = null;

            if (Array.isArray(CEFR_PHRASES)) {
                const phraseHit = CEFR_PHRASES.find(p =>
                    cleanStringForKeyboard(p?.english || "").toLowerCase() === subPhrase
                );
                if (phraseHit) {
                    subResult = { spanish: phraseHit.spanish };
                }
            }

            /* Fallback: globalLookup (already normalized) */
            if (!subResult) {
                subResult = globalLookup(subPhrase);
            }

            if (subResult) {
                const before = words.slice(0, start).join(" ");
                const after  = words.slice(end).join(" ");

                return {
                    spanish: [before, subResult.spanish, after].join(" ").trim(),
                    matched: subPhrase
                };
            }
        }
    }

    return null;
}



/* ============================================================
   SPANISH → ENGLISH LOOKUP
   ============================================================ */

function globalLookupSpanish(spanishText) {
    if (!spanishText) return "[Unknown translation]";

    const s = cleanStringForKeyboard(spanishText.toLowerCase().trim());
    const banks = [];

    if (CEFR_LEVELS?.a1) banks.push(...CEFR_LEVELS.a1);
    if (CEFR_LEVELS?.a2) banks.push(...CEFR_LEVELS.a2);
    if (CEFR_LEVELS?.B1) banks.push(...CEFR_LEVELS.b1);
    if (CEFR_LEVELS?.B2) banks.push(...CEFR_LEVELS.b2);

    if (Array.isArray(CEFR_PHRASES)) banks.push(...CEFR_PHRASES);
    if (Array.isArray(LISTEN_VOCAB)) banks.push(...LISTEN_VOCAB);

    if (Array.isArray(CEFR_CONVERSATION_AUDIO_a1)) banks.push(...CEFR_CONVERSATION_AUDIO_a1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_a2)) banks.push(...CEFR_CONVERSATION_AUDIO_a2);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_b1)) banks.push(...CEFR_CONVERSATION_AUDIO_b1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_b2)) banks.push(...CEFR_CONVERSATION_AUDIO_b2);

    Object.values(CEFR_CONVERSATION_PROMPTS || {}).forEach(levelArray => {
        if (!Array.isArray(levelArray)) return;
        levelArray.forEach(prompt => {
            if (Array.isArray(prompt.expected_responses)) {
                banks.push(...prompt.expected_responses);
            }
        });
    });

    const levelsList = ["a1", "a2", "b1", "b2"];
    levelsList.forEach(level => {
        if (typeof getDisruptorResponses === "function") {
            const disruptors = getDisruptorResponses(level);
            if (Array.isArray(disruptors)) banks.push(...disruptors);
        }
    });

    for (const item of banks) {
        if (!item) continue;

        const spanishString =
            typeof item === "object"
                ? item.es || item.spanish
                : item;

        if (!spanishString) continue;

        if (cleanStringForKeyboard(spanishString.toLowerCase()) === s) {
            return item.en || item.english || "[Unknown translation]";
        }
    }

    return "[Unknown translation]";
}

/* ============================================================
   UNIVERSAL TEXT EXTRACTOR
   ============================================================ */

function extractSpanishText(item) {
    if (!item) return "";
    if (typeof item === "string") return item;

    if (typeof item === "object") {
        if (typeof item.es === "object") return extractSpanishText(item.es);
        if (typeof item.spanish === "object") return extractSpanishText(item.spanish);

        if (item.es) return item.es;
        if (item.spanish) return item.spanish;
        if (item.text) return item.text;

        for (const value of Object.values(item)) {
            if (typeof value === "string" && !value.includes("[object")) return value;
            if (typeof value === "object" && value !== null) {
                const nested = extractSpanishText(value);
                if (nested) return nested;
            }
        }
    }

    return String(item);
}


/* ============================================================
   CONVERSATION TAB — MAIN RENDER PIPELINE (PART 2A)
   ============================================================ */

function shuffle(array) {
    return array
        .map(x => ({ x, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(o => o.x);
}

function generateConversationPrompt(level) {
    const pool = CEFR_CONVERSATION_PROMPTS[level];
    const item = pool[Math.floor(Math.random() * pool.length)];

    return {
        prompt_es: item.prompt_es,
        prompt_en: item.prompt_en,
        expected: item.expected_responses
    };
}

function renderConversationTab() {
    const container = document.getElementById("conversation-content");
    const level = appState.currentLevel;

    if (!CEFR_CONVERSATION_PROMPTS[level]) {
        container.innerHTML = "<p>No conversation prompts available for this level.</p>";
        return;
    }

    // Isolate conversation variables cleanly inside state
    convoState.currentPrompt = generateConversationPrompt(level);

    const correctButtons = (convoState.currentPrompt.expected || []).map(exp => {
        const text = extractSpanishText(exp);
        return {
            html: `<button class="pill preset-response correct" data-response="${text}">${text}</button>`
        };
    });

    const rawDisruptors = typeof getDisruptorResponses === 'function' ? getDisruptorResponses(level) : [];
    const disruptorButtons = (Array.isArray(rawDisruptors) ? rawDisruptors : []).map(exp => {
        const text = extractSpanishText(exp);
        return {
            html: `<button class="pill preset-response disruptor" data-response="${text}">${text}</button>`
        };
    });

    const allButtons = shuffle([...correctButtons, ...disruptorButtons]);
    const presetButtons = allButtons.map(b => b && b.html ? b.html : "").join("");

    container.innerHTML = `
        <div class="glass-panel convo-card">
            <h2>Conversation — Level ${level}</h2>
            <p>Respond naturally using Spanish.</p>

            <div class="convo-prompt">
                <strong>Spanish:</strong> ${convoState.currentPrompt.prompt_es}<br>
                <strong>English:</strong> ${convoState.currentPrompt.prompt_en}
            </div>

            <div class="preset-box">
                ${presetButtons}
            </div>

            <textarea id="convo-input" class="convo-input" placeholder="Type your response here..."></textarea>
            
            <div class="sb-controls quiz-controls-tight" style="margin-top:15px; display:flex; gap:8px;">
                <button id="convo-submit" class="pill" style="padding:10px 20px;">Check</button>
                <button id="convo-next" class="pill" style="padding:10px 20px;">Next</button>
                <button id="convo-reset" class="pill" style="padding:10px 20px;">Reset</button>
            </div>

            <div id="convo-feedback" class="convo-feedback-box"></div>
        </div>
    `;

    setupConversationEvents(convoState.currentPrompt);
}

/* ============================================================
   CONVERSATION EVENTS — SAFETY INSULATED GRADING ENGINE (PART 2B - A)
   ============================================================ */
function setupConversationEvents(convo) {
    const submitBtn = document.getElementById("convo-submit");
    const nextBtn = document.getElementById("convo-next");
    const resetBtn = document.getElementById("convo-reset");
    const feedback = document.getElementById("convo-feedback");
    const textarea = document.getElementById("convo-input");

    if (!submitBtn || !nextBtn || !resetBtn || !feedback || !textarea) {
        console.warn("Required conversation elements are missing from the DOM.");
        return;
    }

    // Bind selection pills
    document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            textarea.value = btn.getAttribute("data-response") || btn.dataset.response;
            feedback.innerHTML = ""; 
        };
    });

    // RESET — Reload current prompt
    resetBtn.onclick = () => {
        document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
        });
        reloadSameConversation(convo);
    };

    // SUBMIT — Insulated from all potential data-bank crashes
    submitBtn.onclick = () => {
        const userText = textarea.value.trim();

        if (!userText) {
            feedback.innerHTML = `<span style="color:#f87171; display:block; margin-top:10px;">Please enter or select a response first.</span>`;
            return;
        }

        // Initialize defensive fallbacks
        let finalScore = 0;
        let expectedEs = "No reference text found";
        let expectedEn = "Translation unavailable";
        let learnerEnglishTranslation = "[Unknown translation]";

        /* ------------------------------------------------------------
           CRASH-PROOF EVALUATION ENGINE (TRY-CATCH BUNKER)
           ------------------------------------------------------------ */
        try {
            // Safe extraction of the correct answers object
            let targetSource = convo.expected;
            if (Array.isArray(targetSource) && targetSource.length > 0) {
                targetSource = targetSource[0];
            }

            if (targetSource) {
                expectedEs = typeof targetSource === 'object' ? (targetSource.es || targetSource.spanish || "") : String(targetSource);
                expectedEn = typeof targetSource === 'object' ? (targetSource.en || targetSource.english || "Translation unavailable") : "Translation unavailable";
            }

            // Attempt translation using global lookup
            if (typeof globalLookupSpanish === "function") {
                learnerEnglishTranslation = globalLookupSpanish(userText);
            }

            // Short-circuit: Force 0% immediately if user picked an active disruptor
            let isDisruptor = false;
            if (typeof getDisruptorResponses === 'function') {
                const disruptors = getDisruptorResponses(appState.currentLevel || "a1");
                isDisruptor = disruptors.some(d => {
                    const dText = typeof d === 'object' ? (d.es || d.spanish || "") : String(d);
                    return dText.toLowerCase().trim() === userText.toLowerCase().trim();
                });
            }

            if (isDisruptor) {
                finalScore = 0;
            } else {
                // Safely evaluate score using core engine
                if (typeof scoreConversationResponse === "function") {
                    const correctResponsesOnly = Array.isArray(convo.expected) ? convo.expected : [convo.expected];
                    const result = scoreConversationResponse(userText, correctResponsesOnly);
                    finalScore = result && typeof result.score === "number" ? result.score : 0;
                } else {
                    // EMERGENCY FALLBACK SCORER: If the external engine is broken or missing, evaluate keywords manually
                    const userWords = userText.toLowerCase().split(/\s+/);
                    const matchWords = expectedEs.toLowerCase().split(/\s+/);
                    const matches = userWords.filter(w => matchWords.includes(w)).length;
                    finalScore = matchWords.length > 0 ? Math.round((matches / matchWords.length) * 100) : 0;
                }
            }

        } catch (error) {
            console.error("The evaluation loop caught a crash, deploying emergency fallbacks:", error);
            // Emergency fallback logic on calculation crash to guarantee execution completes
            const userWords = userText.toLowerCase().split(/\s+/);
            const matches = userWords.filter(w => expectedEs.toLowerCase().includes(w)).length;
            finalScore = userWords.length > 0 ? Math.min(Math.round((matches / userWords.length) * 100), 100) : 0;
        }

        /* ------------------------------------------------------------
           RENDER ENGINE — GUARANTEED VISUAL INJECTION
           ------------------------------------------------------------ */
        let verdictHTML = "";
        let borderGradientColor = "rgba(148, 163, 184, 0.2)";
        let matchStatus = "incorrect";
        let baseXP = 0;
        let baseScore = 0;
        let bonusText = "";

        if (finalScore >= 70 && learnerEnglishTranslation !== "[Unknown translation]") {
            matchStatus = "correct";
            borderGradientColor = "rgba(74, 222, 128, 0.4)"; // Green outline
            
            if (finalScore === 100) {
                baseXP = 40; 
                baseScore = 30; 
                bonusText = " — 💎 100% Perfect Match! ⚡";
            } else {
                baseXP = 25;
                baseScore = 20;
            }
            verdictHTML = `<span style="color:#4ade80; font-weight:600; font-size:1.1rem;">Correct! 🎉 (+${baseXP} XP)${bonusText}</span>`;
            
            if (typeof speakSpanish === "function") speakSpanish(userText);
        } else if (finalScore >= 40 && finalScore < 70) {
            matchStatus = "partial";
            borderGradientColor = "rgba(251, 146, 60, 0.5)"; // Orange outline
            baseXP = 10;
            baseScore = 5;
            verdictHTML = `<span style="color:#fb923c; font-weight:600; font-size:1.1rem;">Partial Match! ⚠️ (+10 XP)</span>`;
            
            if (typeof audioContextPlayback === "function") audioContextPlayback("partial");
        } else {
            matchStatus = "incorrect";
            borderGradientColor = "rgba(248, 113, 113, 0.4)"; // Red outline
            verdictHTML = `<span style="color:#f87171; font-weight:600; font-size:1.1rem;">Incorrect. ✖ (0 XP)</span>`;
            
            if (typeof audioContextPlayback === "function") audioContextPlayback("incorrect");
        }

        // Lock options post submission
        document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.6";
        });

        // Safe HTML print command 
        feedback.innerHTML = `
            <div class="convo-result" style="margin-top: 15px; padding: 12px; background: rgba(15, 23, 42, 0.4); border-radius: 12px; border: 1px solid ${borderGradientColor};">
                ${verdictHTML}
                <br><br>
                <strong>Your response:</strong> ${userText}<br>
                <strong>Your Translated Response is:</strong> <span style="color: #a5f3fc;">"${learnerEnglishTranslation}"</span><br><br>
                <strong>Score:</strong> <span style="color: ${matchStatus === 'correct' ? '#4ade80' : (matchStatus === 'partial' ? '#fb923c' : '#f87171')}">${finalScore}%</span><br>
                <strong>Expected Spanish:</strong> ${expectedEs} (${expectedEn})
            </div>
        `;

        // Safe accounting execution forwarding
        if (typeof processConversationRewards === "function") {
            try {
                processConversationRewards(matchStatus, baseXP, baseScore, expectedEs, convo.prompt_es);
            } catch (e) {
                console.error("Error updating scores/badges storage counters:", e);
            }
        }
    };

    nextBtn.onclick = () => renderConversationTab();
}



/* ============================================================
   CONVERSATION RUNTIME — STORAGE MANAGEMENT & SCENE RELOADS (PART 2B - B)
   ============================================================ */

function processConversationRewards(matchStatus, baseXP, baseScore, expectedEs, promptEsRaw) {
    if (!appState.levelStats[appState.currentLevel]) {
        appState.levelStats[appState.currentLevel] = { conversationCompleted: 0 };
    }
    
    appState.levelStats[appState.currentLevel].conversationCompleted++;

    // Process metric awards safely inside application memory blocks
    if (matchStatus === "correct") {
        appState.totalXP = (appState.totalXP || 0) + baseXP;
        appState.globalScore = (appState.globalScore || 0) + baseScore;
        if (typeof checkAndAdvanceStreak === "function") checkAndAdvanceStreak();
    } else if (matchStatus === "partial") {
        appState.totalXP = (appState.totalXP || 0) + baseXP;
        appState.globalScore = (appState.globalScore || 0) + baseScore;
    } else {
        const promptEsClean = promptEsRaw || "Conversation Prompt";
        const mistakeString = `${promptEsClean} ➔ ${expectedEs}`;
        
        // DEDUPLICATION FILTER: Verifies mistake is completely unique before writing to review lists
        const cleanMistakeEntry = mistakeString.trim();
        const alreadyLogged = Array.isArray(window.reviewList) && window.reviewList.some(item => item.trim() === cleanMistakeEntry);
        
        if (!alreadyLogged && typeof addIncorrectWord === "function") {
            addIncorrectWord(cleanMistakeEntry);
        }
    }

    if (typeof updateBadges === "function") updateBadges();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
    saveState();
}

function reloadSameConversation(convo) {
    const presetBox = document.querySelector("#conversation-content .preset-box");
    const inputBox = document.querySelector("#conversation-content #convo-input");
    const feedbackBox = document.querySelector("#conversation-content #convo-feedback");

    if (!presetBox || !inputBox || !feedbackBox) {
        console.warn("Conversation UI elements missing — aborting scene reset.");
        return;
    }

    const correct = convo.expected.map(exp => {
        const text = extractSpanishText(exp);
        return { html: `<button class="pill preset-response correct" data-response="${text}">${text}</button>` };
    });

    const disruptors = getDisruptorResponses(appState.currentLevel).map(exp => {
        const text = extractSpanishText(exp);
        return { html: `<button class="pill preset-response disruptor" data-response="${text}">${text}</button>` };
    });

    const allButtons = shuffle([...correct, ...disruptors]);
    const presetButtons = allButtons.map(b => b && b.html ? b.html : "").join("");

    presetBox.innerHTML = presetButtons;
    inputBox.value = "";
    feedbackBox.innerHTML = "";

    document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            inputBox.value = btn.getAttribute("data-response") || btn.dataset.response;
        };
    });
}

// Low-level synthesizer fallback note generation anchor node
function audioContextPlayback(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === "partial") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(330, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } else {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.stop(ctx.currentTime + 0.4);
        }
    } catch (e) {
        console.warn("WebAudio player stalled:", e);
    }
}



const CEFR_CONVERSATION_PROMPTS = {

    a1: [
    {
        prompt_es: "¿Qué te gustaría beber?",
        prompt_en: "What would you like to drink?",
        expected_responses: [
            { es: "quiero agua por favor", en: "I want water please" },
            { es: "me gustaría una cerveza", en: "I would like a beer" },
            { es: "quiero café", en: "I want coffee" }
        ]
    },
    {
        prompt_es: "¿Cómo estás hoy?",
        prompt_en: "How are you today?",
        expected_responses: [
            { es: "estoy feliz", en: "I am happy" },
            { es: "estoy bien gracias", en: "I am good, thank you" },
            { es: "estoy cansado", en: "I am tired" }
        ]
    },
    {
        prompt_es: "¿Dónde vives?",
        prompt_en: "Where do you live?",
        expected_responses: [
            { es: "vivo en la ciudad", en: "I live in the city" },
            { es: "vivo cerca del centro", en: "I live near downtown" },
            { es: "vivo con mi familia", en: "I live with my family" }
        ]
    },
    {
        prompt_es: "¿Qué quieres comer?",
        prompt_en: "What do you want to eat?",
        expected_responses: [
            { es: "quiero pollo", en: "I want chicken" },
            { es: "quiero una ensalada", en: "I want a salad" },
            { es: "quiero sopa", en: "I want soup" }
        ]
    },
    {
        prompt_es: "¿Tienes hambre?",
        prompt_en: "Are you hungry?",
        expected_responses: [
            { es: "sí tengo hambre", en: "Yes, I'm hungry" },
            { es: "no tengo hambre", en: "I'm not hungry" },
            { es: "tengo un poco de hambre", en: "I'm a little hungry" }
        ]
    },
    {
        prompt_es: "¿Qué te gusta hacer?",
        prompt_en: "What do you like to do?",
        expected_responses: [
            { es: "me gusta leer libros", en: "I like reading books" },
            { es: "me gusta escuchar música", en: "I like listening to music" },
            { es: "me gusta cocinar", en: "I like cooking" }
        ]
    },
    {
        prompt_es: "¿A qué hora te levantas?",
        prompt_en: "What time do you get up?",
        expected_responses: [
            { es: "me levanto temprano", en: "I get up early" },
            { es: "me levanto tarde", en: "I get up late" },
            { es: "me levanto a las siete", en: "I get up at seven" }
        ]
    },
    {
        prompt_es: "¿Quieres salir hoy?",
        prompt_en: "Do you want to go out today?",
        expected_responses: [
            { es: "sí quiero salir", en: "Yes, I want to go out" },
            { es: "no quiero salir", en: "I don't want to go out" },
            { es: "quiero salir más tarde", en: "I want to go out later" }
        ]
    },
    {
        prompt_es: "¿Qué estás haciendo?",
        prompt_en: "What are you doing?",
        expected_responses: [
            { es: "estoy aprendiendo español", en: "I am learning Spanish" },
            { es: "estoy cocinando", en: "I am cooking" },
            { es: "estoy viendo televisión", en: "I am watching TV" }
        ]
    },
    {
        prompt_es: "¿Quieres ver una película?",
        prompt_en: "Do you want to watch a movie?",
        expected_responses: [
            { es: "sí quiero ver una película", en: "Yes, I want to watch a movie" },
            { es: "no quiero ver televisión", en: "I don't want to watch TV" },
            { es: "quiero ver una película nueva", en: "I want to watch a new movie" }
        ]
    },
    {
        prompt_es: "¿Dónde está el baño?",
        prompt_en: "Where is the bathroom?",
        expected_responses: [
            { es: "está cerca", en: "It is near" },
            { es: "está lejos", en: "It is far" },
            { es: "está en la casa", en: "It is in the house" }
        ]
    },
    {
        prompt_es: "¿Qué música te gusta?",
        prompt_en: "What music do you like?",
        expected_responses: [
            { es: "me gusta la música", en: "I like music" },
            { es: "me gusta escuchar música", en: "I like listening to music" },
            { es: "me gusta la música nueva", en: "I like new music" }
        ]
    },
    {
        prompt_es: "¿Quieres descansar?",
        prompt_en: "Do you want to rest?",
        expected_responses: [
            { es: "sí quiero descansar", en: "Yes, I want to rest" },
            { es: "no quiero descansar", en: "I don't want to rest" },
            { es: "quiero descansar un poco", en: "I want to rest a little" }
        ]
    },
    {
        prompt_es: "¿Qué hay en la cocina?",
        prompt_en: "What is in the kitchen?",
        expected_responses: [
            { es: "hay pan", en: "There is bread" },
            { es: "hay arroz", en: "There is rice" },
            { es: "hay pollo", en: "There is chicken" }
        ]
    },
    {
        prompt_es: "¿Quieres ir al hotel?",
        prompt_en: "Do you want to go to the hotel?",
        expected_responses: [
            { es: "sí quiero ir al hotel", en: "Yes, I want to go to the hotel" },
            { es: "no quiero ir", en: "I don't want to go" },
            { es: "quiero ir más tarde", en: "I want to go later" }
        ]
    },
    {
        prompt_es: "¿Qué fruta te gusta?",
        prompt_en: "What fruit do you like?",
        expected_responses: [
            { es: "me gusta la manzana", en: "I like apple" },
            { es: "me gusta la naranja", en: "I like orange" },
            { es: "me gusta el plátano", en: "I like banana" }
        ]
    },
    {
        prompt_es: "¿Quieres aprender más español?",
        prompt_en: "Do you want to learn more Spanish?",
        expected_responses: [
            { es: "sí quiero aprender más", en: "Yes, I want to learn more" },
            { es: "quiero aprender rápido", en: "I want to learn fast" },
            { es: "quiero aprender con música", en: "I want to learn with music" }
        ]
    },
    {
        prompt_es: "¿Qué ves en la televisión?",
        prompt_en: "What do you watch on TV?",
        expected_responses: [
            { es: "veo películas", en: "I watch movies" },
            { es: "veo programas", en: "I watch shows" },
            { es: "veo noticias", en: "I watch news" }
        ]
    },
    {
        prompt_es: "¿Quieres pan con queso?",
        prompt_en: "Do you want bread with cheese?",
        expected_responses: [
            { es: "sí quiero pan con queso", en: "Yes, I want bread with cheese" },
            { es: "no quiero pan", en: "I don't want bread" },
            { es: "quiero queso", en: "I want cheese" }
        ]
    },
    {
        prompt_es: "¿Dónde está tu familia?",
        prompt_en: "Where is your family?",
        expected_responses: [
            { es: "está en la casa", en: "They are at home" },
            { es: "está cerca", en: "They are near" },
            { es: "está lejos", en: "They are far" }
        ]
    },
    {
        prompt_es: "¿Quieres ir en autobús?",
        prompt_en: "Do you want to go by bus?",
        expected_responses: [
            { es: "sí quiero ir en autobús", en: "Yes, I want to go by bus" },
            { es: "no quiero ir en autobús", en: "I don't want to go by bus" },
            { es: "quiero ir en tren", en: "I want to go by train" }
        ]
    },
    {
        prompt_es: "¿Qué haces en casa?",
        prompt_en: "What do you do at home?",
        expected_responses: [
            { es: "cocino", en: "I cook" },
            { es: "leo libros", en: "I read books" },
            { es: "veo televisión", en: "I watch TV" }
        ]
    }
],


    a2: [
    {
        prompt_es: "¿Qué haces normalmente por la mañana?",
        prompt_en: "What do you normally do in the morning?",
        expected_responses: [
            { es: "normalmente preparo el desayuno", en: "I normally prepare breakfast" },
            { es: "me levanto temprano y hago café", en: "I get up early and make coffee" },
            { es: "leo un mensaje y empiezo mi día", en: "I read a message and start my day" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría probar hoy?",
        prompt_en: "What would you like to try today?",
        expected_responses: [
            { es: "me gustaría probar una nueva película", en: "I would like to try a new movie" },
            { es: "quiero probar un desayuno diferente", en: "I want to try a different breakfast" },
            { es: "quiero probar cocinar algo nuevo", en: "I want to try cooking something new" }
        ]
    },
    {
        prompt_es: "¿A qué hora llegaste anoche?",
        prompt_en: "What time did you arrive last night?",
        expected_responses: [
            { es: "llegué tarde", en: "I arrived late" },
            { es: "llegué temprano", en: "I arrived early" },
            { es: "llegué a las diez", en: "I arrived at ten" }
        ]
    },
    {
        prompt_es: "¿Qué almuerzas normalmente?",
        prompt_en: "What do you normally have for lunch?",
        expected_responses: [
            { es: "normalmente almuerzo arroz y pollo", en: "I normally have rice and chicken" },
            { es: "almuerzo ensalada", en: "I have salad" },
            { es: "almuerzo sopa", en: "I have soup" }
        ]
    },
    {
        prompt_es: "¿Qué película quieres ver?",
        prompt_en: "What movie do you want to watch?",
        expected_responses: [
            { es: "quiero ver una película nueva", en: "I want to watch a new movie" },
            { es: "quiero ver una película de la noche", en: "I want to watch a movie tonight" },
            { es: "quiero ver una película en casa", en: "I want to watch a movie at home" }
        ]
    },
    {
        prompt_es: "¿Qué mensaje recibiste?",
        prompt_en: "What message did you receive?",
        expected_responses: [
            { es: "recibí un mensaje de mi amiga", en: "I received a message from my friend" },
            { es: "recibí información importante", en: "I received important information" },
            { es: "recibí un mensaje de mis padres", en: "I received a message from my parents" }
        ]
    },
    {
        prompt_es: "¿Qué vas a cocinar esta noche?",
        prompt_en: "What are you going to cook tonight?",
        expected_responses: [
            { es: "voy a cocinar pollo", en: "I am going to cook chicken" },
            { es: "voy a cocinar arroz", en: "I am going to cook rice" },
            { es: "voy a cocinar una cena simple", en: "I am going to cook a simple dinner" }
        ]
    },
    {
        prompt_es: "¿Qué tarea tienes hoy?",
        prompt_en: "What homework do you have today?",
        expected_responses: [
            { es: "tengo tarea de español", en: "I have Spanish homework" },
            { es: "tengo tarea de la escuela", en: "I have school homework" },
            { es: "tengo que revisar información", en: "I have to review information" }
        ]
    },
    {
        prompt_es: "¿Qué quieres visitar en tu próximo viaje?",
        prompt_en: "What do you want to visit on your next trip?",
        expected_responses: [
            { es: "quiero visitar a mi familia", en: "I want to visit my family" },
            { es: "quiero visitar un lugar nuevo", en: "I want to visit a new place" },
            { es: "quiero visitar la ciudad", en: "I want to visit the city" }
        ]
    },
    {
        prompt_es: "¿Conduces a menudo?",
        prompt_en: "Do you drive often?",
        expected_responses: [
            { es: "sí conduzco a menudo", en: "Yes, I drive often" },
            { es: "no conduzco mucho", en: "I don't drive much" },
            { es: "conduzco cuando es necesario", en: "I drive when necessary" }
        ]
    },
    {
        prompt_es: "¿Qué esperas hoy?",
        prompt_en: "What are you waiting for today?",
        expected_responses: [
            { es: "espero un mensaje", en: "I am waiting for a message" },
            { es: "espero información", en: "I am waiting for information" },
            { es: "espero a mi amiga", en: "I am waiting for my friend" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría olvidar?",
        prompt_en: "What would you like to forget?",
        expected_responses: [
            { es: "me gustaría olvidar los problemas", en: "I would like to forget the problems" },
            { es: "quiero olvidar el viaje largo", en: "I want to forget the long trip" },
            { es: "quiero olvidar la tarea difícil", en: "I want to forget the difficult homework" }
        ]
    },
    {
        prompt_es: "¿Qué haces antes de dormir?",
        prompt_en: "What do you do before sleeping?",
        expected_responses: [
            { es: "leo un mensaje", en: "I read a message" },
            { es: "veo una película", en: "I watch a movie" },
            { es: "preparo la cocina", en: "I prepare the kitchen" }
        ]
    },
    {
        prompt_es: "¿Qué haces después del almuerzo?",
        prompt_en: "What do you do after lunch?",
        expected_responses: [
            { es: "descanso un poco", en: "I rest a little" },
            { es: "veo una película", en: "I watch a movie" },
            { es: "leo información", en: "I read information" }
        ]
    },
    {
        prompt_es: "¿Qué transporte usas normalmente?",
        prompt_en: "What transport do you normally use?",
        expected_responses: [
            { es: "uso el autobús", en: "I use the bus" },
            { es: "uso el tren", en: "I use the train" },
            { es: "uso el avión para viajes largos", en: "I use the plane for long trips" }
        ]
    },
    {
        prompt_es: "¿Qué cocina te gusta más?",
        prompt_en: "Which kitchen do you like more?",
        expected_responses: [
            { es: "me gusta la cocina grande", en: "I like the big kitchen" },
            { es: "me gusta la cocina nueva", en: "I like the new kitchen" },
            { es: "me gusta la cocina cerca de la ventana", en: "I like the kitchen near the window" }
        ]
    },
    {
        prompt_es: "¿Qué haces ahora?",
        prompt_en: "What are you doing now?",
        expected_responses: [
            { es: "estoy preparando el almuerzo", en: "I am preparing lunch" },
            { es: "estoy viendo una película", en: "I am watching a movie" },
            { es: "estoy leyendo información", en: "I am reading information" }
        ]
    },
    {
        prompt_es: "¿Qué zapatos usas hoy?",
        prompt_en: "What shoes are you wearing today?",
        expected_responses: [
            { es: "uso zapatos nuevos", en: "I am wearing new shoes" },
            { es: "uso zapatos cómodos", en: "I am wearing comfortable shoes" },
            { es: "uso zapatos para caminar", en: "I am wearing walking shoes" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría cocinar mañana?",
        prompt_en: "What would you like to cook tomorrow?",
        expected_responses: [
            { es: "me gustaría cocinar pollo", en: "I would like to cook chicken" },
            { es: "quiero cocinar arroz", en: "I want to cook rice" },
            { es: "quiero cocinar una cena nueva", en: "I want to cook a new dinner" }
        ]
    },
    {
        prompt_es: "¿Qué información necesitas?",
        prompt_en: "What information do you need?",
        expected_responses: [
            { es: "necesito información del viaje", en: "I need information about the trip" },
            { es: "necesito información de la escuela", en: "I need school information" },
            { es: "necesito información de mis padres", en: "I need information from my parents" }
        ]
    },
    {
        prompt_es: "¿Qué haces cuando llegas a casa?",
        prompt_en: "What do you do when you arrive home?",
        expected_responses: [
            { es: "preparo la cena", en: "I prepare dinner" },
            { es: "veo una película", en: "I watch a movie" },
            { es: "leo un mensaje", en: "I read a message" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría visitar este año?",
        prompt_en: "What would you like to visit this year?",
        expected_responses: [
            { es: "me gustaría visitar un lugar nuevo", en: "I would like to visit a new place" },
            { es: "quiero visitar a mi familia", en: "I want to visit my family" },
            { es: "quiero visitar la ciudad", en: "I want to visit the city" }
        ]
    }
],


    b1: [
    {
        prompt_es: "¿Qué has aprendido recientemente?",
        prompt_en: "What have you learned recently?",
        expected_responses: [
            { es: "he aprendido nuevas habilidades", en: "I have learned new skills" },
            { es: "he aprendido comunicación diaria", en: "I have learned daily communication" },
            { es: "he aprendido a revisar información", en: "I have learned to review information" }
        ]
    },
    {
        prompt_es: "¿Qué estás estudiando ahora?",
        prompt_en: "What are you studying now?",
        expected_responses: [
            { es: "estoy estudiando español", en: "I am studying Spanish" },
            { es: "estoy estudiando comunicación", en: "I am studying communication" },
            { es: "estoy estudiando habilidades nuevas", en: "I am studying new skills" }
        ]
    },
    {
        prompt_es: "¿Qué tipo de experiencias pasadas recuerdas más?",
        prompt_en: "What kind of past experiences do you remember most?",
        expected_responses: [
            { es: "recuerdo experiencias con mi familia", en: "I remember experiences with my family" },
            { es: "recuerdo experiencias de trabajo", en: "I remember work experiences" },
            { es: "recuerdo experiencias de viajes", en: "I remember travel experiences" }
        ]
    },
    {
        prompt_es: "¿Qué habilidades quieres mejorar?",
        prompt_en: "What skills do you want to improve?",
        expected_responses: [
            { es: "quiero mejorar mi comunicación", en: "I want to improve my communication" },
            { es: "quiero mejorar mis habilidades diarias", en: "I want to improve my daily skills" },
            { es: "quiero mejorar mi español", en: "I want to improve my Spanish" }
        ]
    },
    {
        prompt_es: "¿Qué estás trabajando esta semana?",
        prompt_en: "What are you working on this week?",
        expected_responses: [
            { es: "estoy trabajando en un proyecto", en: "I am working on a project" },
            { es: "estoy trabajando en comunicación", en: "I am working on communication" },
            { es: "estoy trabajando en mejorar mis habilidades", en: "I am working on improving my skills" }
        ]
    },
    {
        prompt_es: "¿Qué conversaciones tienes a menudo?",
        prompt_en: "What conversations do you often have?",
        expected_responses: [
            { es: "tengo conversaciones con mis padres", en: "I have conversations with my parents" },
            { es: "tengo conversaciones de trabajo", en: "I have work conversations" },
            { es: "tengo conversaciones sobre viajes", en: "I have conversations about trips" }
        ]
    },
    {
        prompt_es: "¿Qué has estado haciendo últimamente?",
        prompt_en: "What have you been doing lately?",
        expected_responses: [
            { es: "he estado trabajando mucho", en: "I have been working a lot" },
            { es: "he estado estudiando español", en: "I have been studying Spanish" },
            { es: "he estado revisando información", en: "I have been reviewing information" }
        ]
    },
    {
        prompt_es: "¿Qué quieres conseguir este mes?",
        prompt_en: "What do you want to achieve this month?",
        expected_responses: [
            { es: "quiero conseguir nuevas habilidades", en: "I want to gain new skills" },
            { es: "quiero conseguir mejor comunicación", en: "I want to achieve better communication" },
            { es: "quiero conseguir más experiencia", en: "I want to gain more experience" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría continuar aprendiendo?",
        prompt_en: "What would you like to continue learning?",
        expected_responses: [
            { es: "me gustaría continuar aprendiendo español", en: "I would like to continue learning Spanish" },
            { es: "quiero continuar aprendiendo comunicación", en: "I want to continue learning communication" },
            { es: "quiero continuar aprendiendo habilidades nuevas", en: "I want to continue learning new skills" }
        ]
    },
    {
        prompt_es: "¿Qué tipo de comunicación es importante para ti?",
        prompt_en: "What type of communication is important to you?",
        expected_responses: [
            { es: "la comunicación diaria es importante", en: "Daily communication is important" },
            { es: "la comunicación con mi familia es importante", en: "Communication with my family is important" },
            { es: "la comunicación en el trabajo es importante", en: "Communication at work is important" }
        ]
    },
    {
        prompt_es: "¿Qué has estado leyendo últimamente?",
        prompt_en: "What have you been reading lately?",
        expected_responses: [
            { es: "he estado leyendo libros", en: "I have been reading books" },
            { es: "he estado leyendo información", en: "I have been reading information" },
            { es: "he estado leyendo mensajes", en: "I have been reading messages" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría preparar mañana?",
        prompt_en: "What would you like to prepare tomorrow?",
        expected_responses: [
            { es: "me gustaría preparar el almuerzo", en: "I would like to prepare lunch" },
            { es: "quiero preparar una cena nueva", en: "I want to prepare a new dinner" },
            { es: "quiero preparar información para mi trabajo", en: "I want to prepare information for my work" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría cambiar este año?",
        prompt_en: "What would you like to change this year?",
        expected_responses: [
            { es: "me gustaría cambiar mi comunicación", en: "I would like to change my communication" },
            { es: "quiero cambiar mis hábitos diarios", en: "I want to change my daily habits" },
            { es: "quiero cambiar mi enfoque de trabajo", en: "I want to change my work approach" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría seguir haciendo?",
        prompt_en: "What would you like to keep doing?",
        expected_responses: [
            { es: "me gustaría seguir estudiando español", en: "I would like to keep studying Spanish" },
            { es: "quiero seguir trabajando", en: "I want to keep working" },
            { es: "quiero seguir mejorando mis habilidades", en: "I want to keep improving my skills" }
        ]
    },
    {
        prompt_es: "¿Qué tipo de tareas tienes esta semana?",
        prompt_en: "What tasks do you have this week?",
        expected_responses: [
            { es: "tengo tareas de comunicación", en: "I have communication tasks" },
            { es: "tengo tareas de trabajo", en: "I have work tasks" },
            { es: "tengo tareas diarias", en: "I have daily tasks" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría encontrar hoy?",
        prompt_en: "What would you like to find today?",
        expected_responses: [
            { es: "me gustaría encontrar información", en: "I would like to find information" },
            { es: "quiero encontrar una solución", en: "I want to find a solution" },
            { es: "quiero encontrar tiempo para estudiar", en: "I want to find time to study" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría cancelar este mes?",
        prompt_en: "What would you like to cancel this month?",
        expected_responses: [
            { es: "me gustaría cancelar un viaje", en: "I would like to cancel a trip" },
            { es: "quiero cancelar una tarea", en: "I want to cancel a task" },
            { es: "quiero cancelar un plan", en: "I want to cancel a plan" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría traer a la reunión?",
        prompt_en: "What would you like to bring to the meeting?",
        expected_responses: [
            { es: "me gustaría traer información", en: "I would like to bring information" },
            { es: "quiero traer mis habilidades", en: "I want to bring my skills" },
            { es: "quiero traer comunicación clara", en: "I want to bring clear communication" }
        ]
    },
    {
        prompt_es: "¿Qué planeas hacer mañana?",
        prompt_en: "What do you plan to do tomorrow?",
        expected_responses: [
            { es: "planeo estudiar español", en: "I plan to study Spanish" },
            { es: "planeo trabajar en un proyecto", en: "I plan to work on a project" },
            { es: "planeo revisar información", en: "I plan to review information" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría entender mejor?",
        prompt_en: "What would you like to understand better?",
        expected_responses: [
            { es: "me gustaría entender comunicación", en: "I would like to understand communication" },
            { es: "quiero entender mis habilidades", en: "I want to understand my skills" },
            { es: "quiero entender información nueva", en: "I want to understand new information" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría seguir revisando?",
        prompt_en: "What would you like to keep reviewing?",
        expected_responses: [
            { es: "me gustaría seguir revisando español", en: "I would like to keep reviewing Spanish" },
            { es: "quiero seguir revisando información", en: "I want to keep reviewing information" },
            { es: "quiero seguir revisando mis habilidades", en: "I want to keep reviewing my skills" }
        ]
    }
],


   b2: [
    {
        prompt_es: "¿Qué estrategia usas para aprender mejor?",
        prompt_en: "What strategy do you use to learn better?",
        expected_responses: [
            { es: "uso una estrategia efectiva para estudiar", en: "I use an effective strategy to study" },
            { es: "analizo mi proceso de aprendizaje", en: "I analyze my learning process" },
            { es: "actualizo mi enfoque cada semana", en: "I update my approach every week" }
        ]
    },
    {
        prompt_es: "¿Cómo evalúas tu rendimiento en el trabajo?",
        prompt_en: "How do you evaluate your performance at work?",
        expected_responses: [
            { es: "evalúo mis resultados cada mes", en: "I evaluate my results every month" },
            { es: "analizo mi rendimiento cuidadosamente", en: "I analyze my performance carefully" },
            { es: "actualizo mis tareas para mejorar", en: "I update my tasks to improve" }
        ]
    },
    {
        prompt_es: "¿Qué concepto te parece complicado últimamente?",
        prompt_en: "What concept seems complicated to you lately?",
        expected_responses: [
            { es: "el concepto es complicado pero posible", en: "The concept is complicated but possible" },
            { es: "analizo el concepto para entenderlo mejor", en: "I analyze the concept to understand it better" },
            { es: "necesito aclarar el concepto", en: "I need to clarify the concept" }
        ]
    },
    {
        prompt_es: "¿Qué riesgo consideras importante en tu trabajo?",
        prompt_en: "What risk do you consider important in your work?",
        expected_responses: [
            { es: "el riesgo es alto en algunas tareas", en: "The risk is high in some tasks" },
            { es: "analizo el riesgo antes de decidir", en: "I analyze the risk before deciding" },
            { es: "es necesario reducir el riesgo", en: "It is necessary to reduce the risk" }
        ]
    },
    {
        prompt_es: "¿Qué posibilidad te gustaría explorar?",
        prompt_en: "What possibility would you like to explore?",
        expected_responses: [
            { es: "me gustaría explorar una estrategia nueva", en: "I would like to explore a new strategy" },
            { es: "quiero explorar un enfoque diferente", en: "I want to explore a different approach" },
            { es: "quiero explorar una posibilidad positiva", en: "I want to explore a positive possibility" }
        ]
    },
    {
        prompt_es: "¿Qué situación te ha afectado recientemente?",
        prompt_en: "What situation has affected you recently?",
        expected_responses: [
            { es: "la situación ha sido complicada", en: "The situation has been complicated" },
            { es: "he analizado la situación cuidadosamente", en: "I have analyzed the situation carefully" },
            { es: "la situación ha cambiado mi enfoque", en: "The situation has changed my approach" }
        ]
    },
    {
        prompt_es: "¿Cómo optimizas tu tiempo cada día?",
        prompt_en: "How do you optimize your time each day?",
        expected_responses: [
            { es: "optimizo mi tiempo con una estrategia clara", en: "I optimize my time with a clear strategy" },
            { es: "actualizo mis tareas para ser más efectivo", en: "I update my tasks to be more effective" },
            { es: "coordino mis actividades cuidadosamente", en: "I coordinate my activities carefully" }
        ]
    },
    {
        prompt_es: "¿Qué enfoque profesional te funciona mejor?",
        prompt_en: "What professional approach works best for you?",
        expected_responses: [
            { es: "uso un enfoque profesional y claro", en: "I use a professional and clear approach" },
            { es: "mi enfoque es analizar primero", en: "My approach is to analyze first" },
            { es: "mi enfoque es coordinar tareas", en: "My approach is to coordinate tasks" }
        ]
    },
    {
        prompt_es: "¿Qué tarea te gustaría actualizar?",
        prompt_en: "What task would you like to update?",
        expected_responses: [
            { es: "me gustaría actualizar mi proceso", en: "I would like to update my process" },
            { es: "quiero actualizar mis resultados", en: "I want to update my results" },
            { es: "quiero actualizar mi estrategia", en: "I want to update my strategy" }
        ]
    },
    {
        prompt_es: "¿Qué has analizado esta semana?",
        prompt_en: "What have you analyzed this week?",
        expected_responses: [
            { es: "he analizado mi rendimiento", en: "I have analyzed my performance" },
            { es: "he analizado mi enfoque", en: "I have analyzed my approach" },
            { es: "he analizado información importante", en: "I have analyzed important information" }
        ]
    },
    {
        prompt_es: "¿Qué te gustaría discutir con tu equipo?",
        prompt_en: "What would you like to discuss with your team?",
        expected_responses: [
            { es: "me gustaría discutir una estrategia nueva", en: "I would like to discuss a new strategy" },
            { es: "quiero discutir resultados recientes", en: "I want to discuss recent results" },
            { es: "quiero discutir un concepto importante", en: "I want to discuss an important concept" }
        ]
    },
    {
        prompt_es: "¿Qué has logrado este mes?",
        prompt_en: "What have you achieved this month?",
        expected_responses: [
            { es: "he logrado mejorar mi rendimiento", en: "I have achieved better performance" },
            { es: "he logrado nuevas habilidades", en: "I have achieved new skills" },
            { es: "he logrado actualizar mi proceso", en: "I have achieved updating my process" }
        ]
    },
    {
        prompt_es: "¿Qué cultura te interesa explorar?",
        prompt_en: "What culture are you interested in exploring?",
        expected_responses: [
            { es: "me interesa explorar una cultura nueva", en: "I am interested in exploring a new culture" },
            { es: "quiero explorar la cultura de otro país", en: "I want to explore the culture of another country" },
            { es: "quiero explorar una cultura diferente", en: "I want to explore a different culture" }
        ]
    },
    {
        prompt_es: "¿Qué desafíos has enfrentado recientemente?",
        prompt_en: "What challenges have you faced recently?",
        expected_responses: [
            { es: "he enfrentado desafíos complicados", en: "I have faced complicated challenges" },
            { es: "he enfrentado desafíos en mi trabajo", en: "I have faced challenges at work" },
            { es: "he enfrentado desafíos en mi proceso", en: "I have faced challenges in my process" }
        ]
    },
    {
        prompt_es: "¿Qué expectativas tienes para este año?",
        prompt_en: "What expectations do you have for this year?",
        expected_responses: [
            { es: "tengo expectativas positivas", en: "I have positive expectations" },
            { es: "tengo expectativas profesionales", en: "I have professional expectations" },
            { es: "tengo expectativas realistas", en: "I have realistic expectations" }
        ]
    },
    {
        prompt_es: "¿Qué situación te gustaría aclarar?",
        prompt_en: "What situation would you like to clarify?",
        expected_responses: [
            { es: "me gustaría aclarar una situación complicada", en: "I would like to clarify a complicated situation" },
            { es: "quiero aclarar un concepto", en: "I want to clarify a concept" },
            { es: "quiero aclarar información importante", en: "I want to clarify important information" }
        ]
    },
    {
        prompt_es: "¿Qué proceso te gustaría optimizar?",
        prompt_en: "What process would you like to optimize?",
        expected_responses: [
            { es: "me gustaría optimizar mi rendimiento", en: "I would like to optimize my performance" },
            { es: "quiero optimizar mi estrategia", en: "I want to optimize my strategy" },
            { es: "quiero optimizar mi enfoque", en: "I want to optimize my approach" }
        ]
    },
    {
        prompt_es: "¿Qué información has evaluado recientemente?",
        prompt_en: "What information have you evaluated recently?",
        expected_responses: [
            { es: "he evaluado información importante", en: "I have evaluated important information" },
            { es: "he evaluado resultados recientes", en: "I have evaluated recent results" },
            { es: "he evaluado mi proceso", en: "I have evaluated my process" }
        ]
    },
    {
        prompt_es: "¿Qué idea te gustaría fortalecer?",
        prompt_en: "What idea would you like to strengthen?",
        expected_responses: [
            { es: "me gustaría fortalecer mi estrategia", en: "I would like to strengthen my strategy" },
            { es: "quiero fortalecer mi enfoque", en: "I want to strengthen my approach" },
            { es: "quiero fortalecer mis habilidades", en: "I want to strengthen my skills" }
        ]
    },
    {
        prompt_es: "¿Qué tema te gustaría discutir más profundamente?",
        prompt_en: "What topic would you like to discuss more deeply?",
        expected_responses: [
            { es: "me gustaría discutir un concepto importante", en: "I would like to discuss an important concept" },
            { es: "quiero discutir una estrategia profesional", en: "I want to discuss a professional strategy" },
            { es: "quiero discutir un proceso complicado", en: "I want to discuss a complicated process" }
        ]
    },
    {
        prompt_es: "¿Qué enfoque te gustaría adaptar este año?",
        prompt_en: "What approach would you like to adapt this year?",
        expected_responses: [
            { es: "me gustaría adaptar un enfoque nuevo", en: "I would like to adapt a new approach" },
            { es: "quiero adaptar una estrategia efectiva", en: "I want to adapt an effective strategy" },
            { es: "quiero adaptar un proceso profesional", en: "I want to adapt a professional process" }
        ]
    }
]

};

const CEFR_CONVERSATION_AUDIO_a1 = [
    { es: "qué te gustaría beber", file: "que-te-gustaria-beber.mp3", en: "What would you like to drink?" },
    { es: "cómo estás hoy", file: "como-estas-hoy.mp3", en: "How are you today?" },
    { es: "dónde vives", file: "donde-vives.mp3", en: "Where do you live?" },
    { es: "qué quieres comer", file: "que-quieres-comer.mp3", en: "What do you want to eat?" },
    { es: "tienes hambre", file: "tienes-hambre.mp3", en: "Are you hungry?" },
    { es: "qué te gusta hacer", file: "que-te-gusta-hacer.mp3", en: "What do you like to do?" },
    { es: "a qué hora te levantas", file: "a-que-hora-te-levantas.mp3", en: "What time do you get up?" },
    { es: "quieres salir hoy", file: "quieres-salir-hoy.mp3", en: "Do you want to go out today?" },
    { es: "qué estás haciendo", file: "que-estas-haciendo.mp3", en: "What are you doing?" },
    { es: "quieres ver una película", file: "quieres-ver-una-pelicula.mp3", en: "Do you want to watch a movie?" },
    { es: "dónde está el baño", file: "donde-esta-el-bano.mp3", en: "Where is the bathroom?" },
    { es: "qué música te gusta", file: "que-musica-te-gusta.mp3", en: "What music do you like?" },
    { es: "quieres descansar", file: "quieres-descansar.mp3", en: "Do you want to rest?" },
    { es: "qué hay en la cocina", file: "que-hay-en-la-cocina.mp3", en: "What is in the kitchen?" },
    { es: "quieres ir al hotel", file: "quieres-ir-al-hotel.mp3", en: "Do you want to go to the hotel?" },
    { es: "qué fruta te gusta", file: "que-fruta-te-gusta.mp3", en: "What fruit do you like?" },
    { es: "quieres aprender más español", file: "quieres-aprender-mas-espanol.mp3", en: "Do you want to learn more Spanish?" },
    { es: "qué ves en la televisión", file: "que-ves-en-la-television.mp3", en: "What do you watch on TV?" },
    { es: "quieres pan con queso", file: "quieres-pan-con-queso.mp3", en: "Do you want bread with cheese?" },
    { es: "dónde está tu familia", file: "donde-esta-tu-familia.mp3", en: "Where is your family?" },
    { es: "quieres ir en autobús", file: "quieres-ir-en-autobus.mp3", en: "Do you want to go by bus?" },
    { es: "qué haces en casa", file: "que-haces-en-casa.mp3", en: "What do you do at home?" }
];

const CEFR_CONVERSATION_AUDIO_a2 = [
    { es: "qué haces normalmente por la mañana", file: "que-haces-normalmente-por-la-manana.mp3", en: "What do you normally do in the morning?" },
    { es: "qué te gustaría probar hoy", file: "que-te-gustaria-probar-hoy.mp3", en: "What would you like to try today?" },
    { es: "a qué hora llegaste anoche", file: "a-que-hora-llegaste-anoche.mp3", en: "What time did you arrive last night?" },
    { es: "qué almuerzas normalmente", file: "que-almuerzas-normalmente.mp3", en: "What do you normally have for lunch?" },
    { es: "qué película quieres ver", file: "que-pelicula-quieres-ver.mp3", en: "What movie do you want to watch?" },
    { es: "qué mensaje recibiste", file: "que-mensaje-recibiste.mp3", en: "What message did you receive?" },
    { es: "qué vas a cocinar esta noche", file: "que-vas-a-cocinar-esta-noche.mp3", en: "What are you going to cook tonight?" },
    { es: "qué tarea tienes hoy", file: "que-tarea-tienes-hoy.mp3", en: "What homework do you have today?" },
    { es: "qué quieres visitar en tu próximo viaje", file: "que-quieres-visitar-en-tu-proximo-viaje.mp3", en: "What do you want to visit on your next trip?" },
    { es: "conduces a menudo", file: "conduces-a-menudo.mp3", en: "Do you drive often?" },
    { es: "qué esperas hoy", file: "que-esperas-hoy.mp3", en: "What are you waiting for today?" },
    { es: "qué te gustaría olvidar", file: "que-te-gustaria-olvidar.mp3", en: "What would you like to forget?" },
    { es: "qué haces antes de dormir", file: "que-haces-antes-de-dormir.mp3", en: "What do you do before sleeping?" },
    { es: "qué haces después del almuerzo", file: "que-haces-despues-del-almuerzo.mp3", en: "What do you do after lunch?" },
    { es: "qué transporte usas normalmente", file: "que-transporte-usas-normalmente.mp3", en: "What transport do you normally use?" },
    { es: "qué cocina te gusta más", file: "que-cocina-te-gusta-mas.mp3", en: "Which kitchen do you like more?" },
    { es: "qué haces ahora", file: "que-haces-ahora.mp3", en: "What are you doing now?" },
    { es: "qué zapatos usas hoy", file: "que-zapatos-usas-hoy.mp3", en: "What shoes are you wearing today?" },
    { es: "qué te gustaría cocinar mañana", file: "que-te-gustaria-cocinar-manana.mp3", en: "What would you like to cook tomorrow?" },
    { es: "qué información necesitas", file: "que-informacion-necesitas.mp3", en: "What information do you need?" },
    { es: "qué haces cuando llegas a casa", file: "que-haces-cuando-llegas-a-casa.mp3", en: "What do you do when you arrive home?" },
    { es: "qué te gustaría visitar este año", file: "que-te-gustaria-visitar-este-ano.mp3", en: "What would you like to visit this year?" }
];

const CEFR_CONVERSATION_AUDIO_b1 = [
    { es: "qué has aprendido recientemente", file: "que-has-aprendido-recientemente.mp3", en: "What have you learned recently?" },
    { es: "qué estás estudiando ahora", file: "que-estas-estudiando-ahora.mp3", en: "What are you studying now?" },
    { es: "qué experiencias pasadas recuerdas más", file: "que-experiencias-pasadas-recuerdas-mas.mp3", en: "What past experiences do you remember most?" },
    { es: "qué habilidades quieres mejorar", file: "que-habilidades-quieres-mejorar.mp3", en: "What skills do you want to improve?" },
    { es: "qué estás trabajando esta semana", file: "que-estas-trabajando-esta-semana.mp3", en: "What are you working on this week?" },
    { es: "qué conversaciones tienes a menudo", file: "que-conversaciones-tienes-a-menudo.mp3", en: "What conversations do you often have?" },
    { es: "qué has estado haciendo últimamente", file: "que-has-estado-haciendo-ultimamente.mp3", en: "What have you been doing lately?" },
    { es: "qué quieres conseguir este mes", file: "que-quieres-conseguir-este-mes.mp3", en: "What do you want to achieve this month?" },
    { es: "qué te gustaría continuar aprendiendo", file: "que-te-gustaria-continuar-aprendiendo.mp3", en: "What would you like to continue learning?" },
    { es: "qué tipo de comunicación es importante para ti", file: "que-tipo-de-comunicacion-es-importante-para-ti.mp3", en: "What type of communication is important to you?" },
    { es: "qué has estado leyendo últimamente", file: "que-has-estado-leyendo-ultimamente.mp3", en: "What have you been reading lately?" },
    { es: "qué te gustaría preparar mañana", file: "que-te-gustaria-preparar-manana.mp3", en: "What would you like to prepare tomorrow?" },
    { es: "qué te gustaría cambiar este año", file: "que-te-gustaria-cambiar-este-ano.mp3", en: "What would you like to change this year?" },
    { es: "qué te gustaría seguir haciendo", file: "que-te-gustaria-seguir-haciendo.mp3", en: "What would you like to keep doing?" },
    { es: "qué tipo de tareas tienes esta semana", file: "que-tipo-de-tareas-tienes-esta-semana.mp3", en: "What tasks do you have this week?" },
    { es: "qué te gustaría encontrar hoy", file: "que-te-gustaria-encontrar-hoy.mp3", en: "What would you like to find today?" },
    { es: "qué te gustaría cancelar este mes", file: "que-te-gustaria-cancelar-este-mes.mp3", en: "What would you like to cancel this month?" },
    { es: "qué te gustaría traer a la reunión", file: "que-te-gustaria-traer-a-la-reunion.mp3", en: "What would you like to bring to the meeting?" },
    { es: "qué planeas hacer mañana", file: "que-planeas-hacer-manana.mp3", en: "What do you plan to do tomorrow?" },
    { es: "qué te gustaría entender mejor", file: "que-te-gustaria-entender-mejor.mp3", en: "What would you like to understand better?" },
    { es: "qué te gustaría seguir revisando", file: "que-te-gustaria-seguir-revisando.mp3", en: "What would you like to keep reviewing?" }
];

const CEFR_CONVERSATION_AUDIO_b2 = [
    { es: "qué estrategia usas para aprender mejor", file: "que-estrategia-usas-para-aprender-mejor.mp3", en: "What strategy do you use to learn better?" },
    { es: "cómo evalúas tu rendimiento en el trabajo", file: "como-evaluas-tu-rendimiento-en-el-trabajo.mp3", en: "How do you evaluate your performance at work?" },
    { es: "qué concepto te parece complicado últimamente", file: "que-concepto-te-parece-complicado-ultimamente.mp3", en: "What concept seems complicated to you lately?" },
    { es: "qué riesgo consideras importante en tu trabajo", file: "que-riesgo-consideras-importante-en-tu-trabajo.mp3", en: "What risk do you consider important in your work?" },
    { es: "qué posibilidad te gustaría explorar", file: "que-posibilidad-te-gustaria-explorar.mp3", en: "What possibility would you like to explore?" },
    { es: "qué situación te ha afectado recientemente", file: "que-situacion-te-ha-afectado-recientemente.mp3", en: "What situation has affected you recently?" },
    { es: "cómo optimizas tu tiempo cada día", file: "como-optimizas-tu-tiempo-cada-dia.mp3", en: "How do you optimize your time each day?" },
    { es: "qué enfoque profesional te funciona mejor", file: "que-enfoque-profesional-te-funciona-mejor.mp3", en: "What professional approach works best for you?" },
    { es: "qué tarea te gustaría actualizar", file: "que-tarea-te-gustaria-actualizar.mp3", en: "What task would you like to update?" },
    { es: "qué has analizado esta semana", file: "que-has-analizado-esta-semana.mp3", en: "What have you analyzed this week?" },
    { es: "qué te gustaría discutir con tu equipo", file: "que-te-gustaria-discutir-con-tu-equipo.mp3", en: "What would you like to discuss with your team?" },
    { es: "qué has logrado este mes", file: "que-has-logrado-este-mes.mp3", en: "What have you achieved this month?" },
    { es: "qué cultura te interesa explorar", file: "que-cultura-te-interesa-explorar.mp3", en: "What culture are you interested in exploring?" },
    { es: "qué desafíos has enfrentado recientemente", file: "que-desafios-has-enfrentado-recientemente.mp3", en: "What challenges have you faced recently?" },
    { es: "qué expectativas tienes para este año", file: "que-expectativas-tienes-para-este-ano.mp3", en: "What expectations do you have for this year?" },
    { es: "qué situación te gustaría aclarar", file: "que-situacion-te-gustaria-aclarar.mp3", en: "What situation would you like to clarify?" },
    { es: "qué proceso te gustaría optimizar", file: "que-proceso-te-gustaria-optimizar.mp3", en: "What process would you like to optimize?" },
    { es: "qué información has evaluado recientemente", file: "que-informacion-has-evaluado-recientemente.mp3", en: "What information have you evaluated recently?" },
    { es: "qué idea te gustaría fortalecer", file: "que-idea-te-gustaria-fortalecer.mp3", en: "What idea would you like to strengthen?" },
    { es: "qué tema te gustaría discutir más profundamente", file: "que-tema-te-gustaria-discutir-mas-profundamente.mp3", en: "What topic would you like to discuss more deeply?" },
    { es: "qué enfoque te gustaría adaptar este año", file: "que-enfoque-te-gustaria-adaptar-este-ano.mp3", en: "What approach would you like to adapt this year?" }
];


/* ============================================================
   GRAMMAR TAB
   ============================================================ */

function renderGrammarTab() {
    const container = document.getElementById("grammar-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
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
    `;
}

/* ============================================================
   BADGES (UPGRADED VISUAL EDITION)
   ============================================================ */
function updateBadges() {
    const list = document.getElementById("badge-list");
    if (!list) return;
    
    const badges = new Set(appState.badges);
    const currentReviewCount = typeof reviewList !== "undefined" ? reviewList.length : 0;

    Object.keys(appState.levelStats).forEach(level => {
        const s = appState.levelStats[level];
        if (s.listens >= 20) badges.add(`${level} Listener`);
        if (s.flashSeen >= 30) badges.add(`${level} Flash Master`);
        if (s.quizScore !== null && s.quizScore >= 80) badges.add(`${level} Quiz Ace`);
        if (s.buildCompleted >= 10) badges.add(`${level} Builder`);

        // CONVERSATION AND SENTENCE UPDATES
        if (s.sentenceCompleted >= 10) badges.add(`${level} Sentence Pro`);
        if (s.conversationCompleted >= 10) badges.add(`${level} Conversationalist`);
        
        // STREAK MILESTONES — Level Specific
        if (s.streak >= 3) badges.add(`${level} 🔥 Consistent Start`);
        if (s.streak >= 7) badges.add(`${level} 👑 Habitual Hero`);
        if (s.streak >= 14) badges.add(`${level} 🔮 Unstoppable Force`);

        // COMBINED TRACKING (5-Day Streak + Clean Review Slate)
        if (s.streak >= 5 && currentReviewCount === 0) {
            badges.add(`${level} 🧹 Clean Slate Savvy`);
        }
    });

    appState.badges = Array.from(badges);
    saveState();

    if (appState.badges.length === 0) {
        list.innerHTML = `<li style="list-style: none; text-align: center; color: rgba(255,255,255,0.4); padding: 10px;">No badges yet. Keep training!</li>`;
        return;
    }

    // Maps text strings into highly visual glass cards
    list.innerHTML = appState.badges.map(badgeText => {
        // Assign dynamic visual anchors (icons) depending on the badge text contents
        let icon = "🎖️"; // Default fallback badge icon
        let desc = "Completed a major training target.";

        if (badgeText.includes("Listener")) { icon = "🎧"; desc = "Listened to over 20 core level items."; }
        else if (badgeText.includes("Flash Master")) { icon = "🎴"; desc = "Reviewed over 30 interactive cards."; }
        else if (badgeText.includes("Quiz Ace")) { icon = "🎯"; desc = "Scored an amazing 80%+ on vocabulary checks."; }
        else if (badgeText.includes("Builder")) { icon = "🧱"; desc = "Successfully constructed 10 full translations."; }
        else if (badgeText.includes("Sentence Pro")) { icon = "📝"; desc = "Passed 10 complex grammatical sentences."; }
        else if (badgeText.includes("Conversationalist")) { icon = "💬"; desc = "Maintained a conversation score above 70%."; }
        else if (badgeText.includes("Consistent Start")) { icon = "🔥"; desc = "Logged in and completed lessons 3 days in a row!"; }
        else if (badgeText.includes("Habitual Hero")) { icon = "👑"; desc = "Built an incredible 7-day learning routine!"; }
        else if (badgeText.includes("Unstoppable Force")) { icon = "🔮"; desc = "Two whole weeks of language study consistency!"; }
        else if (badgeText.includes("Clean Slate Savvy")) { icon = "🧹"; desc = "Kept a 5-day streak alive with zero review errors."; }

        // Clean out any extra emojis present inside raw text titles
        const cleanTitle = badgeText.replace(/[🔥👑🔮🧹]/g, '').trim();

        // Returns an elegant HTML card template reusing your dashboard theme variables
        return `
            <li class="review-card" style="display: flex; align-items: center; gap: 16px; margin: 10px 0; list-style: none;">
                <div style="font-size: 2rem; min-width: 45px; text-align: center; filter: drop-shadow(0 0 8px rgba(0,255,255,0.4));">
                    ${icon}
                </div>
                <div>
                    <strong class="review-word-text" style="font-size: 15px;">${cleanTitle}</strong>
                    <div style="font-size: 12px; color: #a5f3fc; margin-top: 2px; opacity: 0.85;">${desc}</div>
                </div>
            </li>
        `;
    }).join("");
}



/* ============================================================
   STUDENT NAME BOX
   ============================================================ */

function initNameBox() {
    const input = document.getElementById("student-name");
    const btn = document.getElementById("save-name-btn");
    const status = document.getElementById("name-status");

    if (!input || !btn || !status) return;

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
    if (!slider) return;
    
    slider.value = appState.speechRate;

    slider.oninput = () => {
        appState.speechRate = parseFloat(slider.value);
        saveState();
    };
}


/* ============================================================
   PROGRESS METER CONTROLLER
   ============================================================ */

// Animates numbers seamlessly to prevent sudden UI jumps
function animateNumber(id, target, suffix = "%") {
    const el = document.getElementById(id);
    if (!el) return;
    
    let current = 0;
    if (target === 0) {
        el.textContent = "0" + suffix;
        return;
    }
    const step = target / 40;

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = Math.round(current) + suffix;
    }, 20);
}

function updateProgressMeters() {
    const stats = appState.levelStats[appState.currentLevel];
    if (!stats) return;

    // Defensive defaults so undefined never becomes NaN
    const streak = typeof stats.streak === "number" ? stats.streak : 0;
    const reviewDue = Array.isArray(window.reviewList) ? window.reviewList.length : 0;

    // Helper to safely assign style width targets without breaking layout pipelines
    const setWidth = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.style.width = val + "%";
    };

    // Bar widths (percentages based on level completions)
    setWidth("quiz-progress", stats.quizScore || 0);
    setWidth("build-progress", stats.buildCompleted || 0);
    setWidth("sentence-progress", stats.sentenceCompleted || 0);

    // Converts totals into relative visual widths out of realistic milestones
    const xpPercent = Math.min(((appState.totalXP || 0) / 1000) * 100, 100); 
    setWidth("xp-progress", xpPercent);

    const streakPercent = Math.min((streak / 7) * 100, 100); 
    setWidth("streak-progress", streakPercent);

    const scorePercent = Math.min(((appState.globalScore || 0) / 500) * 100, 100); 
    setWidth("score-progress", scorePercent);

    // Fills the review bar based on density (caps full layout visualization at 10 items)
    const reviewBarPercentage = Math.min((reviewDue / 10) * 100, 100);
    setWidth("review-progress", reviewBarPercentage);

    // Animated numbers (Passing specific suffix units to match format goals)
    animateNumber("quiz-number", stats.quizScore || 0);
    animateNumber("build-number", stats.buildCompleted || 0);
    animateNumber("sentence-number", stats.sentenceCompleted || 0);

    // Displays clear point trackers instead of confusing percentage markers
    animateNumber("xp-number", appState.totalXP || 0, " XP");
    animateNumber("streak-number", streak, streak === 1 ? " day" : " days");
    animateNumber("score-number", appState.globalScore || 0, " Pts");
    animateNumber("review-number", reviewDue, reviewDue === 1 ? " word" : " words");

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
    void tile.offsetWidth; // Forces layout recalculation to re-trigger transition rules safely
    tile.classList.add("pulse");
}

/* ============================================================
   CEFR SCORING + CERTIFICATE + ACHIEVEMENT ENGINE (Unified)
   ============================================================ */

const PASS_THRESHOLD = 1;   // ← 1 for testing, e.g. 90 for production

/* ============================================================
   SAFE PERCENT (avoids NaN)
   ============================================================ */
function safePercent(score, max) {
    if (!max || max === 0) return 0;
    return Math.round((score / max) * 100);
}

/* ============================================================
   CALCULATE LEVEL SCORES
   ============================================================ */
function calculateLevelScores() {
    const stats = {
        a1: { quiz: 0, builder: 0, sentence: 0, conversation: 0, smart: 0, avg: 0 },
        a2: { quiz: 0, builder: 0, sentence: 0, conversation: 0, smart: 0, avg: 0 },
        b1: { quiz: 0, builder: 0, sentence: 0, conversation: 0, smart: 0, avg: 0 },
        b2: { quiz: 0, builder: 0, sentence: 0, conversation: 0, smart: 0, avg: 0 }
    };

    const level = currentLevel.toLowerCase(); // ⭐ FIXED

    stats[level].quiz = safePercent(quizCorrect, quizTotal);
    stats[level].builder = safePercent(builderScore, builderMax);
    stats[level].sentence = safePercent(sentenceScore, sentenceMax);
    stats[level].conversation = safePercent(conversationScore, conversationMax);
    stats[level].smart = safePercent(smartScore, smartMax);

    stats[level].avg = Math.round(
        (
            stats[level].quiz +
            stats[level].builder +
            stats[level].sentence +
            stats[level].conversation +
            stats[level].smart
        ) / 5
    );

    return stats;
}



/* ============================================================
   SAVE / LOAD CERTIFICATES
   ============================================================ */
function saveCertificates() {
    localStorage.setItem("certificates", JSON.stringify(certificates));
}

function loadCertificates() {
    const saved = localStorage.getItem("certificates");
    if (saved) {
        try {
            certificates = JSON.parse(saved);
        } catch (e) {
            console.error("Error reading certificate collection state flags:", e);
        }
    }
}
loadCertificates();

/* ============================================================
   UNLOCK CERTIFICATE / ACHIEVEMENT
   ============================================================ */
function unlockCertificate(levelKey) {
    if (!levelKey) return;
    const lowerKey = levelKey.toLowerCase();
    if (lowerKey in certificates) {
        certificates[lowerKey] = true;
        saveCertificates();
    }
}

/* ============================================================
   CERTIFICATE UNLOCK LOGIC
   ============================================================ */
function checkLevelCertificates(stats) {
   if (stats.a1.avg >= PASS_THRESHOLD) unlockCertificate("a1");
if (stats.a2.avg >= PASS_THRESHOLD) unlockCertificate("a2");
if (stats.b1.avg >= PASS_THRESHOLD) unlockCertificate("b1");
if (stats.b2.avg >= PASS_THRESHOLD) unlockCertificate("b2");


    // Mastery unlock when all CEFR levels are complete
    if (
        certificates.a1 &&
        certificates.a2 &&
        certificates.b1 &&
        certificates.b2
    ) {
        certificates.mastery = true;
        saveCertificates();
    }
}

/* ============================================================
   ACHIEVEMENT / BADGE SYSTEM
   ============================================================ */
const ACHIEVEMENTS = [
    { id: "a1_master", label: "a1 Master", condition: s => s.a1.avg >= PASS_THRESHOLD },
    { id: "a2_master", label: "a2 Master", condition: s => s.a2.avg >= PASS_THRESHOLD },
    { id: "b1_master", label: "b1 Master", condition: s => s.b1.avg >= PASS_THRESHOLD },
    { id: "b2_master", label: "b2 Master", condition: s => s.b2.avg >= PASS_THRESHOLD },

    {
        id: "full_progress",
        label: "200‑Word Explorer",
        condition: s => {
            const totalAvg = Math.round(
                (s.a1.avg + s.a2.avg + s.b1.avg + s.b2.avg) / 4
            );
            return totalAvg >= PASS_THRESHOLD;
        }
    }
];

function evaluateAchievements(stats) {
    ACHIEVEMENTS.forEach(a => {
        if (a.condition(stats)) {
            unlockCertificate(a.id); // uses same unlock system
        }
    });
}

/* ============================================================
   MASTER SCORING RUNNER
   ============================================================ */
function runCEFRScoringEngine() {
    const stats = calculateLevelScores();
    checkLevelCertificates(stats);
    evaluateAchievements(stats);
    return stats;
}

/* ============================================================
   RENDER CERTIFICATES WITH NAME + DATE (Updated CEFR Edition)
   ============================================================ */
function renderCertificates() {
    const container = document.getElementById("certificates-container");
    if (!container) return;

    container.style.display = "block";

    const studentInputField = document.getElementById("student-name");
    const name = appState.studentName || (studentInputField ? studentInputField.value : "") || "Learner";

    const today = new Date().toLocaleDateString();

    const setCertFields = (prefix, isActive) => {
        const certEl = document.getElementById(`cert-${prefix}`);
        const nameEl = document.getElementById(`cert-${prefix}-name`);
        const dateEl = document.getElementById(`cert-${prefix}-date`);
        const sealEl = certEl ? certEl.querySelector(".seal") : null;

        if (certEl) {
            certEl.style.display = isActive ? "block" : "none";
        }

        if (isActive && nameEl && dateEl) {
            nameEl.innerText = name;
            dateEl.innerText = today;
        }

        if (sealEl) {
            sealEl.src = "images/seal-gold.png";
        }
    };

    // Standard CEFR certificates
    setCertFields("a1", certificates.a1);
    setCertFields("a2", certificates.a2);
    setCertFields("b1", certificates.b1);
    setCertFields("b2", certificates.b2);

    // Mastery Diploma
    const masteryEl = document.getElementById("cert-mastery");
    const masteryNameEl = document.getElementById("cert-mastery-name");
    const masteryDateEl = document.getElementById("cert-mastery-date");
    const masterySealEl = masteryEl ? masteryEl.querySelector(".seal") : null;

    if (masteryEl) {
        masteryEl.style.display = certificates.mastery ? "block" : "none";
    }

    if (certificates.mastery && masteryNameEl && masteryDateEl) {
        masteryNameEl.innerText = name;
        masteryDateEl.innerText = today;
    }

    if (masterySealEl) {
        masterySealEl.src = "images/seal-gold.png";
    }
}

/* ============================================================
   LOAD PDF LIBRARIES (html2canvas + jsPDF)
   ============================================================ */
function loadPDFLibraries(callback) {
    // Libraries already loaded
    if (window.html2canvas && window.jspdf) {
        callback();
        return;
    }

    const html2canvasScript = document.createElement("script");
    html2canvasScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

    const jsPDFScript = document.createElement("script");
    jsPDFScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

    let loaded = 0;

    function checkLoaded() {
        loaded++;
        if (loaded === 2) {
            callback();
        }
    }

    html2canvasScript.onload = checkLoaded;
    jsPDFScript.onload = checkLoaded;

    html2canvasScript.onerror = () => {
        console.error("Failed to load html2canvas library.");
    };

    jsPDFScript.onerror = () => {
        console.error("Failed to load jsPDF library.");
    };

    document.body.appendChild(html2canvasScript);
    document.body.appendChild(jsPDFScript);
}
/* ============================================================
   DOWNLOAD CERTIFICATE AS PDF
   ============================================================ */

function downloadCertificate(certId) {
    const element = document.getElementById(certId);
    if (!element) {
        alert("Certificate not found.");
        return;
    }

    loadPDFLibraries(() => {
        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            const { jsPDF } = window.jspdf || jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save(certId + ".pdf");
        }).catch(err => {
            console.error("PDF engine blueprint generation error:", err);
            alert("Error downloading certificate. Please check connection and try again.");
        });
    });
}

/* ============================================================
   STARTUP & EVENT INITIALIZATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    // Safely verify state engines read before triggering components
    if (typeof loadState === "function") loadState();

    if (typeof initTabNavigation === "function") initTabNavigation();     
    if (typeof activateTab === "function") activateTab("dashboard"); 

    if (typeof initRateControl === "function") initRateControl();       
    if (typeof initNameBox === "function") initNameBox();           
    if (typeof initDictionarySearch === "function") initDictionarySearch();  
    
    // Spawns the sandbox setup calculations
    if (typeof initFreePracticeSandbox === "function") initFreePracticeSandbox();  

    const resetBtn = document.getElementById("resetAllLevelsBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            const confirmReset = confirm("Are you completely sure you want to delete everything? This will permanently wipe your scores, XP, streaks, and review list tracking.");
            if (confirmReset) {
                if (typeof resetAllProgress === "function") {
                    resetAllProgress();
                } else {
                    localStorage.clear();
                    location.reload();
                }
            }
        });
    }

    if (typeof updateBadges === "function") updateBadges();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
});



/* ============================================================
   MISTAKEN AREAS — REVIEW SYSTEM ENGINE (UPDATED: PURE AUDIO)
   ============================================================ */

// Initialize the incorrect words list from localStorage, or start empty
window.reviewList = [];
try {
    const savedReview = localStorage.getItem('reviewList');
    if (savedReview) window.reviewList = JSON.parse(savedReview);
} catch (e) {
    console.error("Error reading saved mistake logs:", e);
    window.reviewList = [];
}

/* ============================================================
   FIND AUDIO FOR SPANISH PHRASE (FIXED CRASH PIPELINE)
   ============================================================ */
function findAudioForSpanish(spanishText) {
    if (!spanishText) return null;
    const clean = cleanStringForKeyboard(spanishText.toLowerCase());

    const banks = [];
    // FIXED: Individual existence checks prevent crash loops if specific asset sheets load late
    if (typeof CEFR_CONVERSATION_AUDIO_a1 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_a1)) banks.push(...CEFR_CONVERSATION_AUDIO_a1);
    if (typeof CEFR_CONVERSATION_AUDIO_a2 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_a2)) banks.push(...CEFR_CONVERSATION_AUDIO_a2);
    if (typeof CEFR_CONVERSATION_AUDIO_b1 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_b1)) banks.push(...CEFR_CONVERSATION_AUDIO_b1);
    if (typeof CEFR_CONVERSATION_AUDIO_b2 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_b2)) banks.push(...CEFR_CONVERSATION_AUDIO_b2);

    for (const item of banks) {
        if (!item || !item.es || !item.audio) continue;

        if (cleanStringForKeyboard(item.es.toLowerCase()) === clean) {
            return item.audio;
        }
    }
    return null;
}

/* ============================================================
   PURE REVIEW AUDIO PLAYER (NO COMMENTARY, NO TTS)
   ============================================================ */
function playReviewAudio(spanishText) {
    const audioFile = findAudioForSpanish(spanishText);
    if (!audioFile) {
        // Fallback to active browser TTS engine if explicit file is absent
        if (typeof speakSpanish === "function") speakSpanish(spanishText);
        return;
    }

    try {
        const audio = new Audio(`audio/${audioFile}`);
        audio.play().catch(e => console.warn("Native file play stalled. Audio folder missing assets.", e));
    } catch (e) {
        console.error("Audio engine failed to load instance:", e);
    }
}

/* ============================================================
   ADD WORD TO REVIEW LIST
   ============================================================ */
function addIncorrectWord(word) {
    if (!word) return;
    if (!window.reviewList.includes(word)) {
        window.reviewList.push(word);
        localStorage.setItem('reviewList', JSON.stringify(window.reviewList));
        renderReviewList();
        if (typeof updateProgressMeters === "function") updateProgressMeters();
    }
}

/* ============================================================
   REMOVE WORD FROM REVIEW LIST
   ============================================================ */
function clearWordFromReview(word) {
    window.reviewList = window.reviewList.filter(item => item !== word);
    localStorage.setItem('reviewList', JSON.stringify(window.reviewList));
    renderReviewList();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
}

/* ============================================================
   RENDER REVIEW LIST UI
   ============================================================ */
function renderReviewList() {
    const listContainer = document.getElementById('review-words-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (window.reviewList.length === 0) {
        listContainer.innerHTML = '<p class="review-empty-msg">🎉 Great job! No words to review.</p>';
        return;
    }

    window.reviewList.forEach(word => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.margin = '10px 0';
        
        // Extract Spanish part after "➔" or "→"
        let spanishText = word;
        if (word.includes('➔')) {
            spanishText = word.split('➔')[1].trim();
        } else if (word.includes('→')) {
            spanishText = word.split('→')[1].trim();
        }

        card.innerHTML = `
            <span class="review-word-text">${word}</span>
            <div class="review-card-actions" style="display: flex; align-items: center; gap: 12px; margin-left: auto;">
                <button class="pill review-play-btn" style="min-width: 45px; padding: 10px 14px;">
                    🔊 Play
                </button>
                <button class="pill got-it-btn">Got it!</button>
            </div>
        `;

        // Direct binding to safely pass string contents across event cycles
        card.querySelector('.review-play-btn').addEventListener('click', () => {
            playReviewAudio(spanishText);
        });

        card.querySelector('.got-it-btn').addEventListener('click', () => {
            clearWordFromReview(word);
        });

        listContainer.appendChild(card);
    });
}

/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY & CONVERSATIONAL PHRASE SEARCH
   ============================================================ */
function normalizeSpanish(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/-/g, "")               // remove hyphens
        .replace(/\s+/g, " ")            // normalize spaces
        .trim()
        .toLowerCase();
}


function globalLookup(word) {
    const w = word.toLowerCase();
    const levelsList = ["a1", "a2", "b1", "b2"];

    // 1. CEFR Vocabulary (a1–b2) — CEFR_LEVELS
    for (const level of levelsList) {
        const vocab = CEFR_LEVELS[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Vocabulary", level };
        }
    }

    // 2. CEFR Sentences — CEFR_SENTENCES
    for (const level of levelsList) {
        const bank = CEFR_SENTENCES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Sentences", level };
        }
    }

    // 3. CEFR Sentence Choices — CEFR_SENTENCE_CHOICES
    for (const level of levelsList) {
        const bank = CEFR_SENTENCE_CHOICES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { spanish: match.correct.es, source: "Dialogue Choices", level };
        }
    }

    // 4. CEFR Phrases — CEFR_PHRASES
    if (typeof CEFR_PHRASES !== "undefined" && Array.isArray(CEFR_PHRASES)) {
        const phraseMatch = CEFR_PHRASES.find(p =>
            p.english && p.english.toLowerCase() === w
        );
        if (phraseMatch) {
            return { spanish: phraseMatch.spanish, source: "CEFR Phrases", level: phraseMatch.level || "GLOBAL" };
        }
    }

    // 5. Listen Vocab — LISTEN_VOCAB
    if (typeof LISTEN_VOCAB !== "undefined" && Array.isArray(LISTEN_VOCAB)) {
        const lvMatch = LISTEN_VOCAB.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (lvMatch) {
            return { spanish: lvMatch.spanish, source: "Listen Vocab", level: lvMatch.level || "GLOBAL" };
        }
    }

    // 6. Word-by-word dictionary — WORD_DICT
    if (typeof WORD_DICT !== "undefined" && WORD_DICT[w]) {
        return { spanish: WORD_DICT[w], source: "Word Dictionary", level: "GLOBAL" };
    }

    // 7. Conversation Prompts — CEFR_CONVERSATION_PROMPTS (FIXED LOOKUP LOOP)
    if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined" && CEFR_CONVERSATION_PROMPTS !== null) {
        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {
            const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];
            if (!Array.isArray(prompts)) continue;
            
            const convoMatch = prompts.find(p =>
                p.english && p.english.toLowerCase() === w
            );
            if (convoMatch) {
                return { 
                    spanish: typeof convoMatch.spanish === 'object' ? extractSpanishText(convoMatch.spanish) : convoMatch.spanish, 
                    source: "Conversation Prompt", 
                    level: levelKey 
                };
            }
        }
    }

    // 8. Conversation Audio — A1–B2
    const convoAudioBanks = [
        typeof CEFR_CONVERSATION_AUDIO_a1 !== "undefined" ? CEFR_CONVERSATION_AUDIO_a1 : null,
        typeof CEFR_CONVERSATION_AUDIO_a2 !== "undefined" ? CEFR_CONVERSATION_AUDIO_a2 : null,
        typeof CEFR_CONVERSATION_AUDIO_b1 !== "undefined" ? CEFR_CONVERSATION_AUDIO_b1 : null,
        typeof CEFR_CONVERSATION_AUDIO_b2 !== "undefined" ? CEFR_CONVERSATION_AUDIO_b2 : null
    ];

    for (const bank of convoAudioBanks) {
        if (!bank || !Array.isArray(bank)) continue;
        const audioMatch = bank.find(a =>
            a.english && a.english.toLowerCase() === w
        );
        if (audioMatch) {
            return {
                spanish: audioMatch.spanish,
                source: "Conversation Audio",
                level: audioMatch.level || "GLOBAL"
            };
        }
    }

    return null;
}

/* ============================================================
   DICTIONARY SEARCH INITIALIZER SYSTEM (BILINGUAL MODE)
   ============================================================ */
function multiPhraseStitch(query) {
    if (!query) return { spanish: "", matched: [] };

    // Normalize English input
    const words = query
        .toLowerCase()
        .split(/\s+/)
        .map(w => cleanStringForKeyboard(w));

    const results = [];
    const matches = [];

    let i = 0;

    while (i < words.length) {
        let found = false;

        // Try longest possible phrase first
        for (let end = words.length; end > i; end--) {
            const subPhrase = words.slice(i, end).join(" ");

            // CEFR phrase priority (normalized)
            let hit = null;

            if (Array.isArray(CEFR_PHRASES)) {
                const phraseHit = CEFR_PHRASES.find(p =>
                    cleanStringForKeyboard(p?.english || "").toLowerCase() === subPhrase
                );
                if (phraseHit) {
                    hit = { spanish: phraseHit.spanish };
                }
            }

            // Fallback: globalLookup
            if (!hit) {
                hit = globalLookup(subPhrase);
            }

            if (hit) {
                results.push(hit.spanish);
                matches.push(subPhrase);
                i = end;
                found = true;
                break;
            }
        }

        if (!found) {
            const single = globalLookup(words[i]);
            if (single) {
                results.push(single.spanish);
            } else {
                results.push(`[${words[i]}]`);
            }
            i++;
        }
    }

    return {
        spanish: results.join(" "),
        matched: matches
    };
}

function multiPhraseStitchSpanish(spanishText) {
    if (!spanishText) return { english: "", matched: [] };

    const words = spanishText
        .split(/\s+/)
        .map(w => cleanStringForKeyboard(w.toLowerCase()));

    const matched = [];
    const englishParts = [];

    for (const w of words) {
        const english = globalLookupSpanish(w);

        if (english && english !== "[Unknown translation]") {
            matched.push(w);
            englishParts.push(english);
        } else {
            englishParts.push(`[${w}]`);
        }
    }

    return {
        english: englishParts.join(" "),
        matched
    };
}

/* ============================================================
   LANGUAGE DETECTOR (Bulletproof)
   ============================================================ */
function detectLanguage(text) {
    const t = text.toLowerCase();

    if (/[áéíóúñü]/.test(t)) return "spanish";

    if (/\b(el|la|los|las|un|una|yo|tú|usted|nosotros|vosotros|ellos)\b/.test(t)) {
        return "spanish";
    }

    return "english";
}

/* ============================================================
   MULTI‑PHRASE STITCHING ENGINE
   ============================================================ */
function multiPhraseStitch(query) {
    const words = query.split(/\s+/);
    const results = [];
    const matches = [];

    let i = 0;

    while (i < words.length) {
        let found = false;

        for (let end = words.length; end > i; end--) {
            const subPhrase = words.slice(i, end).join(" ");
            const hit = globalLookup(subPhrase);

            if (hit) {
                results.push(hit.spanish);
                matches.push(subPhrase);
                i = end;
                found = true;
                break;
            }
        }

        if (!found) {
            const single = globalLookup(words[i]);
            if (single) {
                results.push(single.spanish);
            } else {
                results.push(`[${words[i]}]`);
            }
            i++;
        }
    }

    return {
        spanish: results.join(" "),
        matches
    };
}

/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY & CONVERSATIONAL PHRASE SEARCH
   ============================================================ */
function globalLookup(word) {
    if (!word) return null;
    const w = word.toLowerCase();
    const levelsList = ["a1", "a2", "b1", "b2"];

    for (const level of levelsList) {
        const vocab = CEFR_LEVELS?.[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cleanStringForKeyboard(w).toLowerCase()

        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Vocabulary", level };
        }
    }

    for (const level of levelsList) {
        const bank = CEFR_SENTENCES?.[level];
        if (!bank) continue;

        const match = bank.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cleanStringForKeyboard(w).toLowerCase()

        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Sentences", level };
        }
    }

    for (const level of levelsList) {
        const bank = CEFR_SENTENCE_CHOICES?.[level];
        if (!bank) continue;

        const match = bank.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cleanStringForKeyboard(w).toLowerCase()

        );
        if (match) {
            return { spanish: match.correct?.es, source: "Dialogue Choices", level };
        }
    }

    if (Array.isArray(CEFR_PHRASES)) {
        const phraseMatch = CEFR_PHRASES.find(p =>
            p?.english?.toLowerCase() === w
        );
        if (phraseMatch) {
            return {
                spanish: phraseMatch.spanish,
                source: "CEFR Phrases",
                level: phraseMatch.level || "GLOBAL"
            };
        }
    }

    if (Array.isArray(LISTEN_VOCAB)) {
        const lvMatch = LISTEN_VOCAB.find(item =>
            cleanStringForKeyboard(item?.english || "").toLowerCase() === cleanStringForKeyboard(w).toLowerCase()

        );
        if (lvMatch) {
            return {
                spanish: lvMatch.spanish,
                source: "Listen Vocab",
                level: lvMatch.level || "GLOBAL"
            };
        }
    }

    if (WORD_DICT?.[w]) {
        return { spanish: WORD_DICT[w], source: "Word Dictionary", level: "GLOBAL" };
    }

    if (CEFR_CONVERSATION_PROMPTS) {
        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {
            const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];
            const convoMatch = prompts.find(p =>
                p?.english?.toLowerCase() === w
            );
            if (convoMatch) {
                return {
                    spanish: convoMatch.spanish,
                    source: "Conversation Prompt",
                    level: convoMatch.level || levelKey
                };
            }
        }
    }

    const convoAudioBanks = [
        CEFR_CONVERSATION_AUDIO_a1,
        CEFR_CONVERSATION_AUDIO_a2,
        CEFR_CONVERSATION_AUDIO_b1,
        CEFR_CONVERSATION_AUDIO_b2
    ];

    for (const bank of convoAudioBanks) {
        if (!Array.isArray(bank)) continue;

        const audioMatch = bank.find(a =>
            a?.english?.toLowerCase() === w
        );
        if (audioMatch) {
            return {
                spanish: audioMatch.spanish,
                source: "Conversation Audio",
                level: audioMatch.level || "GLOBAL"
            };
        }
    }

    return null;
}

/* ============================================================
   SPANISH → ENGLISH LOOKUP (ACCENT-SAFE)
   ============================================================ */
function globalLookupSpanish(spanishText) {
    if (!spanishText) return "[Unknown translation]";

    const s = cleanStringForKeyboard(spanishText.toLowerCase().trim());
    const banks = [];

    // CEFR Vocabulary
    if (CEFR_LEVELS?.a1) banks.push(...CEFR_LEVELS.a1);
    if (CEFR_LEVELS?.a2) banks.push(...CEFR_LEVELS.a2);
    if (CEFR_LEVELS?.b1) banks.push(...CEFR_LEVELS.b1);
    if (CEFR_LEVELS?.b2) banks.push(...CEFR_LEVELS.b2);

    // CEFR Phrases
    if (Array.isArray(CEFR_PHRASES)) banks.push(...CEFR_PHRASES);

    // Listening Vocabulary
    if (Array.isArray(LISTEN_VOCAB)) banks.push(...LISTEN_VOCAB);

    // Conversation Audio Banks
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_a1)) banks.push(...CEFR_CONVERSATION_AUDIO_a1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_a2)) banks.push(...CEFR_CONVERSATION_AUDIO_a2);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_b1)) banks.push(...CEFR_CONVERSATION_AUDIO_b1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_b2)) banks.push(...CEFR_CONVERSATION_AUDIO_b2);

    // Conversation Prompts (expected responses)
    Object.values(CEFR_CONVERSATION_PROMPTS || {}).forEach(levelArray => {
        if (!Array.isArray(levelArray)) return;
        levelArray.forEach(prompt => {
            if (Array.isArray(prompt.expected_responses)) {
                banks.push(...prompt.expected_responses);
            }
        });
    });

    // Disruptors
    const levelsList = ["a1", "a2", "b1", "b2"];
    levelsList.forEach(level => {
        if (typeof getDisruptorResponses === "function") {
            const disruptors = getDisruptorResponses(level);
            if (Array.isArray(disruptors)) banks.push(...disruptors);
        }
    });

    // FINAL MATCHING (accent-safe)
    for (const item of banks) {
        if (!item) continue;

        const spanishString =
            typeof item === "object"
                ? item.es || item.spanish
                : item;

        if (!spanishString) continue;

        if (cleanStringForKeyboard(spanishString.toLowerCase()) === s) {
            return item.en || item.english || "[Unknown translation]";
        }
    }

    return "[Unknown translation]";
}


/* ============================================================
   UNIVERSAL TEXT EXTRACTOR
   ============================================================ */
function extractSpanishText(item) {
    if (!item) return "";
    if (typeof item === "string") return item;

    if (typeof item === "object") {
        if (typeof item.es === "object") return extractSpanishText(item.es);
        if (typeof item.spanish === "object") return extractSpanishText(item.spanish);

        if (item.es) return item.es;
        if (item.spanish) return item.spanish;
        if (item.text) return item.text;

        for (const value of Object.values(item)) {
            if (typeof value === "string" && !value.includes("[object")) return value;
            if (typeof value === "object" && value !== null) {
                const nested = extractSpanishText(value);
                if (nested) return nested;
            }
        }
    }

    return String(item);
}


/* ============================================================
   DICTIONARY SEARCH INITIALIZER SYSTEM (BILINGUAL MODE)
   ============================================================ */
function initDictionarySearch() {
    const searchInput = document.getElementById("dict-search-input");
    const resultBox = document.getElementById("dict-search-result");

    if (!searchInput || !resultBox) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        const lowerQuery = query.toLowerCase();

        if (!query) {
            resultBox.innerHTML = "";
            return;
        }

        const lang = detectLanguage(query);

        /* ============================================================
           1. ENGLISH → SPANISH
        ============================================================ */
        if (lang === "english") {

            /* ============================================================
               A. MULTI‑PHRASE STITCHING
            ============================================================ */
            const stitched = multiPhraseStitch(lowerQuery);

            if (stitched) {
                resultBox.innerHTML = `
                    <div style="padding: 10px; background: rgba(74, 222, 128, 0.1);
                                border: 1px solid rgba(74, 222, 128, 0.3);
                                border-radius: 10px; margin-top: 5px;">
                        <span style="color: #a5f3fc; font-weight: bold;">Spanish:</span>
                        <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600;">
                            ${stitched.spanish}
                        </span>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                            Multi‑phrase mode — matched: ${stitched.matches.join(", ")}
                        </div>
                    </div>
                `;
                return;
            }

            /* ============================================================
               B. FULL PHRASE LOOKUP (exact match)
            ============================================================ */
            const phraseResult = globalLookup(lowerQuery);
            if (phraseResult) {
                resultBox.innerHTML = `
                    <div style="padding: 10px; background: rgba(74, 222, 128, 0.1);
                                border: 1px solid rgba(74, 222, 128, 0.3);
                                border-radius: 10px; margin-top: 5px;">
                        <span style="color: #a5f3fc; font-weight: bold;">Spanish:</span>
                        <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600;">
                            ${phraseResult.spanish}
                        </span>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                            Phrase mode — Found in ${phraseResult.level} (${phraseResult.source})
                        </div>
                    </div>
                `;
                return;
            }

            /* ============================================================
               C. WORD-BY-WORD FALLBACK
            ============================================================ */
            const words = lowerQuery.split(/\s+/);
            const translatedWords = [];
            const unknownWords = [];

            for (const word of words) {
                const result = globalLookup(word);
                if (result) {
                    translatedWords.push(result.spanish);
                } else {
                    unknownWords.push(word);
                    translatedWords.push(`[${word}]`);
                }
            }

            const spanishSentence = translatedWords.join(" ");

            resultBox.innerHTML = `
                <div style="padding: 10px; background: rgba(74, 222, 128, 0.1);
                            border: 1px solid rgba(74, 222, 128, 0.3);
                            border-radius: 10px; margin-top: 5px;">
                    <span style="color: #a5f3fc; font-weight: bold;">Spanish:</span>
                    <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600;">
                        ${spanishSentence}
                    </span>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                        Sentence mode — ${unknownWords.length === 0 ? "all words found" : "missing: " + unknownWords.join(", ")}
                    </div>
                </div>
            `;
            return;
        }

/* ============================================================
   2. SPANISH → ENGLISH
============================================================ */
if (lang === "spanish") {

    const lowerQuery = cleanStringForKeyboard(query.toLowerCase());

    // MULTI‑PHRASE MODE
    if (lowerQuery.includes(" ")) {
        const stitched = multiPhraseStitchSpanish(lowerQuery);

        resultBox.innerHTML = `
            <div style="padding: 10px; background: rgba(74, 222, 128, 0.1);
                        border: 1px solid rgba(74, 222, 128, 0.3);
                        border-radius: 10px; margin-top: 5px;">
                <span style="color: #a5f3fc; font-weight: bold;">English:</span>
                <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600;">
                    ${stitched.english}
                </span>
                <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                    Multi‑phrase mode — matched: ${stitched.matched.join(", ")}
                </div>
            </div>
        `;
        return;
    }

    // SINGLE WORD MODE
    const englishResult = globalLookupSpanish(lowerQuery);

    resultBox.innerHTML = `
        <div style="padding: 10px; background: rgba(74, 222, 128, 0.1);
                    border: 1px solid rgba(74, 222, 128, 0.3);
                    border-radius: 10px; margin-top: 5px;">
            <span style="color: #a5f3fc; font-weight: bold;">English:</span>
            <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600;">
                ${englishResult}
            </span>
            <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                Spanish → English mode
            </div>
        </div>
    `;
    return;
}




        /* ============================================================
           3. UNKNOWN INPUT
        ============================================================ */
        resultBox.innerHTML = `
            <div style="color: #f87171; font-style: italic; font-size: 13px; margin-top: 8px;">
                Unable to detect language. Please type English or Spanish only.
            </div>
        `;
    });
}


/* ============================================================
   GLOBAL FREE PRACTICE SANDBOX (UNSCORED)
   ============================================================ */
let currentPracticeWord = null;

function initFreePracticeSandbox() {
    const checkBtn = document.getElementById("practice-check-btn");
    const nextBtn = document.getElementById("practice-next-btn");
    const inputField = document.getElementById("practice-user-input");

    if (!checkBtn || !nextBtn || !inputField) return;

    // Load initial prompt cleanly
    getNewPracticeWord();

    checkBtn.addEventListener("click", evaluatePracticeAnswer);

    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") evaluatePracticeAnswer();
    });

    nextBtn.addEventListener("click", () => {
        getNewPracticeWord();
    });
}

function getNewPracticeWord() {
    const inputField = document.getElementById("practice-user-input");
    const feedbackBox = document.getElementById("practice-feedback");
    const wordPlaceholder = document.getElementById("practice-english-word");

    if (!wordPlaceholder || !inputField || !feedbackBox) return;

    inputField.value = "";
    feedbackBox.innerHTML = "";

    if (typeof CEFR_LEVELS === "undefined" || CEFR_LEVELS === null) return;
    
    // Filter down to levels that are explicitly defined and contain valid datasets
    const levels = Object.keys(CEFR_LEVELS).filter(lvl => Array.isArray(CEFR_LEVELS[lvl]) && CEFR_LEVELS[lvl].length > 0);
    if (levels.length === 0) {
        wordPlaceholder.textContent = "Loading vocabulary banks...";
        return;
    }
    
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const wordPool = CEFR_LEVELS[randomLevel];
    
    currentPracticeWord = wordPool[Math.floor(Math.random() * wordPool.length)];

    // Always display the English translation word as prompt clue question
    wordPlaceholder.textContent = `${currentPracticeWord.english} (${randomLevel})`;
}
function evaluatePracticeAnswer() {
    const inputField = document.getElementById("practice-user-input");
    const feedbackBox = document.getElementById("practice-feedback");

    if (!inputField || !feedbackBox || !currentPracticeWord) return;

    const userTyped = inputField.value.trim();
    
    if (!userTyped) {
        feedbackBox.innerHTML = `<span style="color: #f87171;">Type an answer first!</span>`;
        return;
    }

    // KEYBOARD PROTECTOR: Clean entries using our helper utility
    const cleanUser = cleanStringForKeyboard(userTyped);
    const cleanCorrect = cleanStringForKeyboard(currentPracticeWord.spanish);

    if (cleanUser === cleanCorrect) {
        const cleanSpeechText = currentPracticeWord.spanish.replace(/'/g, "\\'");
        
        feedbackBox.innerHTML = `
            <div style="color: #4ade80; font-weight: 600; padding: 6px; background: rgba(74,222,128,0.1); border-radius: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span>Correct! 🎉 (${currentPracticeWord.spanish})</span>
                <button id="practice-speak-btn" class="pill" style="padding: 2px 8px; font-size: 10px; max-width: 40px; cursor: pointer;">🔊</button>
            </div>
        `;
        
        // Inline events are replaced with dedicated listeners to prevent apostrophe injection breakages
        const speakBtn = document.getElementById("practice-speak-btn");
        if (speakBtn) {
            speakBtn.onclick = () => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
                utterance.lang = 'es-ES';
                const speedSlider = document.getElementById('rate');
                if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
                window.speechSynthesis.speak(utterance);
            };
        }
        
        // Auto-vocalize correct matches immediately 
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentPracticeWord.spanish);
        utterance.lang = 'es-ES';
        const speedSlider = document.getElementById('rate');
        if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
        window.speechSynthesis.speak(utterance);
        
    } else {
        // Revealed answer engine correction block
        feedbackBox.innerHTML = `
            <div style="color: #f87171; font-weight: 500; padding: 6px; background: rgba(248,113,113,0.1); border-radius: 8px;">
                Not quite! "<strong>${currentPracticeWord.english}</strong>" translates to "<strong>${currentPracticeWord.spanish}</strong>". Try again, or click Skip.
            </div>
        `;
    }
}




