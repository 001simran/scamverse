from app.database import SessionLocal
from app.models import User

session = SessionLocal()
users = session.query(User).all()
print(f"Total users: {len(users)}")
for u in users:
    print(f"- {u.username} ({u.email}): {u.hashed_password[:30] if u.hashed_password else 'NO HASH'}...")
session.close()
