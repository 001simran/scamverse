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

# 🔥 Dynamic CORS configuration for Railway deployment
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

# Build allowed origins list
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add production frontend URL if set
if FRONTEND_ORIGIN and FRONTEND_ORIGIN not in origins:
    origins.append(FRONTEND_ORIGIN)

print(f"✅ CORS enabled for: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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