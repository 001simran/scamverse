# ScamVerse - HackMol 7.0
# ai_service.py - Gemini API + smart fallback
# Simran's part
# if no API key it still works with keyword analysis
# real AI kicks in when key is added

import httpx
import json
import logging
from typing import Optional
from ..config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# keyword patterns for fallback analysis
# when no gemini key is available
SCAM_KEYWORDS = {
    "otp": {
        "verdict": "SCAM",
        "confidence": 95,
        "reason": "OTP request detected — banks never ask for OTP",
        "flags": [
            "OTP request found — banks never ask for this",
            "This pattern matches known SBI impersonation scam",
            "Sharing OTP will drain your account"
        ],
        "what_to_do": "Hang up immediately. Call your bank on the official number."
    },
    "digital arrest": {
        "verdict": "SCAM",
        "confidence": 99,
        "reason": "Digital arrest detected — not legal in India",
        "flags": [
            "Digital arrest has NO legal basis in Indian law",
            "CBI never contacts people over video call",
            "This is psychological manipulation to steal money"
        ],
        "what_to_do": "Hang up. Call 1930. Tell your family immediately."
    },
    "upi refund": {
        "verdict": "SCAM",
        "confidence": 97,
        "reason": "UPI refund trap — OTP authorises debit not credit",
        "flags": [
            "You never need OTP to receive money",
            "Rs 1 credit is bait to make scam feel real",
            "Sharing OTP will empty your account"
        ],
        "what_to_do": "Do not share OTP. Block the number. Report to 1930."
    },
    "guaranteed return": {
        "verdict": "SCAM",
        "confidence": 93,
        "reason": "Guaranteed returns are illegal under SEBI rules",
        "flags": [
            "SEBI prohibits guaranteed return promises",
            "No legitimate investment guarantees fixed returns",
            "This is likely pig butchering fraud"
        ],
        "what_to_do": "Verify at sebi.gov.in. Never invest based on WhatsApp advice."
    },
    "aadhaar": {
        "verdict": "SUSPICIOUS",
        "confidence": 80,
        "reason": "Aadhaar reference in unsolicited message",
        "flags": [
            "Aadhaar details requested in unsolicited message",
            "Scammers use Aadhaar to appear legitimate",
            "Real agencies send written notices not calls"
        ],
        "what_to_do": "Do not share Aadhaar details over phone. Visit the office in person."
    },
    "lottery": {
        "verdict": "SCAM",
        "confidence": 98,
        "reason": "Lottery scam — you cannot win what you never entered",
        "flags": [
            "You cannot win a lottery you never entered",
            "KBC does not run SMS lottery draws",
            "Any upfront fee for prize is always fraud"
        ],
        "what_to_do": "Block and delete this message. Report to cybercrime.gov.in."
    },
    "kyc": {
        "verdict": "SUSPICIOUS",
        "confidence": 85,
        "reason": "KYC via link — always done inside official app",
        "flags": [
            "Real KYC is done inside the official app only",
            "SMS links for KYC are almost always fake",
            "Check URL carefully before clicking anything"
        ],
        "what_to_do": "Do not click the link. Open the official app directly."
    },
    "joining fee": {
        "verdict": "SCAM",
        "confidence": 92,
        "reason": "Job scam — real companies never charge fees",
        "flags": [
            "Legitimate employers NEVER charge joining fees",
            "Real company HR uses official domain email",
            "This matches known placement season fraud pattern"
        ],
        "what_to_do": "Verify job on official company career portal only."
    }
}


async def analyze_with_gemini(message: str, player_name: str) -> Optional[dict]:
    """
    Send message to Gemini for real AI analysis
    returns None if no key or if API fails
    """
    if not settings.gemini_api_key:
        return None

    try:
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/"
            f"models/gemini-1.5-flash:generateContent"
            f"?key={settings.gemini_api_key}"
        )

        prompt = f"""You are a cybersecurity expert helping Indian citizens 
identify scams. Analyze this message and return ONLY valid JSON, no markdown:

{{
  "verdict": "SCAM or SAFE or SUSPICIOUS",
  "confidence": 0 to 100,
  "scam_type": "type name",
  "flags": ["flag 1", "flag 2", "flag 3"],
  "explanation": "2 sentence explanation in simple language",
  "what_to_do": "one actionable sentence"
}}

Message to analyze: {message}
Player name for context: {player_name}

Focus on India-specific scam patterns like UPI fraud, 
digital arrest, OTP scams, fake SEBI groups."""

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "maxOutputTokens": 400,
                "temperature": 0.2
            }
        }

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()

        raw_text = (
            data["candidates"][0]["content"]["parts"][0]["text"]
        )

        # clean up markdown if gemini adds it
        clean = raw_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        clean = clean.strip()

        result = json.loads(clean)
        result["source"] = "Gemini AI"
        return result

    except Exception as e:
        # log but dont crash
        logger.warning(f"Gemini API error: {e}")
        return None


