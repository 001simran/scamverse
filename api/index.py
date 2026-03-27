import sys
import os

# Add backend folder to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.app.main import app

# Vercel expects 'app' (ASGI), not handler
# Just expose it like this:

app = app