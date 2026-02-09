/**
 * Test Mode Implementation
 * Scored assessment with final results
 */

class TestMode {
    constructor(wordlist, container) {
        this.wordlist = wordlist;
        this.container = container;
        this.pairs = shuffleArray([...wordlist.pairs]);
        this.currentIndex = 0;
        this.results = []; // Store {pair, userAnswer, correct}
    }
    
    start() {
        this.showIntroduction();
    }
    
    showIntroduction() {
        this.container.innerHTML = `
            <div class="question-card">
                <h2 style="text-align: center; color: var(--primary);">✍️ Test Mode</h2>
                <div style="text-align: center; margin: 2rem 0;">
                    <p style="margin-bottom: 1rem;">Test your knowledge with ${this.pairs.length} questions.</p>
                    <p style="margin-bottom: 1rem;">Your answers will be scored at the end.</p>
                    <p><strong>Good luck!</strong></p>
                </div>
                <div class="action-buttons">
                    <button onclick="app.modeInstances.test.showQuestion()">
                        Start Test
                    </button>
                </div>
            </div>
        `;
    }
    
    showQuestion() {
        if (this.currentIndex >= this.pairs.length) {
            this.showResults();
            return;
        }
        
        const pair = this.pairs[this.currentIndex];
        const isWordToMeaning = Math.random() < 0.5;
        
        this.container.innerHTML = `
            <div class="progress-section">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.currentIndex / this.pairs.length) * 100}%"></div>
                </div>
                <p style="text-align: center; color: var(--text-light); margin-top: 0.5rem;">
                    Question ${this.currentIndex + 1} of ${this.pairs.length}
                </p>
            </div>
            
            <div class="question-card">
                <div class="question-header">
                    <span>Question ${this.currentIndex + 1}</span>
                    <span class="stage-badge">${isWordToMeaning ? 'Word → Meaning' : 'Meaning → Word'}</span>
                </div>
                
                <div class="question-text">
                    ${isWordToMeaning ? pair.word : pair.meaning}
                </div>
                
                <div class="input-group">
                    <label class="input-label">Your answer:</label>
                    <input type="text" id="input-answer" autocomplete="off" autofocus>
                </div>
                
                <div class="action-buttons">
                    <button onclick="app.modeInstances.test.submitAnswer(${isWordToMeaning})">
                        ${this.currentIndex < this.pairs.length - 1 ? 'Next Question' : 'Finish Test'}
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('input-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAnswer(isWordToMeaning);
        });
    }
    
    submitAnswer(isWordToMeaning) {
        const pair = this.pairs[this.currentIndex];
        const correctAnswer = isWordToMeaning ? pair.meaning : pair.word;
        const userAnswer = document.getElementById('input-answer').value.trim();
        
        const isCorrect = normalizeString(userAnswer) === normalizeString(correctAnswer);
        
        this.results.push({
            pair,
            userAnswer,
            correctAnswer,
            correct: isCorrect,
            direction: isWordToMeaning ? 'word→meaning' : 'meaning→word'
        });
        
        this.currentIndex++;
        this.showQuestion();
    }
    
    showResults() {
        const correctCount = this.results.filter(r => r.correct).length;
        const totalCount = this.results.length;
        const percentage = ((correctCount / totalCount) * 100).toFixed(1);
        const passed = percentage >= 70;
        
        let grade;
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';
        else grade = 'F';
        
        const incorrectResults = this.results.filter(r => !r.correct);
        
        this.container.innerHTML = `
            <div class="success-message">
                <div class="success-icon">${passed ? '🎉' : '📖'}</div>
                <h2>Test Complete!</h2>
                
                <div class="progress-section" style="margin: 2rem auto; max-width: 500px;">
                    <div class="progress-stats">
                        <div class="stat">
                            <div class="stat-value" style="color: var(--success)">${correctCount}</div>
                            <div class="stat-label">Correct</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" style="color: var(--error)">${totalCount - correctCount}</div>
                            <div class="stat-label">Incorrect</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${percentage}%</div>
                            <div class="stat-label">Score</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" style="color: ${passed ? 'var(--success)' : 'var(--error)'}">
                                ${grade}
                            </div>
                            <div class="stat-label">Grade</div>
                        </div>
                    </div>
                    
                    <div class="progress-bar" style="margin-top: 1rem;">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                
                <p style="margin-bottom: 2rem;">
                    ${passed ? 
                        'Excellent work! You passed the test!' : 
                        'Keep studying and try again!'
                    }
                </p>
                
                ${incorrectResults.length > 0 ? `
                    <div class="question-card" style="text-align: left; max-width: 600px; margin: 0 auto 2rem;">
                        <h3 style="color: var(--error); margin-bottom: 1rem;">
                            Review Missed Questions (${incorrectResults.length})
                        </h3>
                        ${incorrectResults.map((result, index) => `
                            <div style="padding: 1rem; background: var(--bg); border-radius: 8px; margin-bottom: 1rem;">
                                <p style="font-weight: 600; margin-bottom: 0.5rem;">
                                    ${result.direction === 'word→meaning' ? result.pair.word : result.pair.meaning}
                                </p>
                                <p style="color: var(--error);">
                                    Your answer: <span style="text-decoration: line-through;">${result.userAnswer || '(empty)'}</span>
                                </p>
                                <p style="color: var(--success);">
                                    Correct answer: <strong>${result.correctAnswer}</strong>
                                </p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="action-buttons">
                    <button onclick="app.startMode('test')">Take Test Again</button>
                    <button class="btn-secondary" onclick="app.showModeScreen()">Back to Modes</button>
                </div>
            </div>
        `;
    }
    
    cleanup() {
        // Cleanup if needed
    }
}
