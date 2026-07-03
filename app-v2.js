// app-v2.js
// Professional, updated version with improved state management, streaks, mastery, engines, and UI integration.

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

    const MASTER_REQUIREMENTS = { A1: 0.70, A2: 0.75, B1: 0.80 };

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

    function validateLoadedState(saved) {
        const result = { ...state };
        if (typeof saved.currentLevel === 'string' && LEVELS.includes(saved.currentLevel)) {
            result.currentLevel = saved.currentLevel;
        }
        if (typeof saved.xp === 'number' && saved.xp >= 0) {
            result.xp = saved.xp;
        }
        if (typeof saved.streakDays === 'number' && saved.streakDays >= 0) {
            result.streakDays = saved.streakDays;
        }
        if (Array.isArray(saved.quizScores)) {
            result.quizScores = saved.quizScores.filter(
                q => q && LEVELS.includes(q.level) && typeof q.score === 'number'
            );
        }
        if (Array.isArray(saved.builderScores)) {
            result.builderScores = saved.builderScores.filter(
                b => b && LEVELS.includes(b.level) && typeof b.score === 'number'
            );
        }
        if (typeof saved.conversationCount === 'number' && saved.conversationCount >= 0) {
            result.conversationCount = saved.conversationCount;
        }
        if (typeof saved.lastActiveDate === 'string') {
            result.lastActiveDate = saved.lastActiveDate;
        }
        return result;
    }

    function load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const saved = JSON.parse(raw);
                state = validateLoadedState(saved);
            } catch (e) {
                console.warn('CEFR engine: invalid stored state, resetting.');
            }
        }
        AppState.currentLevel = state.currentLevel;
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function addXP(source) {
        const amount = XP_REWARDS[source] || 0;
        state.xp += amount;
        save();
        evaluateLevelUp();
    }

    function recordQuizResult(level, scorePercent) {
        state.quizScores.push({ level, score: scorePercent });
        trimArrays();
        addXP('quiz');
    }

    function recordBuilderResult(level, scorePercent) {
        state.builderScores.push({ level, score: scorePercent });
        trimArrays();
        addXP('builder');
    }

    function recordConversationPromptCompleted() {
        state.conversationCount += 1;
        addXP('conversation');
    }

    function trimArrays() {
        const MAX_ENTRIES = 100;
        if (state.quizScores.length > MAX_ENTRIES) {
            state.quizScores = state.quizScores.slice(-MAX_ENTRIES);
        }
        if (state.builderScores.length > MAX_ENTRIES) {
            state.builderScores = state.builderScores.slice(-MAX_ENTRIES);
        }
    }

    function updateStreak(todayStr) {
        const today = todayStr || new Date().toISOString().slice(0, 10);
        if (!state.lastActiveDate) {
            state.streakDays = 1;
        } else {
            const prevDate = new Date(state.lastActiveDate + 'T00:00:00Z');
            const currDate = new Date(today + 'T00:00:00Z');
            const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                state.streakDays += 1;
            } else if (diffDays > 1) {
                state.streakDays = 1;
            }
        }
        state.lastActiveDate = today;
        save();
    }

    function evaluateLevelUp() {
        const current = state.currentLevel;
        const nextLevel = getNextLevel(current);
        if (!nextLevel) return;

        const xpEnough = state.xp >= XP_THRESHOLDS[nextLevel];
        const masteryEnough = getMasteryForLevel(current) >= (MASTER_REQUIREMENTS[current] || 0.8);

        if (xpEnough && masteryEnough) {
            state.currentLevel = nextLevel;
            AppState.currentLevel = nextLevel;
            save();
            if (window.showAchievement) {
                window.showAchievement(`Level up! You are now ${nextLevel}.`);
            }
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
        const recent = allScores.slice(-10);
        const avg = recent.reduce((sum, s) => sum + s, 0) / recent.length;
        return avg / 100;
    }

    function forceLevel(level) {
        if (!LEVELS.includes(level)) return;
        state.currentLevel = level;
        AppState.currentLevel = level;
        save();
    }

    return {
        load,
        addXP,
        recordQuizResult,
        recordBuilderResult,
        recordConversationPromptCompleted,
        updateStreak,
        getMasteryForLevel,
        getState: () => ({ ...state }),
        forceLevel
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

    const xpFill = document.querySelector('.xp-fill');
    if (xpFill) {
        const next = CEFRProgressionEngine.getState().currentLevel;
        const nextLevel = CEFRProgressionEngine.getState().currentLevel;
        const threshold = XP_THRESHOLDS[nextLevel] || 1;
        const pct = Math.min(100, (state.xp / threshold) * 100);
        xpFill.style.width = `${pct}%`;
    }
}

/* =========================
   Achievement Popup
   ========================= */

function showAchievement(message) {
    const container = document.getElementById('achievement-popups');
    if (!container) return;

    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.textContent = message;
    popup.setAttribute('role', 'status');
    popup.setAttribute('aria-live', 'polite');

    container.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('fade-out');
    }, 2500);

    setTimeout(() => popup.remove(), 3500);
}

