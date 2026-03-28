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

# ================= IMPROVED CORS FOR VERCEL + RAILWAY =================

# Get environment variables
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")

# Base origins (local development)
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]

# Add main frontend origin
if FRONTEND_ORIGIN:
    origins.append(FRONTEND_ORIGIN)
    print(f"✅ Added FRONTEND_ORIGIN: {FRONTEND_ORIGIN}")

# Add additional allowed origins (comma-separated list)
if ALLOWED_ORIGINS:
    extra = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]
    origins.extend(extra)
    print(f"✅ Added ALLOWED_ORIGINS: {extra}")

# Log all allowed origins
print(f"🌐 CORS enabled for origins: {origins}")

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
        "hackathon": "HackMol 7.0",
        "cors_origins": len(origins)
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}