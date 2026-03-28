# 🛡️ NetGuardian: The Cyber-Defense Game
## Hackathon Blueprint & Design Document

---

## 1. GAME OVERVIEW

**Title:** NetGuardian
**Tagline:** "Defend the Digital City. Outsmart Online Scams."
**Genre:** Educational Cyber-Defense Simulation
**Target Audience:** Youth (16+), Educators, Corporate Training
**Duration:** 3-5 minute demo | Full game: 30-45 min campaign

### Story
You are a newly recruited **Cyber Guardian** in DataCity, a thriving digital metropolis under siege by sophisticated scammers. Your mission: identify scams in real-time, protect citizens, and prevent the city's security collapse. Your decisions matter—save citizens or lose them to fraud. Build your reputation and climb the ranks from Rookie to Elite Guardian.

---

## 2. GAMEPLAY FLOW

### Act I: Tutorial (Difficulty 1)
- **Scene 1:** Orientation at Guardian HQ (cutscene)
- **Scene 2:** Control training in Safe Zone
- **Scene 3:** First scam identification (guided)
- **Reward:** 100 XP, **Guardian Rank 1**

### Act II: City Chronicles (Difficulty 2-4)
- **Daily Missions:** 5-7 citizens encountering scams
- **Decision Points:** Each mission has 3 response options
- **Consequences:** Right choice = +20 XP, City Security +2%, Citizen saved
- **Wrong choice:** -5 XP, City Security -1%, Citizen scammed
- **Ignore mission:** No reward, Security -1%

### Act III: Crisis Response (Difficulty 5)
- **Wave Events:** Multiple simultaneous scams
- **Time Pressure:** 30-60 seconds to respond
- **High Stakes:** City Security at critical level
- **Finale:** Final boss scam (mega-scam)

---

## 3. SCAM TYPES IN DATABASE

### TIER 1: Classic Scams (Easy)
1. **1 Rupee Scam** - "Buy for ₹1! (Full payment required)"
2. **Fake Job Offer** - "Work from home, earn ₹10,000/day!"
3. **Phishing Email** - "Reset your bank account - Click here"

### TIER 2: Intermediate Scams (Medium)
4. **Digital Arrest** - "Your Aadhar is suspended! Pay ₹5,000 now"
5. **Love Scam** - "I'm a model/NRI. Let's get married"
6. **Prize/Lottery Scam** - "You won! Claim your ₹1 lakh prize"
7. **Refund Scam** - "Your tax return is ready. Verify OTP"

### TIER 3: Advanced Scams (Hard)
8. **Investment Scam** - "Guaranteed 50% monthly returns"
9. **Tech Support Scam** - "Your device has a virus! Call us"
10. **UPI/Payment Scam** - "Money sent by accident. Reverse it?"

### TIER 4: Expert Scams (Extreme)
11. **Business Impersonation** - "This is ICICI Bank. Confirm your details"
12. **Cryptocurrency Scam** - "Bitcoin investment group - Limited spots"
13. **Social Engineering** - Multi-layer con with fake trust

---

## 4. PROGRESSION SYSTEM

### XP & Ranking
```
Rank 1: Rookie Guardian       (0-500 XP)
Rank 2: Alert Guardian        (500-1,200 XP)
Rank 3: Seasoned Guardian     (1,200-2,500 XP)
Rank 4: Expert Guardian       (2,500-5,000 XP)
Rank 5: Elite Guardian        (5,000+ XP)
```

### City Security Meter
- **Starts at:** 60%
- **Increases:** +2% per correct decision
- **Decreases:** -1% per wrong/ignored decision
- **Critical:** <30% triggers Crisis Mode
- **Victory:** Reach 100% = Win game
- **Defeat:** Reach 0% = Game Over

---

## 5. MISSION STRUCTURE

### Standard Mission Card
```
┌─────────────────────────────────┐
│ MISSION #5: "The Imposter"      │
├─────────────────────────────────┤
│ Difficulty: ⭐⭐☆☆☆             │
│ XP Reward: 75 | Security: +2%   │
├─────────────────────────────────┤
│ 📱 Priya (Software Engineer)    │
│ "Got a message from ICICI Bank  │
│  asking for my card details"     │
├─────────────────────────────────┤
│ 🎯 RESPOND:                      │
│ A) ✅ "Don't share any details" │
│ B) ⚠️ "Ask for the bank code"   │
│ C) ❌ "Verify via their website"│
└─────────────────────────────────┘
```

