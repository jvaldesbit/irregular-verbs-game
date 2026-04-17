# 🎮 Irregular Verbs Game

An interactive web application built with **Astro.js** to help you learn English irregular verbs in a fun and engaging way!

## 🎯 Features

### 5 Game Modes:

1. **🎯 Quick Match** - Multiple choice questions to match verb forms
2. **⚡ Speed Challenge** - Match verbs against the clock (60 seconds)
3. **⌨️ Type Master** - Type the correct verb form with accuracy tracking
4. **🃏 Memory Cards** - Classic memory game with verb pairs (Easy/Medium/Hard)
5. **♾️ Practice Mode** - Study at your own pace with two modes:
   - Show Answer: Browse all verb forms with navigation
   - Quiz Mode: Self-test with instant feedback

### ⚙️ Customizable Settings

Configure what you want to learn:
- ✅ Present (Infinitive) - Base form
- ✅ Past (Simple Past) - Past tense
- ✅ Participle (Past Participle) - Perfect tenses
- ✅ Spanish (Español) - Spanish translation

Select at least 2 forms to start playing!

## 📚 Learning Modes

- **Beginners**: Start with Present and Past
- **Intermediate**: Add Participle form
- **Advanced**: Enable all forms including Spanish
- **Spanish Speakers**: Use Spanish translation to learn faster!

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.12.0

### Installation

```bash
# Navigate to project directory
cd irregular-verbs-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:4321`

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 Verb Database

The app includes **67 common irregular verbs** with all forms:
- eat / ate / eaten / comer
- go / went / gone / ir
- do / did / done / hacer
- ... and 64 more!

Located in: `public/data/verbs.json`

## 🏗️ Project Structure

```
irregular-verbs-game/
├── src/
│   └── pages/
│       ├── index.astro          # Main menu
│       ├── quick-match.astro    # Multiple choice game
│       ├── speed-challenge.astro # Timed matching game
│       ├── type-master.astro    # Typing game
│       ├── memory-cards.astro   # Memory card game
│       ├── practice.astro       # Practice mode
│       └── settings.astro       # Configuration page
├── public/
│   └── data/
│       ├── verbs.json          # Verb database
│       └── settings.json       # User settings
├── astro.config.mjs
└── package.json
```

## 🎨 Technology Stack

- **Framework**: Astro.js v6.1.7
- **Styling**: Vanilla CSS (scoped styles)
- **Client-side**: Vanilla JavaScript (ES6+)
- **Storage**: JSON files + localStorage
- **No external dependencies** - Pure and simple!

## 🎮 Game Instructions

### Quick Match
- Select the correct verb form from 4 options
- Track your score and streak
- Visual feedback for correct/wrong answers

### Speed Challenge
- 60 seconds to match as many verb pairs as possible
- Click one verb from each column to match
- Beat your high score!

### Type Master
- Type the exact verb form shown
- Instant feedback on correctness
- Skip button available
- Accuracy percentage tracking

### Memory Cards
- Choose difficulty: 6, 8, or 10 pairs
- Flip cards to find matching verb forms
- Track your moves
- Complete all pairs to win!

### Practice Mode
- **Show Answer**: Navigate through all verbs with arrow keys
- **Quiz Mode**: Test yourself and track right/wrong answers
- No pressure, learn at your own pace

## 🌟 Key Features

- ✨ Beautiful gradient UI with smooth animations
- 📱 Fully responsive (mobile, tablet, desktop)
- ⌨️ Keyboard navigation support
- 💾 Settings persist in localStorage
- 🎯 Score and accuracy tracking
- 🔥 Streak counters for motivation
- 🎨 Different color themes per game mode

## 📝 Adding More Verbs

Edit `public/data/verbs.json`:

```json
{
  "present": "swim",
  "past": "swam",
  "participle": "swum",
  "spanish": "nadar"
}
```

## 🤝 Contributing

Feel free to add more verbs, game modes, or features!

## 📄 License

Free to use for educational purposes.

## 🎓 Perfect For

- English language learners
- Students preparing for exams
- Teachers looking for interactive learning tools
- Anyone wanting to master irregular verbs!

---

Made with ❤️ using Astro.js

Happy Learning! 🚀
