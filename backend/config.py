import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")

    # Get database URL from environment (Render)
    database_url = os.environ.get("DATABASE_URL")

    if database_url:
        # Fix Render's old postgres:// prefix
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)

        SQLALCHEMY_DATABASE_URI = database_url
    else:
        # Fallback to SQLite for local development
        SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "db.sqlite3")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
