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

    const XP_THRESHOLDS = {
        A1: 0,
        A2: 300,
        B1: 700
    };

    const MASTER_REQUIREMENTS = {
        A1: 0.70,
        A2: 0.75
    };

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

    /* ---------- Persistence ---------- */

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

    /* ---------- Progress Events ---------- */

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

    /* ---------- Level & Mastery ---------- */

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

    /* ---------- UI Integration ---------- */

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

    /* ---------- Helpers ---------- */

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

            if (target === 'dashboard') {
                renderDashboard();
            }
        });
    });
}

/* =========================
   Dashboard Updater (HTML stays intact)
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
    renderDashboard();
});

/* =========================
   Dashboard Renderer
   ========================= */

function renderDashboard() {
    const dash = document.getElementById('dashboard');
    if (!dash) return;

    const state = CEFRProgressionEngine.getState();

    dash.innerHTML = `
        <div class="glass-panel dashboard-wrapper">

            <!-- HERO IMAGE -->
            <div class="dashboard-hero">
                <img src="images/hero-mountains.jpg" class="hero-image" alt="Spanish learning hero">
            </div>

            <!-- WELCOME -->
            <h1 class="dashboard-title">Welcome back, ${AppState.userName || 'Learner'}!</h1>
            <p>Your personalised Spanish CEFR learning dashboard.</p>

            <!-- TOP ROW: STREAK + XP -->
            <div class="dashboard-grid">

                <!-- DAILY STREAK -->
                <div class="dash-card streak-card">
                    <img src="images/flame.png" class="streak-icon" alt="Streak flame">
                    <h3>Daily Streak</h3>
                    <p id="streak-days">${state.streakDays} Days</p>
                </div>

                <!-- XP CARD -->
                <div class="dash-card xp-card">
                    <h3>Your XP</h3>
                    <p id="xp-total">${state.xp} XP</p>
                    <div class="xp-bar">
                        <div class="xp-fill"></div>
                    </div>
                    <p class="xp-level">Level: ${state.currentLevel}</p>
                </div>

                <!-- CURRENT LEVEL -->
                <div class="dash-card">
                    <h3>Current Level</h3>
                    <p id="current-level">${state.currentLevel}</p>
                </div>

            </div>

            <!-- SECOND ROW: QUIZ / BUILDER / CONVERSATION -->
            <div class="dashboard-grid">

                <!-- QUIZ PERFORMANCE -->
                <div class="dash-card">
                    <h3>Quiz Performance</h3>
                    <p id="quiz-average">${Math.round(CEFRProgressionEngine.getMasteryForLevel(state.currentLevel) * 100)}%</p>
                </div>

                <!-- SENTENCE BUILDER -->
                <div class="dash-card">
                    <h3>Sentence Builder</h3>
                    <p id="builder-score">
                        ${state.builderScores.length
                            ? state.builderScores[state.builderScores.length - 1].score + '%'
                            : '0%'}
                    </p>
                </div>

                <!-- CONVERSATION PRACTICE -->
                <div class="dash-card">
                    <h3>Conversation Practice</h3>
                    <p id="conversation-count">${state.conversationCount} Prompts completed</p>
                </div>

            </div>

            <!-- ACHIEVEMENTS -->
            <div class="dash-card achievements-card">
                <h3>Achievements</h3>
                <div class="badge-grid">

                    <div class="badge-item">
                        <img src="images/badge-quiz.png" alt="Quiz Master">
                        <p>Quiz Master</p>
                    </div>

                    <div class="badge-item">
                        <img src="images/badge-streak.png" alt="Sentence Streak">
                        <p>Sentence Streak</p>
                    </div>

                    <div class="badge-item">
                        <img src="images/badge-conversation.png" alt="Conversation Explorer">
                        <p>Conversation Explorer</p>
                    </div>

                </div>
            </div>

        </div>
    `;

    // After injecting HTML, update XP bar fill
    CEFRProgressionEngine.load();
}
/* =========================
   Achievement Popup System
   ========================= */

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

    setTimeout(() => {
        popup.remove();
    }, 3500);
}

window.showAchievement = showAchievement;


/* =========================
   Name Saving System
   ========================= */