---

## 6. DECISION CONSEQUENCE SYSTEM

### Example Mission Chain: Digital Arrest Scam

**Mission 1:** Someone gets fraud call claiming Aadhar suspended
- Choose A (Correct): Save them, +20 XP, +2% Security
- Choose B/C (Wrong): They lose ₹5,000, -5 XP, -1% Security

**Consequence Ripple:** If you save them, they become a Helper NPC who warns others
(City Security +1% bonus next mission)

### Failure Cascade
- Miss 3 missions consecutively → "ALERT" state
- City Security drops below 30% → Crisis Mode activated
- Lose 5 consecutive missions → Game Over

---

## 7. MINI-GAMES

### A. Scam Spot Challenge
**Objective:** Find 5 red flags in a fake message
```
Message:
"Hi babe, I'm a software engineer in London. 
My Bitcoin is stuck, need ₹50k to unstick it.
Send to this UPI immediately!"

Red Flags to Find:
1. Too-good-to-be-true relationship
2. Urgent money request
3. Cryptocurrency angle
4. Grammar/language issues
5. Pressure to act fast
```

### B. Timeline Defense
**Objective:** Arrange scam prevention steps in correct order
```
Steps:
- Report to police
- Block the scammer
- Don't send money
- Take screenshots
- Tell family

Correct Order: 3→2→4→1→5
```

### C. Decision Speed Round
**Objective:** Make 10 quick decisions in 90 seconds
```
Correct = +5 XP
Incorrect = -2 XP
```

---

## 8. LEARN MODE (Educational Content)

After each mission, unlock educational snippet:

```
┌─────────────────────────────────┐
│ 📚 WHY THIS SCAM WORKS           │
├─────────────────────────────────┤
│ "Digital Arrest Scam exploits:  │
│  • Authority fear (police)      │
│  • Urgency (must act now)       │
│  • Shame (illegal activity)     │
│  • Technical complexity         │
│                                  │
│ REAL BANKS NEVER:                │
│  • Suspend Aadhar instantly     │
│  • Ask for payment via UPI      │
│  • Threaten legal action        │
│  • Call from unknown numbers    │
│                                  │
│ IF YOU GET THIS SCAM:           │
│  1. Hang up immediately         │
│  2. Call official bank number   │
│  3. Report to Cyber Crime Cell  │
│  4. Never share OTP/CVV         │
│                                  │
│  🛡️ Protection: Always verify  │
│     through official channels   │
└─────────────────────────────────┘
```

---

## 9. UI/UX LAYOUT

### Main Game HUD

```
┌─────────────────────────────────────────┐
│ 🛡️ NetGuardian                    Lvl 3 │
├─────────────────────────────────────────┤
│ XP: ████████░░░░░░░░ 2,450/2,500       │
│ City Security: 🔴🔴🔴🔴🔴⚪⚪⚪⚪⚪ 75%   │
├─────────────────────────────────────────┤
│ ACTIVE MISSION:                         │
│ ┌─────────────────────────────────────┐ │
│ │ Raj - Lottery Scam                  │ │
│ │ "You won ₹1 lakh! Click here"       │ │
│ │                                     │ │
│ │ [WARNING] [HELP] [EXPLAIN]          │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ 📊 STATS:                               │
│ Citizens Saved: 18 | Scams Stopped: 18 │
│ Mission Accuracy: 94%                   │
├─────────────────────────────────────────┤
│ 🌃 DATAFILE PROGRESS:                  │
│ Citizens: ████████░░ 80/100            │
│ You're 77% through the campaign!       │
└─────────────────────────────────────────┘
```

