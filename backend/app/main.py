from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes import scenarios, ai_chat, spin, auth, progress
from .database import engine
from . import models

# ✅ SAFE SECRET KEY (no crash)
SECRET_KEY = os.getenv("SECRET_KEY", "dev_fallback_secret")

if SECRET_KEY == "dev_fallback_secret":
    print("⚠️ WARNING: SECRET_KEY not set, using fallback")

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ScamVerse API",
    description="Backend for ScamVerse - HackMol 7.0",
    version="1.0.0"
)

# CORS
_base_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://localhost:8000",
]

frontend_origin = os.getenv("FRONTEND_ORIGIN", "").strip()
if frontend_origin:
    _base_origins.append(frontend_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_base_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["Scenarios"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Chat"])
app.include_router(spin.router, prefix="/api/spin", tags=["Spin Wheel"])


@app.get("/")
async def root():
    return {
        "message": "ScamVerse API is running",
        "version": "1.0.0",
        "hackathon": "HackMol 7.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "ok"}