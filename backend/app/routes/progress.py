# ScamVerse - HackMol 7.0
# progress.py - User progress routes

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..database import get_db
from ..models import User, UserProgress
from ..auth import get_current_user

router = APIRouter()

# Request/Response Models
class ProgressUpdate(BaseModel):
    scenario_id: str
    completed: bool = False
    score: int = 0
    notes: Optional[str] = None

class ProgressResponse(BaseModel):
    scenario_id: str
    completed: bool
    score: int
    attempts: int
    notes: Optional[str]

class MissionRecord(BaseModel):
    mission_id: str
    decision_choice: str

class MissionResponse(BaseModel):
    xp_gained: int
    security_change: int
    total_xp: int
    rank: str

class UserStatsResponse(BaseModel):
    total_xp: int
    rank: str
    missions_completed: int
    citizens_saved: int
    accuracy: float
    city_security_contribution: int
    achievements: list

# Helper functions
def get_mission_xp(mission_id: str, decision_choice: str) -> int:
    """Calculate XP based on mission and choice"""
    # Base XP values for different mission types
    mission_xp_map = {
        "phishing_detection": {"correct": 100, "wrong": 20},
        "social_engineering": {"correct": 150, "wrong": 30},
        "password_security": {"correct": 80, "wrong": 15},
        "malware_analysis": {"correct": 120, "wrong": 25},
        "wire_transfer_fraud": {"correct": 200, "wrong": 40}
    }
    
    if mission_id in mission_xp_map:
        return mission_xp_map[mission_id].get(decision_choice, 50)
    return 50  # Default XP for unknown missions

def get_security_impact(mission_id: str, decision_choice: str) -> int:
    """Calculate security contribution change"""
    impact_map = {
        "phishing_detection": {"correct": 10, "wrong": -5},
        "social_engineering": {"correct": 15, "wrong": -8},
        "password_security": {"correct": 8, "wrong": -4},
        "malware_analysis": {"correct": 12, "wrong": -6},
        "wire_transfer_fraud": {"correct": 20, "wrong": -10}
    }
    
    if mission_id in impact_map:
        return impact_map[mission_id].get(decision_choice, 0)
    return 0

def calculate_rank(total_xp: int) -> str:
    """Calculate user rank based on total XP"""
    if total_xp >= 5000:
        return "Cyber Sentinel"
    elif total_xp >= 2500:
        return "Security Guardian"
    elif total_xp >= 1000:
        return "Fraud Investigator"
    elif total_xp >= 500:
        return "Digital Defender"
    elif total_xp >= 100:
        return "Scout"
    else:
        return "Recruit"

# Progress Routes
@router.post("/progress", response_model=ProgressResponse)
def update_progress(
    progress: ProgressUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update scenario progress"""
    # Get or create progress entry
    db_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.scenario_id == progress.scenario_id
    ).first()
    
    if db_progress:
        db_progress.completed = progress.completed
        db_progress.score = max(db_progress.score, progress.score)
        db_progress.attempts += 1
        if progress.notes:
            db_progress.notes = progress.notes
    else:
        db_progress = UserProgress(
            user_id=current_user.id,
            scenario_id=progress.scenario_id,
            completed=progress.completed,
            score=progress.score,
            attempts=1,
            notes=progress.notes
        )
        db.add(db_progress)
    
    db.commit()
    db.refresh(db_progress)
    return db_progress

@router.get("/progress", response_model=list[ProgressResponse])
def get_progress(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all user progress"""
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    return progress

@router.get("/progress/{scenario_id}", response_model=ProgressResponse)
def get_scenario_progress(
    scenario_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific scenario progress"""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.scenario_id == scenario_id
    ).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return progress

# New Mission Routes
@router.post("/record-mission", response_model=MissionResponse)
async def record_mission(
    mission_data: MissionRecord,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record mission completion and update user progression"""
    
    # Calculate XP and security changes based on mission_id and choice
    mission_xp = get_mission_xp(mission_data.mission_id, mission_data.decision_choice)
    security_change = get_security_impact(mission_data.mission_id, mission_data.decision_choice)
    
    # Update user in database
    current_user.total_xp += mission_xp
    current_user.city_security_contribution += security_change
    current_user.missions_completed += 1
    
    if mission_data.decision_choice == "correct":
        current_user.citizens_saved += 1
    else:
        current_user.citizens_lost += 1
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return MissionResponse(
        xp_gained=mission_xp,
        security_change=security_change,
        total_xp=current_user.total_xp,
        rank=calculate_rank(current_user.total_xp)
    )

@router.get("/user-stats/{user_id}", response_model=UserStatsResponse)
async def get_user_stats(
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive user statistics"""
    # Ensure users can only access their own stats unless admin
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate accuracy (avoid division by zero)
    accuracy = 0
    if user.missions_completed > 0:
        accuracy = (user.citizens_saved / user.missions_completed) * 100
    
    return UserStatsResponse(
        total_xp=user.total_xp,
        rank=calculate_rank(user.total_xp),
        missions_completed=user.missions_completed,
        citizens_saved=user.citizens_saved,
        accuracy=accuracy,
        city_security_contribution=user.city_security_contribution,
        achievements=user.achievements if hasattr(user, 'achievements') else []
    )

@router.get("/leaderboard")
async def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get top players leaderboard"""
    top_users = db.query(User).order_by(User.total_xp.desc()).limit(limit).all()
    
    leaderboard = []
    for idx, user in enumerate(top_users, 1):
        leaderboard.append({
            "rank": idx,
            "username": user.username,
            "total_xp": user.total_xp,
            "rank_title": calculate_rank(user.total_xp),
            "missions_completed": user.missions_completed,
            "accuracy": (user.citizens_saved / user.missions_completed * 100) if user.missions_completed > 0 else 0
        })
    
    return {
        "leaderboard": leaderboard,
        "current_user_rank": await get_user_rank(current_user.id, db)
    }

async def get_user_rank(user_id: str, db: Session) -> int:
    """Helper function to get user's rank position"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return 0
    
    # Count users with higher XP
    higher_ranked = db.query(User).filter(User.total_xp > user.total_xp).count()
    return higher_ranked + 1