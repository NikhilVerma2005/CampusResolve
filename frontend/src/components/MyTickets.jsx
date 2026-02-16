import { useEffect, useState } from "react";
import API from "../api";
import TimelineModal from "./TimelineModal";

function MyTickets({ studentId }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ascending, setAscending] = useState(false); // 🔥 sort state

  useEffect(() => {
    if (!studentId) return;

    API.get(`/users/${studentId}/tickets`)
      .then(res => setTickets(res.data || []))
      .catch(err => console.error(err));
  }, [studentId]);

  // 🔥 Sort tickets by due_at
  const sortedTickets = [...tickets].sort((a, b) => {
    const timeA = new Date(a.due_at).getTime();
    const timeB = new Date(b.due_at).getTime();
    return ascending ? timeA - timeB : timeB - timeA;
  });

  if (tickets.length === 0) {
    return <p style={{ marginTop: 20 }}>No tickets raised yet.</p>;
  }

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>My Tickets</h2>

        <button onClick={() => setAscending(!ascending)}>
          Sort by Time ({ascending ? "Ascending ↑" : "Descending ↓"})
        </button>
      </div>

      {sortedTickets.map(t => (
        <div
          key={t.ticket_id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 20,
            borderRadius: 10,
            background: "#fafafa"
          }}
        >
          <h3>{t.title}</h3>

          <p><strong>Description:</strong> {t.description}</p>
          <p><strong>Location:</strong> {t.location}</p>
          <p><strong>Status:</strong> {t.status}</p>
          <p><strong>Priority:</strong> {t.priority}</p>

          <p>
            <strong>Due:</strong>{" "}
            {new Date(t.due_at).toLocaleString()}
          </p>

          {t.status === "REJECTED" && t.rejection_reason && (
            <div
              style={{
                background: "#ffe6e6",
                border: "1px solid red",
                padding: 10,
                borderRadius: 6,
                marginTop: 10,
                color: "red"
              }}
            >
              <strong>Rejection Reason:</strong> {t.rejection_reason}
            </div>
          )}

          {t.is_overdue && (
            <p style={{ color: "red", marginTop: 10 }}>
              ⚠ This ticket is overdue
            </p>
          )}

          <div style={{ marginTop: 15 }}>
            <button onClick={() => setSelectedTicket(t.ticket_id)}>
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