window.showAchievement = showAchievement;

/* =========================
   Name Saving
   ========================= */

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

/* =========================
   Speech Rate
   ========================= */

function initSpeechRate() {
    const slider = document.getElementById('speech-rate-slider');
    const label = document.getElementById('speech-rate-label');

    if (!slider || !label) return;

    const saved = localStorage.getItem('cefr_speech_rate');
    if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) {
            AppState.speechRate = Math.min(2.0, Math.max(0.5, parsed));
        }
    }
    slider.value = AppState.speechRate;
    label.textContent = AppState.speechRate.toFixed(2);

    slider.addEventListener('input', () => {
        let rate = parseFloat(slider.value);
        if (isNaN(rate)) return;
        rate = Math.min(2.0, Math.max(0.5, rate));
        AppState.speechRate = rate;
        localStorage.setItem('cefr_speech_rate', rate);
        label.textContent = rate.toFixed(2);
    });
}

/* =========================
   Level Pills
   ========================= */

function initLevelPills() {
    const pills = document.querySelectorAll('.level-btn');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const level = pill.dataset.level;
            if (!level) return;

            CEFRProgressionEngine.forceLevel(level);

            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            showAchievement(`Switched to ${level} content`);
            renderDashboard();
            refreshActiveTab();
        });
    });

    const current = CEFRProgressionEngine.getState().currentLevel;
    pills.forEach(p => {
        if (p.dataset.level === current) {
            p.classList.add('active');
        }
    });
}

/* =========================
   Tab Hover
   ========================= */

function enhanceTabPills() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            tab.classList.add('tab-hover');
        });

        tab.addEventListener('mouseleave', () => {
            tab.classList.remove('tab-hover');
        });
    });
}

/* =========================
   Daily Streak
   ========================= */

function updateDailyStreak() {
    CEFRProgressionEngine.updateStreak();
}

/* =========================
   LISTEN ENGINE
   ========================= */

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
        if (stopBtn) stopBtn.onclick = stopAll;
        if (pauseBtn) pauseBtn.onclick = pauseAll;
        if (resumeBtn) resumeBtn.onclick = resumeAll;

        loadAudio();
    }

    function loadAudio() {
        const words = document.querySelectorAll('.listen-word');
        audioElements = [];

        words.forEach(word => {
            const src = word.dataset.audio;
            if (!src) return;
            const audio = new Audio(src);
            audio.playbackRate = AppState.speechRate;
            audioElements.push(audio);
        });
    }

    async function playAll() {
        if (!audioElements.length) return;
        isPlayingAll = true;
        CEFRProgressionEngine.addXP('listen');
        updateDailyStreak();
        renderDashboard();

        for (const audio of audioElements) {
            if (!isPlayingAll) break;
            audio.playbackRate = AppState.speechRate;
            try {
                await audio.play();
            } catch (e) {
                console.warn('Audio play failed', e);
                continue;
            }
            await new Promise(res => audio.addEventListener('ended', res, { once: true }));
        }
        isPlayingAll = false;
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
        if (!audioElements.length) return;
        if (isPlayingAll) return;
        playAll();
    }

    return { init };
})();

