# ScamVerse - HackMol 7.0
# database.py - SQLAlchemy setup with PostgreSQL support

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment, fallback to SQLite for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./scamverse.db")

# Check if we're using SQLite
is_sqlite = DATABASE_URL.startswith("sqlite")

# Configure engine based on database type
if is_sqlite:
    # SQLite specific configuration
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    print("✅ Using SQLite database (local development)")
else:
    # PostgreSQL specific configuration
    engine = create_engine(
        DATABASE_URL,
        pool_size=5,           # Connection pool size
        max_overflow=10,       # Extra connections beyond pool_size
        pool_pre_ping=True,    # Check connection before using
        echo=False             # Set to True to see SQL queries (debug only)
    )
    print("✅ Using PostgreSQL database (production)")

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()