function initNameSaving() {
    const input = document.getElementById('user-name-input');
    const btn = document.getElementById('save-name-btn');

    if (!input || !btn) return;

    // Load saved name
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


/* =========================
   Speech Rate Slider
   ========================= */

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


/* =========================
   Level Pill Buttons
   ========================= */

function initLevelPills() {
    const pills = document.querySelectorAll('.level-btn');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const level = pill.dataset.level;
            if (!level) return;

            AppState.currentLevel = level;

            // Sync CEFR engine
            const state = CEFRProgressionEngine.getState();
            state.currentLevel = level;
            localStorage.setItem('cefr_progress', JSON.stringify(state));

            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            showAchievement(`Switched to ${level} content`);
            renderDashboard();
        });
    });
}


/* =========================
   Tab Pill Enhancements
   ========================= */

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


/* =========================
   Daily Streak Auto-Update
   ========================= */

function updateDailyStreak() {
    CEFRProgressionEngine.updateStreak();
}


/* =========================
   UI Helper: Smooth Scroll
   ========================= */

function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/* =========================
   Initialize Part 3 Systems
   ========================= */

function initPart3() {
    initNameSaving();
    initSpeechRate();
    initLevelPills();
    enhanceTabPills();
    updateDailyStreak();
}

window.addEventListener('DOMContentLoaded', initPart3);
/* =========================
   LISTEN TAB ENGINE
   ========================= */

const ListenEngine = (() => {

    const audioElements = [];
    let isPlayingAll = false;

    function init() {
        const playAllBtn = document.getElementById('listen-play-all');
        const stopBtn = document.getElementById('listen-stop');
        const pauseBtn = document.getElementById('listen-pause');
        const resumeBtn = document.getElementById('listen-resume');

        if (!playAllBtn) return;

        playAllBtn.addEventListener('click', playAll);
        stopBtn.addEventListener('click', stopAll);
        pauseBtn.addEventListener('click', pauseAll);
        resumeBtn.addEventListener('click', resumeAll);

        loadAudio();
    }

    function loadAudio() {
        const words = document.querySelectorAll('.listen-word');
        audioElements.length = 0;

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


/* =========================
   FLASHCARDS ENGINE
   ========================= */

const FlashcardsEngine = (() => {

    let cards = [];
    let currentIndex = 0;

    function init() {
        const nextBtn = document.getElementById('flash-next');
        const prevBtn = document.getElementById('flash-prev');
        const flipBtn = document.getElementById('flash-flip');

        if (!nextBtn) return;

        nextBtn.addEventListener('click', nextCard);
        prevBtn.addEventListener('click', prevCard);
        flipBtn.addEventListener('click', flipCard);

        loadCards();
        renderCard();
    }

    function loadCards() {
        const level = AppState.currentLevel;

        const data = {
            A1: [
                { front: 'Hola', back: 'Hello' },
                { front: 'Gracias', back: 'Thank you' },
                { front: 'Por favor', back: 'Please' }
            ],
            A2: [
                { front: 'Aunque', back: 'Although' },
                { front: 'Depende', back: 'It depends' }
            ],
            B1: [
                { front: 'Sin embargo', back: 'However' },
                { front: 'A pesar de', back: 'Despite' }
            ]
        };

        cards = data[level] || [];
        currentIndex = 0;
    }

    function renderCard() {
        const cardEl = document.getElementById('flashcard');
        if (!cardEl) return;

        const card = cards[currentIndex];
        cardEl.innerHTML = `
            <div class="flash-inner">
                <div class="flash-front">${card.front}</div>
                <div class="flash-back">${card.back}</div>
            </div>
        `;
    }

    function nextCard() {
        currentIndex = (currentIndex + 1) % cards.length;
        CEFRProgressionEngine.addXP('flashcards');
        renderCard();
    }

    function prevCard() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        renderCard();
    }

    function flipCard() {
        const cardEl = document.getElementById('flashcard');
        cardEl.classList.toggle('flipped');
    }

    return { init };
})();


/* =========================
   QUIZ ENGINE
   ========================= */

const QuizEngine = (() => {

    let questions = [];
    let index = 0;
    let score = 0;

    function init() {
        const startBtn = document.getElementById('quiz-start');
        if (!startBtn) return;

        startBtn.addEventListener('click', startQuiz);
    }

    function startQuiz() {
        loadQuestions();
        index = 0;
        score = 0;
        renderQuestion();
    }

    function loadQuestions() {
        const level = AppState.currentLevel;

        const data = {
            A1: [
                { q: 'Hola means?', a: 'Hello', options: ['Goodbye', 'Hello', 'Please'] },
                { q: 'Gracias means?', a: 'Thank you', options: ['Thank you', 'Sorry', 'Please'] }
            ],
            A2: [
                { q: 'Aunque means?', a: 'Although', options: ['Although', 'Despite', 'However'] }
            ],
            B1: [
                { q: 'Sin embargo means?', a: 'However', options: ['However', 'Although', 'Despite'] }
            ]
        };

        questions = data[level] || [];
    }

    function renderQuestion() {
        const qEl = document.getElementById('quiz-area');
        if (!qEl) return;

        if (index >= questions.length) {
            finishQuiz();
            return;
        }

        const q = questions[index];

        qEl.innerHTML = `
            <div class="quiz-card">
                <h3>${q.q}</h3>
                ${q.options.map(opt => `
                    <button class="quiz-option">${opt}</button>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.textContent === q.a) score++;
                index++;
                renderQuestion();
            });
        });
    }

    function finishQuiz() {
        const percent = Math.round((score / questions.length) * 100);
        CEFRProgressionEngine.recordQuizResult(AppState.currentLevel, percent);

        const qEl = document.getElementById('quiz-area');
        qEl.innerHTML = `
            <div class="quiz-card">
                <h3>Your Score: ${percent}%</h3>
            </div>
        `;
    }

    return { init };
})();


