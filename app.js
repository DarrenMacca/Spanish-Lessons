/* ============================================================
   DICTIONARY SEARCH INITIALIZER SYSTEM (BILINGUAL MODE)
   ============================================================ */

function initDictionarySearch() {
    const searchInput = document.getElementById("dict-search-input");
    const resultBox = document.getElementById("dict-search-result");

    if (!searchInput || !resultBox) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
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
               SMART PHRASE SPLITTING — detect sub‑phrases inside sentences
            ============================================================ */
            const words = query.toLowerCase().split(/\s+/);

            if (words.length > 1) {

                for (let start = 0; start < words.length; start++) {
                    for (let end = words.length; end > start; end--) {

                        const subPhrase = words.slice(start, end).join(" ");

                        let subResult = null;

                        // PRIORITY: CEFR_PHRASES FIRST
                        if (Array.isArray(CEFR_PHRASES)) {
                            const phraseHit = CEFR_PHRASES.find(p =>
                                p.english && p.english.toLowerCase() === subPhrase
                            );
                            if (phraseHit) {
                                subResult = { spanish: phraseHit.spanish, level: phraseHit.level || "GLOBAL", source: "CEFR Phrases" };
                            }
                        }

                        // FALLBACK: globalLookup
                        if (!subResult) {
                            subResult = globalLookup(subPhrase);
                        }

                        // If ANY match found
                        if (subResult) {
                            const before = words.slice(0, start).join(" ");
                            const after  = words.slice(end).join(" ");

                            const finalSpanish = [
                                before,
                                normalizeSpanish(subResult.spanish),
                                after
                            ].join(" ").trim();

                            resultBox.innerHTML = `
                                <div style="padding: 10px; background: rgba(74, 222, 128, 0.1);
                                            border: 1px solid rgba(74, 222, 128, 0.3);
                                            border-radius: 10px; margin-top: 5px;">
                                    <span style="color: #a5f3fc; font-weight: bold;">Spanish:</span>
                                    <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600;">
                                        ${finalSpanish}
                                    </span>
                                    <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                                        Smart phrase mode — matched: "${subPhrase}"
                                    </div>
                                </div>
                            `;
                            return;
                        }
                    }
                }

                /* ============================================================
                   FALLBACK — word‑by‑word translation
                ============================================================ */
                const translatedWords = [];
                const unknownWords = [];

                for (const word of words) {
                    const result = globalLookup(word);
                    if (result) {
                        translatedWords.push(normalizeSpanish(result.spanish));
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
               SINGLE‑WORD LOOKUP (only if no phrase splitting)
            ============================================================ */
            const phraseResult = globalLookup(query.toLowerCase());
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
        }

        /* ============================================================
           2. SPANISH → ENGLISH
        ============================================================ */
        if (lang === "spanish") {

            const englishResult = globalLookupSpanish(query);
            if (englishResult && englishResult !== "[Unknown translation]") {
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

            const spanishWords = query.split(/\s+/);
            if (spanishWords.length > 1) {
                const translatedWords = [];
                const unknownWords = [];

                for (const word of spanishWords) {
                    const result = globalLookupSpanish(word);
                    if (result && result !== "[Unknown translation]") {
                        translatedWords.push(result);
                    } else {
                        unknownWords.push(word);
                        translatedWords.push(`[${word}]`);
                    }
                }

                const englishSentence = translatedWords.join(" ");

                resultBox.innerHTML = `
                    <div style="padding: 10px; background: rgba(74, 222, 128, 0.1);
                                border: 1px solid rgba(74, 222, 128, 0.3);
                                border-radius: 10px; margin-top: 5px;">
                        <span style="color: #a5f3fc; font-weight: bold;">English:</span>
                        <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600;">
                            ${englishSentence}
                        </span>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.4);">
                            Sentence mode — ${unknownWords.length === 0 ? "all words found" : "missing: " + unknownWords.join(", ")}
                        </div>
                    </div>
                `;
                return;
            }
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





