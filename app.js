// app-v2.js — Spanish CEFR Trainer core logic

// Assumes A1_WORDS, A2_WORDS, B1_WORDS, B2_WORDS are loaded globally from a1.json, a2.json, b1.json, b2.json

const CEFR_LEVELS = {
    A1: A1_WORDS,
    A2: A2_WORDS,
    B1: B1_WORDS,
    B2: B2_WORDS || []
};

const STORAGE_KEY = 'cefr_trainer_state_v1';

let appState = {
    currentLevel: 'A1',
    currentTab: 'listen',
    speechRate: 1.0,
    studentName: '',
    levelStats: {
        A1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        A2: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 },
        B1: { listens: 0, flashSeen: 0, quizScore: null, buildCompleted: 0 }
    },
    badges: []
};

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            appState = Object.assign(appState, parsed);
        }
    } catch (e) {
        console.error(e);
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error(e);
    }
}

function speakSpanish(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = appState.speechRate;
    window.speechSynthesis.speak(u);
}

function setLevel(level) {
    if (!CEFR_LEVELS[level]) return;
    appState.currentLevel = level;
    saveState();

    document.querySelectorAll('.level-btn').forEach(btn => {
        const lv = btn.getAttribute('data-level');
        btn.classList.toggle('active', lv === level);
    });

    renderCurrentTab();
    updateBadges();
}

function setTab(tab) {
    appState.currentTab = tab;
    saveState();

    // Dashboard buttons
    document.querySelectorAll('.dash-link').forEach(btn => {
        const t = btn.getAttribute('data-tab');
        btn.classList.toggle('active', t === tab);
    });

    // Nav bar buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const t = btn.getAttribute('data-tab');
        btn.classList.toggle('active', t === tab);
    });

    // Panels
    ['listen', 'flash', 'quiz', 'build', 'conversation', 'grammar'].forEach(id => {
        const panel = document.getElementById(id);
        if (!panel) return;
        if (id === tab) panel.classList.remove('hidden');
        else panel.classList.add('hidden');
    });

    renderCurrentTab();
}

function renderCurrentTab() {
    switch (appState.currentTab) {
        case 'listen':
            renderListenTab();
            break;
        case 'flash':
            renderFlashTab();
            break;
        case 'quiz':
            renderQuizTab();
            break;
        case 'build':
            renderBuildTab();
            break;
        case 'conversation':
            renderConversationTab();
            break;
        case 'grammar':
            renderGrammarTab();
            break;
    }
}

function groupByCategory(words) {
    const groups = {};
    words.forEach(w => {
        if (!groups[w.category]) groups[w.category] = [];
        groups[w.category].push(w);
    });
    return groups;
}

