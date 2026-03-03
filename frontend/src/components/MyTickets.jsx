import { useState } from "react";
import TimelineModal from "./TimelineModal";
import "../App.css";

function MyTickets({ tickets, loading }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ascending, setAscending] = useState(false);

  if (loading) {
    return <p style={{ marginTop: 20 }}>Loading complaints...</p>;
  }

  if (!tickets || tickets.length === 0) {
    return <p style={{ marginTop: 20 }}>No complaints raised yet.</p>;
  }

  const sortedTickets = [...tickets].sort((a, b) => {
    const timeA = new Date(a.due_at).getTime();
    const timeB = new Date(b.due_at).getTime();
    return ascending ? timeA - timeB : timeB - timeA;
  });

  return (
    <div style={{ marginTop: 30 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25
        }}
      >
        <h2 style={{ margin: 0 }}>My Complaints</h2>

        <button
          className="sort-btn"
          onClick={() => setAscending(!ascending)}
        >
          Sort by Time
          <span className="sort-arrow">
            {ascending ? "↑" : "↓"}
          </span>
        </button>
      </div>

      {sortedTickets.map((t) => (
        <div
          key={t.ticket_id}
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <h3 style={{ margin: 0 }}>{t.title}</h3>
          </div>

          <p style={{ marginTop: 14 }}>
            <strong>Description:</strong> {t.description}
          </p>

          <p>
            <strong>Location:</strong> {t.location}
          </p>

          <p>
            <strong>Due:</strong> {new Date(t.due_at).toLocaleString()}
          </p>

          <div style={{ marginTop: 18 }}>
            <button
              className="secondary-btn"
              onClick={() => setSelectedTicket(t.ticket_id)}
            >
              View Timeline
            </button>
          </div>
        </div>
      ))}

      {selectedTicket && (
        <TimelineModal
          ticketId={selectedTicket}
          close={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

export default MyTickets;