/* =========================
   SENTENCE BUILDER ENGINE
   ========================= */

const BuilderEngine = (() => {

    let words = [];
    let correctSentence = '';
    let userSentence = [];

    function init() {
        const buildBtn = document.getElementById('builder-check');
        if (!buildBtn) return;

        buildBtn.addEventListener('click', checkSentence);

        loadSentence();
        renderWords();
    }

    function loadSentence() {
        const level = AppState.currentLevel;

        const data = {
            A1: {
                correct: 'Yo soy estudiante',
                words: ['Yo', 'soy', 'estudiante']
            },
            A2: {
                correct: 'Aunque estoy cansado',
                words: ['Aunque', 'estoy', 'cansado']
            },
            B1: {
                correct: 'Sin embargo no tengo tiempo',
                words: ['Sin', 'embargo', 'no', 'tengo', 'tiempo']
            }
        };

        correctSentence = data[level].correct;
        words = shuffle([...data[level].words]);
        userSentence = [];
    }

    function renderWords() {
        const area = document.getElementById('builder-area');
        if (!area) return;

        area.innerHTML = words.map(w => `
            <button class="builder-word">${w}</button>
        `).join('');

        document.querySelectorAll('.builder-word').forEach(btn => {
            btn.addEventListener('click', () => {
                userSentence.push(btn.textContent);
                btn.disabled = true;
            });
        });
    }

    function checkSentence() {
        const result = userSentence.join(' ');
        const percent = result === correctSentence ? 100 : 0;

        CEFRProgressionEngine.recordBuilderResult(AppState.currentLevel, percent);

        const out = document.getElementById('builder-result');
        out.textContent = `Score: ${percent}%`;
    }

    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    return { init };
})();


/* =========================
   CONVERSATION ENGINE
   ========================= */

const ConversationEngine = (() => {

    const prompts = {
        A1: [
            'Introduce yourself.',
            'Say where you live.',
            'Say what you like.'
        ],
        A2: [
            'Explain your daily routine.',
            'Describe a recent experience.'
        ],
        B1: [
            'Give your opinion on a topic.',
            'Explain a problem and solution.'
        ]
    };

    function init() {
        const btn = document.getElementById('conversation-next');
        if (!btn) return;

        btn.addEventListener('click', nextPrompt);
        renderPrompt();
    }

    function renderPrompt() {
        const area = document.getElementById('conversation-area');
        if (!area) return;

        const levelPrompts = prompts[AppState.currentLevel];
        const random = levelPrompts[Math.floor(Math.random() * levelPrompts.length)];

        area.textContent = random;
    }

    function nextPrompt() {
        CEFRProgressionEngine.recordConversationPromptCompleted();
        renderPrompt();
    }

    return { init };
})();


/* =========================
   CERTIFICATES ENGINE
   ========================= */

const CertificatesEngine = (() => {

    function init() {
        const area = document.getElementById('certificates-area');
        if (!area) return;

        const state = CEFRProgressionEngine.getState();

        area.innerHTML = `
            <div class="certificate-card">
                <h3>A1 Certificate</h3>
                <p>${state.currentLevel !== 'A1' ? 'Unlocked' : 'In progress'}</p>
            </div>

            <div class="certificate-card">
                <h3>A2 Certificate</h3>
                <p>${state.currentLevel === 'B1' ? 'Unlocked' : 'In progress'}</p>
            </div>

            <div class="certificate-card">
                <h3>B1 Certificate</h3>
                <p>${state.currentLevel === 'B1' ? 'Unlocked' : 'In progress'}</p>
            </div>
        `;
    }

    return { init };
})();