def analyze_with_keywords(message: str) -> dict:
    """
    Smart keyword analysis when no API key available
    still looks professional and educational
    """
    message_lower = message.lower()

    # check each keyword pattern
    for keyword, data in SCAM_KEYWORDS.items():
        if keyword in message_lower:
            return {
                "verdict": data["verdict"],
                "confidence": data["confidence"],
                "scam_type": keyword.upper().replace(" ", "_"),
                "flags": data["flags"],
                "explanation": data["reason"],
                "what_to_do": data["what_to_do"],
                "source": "Pattern Analysis"
            }

    # check for suspicious URLs
    suspicious_domains = [".tk", ".xyz", ".ml", ".ga", ".cf"]
    for domain in suspicious_domains:
        if domain in message_lower:
            return {
                "verdict": "SUSPICIOUS",
                "confidence": 78,
                "scam_type": "PHISHING",
                "flags": [
                    f"Suspicious domain {domain} detected in message",
                    "Free domains are commonly used by scammers",
                    "Real banks and companies use .com or .in domains"
                ],
                "explanation": f"Message contains suspicious {domain} domain link",
                "what_to_do": "Do not click this link. Type the official URL directly.",
                "source": "Pattern Analysis"
            }

    # check for urgency words
    urgency_words = [
        "urgent", "immediately", "blocked", "suspended",
        "24 hours", "last chance", "expire"
    ]
    urgency_count = sum(1 for w in urgency_words if w in message_lower)
    if urgency_count >= 2:
        return {
            "verdict": "SUSPICIOUS",
            "confidence": 65,
            "scam_type": "URGENCY_TACTIC",
            "flags": [
                "Multiple urgency words detected in message",
                "Scammers create artificial time pressure",
                "Take time to verify before acting"
            ],
            "explanation": "Message uses urgency tactics to prevent rational thinking",
            "what_to_do": "Always pause 10 minutes before any financial decision.",
            "source": "Pattern Analysis"
        }

    # looks safe
    return {
        "verdict": "SAFE",
        "confidence": 72,
        "scam_type": "NONE",
        "flags": [
            "No obvious scam patterns detected",
            "Always verify through official channels",
            "Stay alert for follow-up messages"
        ],
        "explanation": "This message appears relatively safe but always stay cautious",
        "what_to_do": "Verify through official website or app if unsure.",
        "source": "Pattern Analysis"
    }


async def get_analysis(message: str, player_name: str = "Player") -> dict:
    """
    Main analysis function
    tries Gemini first then falls back to keywords
    """
    # try real AI first
    gemini_result = await analyze_with_gemini(message, player_name)

    if gemini_result:
        return gemini_result

    # fallback to keyword analysis
    return analyze_with_keywords(message)


async def get_chat_response(
    question: str,
    player_name: str = "Player"
) -> dict:
    """
    CyberGuide chat response
    answers general cybersecurity questions
    """
    if settings.gemini_api_key:
        try:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/"
                f"models/gemini-1.5-flash:generateContent"
                f"?key={settings.gemini_api_key}"
            )

            prompt = f"""You are CyberGuide, a friendly cybersecurity 
assistant in a game called ScamVerse. Help {player_name} understand 
cyber safety in India. Keep answers short, simple, and in Hinglish 
when appropriate. Max 3 sentences. Focus on practical advice.

Question: {question}"""

            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "maxOutputTokens": 200,
                    "temperature": 0.7
                }
            }

            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()

            answer = (
                data["candidates"][0]["content"]["parts"][0]["text"]
            )
            return {
                "answer": answer,
                "source": "Gemini AI"
            }

        except Exception as e:
            logger.warning(f"Gemini chat error: {e}")

    # fallback answers
    fallback_answers = {
        "otp": "OTP sirf apke liye hota hai. Kisi ko share mat karo — bank ko bhi nahi. Banks kabhi OTP nahi maangti.",
        "digital arrest": "Digital arrest India mein koi kanoon nahi hai. CBI aur police kabhi phone pe arrest nahi karte. Hang up karo aur 1930 call karo.",
        "upi": "UPI se paise receive karne ke liye OTP ki zaroorat nahi hoti. Agar koi OTP mange toh 100% fraud hai.",
        "1930": "1930 India ka National Cyber Crime Helpline number hai. Koi bhi cyber fraud hone par turant call karo. Free hai.",
        "scam": "Koi bhi suspicious message mile toh: Rukho. Sochho. Verify karo. Kisi trusted person se poochho. Jaldi mat karo."
    }

    question_lower = question.lower()
    for keyword, answer in fallback_answers.items():
        if keyword in question_lower:
            return {"answer": answer, "source": "CyberGuide"}

    return {
        "answer": "Jab bhi koi suspicious call ya message aaye — rukiye, kisi family member ko batayein, aur 1930 pe call karein. Jaldi mein koi decision mat lijiye.",
        "source": "CyberGuide"
    }