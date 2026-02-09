# Flashcard Learning Application

A comprehensive flashcard memorization application available in **two versions**: 
- 🖥️ **CLI (Command-Line)** - For desktop users who prefer terminal-based learning
- 🌐 **Web** - For mobile and browser users with a modern, touch-friendly interface

Both versions share the same wordlists and offer powerful learning modes!

## ✨ Features

### Available in Both Versions

- 📚 **Multiple Word Lists**: Load any JSON-based word list
- 🧠 **Memorize Mode**: Master all words through 3-stage progressive learning
- 🎓 **Learn Mode**: Practice with immediate feedback
- 📝 **Test Mode**: Scored assessments with detailed results
- 🔀 **Random Selection**: Words and questions presented randomly
- 📊 **Performance Tracking**: View scores, percentages, and progress

### Web Version Exclusive

- 📱 **Mobile-Friendly**: Responsive design optimized for phones and tablets
- 🎨 **Beautiful UI**: Modern, colorful interface with smooth animations
- 🌐 **Works Anywhere**: No installation needed, just open in browser
- 💾 **PWA Support**: Install on mobile home screen like a native app

## Installation & Usage

### 🌐 Web Version (Recommended for Mobile)

**GitHub Pages (Live):**
1. Fork this repository
2. Enable GitHub Pages in Settings → Pages → Source: `docs` folder
3. Visit: `https://yourusername.github.io/flashcards/`

**Local Testing:**
```bash
# Use a local server (required to avoid CORS errors)
cd flashcards
python -m http.server 8000
# Visit: http://localhost:8000/docs/
```

**⚠️ Important:** Run the server from the project root (not the docs folder) so both docs and wordlists are accessible.

### 🖥️ CLI Version (For Desktop)

**Requirements:** Python 3.6+

```bash
cd flashcards
python src/main.py
```

No additional dependencies required!

## Project Structure

```
flashcards/
├── wordlists/              # Shared JSON word list files
│   ├── dutch_A2_01.json
│   ├── dutch_A2_02.json
│   └── ... (26 total)
├── src/                    # Python CLI version
│   ├── main.py                  # Main application entry
│   ├── wordlist_manager.py      # Word list loading
│   ├── memorize_mode.py         # Memorize mode (3-stage)
│   ├── learn_mode.py            # Learn mode
│   ├── test_mode.py             # Test mode
│   └── colors.py                # Terminal colors
├── docs/                   # Web version (for GitHub Pages)
│   ├── index.html               # Main HTML structure
│   ├── style.css                # Mobile-first styling
│   ├── app.js                   # Main app logic
│   ├── memorize.js              # Memorize mode implementation
│   ├── learn.js                 # Learn mode implementation
│   ├── test.js                  # Test mode implementation
│   ├── manifest.json            # PWA manifest
│   └── README.md                # Web version docs
└── README.md               # This file
```

## 📖 Learning Modes

### 🧠 Memorize Mode (New!)

The most comprehensive learning mode with a 3-stage system:

1. **Stage 1: Type Both** - Type both word and meaning to memorize
2. **Stage 2: Word → Meaning** - See the word, type the meaning
3. **Stage 3: Meaning → Word** - See the meaning, type the word

**How it works:**
- Introduces 10 new words per run
- Each run asks 10 questions from all active words
- Words must complete all 3 stages to be "memorized"
- Progress is tracked and displayed after each run
- Session ends only when ALL words are fully memorized

### 📖 Learn Mode

Practice mode with immediate feedback:
- Choose direction: Word → Meaning, Meaning → Word, or Random
- Get instant feedback on each answer
- Practice without scoring pressure
- Type `quit` (CLI) or tap "End Session" (Web) to stop

### ✍️ Test Mode

Scored assessment to evaluate your knowledge:
- Choose number of questions (CLI) or test all words (Web)
- Questions randomly show either word or meaning
- Final results with:
  - Score and percentage
  - Grade (A-F) in web version
  - Review of incorrect answers
  - Correct solutions displayed

## 📝 Creating Word Lists

Create JSON files in the `wordlists/` directory. Both CLI and web versions use the same files!

**New Format (Recommended):**
```json
{
  "pairs": [
    {"word": "hello", "meaning": "hola"},
    {"word": "goodbye", "meaning": "adiós"},
    {"word": "please", "meaning": "por favor"}
  ]
}
```

**Legacy Format (Still Supported):**
```json
{
  "hello": "hola",
  "goodbye": "adiós",
  "please": "por favor"
}
```

The app automatically converts legacy format to the new format.

## 🎯 Which Version Should I Use?

| Use Case | Recommended Version |
|----------|---------------------|
| 📱 Studying on phone/tablet | **Web Version** |
| 🚌 Learning on the go | **Web Version** |
| 💻 Fast typing at desktop | **CLI Version** |
| 🌐 Want to share with others | **Web Version** (GitHub Pages) |
| 🔌 Offline without setup | **CLI Version** |
| 🎨 Prefer visual interface | **Web Version** |
| ⚡ Prefer keyboard-only | **CLI Version** |

**Good news:** You can use both! They share the same wordlists, so switch freely between versions.

## 🚀 Deploying Web Version to GitHub Pages

