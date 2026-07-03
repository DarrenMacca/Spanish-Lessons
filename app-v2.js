// app-v2.js — PART 1
// Core App State + CEFR Engine + Tab Navigation + Dashboard Updater

/* =========================
   Global App State
   ========================= */

const AppState = {
    userName: '',
    currentLevel: 'A1',
    speechRate: 1.0,
    activeTab: 'dashboard'
};

/* =========================
   CEFR Progression Engine
   ========================= */

const CEFRProgressionEngine = (() => {
    const STORAGE_KEY = 'cefr_progress';

    const LEVELS = ['A1', 'A2', 'B1'];

    const XP_THRESHOLDS = { A1: 0, A2: 300, B1: 700 };

    const MASTER_REQUIREMENTS = { A1: 0.70, A2: 0.75 };

    const XP_REWARDS = {
        listen: 5,
        flashcards: 10,
        quiz: 20,
        builder: 25,
        conversation: 15,
        grammar: 10
    };

    let state = {
        currentLevel: 'A1',
        xp: 0,
        streakDays: 0,
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
                console.warn('CEFR engine: invalid stored state, resetting.');
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
        addXP('quiz');
    }

    function recordBuilderResult(level, scorePercent) {
        state.builderScores.push({ level, score: scorePercent });
        addXP('builder');
    }

    function recordConversationPromptCompleted() {
        state.conversationCount += 1;
        addXP('conversation');
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
        const levelEl = document.getElementById('current-level');
        if (levelEl) levelEl.textContent = state.currentLevel;

        const xpEl = document.getElementById('xp-total');
        if (xpEl) xpEl.textContent = `${state.xp} XP`;

        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            const next = getNextLevel(state.currentLevel) || state.currentLevel;
            const threshold = XP_THRESHOLDS[next] || 1;
            const pct = Math.min(100, (state.xp / threshold) * 100);
            xpFill.style.width = `${pct}%`;
        }

        const quizAvgEl = document.getElementById('quiz-average');
        if (quizAvgEl) {
            const mastery = getMasteryForLevel(state.currentLevel);
            quizAvgEl.textContent = `${Math.round(mastery * 100)}%`;
        }

        const builderScoreEl = document.getElementById('builder-score');
        if (builderScoreEl) {
            builderScoreEl.textContent =
                state.builderScores.length
                    ? state.builderScores[state.builderScores.length - 1].score + '%'
                    : '0%';
        }

        const convEl = document.getElementById('conversation-count');
        if (convEl) convEl.textContent = `${state.conversationCount} Prompts completed`;

        const streakEl = document.getElementById('streak-days');
        if (streakEl) streakEl.textContent = `${state.streakDays} Days`;
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
   Tab Navigation
   ========================= */

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.tab-section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            if (!target) return;

            AppState.activeTab = target;

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(sec => {
                sec.classList.toggle('hidden', sec.id !== target);
            });

            refreshActiveTab();
        });
    });
}

/* =========================
   Dashboard Updater
   ========================= */

function renderDashboard() {
    const state = CEFRProgressionEngine.getState();

    const streakEl = document.getElementById('streak-days');
    if (streakEl) streakEl.textContent = `${state.streakDays} Days`;

    const xpEl = document.getElementById('xp-total');
    if (xpEl) xpEl.textContent = `${state.xp} XP`;

    const levelEl = document.getElementById('current-level');
    if (levelEl) levelEl.textContent = state.currentLevel;

    const quizAvgEl = document.getElementById('quiz-average');
    if (quizAvgEl) {
        quizAvgEl.textContent =
            `${Math.round(CEFRProgressionEngine.getMasteryForLevel(state.currentLevel) * 100)}%`;
    }

    const builderScoreEl = document.getElementById('builder-score');
    if (builderScoreEl) {
        builderScoreEl.textContent =
            state.builderScores.length
                ? state.builderScores[state.builderScores.length - 1].score + '%'
                : '0%';
    }

    const convEl = document.getElementById('conversation-count');
    if (convEl) convEl.textContent = `${state.conversationCount} Prompts completed`;
}

/* =========================
   Bootstrapping
   ========================= */

window.addEventListener('DOMContentLoaded', () => {
    CEFRProgressionEngine.load();
    initTabs();
    AppState.activeTab = 'dashboard';
    renderDashboard();
    initPart2();
    refreshActiveTab();
});
// app-v2.js — PART 2
// UI Systems: Achievement, Name, Speech Rate, Level Pills, Tab Hover, Streak

/* Achievement Popup */
function showAchievement(message) {
    const container = document.getElementById('achievement-popups');
    if (!container) return;

    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.textContent = message;

    container.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(10px)';
    }, 2500);

    setTimeout(() => popup.remove(), 3500);
}

