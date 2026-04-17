# 🎮 Game Modes Documentation

This document describes all the game modes available in the Irregular Verbs Game.

## 📋 Games Overview

| Game | Difficulty | Time Limit | Best For |
|------|-----------|------------|----------|
| Quick Match | Easy | No | Beginners |
| Speed Challenge | Medium | 60 seconds | Intermediate |
| Type Master | Hard | No | Advanced |
| Memory Cards | Easy-Hard | No | All Levels |
| Practice Mode | Easy | No | Self-Study |

---

## 🎯 1. Quick Match

**File:** `src/pages/quick-match.astro`

### Description
Multiple choice game where you select the correct verb form from 4 options.

### How to Play
1. A verb form is displayed (e.g., "ate")
2. You see 4 possible answers
3. Click the correct matching form
4. Get instant feedback (correct/wrong)
5. Next question appears automatically

### Features
- ✅ Score tracking
- 🔥 Streak counter (resets on wrong answer)
- 📊 Accuracy bar (fills as you answer correctly)
- ⏱️ 2-second delay after each answer
- 🎨 Visual feedback (green for correct, red for wrong)

### Scoring
- **Correct answer:** +1 score, streak increases
- **Wrong answer:** Streak resets to 0
- Shows correct answer when wrong

### Configuration Support
Uses all enabled forms from settings. Randomly picks:
- One form to show (e.g., past)
- Another form to ask for (e.g., present)

---

## ⚡ 2. Speed Challenge

**File:** `src/pages/speed-challenge.astro`

### Description
Match verb pairs against the clock! You have 60 seconds to match as many verb pairs as possible.

### How to Play
1. Click "Start Game"
2. Two columns appear with 10 verbs each (shuffled)
3. Click one verb from left column
4. Click matching verb from right column
5. If correct, both turn green
6. If wrong, they shake and deselect
7. Race against the 60-second timer!

### Features
- ⏱️ 60-second countdown timer
- 🎯 Match counter
- ⚠️ Timer turns red and pulses when < 10 seconds
- 📊 Final score displayed at end
- 🔄 Restart button

### Scoring
- Each correct match: +1
- No penalty for wrong matches
- Goal: Match all 10 pairs before time runs out

### Configuration Support
Randomly selects 2 forms from enabled settings (e.g., Present + Past)

---

## ⌨️ 3. Type Master

**File:** `src/pages/type-master.astro`

### Description
Type the exact verb form requested. Tests your spelling and memory!

### How to Play
1. See a verb form displayed (e.g., "eat")
2. Type the requested form (e.g., PAST)
3. Click "Check Answer" or press Enter
4. Get feedback (correct/wrong with correct answer)
5. Next question appears automatically

### Features
- ⌨️ Keyboard support (Enter to submit)
- 📊 Score tracking
- 🎯 Accuracy percentage (color-coded)
- ⏭️ Skip button available
- 🔤 Case-insensitive matching
- ✅ Accepts variations (e.g., "was" or "were" for "was/were")

### Scoring
- **Correct:** +1 score, 1.5-second delay
- **Wrong:** 3-second delay to read correct answer
- **Skip:** Counts as answered but not correct

### Accuracy Colors
- 🟢 Green: ≥80% accuracy
- 🟡 Yellow: 60-79% accuracy
- 🔴 Red: <60% accuracy

### Configuration Support
Uses all enabled forms. Shows Spanish hint if available.

---

## 🃏 4. Memory Cards

**File:** `src/pages/memory-cards.astro`

### Description
Classic memory matching game with verb forms. Flip cards to find pairs!

### How to Play
1. Choose difficulty:
   - **Easy:** 6 pairs (12 cards)
   - **Medium:** 8 pairs (16 cards)
   - **Hard:** 10 pairs (20 cards)
2. Cards are face-down showing "?"
3. Click two cards to flip them
4. If they match (same verb, different forms), they stay green
5. If no match, they flip back after 1 second
6. Match all pairs to win!

