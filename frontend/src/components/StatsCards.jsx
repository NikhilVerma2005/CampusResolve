import { useEffect, useState } from "react";
import API from "../api";

function StatsCards({ studentId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchStats = async () => {
      try {
        const res = await API.get(`/users/${studentId}/stats`);
        setStats(res.data || {});
      } catch (err) {
        console.error("Student stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [studentId]);

  if (loading) return <p>Loading stats...</p>;

  if (!stats) return <p>No stats available.</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 20,
        marginTop: 20
      }}
    >
      <Card title="Total Reported" value={stats.total_reported} />
      <Card title="Open" value={stats.open} />
      <Card title="In Progress" value={stats.in_progress} />
      <Card title="Resolved" value={stats.resolved} />
      <Card title="Rejected" value={stats.rejected} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        background: "#f5f5f5",
        border: "1px solid #ddd"
      }}
    >
      <h4>{title}</h4>
      <h2>{value ?? 0}</h2>
    </div>
  );
}

export default StatsCards;