window.showAchievement = showAchievement;


/* Name Saving */
function initNameSaving() {
    const input = document.getElementById('user-name-input');
    const btn = document.getElementById('save-name-btn');

    if (!input || !btn) return;

    const saved = localStorage.getItem('cefr_user_name');
    if (saved) {
        AppState.userName = saved;
        input.value = saved;
    }

    btn.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) return;

        AppState.userName = name;
        localStorage.setItem('cefr_user_name', name);

        showAchievement(`Name saved: ${name}`);
        renderDashboard();
    });
}


/* Speech Rate */
function initSpeechRate() {
    const slider = document.getElementById('speech-rate-slider');
    const label = document.getElementById('speech-rate-label');

    if (!slider || !label) return;

    const saved = localStorage.getItem('cefr_speech_rate');
    if (saved) {
        AppState.speechRate = parseFloat(saved);
        slider.value = AppState.speechRate;
        label.textContent = AppState.speechRate.toFixed(2);
    }

    slider.addEventListener('input', () => {
        const rate = parseFloat(slider.value);
        AppState.speechRate = rate;
        localStorage.setItem('cefr_speech_rate', rate);
        label.textContent = rate.toFixed(2);
    });
}


/* Level Pills */
function initLevelPills() {
    const pills = document.querySelectorAll('.level-btn');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const level = pill.dataset.level;
            if (!level) return;

            AppState.currentLevel = level;

            const state = CEFRProgressionEngine.getState();
            state.currentLevel = level;
            localStorage.setItem('cefr_progress', JSON.stringify(state));

            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            showAchievement(`Switched to ${level} content`);
            renderDashboard();
            refreshActiveTab();
        });
    });
}


/* Tab Hover */
function enhanceTabPills() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            tab.style.boxShadow = '0 0 0 1px rgba(56,189,248,0.4)';
        });

        tab.addEventListener('mouseleave', () => {
            if (!tab.classList.contains('active')) {
                tab.style.boxShadow = 'none';
            }
        });
    });
}


/* Daily Streak */
function updateDailyStreak() {
    CEFRProgressionEngine.updateStreak();
}


/* PART 2 Initializer */
function initPart2() {
    initNameSaving();
    initSpeechRate();
    initLevelPills();
    enhanceTabPills();
    updateDailyStreak();
}
// app-v2.js — PART 3
// Learning Engines: Listen • Flashcards • Quiz • Builder • Conversation

/* LISTEN ENGINE */
const ListenEngine = (() => {

    let audioElements = [];
    let isPlayingAll = false;

    function init() {
        const playAllBtn = document.getElementById('listen-play-all');
        const stopBtn = document.getElementById('listen-stop');
        const pauseBtn = document.getElementById('listen-pause');
        const resumeBtn = document.getElementById('listen-resume');

        if (!playAllBtn) return;

        playAllBtn.onclick = playAll;
        stopBtn.onclick = stopAll;
        pauseBtn.onclick = pauseAll;
        resumeBtn.onclick = resumeAll;

        loadAudio();
    }

    function loadAudio() {
        const words = document.querySelectorAll('.listen-word');
        audioElements = [];

        words.forEach(word => {
            const audio = new Audio(word.dataset.audio);
            audio.playbackRate = AppState.speechRate;
            audioElements.push(audio);
        });
    }

    async function playAll() {
        isPlayingAll = true;
        CEFRProgressionEngine.addXP('listen');

        for (const audio of audioElements) {
            if (!isPlayingAll) break;
            audio.playbackRate = AppState.speechRate;
            await audio.play();
            await new Promise(res => audio.addEventListener('ended', res, { once: true }));
        }
    }

    function stopAll() {
        isPlayingAll = false;
        audioElements.forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
    }

    function pauseAll() {
        isPlayingAll = false;
        audioElements.forEach(a => a.pause());
    }

    function resumeAll() {
        isPlayingAll = true;
        audioElements.forEach(a => a.play());
    }

    return { init };
})();


