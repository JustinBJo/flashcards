# Web Version - Flashcard Learning App

This is the web version of the Flashcard Learning Application, designed to work on any device with a browser.

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Enable GitHub Pages in your repository settings
2. Set source to the `docs` folder
3. Access your app at: `https://yourusername.github.io/flashcards/`

### Option 2: Local Testing

**⚠️ Important:** You must use a local server (not `file://` protocol) to avoid CORS errors.

```bash
# Navigate to project root (flashcards folder, NOT docs folder)
cd flashcards

# Option 1: Python (recommended)
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: PHP
php -S localhost:8000
```

Then visit `http://localhost:8000/docs/` in your browser.

**Note:** The server must run from the project root so both `/docs/` and `/wordlists/` folders are accessible.

## 📱 Features

### Three Learning Modes

1. **🧠 Memorize Mode**
   - Three-stage learning system
   - Progressive word introduction (10 new words per run)
   - Tracks your progress through all stages
   - Ensures complete mastery of all words

2. **📖 Learn Mode**
   - Practice with immediate feedback
   - Randomized questions
   - See your score at the end

3. **✍️ Test Mode**
   - Scored assessment
   - Final grade and review
   - See which words you need to practice

## 📂 File Structure

```
docs/
├── index.html        # Main HTML structure
├── style.css         # Styling (mobile-first design)
├── app.js            # Main app logic & navigation
├── memorize.js       # Memorize mode implementation
├── learn.js          # Learn mode implementation
├── test.js           # Test mode implementation
├── manifest.json     # PWA manifest
└── README.md         # This file
```

## 🔧 How It Works

### Wordlist Loading
The app automatically discovers wordlists from the `../wordlists/` directory. The wordlist files must be in JSON format:

```json
{
  "pairs": [
    {"word": "hello", "meaning": "hola"},
    {"word": "goodbye", "meaning": "adiós"}
  ]
}
```

### Adding New Wordlists
1. Add your JSON file to the `wordlists/` folder
2. Update the `wordlistFiles` array in `app.js` (line 25) to include your new file
3. The app will automatically display it in the selection screen

## 📱 Progressive Web App (PWA)

This app includes PWA support, which means:
- Can be installed on mobile home screen
- Works offline (after first visit)
- Feels like a native app

To enable full PWA features, add a service worker (optional).

## 🎨 Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary: #2196F3;
    --secondary: #4CAF50;
    --error: #f44336;
    /* ... */
}
```

### Modes
Each mode is in its own file (`memorize.js`, `learn.js`, `test.js`), making it easy to modify or add new modes.

## 🌐 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support (iOS 12+)
- Opera: ✅ Full support

## 🤝 Sharing with Python CLI

Both versions use the same wordlist JSON files! You can:
- Use the CLI on desktop for fast typing
- Use the web version on mobile
- Switch between them seamlessly

## 📝 Development Notes

### Key Differences from Python Version
1. **Asynchronous**: Uses async/await for file loading
2. **Event-driven**: Button clicks instead of input() loops
3. **DOM manipulation**: Updates HTML instead of console output
4. **State management**: JavaScript objects track progress

### No Build Step Required
This is vanilla JavaScript - no npm, webpack, or build tools needed! Just edit and refresh.

## 🐛 Troubleshooting

**Wordlists not loading?**
- Check the browser console for errors
- Ensure JSON files are valid
- Verify file paths in `app.js`

**Styling issues on mobile?**
- The CSS is mobile-first
- Test on actual devices or browser dev tools
- Check viewport meta tag in `index.html`

**Can't install as PWA?**
- Must be served over HTTPS (GitHub Pages is HTTPS by default)
- Check manifest.json is accessible
- Add icons (icon-192.png and icon-512.png) for full support

## 📄 License

Same as parent project.