### Color Scheme
- **Primary:** Neon Cyan (#00D9FF)
- **Secondary:** Neon Purple (#9D00FF)
- **Success:** Neon Green (#00FF41)
- **Warning:** Neon Orange (#FFB300)
- **Danger:** Neon Red (#FF0055)
- **Background:** Dark Navy (#0A0E27)
- **Text:** Off-white (#E8E8E8)

---

## 10. ANIMATIONS & TRANSITIONS

### Entrance Animations
- Mission cards slide in from right with fade
- HUD elements appear staggered (0.1s each)
- XP gain shows as floating text with glow

### Decision Feedback
- **Correct:** Green pulse + ✅ + XP pop-up + "Saved!" text
- **Incorrect:** Red flash + ❌ + "Scam got them" + citizen portrait fades
- **Level Up:** Gold burst animation + rank card

### Cutscenes
- Chief briefing (text animation + NPC avatar)
- City state changes reflect in background
- Dramatic moment: Slow-motion decision time

---

## 11. HACKATHON PRESENTATION FLOW (5 MIN)

**[0:00-0:30]** → Intro + Title Screen Animation
**[0:30-1:00]** → Quick Tutorial (guided mission)
**[1:00-2:30]** → Play 2 missions live (mix easy + hard)
**[2:30-3:30]** → Showcase features (HUD, stats, decision consequences)
**[3:30-4:00]** → Mini-game demo (Scam Spot Challenge)
**[4:00-4:50]** → Learn Mode + Impact showcase
**[4:50-5:00]** → Final stats screen + Victory

---

## 12. TECHNICAL ARCHITECTURE

### Component Structure
```
App.jsx
├── AuthContext (User login)
├── GameContext (Game state)
├── HUDComponent (Stats, XP, Security)
├── MissionCard (Current mission display)
├── DecisionInterface (3-choice buttons)
├── FeedbackPopup (Correct/wrong feedback)
├── LearnMode (Educational content)
├── MiniGameArena (Mini-game system)
├── BuildingInterior (3D scam locations)
│   ├── HomeOffice (personal device)
│   ├── BankOffice (banking scenarios)
│   ├── BazaarOffice (marketplace scams)
│   ├── CyberCell (police NPCs)
│   ├── ScamLab (investigation hub)
│   └── AwarenessCenter (learn zone)
├── ProgressionSystem (XP/ranking)
└── CitySecuritySystem (Consequences)

Data Files:
├── scamDatabase.js (scam definitions)
├── educationalContent.js (learn modes)
├── missionProgression.js (mission chains)
└── scamVerse brand guide.md (design tokens)
```

---

## 13. BACKEND ENHANCEMENTS

### User Model Addition
```python
user.rank = "Elite Guardian"
user.total_xp = 5250
user.missions_completed = 45
user.citizens_saved = 42
user.city_security_contribution = 85%
user.achievements = ["First Save", "Speedrunner", "Expert Detector"]
```

### Mission Progression API
```python
GET /api/missions/{user_id}/next
POST /api/missions/{mission_id}/respond
  {decision_choice: "A", citizen_name: "Raj"}
PUT /api/user/{user_id}/progression
  {xp_earned: 20, security_change: +2}
```

---

## 14. SUCCESS METRICS FOR HACKATHON

✅ **Immediate Impact:** Players can play 1-2 missions in under 1 min
✅ **Polish Score:** Smooth animations, responsive UI, no jank
✅ **Story:** Clear narrative (cyber defender + city stakes)
✅ **Educational Value:** Learn Mode explains scam mechanics
✅ **Replayability:** 13 scam types with variations
✅ **Professional Branding:** Consistent NetGuardian theme
✅ **Hack Appeal:** Data visualization (security meter), progression tracking, decision consequences

---

## 15. DEMO SCRIPT

**Intro (15sec):**
"NetGuardian is an educational cyber-defense game where players identify real-world scams to protect a digital city called DataCity. Every decision you make affects the city's security and real citizens' lives."

**Gameplay (2.5min):**
"Watch as I encounter a Digital Arrest Scam—a sophisticated fraud that fools over 50,000 Indians annually. I need to spot the red flags and make the right call."
[Play mission, explain decision]

"That save helped the city's security increase. Let's tackle a harder scam..."
[Play second mission with wrong choice to show consequences]

"See how the city's security dropped because I missed the warning signs? Learn Mode explains why."

**Features Showcase (1min):**
- XP progression & ranking system
- Decision consequence ripples
- Mini-game challenges
- Learn Mode content

**Closing (15sec):**
"NetGuardian makes cyber-awareness engaging and measurable. Players don't just learn—they become guardians of DataCity."

---

**Design Complete! Ready for Implementation.**