/* =========================
   FLASHCARDS ENGINE
   ========================= */

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

        if (nextBtn) nextBtn.onclick = next;
        if (prevBtn) prevBtn.onclick = prev;
        if (flipBtn) flipBtn.onclick = flip;

        index = 0;
        render();
    }

    function getCards() {
        const cards = data[AppState.currentLevel] || [];
        if (index >= cards.length) index = 0;
        return cards;
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
        card.classList.remove('flipped');
    }

    function next() {
        const cards = getCards();
        if (!cards.length) return;
        index = (index + 1) % cards.length;
        render();
        CEFRProgressionEngine.addXP('flashcards');
        updateDailyStreak();
        renderDashboard();
    }

    function prev() {
        const cards = getCards();
        if (!cards.length) return;
        index = (index - 1 + cards.length) % cards.length;
        render();
    }

    function flip() {
        const card = document.getElementById('flashcard');
        if (!card) return;
        card.classList.toggle('flipped');
    }

    return { init };
})();

/* =========================
   QUIZ ENGINE
   ========================= */

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
        const questions = data[AppState.currentLevel] || [];
        return shuffleArray(questions.slice());
    }

    let currentQuestions = [];

    function renderQuestion() {
        const area = document.getElementById('quiz-area');
        if (!currentQuestions.length) {
            currentQuestions = getQuestions();
        }

        if (!currentQuestions.length) {
            area.innerHTML = `<p>No quiz available.</p>`;
            return;
        }

        const q = currentQuestions[index];

        area.innerHTML = `
            <div class="quiz-card">
                <h3>${q.q}</h3>
                ${q.options.map(opt => `
                    <button class="quiz-option" data-opt="${opt}">${opt}</button>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
                checkAnswer(btn.dataset.opt);
            };
        });
    }

    function checkAnswer(selected) {
        const q = currentQuestions[index];

        if (selected === q.a) {
            score++;
            showAchievement('Correct!');
        } else {
            showAchievement(`Incorrect. Correct answer: ${q.a}`);
        }

        index++;

        if (index >= currentQuestions.length) {
            finish();
        } else {
            renderQuestion();
        }
    }

    function finish() {
        const area = document.getElementById('quiz-area');
        const percent = Math.round((score / currentQuestions.length) * 100);

        CEFRProgressionEngine.recordQuizResult(AppState.currentLevel, percent);
        updateDailyStreak();
        renderDashboard();

        area.innerHTML = `
            <div class="quiz-card">
                <h3>Quiz Complete!</h3>
                <p>Your score: ${percent}%</p>
            </div>
        `;
        currentQuestions = [];
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    return { init };
})();

/* =========================
   SENTENCE BUILDER ENGINE
   ========================= */

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

        if (!levelData) {
            area.textContent = 'No sentence available.';
            return;
        }

        selected = [];

        const shuffled = levelData.words.slice().sort(() => Math.random() - 0.5);

        area.innerHTML = shuffled.map(w =>
            `<button class="builder-word" data-word="${w}">${w}</button>`
        ).join('');

        document.querySelectorAll('.builder-word').forEach(btn => {
            btn.onclick = () => {
                selected.push(btn.dataset.word);
                btn.disabled = true;
            };
        });

        const resultEl = document.getElementById('builder-result');
        if (resultEl) resultEl.textContent = '';
    }

    function checkSentence() {
        const levelData = data[AppState.currentLevel];
        const resultEl = document.getElementById('builder-result');

        if (!levelData || !resultEl) return;

        const userSentence = selected.join(' ');
        const correct = levelData.correct;

        const correctWords = correct.split(' ');
        const userWords = selected;

        let matches = 0;
        for (let i = 0; i < correctWords.length; i++) {
            if (userWords[i] === correctWords[i]) matches++;
        }
        const score = Math.round((matches / correctWords.length) * 100);

        CEFRProgressionEngine.recordBuilderResult(AppState.currentLevel, score);
        updateDailyStreak();
        renderDashboard();

        resultEl.textContent = `Score: ${score}%`;
        if (score === 100) {
            showAchievement('Perfect sentence!');
        } else {
            showAchievement(`Target: "${correct}"`);
        }
    }

    return { init };
})();

