import { useState } from "react";
import API from "../api";
import StatsCards from "../components/StatsCards";
import TopIssues from "../components/TopIssues";
import CreateTicketModal from "../components/CreateTicketModal";
import MyTickets from "../components/MyTickets";
import "../App.css";

function StudentDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showMyComplaints, setShowMyComplaints] = useState(false);
  const [tickets, setTickets] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const studentId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!studentId || role !== "STUDENT") {
    return <p>Unauthorized. Please login as Student.</p>;
  }

  const fetchTickets = async () => {
    if (!studentId) return;

    setLoadingTickets(true);
    try {
      const res = await API.get(`/users/${studentId}/tickets`);
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">Student Portal</div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-wrapper">
        <StatsCards studentId={studentId} />

        <div className="section-card">
          <div className="action-buttons">
            <div>
              <div className="section-title">My Complaints</div>
              <p style={{ color: "#6b7280", marginTop: "-10px" }}>
                View and manage all your submitted complaints
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setShowModal(true)}
            >
              + Raise New Complaint
            </button>
          </div>

          <button
            className="secondary-btn"
            onClick={async () => {
              const newState = !showMyComplaints;
              setShowMyComplaints(newState);

              if (newState) {
                await fetchTickets();
              }
            }}
            style={{ marginBottom: 20 }}
          >
            {showMyComplaints ? "Hide Complaints" : "View My Complaints"}
          </button>

          {showMyComplaints && (
            <MyTickets
              tickets={tickets}
              loading={loadingTickets}
            />
          )}
        </div>

        <div className="section-card">
          <div className="section-title">Trending Campus Complaints</div>
          <TopIssues />
        </div>

        {showModal && (
          <CreateTicketModal
            studentId={studentId}
            close={() => setShowModal(false)}
            refreshTickets={fetchTickets}
          />
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;