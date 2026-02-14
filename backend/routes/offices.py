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


from flask import Blueprint, jsonify
from models import Ticket
from datetime import datetime

offices_bp = Blueprint(
    "offices_bp",
    __name__,
    url_prefix="/api/offices"
)

@offices_bp.route("/<office_name>/stats", methods=["GET"])
def office_stats(office_name):
    tickets = Ticket.query.filter_by(office=office_name).all()

    now = datetime.utcnow()

    total = len(tickets)
    open_count = 0
    in_progress_count = 0
    resolved_count = 0
    rejected_count = 0
    overdue_count = 0

    for t in tickets:
        if t.status == "OPEN":
            open_count += 1
        elif t.status == "IN_PROGRESS":
            in_progress_count += 1
        elif t.status == "RESOLVED":
            resolved_count += 1
        elif t.status == "REJECTED":
            rejected_count += 1

        if t.status in ["OPEN", "IN_PROGRESS"] and t.due_at < now:
            overdue_count += 1

    return jsonify({
        "total_tickets": total,
        "open": open_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count,
        "rejected": rejected_count,
        "overdue": overdue_count
    })
