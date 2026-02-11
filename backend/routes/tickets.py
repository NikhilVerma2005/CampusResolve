from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from models import db, Ticket, Report
from services.routing import route_ticket
import re

tickets_bp = Blueprint("tickets_bp", __name__, url_prefix="/api/tickets")


@tickets_bp.route("", methods=["POST"])
def create_ticket():
    data = request.json

    title = data.get("title")
    location = data.get("location")
    description = data.get("description")
    student_id = data.get("student_id")

    office = route_ticket(location)
    due_at = datetime.utcnow() + timedelta(hours=24)

    ticket = Ticket(
        title = title,
        location = location,
        office = office,
        due_at = due_at
    )
    db.session.add(ticket)
    db.session.commit()

    report = Report(
        ticket_id = ticket.id,
        student_id = student_id,
        description = description
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({
        "message": "Ticket created",
        "ticket_id" : ticket.id,
        "office" : office
    }), 201

# --- suggestions ---
def normalize(text):
    return set(re.findall(r"\w+",text.lower()))


@tickets_bp.route("/suggestions", methods=["GET"])
def suggest_tickets():
    query = request.args.get("query", "")
    location = request.args.get("location", "")

    if not query or not location:
        return jsonify([])

    keywords = normalize(query)

    tickets = Ticket.query.filter(
        # Ticket.location == location,
        Ticket.location.ilike(location),

        Ticket.status.in_(["OPEN", "IN_PROGRESS"])
    ).all()

    suggestions = []

    for t in tickets:
        title_words = normalize(t.title)
        overlap = keywords.intersection(title_words)

        if len(overlap) >= 1:
            report_count = Report.query.filter_by(ticket_id=t.id).count()
            suggestions.append({
                "ticket_id": t.id,
                "title": t.title,
                "location": t.location,
                "office": t.office,
                "status": t.status,
                "report_count": report_count
            })

    return jsonify(suggestions)


# -----join existing ticket----

def calculate_priority(report_count):
    if report_count >= 10:
        return "HIGH"
    elif report_count >= 5:
        return "MEDIUM"
    else:
        return "LOW"
    

@tickets_bp.route("/<int:ticket_id>/join", methods=["POST"])
def join_ticket(ticket_id):
    data = request.get_json()

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404

    if ticket.status == "CLOSED":
        return jsonify({"error": "Cannot join closed ticket"}), 400

    # Prevent duplicate join
    existing = Report.query.filter_by(
        ticket_id=ticket_id,
        student_id=data["student_id"]
    ).first()

    if existing:
        return jsonify({"error": "Already joined this ticket"}), 400

    try:
        # Add report
        report = Report(
            ticket_id=ticket_id,
            student_id=data["student_id"],
            description=data["description"]
        )
        db.session.add(report)
        db.session.commit()

        report_count = Report.query.filter_by(ticket_id=ticket_id).count()

        return jsonify({
            "message": "Joined existing ticket",
            "ticket_id": ticket.id,
            "new_priority": ticket.priority,
            "report_count": report_count
        }), 200


    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Join failed"}), 500