/* =========================
   CONVERSATION ENGINE
   ========================= */

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
        index = 0;
        renderPrompt();
    }

    function getPrompts() {
        const list = prompts[AppState.currentLevel] || [];
        if (index >= list.length) index = 0;
        return list;
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
        if (!list.length) return;

        index = (index + 1) % list.length;

        CEFRProgressionEngine.recordConversationPromptCompleted();
        updateDailyStreak();
        renderDashboard();

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

        renderCertificates();
    }

    function renderCertificates() {
        const area = document.getElementById('certificates-area');
        const state = CEFRProgressionEngine.getState();

        const levels = ['A1', 'A2', 'B1'];

        area.innerHTML = levels.map(level => {
            const mastery = CEFRProgressionEngine.getMasteryForLevel(level);
            const unlocked =
                state.currentLevel === level ||
                levels.indexOf(state.currentLevel) > levels.indexOf(level);

            const mastered = mastery >= (MASTER_REQUIREMENTS[level] || 0.8);

            return `
                <div class="certificate-card">
                    <h3>Certificate: ${level}</h3>
                    <p>Status: ${unlocked && mastered ? 'Unlocked' : 'Locked'}</p>
                    ${unlocked && mastered ? `<button class="primary-btn" data-level="${level}">Download</button>` : ''}
                </div>
            `;
        }).join('');

        area.querySelectorAll('.primary-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.dataset.level;
                showAchievement(`Certificate for ${level} ready to download (placeholder).`);
            });
        });
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

        renderBadges();
    }

    function renderBadges() {
        const list = document.getElementById('badge-list');
        const state = CEFRProgressionEngine.getState();

        const badges = [];

        const a1Mastery = CEFRProgressionEngine.getMasteryForLevel('A1');
        const a2Mastery = CEFRProgressionEngine.getMasteryForLevel('A2');
        const b1Mastery = CEFRProgressionEngine.getMasteryForLevel('B1');

        if (state.quizScores.length >= 5 && a1Mastery >= 0.8) badges.push('Quiz Master A1');
        if (state.builderScores.length >= 5 && a2Mastery >= 0.8) badges.push('Sentence Streak A2');
        if (state.conversationCount >= 10 && b1Mastery >= 0.8) badges.push('Conversation Explorer B1');
        if (state.streakDays >= 7) badges.push('7-Day Streak');
        if (state.xp >= 1000) badges.push('XP Champion');

        if (!badges.length) {
            list.innerHTML = `<li>No badges earned yet.</li>`;
            return;
        }

        list.innerHTML = badges.map(b => `<li>${b}</li>`).join('');
    }

    return { init };
})();

/* =========================
   Integration Layer
   ========================= */

function awardListenXP() {
    CEFRProgressionEngine.addXP('listen');
    updateDailyStreak();
    renderDashboard();
}

function awardFlashcardsXP() {
    CEFRProgressionEngine.addXP('flashcards');
    updateDailyStreak();
    renderDashboard();
}

function awardQuizXP(percent) {
    CEFRProgressionEngine.recordQuizResult(AppState.currentLevel, percent);
    updateDailyStreak();
    renderDashboard();
}

function awardBuilderXP(percent) {
    CEFRProgressionEngine.recordBuilderResult(AppState.currentLevel, percent);
    updateDailyStreak();
    renderDashboard();
}

function awardConversationXP() {
    CEFRProgressionEngine.recordConversationPromptCompleted();
    updateDailyStreak();
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

/* =========================
   Bootstrapping
   ========================= */

function initPart2() {
    initNameSaving();
    initSpeechRate();
    initLevelPills();
    enhanceTabPills();
    updateDailyStreak();
}

window.addEventListener('DOMContentLoaded', () => {
    CEFRProgressionEngine.load();
    initTabs();
    AppState.activeTab = 'dashboard';
    initPart2();
    renderDashboard();
    refreshActiveTab();
});
