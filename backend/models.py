from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Users
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=False)   # staff, student, admin

    office = db.Column(db.String(20), nullable=False) # only for STAFF (HOSTEL_OFFICE, etc)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Tickets
class Ticket(db.Model):
    __tablename__ = "tickets"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)

    office = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="OPEN")
    priority = db.Column(db.String(20), default="LOW")

    sla_hours = db.Column(db.Integer, default=24)
    due_at = db.Column(db.DateTime, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Reports (join existing issue)
class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)

    ticket_id = db.Column(db.Integer, db.ForeignKey("tickets.id"))
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Ticket Updates (Timeline)
class TicketUpdate(db.Model):
    __tablename__ = "ticket_updates"
    id = db.Column(db.Integer, primary_key=True)

    ticket_id = db.Column(db.Integer, db.ForeignKey("tickets.id"))
    message = db.Column(db.String(255))
    by_role = db.Column(db.String(20))  # STAFF, STUDENT, SYSTEM

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