1. **Fork or clone this repository**

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages section
   - Set Source to: **Deploy from a branch**
   - Select branch: **main** (or your default branch)
   - Select folder: **/docs**
   - Click Save

3. **Access your app:**
   - Wait 1-2 minutes for deployment
   - Visit: `https://yourusername.github.io/flashcards/`

4. **Add new wordlists (optional):**
   - Add JSON files to `wordlists/` folder
   - Update `wordlistFiles` array in `docs/app.js` (around line 25)
   - Commit and push - GitHub Pages auto-updates!

## 📱 Installing as Mobile App (PWA)

Once deployed to GitHub Pages:

**iOS (Safari):**
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home screen"

Now you have a native-like app icon on your home screen!

## Examples

### CLI Version - Memorize Mode
## Examples

### CLI Version - Memorize Mode
```
==================================================
           MEMORIZE MODE
==================================================

This mode helps you fully memorize all words.
Each word has 3 stages:
  1. Type both word and meaning
  2. See word → type meaning
  3. See meaning → type word

Press Enter to start...

==================================================
           RUN 1
==================================================

Question 1/10
Stage 1: Type both word and meaning
Word: hallo
Meaning: hello
Type the word: hallo
Type the meaning: hello
✓ Perfect! Both correct!

[... 9 more questions ...]

==================================================
           PROGRESS REPORT
==================================================
Total words: 50
Fully memorized: 0 / 50

Words by stage:
  Stage 1 (Type both): 0
  Stage 2 (Word→Meaning): 10
  Stage 3 (Meaning→Word): 0

Completion: 0.0%
==================================================

Continue to next run? [Y/n]:
```

### Web Version - Test Results
```
🎉 Test Complete!

Correct: 18
Incorrect: 2
Score: 90.0%
Grade: A

Excellent work! You passed the test!

Review Missed Questions (2)
- vraag: You answered "question" → Correct: "question"
- antwoord: You answered "response" → Correct: "answer"
```

## Tips

- 💡 **Start with Memorize Mode** for comprehensive learning
- 📝 Answers are case-insensitive in both versions  
- 🎯 Use Learn Mode to warm up before tests
- 📊 Web version saves no data - each session is fresh
- ⌨️ CLI version is faster if you're a quick typist
- 📱 Web version is better for touch-screen devices
- 🔄 Practice regularly for best retention
- 📚 Create custom word lists for any subject you're studying

## Customization

### Adding Wordlists

**For both versions:**
1. Create JSON file in `wordlists/` directory
2. Use the format shown in "Creating Word Lists" section

**For web version specifically:**
3. Edit `docs/app.js`
4. Add your filename to the `wordlistFiles` array (around line 25)
5. Commit and push (if using GitHub Pages)

### Styling (Web Version)

Edit `docs/style.css` to change colors, fonts, or layout:
```css
:root {
    --primary: #2196F3;      /* Change main color */
    --secondary: #4CAF50;    /* Change accent color */
    /* ... more variables ... */
}
```

### Adding Features

Both versions are modular:
- **CLI:** Each mode is in its own file (`src/*_mode.py`)
- **Web:** Each mode is in its own file (`docs/*.js`)
- Easy to add new modes or modify existing ones

## 🛠️ Technology Stack

### CLI Version
- **Language:** Python 3.6+
- **Dependencies:** None (uses only standard library)
- **Platforms:** Windows, macOS, Linux

### Web Version
- **Frontend:** Vanilla JavaScript (ES6+)
- **Styling:** CSS3 with CSS Variables
- **No build tools required:** No npm, webpack, or bundlers
- **Browser Support:** Chrome, Firefox, Safari, Edge (modern versions)

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- 🌍 Add wordlists in different languages
- 🎨 Improve web UI/UX
- 🔊 Add audio pronunciation (web version)
- 📊 Add progress tracking/statistics
- 🧪 Add unit tests
- 📱 Improve PWA features (offline mode, notifications)
- ⌨️ Add keyboard shortcuts (both versions)

## 📄 License

This is a free and open-source project. Feel free to modify and distribute as needed.

## 🐛 Troubleshooting

### Web Version

**Wordlists not loading?**
- Open browser console (F12) to check for errors
- Verify JSON files are valid (use a JSON validator)
- Check file paths in `docs/app.js`
- If testing locally, use a local server (not `file://` protocol)

**Can't install as PWA?**
- Must be served over HTTPS (GitHub Pages provides this)
- Check that `manifest.json` is accessible
- Some browsers have stricter PWA requirements

### CLI Version

**Module not found errors?**
- Ensure you're in the correct directory
- Run from project root: `python src/main.py`
- Check Python version: `python --version` (need 3.6+)

**Colors not showing?**
- Some terminals don't support ANSI colors
- The app will still work, just without colors

## 📞 Support

- 📖 Check the detailed [Web Version README](docs/README.md)
- 💬 Create an issue for bugs or questions
- ⭐ Star this repo if you find it useful!

---

**Happy Learning!** 📚✨

Choose your version:
- 🖥️ **CLI:** `python src/main.py`
- 🌐 **Web:** [Open in browser](docs/index.html) or deploy to GitHub Pages