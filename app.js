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
        
        // Detect base path for GitHub Pages
        this.basePath = this.getBasePath();
        
        // Directory navigation
        this.currentPath = [];
        this.wordlistStructure = null;
        
        this.init();
    }
    
    /**
     * Get the base path for the application
     * Handles both local development and GitHub Pages deployment
     */
    getBasePath() {
        // For GitHub Pages, use the repository path
        // For local dev, use current directory
        const path = window.location.pathname;
        
        // If we're on GitHub Pages (username.github.io/repo-name/)
        // Extract the base path
        if (window.location.hostname.includes('github.io')) {
            const pathParts = path.split('/').filter(p => p);
            if (pathParts.length > 0) {
                // Return /repo-name/ format
                return `/${pathParts[0]}/`;
            }
        }
        
        // For local development or root hosting
        return './';
    }
    
    async init() {
        console.log('🚀 Flashcard App initialized');
        await this.loadWordlists();
        console.log('Wordlists loaded:', this.wordlists);
        this.renderWordlists();
    }
    
    /**
     * Load all available wordlists from the wordlists directory
     * Now supports subdirectories with folder structure
     */
    async loadWordlists() {
        try {
            // Define the wordlist structure with folders and files
            this.wordlistStructure = {
                folders: [
                    {
                        name: 'Dutch',
                        path: 'Dutch',
                        files: [
                            'A2_01_het_huis.json', 'A2_02_de_school.json', 'A2_03_de_familie.json',
                            'A2_04_het_formulier.json', 'A2_05_het_lichaam.json', 'A2_06_de_kleding.json',
                            'A2_07_de_keuken.json', 'A2_08_de_boodschappen.json', 'A2_09_de_groente.json',
                            'A2_10_de_koffie.json', 'A2_11_het_weer.json', 'A2_12_het_verkeer.json',
                            'A2_13_de_dieren.json', 'A2_14_de_tijd.json', 'A2_15_de_sport.json',
                            'A2_16_het_restaurant.json', 'A2_17_de_vakantie.json', 'A2_18_de_natuur.json',
                            'A2_19_de_cultuur.json', 'A2_20_de_politiek.json', 'A2_21_de_computer.json',
                            'A2_22_het_appartement.json', 'A2_23_het_onderwijs.json', 'A2_24_het_beroep.json',
                            'A2_25_de_economie.json', 'A2_26_de_gezondheid.json'
                        ]
                    },
                    {
                        name: 'Korean',
                        path: 'Korean',
                        files: [
                            'animals.json'
                        ]
                    }
                    // Add more language folders here
                ],
                files: [
                    "test.json"
                ]
                // Root level files (if any)
            };
            
            this.updateCurrentWordlists();
            
        } catch (error) {
            console.error('Error loading wordlists:', error);
        }
    }
    
    /**
     * Update the wordlists array based on current navigation path
     */
    updateCurrentWordlists() {
        let current = this.wordlistStructure;
        
        // Navigate to current path
        for (const pathPart of this.currentPath) {
            const folder = current.folders?.find(f => f.path === pathPart);
            if (folder) {
                current = folder;
            }
        }
        
        // Build the wordlists array with folders and files
        this.wordlists = [];
        
        // Add folders
        if (current.folders && current.folders.length > 0) {
            current.folders.forEach(folder => {
                this.wordlists.push({
                    type: 'folder',
                    name: folder.name,
                    path: folder.path,
                    icon: '📁'
                });
            });
        }
        
        // Add files
        if (current.files && current.files.length > 0) {
            current.files.forEach(filename => {
                this.wordlists.push({
                    type: 'file',
                    filename,
                    name: filename.replace('.json', '').replace(/_/g, ' ').toUpperCase(),
                    icon: '🗂️'
                });
            });
        }
    }
    
    /**
     * Render the wordlist selection screen
     */
    renderWordlists() {
        const container = document.getElementById('wordlist-list');
        const breadcrumbContainer = document.getElementById('breadcrumb-container');
        
        if (this.wordlists.length === 0) {
            container.innerHTML = '<p class="info-text">No wordlists found. Please add JSON files to the wordlists directory.</p>';
            breadcrumbContainer.innerHTML = '';
            return;
        }
        
        // Add breadcrumb navigation if we're in a subdirectory
        if (this.currentPath.length > 0) {
            breadcrumbContainer.innerHTML = `
                <div class="breadcrumb">
                    <button class="breadcrumb-btn" onclick="app.navigateToRoot()">🏠 Home</button>
                    ${this.currentPath.map((path, index) => `
                        <span class="breadcrumb-separator">›</span>
                        <button class="breadcrumb-btn" onclick="app.navigateToPath(${index})">${path}</button>
                    `).join('')}
                </div>
            `;
        } else {
            breadcrumbContainer.innerHTML = '';
        }
        
        container.innerHTML = this.wordlists.map((item, index) => {
            if (item.type === 'folder') {
                return `
                    <div class="card folder-card" onclick="app.openFolder(${index})">
                        <div class="card-icon">${item.icon}</div>
                        <h3>${item.name}</h3>
                        <p>Folder</p>
                    </div>
                `;
            } else {
                return `
                    <div class="card file-card" onclick="app.selectWordlist(${index})">
                        <div class="card-icon">${item.icon}</div>
                        <h3>${item.name}</h3>
                        <p>Click to start learning</p>
                    </div>
                `;
            }
        }).join('');
    }
    
    /**
     * Open a folder and navigate into it
     */
    openFolder(index) {
        const item = this.wordlists[index];
        if (item.type === 'folder') {
            this.currentPath.push(item.path);
            this.updateCurrentWordlists();
            this.renderWordlists();
        }
    }
    
    /**
     * Navigate to root directory
     */
    navigateToRoot() {
        this.currentPath = [];
        this.updateCurrentWordlists();
        this.renderWordlists();
    }
    
    /**
     * Navigate to a specific path level
     */
    navigateToPath(index) {
        this.currentPath = this.currentPath.slice(0, index + 1);
        this.updateCurrentWordlists();
        this.renderWordlists();
    }
    
    /**
     * Select a wordlist and load its content
     */
    async selectWordlist(index) {
        const wordlist = this.wordlists[index];
        
        // Ignore if it's a folder
        if (wordlist.type === 'folder') {
            this.openFolder(index);
            return;
        }
        
        try {
            // Build the full path including subdirectories
            const pathPrefix = this.currentPath.length > 0 ? this.currentPath.join('/') + '/' : '';
            const url = `${this.basePath}wordlists/${pathPrefix}${wordlist.filename}`;
            console.log('Loading wordlist from:', url);
            
            const response = await fetch(url);
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
        // Clean up current mode before going back
        if (this.currentMode && this.modeInstances[this.currentMode]) {
            this.modeInstances[this.currentMode].cleanup();
            this.modeInstances[this.currentMode] = null;
        }
        this.currentMode = null;
        
        document.getElementById('session-screen').classList.remove('active');
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
        this.currentWordlist = null;
    }
    
    /**
     * Start a learning mode
     */
    startMode(mode, testDirection = null) {
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
                this.modeInstances.test = new TestMode(this.currentWordlist, sessionContent, testDirection);
                this.modeInstances.test.start();
                break;
        }
    }
    
    /**
     * Show test mode options
     */
    showTestOptions() {
        console.log('showTestOptions called');
        this.currentMode = 'test';
        
        const sessionContent = document.getElementById('session-content');
        
        // Show session screen with test options
        document.getElementById('mode-screen').classList.remove('active');
        document.getElementById('session-screen').classList.add('active');
        
        sessionContent.innerHTML = `
            <div class="question-card">
                <h2 style="text-align: center; color: var(--primary);">✍️ Test Mode Options</h2>
                <div style="text-align: center; margin: 2rem 0;">
                    <p style="margin-bottom: 2rem;">Choose your test direction:</p>
                    
                    <div class="mode-cards" style="max-width: 600px; margin: 0 auto;">
                        <div class="mode-card" onclick="app.startMode('test', 'word-to-meaning')" style="cursor: pointer;">
                            <div class="mode-icon">➡️</div>
                            <h3>Word → Meaning</h3>
                            <p>See the word, type the meaning</p>
                        </div>
                        
                        <div class="mode-card" onclick="app.startMode('test', 'meaning-to-word')" style="cursor: pointer;">
                            <div class="mode-icon">⬅️</div>
                            <h3>Meaning → Word</h3>
                            <p>See the meaning, type the word</p>
                        </div>
                        
                        <div class="mode-card" onclick="app.startMode('test', 'random')" style="cursor: pointer;">
                            <div class="mode-icon">🔀</div>
                            <h3>Random</h3>
                            <p>Mix of both directions</p>
                        </div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-secondary" onclick="app.endSession()">← Back</button>
                </div>
            </div>
        `;
    }
    
    /**
     * End the current session and return to mode selection
     */
    endSession() {
        // Clean up current mode
        if (this.currentMode && this.modeInstances[this.currentMode]) {
            this.modeInstances[this.currentMode].cleanup();
            this.modeInstances[this.currentMode] = null;
        }
        
        this.currentMode = null;
        
        // Return to mode selection if we have a wordlist selected
        document.getElementById('session-screen').classList.remove('active');
        if (this.currentWordlist) {
            document.getElementById('mode-screen').classList.add('active');
        } else {
            // If no wordlist, go back to wordlist selection
            document.getElementById('wordlist-screen').classList.add('active');
        }
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
