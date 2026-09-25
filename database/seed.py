"""Initialize the SQLite database with clean tables."""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
for p in [str(BASE_DIR), str(REPO_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from .database import Base, engine
except ImportError:
    from database import Base, engine

FRONTEND_ORIGIN = "http://localhost:3000"


def invite_link(code: str) -> str:
    compact = code.replace(" ", "")
    return f"{FRONTEND_ORIGIN}/join/{compact}"


def seed() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database initialized with clean schema (0 meetings).")


if __name__ == "__main__":
    seed()