/* =========================
   BADGES ENGINE
   ========================= */

const BadgesEngine = (() => {

    function init() {
        const list = document.getElementById('badge-list');
        if (!list) return;

        const state = CEFRProgressionEngine.getState();

        const badges = [];

        if (state.quizScores.length >= 3) badges.push('Quiz Master');
        if (state.streakDays >= 5) badges.push('Streak Champion');
        if (state.conversationCount >= 5) badges.push('Conversation Explorer');

        list.innerHTML = badges.map(b => `<li>${b}</li>`).join('');
    }

    return { init };
})();


/* =========================
   Initialize Part 4 Modules
   ========================= */

function initPart4() {
    ListenEngine.init();
    FlashcardsEngine.init();
    QuizEngine.init();
    BuilderEngine.init();
    ConversationEngine.init();
    CertificatesEngine.init();
    BadgesEngine.init();
}

window.addEventListener('DOMContentLoaded', initPart4);
/* =========================
   PART 5 — FINAL INTEGRATION
   ========================= */

/* ---------- Sync Level Pills with CEFR Engine ---------- */

function syncLevelPillsToState() {
    const pills = document.querySelectorAll('.level-btn');
    const current = AppState.currentLevel;

    pills.forEach(p => {
        if (p.dataset.level === current) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
}


/* ---------- Sync Tab Pills to Active Tab ---------- */

function syncTabPillsToState() {
    const tabs = document.querySelectorAll('.tab-btn');
    const active = AppState.activeTab;

    tabs.forEach(t => {
        if (t.dataset.tab === active) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
}


/* ---------- Global XP Hooks for UI Actions ---------- */

function attachGlobalXPEvents() {
    // Listen tab buttons
    const listenButtons = [
        '#listen-play-all',
        '#listen-stop',
        '#listen-pause',
        '#listen-resume'
    ];

    listenButtons.forEach(sel => {
        const btn = document.querySelector(sel);
        if (btn) {
            btn.addEventListener('click', () => {
                CEFRProgressionEngine.addXP('listen');
                renderDashboard();
            });
        }
    });

    // Flashcards next/prev/flip
    const flashButtons = [
        '#flash-next',
        '#flash-prev',
        '#flash-flip'
    ];

    flashButtons.forEach(sel => {
        const btn = document.querySelector(sel);
        if (btn) {
            btn.addEventListener('click', () => {
                CEFRProgressionEngine.addXP('flashcards');
                renderDashboard();
            });
        }
    });

    // Quiz start
    const quizStart = document.getElementById('quiz-start');
    if (quizStart) {
        quizStart.addEventListener('click', () => {
            CEFRProgressionEngine.addXP('quiz');
            renderDashboard();
        });
    }

    // Builder check
    const builderCheck = document.getElementById('builder-check');
    if (builderCheck) {
        builderCheck.addEventListener('click', () => {
            CEFRProgressionEngine.addXP('builder');
            renderDashboard();
        });
    }

    // Conversation next
    const convNext = document.getElementById('conversation-next');
    if (convNext) {
        convNext.addEventListener('click', () => {
            CEFRProgressionEngine.addXP('conversation');
            renderDashboard();
        });
    }
}


/* ---------- Remove Settings Tab Completely ---------- */

function removeSettingsTab() {
    const settingsBtn = document.querySelector('[data-tab="settings"]');
    const settingsSection = document.getElementById('settings');

    if (settingsBtn) settingsBtn.remove();
    if (settingsSection) settingsSection.remove();
}


/* ---------- Ensure Dashboard Refreshes on Tab Switch ---------- */

function ensureDashboardRefreshOnTabSwitch() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.dataset.tab === 'dashboard') {
                renderDashboard();
            }
        });
    });
}


/* ---------- Global Initialization ---------- */

function initFinalIntegration() {
    removeSettingsTab();
    syncLevelPillsToState();
    syncTabPillsToState();
    attachGlobalXPEvents();
    ensureDashboardRefreshOnTabSwitch();
}

window.addEventListener('DOMContentLoaded', initFinalIntegration);


/* =========================
   END OF APP-V2.JS
   ========================= */