### Features
- 🎯 Move counter
- 📊 Match counter (X / Total)
- 🎴 3D flip animation
- 🏆 Completion screen with total moves
- 🔄 Responsive grid layout

### Scoring
- No time limit
- Track your moves (lower is better!)
- Try to beat your best score

### Card States
- **Face down:** Blue gradient with "?"
- **Flipped:** Shows verb form
- **Matched:** Green background
- **No match:** Shake animation, flip back

### Configuration Support
Randomly selects 2 forms from enabled settings for the entire game.

---

## ♾️ 5. Practice Mode

**File:** `src/pages/practice.astro`

### Description
Study at your own pace with two practice modes: Show Answer and Quiz Mode.

### Mode 1: Show Answer
Browse through all verbs with all forms visible.

#### Features
- 📖 All verb forms displayed in cards
- ⬅️ Previous / Next buttons
- ⌨️ Keyboard navigation (arrow keys)
- 📊 Progress counter (1 / 67)
- 👁️ Only shows forms enabled in settings
- 🎨 Hover effects on form cards

#### Layout
4 cards displayed in a grid:
- Present
- Past
- Participle
- Spanish

Hidden cards don't appear if disabled in settings.

### Mode 2: Quiz Mode
Self-test with manual scoring.

#### How to Use
1. See a verb form displayed
2. Think of the answer
3. Click "Show Answer" (or press Space/Enter)
4. Answer is revealed
5. Click "✓ I got it right" or "✗ I got it wrong"
6. Stats are updated

#### Features
- 🎯 Right/Wrong counters
- 📊 Accuracy percentage
- 🔄 Automatic next question after feedback
- 💡 Self-assessment (you decide if correct)

#### Keyboard Shortcuts
- **Space/Enter:** Reveal answer
- **Arrow keys:** Navigate (Show Answer mode only)

### Configuration Support
Shows/hides forms based on settings. Uses all enabled forms for quiz questions.

---

## ⚙️ Settings Configuration

**File:** `src/pages/settings.astro`

### Available Options

#### Verb Forms
- ☑️ **Present (Infinitive)** - Base form: eat, go, do
- ☑️ **Past (Simple Past)** - Past tense: ate, went, did
- ☑️ **Participle (Past Participle)** - Perfect tenses: eaten, gone, done
- ☑️ **Spanish (Español)** - Translation: comer, ir, hacer

### Rules
- **Minimum:** Must enable at least 2 forms
- **Storage:** Settings saved to localStorage
- **Persistence:** Maintained across sessions

### Recommended Settings

#### For Beginners
```
✅ Present
✅ Past
❌ Participle
❌ Spanish
```

#### For Intermediate
```
✅ Present
✅ Past
✅ Participle
❌ Spanish
```

#### For Advanced
```
✅ Present
✅ Past
✅ Participle
✅ Spanish
```

#### For Spanish Speakers
```
✅ Present
✅ Past
❌ Participle
✅ Spanish
```

---

## 🎨 Design Theme per Game

Each game has a unique color scheme:

| Game | Primary Color | Gradient |
|------|--------------|----------|
| Quick Match | Purple | #667eea → #764ba2 |
| Speed Challenge | Pink | #f093fb → #f5576c |
| Type Master | Indigo | #4f46e5 → #7c3aed |
| Memory Cards | Cyan | #06b6d4 → #3b82f6 |
| Practice Mode | Green | #10b981 → #059669 |
| Settings | Pink/Red | #f093fb → #f5576c |

---

## 📊 Verb Database

**File:** `public/data/verbs.json`

### Structure
```json
{
  "present": "eat",
  "past": "ate",
  "participle": "eaten",
  "spanish": "comer"
}
```

### Current Database
- **Total verbs:** 67
- **Categories:** All common irregular verbs
- **Difficulty:** Beginner to Advanced

