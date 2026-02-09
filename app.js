/**
 * Flashcard Learning Application - Main App
 * Handles navigation, wordlist management, and mode coordination
 */

class FlashcardApp {
    constructor() {
        this.wordlists = [];
        this.currentWordlist = null;
        this.currentMode = null;
        this.modeInstances = {
            memorize: null,
            learn: null,
            test: null
        };
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Flashcard App initialized');
        await this.loadWordlists();
        this.renderWordlists();
    }
    
    /**
     * Load all available wordlists from the wordlists directory
     */
    async loadWordlists() {
        try {
            // Since we're on GitHub Pages, we need to load wordlists dynamically
            // We'll create a manifest of available wordlists
            const wordlistFiles = [
                'dutch_A2_01.json', 'dutch_A2_02.json', 'dutch_A2_03.json',
                'dutch_A2_04.json', 'dutch_A2_05.json', 'dutch_A2_06.json',
                'dutch_A2_07.json', 'dutch_A2_08.json', 'dutch_A2_09.json',
                'dutch_A2_10.json', 'dutch_A2_11.json', 'dutch_A2_12.json',
                'dutch_A2_13.json', 'dutch_A2_14.json', 'dutch_A2_15.json',
                'dutch_A2_16.json', 'dutch_A2_17.json', 'dutch_A2_18.json',
                'dutch_A2_19.json', 'dutch_A2_20.json', 'dutch_A2_21.json',
                'dutch_A2_22.json', 'dutch_A2_23.json', 'dutch_A2_24.json',
                'dutch_A2_25.json', 'dutch_A2_26.json'
            ];
            
            this.wordlists = wordlistFiles.map(filename => ({
                filename,
                name: filename.replace('.json', '').replace(/_/g, ' ').toUpperCase()
            }));
            
        } catch (error) {
            console.error('Error loading wordlists:', error);
        }
    }
    
    /**
     * Render the wordlist selection screen
     */
    renderWordlists() {
        const container = document.getElementById('wordlist-list');
        
        if (this.wordlists.length === 0) {
            container.innerHTML = '<p class="info-text">No wordlists found. Please add JSON files to the wordlists directory.</p>';
            return;
        }
        
        container.innerHTML = this.wordlists.map((wordlist, index) => `
            <div class="card" onclick="app.selectWordlist(${index})">
                <h3>${wordlist.name}</h3>
                <p>Click to start learning</p>
            </div>
        `).join('');
    }
    
    /**
     * Select a wordlist and load its content
     */
    async selectWordlist(index) {
        const wordlist = this.wordlists[index];
        
        try {
            // Load the wordlist JSON file
            const response = await fetch(`./wordlists/${wordlist.filename}`);
            if (!response.ok) throw new Error('Failed to load wordlist');
            
            const data = await response.json();
            
            this.currentWordlist = {
                name: wordlist.name,
                filename: wordlist.filename,
                pairs: data.pairs || this.convertLegacyFormat(data)
            };
            
            this.showModeScreen();
            
        } catch (error) {
            console.error('Error loading wordlist:', error);
            
            // Check if it's a CORS error (file:// protocol)
            if (window.location.protocol === 'file:') {
                alert('⚠️ CORS Error: Cannot load files with file:// protocol.\n\n' +
                      'Please run a local server:\n\n' +
                      '1. Open terminal in the docs folder\n' +
                      '2. Run: python -m http.server 8000\n' +
                      '3. Visit: http://localhost:8000\n\n' +
                      'Or deploy to GitHub Pages for mobile access.');
            } else {
                alert('Failed to load wordlist. Please try again.');
            }
        }
    }
    
    /**
     * Convert legacy format {word: meaning} to new format {pairs: [{word, meaning}]}
     */
    convertLegacyFormat(data) {
        if (data.pairs) return data.pairs;
        
        return Object.entries(data).map(([word, meaning]) => ({
            word,
            meaning
        }));
    }
    
    /**
     * Show mode selection screen
     */
    showModeScreen() {
        document.getElementById('wordlist-screen').classList.remove('active');
        document.getElementById('mode-screen').classList.add('active');
        
        document.getElementById('wordlist-title').textContent = this.currentWordlist.name;
        document.getElementById('wordlist-info').textContent = 
            `${this.currentWordlist.pairs.length} word pairs`;
    }
    
    /**
     * Show wordlist selection screen
     */
    showWordlistScreen() {
        document.getElementById('mode-screen').classList.remove('active');
        document.getElementById('session-screen').classList.remove('active');
        document.getElementById('wordlist-screen').classList.add('active');
        
        // Clean up current mode
        if (this.currentMode && this.modeInstances[this.currentMode]) {
            this.modeInstances[this.currentMode].cleanup();
            this.modeInstances[this.currentMode] = null;
        }
        this.currentMode = null;
    }
    
    /**
     * Start a learning mode
     */
    startMode(mode) {
        this.currentMode = mode;
        
        // Show session screen
        document.getElementById('mode-screen').classList.remove('active');
        document.getElementById('session-screen').classList.add('active');
        
        // Initialize the appropriate mode
        const sessionContent = document.getElementById('session-content');
        sessionContent.innerHTML = '';
        
        switch(mode) {
            case 'memorize':
                this.modeInstances.memorize = new MemorizeMode(this.currentWordlist, sessionContent);
                this.modeInstances.memorize.start();
                break;
            case 'learn':
                this.modeInstances.learn = new LearnMode(this.currentWordlist, sessionContent);
                this.modeInstances.learn.start();
                break;
            case 'test':
                this.modeInstances.test = new TestMode(this.currentWordlist, sessionContent);
                this.modeInstances.test.start();
                break;
        }
    }
    
    /**
     * End the current session and return to mode selection
     */
    endSession() {
        const confirmEnd = confirm('Are you sure you want to end this session?');
        if (!confirmEnd) return;
        
        // Clean up current mode
        if (this.currentMode && this.modeInstances[this.currentMode]) {
            this.modeInstances[this.currentMode].cleanup();
            this.modeInstances[this.currentMode] = null;
        }
        
        // Return to mode selection
        document.getElementById('session-screen').classList.remove('active');
        document.getElementById('mode-screen').classList.add('active');
    }
}

/**
 * Utility function to shuffle an array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Utility function to normalize strings for comparison
 */
function normalizeString(str) {
    return str.trim().toLowerCase();
}

// Initialize the app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FlashcardApp();
});
