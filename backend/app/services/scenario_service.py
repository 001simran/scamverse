# ScamVerse - HackMol 7.0
# scenario_service.py - loads and serves scenarios
# reads from our real dataset JSON file

import json
import random
import os
from pathlib import Path


def load_scenarios():
    """load scenarios from JSON file"""
    try:
        data_path = Path(__file__).parent.parent / "data" / "scenarios.json"
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data["scenarios"]
    except Exception as e:
        print(f"Error loading scenarios: {e}")
        return []


def load_spin_wheel():
    """load spin wheel data from JSON file"""
    try:
        data_path = Path(__file__).parent.parent / "data" / "spin_wheel.json"
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data["wheel_segments"]
    except Exception as e:
        print(f"Error loading spin wheel: {e}")
        return []


def get_scenario_by_id(scenario_id: int, player_name: str = "Player"):
    """get specific scenario and personalise with player name"""
    scenarios = load_scenarios()
    scenario = next((s for s in scenarios if s["id"] == scenario_id), None)
    if scenario:
        # personalise message with player name
        scenario = scenario.copy()
        scenario["message"] = scenario["message"].replace(
            "{name}", player_name
        )
    return scenario


def get_random_scenario(
    scam_type: str = None,
    difficulty: int = None,
    player_name: str = "Player"
):
    """get random scenario optionally filtered by type or difficulty"""
    scenarios = load_scenarios()

    pool = scenarios

    if scam_type:
        filtered = [s for s in pool if s["type"] == scam_type]
        if filtered:
            pool = filtered

    if difficulty:
        filtered = [s for s in pool if s["difficulty"] <= difficulty]
        if filtered:
            pool = filtered

    if not pool:
        pool = scenarios

    scenario = random.choice(pool).copy()
    scenario["message"] = scenario["message"].replace(
        "{name}", player_name
    )
    return scenario


def get_all_scenarios():
    """return all scenarios without personalisation"""
    return load_scenarios()


def get_spin_wheel_data():
    """return all spin wheel segments"""
    return load_spin_wheel()


def get_spin_segment_by_type(scam_type: str):
    """get specific wheel segment by scam type"""
    segments = load_spin_wheel()
    return next(
        (s for s in segments if s["type"] == scam_type),
        None
    )