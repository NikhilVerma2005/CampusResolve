from flask import Blueprint, jsonify
from models import Ticket, Report

users_bp = Blueprint(
    "users_bp",
    __name__,
    url_prefix="/api/users"
)

@users_bp.route("/<int:user_id>/stats", methods=["GET"])
def user_stats(user_id):
    reports = Report.query.filter_by(student_id=user_id).all()

    ticket_ids = [r.ticket_id for r in reports]
    tickets = Ticket.query.filter(Ticket.id.in_(ticket_ids)).all()

    total = len(tickets)
    open_count = 0
    in_progress_count = 0
    resolved_count = 0
    rejected_count = 0

    for t in tickets:
        if t.status == "OPEN":
            open_count += 1
        elif t.status == "IN_PROGRESS":
            in_progress_count += 1
        elif t.status == "RESOLVED":
            resolved_count += 1
        elif t.status == "REJECTED":
            rejected_count += 1

    return jsonify({
        "total_reported": total,
        "open": open_count,
        "in_progress": in_progress_count,
        "resolved": resolved_count,
        "rejected": rejected_count
    })
