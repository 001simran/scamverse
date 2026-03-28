// educationalContent.js
// Learn Mode Content - Educational snippets after each mission

export const LEARN_MODE_CONTENT = {
  rupee_scam: {
    title: "Understanding the 1₹ Bait & Switch Scam",
    category: "E-Commerce Fraud",
    difficulty: "Beginner",
    whyItWorks: `
This scam exploits psychological vulnerability:
• GREED: "₹1 for iPhone?!" triggers immediate interest
• FOMO: "Limited stock!" creates panic buying
• TRUST IN BRANDING: Logos look official
• LAZINESS: Checkout looks similar to real sites

The scammers know that most people won't read the fine print.
`,
    mechanics: `
How the scam progresses:
1. You see ad: "iPhone 14 Pro - ₹1 ONLY!"
2. Click → Redirected to fake checkout page
3. Cart shows ₹1 but has hidden charges
4. You enter card details → Scammer captures it
5. Charged full price OR card data sold on dark web
6. No product arrives, card blocked after fraud
`,
    realWorldImpact: `
• 50,000+ cases annually in India
• Average loss per victim: ₹1,500-₹5,000
• Card data sells for ₹50-100 on dark web
• Multiple frauds can happen on same card
• Recovery rate: <10%
`,
    redFlagsToSpot: [
      "Price unrealistic (90%+ discounts)",
      "Website domain looks slightly off",
      "No SSL lock (🔒) in address bar",
      "No company contact info or address",
      "Payment gateway not verified",
      "Grammar errors in product description",
      "Pressure to buy NOW",
      "No return/refund policy mentioned"
    ],
    whatRealShopsNeverDo: [
      "Never offer 90%+ discounts via random ads",
      "Never use suspicious domains",
      "Never hide real prices",
      "Never force you to buy within hours",
      "Never prevent you from checking reviews"
    ],
    ifYouGotScammed: [
      "Immediately notify your bank",
      "Block your card",
      "File police report (Cyber Crime)",
      "Check credit report for fraud",
      "Monitor bank statements for 2-3 months",
      "Report to cybercrime.gov.in",
      "Join fraud victims groups (don't lose hope)"
    ],
    preventionTips: [
      "Buy only from official apps (Amazon, Flipkart official app)",
      "Check domain carefully before entering details",
      "Look for SSL lock (🔒) and HTTPS",
      "Use UPI/Google Pay instead of card details",
      "Never trust random ads with unbelievable prices",
      "Read reviews from verified buyers only",
      "If price is unbelievable, it probably is"
    ],
    resources: [
      "✓ Report scam: cybercrime.gov.in",
      "✓ Verify domain: whois.com",
      "✓ Check SSL: sslshopper.com",
      "✓ Real seller verification: ecommerceguideonline.com"
    ]
  },

  digital_arrest: {
    title: "The Digital Arrest Scam: India's ₹100 Crore Fraud",
    category: "Law Enforcement Impersonation",
    difficulty: "Advanced", 
    statistics: `
ALARMING DATA (2023):
• ₹100+ crores lost nationwide
• 50,000+ FIRs registered
• Average victim loss: ₹2-5 lakh
• Worst case: ₹50 lakh single victim
• Targets mainly: 40-65 year olds (70% of victims)
• Recovery rate: <1%
`,
    whyItWorks: `
The psychological manipulation is sophisticated:
• FEAR: "Police/Cyber Cell" sounds authoritative
• SHAME: "Linked to money laundering" makes victim quiet
• ISOLATION: "Don't tell family" removes support
• URGENCY: "Within 1 hour or you're arrested"
• AUTHORITY: Official police tone (pre-recorded)
• LEGITIMACY: Spoofed caller ID (looks like 100 or actual number)
`,
    theActualFlow: `
PHASE 1: THE CALL (0-5 minutes)
- Scammer calls with official-sounding name
- Claims Aadhar linked to criminal case
- Threatens immediate arrest
- Demands payment to "resolve"
- Creates fake urgency

PHASE 2: THE TRAP (5-30 minutes)
- "Don't disconnect or police will trace"
- Keeps victim on call while threatened
- Provides fake reference number
- Shows fake police setup (video call)
- Describes absurd criminal charges

PHASE 3: THE TRANSFER (30-120 minutes)
- "Send ₹50k to this UPI"
- Victim sends money in fear
- Scammer calls repeatedly with threats
- If first payment works: "Send more!"
- Eventually stops calling after ₹1-5 lakh drained
`,
    realPoliceNever: [
      "NEVER call demanding money",
      "NEVER accept digital payments (UPI)",
      "NEVER ask for OTP/passwords",
      "NEVER threaten imprisonment without formal notice",
      "NEVER ask to keep call secret",
      "NEVER suspend accounts instantly",
      "NEVER present charges without written notice"
    ],
    realPoliceAlways: [
      "Issue written notice (postal/email)",
      "Appear at your address with warrant",
      "Allow you to hire a lawyer",
      "Process through official courts",
      "Provide case/FIR number (verifiable)",
      "Accept official payments only (court fines)",
      "Keep proper records (you can check)"
    ],
    ifTargeted: [
      "HANG UP IMMEDIATELY - Don't engage",
      "DO NOT send any money",
      "Call police 100 from different phone",
      "Tell family/friends immediately",
      "Don't feel ashamed - Report it",
      "File counter-FIR at cyber cell",
      "Join support group for victims"
    ],
    preventionTips: [
      "Remember: Police NEVER call about money",
      "If called claiming authority + demanding payment = 100% SCAM",
      "Let callers talk to your family immediately",
      "Verify Aadhar on uidai.gov.in official website",
      "Know: Aadhar can't be suspended by phone",
      "If suspicious: Call 100 first before anything",
      "Tell elderly family members about this scam"
    ],
    resources: [
      "✓ Police helpline: 100",
      "✓ Cyber Cell: 1930",
      "✓ Report: cybercrime.gov.in",
      "✓ Check Aadhar: portal.uidai.gov.in"
    ]
  },

  fake_job_offer: {
    title: "Work-From-Home Job Scams: Why They Target You",
    category: "Employment Fraud",
    difficulty: "Beginner",
    psychology: `
Scammers target:
• Students needing part-time income
• Unemployed people desperate for work
• Homemakers wanting flexible income
• Retirees looking for extra earnings
• Anyone unhappy with current salary

The hook: "Earn ₹10,000/day, no experience needed, work from home"
Reality: "Pay ₹2,000 registration fee first"
`,
    whatHappens: `
Step 1: Attractive ad with unrealistic salary
Step 2: Quick "approval" without interview
Step 3: Invited to WhatsApp/Telegram group
Step 4: "Welcome to the team! Pay ₹500-2000 registration"
Step 5: After payment: "Need ₹5000 inventory to start"
Step 6: After 2-3 payments: "Your account suspended, contact support"
Step 7: No one responds, ₹10,000-50,000 gone
`,
    realJobFacts: [
      "Real companies never charge upfront fees",
      "Interview is ALWAYS part of hiring",
      "Salary discussed AFTER interview, not before",
      "Legitimate portals: Naukri, LinkedIn, Indeed, Glassdoor",
      "Official emails from company domain (not Gmail)",
      "Reference checks happen before offer",
      "Contract is written, not just verbal"
    ],
    ifYouSuspect: [
      "Ask for job description in writing",
      "Request video interview (not just chat)",
      "Never pay any registration/processing fee",
      "call company HR directly (Google the number)",
      "Check company on MCA website",
      "Search company on LinkedIn",
      "Ask to speak with real employees"
    ],
    preventionTips: [
      "If it sounds too good to be true: IT IS",
      "Never pay to get a job",
      "Apply on official company websites",
      "Verify recruiter: Check their LinkedIn",
      "Real companies use professional email",
      "Always research company first",
      "Talk to friends in that industry"
    ],
    resources: [
      "✓ Job portals: naukri.com, linkedin.com, indeed.com",
      "✓ Verify company: mca.gov.in",
      "✓ Check reviews: glassdoor.co.in",
      "✓ Report scam: cybercrime.gov.in"
    ]
  },

  love_scam: {
    title: "Romance Scams: Building Fake Trust for Real Money",
    category: "Relationship Fraud",
    difficulty: "Intermediate",
    statistics: `
HEARTBREAKING NUMBERS (2023):
• 75% of victims are women
• Average age: 35-50 years
• Average loss: ₹1-50 lakh per victim
• 100,000+ cases annually
• Most victims don't report (shame/embarrassment)
• Recovery rate: <5%
`,
    theSocialEngineering: `
Scammers use sophisticated manipulation:
• "Love-bombing": Excessive compliments early
• "Isolation": Focus on you, push other friends away
• "Fabrication": Every story supports emotional bond
• "Financial pressure": Manufactured emergencies
• "Sunk cost": "You've invested so much time"
• "Reciprocity": "I've done so much for you"
`,
    timeline: `
DAY 1-3: The Hook
• After you follow them: "You're so beautiful"
• Constant messages with compliments
• They ask personal questions (building profile)
• Every response is romantic

DAY 4-7: The Connection
• "I think I've found my soulmate"
• Share "deep" feelings quickly
• Future talk: "When we get married..."
• Make you feel special and chosen

DAY 8-10: The Setup
• "I want to visit you but..."
• Tale of woe (visa problem, sick daughter, job loss)
• "I need ₹X to fix this"
• Emotional manipulation: "If you really love me..."

DAY 11+: The Takedown
• You send money
• Person disappears with your ₹2-5 lakh
• Or demands more for "investment"
• If you reply: "Account hacked" or ghosting
`,
    redFlags: [
      "Never video calls after weeks",
      "Perfect photos (likely stolen/AI)",
      "Job seems too good to be true",
      "Story changes details over time",
      "Profile very new (check creation date)",
      "Never meets despite 'being nearby'",
      "Always has crisis needing money",
      "Asks to move offline quickly",
      "Extreme feelings expressed too fast"
    ],
    beforeSendingMoney: [
      "Video call within first week - INSIST",
      "Google reverse image search their photos",
      "Check their employment on LinkedIn",
      "Verify their phone number (WhatsApp check)",
      "Ask personal questions about their past",
      "Tell trusted friend about relationship",
      "See how they react to meeting plan",
      "NEVER send money to stranger online"
    ],
    ifYouSentMoney: [
      "Stop all contact immediately",
      "Take screenshots of all conversations",
      "Report to platform (Instagram/Facebook)",
      "File police report with proofs",
      "Contact cyber crime cell",
      "Alert your bank (to stop further fraud)",
      "Join support groups - you're not alone",
      "Don't feel ashamed - scammers are professionals"
    ],
    resources: [
      "✓ FBIInternet Crime: ic3.gov",
      "✓ Report platform: facebook.com/report",
      "✓ Police report: cybercrime.gov.in",
      "✓ Support: fraudvictimssupport.org"
    ]
  },

  investment_scam: {
    title: "Ponzi Schemes & Fake Investment Groups",
    category: "Financial Fraud",
    difficulty: "Advanced",
    theMath: `
Red Flag Math:
• Claimed: 40% monthly returns = 480% yearly
• Reality: World's best hedge funds = 20% yearly
• Stock market average = 12% yearly
• Bank FD = 6-7% yearly

If 40% monthly was real:
• ₹1,00,000 → ₹1 crore in 2 years
• Everyone would be billionaire
• World economy would collapse
• Obviously IMPOSSIBLE
`,
    howItCollapses: `
PHASE 1: BUILD TRUST (Month 1-2)
• Early investors get returns (from new investors)
• Screenshots show profits
• Members feel confident
• Recruiting friends aggressively

PHASE 2: EXPANSION (Month 2-4)
• More money pours in
• Promised returns keep coming
• Pressure to invest more ("opportunity closing")
• New recruits become sellers

PHASE 3: COLLAPSE (Month 4-6)
• Sudden "technical glitch"
• Platform goes offline
• "Under maintenance"
• Founder disappears
• All money vanished (₹10-100 crore)
• No recovery possible
`,
    realInvestmentTruths: [
      "Legitimate investments come through registered brokers",
      "SEBI registration is mandatory",
      "Real companies have offices and staff verification",
      "No investment guarantees returns",
      "Realistic returns: 10-20% maximum",
      "Proper contracts and documentation",
      "No recruitment bonuses for investors"
    ],
    preventionTips: [
      "If returns sound impossible: IT IS",
      "Verify SEBI registration (sebi.gov.in)",
      "Check company (mca.gov.in)",
      "Avoid WhatsApp/Telegram investment groups",
      "Ask: Where does profit actually come from?",
      "Get everything in writing",
      "Never share OTP or access codes",
      "Don't recruit friends into schemes"
    ],
    resources: [
      "✓ SEBI verification: sebi.gov.in",
      "✓ Company search: mca.gov.in",
      "✓ Report: cybercrime.gov.in",
      "✓ Check: scamwatch.gov.in"
    ]
  }
}

export const getLearnModeContent = (scamId) => {
  return LEARN_MODE_CONTENT[scamId] || null
}

export const getAllLearnModes = () => {
  return Object.keys(LEARN_MODE_CONTENT)
}

export default LEARN_MODE_CONTENT
