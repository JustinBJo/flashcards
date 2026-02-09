/**
 * Memorize Mode Implementation
 * Three-stage learning system with progressive word introduction
 */

class MemorizeMode {
    constructor(wordlist, container) {
        this.wordlist = wordlist;
        this.container = container;
        this.pairs = wordlist.pairs;
        
        // Stage constants
        this.STAGE_TYPE_BOTH = 1;
        this.STAGE_WORD_TO_MEANING = 2;
        this.STAGE_MEANING_TO_WORD = 3;
        
        // Track progress for each word (word_index -> current_stage)
        // Stage 0 = not started, 1-3 = in progress, 4 = completed
        this.wordStages = {};
        for (let i = 0; i < this.pairs.length; i++) {
            this.wordStages[i] = 0;
        }
        
        // Track which words are in the active pool
        this.wordsInPool = new Set();
        
        // Track words not yet introduced
        this.wordsNotYetIntroduced = new Set([...Array(this.pairs.length).keys()]);
        
        // Current state
        this.runNumber = 1;
        this.lastQuestion = null;
        this.currentQuestionIndex = 0;
        this.currentRunQuestions = [];
    }
    
    start() {
        this.showIntroduction();
    }
    
    showIntroduction() {
        this.container.innerHTML = `
            <div class="question-card">
                <h2 style="text-align: center; color: var(--primary);">🧠 Memorize Mode</h2>
                <div style="text-align: center; margin: 2rem 0;">
                    <p style="margin-bottom: 1rem;">This mode helps you fully memorize all words.</p>
                    <p style="margin-bottom: 1rem;"><strong>Each word has 3 stages:</strong></p>
                    <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                        <p>1️⃣ Type both word and meaning</p>
                        <p>2️⃣ See word → type meaning</p>
                        <p>3️⃣ See meaning → type word</p>
                    </div>
                    <p style="margin-top: 1.5rem;">Answer all questions correctly to complete!</p>
                </div>
                <div class="action-buttons">
                    <button onclick="app.modeInstances.memorize.startMemorizationLoop()">
                        Start Learning
                    </button>
                </div>
            </div>
        `;
    }
    
    startMemorizationLoop() {
        this.addNewWordsToPool();
        this.prepareRunQuestions();
        this.showRunHeader();
        this.askNextQuestion();
    }
    
    addNewWordsToPool() {
        // Add up to 10 new words to the pool
        const wordsToAdd = Math.min(10, this.wordsNotYetIntroduced.size);
        
        if (wordsToAdd > 0) {
            const notIntroducedArray = Array.from(this.wordsNotYetIntroduced);
            const shuffled = shuffleArray(notIntroducedArray);
            
            for (let i = 0; i < wordsToAdd; i++) {
                const wordIdx = shuffled[i];
                this.wordsInPool.add(wordIdx);
                this.wordStages[wordIdx] = 1; // Start at stage 1
                this.wordsNotYetIntroduced.delete(wordIdx);
            }
        }
    }
    
    prepareRunQuestions() {
        if (this.wordsInPool.size === 0) {
            this.currentRunQuestions = [];
            return;
        }
        
        // Generate questions from all words in pool
        const allQuestions = Array.from(this.wordsInPool).map(wordIdx => ({
            wordIdx,
            stage: this.wordStages[wordIdx]
        }));
        
        // Shuffle
        const shuffled = shuffleArray(allQuestions);
        
        // Take up to 10 questions
        const numQuestions = Math.min(10, shuffled.length);
        this.currentRunQuestions = shuffled.slice(0, numQuestions);
        
        // Avoid immediate repetition
        if (this.lastQuestion && this.currentRunQuestions.length > 1) {
            const firstQ = this.currentRunQuestions[0];
            if (firstQ.wordIdx === this.lastQuestion.wordIdx && 
                firstQ.stage === this.lastQuestion.stage) {
                // Swap first and second
                [this.currentRunQuestions[0], this.currentRunQuestions[1]] = 
                [this.currentRunQuestions[1], this.currentRunQuestions[0]];
            }
        }
        
        this.currentQuestionIndex = 0;
    }
    
    showRunHeader() {
        this.container.innerHTML = `
            <div class="run-header">
                <h2>Run ${this.runNumber}</h2>
                <p>${this.currentRunQuestions.length} questions in this run</p>
            </div>
            <div id="question-container"></div>
        `;
    }
    
