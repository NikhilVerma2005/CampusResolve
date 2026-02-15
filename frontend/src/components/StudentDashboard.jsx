import { useState } from "react";
import StatsCards from "./StatsCards";
import TopIssues from "./TopIssues";
import CreateTicketModal from "./CreateTicketModal";

function StudentDashboard() {
  const [showModal, setShowModal] = useState(false);
  const studentId = 1; // temporary hardcoded

  return (
    <div style={{ padding: 30 }}>
      <h1>Student Dashboard</h1>

      <StatsCards studentId={studentId} />

      <button 
        onClick={() => setShowModal(true)}
        style={{ marginTop: 20 }}
      >
        + Create New Ticket
      </button>

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