/* FLASHCARDS ENGINE */
const FlashcardsEngine = (() => {

    const data = {
        A1: [
            { front: "Hola", back: "Hello" },
            { front: "Gracias", back: "Thank you" },
            { front: "Casa", back: "House" }
        ],
        A2: [
            { front: "Cansado", back: "Tired" },
            { front: "Rápido", back: "Fast" }
        ],
        B1: [
            { front: "Desafío", back: "Challenge" },
            { front: "Mejorar", back: "To improve" }
        ]
    };

    let index = 0;

    function init() {
        const card = document.getElementById('flashcard');
        const nextBtn = document.getElementById('flash-next');
        const prevBtn = document.getElementById('flash-prev');
        const flipBtn = document.getElementById('flash-flip');

        if (!card) return;

        nextBtn.onclick = next;
        prevBtn.onclick = prev;
        flipBtn.onclick = flip;

        render();
    }

    function getCards() {
        return data[AppState.currentLevel] || [];
    }

    function render() {
        const card = document.getElementById('flashcard');
        const cards = getCards();

        if (!cards.length) {
            card.innerHTML = `<div class="flash-inner"><div class="flash-front">No cards</div></div>`;
            return;
        }

        const { front, back } = cards[index];

        card.innerHTML = `
            <div class="flash-inner">
                <div class="flash-front">${front}</div>
                <div class="flash-back">${back}</div>
            </div>
        `;
    }

    function next() {
        const cards = getCards();
        index = (index + 1) % cards.length;
        render();
        CEFRProgressionEngine.addXP('flashcards');
    }

    function prev() {
        const cards = getCards();
        index = (index - 1 + cards.length) % cards.length;
        render();
    }

    function flip() {
        const card = document.getElementById('flashcard');
        card.classList.toggle('flipped');
    }

    return { init };
})();


/* QUIZ ENGINE */
const QuizEngine = (() => {

    const data = {
        A1: [
            { q: "What does 'Hola' mean?", a: "Hello", options: ["Hello", "Goodbye", "Please"] },
            { q: "What does 'Gracias' mean?", a: "Thank you", options: ["Thank you", "Sorry", "Good night"] }
        ],
        A2: [
            { q: "What does 'Rápido' mean?", a: "Fast", options: ["Fast", "Slow", "Happy"] }
        ],
        B1: [
            { q: "What does 'Desafío' mean?", a: "Challenge", options: ["Challenge", "Victory", "Effort"] }
        ]
    };

    let index = 0;
    let score = 0;

    function init() {
        const startBtn = document.getElementById('quiz-start');
        const area = document.getElementById('quiz-area');

        if (!startBtn || !area) return;

        startBtn.onclick = start;
    }

    function start() {
        index = 0;
        score = 0;
        renderQuestion();
    }

    function getQuestions() {
        return data[AppState.currentLevel] || [];
    }

    function renderQuestion() {
        const area = document.getElementById('quiz-area');
        const questions = getQuestions();

        if (!questions.length) {
            area.innerHTML = `<p>No quiz available.</p>`;
            return;
        }

        const q = questions[index];

        area.innerHTML = `
            <div class="quiz-card">
                <h3>${q.q}</h3>
                ${q.options.map(opt => `
                    <button class="quiz-option" data-opt="${opt}">${opt}</button>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.onclick = () => checkAnswer(btn.dataset.opt);
        });
    }

    function checkAnswer(selected) {
        const questions = getQuestions();
        const q = questions[index];

        if (selected === q.a) score++;

        index++;

        if (index >= questions.length) {
            finish();
        } else {
            renderQuestion();
        }
    }

    function finish() {
        const area = document.getElementById('quiz-area');
        const questions = getQuestions();
        const percent = Math.round((score / questions.length) * 100);

        CEFRProgressionEngine.recordQuizResult(AppState.currentLevel, percent);

        area.innerHTML = `
            <div class="quiz-card">
                <h3>Quiz Complete!</h3>
                <p>Your score: ${percent}%</p>
            </div>
        `;
    }

    return { init };
})();


/* SENTENCE BUILDER ENGINE */
const BuilderEngine = (() => {

    const data = {
        A1: { correct: "Yo soy estudiante", words: ["Yo", "soy", "estudiante"] },
        A2: { correct: "Ella corre rápidamente", words: ["Ella", "corre", "rápidamente"] },
        B1: { correct: "Quiero mejorar mi español", words: ["Quiero", "mejorar", "mi", "español"] }
    };

    let selected = [];

    function init() {
        const area = document.getElementById('builder-area');
        const checkBtn = document.getElementById('builder-check');

        if (!area || !checkBtn) return;

        renderWords();
        checkBtn.onclick = checkSentence;
    }

    function renderWords() {
        const area = document.getElementById('builder-area');
        const levelData = data[AppState.currentLevel];

        selected = [];

        area.innerHTML = levelData.words.map(w =>
            `<button class="builder-word" data-word="${w}">${w}</button>`
        ).join('');

        document.querySelectorAll('.builder-word').forEach(btn => {
            btn.onclick = () => {
                selected.push(btn.dataset.word);
                btn.disabled = true;
            };
        });
    }

    function checkSentence() {
        const levelData = data[AppState.currentLevel];
        const resultEl = document.getElementById('builder-result');

        const userSentence = selected.join(' ');
        const correct = levelData.correct;

        const score = userSentence === correct ? 100 : 0;

        CEFRProgressionEngine.recordBuilderResult(AppState.currentLevel, score);

        resultEl.textContent = `Score: ${score}%`;
    }

    return { init };
})();


