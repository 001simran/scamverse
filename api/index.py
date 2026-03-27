import sys
import os

# Add backend folder to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.app.main import app

# Vercel handler
handler = app