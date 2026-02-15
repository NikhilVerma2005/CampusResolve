import { useEffect, useState } from "react";
import API from "../api";

function OfficeDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const officeName = localStorage.getItem("officeName");
  const role = localStorage.getItem("role");

  // 🔒 Route Protection
  if (!officeName || role !== "STAFF") {
    return <p>Unauthorized. Please login as staff.</p>;
  }

  const fetchData = async () => {
    try {
      const ticketsRes = await API.get(`/offices/${officeName}/tickets`);
      setTickets(ticketsRes.data || []);

      const statsRes = await API.get(`/offices/${officeName}/stats`);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error("Office fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [officeName]);

  const updateStatus = async (ticketId, newStatus) => {
    try {
      if (newStatus === "REJECTED") {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        await API.patch(`/tickets/${ticketId}/status`, {
          status: "REJECTED",
          reason,
        });
      } else {
        await API.patch(`/tickets/${ticketId}/status`, {
          status: newStatus,
        });
      }

      fetchData();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading office dashboard...</p>;

  const pending = tickets.filter(t => t.status === "OPEN");
  const inProgress = tickets.filter(t => t.status === "IN_PROGRESS");
  const completed = tickets.filter(
    t => t.status === "RESOLVED" || t.status === "REJECTED"
  );

  return (
    <div style={{ padding: 30 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>{officeName.replace("_", " ")} Dashboard</h1>
          <p>Managing tickets for this office</p>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 20,
            marginTop: 30,
            marginBottom: 40
          }}
        >
          <StatCard title="Total Tickets" value={stats.total_tickets} />
          <StatCard title="Active" value={stats.active} />
          <StatCard title="Open" value={stats.open} />
          <StatCard title="In Progress" value={stats.in_progress} />
          <StatCard title="Resolved" value={stats.resolved} />
          <StatCard title="Overdue" value={stats.overdue} highlight />
          <StatCard title="Resolution %" value={`${stats.resolution_rate}%`} />
        </div>
      )}

      <Section title="Pending Tickets" tickets={pending} updateStatus={updateStatus} />
      <Section title="In Progress" tickets={inProgress} updateStatus={updateStatus} />
      <Section title="Completed" tickets={completed} updateStatus={updateStatus} />
    </div>
  );
}

function Section({ title, tickets, updateStatus }) {
  return (
    <div style={{ marginBottom: 50 }}>
      <h2>{title}</h2>

      {tickets.length === 0 && <p>No tickets here.</p>}

      {tickets.map(t => (
        <TicketCard key={t.ticket_id} ticket={t} updateStatus={updateStatus} />
      ))}
    </div>
  );
}

function TicketCard({ ticket, updateStatus }) {
  const overdueStyle = ticket.is_overdue
    ? { border: "2px solid red", background: "#fff5f5" }
    : {};

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        ...overdueStyle
      }}
    >
      <h3>{ticket.title}</h3>

      <Badge label={ticket.priority} type="priority" />
      <Badge label={ticket.status} type="status" />

      <p><strong>Location:</strong> {ticket.location}</p>
      <p><strong>Reports:</strong> {ticket.report_count}</p>

      {ticket.is_overdue && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ⚠ Overdue
        </p>
      )}

      {ticket.status === "OPEN" && (
        <>
          <button onClick={() => updateStatus(ticket.ticket_id, "IN_PROGRESS")}>
            Mark In Progress
          </button>{" "}
          <button onClick={() => updateStatus(ticket.ticket_id, "REJECTED")}>
            Reject
          </button>
        </>
      )}

      {ticket.status === "IN_PROGRESS" && (
        <button onClick={() => updateStatus(ticket.ticket_id, "RESOLVED")}>
          Mark Resolved
        </button>
      )}
    </div>
  );
}

function StatCard({ title, value, highlight }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        background: highlight ? "#ffe6e6" : "#f5f5f5",
        border: highlight ? "2px solid red" : "1px solid #ddd"
      }}
    >
      <h4>{title}</h4>
      <h2>{value ?? 0}</h2>
    </div>
  );
}

function Badge({ label, type }) {
  let color = "#888";

  if (type === "priority") {
    if (label === "HIGH") color = "red";
    else if (label === "MEDIUM") color = "orange";
    else color = "gray";
  }

  if (type === "status") {
    if (label === "OPEN") color = "orange";
    else if (label === "IN_PROGRESS") color = "blue";
    else if (label === "RESOLVED") color = "green";
    else if (label === "REJECTED") color = "red";
  }

  return (
    <span
      style={{
        padding: "5px 10px",
        borderRadius: 5,
        backgroundColor: color,
        color: "#fff",
        marginRight: 10,
      }}
    >
      {label}
    </span>
  );
}

export default OfficeDashboard;
