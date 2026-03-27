from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routes import scenarios, ai_chat, spin, auth, progress
from .database import engine
from . import models

# ✅ SECRET KEY
SECRET_KEY = os.getenv("SECRET_KEY", "dev_fallback_secret")

if SECRET_KEY == "dev_fallback_secret":
    print("⚠️ WARNING: SECRET_KEY not set, using fallback")

# ✅ Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ScamVerse API",
    description="Backend for HackMol 7.0",
    version="1.0.0"
)

# ================= CORS FIX =================

# 🔥 Allow your deployed frontend + local
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://scamverse-b8k4.vercel.app",  # ✅ ADD YOUR VERCEL URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # ✅ strict but correct
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROUTES =================

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["Scenarios"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Chat"])
app.include_router(spin.router, prefix="/api/spin", tags=["Spin Wheel"])

# ================= HEALTH =================

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