### Adding More Verbs
Simply add a new entry to `verbs.json`:

```json
{
  "present": "swim",
  "past": "swam",
  "participle": "swum",
  "spanish": "nadar"
}
```

---

## 🏆 Learning Path Recommendations

### Week 1: Introduction
1. Start with **Settings** - Enable Present + Past only
2. Play **Quick Match** - Get familiar with common verbs
3. Use **Practice Mode** (Show Answer) - Study the forms

### Week 2: Building Skills
1. Play **Type Master** - Test spelling
2. Try **Quick Match** - Increase speed
3. Use **Practice Mode** (Quiz Mode) - Self-assess

### Week 3: Speed & Memory
1. Play **Speed Challenge** - Build reaction time
2. Try **Memory Cards** (Easy) - Visual memory training
3. Keep using **Type Master** - Maintain spelling skills

### Week 4: Mastery
1. Enable **Participle** in Settings
2. Play all games with 3 forms
3. Try **Memory Cards** (Hard)
4. Aim for 90%+ accuracy in Type Master

### Advanced Learners
1. Enable **all forms** including Spanish
2. Focus on **Type Master** for perfect spelling
3. Challenge yourself with **Speed Challenge**
4. Use **Practice Mode** for difficult verbs

---

## 🎯 Success Metrics

### Quick Match
- **Beginner:** 70% accuracy, 5+ streak
- **Intermediate:** 85% accuracy, 10+ streak
- **Advanced:** 95% accuracy, 20+ streak

### Speed Challenge
- **Beginner:** 5+ matches in 60 seconds
- **Intermediate:** 8+ matches in 60 seconds
- **Advanced:** All 10 matches in 60 seconds

### Type Master
- **Beginner:** 60% accuracy after 20 questions
- **Intermediate:** 80% accuracy after 30 questions
- **Advanced:** 90% accuracy after 50 questions

### Memory Cards
- **Easy (6 pairs):** Complete in <20 moves
- **Medium (8 pairs):** Complete in <25 moves
- **Hard (10 pairs):** Complete in <30 moves

---

## 🐛 Troubleshooting

### Settings not saving?
- Check browser localStorage is enabled
- Try clearing cache and saving again

### Games not loading verbs?
- Check `public/data/verbs.json` exists
- Verify JSON format is correct

### Need at least 2 forms error?
- Go to Settings
- Enable at least 2 checkboxes
- Save settings

### Cards not flipping in Memory game?
- Wait for previous flip animation to complete
- Make sure JavaScript is enabled

---

## 🎓 Educational Benefits

### Vocabulary Building
- Reinforces irregular verb patterns
- Builds muscle memory for spelling
- Associates forms through repetition

### Multiple Learning Styles
- **Visual:** Color coding, cards, animations
- **Kinesthetic:** Typing, clicking, matching
- **Auditory:** Self-pronunciation while playing

### Cognitive Skills
- **Memory:** Memory Cards game
- **Speed:** Speed Challenge
- **Accuracy:** Type Master
- **Recognition:** Quick Match
- **Self-Assessment:** Practice Mode

---

## 🔮 Future Enhancement Ideas

Potential additions:
- Audio pronunciation for each verb
- Difficulty levels within games
- Leaderboards and high scores
- More verb tenses (present continuous, etc.)
- Conjugation practice
- Sentence building exercises
- Progress tracking over time
- Achievement badges

---

## 📝 Notes for Teachers

### Classroom Use
- Project on screen for whole-class activities
- Use Speed Challenge for team competitions
- Practice Mode great for individual study
- Settings allow customizing to lesson focus

### Assessment
- Type Master shows spelling mastery
- Quick Match tests recognition
- Can track student progress manually

### Homework
- Assign specific games each week
- Students can practice at home
- Self-paced learning with Practice Mode

---

**Last Updated:** 2026-04-16
**Version:** 1.0
**Total Games:** 5
**Total Verbs:** 67
