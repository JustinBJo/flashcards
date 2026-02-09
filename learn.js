/**
 * Learn Mode Implementation
 * Practice mode with immediate feedback
 */

class LearnMode {
    constructor(wordlist, container) {
        this.wordlist = wordlist;
        this.container = container;
        this.pairs = shuffleArray([...wordlist.pairs]);
        this.currentIndex = 0;
        this.correct = 0;
        this.incorrect = 0;
    }
    
    start() {
        this.showQuestion();
    }
    
    showQuestion() {
        if (this.currentIndex >= this.pairs.length) {
            this.showSummary();
            return;
        }
        
        const pair = this.pairs[this.currentIndex];
        const isWordToMeaning = Math.random() < 0.5;
        
        this.container.innerHTML = `
            <div class="progress-section">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.currentIndex / this.pairs.length) * 100}%"></div>
                </div>
                <div class="progress-stats">
                    <div class="stat">
                        <div class="stat-value">${this.currentIndex + 1}</div>
                        <div class="stat-label">of ${this.pairs.length}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="color: var(--success)">${this.correct}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" style="color: var(--error)">${this.incorrect}</div>
                        <div class="stat-label">Incorrect</div>
                    </div>
                </div>
            </div>
            
            <div class="question-card">
                <div class="question-header">
                    <span>Question ${this.currentIndex + 1}/${this.pairs.length}</span>
                    <span class="stage-badge">${isWordToMeaning ? 'Word → Meaning' : 'Meaning → Word'}</span>
                </div>
                
                <div class="question-text">
                    ${isWordToMeaning ? pair.word : pair.meaning}
                </div>
                
                <div class="input-group">
                    <label class="input-label">Your answer:</label>
                    <input type="text" id="input-answer" autocomplete="off" autofocus>
                </div>
                
                <div id="feedback-area"></div>
                
                <div class="action-buttons">
                    <button onclick="app.modeInstances.learn.checkAnswer(${isWordToMeaning})">
                        Check Answer
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('input-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer(isWordToMeaning);
        });
    }
    
    checkAnswer(isWordToMeaning) {
        const pair = this.pairs[this.currentIndex];
        const correctAnswer = isWordToMeaning ? pair.meaning : pair.word;
        const userAnswer = document.getElementById('input-answer').value;
        const feedbackArea = document.getElementById('feedback-area');
        
        const isCorrect = normalizeString(userAnswer) === normalizeString(correctAnswer);
        
        if (isCorrect) {
            this.correct++;
            feedbackArea.innerHTML = '<div class="feedback correct">✓ Correct! Well done!</div>';
        } else {
            this.incorrect++;
            feedbackArea.innerHTML = `
                <div class="feedback incorrect">
                    ✗ Incorrect. The correct answer is: <strong>${correctAnswer}</strong>
                </div>
            `;
        }
        
        // Disable input and show next button
        document.getElementById('input-answer').disabled = true;
        const actionButtons = document.querySelector('.action-buttons');
        actionButtons.innerHTML = `
            <button onclick="app.modeInstances.learn.nextQuestion()">
                ${this.currentIndex < this.pairs.length - 1 ? 'Next Question' : 'See Results'}
            </button>
        `;
    }
    
    nextQuestion() {
        this.currentIndex++;
        this.showQuestion();
    }
    
    showSummary() {
        const percentage = ((this.correct / this.pairs.length) * 100).toFixed(1);
        const passed = percentage >= 70;
        
        this.container.innerHTML = `
            <div class="success-message">
                <div class="success-icon">${passed ? '🎉' : '📚'}</div>
                <h2>Session Complete!</h2>
                
                <div class="progress-section" style="margin: 2rem auto; max-width: 400px;">
                    <div class="progress-stats">
                        <div class="stat">
                            <div class="stat-value" style="color: var(--success)">${this.correct}</div>
                            <div class="stat-label">Correct</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" style="color: var(--error)">${this.incorrect}</div>
                            <div class="stat-label">Incorrect</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${percentage}%</div>
                            <div class="stat-label">Score</div>
                        </div>
                    </div>
                </div>
                
                <p>${passed ? 
                    'Great job! You\'re mastering these words!' : 
                    'Keep practicing! You\'re making progress!'
                }</p>
                
                <div class="action-buttons">
                    <button onclick="app.startMode('learn')">Practice Again</button>
                    <button class="btn-secondary" onclick="app.showModeScreen()">Back to Modes</button>
                </div>
            </div>
        `;
    }
    
    cleanup() {
        // Cleanup if needed
    }
}
