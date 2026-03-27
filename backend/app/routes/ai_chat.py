# ScamVerse - HackMol 7.0
# ai_chat.py - CyberGuide chat routes
# Simran's part

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ..services.ai_service import get_chat_response, get_analysis

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    player_name: Optional[str] = "Player"


class AnalyzeTextRequest(BaseModel):
    text: str
    player_name: Optional[str] = "Player"


@router.post("/chat")
async def cyberguide_chat(request: ChatRequest):
    """
    CyberGuide answers cybersecurity questions
    powers the AI chat panel in the game
    """
    response = await get_chat_response(
        question=request.question,
        player_name=request.player_name
    )
    return response


@router.post("/analyze")
async def analyze_text(request: AnalyzeTextRequest):
    """
    Analyze any text for scam patterns
    used in encyclopedia text analyzer
    """
    result = await get_analysis(
        message=request.text,
        player_name=request.player_name
    )
    return result


@router.get("/tips")
async def get_daily_tips():
    """
    Returns daily cybersecurity tips
    shown in game HUD
    """
    tips = [
        {
            "tip": "Banks never ask for OTP on call. Never. This is RBI policy.",
            "category": "OTP Safety"
        },
        {
            "tip": "Digital arrest is not real. No Indian law allows digital arrest.",
            "category": "Digital Arrest"
        },
        {
            "tip": "OTP authorises sending money OUT. Never share to receive money.",
            "category": "UPI Safety"
        },
        {
            "tip": "SEBI prohibits guaranteed returns. Anyone promising them is a fraudster.",
            "category": "Investment Safety"
        },
        {
            "tip": "AI can clone your family voice in 3 seconds. Always call back to verify.",
            "category": "Deepfake Safety"
        },
        {
            "tip": "Real companies never charge joining fees. Any fee request is fraud.",
            "category": "Job Safety"
        },
        {
            "tip": "KYC is done inside the app only. Never click SMS links for KYC.",
            "category": "KYC Safety"
        },
        {
            "tip": "When in doubt, hang up. Call 1930. Tell your family.",
            "category": "General Safety"
        }
    ]
    return {"tips": tips}