import { useState } from "react";
import StatsCards from "../components/StatsCards";
import TopIssues from "../components/TopIssues";
import CreateTicketModal from "../components/CreateTicketModal";
import MyTickets from "../components/MyTickets";

function StudentDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showMyTickets, setShowMyTickets] = useState(false);

  const studentId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!studentId || role !== "STUDENT") {
    return <p>Unauthorized. Please login as Student.</p>;
  }

  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Student Dashboard</h1>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      <StatsCards studentId={studentId} />

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowModal(true)}>
          + Create New Ticket
        </button>{" "}
        <button onClick={() => setShowMyTickets(!showMyTickets)}>
          {showMyTickets ? "Hide My Tickets" : "View My Tickets"}
        </button>
      </div>

      {showMyTickets && (
        <MyTickets studentId={studentId} />
      )}

      <TopIssues />

      {showModal && (
        <CreateTicketModal
          studentId={studentId}
          close={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;