/* CONVERSATION ENGINE */
const ConversationEngine = (() => {

    const prompts = {
        A1: ["¿Cómo te llamas?", "¿De dónde eres?", "¿Cómo estás?"],
        A2: ["¿Qué hiciste ayer?", "Describe tu casa."],
        B1: ["¿Cuál es tu mayor desafío aprendiendo español?", "Describe una experiencia inolvidable."]
    };

    let index = 0;

    function init() {
        const area = document.getElementById('conversation-area');
        const nextBtn = document.getElementById('conversation-next');

        if (!area || !nextBtn) return;

        nextBtn.onclick = nextPrompt;
        renderPrompt();
    }

    function getPrompts() {
        return prompts[AppState.currentLevel] || [];
    }

    function renderPrompt() {
        const area = document.getElementById('conversation-area');
        const list = getPrompts();

        if (!list.length) {
            area.textContent = "No prompts available.";
            return;
        }

        area.textContent = list[index];
    }

    function nextPrompt() {
        const list = getPrompts();

        index = (index + 1) % list.length;

        CEFRProgressionEngine.recordConversationPromptCompleted();

        renderPrompt();
    }

    return { init };
})();
// app-v2.js — PART 4
// Certificates & Badges

/* CERTIFICATES ENGINE */
const CertificatesEngine = (() => {

    function init() {
        const area = document.getElementById('certificates-area');
        if (!area) return;

        renderCertificates();
    }

    function renderCertificates() {
        const area = document.getElementById('certificates-area');
        const state = CEFRProgressionEngine.getState();

        const levels = ['A1', 'A2', 'B1'];

        area.innerHTML = levels.map(level => {
            const unlocked =
                state.currentLevel === level ||
                levels.indexOf(state.currentLevel) > levels.indexOf(level);

            return `
                <div class="certificate-card">
                    <h3>Certificate: ${level}</h3>
                    <p>Status: ${unlocked ? 'Unlocked' : 'Locked'}</p>
                    ${unlocked ? `<button class="primary-btn">Download</button>` : ''}
                </div>
            `;
        }).join('');
    }

    return { init };
})();

/* BADGES ENGINE */
const BadgesEngine = (() => {

    function init() {
        const list = document.getElementById('badge-list');
        if (!list) return;

        renderBadges();
    }

    function renderBadges() {
        const list = document.getElementById('badge-list');
        const state = CEFRProgressionEngine.getState();

        const badges = [];

        if (state.quizScores.length >= 3) badges.push('Quiz Master');
        if (state.builderScores.length >= 3) badges.push('Sentence Streak');
        if (state.conversationCount >= 5) badges.push('Conversation Explorer');

        if (!badges.length) {
            list.innerHTML = `<li>No badges earned yet.</li>`;
            return;
        }

        list.innerHTML = badges.map(b => `<li>${b}</li>`).join('');
    }

    return { init };
})();
// app-v2.js — PART 5
// Integration Layer

/* XP Hook Helpers */
function awardListenXP() {
    CEFRProgressionEngine.addXP('listen');
    renderDashboard();
}

function awardFlashcardsXP() {
    CEFRProgressionEngine.addXP('flashcards');
    renderDashboard();
}

function awardQuizXP(percent) {
    CEFRProgressionEngine.recordQuizResult(AppState.currentLevel, percent);
    renderDashboard();
}

function awardBuilderXP(percent) {
    CEFRProgressionEngine.recordBuilderResult(AppState.currentLevel, percent);
    renderDashboard();
}

function awardConversationXP() {
    CEFRProgressionEngine.recordConversationPromptCompleted();
    renderDashboard();
}

/* Tab-aware Refresh */
function refreshActiveTab() {
    switch (AppState.activeTab) {
        case 'dashboard':
            renderDashboard();
            break;

        case 'listen':
            ListenEngine.init();
            break;

        case 'flash':
            FlashcardsEngine.init();
            break;

        case 'quiz':
            QuizEngine.init();
            break;

        case 'build':
            BuilderEngine.init();
            break;

        case 'conversation':
            ConversationEngine.init();
            break;

        case 'certificates':
            CertificatesEngine.init();
            break;

        case 'badges':
            BadgesEngine.init();
            break;

        default:
            break;
    }
}

/* Full Refresh */
function fullRefresh() {
    CEFRProgressionEngine.load();
    renderDashboard();
    refreshActiveTab();
}

window.fullRefresh = fullRefresh;
