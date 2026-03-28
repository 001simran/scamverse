// scamDatabase.js
// Complete scam library with educational content for NetGuardian

export const SCAMS = {
  // ═══════════════════════════════════════════════════════════════
  // TIER 1: CLASSIC SCAMS (Easy - Good for beginners)
  // ═══════════════════════════════════════════════════════════════

  rupee_scam: {
    id: "rupee_scam",
    name: "1 Rupee Scam",
    tier: 1,
    category: "E-commerce",
    difficulty: 1,
    xpReward: 50,
    securityImpact: 1,
    description: "Product advertised for ₹1, but full payment required after order",
    victim: {
      name: "Arjun",
      age: 22,
      profession: "Student",
      avatar: "👨‍💼",
      situation: "Just saw an iPhone ad: 'BUY NOW FOR ₹1 ONLY! Limited time!'"
    },
    scamMessage: `
      🛍️ HUGE SALE! 
      iPhone 14 Pro - NOW JUST ₹1
      
      Click here 👉 bit.ly/supersal
      Hurry! Stock limited!
      
      [Order Now] [Share]
    `,
    redFlags: [
      "Price too good to be true (₹1 for a phone)",
      "Urgency created (limited stock)",
      "Shortened URL hides real destination",
      "Usually leads to payment gateway or personal info request"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Don't buy. It's a classic bait-and-switch scam.",
        isCorrect: true,
        feedback: "✅ Correct! Prices this low are impossible for genuine products.",
        xpGain: 50,
        securityGain: 2
      },
      {
        choice: "B",
        text: "Order it, you can cancel if charged later.",
        isCorrect: false,
        feedback: "❌ Wrong! Once you place order + pay full amount, cancellation is rejected.",
        xpGain: 0,
        securityGain: -1
      },
      {
        choice: "C",
        text: "Share with friends to get a referral discount.",
        isCorrect: false,
        feedback: "❌ Wrong! This spreads the scam and you still pay full price.",
        xpGain: 0,
        securityGain: -1
      }
    ],
    learnMode: {
      title: "Why the 1 Rupee Scam Works",
      explanation: `
        This scam exploits our innate desire for deals:
        
        THE PSYCHOLOGY:
        • Greed: Amazing discounts trigger impulse buying
        • Urgency: "Limited stock" prevents rational thinking
        • Trust in brands: Fake branding looks real
        • Sunk cost: You're already on fake checkout page
        
        THE MECHANICS:
        1. Attractive ad with unbelievable price
        2. Clicking takes you to fake checkout
        3. You enter payment details to complete ₹1 purchase
        4. Scammer now has your card number, CVV, OTP
        5. Charges full amount or sells card data
        
        REAL FACTS:
        • No legitimate seller offers 90%+ discounts via random links
        • Verified sellers never use bit.ly or short URLs
        • Genuine sites have https:// and verified SSL
        • Amazon/Flipkart have official apps, not links
      `,
      preventionSteps: [
        "Buy only from official apps/websites (Amazon, Flipkart, etc)",
        "Avoid clicking promoted links in messages/emails",
        "Check domain name carefully (amazon.co.in ≠ amnzon.co.in)",
        "Look for verified payment methods (SSL lock icon)",
        "Never share full card details over messaging apps",
        "Use UPI instead of card details when possible"
      ],
      resources: [
        "Report to cybercrime.gov.in",
        "Block the sender/link",
        "Tell friends about the scam"
      ]
    }
  },

  fake_job_offer: {
    id: "fake_job_offer",
    name: "Fake Job Offer",
    tier: 1,
    category: "Employment",
    difficulty: 1,
    xpReward: 50,
    securityImpact: 1,
    description: "Promise of easy money through work-from-home schemes",
    victim: {
      name: "Priya",
      age: 20,
      profession: "College Student",
      avatar: "👩‍🎓",
      situation: "Received a message about an easy online job"
    },
    scamMessage: `
      💰 URGENT HIRING! 💰
      
      Work from home, earn ₹10,000/day!
      No experience needed!
      
      ✓ Flexible hours
      ✓ Immediate joining
      ✓ No interview process
      
      WhatsApp: +91-98765XXXXX
      Link: t.me/jobopportunities
    `,
    redFlags: [
      "Unrealistic salary (₹10,000/day = ₹3L/month)",
      "No experience needed for high pay",
      "Vague job description",
      "Contact via WhatsApp/Telegram (not official portal)",
      "No company name or verification"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Block and report. Real jobs need interview and company verification.",
        isCorrect: true,
        feedback: "✅ Correct! This is a classic work-from-home scam.",
        xpGain: 50,
        securityGain: 2
      },
      {
        choice: "B",
        text: "Message them to ask more details about the job.",
        isCorrect: false,
        feedback: "❌ Wrong! They'll ask for registration fee or personal info.",
        xpGain: 0,
        securityGain: -1
      },
      {
        choice: "C",
        text: "Join their Telegram group to learn more.",
        isCorrect: false,
        feedback: "❌ Wrong! You'll be pressured into paying registration fees.",
        xpGain: 0,
        securityGain: -1
      }
    ],
    learnMode: {
      title: "Why Fake Job Scams Are Common",
      explanation: `
        This preys on unemployment and financial desperation:
        
        THE HOOK:
        • "Earn ₹10,000/day" → Seems life-changing
        • "No interview" → Skips real job process
        • "Work from home" → Sounds easy and safe
        
        WHAT REALLY HAPPENS:
        1. They ask for "processing fee" (₹500-2000)
        2. Or request initial inventory purchase
        3. Or demand personal bank details for "payment setup"
        4. You never get the job or your money back
        
        REAL JOB FACTS:
        • Legitimate companies never charge upfront fees
        • Interviews are always part of hiring
        • Salary is decided AFTER interview, not before
        • Official job portals: LinkedIn, Indeed, Naukri
        • Government jobs verified on official sites only
      `,
      preventionSteps: [
        "Verify company on Google/LinkedIn first",
        "Never pay any registration fee",
        "Apply only through official company websites",
        "Check recruiter's email domain (not Gmail for company)",
        "Ask for job description in writing",
        "Verify via company's HR phone number"
      ],
      resources: [
        "Check on naukri.com, linkedin.com",
        "Report fake recruiter profiles",
        "Verify company on Ministry of Corporate Affairs website"
      ]
    }
  },

  phishing_email: {
    id: "phishing_email",
    name: "Phishing Email Attack",
    tier: 1,
    category: "Banking/Account",
    difficulty: 1,
    xpReward: 50,
    securityImpact: 1,
    description: "Fake email posing as bank asking to update credentials",
    victim: {
      name: "Vikram",
      age: 35,
      profession: "Executive",
      avatar: "👨‍💼",
      situation: "Got an email about account verification"
    },
    scamMessage: `
      From: security@icicibank.in
      Subject: ⚠️ URGENT: Update Your Account Information
      
      Dear Customer,
      
      We detected unusual activity on your account.
      Please update your information within 24 hours or your 
      account will be temporarily suspended.
      
      [VERIFY ACCOUNT NOW] 🔗
      
      Click the link below:
      https://icicbankverify.update/
      
      - ICICI Bank Security Team
    `,
    redFlags: [
      "Email asks for sensitive info (never real banks do this)",
      "Artificial urgency (24 hours to lose account)",
      "Suspicious domain (icicbankverify.update ≠ icicibank.co.in)",
      "Generic greeting ('Dear Customer' not name)",
      "Poor grammar or formatting",
      "Link doesn't match sender address"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Delete email. Banks never ask credentials via email.",
        isCorrect: true,
        feedback: "✅ Correct! This is 100% phishing. Real banks never email verification requests.",
        xpGain: 50,
        securityGain: 2
      },
      {
        choice: "B",
        text: "Click the link but don't enter real info, just to check.",
        isCorrect: false,
        feedback: "❌ Wrong! The link itself is dangerous. It auto-logs keystrokes.",
        xpGain: 0,
        securityGain: -1
      },
      {
        choice: "C",
        text: "Reply asking for verification before updating.",
        isCorrect: false,
        feedback: "❌ Wrong! Replying confirms your email is active, triggers more scams.",
        xpGain: 0,
        securityGain: -1
      }
    ],
    learnMode: {
      title: "Understanding Phishing Attacks",
      explanation: `
        Phishing is the #1 method hackers use to steal credentials:
        
        HOW IT WORKS:
        • Scammer sends fake email/SMS from trusted source
        • Urgent message triggers emotional response
        • Victim clicks link → lands on fake login page
        • Enters credentials → Scammer captures them all
        
        WHAT HAPPENS NEXT:
        • Hacker accesses your real account
        • Steals money or personal data
        • Sells credentials on dark web
        • Uses your account to phish others
        
        RED FLAGS TO SPOT:
        ❌ Email asks for passwords/OTP/card details
        ❌ Generic greeting (not your name)
        ❌ Artificial urgency ("within 24 hours")
        ❌ Domain looks similar but different (amzn.co ≠ amazon.co.in)
        ❌ Spelling/grammar mistakes
        ❌ Asks to click link instead of visiting main site
        
        WHAT REAL BANKS DO:
        ✅ NEVER ask for password via email
        ✅ NEVER send OTP links
        ✅ ALWAYS use official domain names
        ✅ Call you about suspicious activity, not email
      `,
      preventionSteps: [
        "Hover over sender email - check real address",
        "Verify domain name carefully (check after @ symbol)",
        "Go directly to website (type in address bar), don't click links",
        "Check for SSL lock (🔒) on website",
        "Enable two-factor authentication on all accounts",
        "Update passwords regularly (mix uppercase, numbers, symbols)",
        "Report phishing to bank's official email"
      ],
      resources: [
        "Report to phishing@icici.co.in (or bank's official email)",
        "Check www.antiphishing.org",
        "File complaint at cybercrime.gov.in"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2: INTERMEDIATE SCAMS (Medium - Core gameplay)
  // ═══════════════════════════════════════════════════════════════

  digital_arrest: {
    id: "digital_arrest",
    name: "Digital Arrest Scam",
    tier: 2,
    category: "Legal Threat",
    difficulty: 3,
    xpReward: 100,
    securityImpact: 2,
    description: "Fake authority claiming Aadhar/account suspended, demanding payment",
    victim: {
      name: "Rajesh",
      age: 55,
      profession: "Small Business Owner",
      avatar: "👨‍💼",
      situation: "Got a scary call about account suspension"
    },
    scamMessage: `
      📞 Incoming Call from "+91-XXXX500012"
      
      [SCAMMER]: "Hello! This is Cyber Crime Cell speaking. 
      Your Aadhar number has been linked to a money 
      laundering case. Your account is suspended.
      
      You need to pay ₹50,000 immediately through UPI or 
      we'll file an FIR against you. You'll go to jail."
      
      [SCAMMER]: "Don't tell anyone. Don't even contact 
      your family. Transfer money NOW or police is coming."
    `,
    redFlags: [
      "Calls claiming authority (police never call this way)",
      "Demand for immediate payment (₹50,000)",
      "Threats of jail/legal action",
      "Asking to keep it secret (real authorities don't)",
      "UPI payment method (police don't accept UPI)",
      "Caller blocks your outgoing calls during 'investigation'",
      "Requests personal info (Aadhar, bank details)"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Hang up immediately. Police never call for money. Report it.",
        isCorrect: true,
        feedback: "✅ CORRECT! This is a sophisticated scam that has robbed lakhs from people.",
        xpGain: 100,
        securityGain: 3
      },
      {
        choice: "B",
        text: "Pay ₹50k to avoid legal trouble. it's worth the safety.",
        isCorrect: false,
        feedback: "❌ WRONG! Real police won't call or demand digital payment. You're out ₹50k.",
        xpGain: 0,
        securityGain: -2
      },
      {
        choice: "C",
        text: "Tell the scammer you'll contact the cyber cell yourself.",
        isCorrect: false,
        feedback: "❌ WRONG! This confirms your phone is active. They'll call repeatedly.",
        xpGain: 0,
        securityGain: -2
      }
    ],
    learnMode: {
      title: "The Digital Arrest Scam: A ₹100 Crore Fraud",
      explanation: `
        This is India's most profitable scam, targeting elderly and vulnerable:
        
        THE PSYCHOLOGY:
        • Fear of legal action paralyzes decision-making
        • Shame about "laundering" prevents telling family
        • Authority voice (official tone) sounds credible
        • Forced isolation (keep secret) removes safety net
        
        THE ACTUAL FLOW:
        1. Scammer calls posing as Police/Income Tax/Cyber Cell
        2. Claims your Aadhar is suspended/involved in crime
        3. Demands immediate payment to avoid "arrest"
        4. Often initiates video call to show fake police setup
        5. Continuously calls/threatens until ₹1-5 lakh transferred
        6. Victim too ashamed to report
        
        VICTIMS LOST (2023):
        • ₹100+ crores in India alone
        • 50,000+ cases registered
        • Average loss: ₹2-5 lakh per victim
        • Worst cases: ₹50+ lakh loss
        
        REAL FACTS ABOUT POLICE:
        🚨 Police NEVER:
        ❌ Call demanding money
        ❌ Accept UPI/digital payments
        ❌ Require payment "within 1 hour"
        ❌ Ask you to keep calls secret
        ❌ Suspend Aadhar via phone call
        ❌ Threaten imprisonment without formal FIR
        
        🚨 Police ALWAYS:
        ✅ Issue written notice
        ✅ Come to your address with warrant
        ✅ Allow you to hire a lawyer
        ✅ Process through official courts
      `,
      preventionSteps: [
        "Remember: Police NEVER call for money",
        "Hang up immediately if caller demands payment",
        "Call 100 or your local police station directly",
        "Never let caller keep you on phone alone",
        "Tell family/friends immediately about such calls",
        "Don't share Aadhar/OTP/banking details over call",
        "Check Aadhar status on official UIDAI website",
        "If threatened, file counter-FIR at cyber cell",
        "Register complaint at cybercrime.gov.in"
      ],
      resources: [
        "Police helpline: 100",
        "Cyber Cell: 1930",
        "Report at cybercrime.gov.in",
        "Check Aadhar: portal.uidai.gov.in"
      ]
    }
  },

  love_scam: {
    id: "love_scam",
    name: "Romance/Love Scam (NRI Marriage)",
    tier: 2,
    category: "Relationship",
    difficulty: 2,
    xpReward: 100,
    securityImpact: 2,
    description: "Fake person builds emotional connection, then asks for money",
    victim: {
      name: "Neha",
      age: 28,
      profession: "Software Engineer",
      avatar: "👩‍💼",
      situation: "Met someone online who seems perfect"
    },
    scamMessage: `
      💬 Instagram DM:
      
      Hi beautiful! My name is Michael, I'm a 32-year-old 
      software engineer working in USA. Your smile is so 
      lovely. Can I get your WhatsApp?
      
      [After 2 weeks of chatting...]
      
      "Neha, I think I'm falling for you. I want to marry you 
      and bring you to America. Let's make this official!
      
      But there's a problem - I need ₹2 lakh for my visa 
      process. I'll repay you once I'm in US. Can you send 
      it? You're my soulmate!"
    `,
    redFlags: [
      "Perfect profile (model photos from Google)",
      "Too much attention too quickly (love-bombing)",
      "Pushes relationship very fast (marriage in 2 weeks)",
      "Stories keep changing (emotional manipulation)",
      "Never available for video call (fake person)",
      "Always problems needing money (visa, medical, business)",
      "Asks for money before meeting",
      "Profile created recently, few followers"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Ask for video call immediately. Don't send money before meeting.",
        isCorrect: true,
        feedback: "✅ CORRECT! Real relationships need real verification.",
        xpGain: 100,
        securityGain: 2
      },
      {
        choice: "B",
        text: "Send ₹2 lakh for visa. He'll repay you after marriage.",
        isCorrect: false,
        feedback: "❌ WRONG! Once money sent, the person disappears forever. You've lost ₹2L.",
        xpGain: 0,
        securityGain: -2
      },
      {
        choice: "C",
        text: "Ask mutual friends to verify his real identity first.",
        isCorrect: false,
        feedback: "⚠️ PARTIAL! Smart move, but best is direct video call verification.",
        xpGain: 75,
        securityGain: 1
      }
    ],
    learnMode: {
      title: "The Romance Scam: Building Fake Trust",
      explanation: `
        Love scams exploit our deepest human needs: connection & trust:
        
        THE SCAMMER'S PLAYBOOK (Days 1-14):
        Day 1-3: "I'm so impressed by you!"
        Day 4-7: "I think you're my soulmate"
        Day 8-10: "Let's get married"
        Day 11+: "I need money for visa/treatment/business"
        
        PSYCHOLOGICAL TACTICS:
        • Love-bombing: Excessive compliments early
        • Isolation: Focus on victim, fewer other connections
        • Fabricated emergencies: Create urgency
        • Reciprocity: "I'm doing so much for you"
        • Sunk cost: "You've invested so much time"
        
        COMMON EXCUSES FOR MONEY:
        ₹2-5 lakh: Visa/travel expenses
        ₹1-3 lakh: Medical emergency
        ₹5-10 lakh: Business investment opportunity
        ₹50,000+: "Transfer money to prove love"
        
        STATISTICS:
        • Victims lose ₹1-50 lakh on average
        • Average age of victim: 30-40 years
        • Mostly targeted at women (75% cases)
        • Peak time: Evening (emotional vulnerability)
        
        RED FLAGS:
        ❌ Never video calls after "months" of chatting
        ❌ Perfect photos (literally from Instagram/stock sites)
        ❌ Always tragic stories (dead wife, sick child)
        ❌ Asks to move offline quickly (to different chat app)
        ❌ Never meets despite "being nearby"
        ❌ Job seems fake (too good to be true)
      `,
      preventionSteps: [
        "Video call within first week - insist on it",
        "Never send money before physical meeting",
        "Google reverse image search their photos",
        "Check profile creation date (brand new = red flag)",
        "Ask personal questions that real person would know",
        "Tell trusted friend about new relationship",
        "Meet in public place first time",
        "Verify employment on LinkedIn/company website",
        "Never share OTP, banking details, or passport scans",
        "If person disappears after money = scam confirmed"
      ],
      resources: [
        "Report fake profile to social media platform",
        "File complaint at cybercrime.gov.in",
        "Block on all platforms",
        "Tell your bank to stop further transfers"
      ]
    }
  },

  lottery_prize_scam: {
    id: "lottery_prize_scam",
    name: "Prize/Lottery Scam",
    tier: 2,
    category: "Fake Rewards",
    difficulty: 2,
    xpReward: 100,
    securityImpact: 2,
    description: "Claiming you won a lottery you never entered",
    victim: {
      name: "Anil",
      age: 50,
      profession: "Retired",
      avatar: "👨‍🦳",
      situation: "Received winning notification"
    },
    scamMessage: `
      🎉 CONGRATULATIONS! 🎉
      
      You have won the MEESHO LUCKY DRAW!
      Prize: ₹ 1,00,000 (1 LAKH RUPEES)
      
      Ticket #: ML-2847492-2024
      
      To claim your prize, visit:
      www.meesho-lucky.prize-instant.com
      
      Or call: +91-8765432100
      
      Hurry! Claim within 24 hours or prize is forfeited!
      
      - Meesho Rewards Team
    `,
    redFlags: [
      "You never entered any lottery",
      "Website domain looks similar but different",
      "Urgent deadline (24 hours)",
      "No official Meesho branding",
      "Asks for personal details to claim",
      "Requests payment for 'processing' or 'tax'",
      "Generic greeting, not personalized",
      "Grammar/formatting issues"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Delete it. You didn't enter any lottery. It's a scam.",
        isCorrect: true,
        feedback: "✅ CORRECT! Legitimate lotteries don't work this way.",
        xpGain: 100,
        securityGain: 2
      },
      {
        choice: "B",
        text: "Click link to verify you won and see prize details.",
        isCorrect: false,
        feedback: "❌ WRONG! Clicking leads to phishing page that steals your data.",
        xpGain: 0,
        securityGain: -2
      },
      {
        choice: "C",
        text: "Call the number to confirm before claiming.",
        isCorrect: false,
        feedback: "❌ WRONG! The number is the scammer's. You'll be asked for payment.",
        xpGain: 0,
        securityGain: -2
      }
    ],
    learnMode: {
      title: "Why Lottery Scams Work (You Never Entered)",
      explanation: `
        This exploits hope and desire for easy money:
        
        THE ILLUSION:
        • Victim gets random notification
        • Brain sees ₹1 lakh = immediate hope
        • Urgency ("24 hours") bypasses skepticism
        • Sees legitimate branding (Meesho logo copied)
        
        WHAT HAPPENS NEXT:
        1. You click link → Fake website
        2. Asked for "personal verification"
        3. Given bank account to transfer "processing fee" (₹500-₹2,000)
        4. After fee paid, you're simply ghosted
        5. No prize ever comes
        
        VICTIMS REPORT:
        • Lost ₹500-₹5,000 on average
        • 100,000+ cases in 2023
        • Often victims of multiple rounds
        
        REAL FACTS:
        ✅ Legitimate lottery info:
        • Never comes via random SMS/email
        • Only in official app/website
        • Always has specific ticket purchase record
        • Never asks for "processing fee" (prize minus tax already paid)
        • Announcement is official and traceable
      `,
      preventionSteps: [
        "Remember: If you didn't buy lottery, you can't win it",
        "Never click links in unsolicited prizes messages",
        "Verify via official lottery website directly",
        "Never pay any fee to claim prize",
        "Check if lottery is actually real (search official site)",
        "Report fake lottery notifications to police",
        "Block senders of such messages",
        "Check your credit report for fraud"
      ],
      resources: [
        "Report to cybercrime.gov.in",
        "Verify at official lottery sites",
        "Report to platform (Meesho, etc) if impersonated"
      ]
    }
  },

  refund_scam: {
    id: "refund_scam",
    name: "Refund/Tax Scam",
    tier: 2,
    category: "Government Impersonation",
    difficulty: 2,
    xpReward: 100,
    securityImpact: 2,
    description: "Fake refund from income tax, asking for verification details",
    victim: {
      name: "Ananya",
      age: 32,
      profession: "Software Developer",
      avatar: "👩‍💻",
      situation: "Got notification about tax refund"
    },
    scamMessage: `
      📧 Email from "income-tax-india@gov.in"
      
      Subject: Your income tax refund of ₹34,567 is ready!
      
      Dear Taxpayer,
      
      Your income tax return has been processed. 
      A refund of ₹34,567 has been approved.
      
      To receive this refund to your account, please:
      1. Click here to verify → [LINK]
      2. Enter your PANID and bank details
      3. OTP will be sent for confirmation
      
      This offer is valid for 48 hours only!
      
      - Department of Income Tax
    `,
    redFlags: [
      "Income tax never gives refunds via email/SMS",
      "Asks for PAN + bank details (real IT never does)",
      "Fake domain (income-tax-india@gov.in, real is @incometax.gov.in)",
      "Artificial 48-hour urgency",
      "Shortened link to phishing site",
      "Requests OTP (real IT portal never)",
      "Generic greeting"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Log into official incometax.gov.in directly. Never click email links.",
        isCorrect: true,
        feedback: "✅ CORRECT! Income tax portals never email verification requests.",
        xpGain: 100,
        securityGain: 2
      },
      {
        choice: "B",
        text: "Click link and enter PAN to claim your refund.",
        isCorrect: false,
        feedback: "❌ WRONG! You've given scammer your PAN. Identity theft risk now high.",
        xpGain: 0,
        securityGain: -2
      },
      {
        choice: "C",
        text: "Reply to email asking for more details.",
        isCorrect: false,
        feedback: "❌ WRONG! Replying confirms email is active, triggers more scams.",
        xpGain: 0,
        securityGain: -1
      }
    ],
    learnMode: {
      title: "Government Impersonation Scams",
      explanation: `
        These scams abuse trust in government institutions:
        
        THE TARGETS:
        • Middle-class professionals (likely have taxable income)
        • Elderly (fear of missing government benefits)
        • New businessmen (handling first ITR)
        
        COMMON VARIATIONS:
        • Income tax refund (₹30k-₹50k false refunds)
        • GST refund (business tax returns)
        • Pension increase notification
        • Subsidy/welfare benefits
        
        IMPACT IF VICTIM:
        • PAN compromised → identity theft
        • Bank details stolen → fraud transfers
        • OTP captured → account takeover
        • Loss: ₹3-50 lakh in linked accounts
        
        WHAT REAL INCOME TAX NEVER DOES:
        ❌ Never emails/SMSs verification requests
        ❌ Never asks for passwords
        ❌ Never demands OTP over call
        ❌ Never sends refunds without proper verification
        ❌ Never gives 48-hour urgency
        
        REAL INCOME TAX PROCESS:
        ✅ Refunds show in portal (portal.incometax.gov.in)
        ✅ Direct transfer to bank (automatically)
        ✅ Official letter sent by post
        ✅ No password/OTP demands
      `,
      preventionSteps: [
        "Never click links in unsolicited refund emails",
        "Log into official portal directly (incometax.gov.in)",
        "Check refund status in 'My Account' section",
        "Never share PAN unless filing official ITR",
        "Use strong unique passwords for tax portals",
        "Enable two-factor authentication",
        "Report fake notifications to cybercrime.gov.in",
        "Forward phishing emails to IT dept",
        "Check refund history quarterly on official site"
      ],
      resources: [
        "Official: portal.incometax.gov.in",
        "Report: cybercrime.gov.in",
        "Check PAN status: pannindia.tin.nsdl.com"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3: ADVANCED SCAMS (Hard)
  // ═══════════════════════════════════════════════════════════════

  investment_scam: {
    id: "investment_scam",
    name: "Investment/Crypto Scam (Ponzi)",
    tier: 3,
    category: "Financial",
    difficulty: 4,
    xpReward: 150,
    securityImpact: 3,
    description: "Guaranteed returns investment scheme (Ponzi scheme)",
    victim: {
      name: "Karthik",
      age: 42,
      profession: "IT Consultant",
      avatar: "👨‍💼",
      situation: "Got investment opportunity on LinkedIn"
    },
    scamMessage: `
      💼 LinkedIn Message:
      
      Hi Karthik! I'm Sameer, portfolio manager at 
      "Quantum Investment Group". 
      
      We're offering LIMITED spots in our private Bitcoin 
      investment group. Guaranteed 40% monthly returns!
      
      Minimum: ₹1 Lakh
      Already ₹50 Cr invested by 1000+ members
      
      ROI proof: [Screenshot of fake returns]
      
      Spots closing in 48 hours. In?
      
      Join Telegram: t.me/quantum_investors
    `,
    redFlags: [
      "Guaranteed returns (40%/month = 480%/year - impossible)",
      "Minimum investment (₹1L+ = red flag)",
      "False social proof (₹50Cr+ invested)",
      "Urgency (spots closing soon)",
      "Screenshots of fake profits",
      "Private group (Telegram/WhatsApp - hard to verify)",
      "No registered company details",
      "Pressure to recruit friends (multi-level)"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Don't invest. No investment guarantees 40%/month. It's a Ponzi scheme.",
        isCorrect: true,
        feedback: "✅ CORRECT! 40% monthly = 480% yearly is mathematically impossible.",
        xpGain: 150,
        securityGain: 3
      },
      {
        choice: "B",
        text: "Invest ₹1 Lakh to test. If returns come, invest more.",
        isCorrect: false,
        feedback: "❌ WRONG! You'll get fake 'profits' (your own money returned) to trick you. Then demand more to 'unlock' them. Total loss: ₹5-50 Lakh.",
        xpGain: 0,
        securityGain: -3
      },
      {
        choice: "C",
        text: "Ask for company registration and SEBI license first.",
        isCorrect: false,
        feedback: "⚠️ PARTIAL! Good thinking, but they'll show fake documents. Best is to not invest at all.",
        xpGain: 100,
        securityGain: 2
      }
    ],
    learnMode: {
      title: "Investment Scams & Ponzi Schemes",
      explanation: `
        These scams exploit wealth-building dreams:
        
        THE MATH THAT DOESN'T WORK:
        • Claimed: 40% monthly = 480% yearly
        • Reality: Best hedge funds = 15-20% yearly
        • Stock market average = 12% yearly
        • Bank FDs = 6-7% yearly
        • If 40% monthly were real, everyone would be billionaire
        
        THE PONZI SCHEME CYCLE:
        Phase 1 (Month 1-3): Early investors get real returns
          → Funded by your money + new investor money
          → Victims feel confident
        
        Phase 2 (Month 3-6): Returns slow slightly
          → Pressure to recruit friends
          → "Exclusive opportunity" for close circle
        
        Phase 3 (Month 6-12): Collapse
          → Platform disappears
          → Website goes offline
          → Founder vanishes with all money
          → New investors lose everything
        
        ACTUAL CASES:
        • 2023: "WazirX" Bitcoin scam - ₹2000+ Cr lost
        • 2022: "OneCoin" - ₹5000+ Cr fraudulently collected
        • Average investor loss: ₹5-50 Lakh
        • Recovery rate: <5%
        
        LEGITIMATE INVESTMENTS:
        ✅ Come through registered brokers
        ✅ Have SEBI registration
        ✅ Clear risk disclosure
        ✅ Real company with verifiable history
        ✅ Returns realistic (10-20% max)
        ✅ No recruitment schemes
      `,
      preventionSteps: [
        "Remember: If returns seem too good, it's too good to be true",
        "Verify SEBI registration (sebi.gov.in)",
        "Check company registration (mca.gov.in)",
        "Never trust WhatsApp/Telegram groups for investments",
        "Ask questions: Where does profit come from? What's the business model?",
        "Get everything in writing (official documents)",
        "Never share OTP or banking access",
        "Don't recruit friends into schemes",
        "Check for online reviews on scam databases"
      ],
      resources: [
        "Verify SEBI registration: sebi.gov.in",
        "Verify company: mca.gov.in",
        "Report investment scams: cybercrime.gov.in",
        "Check on scamwatch.gov.in"
      ]
    }
  },

  tech_support_scam: {
    id: "tech_support_scam",
    name: "Tech Support Scam",
    tier: 3,
    category: "Technical Deception",
    difficulty: 3,
    xpReward: 150,
    securityImpact: 3,
    description: "Pop-up claiming virus, asking to call support number",
    victim: {
      name: "Mrs. Sharma",
      age: 60,
      profession: "Homemaker",
      avatar: "👩‍🦴",
      situation: "Got scary virus warning on laptop"
    },
    scamMessage: `
      🖥️ COMPUTER WARNING POP-UP:
      [❌] YOUR COMPUTER IS INFECTED [❌]
      
      ⚠️ VIRUS DETECTED ⚠️
      
      Trojan.Win32.Conficker
      
      Your files are at risk!
      Your passwords are being stolen!
      
      DO NOT RESTART YOUR COMPUTER
      
      📞 CALL MICROSOFT SUPPORT IMMEDIATELY:
      +91-8765-432-100
      
      "Reference ID: 847382-8"
      
      [OPEN SUPPORT]
    `,
    redFlags: [
      "Random terrifying warning (fake browser alert)",
      "Real Windows logo (impersonation)",
      "Tells you NOT to restart (manipulation)",
      "Phone number on screen (never happens)",
      "Reference ID (looks official)",
      "Threatening tone (creates urgency)",
      "Can't close the pop-up easily",
      "Pressures to call immediately"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Close browser immediately. Run antivirus. Don't call the number.",
        isCorrect: true,
        feedback: "✅ CORRECT! Pop-ups are scams. Real Microsoft never uses them.",
        xpGain: 150,
        securityGain: 3
      },
      {
        choice: "B",
        text: "Call the number to get your computer fixed.",
        isCorrect: false,
        feedback: "❌ WRONG! They'll trick you into giving remote access. Loss: ₹10-50k + security breach.",
        xpGain: 0,
        securityGain: -3
      },
      {
        choice: "C",
        text: "Restart computer immediately to clear virus.",
        isCorrect: false,
        feedback: "⚠️ UNHELPFUL! Restarting won't hurt, but the pop-up wasn't real anyway.",
        xpGain: 75,
        securityGain: 1
      }
    ],
    learnMode: {
      title: "Tech Support Scams",
      explanation: `
        These exploit fear of technical problems:
        
        THE MECHANICS:
        1. Scammer buys ads on porn/piracy sites
        2. Pop-up redirects to fake warning page
        3. User sees official-looking Windows alert
        4. "Call now" button highlights
        5. When user calls: "We'll fix it for ₹2,000-5,000"
        6. They ask for remote access (TeamViewer/AnyDesk)
        7. Once inside, they:
           - Screenshot banking credentials
           - Install malware
           - Steal OTP for money transfer
           - Ask for payment
        
        THE VICTIM'S EXPERIENCE:
        "Sir, I can see your virus. Let me fix it."
        → Gives remote access
        → Scammer shows fake terminal (command prompt)
        → "See? Virus is here. That'll be ₹3,000"
        → Opens fake banking system
        → "You can pay directly from here"
        
        ACTUAL LOSS SCENARIOS:
        • Direct payment: ₹2,000-5,000
        • If banking access given: ₹10,000-5,00,000
        • Identity theft: Irreversible damage
        
        RED FLAGS:
        ❌ Windows never shows phone numbers
        ❌ Pop-up appears on random website
        ❌ Can't close the pop-up
        ❌ Threatening language about viruses
        ❌ Asks to call now
        ❌ Mentions specific malware names
        
        REAL WINDOWS WARNINGS:
        ✅ Only in Windows settings/control panel
        ✅ No phone numbers ever shown
        ✅ Easy to dismiss
        ✅ Professional language
        ✅ No urgency or threats
      `,
      preventionSteps: [
        "If you see pop-up: Press Alt+F4 or Ctrl+W to close tab",
        "Don't click on pop-up buttons",
        "Never call numbers on random alerts",
        "Use antivirus (Windows Defender is free and good)",
        "Scan questionable files with virustotal.com",
        "Don't give remote access to strangers",
        "If you gave access: Change all passwords immediately",
        "Report malicious ads to website/browser",
        "Keep Windows updated automatically"
      ],
      resources: [
        "Run Windows Defender scan",
        "Official support: microsoft.com/support",
        "Report to: cybercrime.gov.in"
      ]
    }
  },

  upi_payment_scam: {
    id: "upi_payment_scam",
    name: "UPI Payment Reversal Scam",
    tier: 3,
    category: "Payment",
    difficulty: 3,
    xpReward: 150,
    securityImpact: 3,
    description: "Fake reversal claim, asking you to resend money",
    victim: {
      name: "Divya",
      age: 26,
      profession: "Student",
      avatar: "👩‍🎓",
      situation: "Got message from someone claiming money was sent by accident"
    },
    scamMessage: `
      WhatsApp Message:
      
      "Hi! I think I sent you ₹5,000 by accident on UPI. 
      Can you reverse it back to me? 
      
      I'm your friend Rohan from college. 
      Don't have access to bank right now.
      
      Please transfer back to this UPI: 
      9876543210@paytm"
    `,
    redFlags: [
      "You don't know this person (or don't remember)",
      "UPI can't be 'reversed' - sender can only report fraud",
      "Asking you to transfer (not using app's refund feature)",
      "Story created sense of obligation",
      "Unusual UPI handle (random numbers)",
      "Pressure in tone (don't have bank access)",
      "No verification of identity",
      "Uses official-sounding bank names (Paytm, etc)"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Ask them to use their phone's UPI app to request refund. Don't send money.",
        isCorrect: true,
        feedback: "✅ CORRECT! UPI has built-in refund feature. Person would use that.",
        xpGain: 150,
        securityGain: 3
      },
      {
        choice: "B",
        text: "Send ₹5,000 back to the UPI ID they gave.",
        isCorrect: false,
        feedback: "❌ WRONG! You've just sent ₹5k to a scammer. They disappear after.",
        xpGain: 0,
        securityGain: -3
      },
      {
        choice: "C",
        text: "Call your bank first, then decide.",
        isCorrect: false,
        feedback: "⚠️ BETTER! At least you'd get advice, but best is to just ask them to use UPI app.",
        xpGain: 100,
        securityGain: 2
      }
    ],
    learnMode: {
      title: "Payment Reversal & UPI Scams",
      explanation: `
        This exploits UPI's ease with a social engineering angle:
        
        WHY IT WORKS:
        • People trust "friends" easily
        • Assume payment mistakes happen
        • Don't question the UPI refund process
        • Feel obligated to help ("friend in need")
        
        THE TRUTH ABOUT UPI:
        ✅ UPI has automated refund feature in app
        ✅ Original sender can request refund via app
        ✅ Receiver can accept/reject refund request
        ✅ No need to manually transfer back
        
        SCAMMER'S ANGLE:
        "I sent money by accident" is common opener
        → Victim feels empathy
        → Victim transfers back quickly
        → Scammer now has ₹5k + original ₹5k = ₹10k
        → (If original ₹5k was stolen credit card, scammer profits)
        
        VARIATIONS:
        • Uber/Zomato overpayment
        • Accidental transfer to wrong number
        • Verification payment that "failed"
        • "I sent you extra money, send back"
        
        HOW SCAMMER USES YOUR MONEY:
        1. Takes your ₹5k transfer
        2. Repeats with 100+ people
        3. Converts to crypto (untraceable)
        4. Disappears with ₹5-10 Lakh
        
        REAL PAYMENT DISPUTES:
        ✅ Always handled through bank/app
        ✅ Never asking for manual transfer
        ✅ Takes 24-48 hours officially
        ✅ Creates transaction record
      `,
      preventionSteps: [
        "When someone says 'sent by accident', ask them to use UPI refund feature",
        "Verify person's identity before transferring money",
        "Never transfer money to unknown UPI IDs",
        "Always use UPI app's refund request feature",
        "Check transaction history in app before agreeing",
        "If amount seems odd, call person directly",
        "Never send money to phone numbers, use UPI ID",
        "Report suspicious UPI IDs to your bank"
      ],
      resources: [
        "Report to bank's cybercrime cell",
        "Block UPI ID in your app",
        "Report to cybercrime.gov.in"
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 4: EXPERT SCAMS (Extreme - For champions)
  // ═══════════════════════════════════════════════════════════════

  business_impersonation: {
    id: "business_impersonation",
    name: "Business/Bank Impersonation (Deep)",
    tier: 4,
    category: "Impersonation",
    difficulty: 5,
    xpReward: 200,
    securityImpact: 4,
    description: "Sophisticated impersonation of real business with perfect details",
    victim: {
      name: "Akshay",
      age: 38,
      profession: "Business Owner",
      avatar: "👨‍💼",
      situation: "Gets call from 'ICICI Bank' with account details"
    },
    scamMessage: `
      📞 Incoming Call - Caller ID: ICICI-120 (looks real!)
      
      "Good afternoon Mr. Akshay. This is Priya from ICICI 
      Bank's Business Account team.
      
      I have your account right in front of me - 
      Account ending in 4567. 
      
      We're offering an EXCLUSIVE business credit line of 
      ₹50 lakhs at just 8% interest, approved already!
      
      Just need to verify your account - What's your 
      savings account password so I can complete paperwork? 
      It'll take 30 seconds."
    `,
    redFlags: [
      "Caller ID spoofed to look like ICICI",
      "Knows real account details (stolen from database breach)",
      "Offer seems legitimate (real banks do business loans)",
      "Soft voice (creates false trust)",
      "Asks for password over call (red flag)",
      "Creates urgency (limited offer)",
      "Pressure (paperwork just needs password)",
      "Legitimate-sounding reasoning"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Banks NEVER ask passwords over phone. Say 'No' and hang up. Call ICICI's official number.",
        isCorrect: true,
        feedback: "✅ CORRECT! Banks never request passwords over calls, EVER.",
        xpGain: 200,
        securityGain: 4
      },
      {
        choice: "B",
        text: "Give password. They have your account info already so they seem real.",
        isCorrect: false,
        feedback: "❌ CATASTROPHIC! Account takeover instant. Scammer transfers all business funds. Loss: ₹5-50 Lakh+",
        xpGain: 0,
        securityGain: -4
      },
      {
        choice: "C",
        text: "Ask for call-back number and check later if it's real.",
        isCorrect: false,
        feedback: "⚠️ PARTIAL! Smart questioning, but scammer will give spoof number. Best is hang up and call official bank.",
        xpGain: 100,
        securityGain: 2
      }
    ],
    learnMode: {
      title: "Advanced Impersonation & Social Engineering",
      explanation: `
        This is the most dangerous category - even smart people fall for this:
        
        WHY EXPERT SCAMS WORK:
        • Scammers have real account info from data breaches
        • They call with spoofed Caller IDs
        • They know the banking system language
        • They create urgency around legitimate products
        • Victims assume "they have my info = they're real"
        
        DATA SOURCES FOR SCAMMERS:
        💾 Major breaches in 2022-2024:
        • ICICI Bank: 10M customer records leaked
        • LinkedIn: 700M profiles scraped
        • NPCI/UPI: Account data on dark web
        • Telecom companies: Billions of records
        
        SCAMMER'S ARSENAL:
        📱 Caller ID spoofing: Makes call look like "ICICI-120"
        📧 Email spoofing: Looks like official ICICI email
        🔗 Domain spoofing: icicbank.co.in vs icici-bank.co.in
        📋 Social engineering: Knows your account details
        
        THE CONVERSATION FLOW:
        1. Call sounds professional ✓
        2. Reference real account ✓
        3. Offer seems legitimate ✓
        4. Creates urgency ✓
        5. Asks "small verification" (password) ✗ RED FLAG
        
        WHAT HAPPENS AFTER PASSWORD SHARED:
        Instant account takeover:
        • Access your online banking
        • Transfer all funds to mule accounts
        • Change password/lock you out
        • Too late to reverse transaction
        • Money in Singapore/crypto in 12 hours
        
        ACTUAL CASES:
        • 2023: ICICI Bank CFO almost scammed ₹1 Cr
        • 2022: Business owner lost ₹2 Cr from spoofed call
        • Recovery rate: <1%
        
        BANKS & INSTITUTIONS NEVER ASK:
        ❌ Passwords over phone
        ❌ OTP over any channel except official app/SMS
        ❌ Full card details over call
        ❌ Banking passwords on email if you reply
        ❌ Personal verification "to confirm"
        
        REAL BANK PRACTICES:
        ✅ Official number on back of card/bank statement
        ✅ You call them, they don't call first
        ✅ Passwords only entered in secure session
        ✅ OTP only valid < 5 minutes
        ✅ Written confirmation for major transactions
      `,
      preventionSteps: [
        "If asked for password over call: Hang up immediately. It's always a scam.",
        "Verify numbers: Use official bank website/card, not caller ID",
        "Never confirm details over phone (don't say 'yes' to account details)",
        "Registered businesses: Verify GST number on gstportal.gov.in",
        "Email verification: Check real domain (not @gmail impersonating)",
        "Call bank back: Disconnect call, use official number from card",
        "Document the call: Note time/number/what they asked",
        "Report immediately: Email bank + cybercrime.gov.in + NPCI",
        "Freeze accounts: Call bank to put hold on transfers",
        "Check transaction logs: Review banking app history"
      ],
      resources: [
        "Report to cybercrime.gov.in immediately",
        "Contact your bank's fraud department",
        "File FIR at local police station",
        "Verify businesses: gstportal.gov.in (GST number)",
        "Check email domains: Email headers reveal real sender"
      ]
    }
  },

  cryptocurrency_scam: {
    id: "cryptocurrency_scam",
    name: "Cryptocurrency Investment Scam",
    tier: 4,
    category: "Cryptocurrency",
    difficulty: 4,
    xpReward: 200,
    securityImpact: 4,
    description: "Promises of crypto millionaire status with guaranteed returns",
    victim: {
      name: "Ravi",
      age: 32,
      profession: "IT Professional",
      avatar: "👨‍💻",
      situation: "Got Instagram DM about crypto investment group"
    },
    scamMessage: `
      DM from @crypto_millionaires:
      
      "We saw your profile. You look like someone 
      interested in crypto wealth. 
      
      Join our PRIVATE Bitcoin trading group 
      (Only 50 members - super exclusive).
      
      Members making ₹5-10 Lakh MONTHLY!
      
      Join: t.me/crypto_profit_makers
      Entry: 0.5 Bitcoin (~₹25 Lakh)
      
      Expected ROI: 20-30% monthly
      
      Proof: [Screenshots of fake profits]
      
      DM for WhatsApp group link"
    `,
    redFlags: [
      "Private exclusive group (impossible to verify)",
      "Guaranteed monthly returns (20-30%)",
      "Very high entry fee (₹25 Lakh minimum)",
      "Screenshots of fake crypto wallets",
      "Pressure to join immediately",
      "Requests to recruit others (multi-level)",
      "No registered crypto exchange",
      "Uses personal messaging (not official platform)"
    ],
    responseOptions: [
      {
        choice: "A",
        text: "Don't invest. Crypto doesn't guarantee 20-30% monthly. Block them.",
        isCorrect: true,
        feedback: "✅ CORRECT! This is a Ponzi scheme using crypto as cover.",
        xpGain: 200,
        securityGain: 4
      },
      {
        choice: "B",
        text: "Invest ₹25 Lakh to see if profits really come. If 3 months good, invest more.",
        isCorrect: false,
        feedback: "❌ DISASTER! You'll get fake 'profits' (from other victims' money) for 3 months. Then collapse. Total loss: ₹25L+ if 'reinvestment' happens.",
        xpGain: 0,
        securityGain: -4
      },
      {
        choice: "C",
        text: "Join the group first to see proof of profits.",
        isCorrect: false,
        feedback: "❌ WRONG! All profits shown are fake. You'll be pressured to 'verify wallet' with ₹25L payment.",
        xpGain: 0,
        securityGain: -4
      }
    ],
    learnMode: {
      title: "Cryptocurrency Scams & How They Exploit Trust",
      explanation: `
        Crypto's anonymous nature makes it perfect for scams:
        
        WHY CRYPTO SCAMS ARE POPULAR:
        ✓ Transactions are irreversible
        ✓ No regulation or buyer protection
        ✓ Anonymity = scammer identity hidden
        ✓ Technical complexity confuses victims
        ✓ FOMO ("Fear of Missing Out") works best
        
        THE 3-STAGE CRYPTO SCAM:
        STAGE 1 - LURING (Week 1-2):
        • DM/LinkedIn with "investment opportunity"
        • Show fake screenshots of crypto wallets
        • Proof of profits (all fabricated)
        • "Limited spots" urgency
        • Add to Telegram group
        
        STAGE 2 - BUILDING TRUST (Week 2-4):
        • Show "live trading" (fake markets)
        • Pay first ₹25k = see ₹30k "profit" next day
        • Early investors get returns (FROM LATE INVESTORS' MONEY)
        • Create WhatsApp group for "winners" only
        • New victims recruited by early investors
        
        STAGE 3 - THE COLLAPSE (Week 4-8):
        • "Platform technical issues"
        • "Withdrawal indefinitely paused"
        • Scammer stops responding
        • Telegram channel deleted
        • ₹500 Lakhs+ vanish in crypto wallets
        • Police can't recover (crypto anonymous)
        
        REAL 2023 CASES:
        • "WazirX" hack: ₹2,000 Cr+ stolen
        • "OneCoin": Arrested, but victims never recovered
        • "Bitconnect": Founder on trial, investors lost all
        • Average victim loss: ₹25 Lakh - ₹5 Crore
        • Recovery rate: <1% (cryptocurrency can't be reversed)
        
        THE FAKE "PROOFS":
        • Wallet screenshots: Edited images
        • Trading charts: Downloaded from YouTube
        • Testimonials: Paid fake accounts
        • "Live trading": Pre-recorded videos
        • ROI calculations: Simple math fraud
        
        LEGITIMATE CRYPTO INVESTMENTS:
        ✅ Only through registered exchanges (CoinSwitch, WazirX official)
        ✅ No guaranteed returns ever
        ✅ High volatility (can lose 50%+ instantly)
        ✅ No private "exclusive groups"
        ✅ Proper KYC verification
        ✅ Transactions traceable on blockchain
      `,
      preventionSteps: [
        "Remember: Crypto guarantees = automatic scam",
        "Only use registered exchanges (CoinSwitch, WazirX official)",
        "Verify exchange: Check CoinGecko/CoinMarketCap for legitimacy",
        "Never share seed phrase/private keys",
        "Avoid private investment groups (Telegram/WhatsApp)",
        "Crypto is volatile - losses can be 50-100%",
        "Don't invest money you can't lose",
        "Check exchange on RBI's list (not all are approved)",
        "Report scams to cybercrime.gov.in",
        "If scammed: Report to blockchain analysis teams (some track funds)"
      ],
      resources: [
        "Verify exchanges: coingecko.com, coinmarketcap.com",
        "RBI regulation: rbi.org.in (search crypto policy)",
        "Report scam: cybercrime.gov.in",
        "Check blockchain: etherscan.io (for Ethereum)"
      ]
    }
  }
}

// Export helper function to get scams by tier
export const getScamsByTier = (tier) => {
  return Object.values(SCAMS).filter(scam => scam.tier === tier)
}

// Export all scam IDs for navigation
export const SCAM_IDS = Object.keys(SCAMS)

// Export difficulty-based challenge sequence
export const MISSION_SEQUENCE = [
  "rupee_scam",
  "fake_job_offer",
  "phishing_email",
  "digital_arrest",
  "love_scam",
  "lottery_prize_scam",
  "refund_scam",
  "investment_scam",
  "tech_support_scam",
  "upi_payment_scam",
  "business_impersonation",
  "cryptocurrency_scam"
]

export default SCAMS
