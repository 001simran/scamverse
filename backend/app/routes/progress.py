# ScamVerse - HackMol 7.0
# progress.py - User progress routes

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import UserProgress
from ..auth import get_current_user

router = APIRouter()

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

@router.post("/progress", response_model=ProgressResponse)
def update_progress(
    progress: ProgressUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    return progress

@router.get("/progress/{scenario_id}", response_model=ProgressResponse)
def get_scenario_progress(
    scenario_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.scenario_id == scenario_id
    ).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return progress