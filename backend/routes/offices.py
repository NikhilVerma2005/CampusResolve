from flask import Blueprint, jsonify
from models import Ticket, Report
from datetime import datetime

offices_bp = Blueprint(
    "offices_bp",
    __name__,
    url_prefix="/api/offices"
)

PRIORITY_ORDER = {
    "HIGH": 1,
    "MEDIUM": 2,
    "LOW": 3
}

@offices_bp.route("/<office_name>/tickets", methods=["GET"])
def get_office_tickets(office_name):
    tickets = Ticket.query.filter_by(office=office_name).all()

    result = []

    for t in tickets:
        report_count = Report.query.filter_by(ticket_id=t.id).count()

        now = datetime.utcnow()
        remaining_seconds = (t.due_at - now).total_seconds()
        remaining_hours = round(remaining_seconds / 3600, 2)

        result.append({
            "ticket_id": t.id,
            "title": t.title,
            "location": t.location,
            "priority": t.priority,
            "status": t.status,
            "report_count": report_count,
            "due_at": t.due_at.isoformat(),
            "sla_remaining_hours": max(0, remaining_hours),
            "is_overdue": remaining_seconds < 0
        })

    # Sort properly
    result.sort(
        key=lambda x: (
            PRIORITY_ORDER.get(x["priority"], 99),
            x["sla_remaining_hours"]
        )
    )

    return jsonify(result)
