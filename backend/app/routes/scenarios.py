# ScamVerse - HackMol 7.0
# scenarios.py - scenario API routes
# Simran built this

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from ..services.scenario_service import (
    get_scenario_by_id,
    get_random_scenario,
    get_all_scenarios
)
from ..services.ai_service import get_analysis

router = APIRouter()


class AnalyzeRequest(BaseModel):
    message: str
    player_name: Optional[str] = "Player"
    scenario_id: Optional[int] = None


@router.get("/all")
async def all_scenarios():
    """get all scenarios for the game"""
    scenarios = get_all_scenarios()
    return {
        "scenarios": scenarios,
        "total": len(scenarios)
    }


@router.get("/random")
async def random_scenario(
    scam_type: Optional[str] = Query(None),
    difficulty: Optional[int] = Query(None),
    player_name: str = Query(default="Player")
):
    """get a random scenario personalised with player name"""
    scenario = get_random_scenario(
        scam_type=scam_type,
        difficulty=difficulty,
        player_name=player_name
    )
    if not scenario:
        return {"error": "No scenario found"}, 404
    return scenario


@router.get("/{scenario_id}")
async def get_scenario(
    scenario_id: int,
    player_name: str = Query(default="Player")
):
    """get specific scenario by ID"""
    scenario = get_scenario_by_id(scenario_id, player_name)
    if not scenario:
        return {"error": "Scenario not found"}, 404
    return scenario


@router.post("/analyze")
async def analyze_message(request: AnalyzeRequest):
    """
    AI analysis of a scam message
    uses Gemini if key available
    falls back to keyword analysis
    this is the AI panel feature
    """
    result = await get_analysis(
        message=request.message,
        player_name=request.player_name
    )
    return {
        "analysis": result,
        "message_analyzed": request.message[:100] + "..."
        if len(request.message) > 100
        else request.message
    }