// LISTEN TAB
function renderListenTab() {
    const container = document.getElementById('listen');
    if (!container) return;

    const words = CEFR_LEVELS[appState.currentLevel] || [];
    const grouped = groupByCategory(words);

    let html = `<div class="glass-panel quiz-card">
        <h2>Listen — Level ${appState.currentLevel}</h2>
        <p>Tap a category, then click a word pill to hear it in Spanish.</p>
    </div>`;

    Object.keys(grouped).forEach(cat => {
        const list = grouped[cat];
        html += `
        <div class="glass-panel" style="max-width:700px;margin:12px auto;padding:12px;">
            <div class="listen-category-header" data-cat="${cat}">
                <span class="listen-category-title">${cat.toUpperCase()}</span>
                <span class="listen-arrow">▶</span>
            </div>
            <div class="listen-category-content" data-cat="${cat}">
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                    ${list.map(w => `
                        <button class="word-pill" data-spanish="${w.spanish}">
                            ${w.english} <span style="opacity:0.7;">(${w.spanish})</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // Collapsible handlers
    container.querySelectorAll('.listen-category-header').forEach(header => {
        header.addEventListener('click', () => {
            const cat = header.getAttribute('data-cat');
            const content = container.querySelector(`.listen-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector('.listen-arrow');
            if (!content || !arrow) return;
            const open = content.classList.toggle('open');
            arrow.classList.toggle('open', open);
        });
    });

    // Word pills
    container.querySelectorAll('.word-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-spanish');
            speakSpanish(text);
            const stats = appState.levelStats[appState.currentLevel];
            stats.listens += 1;
            saveState();
            updateBadges();
        });
    });
}

// FLASHCARDS TAB
let flashIndex = 0;

function renderFlashTab() {
    const container = document.getElementById('flash');
    if (!container) return;

    const words = CEFR_LEVELS[appState.currentLevel] || [];
    if (words.length === 0) {
        container.innerHTML = `<div class="glass-panel quiz-card"><p>No words loaded for this level.</p></div>`;
        return;
    }

    if (flashIndex >= words.length) flashIndex = 0;

    const current = words[flashIndex];

    const html = `
    <div class="quiz-card glass-panel">
        <h2>Flashcards — Level ${appState.currentLevel}</h2>
        <p>Click the card to flip between English and Spanish.</p>
    </div>
    <div class="glass-panel" style="max-width:500px;margin:16px auto;padding:16px;">
        <div class="flip-wrapper">
            <div id="flash-card" class="flip-card">
                <div class="flip-face flip-front" id="flash-front">
                    ${current.english}
                </div>
                <div class="flip-face flip-back" id="flash-back">
                    ${current.spanish}
                </div>
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:12px;">
            <button class="secondary-btn" id="flash-prev">Prev</button>
            <button class="secondary-btn" id="flash-next">Next</button>
            <button class="primary-btn" id="flash-play">Play Audio</button>
        </div>
    </div>`;

    container.innerHTML = html;

    const card = document.getElementById('flash-card');
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        const stats = appState.levelStats[appState.currentLevel];
        stats.flashSeen += 1;
        saveState();
        updateBadges();
    });

    document.getElementById('flash-prev').addEventListener('click', () => {
        flashIndex = (flashIndex - 1 + words.length) % words.length;
        renderFlashTab();
    });

    document.getElementById('flash-next').addEventListener('click', () => {
        flashIndex = (flashIndex + 1) % words.length;
        renderFlashTab();
    });

    document.getElementById('flash-play').addEventListener('click', () => {
        speakSpanish(current.spanish);
    });
}

// QUIZ TAB
function renderQuizTab() {
    const container = document.getElementById('quiz');
    if (!container) return;

    const words = CEFR_LEVELS[appState.currentLevel] || [];
    if (words.length < 4) {
        container.innerHTML = `<div class="glass-panel quiz-card"><p>Not enough words to generate a quiz for this level.</p></div>`;
        return;
    }

    // Build 5 questions or fewer if small set
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, Math.min(5, shuffled.length)).map((w, idx) => {
        const others = words.filter(o => o !== w);
        const distractors = others.sort(() => Math.random() - 0.5).slice(0, 2);
        const options = [...distractors, w].sort(() => Math.random() - 0.5);
        return {
            id: idx,
            english: w.english,
            correct: w.spanish,
            options: options.map(o => o.spanish)
        };
    });

    let html = `
    <div class="quiz-card glass-panel">
        <h2>Quiz — Level ${appState.currentLevel}</h2>
        <p>Select the correct Spanish translation for each English word.</p>
    </div>
    <form id="quiz-form" class="glass-panel quiz-card">`;

    questions.forEach(q => {
        html += `
        <div style="margin-bottom:16px;">
            <p><strong>${q.english}</strong></p>
            ${q.options.map(opt => `
                <label style="display:block;margin:4px 0;">
                    <input type="radio" name="q-${q.id}" value="${opt}"> ${opt}
                </label>
            `).join('')}
        </div>`;
    });

    html += `
        <button type="submit" class="primary-btn">Evaluate Quiz</button>
        <div id="quiz-result" style="margin-top:12px;font-weight:bold;"></div>
    </form>`;

    container.innerHTML = html;

    const form = document.getElementById('quiz-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        let correctCount = 0;

        questions.forEach(q => {
            const chosen = form.querySelector(`input[name="q-${q.id}"]:checked`);
            if (chosen && chosen.value === q.correct) correctCount++;
        });

        const total = questions.length;
        const percent = Math.round((correctCount / total) * 100);
        const resultDom = document.getElementById('quiz-result');
        resultDom.textContent = `Score: ${percent}% (${correctCount}/${total} correct).`;

        appState.levelStats[appState.currentLevel].quizScore = percent;
        saveState();
        updateBadges();
    });
}

// BUILD TAB — simple connector sentence builder
function renderBuildTab() {
    const container = document.getElementById('build');
    if (!container) return;

    const words = CEFR_LEVELS[appState.currentLevel] || [];
    if (words.length < 3) {
        container.innerHTML = `<div class="glass-panel build-card"><p>Not enough words to build sentences for this level.</p></div>`;
        return;
    }

    // Pick two random words and build a simple "X and Y" pattern
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const w1 = shuffled[0];
    const w2 = shuffled[1];
    const connector = 'y';

    const correctTokens = [w1.spanish, connector, w2.spanish];
    const scrambled = [...correctTokens].sort(() => Math.random() - 0.5);

    let html = `
    <div class="glass-panel build-card">
        <h2>Build — Level ${appState.currentLevel}</h2>
        <p>Click the tokens in order to build the correct Spanish sentence.</p>
        <p style="margin-top:8px;">Target concept: <strong>${w1.english} and ${w2.english}</strong></p>
        <div id="build-target" style="min-height:40px;border:1px dashed rgba(148,163,184,0.6);border-radius:12px;padding:8px;margin-top:8px;">
            <span style="opacity:0.6;font-size:13px;">Your sentence will appear here...</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;" id="build-bank">
            ${scrambled.map((tok, idx) => `
                <button class="secondary-btn" data-idx="${idx}" data-token="${tok}">${tok}</button>
            `).join('')}
        </div>
        <button class="primary-btn" id="build-check" style="margin-top:12px;">Check Sentence</button>
        <div id="build-result" style="margin-top:10px;font-weight:bold;"></div>
    </div>`;

    container.innerHTML = html;

    const selected = [];
    const targetBox = document.getElementById('build-target');
    const bank = document.getElementById('build-bank');
    const resultDom = document.getElementById('build-result');

    bank.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const tok = btn.getAttribute('data-token');
            if (btn.disabled) return;
            btn.disabled = true;
            btn.style.opacity = '0.5';
            selected.push(tok);
            targetBox.innerHTML = selected.map(t => `<span style="margin-right:6px;">${t}</span>`).join('');
        });
    });

    document.getElementById('build-check').addEventListener('click', () => {
        const userSentence = selected.join(' ').trim().toLowerCase();
        const correctSentence = correctTokens.join(' ').trim().toLowerCase();
        if (userSentence === correctSentence) {
            resultDom.textContent = '✅ Correct! Nice structure.';
            appState.levelStats[appState.currentLevel].buildCompleted += 1;
        } else {
            resultDom.textContent = `❌ Not quite. Correct answer: "${correctSentence}".`;
        }
        saveState();
        updateBadges();
    });
}

// CONVERSATION TAB — simple prompts
function renderConversationTab() {
    const container = document.getElementById('conversation');
    if (!container) return;

    const words = CEFR_LEVELS[appState.currentLevel] || [];
    const connectors = words.filter(w => w.category === 'connector').slice(0, 6);
    const core = words.filter(w => w.category === 'core').slice(0, 6);

    let html = `
    <div class="glass-panel quiz-card">
        <h2>Conversation — Level ${appState.currentLevel}</h2>
        <p>Use these prompts to practice speaking out loud. Combine connectors and core phrases.</p>
    </div>
    <div class="glass-panel quiz-card">
        <h3>Connectors</h3>
        <ul style="list-style:none;padding-left:0;">${connectors.map(c => `<li>${c.english} → <strong>${c.spanish}</strong></li>`).join('')}</ul>
        <h3 style="margin-top:12px;">Core phrases</h3>
        <ul style="list-style:none;padding-left:0;">${core.map(c => `<li>${c.english} → <strong>${c.spanish}</strong></li>`).join('')}</ul>
        <p style="margin-top:12px;font-size:14px;opacity:0.8;">Try to build 3–5 sentences mixing these items and say them aloud.</p>
    </div>`;

    container.innerHTML = html;
}

// GRAMMAR TAB — simple overview
function renderGrammarTab() {
    const container = document.getElementById('grammar');
    if (!container) return;

    const words = CEFR_LEVELS[appState.currentLevel] || [];
    const counts = groupByCategory(words);

    let html = `
    <div class="glass-panel quiz-card">
        <h2>Grammar Overview — Level ${appState.currentLevel}</h2>
        <p>Quick breakdown of word types you are training.</p>
    </div>
    <div class="glass-panel quiz-card">
        <ul style="list-style:none;padding-left:0;">`;

    Object.keys(counts).forEach(cat => {
        html += `<li><strong>${cat}</strong>: ${counts[cat].length} items</li>`;
    });

    html += `</ul>
        <p style="margin-top:10px;font-size:14px;opacity:0.8;">Notice how connectors, verbs, adjectives, and numbers combine to form full sentences.</p>
    </div>`;

    container.innerHTML = html;
}

// BADGES
function updateBadges() {
    const list = document.getElementById('badge-list');
    if (!list) return;

    const badges = new Set(appState.badges);

    Object.keys(appState.levelStats).forEach(level => {
        const stats = appState.levelStats[level];

        if (stats.listens >= 20) badges.add(`${level}-listener`);
        if (stats.flashSeen >= 30) badges.add(`${level}-flash-master`);
        if (stats.quizScore !== null && stats.quizScore >= 80) badges.add(`${level}-quiz-ace`);
        if (stats.buildCompleted >= 10) badges.add(`${level}-builder`);
    });

    appState.badges = Array.from(badges);
    saveState();

    if (appState.badges.length === 0) {
        list.innerHTML = `<li>No badges yet. Keep training!</li>`;
        return;
    }

    list.innerHTML = appState.badges.map(b => `<li>${b}</li>`).join('');
}

// STUDENT NAME
function initNameBox() {
    const input = document.getElementById('student-name');
    const btn = document.getElementById('save-name-btn');
    const status = document.getElementById('name-status');

    if (!input || !btn || !status) return;

    input.value = appState.studentName || '';

    btn.addEventListener('click', () => {
        const name = input.value.trim();
        if (!name) {
            status.textContent = 'Please enter a name.';
            return;
        }
        appState.studentName = name;
        saveState();
        status.textContent = `Saved as "${name}". This will appear on certificates.`;
    });
}

// RATE CONTROL
function initRateControl() {
    const slider = document.getElementById('rate');
    if (!slider) return;

    slider.value = appState.speechRate.toString();
    slider.addEventListener('input', () => {
        appState.speechRate = parseFloat(slider.value);
        saveState();
    });
}

// DASHBOARD & NAV wiring
function initNavigation() {
    document.querySelectorAll('.dash-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            setTab(tab);
        });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            setTab(tab);
        });
    });

    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.getAttribute('data-level');
            setLevel(level);
        });
    });
}

// STARTUP
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initNavigation();
    initRateControl();
    initNameBox();

    // Restore level & tab
    setLevel(appState.currentLevel);
    setTab(appState.currentTab);
    updateBadges();
});