    askNextQuestion() {
        if (this.currentQuestionIndex >= this.currentRunQuestions.length) {
            this.finishRun();
            return;
        }
        
        const question = this.currentRunQuestions[this.currentQuestionIndex];
        const pair = this.pairs[question.wordIdx];
        
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = '';
        
        switch(question.stage) {
            case this.STAGE_TYPE_BOTH:
                this.renderStageTypeBoth(questionContainer, pair, question);
                break;
            case this.STAGE_WORD_TO_MEANING:
                this.renderStageWordToMeaning(questionContainer, pair, question);
                break;
            case this.STAGE_MEANING_TO_WORD:
                this.renderStageMeaningToWord(questionContainer, pair, question);
                break;
        }
    }
    
    renderStageTypeBoth(container, pair, question) {
        container.innerHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span>Question ${this.currentQuestionIndex + 1}/${this.currentRunQuestions.length}</span>
                    <span class="stage-badge">Stage 1: Type Both</span>
                </div>
                
                <div style="background: #e3f2fd; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <p style="margin-bottom: 0.5rem;"><strong>Word:</strong> ${pair.word}</p>
                    <p><strong>Meaning:</strong> ${pair.meaning}</p>
                </div>
                
                <p style="margin-bottom: 1rem; color: var(--text-light);">
                    Please type both to memorize them:
                </p>
                
                <div class="input-group">
                    <label class="input-label">Type the word:</label>
                    <input type="text" id="input-word" autocomplete="off" autofocus>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Type the meaning:</label>
                    <input type="text" id="input-meaning" autocomplete="off">
                </div>
                
                <div id="feedback-area"></div>
                
                <div class="action-buttons">
                    <button onclick="app.modeInstances.memorize.checkStageTypeBoth(${question.wordIdx}, '${pair.word}', '${pair.meaning.replace(/'/g, "\\'")}')">
                        Check Answer
                    </button>
                </div>
            </div>
        `;
        
        // Add Enter key support
        document.getElementById('input-word').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('input-meaning').focus();
        });
        document.getElementById('input-meaning').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkStageTypeBoth(question.wordIdx, pair.word, pair.meaning);
        });
    }
    
    renderStageWordToMeaning(container, pair, question) {
        container.innerHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span>Question ${this.currentQuestionIndex + 1}/${this.currentRunQuestions.length}</span>
                    <span class="stage-badge">Stage 2: Word → Meaning</span>
                </div>
                
                <div class="question-text">
                    ${pair.word}
                </div>
                
                <div class="input-group">
                    <label class="input-label">Type the meaning:</label>
                    <input type="text" id="input-answer" autocomplete="off" autofocus>
                </div>
                
                <div id="feedback-area"></div>
                
                <div class="action-buttons">
                    <button onclick="app.modeInstances.memorize.checkAnswer(${question.wordIdx}, '${pair.meaning.replace(/'/g, "\\'")}')">
                        Check Answer
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('input-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer(question.wordIdx, pair.meaning);
        });
    }
    
    renderStageMeaningToWord(container, pair, question) {
        container.innerHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span>Question ${this.currentQuestionIndex + 1}/${this.currentRunQuestions.length}</span>
                    <span class="stage-badge">Stage 3: Meaning → Word</span>
                </div>
                
                <div class="question-text">
                    ${pair.meaning}
                </div>
                
                <div class="input-group">
                    <label class="input-label">Type the word:</label>
                    <input type="text" id="input-answer" autocomplete="off" autofocus>
                </div>
                
                <div id="feedback-area"></div>
                
                <div class="action-buttons">
                    <button onclick="app.modeInstances.memorize.checkAnswer(${question.wordIdx}, '${pair.word.replace(/'/g, "\\'")}')">
                        Check Answer
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('input-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer(question.wordIdx, pair.word);
        });
    }
    
    checkStageTypeBoth(wordIdx, correctWord, correctMeaning) {
        const userWord = document.getElementById('input-word').value;
        const userMeaning = document.getElementById('input-meaning').value;
        
        const wordCorrect = userWord === correctWord;
        const meaningCorrect = userMeaning === correctMeaning;
        
        const feedbackArea = document.getElementById('feedback-area');
        
        if (wordCorrect && meaningCorrect) {
            feedbackArea.innerHTML = '<div class="feedback correct">✓ Perfect! Both correct!</div>';
            this.wordStages[wordIdx] = 2; // Move to stage 2
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            let message = '✗ Not quite right.<br>';
            if (!wordCorrect) message += `Word should be: <strong>${correctWord}</strong><br>`;
            if (!meaningCorrect) message += `Meaning should be: <strong>${correctMeaning}</strong>`;
            
            feedbackArea.innerHTML = `<div class="feedback incorrect">${message}</div>`;
            this.lastQuestion = { wordIdx, stage: this.STAGE_TYPE_BOTH };
            setTimeout(() => this.nextQuestion(), 2000);
        }
    }
    
    checkAnswer(wordIdx, correctAnswer) {
        const userAnswer = document.getElementById('input-answer').value;
        const feedbackArea = document.getElementById('feedback-area');
        
        const currentStage = this.wordStages[wordIdx];
        
        if (normalizeString(userAnswer) === normalizeString(correctAnswer)) {
            feedbackArea.innerHTML = '<div class="feedback correct">✓ Correct!</div>';
            
            if (currentStage === this.STAGE_MEANING_TO_WORD) {
                // Completed all stages
                this.wordStages[wordIdx] = 4;
                this.wordsInPool.delete(wordIdx);
            } else {
                // Move to next stage
                this.wordStages[wordIdx] = currentStage + 1;
            }
            
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            feedbackArea.innerHTML = `<div class="feedback incorrect">✗ Incorrect. The correct answer is: <strong>${correctAnswer}</strong></div>`;
            this.lastQuestion = { wordIdx, stage: currentStage };
            setTimeout(() => this.nextQuestion(), 2000);
        }
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.askNextQuestion();
    }
    
    finishRun() {
        this.displayProgress();
    }
    
    displayProgress() {
        const totalWords = this.pairs.length;
        const memorizedCount = Object.values(this.wordStages).filter(stage => stage === 4).length;
        const percentage = ((memorizedCount / totalWords) * 100).toFixed(1);
        
        // Count words at each stage
        const stage1Count = Object.values(this.wordStages).filter(s => s === 1).length;
        const stage2Count = Object.values(this.wordStages).filter(s => s === 2).length;
        const stage3Count = Object.values(this.wordStages).filter(s => s === 3).length;
        
        const allComplete = this.wordsInPool.size === 0 && this.wordsNotYetIntroduced.size === 0;
        
        if (allComplete) {
            this.container.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">🎉</div>
                    <h2>Congratulations!</h2>
                    <p>You have successfully memorized all ${totalWords} words!</p>
                    <div class="action-buttons">
                        <button onclick="app.showModeScreen()">Back to Modes</button>
                    </div>
                </div>
            `;
        } else {
            this.container.innerHTML = `
                <div class="progress-section">
                    <h2 style="text-align: center;">Progress Report</h2>
                    
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    
                    <div class="progress-stats">
                        <div class="stat">
                            <div class="stat-value">${memorizedCount}</div>
                            <div class="stat-label">Memorized</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${totalWords}</div>
                            <div class="stat-label">Total Words</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${percentage}%</div>
                            <div class="stat-label">Complete</div>
                        </div>
                    </div>
                    
                    ${memorizedCount < totalWords ? `
                        <div style="margin-top: 1.5rem;">
                            <h3 style="font-size: 1rem; margin-bottom: 0.5rem;">Words by stage:</h3>
                            <p>Stage 1 (Type both): ${stage1Count}</p>
                            <p>Stage 2 (Word→Meaning): ${stage2Count}</p>
                            <p>Stage 3 (Meaning→Word): ${stage3Count}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="action-buttons" style="margin-top: 1.5rem;">
                    <button onclick="app.modeInstances.memorize.continueToNextRun()">
                        Continue to Next Run
                    </button>
                    <button class="btn-secondary" onclick="app.showModeScreen()">
                        End Session
                    </button>
                </div>
            `;
        }
    }
    
    continueToNextRun() {
        this.runNumber++;
        this.startMemorizationLoop();
    }
    
    cleanup() {
        // Cleanup if needed
    }
}
