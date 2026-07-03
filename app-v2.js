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

            // always refresh the active tab’s engine / dashboard
            if (typeof refreshActiveTab === 'function') {
                refreshActiveTab();
            } else if (target === 'dashboard') {
                // fallback if Part 5 not yet loaded
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
   PART 2 — UI Systems
   ========================= */

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

            if (typeof refreshActiveTab === 'function') {
                refreshActiveTab();
            }
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


/* PART 2 Init — called by Part 5 */
function initPart2() {
    initNameSaving();
    initSpeechRate();
    initLevelPills();
    enhanceTabPills();
    updateDailyStreak();
}
/* ============================================================
   PART 3 INITIALIZER — FIXED
   ============================================================ */

function initPart3() {
    ListenEngine.init();
    FlashcardsEngine.init();
    QuizEngine.init();
    BuilderEngine.init();
    ConversationEngine.init();
}

// ❌ REMOVE THIS (it breaks all tabs)
// window.addEventListener('DOMContentLoaded', initPart3);

// Part 3 is now initialized ONLY by refreshActiveTab() in Part 5


/* =========================
   PART 4 — Certificates & Badges
   ========================= */

/* ============================================================
   CERTIFICATES ENGINE
   ============================================================ */

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



/* ============================================================
   BADGES ENGINE
   ============================================================ */

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

/* ============================================================
   PART 4 INITIALIZER — FIXED
   ============================================================ */

function initPart4() {
    CertificatesEngine.init();
    BadgesEngine.init();
}

// ❌ REMOVE THIS — it breaks all tabs
// window.addEventListener('DOMContentLoaded', initPart4);

// Part 4 now initializes ONLY when its tab becomes active via refreshActiveTab()


/* =========================
   PART 5 — Integration Layer
   ========================= */

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
