# ScamVerse - HackMol 7.0
# spin.py - spin wheel API routes
# Simran's part

from fastapi import APIRouter, Query
from typing import Optional
from ..services.scenario_service import (
    get_spin_wheel_data,
    get_spin_segment_by_type,
    get_random_scenario
)

router = APIRouter()


@router.get("/segments")
async def get_wheel_segments():
    """
    Returns all 8 spin wheel segments
    with real case data and statistics
    """
    segments = get_spin_wheel_data()
    return {
        "segments": segments,
        "total": len(segments)
    }


@router.get("/segment/{scam_type}")
async def get_segment(scam_type: str):
    """get specific segment by scam type"""
    segment = get_spin_segment_by_type(scam_type.upper())
    if not segment:
        return {"error": "Segment not found"}, 404
    return segment


@router.get("/daily")
async def get_daily_spin():
    """
    Returns today spin data
    in real version this would be date-based
    for now returns random segment
    """
    import random
    segments = get_spin_wheel_data()
    if not segments:
        return {"error": "No segments available"}, 500

    # pick random one for now
    # TODO: make this date based so same scam shows all day
    daily = random.choice(segments)

    return {
        "segment": daily,
        "message": "Today's scam awareness: " + daily["label"]
    }


@router.get("/scenario/{scam_type}")
async def get_scenario_for_type(
    scam_type: str,
    player_name: str = Query(default="Player")
):
    """
    After spin wheel lands on a type
    get a matching scenario to practice
    """
    scenario = get_random_scenario(
        scam_type=scam_type.upper(),
        player_name=player_name
    )
    if not scenario:
        # fallback to any scenario
        scenario = get_random_scenario(player_name=player_name)

    return scenario