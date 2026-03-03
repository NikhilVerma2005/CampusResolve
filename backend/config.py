# import os

# basedir = os.path.abspath(os.path.dirname(__file__))

# class Config:
#     # Ensure instance folder
#     INSTANCE_PATH = os.path.join(basedir, "instance")
#     os.makedirs(INSTANCE_PATH, exist_ok=True)

#     SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(INSTANCE_PATH, "database.db")
#     SQLALCHEMY_TRACK_MODIFICATIONS = False


import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Use PostgreSQL if DATABASE_URL exists (Render / Neon)
    DATABASE_URL = os.environ.get("DATABASE_URL")

    if DATABASE_URL:
        # Fix for some providers that give postgres://
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Fallback to SQLite for local development
        INSTANCE_PATH = os.path.join(basedir, "instance")
        os.makedirs(INSTANCE_PATH, exist_ok=True)

        SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(INSTANCE_PATH, "database.db")