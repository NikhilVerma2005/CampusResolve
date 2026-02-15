import { useState } from "react";
import StatsCards from "../components/StatsCards";
import TopIssues from "../components/TopIssues";
import CreateTicketModal from "../components/CreateTicketModal";

function StudentDashboard() {
  const [showModal, setShowModal] = useState(false);

  // ✅ Get user info from localStorage (set during login)
  const studentId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // ✅ Protect route
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
