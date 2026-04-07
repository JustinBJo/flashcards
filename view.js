/**
 * View Mode Implementation
 * Simple list display of all word pairs
 */

class ViewMode {
    constructor(wordlist, container) {
        this.wordlist = wordlist;
        this.container = container;
        this.pairs = wordlist.pairs;
    }
    
    start() {
        this.displayAllPairs();
    }
    
    displayAllPairs() {
        this.container.innerHTML = `
            <div class="question-card" style="max-width: 900px;">
                <h2 style="text-align: center; color: var(--primary); margin-bottom: 1rem;">📋 View Mode</h2>
                <p style="text-align: center; color: var(--text-light); margin-bottom: 2rem;">
                    All ${this.pairs.length} word pairs
                </p>
                
                <div class="view-mode-list">
                    <div class="view-mode-header">
                        <div class="view-mode-col-num">#</div>
                        <div class="view-mode-col-word">WORD</div>
                        <div class="view-mode-col-meaning">MEANING</div>
                    </div>
                    ${this.pairs.map((pair, index) => `
                        <div class="view-mode-row">
                            <div class="view-mode-col-num">${index + 1}</div>
                            <div class="view-mode-col-word">${pair.word}</div>
                            <div class="view-mode-col-arrow">→</div>
                            <div class="view-mode-col-meaning">${pair.meaning}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="action-buttons" style="margin-top: 2rem;">
                    <button onclick="app.showModeScreen()">
                        ← Back to Modes
                    </button>
                </div>
            </div>
        `;
        
        // Add keyboard listener for Enter and Escape
        this.keyHandler = (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                app.showModeScreen();
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }
    
    cleanup() {
        // Remove keyboard listener
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
        }
        // Clear the container content
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
